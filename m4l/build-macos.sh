#!/bin/bash
# builds diode909~.mxo (universal arm64 + x86_64, macOS 11+). Needs the decrypted ROMs in ../roms.
set -euo pipefail
cd "$(dirname "$0")"
sdk="$PWD/build/max-sdk-base"
if [[ ! -d "$sdk/.git" ]]; then mkdir -p build; git clone https://github.com/Cycling74/max-sdk-base.git "$sdk"; fi
git -C "$sdk" checkout --detach c03a2922a2a8ff149165a1e2ea134e9321d6e202
cmake -S . -B build/macos -DCMAKE_BUILD_TYPE=Release -DCMAKE_OSX_DEPLOYMENT_TARGET=11.0 -DMAX_SDK_BASE="$sdk"
cmake --build build/macos --config Release --target diode909_tilde --parallel
echo "External built at build/macos/externals/diode909~.mxo"
