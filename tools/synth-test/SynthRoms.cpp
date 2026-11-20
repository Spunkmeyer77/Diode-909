// DIODE 909 model test: synthesized hi-hat / crash / ride "ROM" tables (no Roland data),
// played through the ticco909 engine's own ROM playback, D/As, VCAs and filters.
#include "Engine.h"
#include <array>
#include <cmath>
#include <cstdint>
#include <cstdio>
#include <random>
#include <string>
#include <vector>
#include <algorithm>

using Rom = std::array<uint8_t, 32768>;
constexpr double kPi = 3.14159265358979323846;

// 2-pole state-variable filter (TPT form: stable up to Nyquist)
struct Svf {
    double g, k, a1, a2, a3, ic1 = 0, ic2 = 0, lp = 0, bp = 0;
    Svf(double fc, double rate, double res) {
        g = std::tan(kPi * std::min(fc, 0.45 * rate) / rate); k = 1.0 / res;
        a1 = 1 / (1 + g * (g + k)); a2 = g * a1; a3 = g * a2;
    }
    double step(double x) {
        const double v3 = x - ic2, v1 = a1 * ic1 + a2 * v3, v2 = ic2 + a2 * ic1 + a3 * v3;
        ic1 = 2 * v1 - ic1; ic2 = 2 * v2 - ic2; bp = v1; lp = v2; return x - k * v1 - v2;
    }
    double hp(double x) { return step(x); }
    double band(double x) { step(x); return bp; }
};

struct Metal {
    std::vector<double> freq, phase;
    double tick(double rate) { // sum of square waves at inharmonic ratios (metal ring)
        double s = 0;
        for (size_t i = 0; i < freq.size(); ++i) {
            phase[i] += freq[i] / rate; phase[i] -= std::floor(phase[i]);
            s += phase[i] < 0.5 ? 1.0 : -1.0;
        }
        return s / double(freq.size());
    }
};

// write samples [from, from+n) as 6-bit codes (byte = code << 2, silence 0x80), peak-normalized
void quantize(Rom &rom, size_t from, const std::vector<double> &x, std::mt19937 &rng)
{
    // loudness by RMS of the first 4096 samples (spikes clip, like a 6-bit chip)
    double e = 1e-12; size_t m = std::min<size_t>(4096, x.size());
    for (size_t i = 0; i < m; ++i) e += x[i] * x[i];
    const double peak = std::sqrt(e / m) * 31.0 / 12.0;
    std::uniform_real_distribution<double> d(-0.5, 0.5);
    for (size_t i = 0; i < x.size(); ++i) {
        const int code = std::clamp(int(std::lround(32 + 31 * x[i] / peak + d(rng) * 0.6)), 0, 63);
        rom[from + i] = uint8_t(code << 2);
    }
}

std::vector<double> render(size_t n, double rate, std::vector<double> freqs, double hpHz, double bpHz,
                           double noiseMix, double tau, double attack, std::mt19937 &rng, double tone2 = 0)
{
    Metal a{freqs, std::vector<double>(freqs.size(), 0)};
    std::vector<double> f2; for (double f : freqs) f2.push_back(f * 1.4142);
    Metal b{f2, std::vector<double>(f2.size(), 0.25)};
    Svf h1(hpHz, rate, 0.7), h2(hpHz, rate, 0.7), band(bpHz, rate, 1.2);
    std::normal_distribution<double> nd(0, 0.5);
    std::vector<double> out(n);
    for (size_t i = 0; i < n; ++i) {
        const double t = i / rate;
        double m = a.tick(rate) * (1 - tone2) + a.tick(0 + rate) * 0 + b.tick(rate) * tone2;
        m = m * (1 - noiseMix) + nd(rng) * noiseMix;
        double y = h2.hp(h1.hp(m));
        y = 0.65 * y + 0.35 * band.band(y);
        const double env = std::exp(-t / tau) * (attack > 0 ? std::min(1.0, t / attack) : 1.0);
        out[i] = y * env;
    }
    return out;
}

Rom hihatRom(std::mt19937 &rng)
{
    Rom rom; rom.fill(0x80);
    const double rate = 31571; // the hat's sample clock
    const std::vector<double> hf{263, 400, 421, 474, 587, 845}; // inharmonic set, scaled up below
    std::vector<double> f; for (double x : hf) f.push_back(x * 6.1);
    // open hat: 0000-5FFF (fades to silence by the end)
    auto open = render(0x6000, rate, f, 6500, 9500, 0.30, 1.6, 0.0004, rng);
    for (size_t i = 0x5000; i < 0x6000; ++i) open[i] *= double(0x6000 - i) / 0x1000;
    quantize(rom, 0, open, rng);
    // closed hat: 6000-7FFF, first 65 samples stay 0x80 (the engine's closed-region lead)
    auto closed = render(0x2000 - 65, rate, f, 7200, 10000, 0.35, 0.9, 0.0002, rng);
    quantize(rom, 0x6000 + 65, closed, rng);
        return rom;
}

Rom cymbalRom(std::mt19937 &rng, bool ride)
{
    Rom rom; rom.fill(0x80);
    const double rate = 31250;
    std::vector<double> f;
    if (ride) f = {3125, 3970, 4420, 5310, 6640, 7360, 8210, 9480};
    else      f = {2470, 2930, 3510, 3810, 4460, 5190, 5730, 6270, 7090, 7930, 8640, 9910};
    auto x = render(0x8000, rate, f, ride ? 3200 : 2600, ride ? 6500 : 5200, ride ? 0.18 : 0.42,
                    ride ? 0.42 : 0.34, 0.0008, rng, ride ? 0.25 : 0.4);
    for (size_t i = 0x7000; i < 0x8000; ++i) x[i] *= double(0x8000 - i) / 0x1000;
    quantize(rom, 0, x, rng);
    return rom;
}

void writeWav(const std::string &path, const std::vector<float> &l, const std::vector<float> &r, int rate)
{
    FILE *f = std::fopen(path.c_str(), "wb");
    const uint32_t n = uint32_t(l.size()), data = n * 4;
    auto u32 = [&](uint32_t v) { std::fwrite(&v, 4, 1, f); };
    auto u16 = [&](uint16_t v) { std::fwrite(&v, 2, 1, f); };
    std::fwrite("RIFF", 1, 4, f); u32(36 + data); std::fwrite("WAVEfmt ", 1, 8, f);
    u32(16); u16(1); u16(2); u32(rate); u32(rate * 4); u16(4); u16(16);
    std::fwrite("data", 1, 4, f); u32(data);
    float peak = 1e-6f; for (size_t i = 0; i < n; ++i) peak = std::max({peak, std::fabs(l[i]), std::fabs(r[i])});
    const float g = 0.89f / peak;
    for (size_t i = 0; i < n; ++i) { u16(uint16_t(int16_t(l[i] * g * 32767))); u16(uint16_t(int16_t(r[i] * g * 32767))); }
    std::fclose(f);
}

struct Hit { double t; int note, vel; };

void renderSeq(Engine &e, int rate, double seconds, const std::vector<Hit> &hits, const std::string &path)
{
    e.prepare(rate);
    std::array<float, 64> wl{}, wr{};
    for (int i = 0; i < rate * 3 / 64; ++i) e.render(wl.data(), wr.data(), 64); // warm-up: power-on mute, DC settle
    std::vector<float> L, R;
    const size_t total = size_t(seconds * rate);
    size_t pos = 0, h = 0;
    std::array<float, 64> l{}, r{};
    while (pos < total) {
        while (h < hits.size() && size_t(hits[h].t * rate) <= pos) { e.note(hits[h].note, hits[h].vel); ++h; }
        e.render(l.data(), r.data(), 64);
        L.insert(L.end(), l.begin(), l.end()); R.insert(R.end(), r.begin(), r.end());
        pos += 64;
    }
    writeWav(path, L, R, rate);
    std::printf("wrote %s\n", path.c_str());
}

int realMain(int argc, char **argv)
{
    std::setvbuf(stdout, nullptr, _IONBF, 0);
    const std::string out = argc > 1 ? argv[1] : ".";
    std::mt19937 rng(909);
    static Rom hh = hihatRom(rng), cr = cymbalRom(rng, false), rd = cymbalRom(rng, true);
    Engine e;
    e.setRoms({hh.data(), cr.data(), rd.data()});
    const int rate = 48000;
    for (int i = 0; i < 27; ++i) e.control(size_t(i), 0.5); // middle knobs
    e.control(26, 0.8);                                     // volume
    renderSeq(e, rate, 1.0, {{0.02, 42, 100}}, out + "/01 closed hat.wav");
    renderSeq(e, rate, 1.4, {{0.02, 46, 100}}, out + "/02 open hat.wav");
    renderSeq(e, rate, 2.2, {{0.02, 49, 100}}, out + "/03 crash.wav");
    renderSeq(e, rate, 2.2, {{0.02, 51, 100}}, out + "/04 ride.wav");
    // groove: 130 BPM, 2 bars, 16ths
    const double st = 60.0 / 130 / 4;
    std::vector<Hit> g;
    for (int bar = 0; bar < 4; ++bar)
        for (int s = 0; s < 16; ++s) {
            const double t = 0.02 + (bar * 16 + s) * st;
            if (s % 4 == 0) g.push_back({t, 36, s == 0 ? 120 : 100});
            if (s == 4 || s == 12) g.push_back({t, 39, 100});
            if (s % 4 == 2) g.push_back({t, 46, 100});
            else if (bar >= 2 && s % 2 == 1) g.push_back({t, 42, s % 4 == 3 ? 70 : 100});
            if (bar == 1 && s % 4 == 0) g.push_back({t, 51, 90});
            if (bar == 2 && s == 0) g.push_back({t, 49, 120});
        }
    std::sort(g.begin(), g.end(), [](const Hit &a, const Hit &b) { return a.t < b.t; });
    renderSeq(e, rate, 4 * 16 * st + 1.5, g, out + "/05 groove 130bpm.wav");
    return 0;
}

#ifndef OHTEST
int main(int argc, char **argv) { return realMain(argc, argv); }
#endif
