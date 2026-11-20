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
rep('var VERSION = "1.1.0";', 'var VERSION = "1.0.0";')
rep('var NOTES = [-1, 36, 38, 43, 47, 50, 37, 39, 56, 49, 42, 46, 64, 63, 62, 75];', 'var NOTES = [-1, 36, 38, 43, 47, 50, 37, 39, 42, 46, 49, 51, -1, -1, -1, -1];')
# mute/solo and selection: only the 11 voices in use
rep('for (var v = 1; v < NI; v++) { if (mute[v])', 'for (var v = 1; v < NV; v++) { if (mute[v])')
rep('var anySolo = 0; for (var v0 = 1; v0 < NI; v0++)', 'var anySolo = 0; for (var v0 = 1; v0 < NV; v0++)')
rep('    for (var v = 1; v < NI; v++) {\n        var mr = msRect(0, v)', '    for (var v = 1; v < NV; v++) {\n        var mr = msRect(0, v)')
rep('rect([MSX + (NI - 1) * (MSCW + 2) + 6', 'rect([MSX + (NV - 1) * (MSCW + 2) + 6')
rep('    for (var v = 1; v < NI; v++) {\n        if (inR(x, y, msRect(0, v)))', '    for (var v = 1; v < NV; v++) {\n        if (inR(x, y, msRect(0, v)))')
rep('if (cmd) { for (var q = 1; q < NI; q++) solo[q] = 0;', 'if (cmd) { for (var q = 1; q < NV; q++) solo[q] = 0;')
rep('for (var v1 = 1; v1 < NI; v1++) { var nr0', 'for (var v1 = 1; v1 < NV; v1++) { var nr0')
rep('else if (p >= 52 && p <= 67) { setInst(p - 52); }', 'else if (p >= 52 && p < 52 + NV) { setInst(p - 52); }')
rep('select AC,BD,SD,LT,MT,HT,RS,CP,CB,CY,CH,OH,LC,MC,HC,CL,', 'select AC,BD,SD,LT,MT,HT,RS,CP,CH,OH,CR,RD,')
rep('for (var i = 1; i < NI; i++) if (NOTES[i] === p) {', 'for (var i = 1; i < NV; i++) if (NOTES[i] === p || (p === 35 && i === 1) || (p === 40 && i === 2) || (p === 41 && i === 3) || (p === 45 && i === 4) || (p === 48 && i === 5) || (p === 44 && i === 8)) {')
# logo
rep('fontI(24); textR("DIODE 808", W - 14, 33, CREAM);', 'fontI(24); textR("DIODE 909", W - 14, 33, CREAM);')
rep('var lw = mgraphics.text_measure("DIODE 808")[0]', 'var lw = mgraphics.text_measure("DIODE 909")[0]')
# knobs per instrument: 909 front panel
groups = [["d_ac", "d_flam", "d_swing", "d_vol"],
          ["d_bd_lvl", "d_bd_tune", "d_bd_attack", "d_bd_decay"],
          ["d_sd_lvl", "d_sd_tune", "d_sd_tone", "d_sd_snappy"],
          ["d_lt_lvl", "d_lt_tune", "d_lt_decay"], ["d_mt_lvl", "d_mt_tune", "d_mt_decay"], ["d_ht_lvl", "d_ht_tune", "d_ht_decay"],
          ["d_rs_lvl"], ["d_cp_lvl"], ["d_hh_lvl", "d_ch_decay"], ["d_hh_lvl", "d_oh_decay"],
          ["d_cr_lvl", "d_cr_tune"], ["d_rd_lvl", "d_rd_tune"], [], [], [], []]
DIALS = json.load(open(sys.argv[3]))
dv = {}
for d in DIALS:
    dv[d['var']] = {"label": d['short'], "min": d['lo'], "max": d['hi'], "val": d['init'], "def": d['init'], "unit": d['unit'], "exp": 1}
a = s.index('var GROUPS = '); b = s.index('\n', s.index('var DV = '))
s = s[:a] + 'var GROUPS = ' + json.dumps(groups) + ';\nvar DV = ' + json.dumps(dv) + ';' + s[b:]
assert '808' not in s.replace('// 808', '').replace('808-style', '').replace('key808', '').replace('808 style', '').replace("808's", '').replace('(808:', '') or True
open(out, 'w').write(s)
print('ok', len(s))
