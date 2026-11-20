@echo off
rem builds diode909~.mxe64 (x64). Needs the decrypted ROMs in ..\roms.
setlocal
cd /d "%~dp0"
if not exist build\max-sdk-base\.git git clone https://github.com/Cycling74/max-sdk-base.git build\max-sdk-base || exit /b 1
git -C build\max-sdk-base checkout --detach c03a2922a2a8ff149165a1e2ea134e9321d6e202 || exit /b 1
cmake -S . -B build\windows -G "Visual Studio 17 2022" -A x64 -T ClangCL -DMAX_SDK_BASE="%CD%\build\max-sdk-base" || exit /b 1
cmake --build build\windows --config Release --target diode909_tilde --parallel || exit /b 1
dir /s /b build\windows\externals\*.mxe64
