# builds "DIODE 909.amxd" (unfrozen) from the DIODE 808 device: same sequencer panel and gen~ clock,
# diode909~ engine (11 trigger inlets, stereo out), 909 sound controls, Push 3 parameter banks
import json, struct, sys
SRC, DIALS_JSON, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
raw = open(SRC, 'rb').read()
i = raw.index(b'ptch') + 8; j = raw.rindex(b'}') + 1
text = raw[i:j].decode()
text = text.replace('diode808_engine.js', 'diode909_engine.js').replace('diode808_seq.js', 'diode909_seq.js') \
           .replace('tr808pat', 'tr909pat').replace('TR808KitSeqData', 'DIODE909SeqData')
d = json.loads(text); P = d['patcher']
B = {b['box']['id']: b['box'] for b in P['boxes']}

VOICES = ['bd', 'sd', 'lt', 'mt', 'ht', 'rs', 'cp', 'ch', 'oh', 'cr', 'rd']      # diode909~ inlet order
RENAME = {'cy': 'cr', 'cb': 'rd'}                                                 # reuse two 808 chains
DROP_V = {'lc', 'mc', 'hc', 'cl'}
NOTES = [(36, 'bd'), (35, 'bd'), (37, 'rs'), (38, 'sd'), (40, 'sd'), (39, 'cp'), (43, 'lt'), (41, 'lt'),
         (47, 'mt'), (45, 'mt'), (50, 'ht'), (48, 'ht'), (42, 'ch'), (44, 'ch'), (46, 'oh'), (49, 'cr'), (51, 'rd')]

def vid(x):
    for pre in ('ac_', 'm_', 'c_'):
        if x.startswith(pre): return pre, x[len(pre):]
    return None, None

drop = set()
for k in list(B):
    pre, v = vid(k)
    if pre and v in DROP_V: drop.add(k)
    if k.startswith(('d_', 'p_d_', 'dv_d_')): drop.add(k)
P['boxes'] = [b for b in P['boxes'] if b['box']['id'] not in drop]
def keep(l):
    s, t = l['patchline']['source'], l['patchline']['destination']
    if s[0] in drop or t[0] in drop: return False
    if s[0] == 'rt' or t[0] == 'eng' or s[0] == 'eng': return False   # rebuilt below
    return True
P['lines'] = [l for l in P['lines'] if keep(l)]
# rename chains cy->cr, cb->rd
ren = {}
for b in P['boxes']:
    pre, v = vid(b['box']['id'])
    if pre and v in RENAME:
        ren[b['box']['id']] = pre + RENAME[v]; b['box']['id'] = pre + RENAME[v]
for l in P['lines']:
    for e in ('source', 'destination'):
        if l['patchline'][e][0] in ren: l['patchline'][e][0] = ren[l['patchline'][e][0]]
B = {b['box']['id']: b['box'] for b in P['boxes']}
def line(s, so, t, ti): P['lines'].append({'patchline': {'source': [s, so], 'destination': [t, ti]}})
def add(box): P['boxes'].append({'box': box}); B[box['id']] = box

# engine
e = B['eng']
e.update({'text': 'diode909~', 'numinlets': 11, 'numoutlets': 2, 'outlettype': ['signal', 'signal']})
line('eng', 0, 'out', 0); line('eng', 1, 'out', 1)
for k, v in enumerate(VOICES):
    line('g_seq', k, 'eng', k)      # sequencer triggers (gen~ outs 0..10 = voices 1..11)
    line('c_' + v, 0, 'eng', k)     # MIDI notes in
# MIDI note router
rt = B['rt']
rt['text'] = 'route ' + ' '.join(str(n) for n, _ in NOTES)
rt['numoutlets'] = len(NOTES) + 1; rt['outlettype'] = [''] * (len(NOTES) + 1)
for k, (n, v) in enumerate(NOTES): line('rt', k, 'ac_' + v, 0)

# sound controls: hidden live.dials drawn by the panel (varname = d_*)
DIALS = json.load(open(DIALS_JSON))
params = {}
for n, dl in enumerate(DIALS):
    var = dl['var']; y = 40.0 + n * 50
    va = {'parameter_initial': [dl['init']], 'parameter_initial_enable': 1, 'parameter_longname': dl['long'],
          'parameter_shortname': dl['short'], 'parameter_modmode': 0, 'parameter_type': 0,
          'parameter_mmin': float(dl['lo']), 'parameter_mmax': float(dl['hi']), 'parameter_unitstyle': 1}
    if dl.get('enum'): va.update({'parameter_type': 2, 'parameter_enum': dl['enum'], 'parameter_mmax': float(len(dl['enum']) - 1)})
    add({'id': var, 'varname': var, 'maxclass': 'live.dial', 'numinlets': 1, 'numoutlets': 2, 'outlettype': ['', 'float'],
         'parameter_enable': 1, 'patching_rect': [1500.0, y, 44.0, 45.0], 'saved_attribute_attributes': {'valueof': va}})
    add({'id': 'p_' + var, 'maxclass': 'newobj', 'text': 'prepend ' + dl['msg'], 'numinlets': 1, 'numoutlets': 1,
         'outlettype': [''], 'patching_rect': [1560.0, y, 150.0, 22.0]})
    add({'id': 'dv_' + var, 'maxclass': 'newobj', 'text': 'prepend dv ' + var, 'numinlets': 1, 'numoutlets': 1,
         'outlettype': [''], 'patching_rect': [1720.0, y, 150.0, 22.0]})
    line(var, 0, 'p_' + var, 0); line('p_' + var, 0, 'g_seq' if dl['msg'] == 'swing' else 'eng', 0)
    line(var, 0, 'dv_' + var, 0); line('dv_' + var, 0, 'sq_ui', 0)
    params[var] = [dl['long'], dl['short'], 0]
long = {dl['var']: dl['long'] for dl in DIALS}
BANKS = [('Main', ['d_ac', 'd_flam', 'd_swing', 'd_vol', 'd_rs_lvl', 'd_cp_lvl', 'd_hh_lvl', 'd_ch_decay']),
         ('BD SD', ['d_bd_lvl', 'd_bd_tune', 'd_bd_attack', 'd_bd_decay', 'd_sd_lvl', 'd_sd_tune', 'd_sd_tone', 'd_sd_snappy']),
         ('Toms', ['d_lt_lvl', 'd_lt_tune', 'd_lt_decay', 'd_mt_lvl', 'd_mt_tune', 'd_mt_decay', 'd_ht_lvl', 'd_ht_tune']),
         ('Cymbals', ['d_ht_decay', 'd_oh_decay', 'd_cr_lvl', 'd_cr_tune', 'd_rd_lvl', 'd_rd_tune', 'd_eco', 'd_sd_ring'])]
banks = {str(n): {'index': n, 'name': name, 'parameters': [long.get(v, '-') for v in vs]} for n, (name, vs) in enumerate(BANKS)}
P['parameters'] = {k: v for k, v in P['parameters'].items() if not k.startswith('d_')}
P['parameters'].update(params); P['parameters']['parameterbanks'] = banks
P['latency'] = 512  # samples: diode909~ renders 512 samples ahead (kAhead); Live compensates
P['dependency_cache'] = [{'name': 'diode909_seq.js', 'bootpath': '.', 'type': 'TEXT', 'implicit': 1},
                         {'name': 'diode909_engine.js', 'bootpath': '.', 'type': 'TEXT', 'implicit': 1},
                         {'name': 'diode909~.mxo', 'type': 'iLaX'}]
# sanity: every line endpoint exists, inlet/outlet in range
B = {b['box']['id']: b['box'] for b in P['boxes']}
for l in P['lines']:
    s, t = l['patchline']['source'], l['patchline']['destination']
    assert s[0] in B and t[0] in B, (s, t)
    assert s[1] < B[s[0]].get('numoutlets', 99) and t[1] < B[t[0]].get('numinlets', 99), (s, t)
txt = json.dumps(d, indent=1)
assert 'diode808' not in txt and 'tr808pat' not in txt
txt = txt.encode()
hdr = b'ampf' + struct.pack('<I', 4) + b'iiii' + b'meta' + struct.pack('<I', 4) + struct.pack('<I', 7) + b'ptch' + struct.pack('<I', len(txt) + 1)
open(OUT, 'wb').write(hdr + txt + b'\0')
print('boxes', len(P['boxes']), 'lines', len(P['lines']))
