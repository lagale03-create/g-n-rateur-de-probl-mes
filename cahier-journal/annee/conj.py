# Conjugaison exacte (verbecc) : présent, imparfait, futur, passé composé, passé simple, 6 personnes.
import logging, json, os
logging.disable(logging.CRITICAL)
from verbecc import CompleteConjugator
_C = CompleteConjugator('fr'); _CACHE = {}
TEMPS = [('présent', 'Présent'), ('imparfait', 'Imparfait'), ('futur-simple', 'Futur'), ('passé-composé', 'Passé composé'), ('passé-simple', 'Passé simple')]
PR = ['1s', '2s', '3s', '1p', '2p', '3p']
def conj(v):
    if v in _CACHE: return _CACHE[v]
    d = json.loads(str(_C.conjugate(v)))['moods']['indicatif']; out = {}
    for k, lab in TEMPS:
        f = {}
        for e in d[k]:
            key = e['p'] + e['n']
            if key in f: continue
            if e['p'] == '3' and e['pr'] not in ('il', 'ils'): continue
            if e.get('g') == 'f' and key not in ('3s', '3p'): 
                if any(x['p'] + x['n'] == key and x.get('g') == 'm' for x in d[k]): continue
            f[key] = e['c'][0]
        out[lab] = [f[p] for p in PR]
    _CACHE[v] = out; return out
if __name__ == '__main__':
    for v in ['venir', 'aller', 'finir', 'prendre', 'être']: print(v, conj(v))
