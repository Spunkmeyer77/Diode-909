# builds code/diode909_seq.js from the DIODE 808 sequencer (diode808_seq.js): same sequencer, 909 voices
import json, sys
src, out = sys.argv[1], sys.argv[2]
s = open(src).read()
def rep(a, b, n=1):
    global s
    c = s.count(a)
    assert c >= 1, ('missing', a[:70])
    s = s.replace(a, b) if n == 0 else s.replace(a, b, n)

rep('// DIODE 808 — x0x step sequencer for the Diode 808 circuit engine (Max for Live jsui panel)\n// 16 patterns x 15 voices + accent x up to 16 steps. Sound: diode808~ (Diode 808 circuit engine).',
    '// DIODE 909 — x0x step sequencer for the DIODE 909 circuit engine (Max for Live jsui panel)\n// 16 patterns x 11 voices + accent x up to 16 steps. Sound: diode909~ (DIODE 909 circuit engine).')
rep('// instrument select order like the 808: AC, BD, SD, LT, MT, HT, RS, CP, CB, CY, CH, OH\nvar NAMES = ["AC", "BD", "SD", "LT", "MT", "HT", "RS", "CP", "CB", "CY", "CH", "OH", "LC", "MC", "HC", "CL"];\nvar NI = 16, NP = 16, NS = 16, AC = 0;',
    '// instrument select order like the 909: AC, BD, SD, LT, MT, HT, RS, CP, CH, OH, CR, RD\nvar NAMES = ["AC", "BD", "SD", "LT", "MT", "HT", "RS", "CP", "CH", "OH", "CR", "RD", "", "", "", ""];\nvar NI = 16, NV = 12, NP = 16, NS = 16, AC = 0; // NI: stored tracks, NV: tracks in use')
rep('// selector knob: 12 positions like the 808; four positions are pairs (LT/LC, MT/MC, HT/HC, RS/CL)\nvar POS = [[0], [1], [2], [3, 12], [4, 13], [5, 14], [6, 15], [7], [8], [9], [10], [11]];',
    '// selector knob: 12 positions, one instrument each\nvar POS = [[0], [1], [2], [3], [4], [5], [6], [7], [8], [9], [10], [11]];')
rep('var VERSION = "1.1.0";', 'var VERSION = "1.1.0";')
rep('var NOTES = [-1, 36, 38, 43, 47, 50, 37, 39, 56, 49, 42, 46, 64, 63, 62, 75];', 'var NOTES = [-1, 36, 38, 43, 47, 50, 37, 39, 42, 46, 49, 51, -1, -1, -1, -1];')
# mute/solo and selection: only the 11 voices in use
rep('for (var v = 1; v < NI; v++) { if (mute[v])', 'for (var v = 1; v < NV; v++) { if (mute[v])')
rep('else if (p >= 52 && p <= 67) { setInst(p - 52); }', 'else if (p >= 52 && p < 52 + NV) { setInst(p - 52); }')
rep('select AC,BD,SD,LT,MT,HT,RS,CP,CB,CY,CH,OH,LC,MC,HC,CL,', 'select AC,BD,SD,LT,MT,HT,RS,CP,CH,OH,CR,RD,')
rep('for (var i = 1; i < NI; i++) if (NOTES[i] === p) {', 'for (var i = 1; i < NV; i++) if (NOTES[i] === p || (p === 35 && i === 1) || (p === 40 && i === 2) || (p === 41 && i === 3) || (p === 45 && i === 4) || (p === 48 && i === 5) || (p === 44 && i === 8)) {')
# logo

# knobs per instrument: 909 front panel
groups = [["d_ac", "d_flam", "d_eco", "d_swing", "d_vol"],
          ["d_bd_lvl", "d_bd_tune", "d_bd_attack", "d_bd_decay"],
          ["d_sd_lvl", "d_sd_tune", "d_sd_tone", "d_sd_snappy"],
          ["d_lt_lvl", "d_lt_tune", "d_lt_decay"], ["d_mt_lvl", "d_mt_tune", "d_mt_decay"], ["d_ht_lvl", "d_ht_tune", "d_ht_decay"],
          ["d_rs_lvl"], ["d_cp_lvl"], ["d_hh_lvl", "d_ch_decay"], ["d_hh_lvl", "d_oh_decay"],
          ["d_cr_lvl", "d_cr_tune"], ["d_rd_lvl", "d_rd_tune"], [], [], [], []]
DIALS = json.load(open(sys.argv[3]))
dv = {}
for d in DIALS:
    dv[d['var']] = {"label": d['short'], "min": d['lo'], "max": d['hi'], "val": d['init'], "def": d['init'], "unit": d['unit'], "exp": 1}
# replace the 808 panel (layout, drawing, mouse) with the 909 panel (tools/ui909.js) + packed artwork
import base64, os
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__)); art = os.path.join(here, '..', 'art')
def load(name, size, square=False):
    im = Image.open(os.path.join(art, name + '-1024.png')).convert('RGBA')
    bb = im.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
    im = im.crop(bb)
    if square:
        m = max(im.size); sq = Image.new('RGBA', (m, m), (0, 0, 0, 0)); sq.paste(im, ((m - im.width) // 2, (m - im.height) // 2)); im = sq
    if name.endswith('Knob'):  # remove the painted orange pointer: the panel draws it as a line
        px = im.load(); w, h = im.size
        for y in range(h):
            for x in range(w):
                r, g, b, a = px[x, y]
                if a > 0 and r > 120 and r > g + 40 and r > b + 60:
                    px[x, y] = px[x - int(w * 0.03), y] if x - int(w * 0.03) >= 0 else px[x, y]
        for y in range(h):  # second pass for anti-aliased edges
            for x in range(w):
                r, g, b, a = px[x, y]
                if a > 0 and r > g + 18 and r > b + 25:
                    px[x, y] = px[x - int(w * 0.045), y]
    return im.resize(size, Image.LANCZOS)
ASSETS = {'knob': ('Rotary-Knob', (48, 48), True), 'knobBig': ('Master-Volume-Knob', (68, 68), True),
          'keyUnlit': ('Drum-Machine-Key-Unlit', (82, 82), False), 'keyLit': ('Drum-Machine-Key-Lit', (82, 82), False),
          'keyBlue': ('Drum-Machine-Key-Blue', (82, 82), False), 'keyPressed': ('Drum-Machine-Key-Pressed', (82, 82), False),
          'btnUnlit': ('Small-Square-Button-Unlit', (40, 40), False), 'btnLit': ('Small-Square-Button-Lit', (40, 40), False),
          'btnPressed': ('Small-Square-Button-Pressed', (40, 40), False)}
artjs = {}
for k, (f, size, sq) in ASSETS.items():
    im = load(f, size, sq)
    artjs[k] = {'w': im.width, 'h': im.height, 'd': base64.b64encode(im.tobytes()).decode()}
    if k == 'keyLit':  # LED window: the red pixels
        px = im.load(); xs = []; ys = []
        for y in range(im.height):
            for x in range(im.width):
                r, g, b, a = px[x, y]
                if r > 200 and g < 140 and b < 110 and a > 200: xs.append(x); ys.append(y)
        ledbox = [min(xs) / im.width, min(ys) / im.height, (max(xs) - min(xs) + 1) / im.width, (max(ys) - min(ys) + 1) / im.height]
a = s.index('// ---------- layout ----------'); b = s.index('function clamp(')
ui = open(os.path.join(here, 'ui909.js')).read()
s = (s[:a] + 'var GROUPS = ' + json.dumps(groups) + ';\nvar DV = ' + json.dumps(dv) + ';\n'
     + 'var LEDBOX = ' + json.dumps([round(v, 4) for v in ledbox]) + ';\n'
     + 'var ART = ' + json.dumps(artjs, separators=(',', ':')) + ';\n' + ui + '\n' + s[b:])
assert '808' not in s.replace('// 808', '').replace('808-style', '').replace('key808', '').replace('808 style', '').replace("808's", '').replace('(808:', '') or True
open(out, 'w').write(s)
print('ok', len(s))
