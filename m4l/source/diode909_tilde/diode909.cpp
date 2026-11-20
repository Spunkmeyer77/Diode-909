// diode909~ - the DIODE 909 circuit engine as a Max/MSP external.
// 11 signal trigger inlets (BD SD LT MT HT RS CP CH OH CR RD), sample accurate: a rising edge from 0
// plays the voice, value 0.5 normal / 1 accent, +4 a flam (grace note now, main hit FLAM ms later).
// Two signal outlets: the 909's stereo master mix. Sample ROMs are compiled in (roms.inc).
// Transistor Labs - ticcoross@gmail.com - https://ticcoross.gumroad.com/
#if defined(_WIN32) && !defined(NOMINMAX)
#define NOMINMAX
#endif
#include "ext.h"
#include "ext_obex.h"
#include "z_dsp.h"
#ifdef min
#undef min
#endif
#ifdef max
#undef max
#endif
#include "Engine.h"

#include <algorithm>
#include <array>
#include <atomic>
#include <cmath>
#include <chrono>
#include <cstdint>
#include <exception>
#include <memory>
#include <mutex>
#include <thread>
#include <vector>
#if defined(_WIN32)
#include <windows.h>
#elif defined(__APPLE__)
#include <mach/mach.h>
#include <mach/mach_time.h>
#include <mach/thread_policy.h>
#include <pthread.h>
#endif
#if defined(__x86_64__) || defined(_M_X64)
#include <xmmintrin.h>
#endif

#include "roms.inc"

namespace {

constexpr const char* kVersion = "1.2.6";
constexpr int kInputs = 11;
// inlet -> MIDI note understood by Engine::note
constexpr int kNote[kInputs] = {36, 38, 43, 47, 50, 37, 39, 42, 46, 49, 51};

struct NoDenormals {
#if defined(__aarch64__)
    uint64_t saved;
    NoDenormals() {
        asm volatile("mrs %0, fpcr" : "=r"(saved));
        asm volatile("msr fpcr, %0" : : "r"(saved | (uint64_t(1) << 24)));
    }
    ~NoDenormals() { asm volatile("msr fpcr, %0" : : "r"(saved)); }
#elif defined(__x86_64__) || defined(_M_X64)
    unsigned saved;
    NoDenormals() : saved(_mm_getcsr()) { _mm_setcsr(saved | 0x8040); }
    ~NoDenormals() { _mm_setcsr(saved); }
#endif
};

void workerStart(int) {
#if defined(__aarch64__)
    uint64_t r;
    asm volatile("mrs %0, fpcr" : "=r"(r));
    asm volatile("msr fpcr, %0" : : "r"(r | (uint64_t(1) << 24)));
#elif defined(__x86_64__) || defined(_M_X64)
    _mm_setcsr(_mm_getcsr() | 0x8040);
#endif
#if defined(_WIN32)
    SetThreadPriority(GetCurrentThread(), THREAD_PRIORITY_TIME_CRITICAL);
#elif defined(__APPLE__)
    mach_timebase_info_data_t tb;
    mach_timebase_info(&tb);
    const double msToAbs = 1e6 * double(tb.denom) / double(tb.numer);
    thread_time_constraint_policy_data_t policy;
    policy.period = uint32_t(2.9 * msToAbs);
    policy.computation = uint32_t(1.0 * msToAbs);
    policy.constraint = uint32_t(2.9 * msToAbs);
    policy.preemptible = 1;
    thread_policy_set(pthread_mach_thread_np(pthread_self()), THREAD_TIME_CONSTRAINT_POLICY,
                      reinterpret_cast<thread_policy_t>(&policy), THREAD_TIME_CONSTRAINT_POLICY_COUNT);
#endif
}

// Helper threads besides Live's audio thread. A voice always renders on one thread, and the 909's
// snare and toms are heavy (each up to about half a core on an M1), so on 8-core Macs (M1: four
// performance cores) three helpers let four heavy voices render at once.
int workerCount() {
    const unsigned cores = std::thread::hardware_concurrency();
    return cores >= 8 ? 3 : cores >= 4 ? 2 : (cores >= 2 ? 1 : 0);
}

// Render-ahead: Max for Live calls perform every 64 samples (1.45 ms), and a voice's attack can take
// longer than that to compute (the solver works hardest on the edge). A render thread works kAhead
// samples behind the input; perform only queues the triggers and copies finished audio, so an
// attack has kAhead samples (11.6 ms at 44.1 kHz) to finish. The device reports kAhead samples of
// latency (patcher "latency"), and Live delays the other tracks to match.
constexpr int64_t kAhead = 512;
constexpr int64_t kRing = 1 << 15;
constexpr uint32_t kQueue = 4096;
struct Hit { int64_t at; int input; bool accent; };

struct State {
    std::unique_ptr<tr909::Parallel> parallel = std::make_unique<tr909::Parallel>(workerCount(), workerStart);
    Engine engine;
    std::mutex mutex; // the engine: the render thread, and QUALITY's rebuild
    std::array<std::atomic<float>, parameters.size()> values;
    std::array<float, parameters.size()> applied{};
    std::atomic<float> flam{0.4f};    // 0..1 = 5..40 ms
    std::atomic<float> accent{0.5f};  // ACCENT knob: the accented hit's velocity
    std::atomic<bool> eco{false};     // QUALITY ECO: no 2x oversampling
    double rate = 44100;
    bool prepared = false;
    // audio thread
    double last[kInputs] = {};
    // audio thread -> render thread
    std::atomic<int64_t> inPos{0};    // input samples received
    std::array<Hit, kQueue> queue{};
    std::atomic<uint32_t> qHead{0}, qTail{0};
    // render thread -> audio thread
    std::atomic<int64_t> outPos{0};   // samples rendered
    std::vector<float> ringL = std::vector<float>(size_t(kRing)), ringR = std::vector<float>(size_t(kRing));
    // render thread
    std::thread renderer;
    std::atomic<bool> running{false};
    std::vector<Hit> pending;
    std::vector<float> tmpL = std::vector<float>(256), tmpR = std::vector<float>(256);
    std::atomic<long> underruns{0};

    State() {
        engine.setParallel(parallel->workers() > 0 ? parallel.get() : nullptr);
        engine.setRoms({kRomHihat, kRomCrash, kRomRide});
        const tr909::Controls defaults{};
        for (size_t i = 0; i < parameters.size(); ++i) {
            values[i].store(float(defaults.*parameters[i].member), std::memory_order_relaxed);
            applied[i] = -1.f; // pushed on the first block
        }
        pending.reserve(kQueue);
    }
    ~State() { stop(); }
    void push(int64_t at, int input, bool accent) { // audio thread
        const uint32_t h = qHead.load(std::memory_order_relaxed);
        if (h - qTail.load(std::memory_order_acquire) >= kQueue) return; // full: drop
        queue[h % kQueue] = {at, input, accent};
        qHead.store(h + 1, std::memory_order_release);
    }
    void stop() {
        running.store(false);
        if (renderer.joinable()) renderer.join();
    }
    void start();
    void renderLoop();
};

int velocityOf(const State& s, bool accent);

void State::start() {
    running.store(true);
    renderer = std::thread([this] { workerStart(0); renderLoop(); });
}

void State::renderLoop() {
    while (running.load(std::memory_order_relaxed)) {
        // take the queued hits, kept in time order
        uint32_t t = qTail.load(std::memory_order_relaxed);
        const uint32_t h = qHead.load(std::memory_order_acquire);
        for (; t != h; ++t) {
            const Hit hit = queue[t % kQueue];
            auto at = std::upper_bound(pending.begin(), pending.end(), hit.at, [](int64_t v, const Hit& e) { return v < e.at; });
            pending.insert(at, hit);
        }
        qTail.store(t, std::memory_order_release);
        int64_t o = outPos.load(std::memory_order_relaxed);
        const int64_t avail = inPos.load(std::memory_order_acquire);
        if (o >= avail) { std::this_thread::sleep_for(std::chrono::microseconds(150)); continue; }
        const NoDenormals guard;
        std::lock_guard<std::mutex> lock(mutex);
        for (size_t i = 0; i < parameters.size(); ++i) {
            const float v = values[i].load(std::memory_order_relaxed);
            if (v != applied[i]) { engine.control(i, v); applied[i] = v; }
        }
        const int64_t end = std::min(avail, o + 64);
        size_t fired = 0;
        while (o < end) {
            while (fired < pending.size() && pending[fired].at <= o) {
                engine.note(kNote[pending[fired].input], velocityOf(*this, pending[fired].accent));
                ++fired;
            }
            int64_t next = end;
            if (fired < pending.size()) next = std::min(next, pending[fired].at);
            next = std::max(next, o + 1);
            const int n = int(next - o);
            engine.render(tmpL.data(), tmpR.data(), n);
            for (int i = 0; i < n; ++i) { ringL[size_t((o + i) & (kRing - 1))] = tmpL[size_t(i)]; ringR[size_t((o + i) & (kRing - 1))] = tmpR[size_t(i)]; }
            o = next;
            outPos.store(o, std::memory_order_release);
        }
        pending.erase(pending.begin(), pending.begin() + long(fired));
    }
}

struct External {
    t_pxobject object;
    State* state;
};
t_class* externalClass = nullptr;

void control(External* x, t_symbol*, long count, t_atom* atoms) {
    if (count != 2 || atom_gettype(atoms) != A_SYM) return;
    const t_symbol* name = atom_getsym(atoms);
    const double value = atom_getfloat(atoms + 1);
    if (!std::isfinite(value)) return;
    if (name == gensym("accent")) { x->state->accent.store(float(std::clamp(value, 0.0, 1.0))); return; }
    if (name == gensym("eco")) { // QUALITY HQ/ECO: rebuilds the board (a short gap in the sound)
        State& s = *x->state;
        const bool on = value >= 0.5;
        if (s.eco.exchange(on) == on) return;
        try {
            std::lock_guard<std::mutex> lock(s.mutex);
            s.engine.setEco(on);
            if (s.prepared) {
                s.engine.prepare(s.rate);
                for (auto& a : s.applied) a = -1.f;
            }
        } catch (const std::exception& e) {
            object_error(reinterpret_cast<t_object*>(x), "Could not switch QUALITY: %s", e.what());
        }
        return;
    }
    for (size_t i = 0; i < parameters.size(); ++i)
        if (name == gensym(parameters[i].name)) {
            x->state->values[i].store(float(std::clamp(value, 0.0, 1.0)), std::memory_order_relaxed);
            return;
        }
}

void setFlam(External* x, double value) {
    if (std::isfinite(value)) x->state->flam.store(float(std::clamp(value, 0.0, 1.0)), std::memory_order_relaxed);
}

// velocities as the 909's own sequencer plays: normal = code 10 (velocity 50); accent from the
// ACCENT knob, 0.5 = code 21 (velocity 80), up to velocity 127
int velocityOf(const State& s, bool accent) {
    if (!accent) return 50;
    return std::clamp(int(std::lround(50 + 60 * s.accent.load(std::memory_order_relaxed) +
                                      std::max(0.f, s.accent.load(std::memory_order_relaxed) - 0.5f) * 34)), 51, 127);
}

void perform(External* x, t_object*, double** ins, long, double** outs, long, long frames, long, void*) {
    State& s = *x->state;
    if (!s.running.load(std::memory_order_relaxed)) {
        std::fill_n(outs[0], frames, 0.0);
        std::fill_n(outs[1], frames, 0.0);
        return;
    }
    // queue this block's triggers at their exact input sample
    const int64_t base = s.inPos.load(std::memory_order_relaxed);
    const int64_t flamSamples = std::max<int64_t>(1, std::llround((5.0 + 35.0 * s.flam.load(std::memory_order_relaxed)) * 0.001 * s.rate));
    for (int v = 0; v < kInputs; ++v) {
        const double* in = ins[v];
        double prev = s.last[v];
        for (long i = 0; i < frames; ++i) {
            const double t = in[i];
            if (t != 0 && prev == 0) {
                const bool flam = t >= 3.0;
                const bool accent = (flam ? t - 4.0 : t) >= 0.75;
                if (flam) { s.push(base + i, v, false); s.push(base + i + flamSamples, v, accent); }
                else s.push(base + i, v, accent);
            }
            prev = t;
        }
        s.last[v] = prev;
    }
    s.inPos.store(base + frames, std::memory_order_release);
    // play what the render thread finished, kAhead samples behind
    const int64_t ready = s.outPos.load(std::memory_order_acquire);
    const int64_t from = base - kAhead;
    bool late = false;
    for (long i = 0; i < frames; ++i) {
        const int64_t k = from + i;
        if (k < 0 || k >= ready) { outs[0][i] = 0; outs[1][i] = 0; late = late || k >= 0; continue; }
        outs[0][i] = s.ringL[size_t(k & (kRing - 1))];
        outs[1][i] = s.ringR[size_t(k & (kRing - 1))];
    }
    if (late) s.underruns.fetch_add(1, std::memory_order_relaxed);
}

void dsp64(External* x, t_object* chain, short*, double rate, long, long) {
    State& s = *x->state;
    s.stop();
    try {
        std::lock_guard<std::mutex> lock(s.mutex);
        const bool rateChanged = !s.prepared || rate != s.rate;
        s.rate = rate;
        if (rateChanged) s.engine.prepare(rate);
        for (auto& a : s.applied) a = -1.f;
        for (double& v : s.last) v = 0;
        s.inPos.store(0); s.outPos.store(0);
        s.qTail.store(s.qHead.load());
        s.pending.clear();
        s.prepared = true;
    } catch (const std::exception& e) {
        object_error(reinterpret_cast<t_object*>(x), "DSP initialization failed: %s", e.what());
        return;
    }
    s.start();
    dsp_add64(chain, reinterpret_cast<t_object*>(x), reinterpret_cast<t_perfroutine64>(perform), 0, nullptr);
}

void assist(External*, void*, long io, long index, char* text) {
    static const char* names[kInputs] = {"BD", "SD", "LT", "MT", "HT", "RS", "CP", "CH", "OH", "CR", "RD"};
    if (io == ASSIST_INLET)
        snprintf(text, 256, index == 0 ? "(signal) BD trigger; control <name> <0..1>, flam <0..1>" : "(signal) %s trigger",
                 names[std::clamp<long>(index, 0, kInputs - 1)]);
    else
        snprintf(text, 256, index == 0 ? "(signal) Left" : "(signal) Right");
}

void destroy(External* x) {
    dsp_free(&x->object);
    if (x->state) x->state->stop();
    delete x->state;
}

void* create(t_symbol*, long, t_atom*) {
    auto* x = static_cast<External*>(object_alloc(externalClass));
    if (!x) return nullptr;
    x->state = nullptr;
    dsp_setup(&x->object, kInputs);
    try {
        x->state = new State;
    } catch (const std::exception& e) {
        object_error(reinterpret_cast<t_object*>(x), "Could not start the voice board: %s", e.what());
        object_free(x);
        return nullptr;
    }
    outlet_new(x, "signal");
    outlet_new(x, "signal");
    return x;
}

} // namespace

extern "C" C74_EXPORT void ext_main(void*) {
    t_class* c = class_new("diode909~", reinterpret_cast<method>(create), reinterpret_cast<method>(destroy),
                           sizeof(External), nullptr, A_GIMME, 0);
    class_addmethod(c, reinterpret_cast<method>(dsp64), "dsp64", A_CANT, 0);
    class_addmethod(c, reinterpret_cast<method>(control), "control", A_GIMME, 0);
    class_addmethod(c, reinterpret_cast<method>(setFlam), "flam", A_FLOAT, 0);
    class_addmethod(c, reinterpret_cast<method>(assist), "assist", A_CANT, 0);
    class_dspinit(c);
    class_register(CLASS_BOX, c);
    externalClass = c;
    post("diode909~ %s - DIODE 909 circuit engine - Transistor Labs", kVersion);
}
