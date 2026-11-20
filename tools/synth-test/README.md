# Synthesized hats / cymbals — model test 0.1

Builds 6-bit sample tables for the hi-hat (open 0000-5FFF, closed 6000-7FFF), crash and ride from
detuned square-wave oscillators + noise (no Roland ROM data), loads them into the engine in place of
the ROMs and renders test WAVs through the modelled counters, D/As, VCAs and filters.

```sh
cmake -S . -B build-test -DBUILD_MAX_EXTERNAL=OFF -DCMAKE_BUILD_TYPE=Release
cmake --build build-test --parallel
g++ -O2 -std=c++17 -I. -Imachines tools/synth-test/SynthRoms.cpp build-test/libengine.a -lpthread -o synthroms
./synthroms out
```
