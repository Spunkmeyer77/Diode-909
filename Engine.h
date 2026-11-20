#pragma once
#include "tr909/core/voiceboard.h"
#include "tr909/core/parallel.h"

class Engine {
public:
    Engine();
    void prepare(double rate);
    void note(int note, int velocity);
    void control(size_t index, double value);
    void render(float *left, float *right, int frames);
    void setRoms(const tr909::SampleRoms &roms);
    void setParallel(tr909::Parallel *p) { m_board.setParallel(p); }
    void setEco(bool on) { m_board.setEco(on); }
private:
    static int voiceOfNote(int note);
    tr909::VoiceBoard m_board;
    std::array<int, tr909::kVoices> m_voiceTrig{};
    double m_rate = 48000.;
    int m_trigSamples = 96;
    bool m_asleep = false;
};

struct Parameter {
    const char *name;
    double tr909::Controls::*member;
};
extern const std::array<Parameter, 27> parameters;
