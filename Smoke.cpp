#include "Engine.h"
#include <array>
#include <cmath>
#include <iostream>

int main()
{
    Engine engine;
    for (const int rate : {44100, 48000}) {
        for (const int note : {36, 38, 43, 47, 50, 37, 39}) {
            engine.prepare(rate);
            engine.note(note, 100);
            double energy = 0;
            for (int block = 0; block < 32; ++block) {
                std::array<float, 64> left{}, right{};
                engine.render(left.data(), right.data(), int(left.size()));
                for (size_t i = 0; i < left.size(); ++i) {
                    if (!std::isfinite(left[i]) || !std::isfinite(right[i]))
                        return 1;
                    energy += left[i] * left[i] + right[i] * right[i];
                }
            }
            if (energy < 1e-5) {
                std::cerr << "Silent response at " << rate << " Hz for note " << note << '\n';
                return 1;
            }
        }
    }
}
