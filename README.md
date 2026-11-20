# Ticco 909 for Max for Live

This source port uses the analog circuit solver, sample-ROM playback, calibration and MIDI velocity response. The `ticco909~` MSP external renders the original stereo master mix. The patch provides 27 automatable controls and individual audition buttons. Live MIDI clips or a controller sequence the instrument.

This release covers voice mode. The hardware firmware sequencer, pattern memory, original panel, service controls and individual outputs are outside this port. MIDI reaches the engine on DSP vector boundaries. Multiple messages for the same pitch in one vector collapse to the latest velocity.

## Build on an Apple silicon Mac

Install Apple's command line tools if needed (`xcode-select --install`). Use CMake 3.25 or newer and Git. The initial configuration downloads the pinned Cycling '74 Max SDK base.

Open Terminal in this extracted folder and run:

```sh
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_OSX_ARCHITECTURES=arm64 -DCMAKE_OSX_DEPLOYMENT_TARGET=12.0 \
  -DMAX_SDK_PACKAGE_OUT_OF_TREE=ON
cmake --build build --config Release --target ticco909_tilde --parallel
```

Copy the entire `build/package` directory to the Packages folder of the Max version used by Live and rename the copy `Ticco-909-M4L`. For Max 9 the folder is normally `~/Documents/Max 9/Packages/`. Check the version in the Max editor opened by Live. Restart Live and Max after installation. The package should contain `externals/ticco909~.mxo`.

## Save as a Live instrument

1. On a MIDI track in Ableton Live, add the blank **Max Instrument** device and click its **Edit** button.
2. In the Max editor, open `Ticco-909-Instrument.maxpat`. Switch off Presentation Mode in both windows and unlock them.
3. Select and copy every object from the supplied patch. In the instrument template, select and remove its existing objects, then paste the copied patch.
4. In the device editor's Patcher Inspector, turn on **Open in Presentation** and set **Device Width** to 935 if the right edge is cropped. Choose **File → Save As**, name it `Ticco 909.amxd`, and save it in your User Library. Enable the track or play a MIDI clip and try the kick on MIDI note 36. Check the Max Console if the external appears as a missing object.

## ROMs

Kick, snare, toms, rim and clap work without files. Hats, crash and ride require the corresponding dumps. With playback stopped, drop each extracted ROM onto the patch's ROM drop area and check the Max Console for confirmation. The instrument checks the ROM's size and CRC. ROMs are loaded per device instance and need to be loaded again after reopening a set.

| Voice | Filename | CRC32 |
| --- | --- | --- |
| Closed and open hi-hat | `hn61256p__c43.ic69` | `2aaae11b` |
| Crash | `hn61256p__c42.ic62` | `dc61cf1a` |
| Ride | `hn61256p__c44.ic54` | `01a9b435` |

## MIDI notes

| Drum | MIDI note |
| --- | --- |
| Kick | 36 (also 35) |
| Snare | 38 (also 40) |
| Low tom | 43 (also 41) |
| Mid tom | 47 (also 45) |
| High tom | 50 (also 48) |
| Rim | 37 |
| Clap | 39 |
| Closed hi-hat | 42 (also 44) |
| Open hi-hat | 46 |
| Crash | 49 |
| Ride | 51 |

## Verification

To build and test the engine separately from Max:

```sh
cmake -S . -B build-test -DBUILD_MAX_EXTERNAL=OFF -DCMAKE_BUILD_TYPE=Release
cmake --build build-test --config Release --parallel
ctest --test-dir build-test -C Release --output-on-failure
```

The smoke test renders all seven analog drums at 44.1 and 48 kHz and checks for finite, audible output. The macOS bundle and Live device require verification in the target host.

Adapted for Max for Live on 2026-11-20. Roland and TR-909 identify the original equipment. This is an independent port.
