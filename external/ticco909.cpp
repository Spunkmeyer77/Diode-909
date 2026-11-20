#include "ext.h"
#include "ext_obex.h"
#include "ext_path.h"
#include "z_dsp.h"
#include "Engine.h"

#include <algorithm>
#include <atomic>
#include <cmath>
#include <limits>
#include <fstream>
#include <memory>
#include <mutex>

namespace {
using Rom = std::array<uint8_t, 32768>;

constexpr double noControl = std::numeric_limits<double>::quiet_NaN();

struct State {
    State()
    {
        for (auto &value : pendingControls)
            value.store(noControl, std::memory_order_relaxed);
        for (auto &velocity : pendingNotes)
            velocity.store(0, std::memory_order_relaxed);
    }
    Engine engine;
    std::mutex mutex;
    std::array<std::unique_ptr<Rom>, 3> roms;
    std::array<std::atomic<int>, 128> pendingNotes;
    std::array<std::atomic<double>, 27> pendingControls;
    std::array<float, 256> left{}, right{};
};

struct External {
    t_pxobject object;
    State *state;
};
t_class *externalClass = nullptr;

void destroy(External *x)
{
    dsp_free(&x->object);
    delete x->state;
}

void *create()
{
    auto *x = reinterpret_cast<External *>(object_alloc(externalClass));
    if (!x)
        return nullptr;
    x->state = nullptr;
    dsp_setup(&x->object, 0);
    try {
        x->state = new State;
    } catch (const std::exception &error) {
        object_error(reinterpret_cast<t_object *>(x), "Could not initialize voice board: %s", error.what());
        object_free(x);
        return nullptr;
    }
    outlet_new(x, "signal");
    outlet_new(x, "signal");
    return x;
}

void note(External *x, t_atom_long pitch, t_atom_long velocity)
{
    if (pitch < 0 || pitch > 127 || velocity <= 0 || velocity > 127)
        return;
    x->state->pendingNotes[pitch].store(int(velocity), std::memory_order_relaxed);
}

void control(External *x, t_symbol *name, double value)
{
    const auto parameter = std::find_if(parameters.begin(), parameters.end(), [name](const Parameter &p) {
        return gensym(p.name) == name;
    });
    if (parameter == parameters.end() || !std::isfinite(value))
        return;
    x->state->pendingControls[size_t(parameter - parameters.begin())].store(value, std::memory_order_relaxed);
}

uint32_t crc32(const Rom &rom)
{
    uint32_t crc = 0xffffffff;
    for (const auto byte : rom) {
        crc ^= byte;
        for (int bit = 0; bit < 8; ++bit)
            crc = (crc >> 1) ^ (0xedb88320u & (0u - (crc & 1u)));
    }
    return ~crc;
}

void loadRom(External *x, t_symbol *path, short, t_atom *)
{
    auto *object = reinterpret_cast<t_object *>(x);
    try {
        char native[MAX_PATH_CHARS]{};
        if (path_nameconform(path->s_name, native, PATH_STYLE_NATIVE, PATH_TYPE_ABSOLUTE)) {
            object_error(object, "Use an absolute path to an extracted ROM file.");
            return;
        }
        std::ifstream stream(native, std::ios::binary);
        auto rom = std::make_unique<Rom>();
        if (!stream.read(reinterpret_cast<char *>(rom->data()), rom->size()) ||
            stream.peek() != std::ifstream::traits_type::eof()) {
            object_error(object, "Expected a readable 32768-byte TR-909 sample ROM.");
            return;
        }
        constexpr std::array<uint32_t, 3> expected{0x2aaae11b, 0xdc61cf1a, 0x01a9b435};
        constexpr const char *names[]{"Hi-hat", "Crash", "Ride"};
        const auto crc = crc32(*rom);
        const auto match = std::find(expected.begin(), expected.end(), crc);
        if (match == expected.end()) {
            object_error(object, "Unrecognized TR-909 sample ROM checksum.");
            return;
        }
        const auto slot = size_t(match - expected.begin());
        auto &state = *x->state;
        {
            std::lock_guard<std::mutex> lock(state.mutex);
            tr909::SampleRoms roms{};
            const auto get = [&](size_t i) -> const uint8_t * {
                if (i == slot)
                    return rom->data();
                return state.roms[i] ? state.roms[i]->data() : nullptr;
            };
            roms = {get(0), get(1), get(2)};
            state.engine.setRoms(roms);
            state.roms[slot] = std::move(rom);
        }
        object_post(object, "%s ROM loaded", names[slot]);
    } catch (const std::exception &error) {
        object_error(object, "ROM load failed: %s", error.what());
    }
}

void rom(External *x, t_symbol *path)
{
    defer_low(x, reinterpret_cast<method>(loadRom), path, 0, nullptr);
}

void perform(External *x, t_object *, double **, long, double **out, long,
             long frames, long, void *)
{
    auto &state = *x->state;
    std::unique_lock<std::mutex> lock(state.mutex, std::try_to_lock);
    if (!lock.owns_lock()) {
        std::fill_n(out[0], frames, 0.);
        std::fill_n(out[1], frames, 0.);
        return;
    }
    for (size_t i = 0; i < state.pendingControls.size(); ++i) {
        auto &pending = state.pendingControls[i];
        if (std::isfinite(pending.load(std::memory_order_relaxed)))
            state.engine.control(i, pending.exchange(noControl, std::memory_order_relaxed));
    }
    for (size_t pitch = 0; pitch < state.pendingNotes.size(); ++pitch) {
        auto &pending = state.pendingNotes[pitch];
        if (pending.load(std::memory_order_relaxed))
            state.engine.note(int(pitch), pending.exchange(0, std::memory_order_relaxed));
    }
    for (long offset = 0; offset < frames;) {
        const int count = int(std::min<long>(frames - offset, state.left.size()));
        state.engine.render(state.left.data(), state.right.data(), count);
        std::copy_n(state.left.data(), count, out[0] + offset);
        std::copy_n(state.right.data(), count, out[1] + offset);
        offset += count;
    }
}

void dsp(External *x, t_object *chain, short *, double rate, long, long)
{
    try {
        std::lock_guard<std::mutex> lock(x->state->mutex);
        x->state->engine.prepare(rate);
        for (auto &velocity : x->state->pendingNotes)
            velocity.store(0, std::memory_order_relaxed);
    } catch (const std::exception &error) {
        object_error(reinterpret_cast<t_object *>(x), "DSP initialization failed: %s", error.what());
        return;
    }
    object_method(chain, gensym("dsp_add64"), x, perform, 0, nullptr);
}
} // namespace

extern "C" void ext_main(void *)
{
    auto *c = class_new("ticco909~", reinterpret_cast<method>(create),
                        reinterpret_cast<method>(destroy), sizeof(External), nullptr, 0);
    class_addmethod(c, reinterpret_cast<method>(dsp), "dsp64", A_CANT, 0);
    class_addmethod(c, reinterpret_cast<method>(note), "note", A_LONG, A_LONG, 0);
    class_addmethod(c, reinterpret_cast<method>(control), "control", A_SYM, A_FLOAT, 0);
    class_addmethod(c, reinterpret_cast<method>(rom), "rom", A_SYM, 0);
    class_dspinit(c);
    class_register(CLASS_BOX, c);
    externalClass = c;
}
