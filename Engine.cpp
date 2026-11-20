// Voice-mode MIDI adaptation.
#include "Engine.h"
#include <algorithm>
#include <cmath>

using tr909::Voice;
constexpr int kTrigReg[tr909::kVoices] = {9, 9, 9, 9, 9, 10, 10, 10, 10, 10};
constexpr int kTrigBit[tr909::kVoices] = {1, 2, 3, 4, 5, 1, 6, 2, 4, 5};

Engine::Engine()
{
    m_board.setCalibration(tr909::unitCalibration());
}
void Engine::prepare(double rate)
{
    m_board.prepare(rate);
    m_rate = rate;
    m_asleep = false;
    m_voiceTrig.fill(0);
    m_trigSamples = std::max(1, int(std::lround(0.002 * rate)));
}
void Engine::setRoms(const tr909::SampleRoms &roms)
{
    m_board.setSampleRoms(roms);
    prepare(m_rate);
}
void Engine::control(size_t index, double value)
{
    if (index >= parameters.size() || !std::isfinite(value))
        return;
    auto controls = m_board.controls();
    controls.*parameters[index].member = std::clamp(value, 0., 1.);
    m_board.setControls(controls);
}
void Engine::render(float *left, float *right, int frames)
{
    if (m_asleep) {
        std::fill_n(left, frames, 0.f);
        std::fill_n(right, frames, 0.f);
        return;
    }
    while (frames > 0) {
        int count = frames;
        for (const int remaining : m_voiceTrig)
            if (remaining > 0)
                count = std::min(count, remaining);
        m_board.render(left, right, count);
        for (int voice = 0; voice < tr909::kVoices; ++voice) {
            auto &remaining = m_voiceTrig[voice];
            if (remaining > 0 && (remaining -= count) == 0) {
                const int reg = kTrigReg[voice];
                m_board.write(reg, uint8_t(m_board.latch(reg) & ~(1u << kTrigBit[voice])));
            }
        }
        left += count;
        right += count;
        frames -= count;
    }
    m_asleep = m_board.asleep() && std::none_of(m_voiceTrig.begin(), m_voiceTrig.end(),
                                               [](int remaining) { return remaining > 0; });
}

int Engine::voiceOfNote(int note)
{
	switch (note) {
	case 35: case 36: return int(Voice::BD);
	case 38: case 40: return int(Voice::SD);
	case 41: case 43: return int(Voice::LT);
	case 45: case 47: return int(Voice::MT);
	case 48: case 50: return int(Voice::HT);
	case 37: return int(Voice::RS);
	case 39: return int(Voice::HC);
	case 42: case 44: case 46: return int(Voice::HH);
	case 49: return int(Voice::CR);
	case 51: return int(Voice::RD);
	default: return -1;
	}
}

void Engine::note(int note, int velocity)
{
	// The firmware's way with a MIDI note, without the firmware: the voice's accent DAC set from the
	// velocity, then its trigger high for one panel scan. The v4.0 firmware's velocity-to-code laws,
	// measured by playing it every velocity (tools/compare/real909.py, midi_code), every 8th velocity
	// and straight lines between: the analog voices' rises like its accent curve (velocity 50 gives
	// code 10, its sequencer's normal level, 80 gives 21, its accent), the hats' and cymbals' is
	// straight (code = velocity / 2).
	const int v = voiceOfNote(note);
	if (v < 0 || velocity <= 0 || velocity > 127)
		return;
	static constexpr int kDac[tr909::kVoices] = {1, 2, 3, 4, 5, 6, 6, 7, 8, 8};
	static constexpr int kAnalog[17] = {2, 3, 4, 5, 6, 8, 10, 12, 14, 17, 21, 27, 33, 41, 49, 57, 63};
	static constexpr int kSampled[17] = {1, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 63};
	const bool sampled = Voice(v) == Voice::HH || Voice(v) == Voice::CR || Voice(v) == Voice::RD;
	const int *law = sampled ? kSampled : kAnalog;
	const int k = std::min(15, velocity / 8);
	const double x0 = 8.0 * k, x1 = k == 15 ? 127.0 : 8.0 * (k + 1);
	const int code = std::clamp(int(std::lround(law[k] + (law[k + 1] - law[k]) * (velocity - x0) / (x1 - x0))), 0, 63);
	m_board.write(kDac[v], uint8_t(code << 1));
	if (Voice(v) == Voice::HH) // CLOSED/OPEN: high for the closed hat
		m_board.write(10, uint8_t((m_board.latch(10) & ~0x08) | (note == 46 ? 0 : 0x08)));
	m_board.write(kTrigReg[v], uint8_t(m_board.latch(kTrigReg[v]) | (1u << kTrigBit[v])));
	m_voiceTrig[size_t(v)] = m_trigSamples;
	m_asleep = false;
}

const std::array<Parameter, 27> parameters{{
    {"bd_tune", &tr909::Controls::bdTune},
    {"bd_level", &tr909::Controls::bdLevel},
    {"bd_attack", &tr909::Controls::bdAttack},
    {"bd_decay", &tr909::Controls::bdDecay},
    {"sd_tune", &tr909::Controls::sdTune},
    {"sd_level", &tr909::Controls::sdLevel},
    {"sd_tone", &tr909::Controls::sdTone},
    {"sd_snappy", &tr909::Controls::sdSnappy},
    {"lt_tune", &tr909::Controls::ltTune},
    {"lt_level", &tr909::Controls::ltLevel},
    {"lt_decay", &tr909::Controls::ltDecay},
    {"mt_tune", &tr909::Controls::mtTune},
    {"mt_level", &tr909::Controls::mtLevel},
    {"mt_decay", &tr909::Controls::mtDecay},
    {"ht_tune", &tr909::Controls::htTune},
    {"ht_level", &tr909::Controls::htLevel},
    {"ht_decay", &tr909::Controls::htDecay},
    {"rs_level", &tr909::Controls::rsLevel},
    {"hc_level", &tr909::Controls::hcLevel},
    {"hh_level", &tr909::Controls::hhLevel},
    {"ch_decay", &tr909::Controls::chDecay},
    {"oh_decay", &tr909::Controls::ohDecay},
    {"cr_level", &tr909::Controls::crLevel},
    {"cr_tune", &tr909::Controls::crTune},
    {"rd_level", &tr909::Controls::rdLevel},
    {"rd_tune", &tr909::Controls::rdTune},
    {"volume", &tr909::Controls::volume},
}};
