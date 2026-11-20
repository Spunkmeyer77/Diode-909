// DIODE 909 — x0x step sequencer for the DIODE 909 circuit engine (Max for Live jsui panel)
// 16 patterns x 11 voices + accent x up to 16 steps. Sound: diode909~ (DIODE 909 circuit engine).
// Step values: 0 off, 1 on, 2 flam (blue LED). Alt/Option-click a step to set or clear a flam.
// Ticco Ross — ticcoross.gumroad.com
inlets = 1;
outlets = 2; // 0: messages to engine, 1: MIDI thru "pitch vel"

mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

// instrument select order like the 909: AC, BD, SD, LT, MT, HT, RS, CP, CH, OH, CR, RD
var NAMES = ["AC", "BD", "SD", "LT", "MT", "HT", "RS", "CP", "CH", "OH", "CR", "RD", "", "", "", ""];
var NI = 16, NV = 12, NP = 16, NS = 16, AC = 0; // NI: stored tracks, NV: tracks in use
// selector knob: 12 positions, one instrument each
var POS = [[0], [1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11]];
var ALT = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
function posOf(i) { for (var p = 0; p < POS.length; p++) for (var a = 0; a < POS[p].length; a++) if (POS[p][a] === i) return [p, a]; return [0, 0]; }
function posLabel(p) { return POS[p].length > 1 ? NAMES[POS[p][0]] + "\u00b7" + NAMES[POS[p][1]] : NAMES[POS[p][0]]; }
var VERSION = "1.0.0";
var NOTES = [-1, 36, 38, 43, 47, 50, 37, 39, 42, 46, 49, 51, -1, -1, -1, -1]; // AC = accent

var pats = [], plen = [];
for (var p = 0; p < NP; p++) { pats.push(emptyPat()); plen.push(16); }
function emptyPat() { var a = []; for (var i = 0; i < NI; i++) { var r = []; for (var s = 0; s < NS; s++) r.push(0); a.push(r); } return a; }

var playPat = 0, queued = -1, editPat = 0, inst = 1;
var pos = -1, playing = 0;
var rec = 0, editCh = 16, lastChan = 1, clip = null;
var paintVal = 1, dragMode = null, dragY = 0, dragStart = 0, blink = 0;
var flash = {};
var vName = null, vFine = 0;
var chain = [], chainPos = -1;
function sendChain() { outlet(0, ["setchain"].concat(chain)); }
// mute / solo per voice (index 1..11)
var mute = [], solo = [];
for (var i0 = 0; i0 < NI; i0++) { mute.push(0); solo.push(0); }
var MSX = 24, MSCW = 19;
function msRect(row, v) { return [MSX + (v - 1) * (MSCW + 2), row === 0 ? 17 : 37, MSCW, 16]; }
function sendMS() { var mm = 0, sm = 0; for (var v = 1; v < NV; v++) { if (mute[v]) mm |= (1 << v); if (solo[v]) sm |= (1 << v); } outlet(0, "ms", mm, sm); }

// ---------- layout ----------
var W = box.rect[2] - box.rect[0], H = box.rect[3] - box.rect[1];
var KNOB = [436, 29, 17];
function labelPos(i) { return i < 6 ? [402, 9 + i * 8.4, "R"] : [470, 9 + (i - 6) * 8.4, "L"]; }
function labelRect(i) { var p = labelPos(i); return p[2] === "R" ? [p[0] - 40, p[1] - 7, 44, 9] : [p[0] - 4, p[1] - 7, 44, 9]; }
var VOICE_AREA = [504, 3, 308, 53];
var VALS = [[822, 12, 60, 34], [888, 12, 48, 34], [942, 12, 72, 34]]; // LAST STEP / CH / NOTE
var GROUPS = [["d_ac", "d_flam", "d_swing", "d_vol"], ["d_bd_lvl", "d_bd_tune", "d_bd_attack", "d_bd_decay"], ["d_sd_lvl", "d_sd_tune", "d_sd_tone", "d_sd_snappy"], ["d_lt_lvl", "d_lt_tune", "d_lt_decay"], ["d_mt_lvl", "d_mt_tune", "d_mt_decay"], ["d_ht_lvl", "d_ht_tune", "d_ht_decay"], ["d_rs_lvl"], ["d_cp_lvl"], ["d_hh_lvl", "d_ch_decay"], ["d_hh_lvl", "d_oh_decay"], ["d_cr_lvl", "d_cr_tune"], ["d_rd_lvl", "d_rd_tune"], [], [], [], []];
var DV = {"d_ac": {"label": "Accent", "min": 0, "max": 1, "val": 0.5, "def": 0.5, "unit": 8, "exp": 1}, "d_flam": {"label": "Flam", "min": 0, "max": 1, "val": 0.4, "def": 0.4, "unit": 9, "exp": 1}, "d_swing": {"label": "Swing", "min": 0, "max": 1, "val": 0, "def": 0, "unit": 8, "exp": 1}, "d_vol": {"label": "Volume", "min": 0, "max": 1, "val": 0.7, "def": 0.7, "unit": 8, "exp": 1}, "d_bd_lvl": {"label": "Level", "min": 0, "max": 1, "val": 0.75, "def": 0.75, "unit": 8, "exp": 1}, "d_bd_tune": {"label": "Tune", "min": 0, "max": 1, "val": 0.5, "def": 0.5, "unit": 8, "exp": 1}, "d_bd_attack": {"label": "Attack", "min": 0, "max": 1, "val": 0.5, "def": 0.5, "unit": 8, "exp": 1}, "d_bd_decay": {"label": "Decay", "min": 0, "max": 1, "val": 0.5, "def": 0.5, "unit": 8, "exp": 1}, "d_sd_lvl": {"label": "Level", "min": 0, "max": 1, "val": 0.75, "def": 0.75, "unit": 8, "exp": 1}, "d_sd_tune": {"label": "Tune", "min": 0, "max": 1, "val": 0.5, "def": 0.5, "unit": 8, "exp": 1}, "d_sd_tone": {"label": "Tone", "min": 0, "max": 1, "val": 0.5, "def": 0.5, "unit": 8, "exp": 1}, "d_sd_snappy": {"label": "Snappy", "min": 0, "max": 1, "val": 0.5, "def": 0.5, "unit": 8, "exp": 1}, "d_lt_lvl": {"label": "Level", "min": 0, "max": 1, "val": 0.75, "def": 0.75, "unit": 8, "exp": 1}, "d_lt_tune": {"label": "Tune", "min": 0, "max": 1, "val": 0.5, "def": 0.5, "unit": 8, "exp": 1}, "d_lt_decay": {"label": "Decay", "min": 0, "max": 1, "val": 0.5, "def": 0.5, "unit": 8, "exp": 1}, "d_mt_lvl": {"label": "Level", "min": 0, "max": 1, "val": 0.75, "def": 0.75, "unit": 8, "exp": 1}, "d_mt_tune": {"label": "Tune", "min": 0, "max": 1, "val": 0.5, "def": 0.5, "unit": 8, "exp": 1}, "d_mt_decay": {"label": "Decay", "min": 0, "max": 1, "val": 0.5, "def": 0.5, "unit": 8, "exp": 1}, "d_ht_lvl": {"label": "Level", "min": 0, "max": 1, "val": 0.75, "def": 0.75, "unit": 8, "exp": 1}, "d_ht_tune": {"label": "Tune", "min": 0, "max": 1, "val": 0.5, "def": 0.5, "unit": 8, "exp": 1}, "d_ht_decay": {"label": "Decay", "min": 0, "max": 1, "val": 0.5, "def": 0.5, "unit": 8, "exp": 1}, "d_rs_lvl": {"label": "Level", "min": 0, "max": 1, "val": 0.75, "def": 0.75, "unit": 8, "exp": 1}, "d_cp_lvl": {"label": "Level", "min": 0, "max": 1, "val": 0.75, "def": 0.75, "unit": 8, "exp": 1}, "d_hh_lvl": {"label": "Level", "min": 0, "max": 1, "val": 0.75, "def": 0.75, "unit": 8, "exp": 1}, "d_ch_decay": {"label": "Decay", "min": 0, "max": 1, "val": 0.5, "def": 0.5, "unit": 8, "exp": 1}, "d_oh_decay": {"label": "Decay", "min": 0, "max": 1, "val": 0.5, "def": 0.5, "unit": 8, "exp": 1}, "d_cr_lvl": {"label": "Level", "min": 0, "max": 1, "val": 0.75, "def": 0.75, "unit": 8, "exp": 1}, "d_cr_tune": {"label": "Tune", "min": 0, "max": 1, "val": 0.5, "def": 0.5, "unit": 8, "exp": 1}, "d_rd_lvl": {"label": "Level", "min": 0, "max": 1, "val": 0.75, "def": 0.75, "unit": 8, "exp": 1}, "d_rd_tune": {"label": "Tune", "min": 0, "max": 1, "val": 0.5, "def": 0.5, "unit": 8, "exp": 1}};
function fmtVal(d) {
    var v = d.val;
    if (d.unit === 2) return (v >= 1000 ? (v / 1000).toFixed(2) + " s" : Math.round(v) + " ms");
    if (d.unit === 3) return (v >= 1000 ? (v / 1000).toFixed(1) + "k" : Math.round(v)) + " Hz";
    if (d.unit === 6) return v >= 0.5 ? "LATE" : "EARLY";
    if (d.unit === 12) return v >= 0.5 ? "ECO" : "HQ";
    if (d.unit === 7) return (v > 0 ? "+" : "") + v.toFixed(1) + " st";
    if (d.unit === 8) return (v * 10).toFixed(1);
    if (d.unit === 9) return Math.round(5 + 35 * v) + " ms";
    if (d.unit === 10) return Math.round(v) + " mV";
    if (d.unit === 11) return Math.round(v) + " %";
    if (d.unit === 5) return Math.round((v - d.min) / (d.max - d.min) * 100) + " %";
    return v.toFixed(2);
}
function toN(d) { return Math.pow((d.val - d.min) / (d.max - d.min), 1 / (d.exp || 1)); }
function fromN(d, n) { n = Math.max(0, Math.min(1, n)); return d.min + (d.max - d.min) * Math.pow(n, d.exp || 1); }
function vknobRect(k) { return [VOICE_AREA[0] + 4 + k * 50, VOICE_AREA[1], 48, VOICE_AREA[3]]; }
function dv(name, v) { if (DV[name]) { DV[name].val = v; mgraphics.redraw(); } }
function sendDial(name) {
    var o = this.patcher ? this.patcher.getnamed(name) : null;
    if (o) o.message("float", DV[name].val);
}
function setInst(i) { inst = i; var pa = posOf(i); ALT[pa[0]] = pa[1]; mgraphics.redraw(); }
function setPos(p) { setInst(POS[p][Math.min(ALT[p], POS[p].length - 1)]); }
var SX = 128, SW = function () { return W - SX - 136; };
function stepRect(s) { var gap = 10, bw = (SW() - gap * 15) / 16; return [SX + s * (bw + gap), 104, bw, 30]; }
function ledPos(s) { var r = stepRect(s); return [r[0] + r[2] / 2, 94]; }
function numRect(s) { var r = stepRect(s); return [r[0] + 2, 142, r[2] - 4, 15]; }
var LEFTK = [[16, 86, 46, 18], [68, 86, 46, 18], [16, 128, 46, 18], [68, 128, 46, 18]]; // WRITE CLEAR COPY PASTE
var LEFTN = ["WRITE", "CLEAR", "COPY", "PASTE"];
function patRect(p) { var x0 = W - 124, cw = (114 - 9) / 4; return [x0 + (p % 4) * (cw + 3), 84 + Math.floor(p / 4) * 19, cw, 15]; }
function inR(x, y, r) { return x >= r[0] && x <= r[0] + r[2] && y >= r[1] && y <= r[1] + r[3]; }

// ---------- palette (charcoal panel, red / orange / yellow / cream keys) ----------
var PANEL = [0.20, 0.20, 0.19], PANELHI = [0.26, 0.26, 0.25], BLACK = [0.07, 0.07, 0.07],
    INK = [0.12, 0.12, 0.12], CREAM = [0.93, 0.90, 0.80], TXT = [0.90, 0.88, 0.80], DIM = [0.55, 0.54, 0.50],
    ORANGE = [0.97, 0.46, 0.10], LED = [1, 0.16, 0.10], BLUE = [0.20, 0.55, 1.0], LEDOFF = [0.34, 0.07, 0.05], NUMRED = [0.96, 0.28, 0.14],
    AMBER = [0.98, 0.70, 0.18];
var KEYC = [[0.84, 0.18, 0.12], [0.96, 0.48, 0.12], [0.98, 0.84, 0.26], [0.93, 0.90, 0.80]];

function col(c, a) { mgraphics.set_source_rgba(c[0], c[1], c[2], a === undefined ? 1 : a); }
function rect(r) { mgraphics.rectangle(r[0], r[1], r[2], r[3]); }
function font(bold, size) { mgraphics.select_font_face(bold ? "Arial Bold" : "Arial"); mgraphics.set_font_size(size); }
function fontI(size) { mgraphics.select_font_face("Arial Bold Italic"); mgraphics.set_font_size(size); }
function textC(t, cx, y, c) { var m = mgraphics.text_measure(t); col(c); mgraphics.move_to(cx - m[0] / 2, y); mgraphics.show_text(t); }
function textL(t, x, y, c) { col(c); mgraphics.move_to(x, y); mgraphics.show_text(t); }
function textR(t, x, y, c) { var m = mgraphics.text_measure(t); col(c); mgraphics.move_to(x - m[0], y); mgraphics.show_text(t); }
function pad2(n) { return (n < 10 ? "0" : "") + n; }
var NN = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
function noteName(n) { return NN[n % 12] + (Math.floor(n / 12) - 2); }
function patHas(p) { for (var i = 0; i < NI; i++) for (var s = 0; s < NS; s++) if (pats[p][i][s]) return true; return false; }
function shade(c, k) { return [Math.min(1, c[0] * k), Math.min(1, c[1] * k), Math.min(1, c[2] * k)]; }

function keyTR(r, c, pressed) {
    col([0.02, 0.02, 0.02]); rect([r[0] - 2, r[1] - 2, r[2] + 4, r[3] + 4]); mgraphics.fill();
    col(pressed ? shade(c, 0.72) : c); rect(r); mgraphics.fill();
    col([1, 1, 1], pressed ? 0.05 : 0.28); rect([r[0], r[1], r[2], 3]); mgraphics.fill();
    col([0, 0, 0], 0.28); rect([r[0], r[1] + r[3] - 4, r[2], 4]); mgraphics.fill();
    col([0, 0, 0], 0.10); rect([r[0] + 4, r[1] + 6, r[2] - 8, r[3] - 12]); mgraphics.fill();
}
function led(x, y, on, c) {
    var off = (c === BLUE) ? [0.05, 0.12, 0.30] : LEDOFF;
    if (on) { col(c || LED, 0.35); mgraphics.ellipse(x - 7, y - 7, 14, 14); mgraphics.fill(); }
    col(on ? (c || LED) : off); mgraphics.ellipse(x - 3.5, y - 3.5, 7, 7); mgraphics.fill();
    if (on) { col(c === BLUE ? [0.8, 0.9, 1] : [1, 0.8, 0.7], 0.8); mgraphics.ellipse(x - 1.5, y - 2.5, 2.5, 2); mgraphics.fill(); }
}
// TR-style knob: black skirt, cream/orange cap, white pointer
function knob(cx, cy, kr, nrm, capc) {
    col([0.02, 0.02, 0.02]); mgraphics.ellipse(cx - kr - 1.5, cy - kr - 1.5, (kr + 1.5) * 2, (kr + 1.5) * 2); mgraphics.fill();
    col([0.13, 0.13, 0.13]); mgraphics.ellipse(cx - kr, cy - kr, kr * 2, kr * 2); mgraphics.fill();
    col(capc); mgraphics.ellipse(cx - kr + 3, cy - kr + 3, kr * 2 - 6, kr * 2 - 6); mgraphics.fill();
    col([1, 1, 1], 0.25); mgraphics.ellipse(cx - kr + 5, cy - kr + 4, kr - 3, kr * 0.7); mgraphics.fill();
    var va = (-135 + nrm * 270) * Math.PI / 180;
    col(INK); mgraphics.set_line_width(2.5);
    mgraphics.move_to(cx, cy); mgraphics.line_to(cx + Math.sin(va) * (kr - 2), cy - Math.cos(va) * (kr - 2)); mgraphics.stroke();
}

function drawSwitch(cx, cy, on) { // two-position slide switch: EARLY (left) / LATE (right)
    col([0.02, 0.02, 0.02]); rect([cx - 15, cy - 7, 30, 14]); mgraphics.fill();
    col([0.16, 0.16, 0.16]); rect([cx - 13.5, cy - 5.5, 27, 11]); mgraphics.fill();
    col(CREAM); rect([on ? cx + 0.5 : cx - 12.5, cy - 4.5, 12, 9]); mgraphics.fill();
    col([0, 0, 0], 0.25); rect([on ? cx + 6 : cx - 7, cy - 4.5, 1, 9]); mgraphics.fill();
}
function paint() {
    // ----- charcoal top strip -----
    col(PANEL); rect([0, 0, W, H]); mgraphics.fill();
    for (var g = 0; g < 58; g += 3) { col([1, 1, 1], 0.025); rect([0, g, W, 1]); mgraphics.fill(); }
    col(ORANGE); rect([0, 57, W, 2]); mgraphics.fill();

    // mute / solo section
    var anySolo = 0; for (var v0 = 1; v0 < NV; v0++) if (solo[v0]) anySolo = 1;
    font(1, 7); textL("M", 12, 28, TXT); textL("S", 12, 48, TXT);
    for (var v = 1; v < NV; v++) {
        var mr = msRect(0, v), sr = msRect(1, v);
        var silent = mute[v] || (anySolo && !solo[v]);
        font(1, 7); textC(NAMES[v], mr[0] + mr[2] / 2, 12, v === inst ? ORANGE : (silent ? DIM : TXT));
        col(BLACK); rect([mr[0] - 1, mr[1] - 1, mr[2] + 2, mr[3] + 2]); mgraphics.fill();
        col(mute[v] ? KEYC[0] : PANELHI); rect(mr); mgraphics.fill();
        col(BLACK); rect([sr[0] - 1, sr[1] - 1, sr[2] + 2, sr[3] + 2]); mgraphics.fill();
        col(solo[v] ? AMBER : PANELHI); rect(sr); mgraphics.fill();
        if (!mute[v]) { col([1, 1, 1], 0.12); rect([mr[0], mr[1], mr[2], 2]); mgraphics.fill(); }
        if (!solo[v]) { col([1, 1, 1], 0.12); rect([sr[0], sr[1], sr[2], 2]); mgraphics.fill(); }
    }
    col(DIM); rect([MSX + (NV - 1) * (MSCW + 2) + 6, 6, 1, 46]); mgraphics.fill();

    // instrument select knob + labels
    for (var i = 0; i < POS.length; i++) {
        var lp = labelPos(i), sel = posOf(inst)[0] === i, lab = posLabel(i);
        if (POS[i].length > 1 && sel) lab = (ALT[i] ? NAMES[POS[i][0]].toLowerCase() + "\u00b7" + NAMES[POS[i][1]] : NAMES[POS[i][0]] + "\u00b7" + NAMES[POS[i][1]].toLowerCase());
        font(1, 7);
        if (lp[2] === "R") {
            textR(lab, lp[0] - 2, lp[1], sel ? ORANGE : TXT);
            col(sel ? LED : DIM); mgraphics.ellipse(lp[0] + 1, lp[1] - 4.5, sel ? 4 : 2.5, sel ? 4 : 2.5); mgraphics.fill();
        } else {
            col(sel ? LED : DIM); mgraphics.ellipse(lp[0] - 3, lp[1] - 4.5, sel ? 4 : 2.5, sel ? 4 : 2.5); mgraphics.fill();
            textL(lab, lp[0] + 4, lp[1], sel ? ORANGE : TXT);
        }
    }
    knob(KNOB[0], KNOB[1] - 3, KNOB[2], posOf(inst)[0] / (POS.length - 1), CREAM);
    font(1, 6); textC("SELECT", KNOB[0], 55, TXT);

    // voice knob area
    col([0, 0, 0], 0.22); rect(VOICE_AREA); mgraphics.fill();
    col([1, 1, 1], 0.10); mgraphics.set_line_width(1); rect([VOICE_AREA[0] + 0.5, VOICE_AREA[1] + 0.5, VOICE_AREA[2] - 1, VOICE_AREA[3] - 1]); mgraphics.stroke();
    var grp = GROUPS[inst];
    for (var kk = 0; kk < grp.length; kk++) {
        var d = DV[grp[kk]]; if (!d) continue;
        var vr = vknobRect(kk), cx = vr[0] + vr[2] / 2, cy = vr[1] + 28, kr = 10;
        font(1, 7); textC(d.label.toUpperCase(), cx, vr[1] + 9, TXT);
        if (d.unit === 6 || d.unit === 12) { drawSwitch(cx, cy, d.val >= 0.5); font(1, 8); textC(fmtVal(d), cx, vr[1] + 51, TXT); continue; }
        var nrm = toN(d);
        for (var t = 0; t <= 10; t++) {
            var ta = (-135 + t * 27) * Math.PI / 180;
            col(DIM); mgraphics.set_line_width(1);
            mgraphics.move_to(cx + Math.sin(ta) * (kr + 3), cy - Math.cos(ta) * (kr + 3));
            mgraphics.line_to(cx + Math.sin(ta) * (kr + 5), cy - Math.cos(ta) * (kr + 5)); mgraphics.stroke();
        }
        if (d.def !== undefined) { // red default-position dot, like the TR knob markings
            var dn = Math.pow((d.def - d.min) / (d.max - d.min), 1 / (d.exp || 1)), da = (-135 + dn * 270) * Math.PI / 180;
            col(LED); mgraphics.ellipse(cx + Math.sin(da) * (kr + 7.5) - 1.6, cy - Math.cos(da) * (kr + 7.5) - 1.6, 3.2, 3.2); mgraphics.fill();
        }
        knob(cx, cy, kr, nrm, d.label === "Level" || d.label === "Accent" || d.label === "Volume" ? ORANGE : CREAM);
        font(1, 8); textC(fmtVal(d), cx, vr[1] + 51, TXT);
    }
    // LAST STEP / CH / NOTE
    var vals = [["LAST STEP", pad2(plen[editPat])], ["CHANNEL", "" + editCh], [NAMES[inst] + " NOTE", inst === AC ? "ACC" : noteName(NOTES[inst]) + " " + NOTES[inst]]];
    for (var v = 0; v < 3; v++) {
        var r = VALS[v];
        font(1, 7); textC(vals[v][0], r[0] + r[2] / 2, r[1] - 2, TXT);
        col(BLACK); rect([r[0], r[1] + 2, r[2], r[3] - 2]); mgraphics.fill();
        font(1, 14); textC(vals[v][1], r[0] + r[2] / 2, r[1] + 24, NUMRED);
    }

    // title
    font(0, 6); textR("ticcoross.gumroad.com", W - 14, 9, DIM);
    fontI(24); textR("DIODE 909", W - 14, 33, CREAM);
    // colour stripes under the logo
    var lw = mgraphics.text_measure("DIODE 909")[0], sx = W - 14 - lw, sw = lw / 4;
    for (var sc = 0; sc < 4; sc++) { col(KEYC[sc]); rect([sx + sc * sw, 38, sw, 3]); mgraphics.fill(); }
    font(0, 11); textR("Rhythm Composer", W - 14, 53, TXT);

    // ----- black sequencer section -----
    col(BLACK); rect([0, 60, W, H - 60]); mgraphics.fill();
    col([0.38, 0.38, 0.36]); mgraphics.set_line_width(1);
    rect([4.5, 64.5, 116, H - 69]); mgraphics.stroke();
    rect([W - 128.5, 64.5, 124, H - 69]); mgraphics.stroke();
    rect([SX - 4.5, 64.5, SW() + 9, H - 69]); mgraphics.stroke();

    // left keys
    font(1, 8);
    for (var k = 0; k < 4; k++) {
        var r = LEFTK[k], nm = LEFTN[k];
        textC(nm, r[0] + r[2] / 2, r[1] - 6, CREAM);
        keyTR(r, CREAM, flash[nm] || (k === 0 && rec));
    }
    led(14, 77, rec, LED);
    font(0, 7); textC("ALT: FLAM", 91, 160, DIM);
    font(0, 7); textC("v" + VERSION, 39, 160, DIM);

    // colour bands over the four step groups (TR style)
    for (var gq = 0; gq < 4; gq++) {
        var a = stepRect(gq * 4), b = stepRect(gq * 4 + 3);
        col(KEYC[gq]); rect([a[0], 70, b[0] + b[2] - a[0], 3]); mgraphics.fill();
        font(1, 7); textC(["1ST", "2ND", "3RD", "4TH"][gq] + " BEAT", (a[0] + b[0] + b[2]) / 2, 83, DIM);
    }

    // steps
    var showHead = playing && editPat === playPat && pos >= 0;
    for (var s = 0; s < NS; s++) {
        var r = stepRect(s), on = pats[editPat][inst][s], inactive = s >= plen[editPat];
        var head = showHead && s === pos, acc = pats[editPat][AC][s];
        var lp2 = ledPos(s);
        led(lp2[0], lp2[1], on && !inactive, on === 2 ? BLUE : LED);
        keyTR(r, KEYC[Math.floor(s / 4)], head);
        if (head) { col(CREAM); mgraphics.set_line_width(1.5); rect([r[0] - 3.5, r[1] - 3.5, r[2] + 7, r[3] + 7]); mgraphics.stroke(); }
        if (inactive) { col(BLACK, 0.65); rect([r[0] - 2, r[1] - 2, r[2] + 4, r[3] + 4]); mgraphics.fill(); }
        var nr = numRect(s);
        if (acc && inst !== AC) { col(CREAM); rect(nr); mgraphics.fill(); }
        font(1, 10); textC("" + (s + 1), nr[0] + nr[2] / 2, nr[1] + 11, acc && inst !== AC ? INK : (inactive ? [0.35, 0.33, 0.30] : CREAM));
    }

    // right: patterns
    font(1, 8); textC(chain.length ? "CHAIN  " + (chainPos >= 0 ? chainPos + 1 : 1) + "/" + chain.length : "PATTERN", W - 66, 77, chain.length ? AMBER : CREAM);
    for (var p = 0; p < NP; p++) {
        var r = patRect(p), fill = PANELHI, tc = TXT;
        if (p === playPat) { fill = ORANGE; tc = INK; }
        if (p === queued) { fill = blink ? AMBER : [0.45, 0.30, 0.10]; tc = INK; }
        col(fill); rect(r); mgraphics.fill();
        if (p === editPat) { col(CREAM); mgraphics.set_line_width(1.5); rect([r[0] - 1.5, r[1] - 1.5, r[2] + 3, r[3] + 3]); mgraphics.stroke(); }
        font(1, 8); textC("" + (p + 1), r[0] + r[2] / 2, r[1] + 11, tc);
        var cn = []; for (var c = 0; c < chain.length; c++) if (chain[c] === p) cn.push(c + 1);
        if (cn.length) { col(AMBER); rect([r[0], r[1] + r[3] - 2, r[2], 2]); mgraphics.fill(); font(1, 5); textL(cn.join(","), r[0] + 1.5, r[1] + 6, p === playPat ? INK : AMBER); }
        if (patHas(p) && p !== playPat) { col(LED); mgraphics.ellipse(r[0] + r[2] - 5, r[1] + 2, 3, 3); mgraphics.fill(); }
    }
}

// ---------- mouse ----------
function onclick(x, y, but, cmd, shift, capslock, option) {
    dragMode = null;
    if (x >= W - 140 && y < 57) { max.launchbrowser("https://ticcoross.gumroad.com/"); return; }
    for (var v = 1; v < NV; v++) {
        if (inR(x, y, msRect(0, v))) { mute[v] = mute[v] ? 0 : 1; sendMS(); changed(); return; }
        if (inR(x, y, msRect(1, v))) {
            if (cmd) { for (var q = 1; q < NV; q++) solo[q] = 0; solo[v] = 1; } else solo[v] = solo[v] ? 0 : 1;
            sendMS(); changed(); return;
        }
    }
    for (var v1 = 1; v1 < NV; v1++) { var nr0 = msRect(0, v1); if (inR(x, y, [nr0[0], 3, nr0[2], 12])) { setInst(v1); return; } }
    var grp0 = GROUPS[inst];
    for (var kk = 0; kk < grp0.length; kk++) if (inR(x, y, vknobRect(kk)) && DV[grp0[kk]]) {
        if (DV[grp0[kk]].unit === 6 || DV[grp0[kk]].unit === 12) { DV[grp0[kk]].val = DV[grp0[kk]].val >= 0.5 ? 0 : 1; sendDial(grp0[kk]); mgraphics.redraw(); return; }
        dragMode = "vknob"; vName = grp0[kk]; dragY = y; dragStart = toN(DV[vName]); vFine = shift; return;
    }
    for (var s = 0; s < NS; s++) if (inR(x, y, stepRect(s)) || inR(x, y, [stepRect(s)[0], 86, stepRect(s)[2], 16])) {
        if (option && inst !== AC) { paintVal = pats[editPat][inst][s] === 2 ? 1 : 2; } // Alt/Option: flam step (blue LED)
        else paintVal = pats[editPat][inst][s] ? 0 : 1;
        pats[editPat][inst][s] = paintVal;
        dragMode = "paint"; changed(); return;
    }
    for (var p = 0; p < NP; p++) if (inR(x, y, patRect(p))) {
        if (shift) { if (chain.length < 32) chain.push(p); editPat = chain[0]; sendChain(); changed(); return; }
        if (chain.length) { chain = []; sendChain(); notifyclients(); }
        selectPattern(p); return;
    }
    for (var i = 0; i < POS.length; i++) if (inR(x, y, labelRect(i))) {
        if (POS[i].length > 1 && posOf(inst)[0] === i) setInst(POS[i][1 - posOf(inst)[1]]); else setPos(i);
        return;
    }
    var dx = x - KNOB[0], dy = y - (KNOB[1] - 3);
    if (dx * dx + dy * dy <= (KNOB[2] + 3) * (KNOB[2] + 3)) { dragMode = "knob"; dragY = y; dragStart = posOf(inst)[0]; return; }
    for (var k = 0; k < 4; k++) if (inR(x, y, LEFTK[k])) {
        if (k === 0) { rec = rec ? 0 : 1; mgraphics.redraw(); }
        else if (k === 1) { if (shift) { for (var q = 0; q < NS; q++) pats[editPat][inst][q] = 0; } else pats[editPat] = emptyPat(); doFlash("CLEAR"); changed(); }
        else if (k === 2) { clip = { p: JSON.parse(JSON.stringify(pats[editPat])), l: plen[editPat] }; doFlash("COPY"); }
        else { if (clip) { pats[editPat] = JSON.parse(JSON.stringify(clip.p)); plen[editPat] = clip.l; } doFlash("PASTE"); changed(); }
        return;
    }
    if (inR(x, y, VALS[0])) { dragMode = "len"; dragY = y; dragStart = plen[editPat]; return; }
    if (inR(x, y, VALS[1])) { dragMode = "ch"; dragY = y; dragStart = editCh; return; }
}
function ondblclick(x, y) {
    var g = GROUPS[inst];
    for (var k = 0; k < g.length; k++) if (inR(x, y, vknobRect(k)) && DV[g[k]] && DV[g[k]].def !== undefined) {
        DV[g[k]].val = DV[g[k]].def; sendDial(g[k]); dragMode = null; mgraphics.redraw(); return;
    }
    onclick(x, y, 1, 0, 0);
}
function ondrag(x, y, but, cmd, shift, capslock, option) {
    if (!but) { dragMode = null; return; }
    if (dragMode === "vknob") {
        var d = DV[vName];
        var nv = fromN(d, dragStart + (dragY - y) / (vFine ? 600 : 150));
        if (nv !== d.val) { d.val = nv; sendDial(vName); mgraphics.redraw(); }
        return;
    }
    if (dragMode === "paint") {
        for (var s = 0; s < NS; s++) { var r = stepRect(s); if (x >= r[0] && x <= r[0] + r[2] && pats[editPat][inst][s] !== paintVal) { pats[editPat][inst][s] = paintVal; changed(); } }
    } else if (dragMode === "knob") { setPos(clamp(dragStart + Math.round((dragY - y) / 6), 0, POS.length - 1)); }
    else if (dragMode === "len") { plen[editPat] = clamp(dragStart + Math.round((dragY - y) / 6), 1, 16); changed(); }
    else if (dragMode === "ch") { editCh = clamp(dragStart + Math.round((dragY - y) / 6), 1, 16); changed(); }
}
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function doFlash(k) { flash[k] = 1; mgraphics.redraw(); var t = new Task(function () { flash[k] = 0; mgraphics.redraw(); }); t.schedule(150); }

function selectPattern(p) {
    editPat = p;
    if (!playing) { playPat = p; queued = -1; outlet(0, "setplay", p); }
    else { queued = (p === playPat) ? -1 : p; outlet(0, "queue", queued); }
    mgraphics.redraw();
}

// ---------- engine sync ----------
function state(p, pp, q, pl, ci) {
    chainPos = (ci === undefined) ? -1 : ci;
    if (pp !== playPat && editPat === playPat) editPat = pp;
    pos = p; playPat = pp; queued = q; playing = pl;
    blink = 1 - blink;
    mgraphics.redraw();
}
function flamMasks() { var a = []; for (var p = 0; p < NP; p++) for (var i = 0; i < NI; i++) { var f = 0; for (var s = 0; s < NS; s++) if (pats[p][i][s] === 2) f |= (1 << s); a.push(f); } return a; }
function sync() { outlet(0, ["data"].concat(getvalueof())); outlet(0, ["flam"].concat(flamMasks())); sendMS(); }
function loadbang() { sync(); outlet(0, "setplay", playPat); }

// ---------- MIDI in ----------
// Edit channel (default 16): notes 36-51 toggle steps 1-16, 52-67 select AC,BD,SD,LT,MT,HT,RS,CP,CH,OH,CR,RD,
// 72-87 select/queue pattern 1-16. Other channels pass through; WRITE (REC) records matching notes.
function chan(c) { lastChan = c; }
function note(p, v) {
    if (lastChan === editCh) {
        if (v > 0) {
            if (p >= 36 && p <= 51) { var s = p - 36; pats[editPat][inst][s] = pats[editPat][inst][s] ? 0 : 1; changed(); }
            else if (p >= 52 && p < 52 + NV) { setInst(p - 52); }
            else if (p >= 72 && p <= 87) selectPattern(p - 72);
        }
        return;
    }
    outlet(1, p, v);
    if (rec && v > 0 && playing && pos >= 0) {
        for (var i = 1; i < NV; i++) if (NOTES[i] === p || (p === 35 && i === 1) || (p === 40 && i === 2) || (p === 41 && i === 3) || (p === 45 && i === 4) || (p === 48 && i === 5) || (p === 44 && i === 8)) {
            pats[playPat][i][pos] = 1;
            if (v >= 120) pats[playPat][AC][pos] = 1;
            changed();
        }
    }
}

// ---------- storage (saved with the Live set) ----------
function changed() { notifyclients(); sync(); mgraphics.redraw(); }
function getvalueof() {
    var a = [5, editCh];
    for (var p = 0; p < NP; p++) {
        a.push(plen[p]);
        for (var i = 0; i < NI; i++) { var m = 0; for (var s = 0; s < NS; s++) if (pats[p][i][s]) m |= (1 << s); a.push(m); }
    }
    for (var i = 0; i < NI; i++) a.push(NOTES[i]);
    for (var i = 0; i < NI; i++) { a.push(mute[i]); a.push(solo[i]); }
    a.push(chain.length); for (var c = 0; c < chain.length; c++) a.push(chain[c]);
    for (var p = 0; p < NP; p++) for (var i = 0; i < NI; i++) { var f = 0; for (var s = 0; s < NS; s++) if (pats[p][i][s] === 2) f |= (1 << s); a.push(f); }
    return a;
}
function setvalueof() {
    var a = arrayfromargs(arguments), k = 2;
    var ni0 = (a[0] >= 4) ? NI : 12;   // sets saved with v1.3 or earlier hold 12 tracks
    if (a.length < 2 + NP * (ni0 + 1)) return;
    editCh = a[1];
    for (var p = 0; p < NP; p++) {
        plen[p] = a[k++];
        for (var i = 0; i < NI; i++) { var m = i < ni0 ? a[k++] : 0; for (var s = 0; s < NS; s++) pats[p][i][s] = (m >> s) & 1; }
    }
    if (a.length >= k + ni0) k += ni0;   // stored note numbers: the note map is fixed, keep the defaults
    if (a.length >= k + ni0 * 2) for (var i = 0; i < ni0; i++) { mute[i] = a[k++]; solo[i] = a[k++]; }
    chain = []; if (a.length > k) { var cl = a[k++]; for (var c = 0; c < cl && k < a.length; c++) chain.push(a[k++]); }
    if (a[0] >= 5 && a.length >= k + NP * NI) for (var p = 0; p < NP; p++) for (var i = 0; i < NI; i++) { var f = a[k++]; for (var s = 0; s < NS; s++) if ((f >> s) & 1 && pats[p][i][s]) pats[p][i][s] = 2; }
    sendChain();
    sendMS();
    sync();
    mgraphics.redraw();
}
function onresize(w, h) { W = w; H = h; mgraphics.redraw(); }
