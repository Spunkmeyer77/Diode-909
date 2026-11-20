// DIODE 909 SEQ data engine.
// Timing is NOT done here: the sequencer runs sample-accurately inside gen~ (g_seq), clocked by
// phasor~ objects locked to Live's transport. This script only writes pattern data into the shared
// buffer~ and relays the playhead (from snapshot~) to the panel.
inlets = 1;
outlets = 2; // 0: unused (kept for patch compatibility), 1: "state pos playPat queued playing chainIdx" -> UI

var NI = 16, NP = 16;
var BNAME = jsarguments.length > 1 ? jsarguments[1] : "tr909pat";
var buf = null;
var masks = [], plen = [];
for (var p = 0; p < NP; p++) { var m = []; for (var i = 0; i < NI; i++) m.push(0); masks.push(m); plen.push(16); }
var flamM = []; for (var q = 0; q < NP * NI; q++) flamM.push(0);
var muteM = 0, soloM = 0, queued = -1, sel = 0, chain = [];
var last = [-9, -9, -9, -9, -9, -9];

function B() {
    if (!buf) { try { buf = new Buffer(BNAME); } catch (e) { buf = null; } }
    return buf;
}
function wr(i, v) { var b = B(); if (b) b.poke(1, i, v); }
function writeAll() {
    for (var p = 0; p < NP; p++) {
        for (var i = 0; i < 16; i++) wr(p * 16 + i, i < NI ? masks[p][i] : 0);
        wr(256 + p, plen[p]);
    }
    wr(272, muteM); wr(273, soloM); wr(274, queued);
    wr(275, chain.length); for (var c = 0; c < 32; c++) wr(276 + c, c < chain.length ? chain[c] : 0);
    wr(308, sel);
    for (var f = 0; f < NP * NI; f++) wr(320 + f, flamM[f]); // flam masks: 320 + p*16 + voice
}
function data() {
    var a = arrayfromargs(arguments), k = 2;
    if (a.length < 2 + NP * (NI + 1)) return;
    for (var p = 0; p < NP; p++) { plen[p] = a[k++]; for (var i = 0; i < NI; i++) masks[p][i] = a[k++]; }
    writeAll();
}
function flam() { var a = arrayfromargs(arguments); for (var f = 0; f < NP * NI && f < a.length; f++) { flamM[f] = a[f]; wr(320 + f, a[f]); } }
function ms(m, s) { muteM = m; soloM = s; wr(272, m); wr(273, s); }
function queue(p) { queued = p; wr(274, p); }
function setplay(p) { sel = p; queued = -1; wr(308, p); wr(274, -1); }
function setchain() { chain = arrayfromargs(arguments).slice(0, 32); wr(275, chain.length); for (var c = 0; c < chain.length; c++) wr(276 + c, chain[c]); }
function bang() { writeAll(); }
function loadbang() { writeAll(); }
// legacy messages from the old scheduler clock: ignored
function tick() {}
function play() {}

// packed playhead from gen~: (pos+1) + 32*pp + 1024*run + 2048*(ci+1)
function gst(v) {
    v = Math.round(v);
    var pos = (v % 32) - 1, pp = Math.floor(v / 32) % 32, run = Math.floor(v / 1024) % 2, ci = Math.floor(v / 2048) - 1;
    var b = B(), q = b ? Math.round(b.peek(1, 274, 1)) : queued;
    var st = [pos, pp, q, run, ci];
    var ch = 0; for (var i = 0; i < 5; i++) if (st[i] !== last[i]) ch = 1;
    if (!ch) return;
    last = st; queued = q;
    outlet(1, "state", pos, pp, q, run, ci);
}
