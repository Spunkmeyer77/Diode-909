# builds "DIODE 909 - User Manual.pdf" and "DIODE 909 - Update History.pdf" (headless Chrome)
import subprocess, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
VERSION = "1.2.5"
CSS = """<style>@page{size:A4;margin:18mm 16mm}body{font-family:Arial,sans-serif;color:#222;font-size:10.5pt;line-height:1.45}
h1{font-size:30pt;margin:0;font-style:italic;color:#1a1a1a}.sub{color:#e0601a;font-size:13pt;margin-bottom:16px}
h2{color:#c8361d;border-bottom:2px solid #f08a24;padding-bottom:3px;margin-top:20px}section{break-inside:avoid}
img{width:100%;border:1px solid #444;margin:6px 0}table{border-collapse:collapse;width:100%}td,th{border:1px solid #bbb;padding:4px 6px;vertical-align:top;text-align:left}th{background:#f6e3c9}
.stripe{height:5px;background:linear-gradient(90deg,#d62e1f 25%,#f57a1f 25% 50%,#fad542 50% 75%,#ede6cc 75%);margin:8px 0 18px}.warn{background:#fff3e0;border-left:4px solid #f08a24;padding:8px 10px}
h3{color:#343a5c;margin:12px 0 3px;font-size:11.5pt}.small{font-size:8.5pt;color:#666}.toc{columns:2;column-gap:30px}
.cover{height:257mm;display:flex;flex-direction:column;break-after:page;background:#e9e6de;margin:-2mm -2mm 0;padding:10mm 10mm 6mm;box-sizing:border-box}
.brand{letter-spacing:4px;color:#343a5c;font-weight:bold;font-size:10pt;margin-top:4mm}
.title{font-size:58pt;font-style:normal;color:#343a5c;margin:6mm 0 0;letter-spacing:1px}
.ctag{color:#e0601a;font-size:16pt;font-weight:bold;margin-bottom:8mm}
.cimg{width:100%;border:1px solid #343a5c;margin:0 0 9mm}
.features{display:grid;grid-template-columns:1fr 1fr;gap:6mm 9mm;flex:1}
.features div{border-left:4px solid #f08a24;padding-left:9px}
.features b{display:block;color:#343a5c;font-size:12pt;margin-bottom:2px}.features span{font-size:9.5pt;color:#333}
.cfoot{text-align:center;color:#555;font-size:9.5pt;margin-top:4mm}
.hhead{background:#e9e6de;margin:-2mm -2mm 4mm;padding:6mm 9mm 4mm}.vt{color:#343a5c;font-weight:normal;font-size:11pt;margin-left:6px}
</style>"""
def page(body): return "<html><head><meta charset=utf-8>" + CSS + "</head><body>" + body + "</body></html>"
man = """<div class=cover>
<div class=stripe></div>
<div class=brand>TRANSISTOR LABS</div>
<h1 class=title>DIODE 909</h1>
<div class=ctag>Rhythm Composer for Max for Live</div>
<img class=cimg src="full.png">
<div class=features>
<div><b>Circuit-level TR-909 engine</b><span>Every analog drum simulated part by part from the original schematics</span></div>
<div><b>The real hi-hats and cymbals</b><span>The 909's own 6-bit sample data, played through its counters, D/A converters, VCAs and filters</span></div>
<div><b>x0x step sequencer</b><span>16 patterns, chains of up to 32, accent, flam, swing, MIDI recording</span></div>
<div><b>Every 909 control at once</b><span>The full front panel, plus snare RING and HQ/ECO quality</span></div>
<div><b>Sample-accurate and crackle-free</b><span>Render-ahead engine with automatic latency compensation in Live</span></div>
<div><b>Push 3 ready</b><span>Four parameter banks, all controls automatable</span></div>
</div>
<div class=cfoot>User Manual · version """ + VERSION + """<br>ticcoross.gumroad.com · ticcoross@gmail.com</div>
</div>

<section><h2>Contents</h2><ol class=toc>
<li>Welcome</li><li>The Sound Engine</li><li>System Requirements</li><li>Installation</li><li>macOS Security Warning</li><li>A Tour of the Panel</li><li>Selecting an Instrument</li><li>The Sound Controls</li><li>Snare RING</li><li>Quality: HQ and ECO</li><li>Programming Patterns</li><li>Accent</li><li>Flam</li><li>Swing</li><li>Patterns and Chains</li><li>Mute and Solo</li><li>Recording with WRITE</li><li>MIDI</li><li>Push 3 and Automation</li><li>Latency, CPU and Tips</li><li>Credits and Support</li></ol></section>

<section><h2>1. Welcome</h2><p>Thank you for choosing DIODE 909. It brings the Roland TR-909 Rhythm Composer into Ableton Live as a single Max for Live instrument: the sound of the original circuits, and a step sequencer that works the way the 909 does.</p><p>DIODE 909 is not a sample player. Its bass drum, snare, toms, rim shot and hand clap are electronic circuits simulated in real time, component by component, so they respond to every knob and every accent the way the hardware does: no two hits are exactly alike, and turning TUNE or DECAY changes the circuit, not a recording. The hi-hats, crash and ride come from the 909's own sample chips and travel through the same simulated analog stages as on the real machine.</p><p>Everything is inside the device. There are no samples to install and no folders to keep next to it.</p></section>

<section><h2>2. The Sound Engine</h2>
<h3>Circuit-level simulation</h3><p>The original TR-909 builds its drums from transistors, op-amps, capacitors and resistors. DIODE 909 rebuilds each voice from the service schematics as an electrical circuit and solves it sample by sample: the oscillators, the envelope capacitors charging and discharging, the noise generator (the 909's own 31-stage shift register), the filters, the VCAs and the mixer. That is why the bass drum's click and pitch sweep, the snare's two tones against its snappy noise and the clap's three bursts behave exactly as the hardware's do, at every knob position.</p>
<h3>The hi-hats and cymbals</h3><p>On the 909, the hats, crash and ride are 6-bit recordings stored on chips. DIODE 909 contains this data and plays it the way the 909 does: through its counters, its D/A converters, the analog VCAs that shape CH DECAY and OH DECAY, and its output filters. The 6-bit grit, the tuning behaviour of the cymbals and the closed hat choking the open hat all come from those circuits.</p>
<h3>Matched to the real machine</h3><p>Trims that are adjusted on every 909 at the factory are set from measurements of real units. The hand clap, for example, was matched against a recording of a real TR-909: its three bursts, its body and its tail.</p>
<h3>Sample-accurate timing</h3><p>The sequencer runs in Live's audio engine and triggers each drum at its exact sample, including swing and flams.</p></section>

<section><h2>3. System Requirements</h2><table><tr><th>Item</th><th>Requirement</th></tr>
<tr><td>Ableton Live</td><td>Live 12 Suite, or Live 12 Standard with the Max for Live add-on</td></tr>
<tr><td>macOS</td><td>macOS 12 Monterey or later; Apple Silicon (M1 or later) or Intel</td></tr>
<tr><td>Windows</td><td>Windows 10 or 11, 64-bit</td></tr>
<tr><td>Processor</td><td>A circuit simulation needs much more power than a sample player. Recommended: Apple M1 or later, or a recent Intel/AMD processor with at least 4 cores. DIODE 909 spreads its drums over several cores.</td></tr>
<tr><td>Memory</td><td>8 GB RAM or more</td></tr>
<tr><td>Audio</td><td>44.1 or 48 kHz recommended (higher rates work and need more CPU)</td></tr>
<tr><td>Live settings</td><td>Delay Compensation on (Options menu), see chapter 20</td></tr>
<tr><td>Controller</td><td>Optional: Push 3 controlling Live</td></tr></table></section>

<section><h2>4. Installation</h2><p>DIODE 909 is a single file, <b>DIODE 909.amxd</b>, with everything it needs inside it.</p><ol>
<li>Unzip the download.</li>
<li>Move <b>DIODE 909.amxd</b> to a permanent place. We recommend your User Library, for example <i>Music / Ableton / User Library / Presets / Instruments / Max Instrument</i> on a Mac, so it appears in Live's browser.</li>
<li>In Live, drag DIODE 909 from the browser (or from Finder / Explorer) onto an empty MIDI track.</li>
<li>Press Play in Live and click a few step keys: it plays. The sequencer follows Live's tempo and transport.</li></ol>
<p>The user manual and update history are PDF files you can keep anywhere. Your patterns and settings are saved inside your Live Set, and can be saved as a Live preset of the device.</p></section>

<section><h2>5. macOS Security Warning</h2><div class=warn><p>DIODE 909 contains a compiled sound engine that is not notarised by Apple. The first time you load the device, macOS may block the engine with a message that it "cannot be opened because the developer cannot be verified" or that Apple "cannot check it for malicious software", and the device stays silent. If that happens:</p><ol>
<li>Click <b>Done</b> (or <b>OK</b>) on the message.</li>
<li>Open <b>System Settings → Privacy &amp; Security</b> (macOS 12: System Preferences → Security &amp; Privacy → General).</li>
<li>Find the line about <b>diode909~</b> being blocked and click <b>Allow Anyway</b> / <b>Open Anyway</b>.</li>
<li>Delete DIODE 909 from the track and drag it in again; confirm with <b>Open</b> if macOS asks once more.</li></ol><p>You only need to do this once.</p></div></section>

<section><h2>6. A Tour of the Panel</h2><img src="full.png"><p><b>Top row:</b> the sound controls of all eleven instruments at once, under navy bars like the 909's front panel: TOTAL ACCENT, BASS DRUM, SNARE DRUM, LOW TOM, MID TOM, HI TOM, RIM SHOT / HAND CLAP, HI HAT and CYMBAL. Each bar has a small round LED for mute and solo.</p><img src="p_right.png" style="width:55%"><p><b>Top right:</b> the DIODE 909 logo (click it to visit the store), the LAST STEP, CHANNEL and NOTE displays, and the master VOLUME knob.</p><p><b>Bottom row:</b> WRITE, CLEAR, COPY and PASTE; the 16 step keys, grouped in fours; the instrument strip under the keys; the 16 pattern keys. A hint line under the keys reminds you of the shortcuts.</p></section>

<section><h2>7. Selecting an Instrument</h2><p>The step keys always show the pattern of one instrument, the selected one. Its name is shown in orange (on the instrument strip) or white (in the navy bar). To select an instrument:</p><ul>
<li>click its name on the <b>instrument strip</b> under the keys. On the shared strips click the left or right name: RIM SHOT · CLAP, CLOSED · OPEN, CRASH · RIDE;</li>
<li>or click its name in a <b>navy bar</b> above the knobs (on shared bars, the left or right half);</li>
<li>click <b>TOTAL ACCENT</b> to edit the accent track (chapter 12).</li></ul><p>The NOTE display shows the selected instrument and the MIDI note that plays it.</p></section>

<section><h2>8. The Sound Controls</h2><img src="p_knobs.png"><p>Drag a knob up or down to turn it; hold <b>Shift</b> for fine moves; <b>double-click</b> to return it to its factory position. While you turn a knob its value appears under it (0–10, or milliseconds for FLAM).</p>
<table><tr><th>Group</th><th>Controls</th><th>What they do</th></tr>
<tr><td>TOTAL ACCENT</td><td>ACCENT · FLAM · QUALITY · SWING</td><td>Accent strength, flam time, HQ/ECO, shuffle (chapters 10–14)</td></tr>
<tr><td>BASS DRUM</td><td>TUNE · LEVEL · ATTACK · DECAY</td><td>Pitch sweep depth, volume, the click of the beater, length</td></tr>
<tr><td>SNARE DRUM</td><td>TUNE · LEVEL · TONE · SNAPPY · RING</td><td>Pitch of the two tones, volume, the noise's colour, the noise's level, the tone's ring (chapter 9)</td></tr>
<tr><td>LOW / MID / HI TOM</td><td>TUNE · LEVEL · DECAY</td><td>Pitch, volume, length</td></tr>
<tr><td>RIM SHOT · HAND CLAP</td><td>LEVEL · LEVEL</td><td>Volume of each</td></tr>
<tr><td>HI HAT</td><td>LEVEL · CH DECAY · OH DECAY</td><td>Volume of both hats, closed hat length, open hat length</td></tr>
<tr><td>CYMBAL</td><td>CR LEVEL · RD LEVEL · CR TUNE · RD TUNE</td><td>Crash and ride volume and pitch</td></tr>
<tr><td>VOLUME</td><td>(top right)</td><td>Master level of the whole device</td></tr></table>
<p>Every control is a Live parameter: automate it, MIDI-map it or control it from Push 3.</p></section>

<section><h2>9. Snare RING</h2><img src="p_snare.png" style="width:30%;float:right;margin-left:12px"><p>Like the original, DIODE 909's snare lets its low tone ring on quietly after the hit. RING sets how long.</p><ul><li><b>Fully up</b> (factory setting): the original snare, ring included.</li><li><b>Turning it down</b> fades the ring out sooner and sooner; at the minimum it is gone just after the hit.</li></ul><p>RING never touches the hit itself (the first 120 ms), so TUNE, TONE and SNAPPY sound the same at any setting. Use it to tighten the snare in busy patterns.</p></section>

<section><h2>10. Quality: HQ and ECO</h2><img src="p_accent.png" style="width:26%;float:right;margin-left:12px">
<h3>Why there is a choice</h3><p>Simulating analog circuits sample by sample is demanding: the sharp edges inside the 909's circuits (the bass drum's click, the clap's bursts, the noise) are only reproduced cleanly when the circuits run faster than the audio itself. That takes processing power, so DIODE 909 lets you choose how much to spend.</p>
<h3>How it works</h3><ul><li><b>HQ</b> (factory setting): the circuits run at <b>twice</b> Live's sample rate (88.2 or 96 kHz) and the result is filtered back down. Highest fidelity, the cleanest top end.</li><li><b>ECO</b>: the circuits run at Live's sample rate itself. About <b>a third less CPU</b>, with a slightly rougher, more aliased top end, mostly heard on the hats, cymbals and the clap's noise. Many users find the difference small in a mix.</li></ul>
<h3>Using it</h3><p>Click the switch under ACCENT. The sound stops for a moment while the circuits restart, so change it while Live is stopped. QUALITY is saved with your Live Set and is available on Push 3. A good habit: produce in ECO when your project gets heavy, and switch to HQ before you export.</p></section>

<section><h2>11. Programming Patterns</h2><img src="p_steps.png"><ul>
<li>Select an instrument (chapter 7), then <b>click step keys</b> to turn steps on and off. Drag across the keys to paint several at once.</li>
<li>A lit LED is a step that plays. While Live plays, the playhead key is shown pressed.</li>
<li><b>4/4 guide:</b> the keys are grouped in fours with navy brackets, and steps 1, 5, 9 and 13 (the beats) have navy number tabs, so a four-on-the-floor kick is four clicks away.</li>
<li><b>LAST STEP</b> (drag the display up or down) sets the pattern length, 1–16 steps; keys after it are dimmed.</li>
<li><b>CLEAR</b> empties the pattern; <b>Shift-click CLEAR</b> clears only the selected instrument.</li>
<li><b>COPY</b> and <b>PASTE</b> copy a whole pattern, including its length, to another pattern.</li></ul></section>

<section><h2>12. Accent</h2><p>Click <b>TOTAL ACCENT</b> to select the accent track, then set steps as usual: on every accented step all instruments playing there hit harder. On the other tracks an accented step shows its number on an <b>orange</b> tab.</p><p>As on the 909, an accent drives each voice's accent circuit, not only its volume: the analog drums hit harder and brighter, the hats and cymbals play louder sample levels. The <b>ACCENT</b> knob sets how strong accented steps are.</p></section>

<section><h2>13. Flam</h2><img src="p_flam.png"><p><b>Alt/Option-click</b> a step key to make that step a flam: its LED turns <b style="color:#2a7bff">blue</b>. Alt-click it again for a normal step. A flam plays a quiet grace note and then the main hit a moment later, like a drummer's flam. The <b>FLAM</b> knob sets that time, 5 to 40 ms (factory 19 ms). The main hit keeps the step's accent.</p></section>

<section><h2>14. Swing</h2><p>The <b>SWING</b> knob delays every second 16th step (2, 4, 6 …) for a shuffled groove. At 0 the steps are straight (50 %); at 10 the delayed steps land at 75 % of the 8th note. Swing follows Live's tempo and applies to every instrument, accents and flams included.</p></section>

<section><h2>15. Patterns and Chains</h2><img src="p_patterns.png" style="width:50%"><ul>
<li><b>Click a pattern key</b> to select a pattern. While Live plays, the new pattern starts when the current one ends; its LED blinks while it waits.</li>
<li>The <b>red LED</b> shows the pattern playing; the <b>orange frame</b> the one you are editing. A dark number means the pattern has steps, a faded one that it is empty.</li>
<li><b>Shift-click</b> pattern keys to build a <b>chain</b> of up to 32 patterns, played in order and looped. Orange tags under the keys show each pattern's places in the chain; the display above shows CHAIN position/length (above: 1 → 2 → 1 → 4, now playing the 2nd).</li>
<li>Click a pattern without Shift to clear the chain.</li></ul><p>All 16 patterns and the chain are saved with your Live Set.</p></section>

<section><h2>16. Mute and Solo</h2><img src="p_leds.png"><p>Each instrument has a small round LED in its navy bar. On shared bars the left LED is the left instrument and the right LED the right one (HI HAT: closed hat left, open hat right).</p><ul>
<li><b>Click</b> an LED to mute that instrument: it lights <b style="color:#d9662a">orange</b>.</li>
<li><b>Alt/Option-click</b> to solo it: it lights <b>cream</b>. Only soloed instruments play.</li>
<li><b>Cmd/Ctrl-click</b> solos only that instrument (clears the other solos).</li></ul><p>Above: the low tom and the hand clap muted, the bass drum soloed.</p></section>

<section><h2>17. Recording with WRITE</h2><img src="p_write.png" style="width:14%;float:right;margin-left:12px"><p>Click <b>WRITE</b>: its LED lights and its label turns orange. With Live playing, the drum notes you play on a MIDI keyboard, Push or Live's computer keyboard are recorded into the playing pattern at the nearest step. Velocity 120 or more records an accent. Click WRITE again to stop recording.</p></section>

<section><h2>18. MIDI</h2><p>DIODE 909 plays from MIDI notes as well as from its own sequencer, so you can also drive it from Live clips or Push's drum pads.</p><table><tr><th>Sound</th><th>Note</th><th>Sound</th><th>Note</th></tr><tr><td>BD</td><td>C1 36 (also B0 35)</td><td>CP</td><td>D#1 39</td></tr><tr><td>SD</td><td>D1 38 (also E1 40)</td><td>CH</td><td>F#1 42 (also G#1 44)</td></tr><tr><td>LT</td><td>G1 43 (also F1 41)</td><td>OH</td><td>A#1 46</td></tr><tr><td>MT</td><td>B1 47 (also A1 45)</td><td>CR</td><td>C#2 49</td></tr><tr><td>HT</td><td>D2 50 (also C2 48)</td><td>RD</td><td>D#2 51</td></tr><tr><td>RS</td><td>C#1 37</td><td colspan=2>Velocity 100 or more plays accented.</td></tr></table>
<p><b>Edit channel</b> (CHANNEL display, default 16; drag to change): on this channel notes 36–51 toggle steps 1–16, notes 52–63 select the instruments AC to RD, and notes 72–87 select patterns 1–16, for hands-on programming from a controller.</p></section>

<section><h2>19. Push 3 and Automation</h2><p>With DIODE 909 selected, Push 3 shows its controls in four banks:</p><table><tr><th>Bank</th><th>Controls</th></tr><tr><td>Main</td><td>Accent, Flam, Swing, Volume, RS Level, CP Level, HH Level, CH Decay</td></tr><tr><td>BD SD</td><td>BD Level, Tune, Attack, Decay · SD Level, Tune, Tone, Snappy</td></tr><tr><td>Toms</td><td>LT Level, Tune, Decay · MT Level, Tune, Decay · HT Level, Tune</td></tr><tr><td>Cymbals</td><td>HT Decay, OH Decay, Crash Level, Tune, Ride Level, Tune, Quality, SD Ring</td></tr></table><p>Play the drums from Push's pads in Drum mode with the notes in chapter 18. Every control can be automated in Live's clips and arrangement.</p></section>

<section><h2>20. Latency, CPU and Tips</h2>
<h3>Latency</h3><p>To give its circuits enough time for every hit, DIODE 909 computes its audio 512 samples (about 12 ms at 44.1 kHz) ahead and reports this to Live. With <b>Delay Compensation</b> on (Options menu, on by default) Live delays the other tracks to match, so everything stays in time. You only notice the 12 ms when you play DIODE 909 live from a keyboard.</p>
<h3>CPU</h3><p>DIODE 909 works on its own threads, so Live's CPU meter shows only a small part of its load; Activity Monitor (Mac) or Task Manager (Windows) shows the real total. The snare and toms are the heaviest circuits; silent instruments rest automatically.</p>
<h3>Tips</h3><ul><li>Crackles in a heavy project: switch QUALITY to ECO, or raise Live's buffer size (Settings → Audio).</li><li>Freeze or resample tracks you have finished to save CPU.</li><li>Export in HQ for the best sound.</li><li>The device is silent on macOS: see chapter 5.</li></ul></section>

<section><h2>21. Credits and Support</h2><p>DIODE 909 by Transistor Labs (Ticco Ross).</p><p>Support, questions and feedback: <b>ticcoross@gmail.com</b><br>More instruments and updates: <b>https://ticcoross.gumroad.com/</b></p><p class=small>TR-909 and Roland are trademarks of Roland Corporation, which is not associated with this product. Product names are used only to describe the instrument this device recreates.</p></section>"""
hist = """<div class=hhead>
<div class=stripe></div>
<div class=brand>TRANSISTOR LABS</div>
<h1 class=title style="font-size:40pt;margin-top:3mm">DIODE 909</h1>
<div class=ctag style="margin-bottom:4mm">Update History · Max for Live</div>
<img class=cimg src="full.png" style="margin-bottom:4mm">
<p class=small>Current version: <b>""" + VERSION + """</b>. To update, replace your DIODE 909.amxd with the new one; your Live Sets keep their patterns and settings. Newest version first.</p>
</div>
<section><h2>1.2.5 <span class=vt>Clearer buttons</span></h2><ul><li>WRITE, CLEAR, COPY and PASTE light up clearly: WRITE stays lit, with an orange label, while recording is on; the others flash when clicked.</li><li>New, complete user manual with a cover and every function explained.</li></ul></section>
<section><h2>1.2.4 <span class=vt>Mute and solo in the navy style</span></h2><ul><li>The mute and solo LEDs in the instrument bars match the panel: navy rings when off, orange when muted, cream when soloed, with the same grey ring in every state.</li></ul></section>
<section><h2>1.2.3 <span class=vt>Bigger mute and solo LEDs</span></h2><ul><li>The mute and solo LEDs in the instrument bars are bigger and easier to find.</li></ul></section>
<section><h2>1.2.2 <span class=vt>Clap level</span></h2><ul><li>At its factory LEVEL setting the hand clap now sits with the other instruments (about 5 dB quieter than in 1.2.1).</li></ul></section>
<section><h2>1.2.1 <span class=vt>Hand clap matched to a real TR-909 · snare RING</span></h2><ul><li>The hand clap was matched against a recording of a real TR-909: a full, bright body after its three attack bursts (it was much too quiet) and a shorter low tail. It now sits naturally with the bass drum.</li><li>New RING knob on the snare drum: sets how long its low tone rings on after the hit. Fully up is the original sound.</li></ul></section>
<section><h2>1.2.0 <span class=vt>No more crackles</span></h2><ul><li>The circuits now work 512 samples ahead, so even the heaviest hits have time to finish: no more crackles with many instruments playing. DIODE 909 reports this latency to Live, which keeps it in time.</li><li>More instruments compute at once on 8-core Macs.</li></ul></section>
<section><h2>1.1.0 <span class=vt>HQ/ECO quality · the 909 panel</span></h2><ul><li>QUALITY switch: HQ (factory setting) or ECO, about a third less CPU.</li><li>Lower CPU in both modes: instruments rest sooner once their sound has died away.</li><li>4/4 guide on the step keys: downbeats 1, 5, 9 and 13 marked, keys grouped in fours.</li><li>Mute and solo as LEDs in the instrument bars.</li><li>Pattern slots as 909 keys in two rows of eight; displays beside the logo.</li><li>Knobs show their position at every value.</li></ul></section>
<section><h2>1.0.0 <span class=vt>First release</span></h2><ul><li>The DIODE 909 circuit engine inside an x0x sequencer: circuit-level bass drum, snare, toms, rim shot and hand clap; hi-hats, crash and ride through the 909's sample playback circuits, built in.</li><li>A TR-909 style panel with every sound control of the 909's front panel visible at once, plus a master volume.</li><li>Accent, flam (Alt/Option-click, blue LED, 5–40 ms) and swing.</li><li>16 patterns, chains, mute and solo, MIDI in and WRITE recording.</li><li>Push 3 parameter banks.</li></ul></section>
<p class=small style="margin-top:8mm">Transistor Labs · ticcoross@gmail.com · https://ticcoross.gumroad.com/</p>"""
for name, b in [("DIODE 909 - User Manual", man), ("DIODE 909 - Update History", hist)]:
    open("_t.html", "w").write(page(b))
    subprocess.run(["google-chrome", "--headless", "--no-sandbox", "--disable-gpu", "--no-pdf-header-footer",
                    "--print-to-pdf=" + name + ".pdf", "_t.html"], check=True, capture_output=True)
os.remove("_t.html")
print("ok")
