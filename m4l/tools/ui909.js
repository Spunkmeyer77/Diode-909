// ---------- DIODE 909 panel (TR-909 layout) ----------
// Artwork (knobs, keys, buttons) is stored as pixel data in this script (ART, see make_seq.py), so the
// frozen device needs no image files. If images can't be built, the parts are drawn in code instead.
var W = box.rect[2] - box.rect[0], H = box.rect[3] - box.rect[1];
var PANEL = [0.914, 0.902, 0.871], NAVY = [0.204, 0.227, 0.361], ORANGE = [0.925, 0.471, 0.157],
    INK = [0.157, 0.173, 0.275], DIM = [0.43, 0.43, 0.47], WHITE = [0.92, 0.92, 0.94], RED = [1, 0.27, 0.2],
    DISP = [0.235, 0.063, 0.071], BOXOFF = [0.784, 0.773, 0.737], BLUE = [0.2, 0.55, 1.0], AMBER = [0.98, 0.70, 0.18];
var LED = RED, CREAM = WHITE, TXT = INK, BLACK = [0.07, 0.07, 0.07];

// ---- artwork ----
var IMG = {}, USE_ART = false;
function b64bytes(s) {
    var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", m = {}, out = [], i, b = 0, n = 0;
    for (i = 0; i < 64; i++) m[A.charAt(i)] = i;
    for (i = 0; i < s.length; i++) {
        var c = m[s.charAt(i)]; if (c === undefined) continue;
        b = (b << 6) | c; n += 6;
        if (n >= 8) { n -= 8; out.push((b >> n) & 255); }
    }
    return out;
}
function buildArt() {
    try {
        for (var k in ART) {
            var a = ART[k], px = b64bytes(a.d), img = new Image(a.w, a.h), p = 0;
            for (var y = 0; y < a.h; y++) for (var x = 0; x < a.w; x++, p += 4)
                img.setpixel(x, y, px[p] / 255, px[p + 1] / 255, px[p + 2] / 255, px[p + 3] / 255);
            IMG[k] = img;
        }
        USE_ART = true;
    } catch (e) { USE_ART = false; IMG = {}; }
}
buildArt();
function drawArt(k, x, y, w, h) { mgraphics.image_surface_draw(IMG[k], [0, 0, ART[k].w, ART[k].h], [x, y, w, h]); }

// ---- helpers ----
function col(c, a) { mgraphics.set_source_rgba(c[0], c[1], c[2], a === undefined ? 1 : a); }
function rect(r) { mgraphics.rectangle(r[0], r[1], r[2], r[3]); }
function fillR(r, c, a) { col(c, a); rect(r); mgraphics.fill(); }
function font(bold, size) { mgraphics.select_font_face(bold ? "Arial Bold" : "Arial"); mgraphics.set_font_size(size); }
function textC(t, cx, y, c) { var m = mgraphics.text_measure(t); col(c); mgraphics.move_to(cx - m[0] / 2, y); mgraphics.show_text(t); }
function textL(t, x, y, c) { col(c); mgraphics.move_to(x, y); mgraphics.show_text(t); }
function textR(t, x, y, c) { var m = mgraphics.text_measure(t); col(c); mgraphics.move_to(x - m[0], y); mgraphics.show_text(t); }
function pad2(n) { return (n < 10 ? "0" : "") + n; }
var NN = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
function noteName(n) { return NN[n % 12] + (Math.floor(n / 12) - 2); }
function patHas(p) { for (var i = 0; i < NI; i++) for (var s = 0; s < NS; s++) if (pats[p][i][s]) return true; return false; }
function inR(x, y, r) { return x >= r[0] && x <= r[0] + r[2] && y >= r[1] && y <= r[1] + r[3]; }

// ---- sound controls (values mirror the hidden live.dials d_*) ----
function fmtVal(d) {
    var v = d.val;
    if (d.unit === 9) return Math.round(5 + 35 * v) + " ms";
    if (d.unit === 12) return v >= 0.5 ? "ECO" : "HQ";
    return (v * 10).toFixed(1);
}
function toN(d) { return (d.val - d.min) / (d.max - d.min); }
function fromN(d, n) { n = Math.max(0, Math.min(1, n)); return d.min + (d.max - d.min) * n; }
function dv(name, v) { if (DV[name]) { DV[name].val = v; mgraphics.redraw(); } }
function sendDial(name) { var o = this.patcher ? this.patcher.getnamed(name) : null; if (o) o.message("float", DV[name].val); }

// ---- layout ----
// knob groups: header, [slot0 top-left, slot1 top-right, slot2 bottom-left, slot3 bottom-right],
// instruments selected by clicking the header (left half / right half)
var X0 = 8, GW = 100, KS = 24;
var KG = [["TOTAL ACCENT", [["ACCENT", "d_ac"], ["FLAM", "d_flam"], ["QUALITY", "d_eco"], ["SWING", "d_swing"]], [0, 0]],
          ["BASS DRUM", [["TUNE", "d_bd_tune"], ["LEVEL", "d_bd_lvl"], ["ATTACK", "d_bd_attack"], ["DECAY", "d_bd_decay"]], [1, 1]],
          ["SNARE DRUM", [["TUNE", "d_sd_tune"], ["LEVEL", "d_sd_lvl"], ["TONE", "d_sd_tone"], ["SNAPPY", "d_sd_snappy"], ["RING", "d_sd_ring"]], [2, 2]],
          ["LOW TOM", [["TUNE", "d_lt_tune"], ["LEVEL", "d_lt_lvl"], ["DECAY", "d_lt_decay"], null], [3, 3]],
          ["MID TOM", [["TUNE", "d_mt_tune"], ["LEVEL", "d_mt_lvl"], ["DECAY", "d_mt_decay"], null], [4, 4]],
          ["HI TOM", [["TUNE", "d_ht_tune"], ["LEVEL", "d_ht_lvl"], ["DECAY", "d_ht_decay"], null], [5, 5]],
          ["RIM SHOT  HAND CLAP", [["LEVEL", "d_rs_lvl"], ["LEVEL", "d_cp_lvl"], null, null], [6, 7]],
          ["HI HAT", [null, ["LEVEL", "d_hh_lvl"], ["CH DECAY", "d_ch_decay"], ["OH DECAY", "d_oh_decay"]], [8, 9]],
          ["CYMBAL", [["CR LEVEL", "d_cr_lvl"], ["RD LEVEL", "d_rd_lvl"], ["CR TUNE", "d_cr_tune"], ["RD TUNE", "d_rd_tune"]], [10, 11]]];
function knobPos(g, k) {
    var x = X0 + g * GW;
    if (KG[g][1].length === 5 && k >= 2) return [x + GW / 2 + (k - 3) * 31, 72]; // three knobs on the bottom row
    return [x + GW / 2 + (k % 2 === 0 ? -23 : 23), k < 2 ? 37 : 72];
}
function headRect(g) { return [X0 + g * GW + 2, 4, GW - 4, 10]; }
var MS_GRID = false; // false: mute/solo as LEDs in the navy header bars
function msLed(v) { // the header LED of instrument v (1..11)
    for (var g = 1; g < KG.length; g++) { var sel = KG[g][2]; for (var h = 0; h < 2; h++) if (sel[h] === v && (h === 0 || sel[1] !== sel[0])) {
        var hr = headRect(g); return [h === 0 ? hr[0] + 1.5 : hr[0] + hr[2] - 9.5, hr[1] + 1, 8, 8]; } }
    return null;
}
var VOL = [W - 30, 63, 34];
var RX = X0 + 9 * GW + 10;
var MS_X = RX + 4, MS_Y = 52, MSB = 7, MSCOLS = 6, MSCW = 25, MSRH = 17, LOGO = [RX + 4, 24], PATB = 26;
function msCell(v) { var i = v - 1; return [MS_X + (i % MSCOLS) * MSCW, MS_Y + Math.floor(i / MSCOLS) * MSRH]; }
function mRect(v) { var c = msCell(v); return [c[0], c[1] + 7, MSB, MSB]; }
function sRect(v) { var c = msCell(v); return [c[0] + MSB + 1, c[1] + 7, MSB, MSB]; }
var LEFTN = ["WRITE", "CLEAR", "COPY", "PASTE"];
function leftRect(k) { return [14 + (k % 2) * 42, 96 + Math.floor(k / 2) * 34, 20, 20]; }
var KX = 104, KW = 41, KGAP = 6.6, KY = 99;
function stepRect(s) { return [KX + s * (KW + KGAP), KY, KW, KW]; }
var STRIP = [["BASS DRUM", 0, 1, 1], ["SNARE DRUM", 2, 2, 2], ["LOW TOM", 4, 3, 3], ["MID TOM", 6, 4, 4], ["HI TOM", 8, 5, 5],
             ["RIM SHOT", 10, 6, 7, "CLAP"], ["CLOSED", 12, 8, 9, "OPEN"], ["CRASH", 14, 10, 11, "RIDE"]];
function stripRect(i) { var s0 = STRIP[i][1], x0 = KX + s0 * (KW + KGAP); return [x0, 145, 2 * KW + KGAP, 10]; }
var PX = KX + 16 * (KW + KGAP) + 8;
var PATKEYS = true, PATCOLS = 8, PATCW = 36.5, PATRH = 35, PATY = 98, PATLABEL = [PX + 143, 95];
function patRect(p) { return [PX + (p % PATCOLS) * PATCW, PATY + Math.floor(p / PATCOLS) * PATRH, PATB, PATB]; }
var DX = PX + 92;
var VALS = [[RX + 4, 57, 44, 22], [RX + 54, 57, 44, 22], [RX + 104, 57, 58, 22]];
function setInst(i) { if (i >= 0 && i < NV) { inst = i; mgraphics.redraw(); } }

// ---- parts drawn in code (fallback when artwork is unavailable) ----
function knobCode(cx, cy, r, deg) {
    col([0.13, 0.14, 0.17]); mgraphics.ellipse(cx - r, cy - r, 2 * r, 2 * r); mgraphics.fill();
    col([0.27, 0.29, 0.33]); mgraphics.ellipse(cx - r + 1.5, cy - r + 1.5, 2 * r - 3, 2 * r - 3); mgraphics.fill();
    var a = deg * Math.PI / 180; col(ORANGE); mgraphics.set_line_width(1.6);
    mgraphics.move_to(cx, cy); mgraphics.line_to(cx + Math.sin(a) * (r - 1.5), cy - Math.cos(a) * (r - 1.5)); mgraphics.stroke();
}
function keyCode(r, state) { // state: 0 unlit, 1 red, 2 blue, 3 pressed
    fillR(r, [0.16, 0.16, 0.17]);
    fillR([r[0] + 2.5, r[1] + 2.5, r[2] - 5, r[3] - 5], state === 3 ? [0.62, 0.60, 0.56] : [0.74, 0.72, 0.67]);
    fillR(LEDWIN(r), state === 1 ? RED : (state === 2 ? BLUE : [0.18, 0.08, 0.08]));
}
function btnCode(r, lit, pressed) {
    fillR(r, [0.08, 0.08, 0.09]); fillR([r[0] + 1.5, r[1] + 1.5, r[2] - 3, r[3] - 3], pressed ? [0.20, 0.20, 0.21] : [0.27, 0.27, 0.28]);
    col(lit ? RED : [0.30, 0.06, 0.06]); var d = r[2] * 0.2; mgraphics.ellipse(r[0] + r[2] / 2 - d / 2, r[1] + r[3] / 2 - d / 2, d, d); mgraphics.fill();
}
function LEDWIN(r) { return [r[0] + r[2] * LEDBOX[0], r[1] + r[3] * LEDBOX[1], r[2] * LEDBOX[2], r[3] * LEDBOX[3]]; }
function knob(cx, cy, size, nrm, big) {
    var r = size / 2, deg = -135 + 270 * nrm;
    col(INK); mgraphics.set_line_width(1);
    for (var t = 0; t <= 10; t++) {
        var a = (-135 + t * 27) * Math.PI / 180;
        mgraphics.move_to(cx + Math.sin(a) * (r + 2), cy - Math.cos(a) * (r + 2));
        mgraphics.line_to(cx + Math.sin(a) * (r + 4.5), cy - Math.cos(a) * (r + 4.5)); mgraphics.stroke();
    }
    if (!USE_ART) { knobCode(cx, cy, r, deg); return; }
    drawArt(big ? "knobBig" : "knob", cx - r, cy - r, size, size, 0); // never rotated: Max can't draw rotated images
    var pa = deg * Math.PI / 180, pr = r * 0.9;
    col(ORANGE); mgraphics.set_line_width(big ? 2 : 1.5);
    mgraphics.move_to(cx + Math.sin(pa) * pr * 0.08, cy - Math.cos(pa) * pr * 0.08);
    mgraphics.line_to(cx + Math.sin(pa) * pr, cy - Math.cos(pa) * pr); mgraphics.stroke();
}
function stepKey(r, state) {
    if (!USE_ART) { keyCode(r, state); return; }
    drawArt(["keyUnlit", "keyLit", "keyBlue", "keyPressed"][state], r[0], r[1], r[2], r[3], 0);
}
function stepKeyPressedLit(r, c) { // playhead on a set step: pressed key with its LED lit
    stepKey(r, 3); var w = LEDWIN(r); w = [w[0], w[1] + 1.2, w[2], w[3]];
    col(c, 0.35); rect([w[0] - 2, w[1] - 2, w[2] + 4, w[3] + 4]); mgraphics.fill(); fillR(w, c);
}
function button(r, lit, pressed) {
    if (!USE_ART) { btnCode(r, lit, pressed); return; }
    drawArt(lit ? "btnLit" : (pressed ? "btnPressed" : "btnUnlit"), r[0], r[1], r[2], r[3], 0);
}

// QUALITY: HQ / ECO switch (two lit segments)
function qualitySwitch(cx, cy, eco) {
    var w = 15, h = 11, x = cx - w, y = cy - h / 2;
    fillR([x - 1, y - 1, 2 * w + 2, h + 2], BLACK);
    fillR([x, y, w, h], eco ? [0.30, 0.30, 0.32] : NAVY); fillR([x + w, y, w, h], eco ? NAVY : [0.30, 0.30, 0.32]);
    font(1, 6.4); textC("HQ", x + w / 2, y + 8, eco ? [0.6, 0.6, 0.62] : WHITE); textC("ECO", x + w * 1.5, y + 8, eco ? AMBER : [0.6, 0.6, 0.62]);
}

// ---- paint ----
function paint() {
    fillR([0, 0, W, H], PANEL);
    // knob section
    for (var g = 0; g < KG.length; g++) {
        var hr = headRect(g), x = X0 + g * GW, sel = KG[g][2];
        fillR(hr, NAVY);
        font(1, 6.6);
        if (sel[0] === sel[1]) textC(KG[g][0], hr[0] + hr[2] / 2, hr[1] + 7.6, inst === sel[0] ? WHITE : ORANGE);
        else {
            var parts = g === 6 ? ["RIM SHOT", "HAND CLAP"] : (g === 7 ? ["CH", "OH"] : ["CRASH", "RIDE"]);
            if (g === 7) textC("HI HAT", hr[0] + hr[2] / 2, hr[1] + 7.6, (inst === 8 || inst === 9) ? WHITE : ORANGE);
            else { font(1, g === 6 ? 5.6 : 6.6); for (var h = 0; h < 2; h++) textC(parts[h], hr[0] + hr[2] * (h ? 0.69 : 0.31), hr[1] + 7.4, inst === sel[h] ? WHITE : ORANGE); }
        }
        if (g) { col(INK); mgraphics.set_line_width(1); mgraphics.move_to(x + 0.5, 16); mgraphics.line_to(x + 0.5, 86); mgraphics.stroke(); }
        for (var k = 0; k < KG[g][1].length; k++) {
            var it = KG[g][1][k]; if (!it) continue;
            var p = knobPos(g, k), d = DV[it[1]];
            font(1, 6.2); textC(it[0], p[0], p[1] - KS / 2 - 4, INK);
            if (d && d.unit === 12) { qualitySwitch(p[0], p[1], d.val >= 0.5); continue; }
            knob(p[0], p[1], KS, d ? toN(d) : 0.5, false);
            if (dragMode === "vknob" && vName === it[1] && d) { // value while turning
                var t = fmtVal(d); font(1, 7); var m = mgraphics.text_measure(t);
                fillR([p[0] - m[0] / 2 - 3, p[1] + KS / 2 + 2, m[0] + 6, 10], NAVY); textC(t, p[0], p[1] + KS / 2 + 9.5, WHITE);
            }
        }
    }
    col(INK); mgraphics.set_line_width(1); mgraphics.move_to(X0, 86.5); mgraphics.line_to(X0 + 9 * GW, 86.5); mgraphics.stroke();

    // logo, mute/solo, volume
    mgraphics.select_font_face("Arial Bold"); mgraphics.set_font_size(21); textL("DIODE 909", LOGO[0], LOGO[1], NAVY);
    font(1, 7.6); textL("RHYTHM COMPOSER", LOGO[0] + 1, LOGO[1] + 13, NAVY);
    font(0, 5.5); textL("ticcoross.gumroad.com", LOGO[0] + 1, LOGO[1] + 22, DIM);
    var anySolo = 0; for (var v0 = 1; v0 < NV; v0++) if (solo[v0]) anySolo = 1;
    for (var vl = 1; vl < NV && !MS_GRID; vl++) {
        var lr = msLed(vl), on = solo[vl] ? [0.93, 0.91, 0.82] : (mute[vl] ? [0.86, 0.40, 0.16] : null), dark = anySolo && !solo[vl] && !mute[vl];
        if (on) {
            col(on); mgraphics.ellipse(lr[0], lr[1], lr[2], lr[3]); mgraphics.fill(); // muted: 909 orange; soloed: cream
            col([1, 1, 0.95], 0.35); mgraphics.ellipse(lr[0] + 1.8, lr[1] + 1.4, 2.4, 2); mgraphics.fill(); // soft highlight
            col([0.80, 0.82, 0.90], 0.6); mgraphics.set_line_width(0.8); mgraphics.ellipse(lr[0] + 0.4, lr[1] + 0.4, lr[2] - 0.8, lr[3] - 0.8); mgraphics.stroke(); // the same grey ring as off
        } else { // off: a lighter navy with a thin light ring, in the bar's style
            col(dark ? [0.30, 0.33, 0.50] : [0.27, 0.30, 0.45]); mgraphics.ellipse(lr[0], lr[1], lr[2], lr[3]); mgraphics.fill();
            col([0.80, 0.82, 0.90], dark ? 0.85 : 0.6); mgraphics.set_line_width(0.8); mgraphics.ellipse(lr[0] + 0.4, lr[1] + 0.4, lr[2] - 0.8, lr[3] - 0.8); mgraphics.stroke();
        }
    }
    font(1, 5.5);
    for (var v = 1; v < NV && MS_GRID; v++) {
        var c = msCell(v), silent = mute[v] || (anySolo && !solo[v]);
        textC(NAMES[v], c[0] + MSB + 0.5, c[1] + 5, v === inst ? ORANGE : (silent ? DIM : INK));
        fillR(mRect(v), mute[v] ? ORANGE : BOXOFF); fillR(sRect(v), solo[v] ? AMBER : BOXOFF);
        col(INK); mgraphics.set_line_width(0.7); rect(mRect(v)); mgraphics.stroke(); rect(sRect(v)); mgraphics.stroke();
    }
    if (MS_GRID) font(1, 5), textC("M", mRect(1)[0] + MSB / 2, MS_Y + 7 + MSB + 6, DIM); MS_GRID && textC("S", sRect(1)[0] + MSB / 2, MS_Y + 7 + MSB + 6, DIM);
    font(1, 6.2); textC("VOLUME", VOL[0], VOL[1] - VOL[2] / 2 - 4, INK);
    knob(VOL[0], VOL[1], VOL[2], toN(DV["d_vol"]), true);
    if (dragMode === "vknob" && vName === "d_vol") { var tv = fmtVal(DV["d_vol"]); font(1, 7); textC(tv, VOL[0], VOL[1] + VOL[2] / 2 + 9.5, NAVY); }

    // left block
    col(INK); mgraphics.set_line_width(1); rect([4.5, 90.5, 92, 75]); mgraphics.stroke();
    for (var k2 = 0; k2 < 4; k2++) {
        var r = leftRect(k2);
        button(r, k2 === 0 && rec, !!flash[LEFTN[k2]]);
        font(1, 5.8); textC(LEFTN[k2], r[0] + r[2] / 2, r[1] + 27, INK);
    }

    // 4/4 guide: a navy bracket over each group of four keys, a downbeat marker on 1, 5, 9, 13
    for (var gq = 0; gq < 4; gq++) {
        var a0 = stepRect(gq * 4), a3 = stepRect(gq * 4 + 3);
        fillR([a0[0], 88.5, a3[0] + a3[2] - a0[0], 1.4], NAVY);
        fillR([a0[0], 88.5, 1.4, 4], NAVY); fillR([a3[0] + a3[2] - 1.4, 88.5, 1.4, 4], NAVY);
    }
    // steps
    var showHead = playing && editPat === playPat && pos >= 0;
    for (var s = 0; s < NS; s++) {
        var sr = stepRect(s), on = pats[editPat][inst][s], inactive = s >= plen[editPat];
        var head = showHead && s === pos, acc = pats[editPat][AC][s] && inst !== AC;
        var down = s % 4 === 0;
        if (acc) fillR([sr[0] + sr[2] / 2 - 8, 90.5, 16, 7.5], ORANGE);
        else if (down) fillR([sr[0] + sr[2] / 2 - 8, 90.5, 16, 7.5], NAVY);
        font(1, down ? 7 : 6.2); textC("" + (s + 1), sr[0] + sr[2] / 2, 96.6, acc || down ? WHITE : INK);
        var lit = on && !inactive;
        if (head && lit) stepKeyPressedLit(sr, on === 2 ? BLUE : RED);
        else stepKey(sr, head ? 3 : (lit ? (on === 2 ? 2 : 1) : 0));
        if (inactive) fillR([sr[0], sr[1], sr[2], sr[3]], PANEL, 0.55);
    }
    // instrument strip
    for (var i = 0; i < STRIP.length; i++) {
        var st = STRIP[i], rr = stripRect(i);
        fillR(rr, NAVY); font(1, 6.4);
        if (!st[4]) textC(st[0], rr[0] + rr[2] / 2, rr[1] + 7.4, inst === st[2] ? ORANGE : WHITE);
        else {
            textC(st[0], rr[0] + rr[2] * 0.3, rr[1] + 7.4, inst === st[2] ? ORANGE : WHITE);
            textC("·", rr[0] + rr[2] * 0.58, rr[1] + 7.4, WHITE);
            textC(st[4], rr[0] + rr[2] * 0.78, rr[1] + 7.4, inst === st[3] ? ORANGE : WHITE);
        }
    }
    font(0, 5.2); textL("ALT-CLICK A KEY: FLAM   ·   CLICK A NAME: SELECT   ·   BAR LED: MUTE (ALT-CLICK: SOLO)   ·   TOTAL ACCENT: ACCENT TRACK", KX, 163.5, DIM);

    // patterns
    font(1, 6.2); textC(chain.length ? "CHAIN " + (chainPos >= 0 ? chainPos + 1 : 1) + "/" + chain.length : "PATTERN", PATLABEL[0], PATLABEL[1], chain.length ? ORANGE : INK);
    for (var pp = 0; pp < NP; pp++) {
        var pr = patRect(pp), litP = pp === playPat || (pp === queued && blink), has = patHas(pp);
        if (PATKEYS) {
            stepKey(pr, litP ? 1 : 0);
            font(1, 8.5); textC("" + (pp + 1), pr[0] + pr[2] / 2, pr[1] + pr[3] * 0.72, has || litP ? INK : [0.55, 0.54, 0.52]);
        } else {
            button(pr, litP, false);
        }
        if (pp === editPat) { col(ORANGE); mgraphics.set_line_width(1.6); rect([pr[0] - 1.5, pr[1] - 1.5, pr[2] + 3, pr[3] + 3]); mgraphics.stroke(); }
        var cn = []; for (var c2 = 0; c2 < chain.length; c2++) if (chain[c2] === pp) cn.push(c2 + 1);
        if (PATKEYS) { if (cn.length) { font(1, 5.2); var cw = mgraphics.text_measure(cn.join(","))[0] + 4; fillR([pr[0] + pr[2] / 2 - cw / 2, pr[1] + pr[3] + 0.5, cw, 6.5], ORANGE); textC(cn.join(","), pr[0] + pr[2] / 2, pr[1] + pr[3] + 5.6, WHITE); } }
        else { font(1, PATB > 14 ? 6.5 : 5.2); textL(cn.length ? cn.join(",") : "" + (pp + 1), pr[0] + pr[2] + 1.5, pr[1] + PATB * 0.68, cn.length ? ORANGE : (has ? INK : DIM)); }
    }
    // displays
    var vals = [["LAST STEP", pad2(plen[editPat])], ["CHANNEL", "" + editCh], [NAMES[inst] + " NOTE", inst === AC ? "ACC" : noteName(NOTES[inst]) + " " + NOTES[inst]]];
    for (var q = 0; q < 3; q++) {
        var vr = VALS[q];
        font(1, 5.6); textC(vals[q][0], vr[0] + vr[2] / 2, vr[1] - 3, INK);
        fillR(vr, DISP); col(BLACK); mgraphics.set_line_width(1); rect(vr); mgraphics.stroke();
        font(1, 11); textC(vals[q][1], vr[0] + vr[2] / 2, vr[1] + 15.5, RED);
    }
    font(0, 5); textR("v" + VERSION, W - 6, 165, DIM);
    led_rec_dummy = 0;
}
var led_rec_dummy = 0;

// ---- mouse ----
function knobAt(x, y) {
    for (var g = 0; g < KG.length; g++) for (var k = 0; k < KG[g][1].length; k++) {
        var it = KG[g][1][k]; if (!it) continue;
        var p = knobPos(g, k), dx = x - p[0], dy = y - p[1];
        if (dx * dx + dy * dy <= 14 * 14) return it[1];
    }
    var vx = x - VOL[0], vy = y - VOL[1];
    if (vx * vx + vy * vy <= (VOL[2] / 2 + 3) * (VOL[2] / 2 + 3)) return "d_vol";
    return null;
}
function onclick(x, y, but, cmd, shift, capslock, option) {
    dragMode = null;
    if (x >= LOGO[0] && y < LOGO[1] + 24 && y > LOGO[1] - 22 && x < LOGO[0] + 116) { max.launchbrowser("https://ticcoross.gumroad.com/"); return; }
    var kn = knobAt(x, y);
    if (kn && DV[kn] && DV[kn].unit === 12) { DV[kn].val = DV[kn].val >= 0.5 ? 0 : 1; sendDial(kn); mgraphics.redraw(); return; }
    if (kn && DV[kn]) { dragMode = "vknob"; vName = kn; dragY = y; dragStart = toN(DV[kn]); vFine = shift; mgraphics.redraw(); return; }
    for (var vl = 1; vl < NV && !MS_GRID; vl++) { var lr = msLed(vl); if (inR(x, y, [lr[0] - 2, lr[1] - 1, lr[2] + 4, lr[3] + 2])) {
        if (option || cmd) { if (cmd) { for (var q0 = 1; q0 < NV; q0++) if (q0 !== vl) solo[q0] = 0; } solo[vl] = solo[vl] ? 0 : 1; }
        else mute[vl] = mute[vl] ? 0 : 1;
        sendMS(); changed(); return;
    } }
    for (var g = 0; g < KG.length; g++) if (inR(x, y, headRect(g))) {
        var hr = headRect(g), sel = KG[g][2];
        setInst(x < hr[0] + hr[2] / 2 ? sel[0] : sel[1]); return;
    }
    for (var v = 1; v < NV && MS_GRID; v++) {
        if (inR(x, y, [mRect(v)[0] - 1, mRect(v)[1] - 1, MSB + 1, MSB + 2])) { mute[v] = mute[v] ? 0 : 1; sendMS(); changed(); return; }
        if (inR(x, y, [sRect(v)[0], sRect(v)[1] - 1, MSB + 1, MSB + 2])) {
            if (cmd) { for (var q = 1; q < NV; q++) solo[q] = 0; solo[v] = 1; } else solo[v] = solo[v] ? 0 : 1;
            sendMS(); changed(); return;
        }
        var c = msCell(v); if (inR(x, y, [c[0], c[1] - 1, 2 * MSB + 1, 7])) { setInst(v); return; }
    }
    for (var s = 0; s < NS; s++) { var sr = stepRect(s); if (inR(x, y, [sr[0], 88, sr[2], KY + KW - 88])) {
        if (option && inst !== AC) paintVal = pats[editPat][inst][s] === 2 ? 1 : 2; // Alt/Option: flam step (blue LED)
        else paintVal = pats[editPat][inst][s] ? 0 : 1;
        pats[editPat][inst][s] = paintVal;
        dragMode = "paint"; changed(); return;
    } }
    for (var i = 0; i < STRIP.length; i++) { var rr = stripRect(i); if (inR(x, y, rr)) {
        var st = STRIP[i];
        if (!st[4]) setInst(st[2]);
        else if (shift) setInst(st[3]);
        else if (x > rr[0] + rr[2] * 0.58) setInst(st[3]);
        else setInst(st[2]);
        return;
    } }
    for (var p = 0; p < NP; p++) if (inR(x, y, [patRect(p)[0] - 1, patRect(p)[1] - 1, PATB + (PATKEYS ? 2 : 8), PATB + 2])) {
        if (shift) { if (chain.length < 32) chain.push(p); editPat = chain[0]; sendChain(); changed(); return; }
        if (chain.length) { chain = []; sendChain(); notifyclients(); }
        selectPattern(p); return;
    }
    for (var k = 0; k < 4; k++) if (inR(x, y, [leftRect(k)[0] - 4, leftRect(k)[1] - 2, 28, 34])) {
        if (k === 0) { rec = rec ? 0 : 1; mgraphics.redraw(); }
        else if (k === 1) { if (shift) { for (var q2 = 0; q2 < NS; q2++) pats[editPat][inst][q2] = 0; } else pats[editPat] = emptyPat(); doFlash("CLEAR"); changed(); }
        else if (k === 2) { clip = { p: JSON.parse(JSON.stringify(pats[editPat])), l: plen[editPat] }; doFlash("COPY"); }
        else { if (clip) { pats[editPat] = JSON.parse(JSON.stringify(clip.p)); plen[editPat] = clip.l; } doFlash("PASTE"); changed(); }
        return;
    }
    if (inR(x, y, VALS[0])) { dragMode = "len"; dragY = y; dragStart = plen[editPat]; return; }
    if (inR(x, y, VALS[1])) { dragMode = "ch"; dragY = y; dragStart = editCh; return; }
}
function ondblclick(x, y) {
    var kn = knobAt(x, y);
    if (kn && DV[kn] && DV[kn].unit === 12) { onclick(x, y, 1, 0, 0); return; }
    if (kn && DV[kn] && DV[kn].def !== undefined) { DV[kn].val = DV[kn].def; sendDial(kn); dragMode = null; mgraphics.redraw(); return; }
    onclick(x, y, 1, 0, 0);
}
function ondrag(x, y, but, cmd, shift, capslock, option) {
    if (!but) { if (dragMode === "vknob") { dragMode = null; mgraphics.redraw(); } dragMode = null; return; }
    if (dragMode === "vknob") {
        var d = DV[vName], nv = fromN(d, dragStart + (dragY - y) / (shift ? 600 : 150));
        if (nv !== d.val) { d.val = nv; sendDial(vName); mgraphics.redraw(); }
        return;
    }
    if (dragMode === "paint") {
        for (var s = 0; s < NS; s++) { var r = stepRect(s); if (x >= r[0] && x <= r[0] + r[2] && pats[editPat][inst][s] !== paintVal) { pats[editPat][inst][s] = paintVal; changed(); } }
    } else if (dragMode === "len") { plen[editPat] = clamp(dragStart + Math.round((dragY - y) / 6), 1, 16); changed(); }
    else if (dragMode === "ch") { editCh = clamp(dragStart + Math.round((dragY - y) / 6), 1, 16); changed(); }
}
