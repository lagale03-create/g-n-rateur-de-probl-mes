# Analyse des graphèmes de chaque son du français à partir d'une liste de fréquences (FrequencyWords, 20 000 mots) et de LireCouleur.
# Sortie : sons/sons.json — pour chaque fiche et chaque son : graphèmes (mots, % des occurrences), places dans le mot, corpus de 48 mots fréquents.
import pickle, collections, json, re, sys
data = pickle.load(open(sys.argv[1], 'rb'))
SONS = {  # fiche : [(son, codes)]
 1: [('[i]', {'i'})], 2: [('[o]', {'o', 'o_ouvert', 'o_comp'})], 3: [('[u]', {'u'}), ('[y]', {'y'})], 4: [('[a]', {'a'})],
 5: [('[ø] [œ] [ə]', {'x', 'x^', 'q'})], 6: [('[e] [ɛ] (é, è)', {'e', 'e^', 'e_comp', 'e^_comp'})], 7: [('[e] [ɛ] (é, è)', {'e', 'e^', 'e_comp', 'e^_comp'})], 8: [('[e] [ɛ] (é, è)', {'e', 'e^', 'e_comp', 'e^_comp'})],
 9: [('[ɑ̃]', {'a~'})], 10: [('[ɑ̃]', {'a~'})], 11: [('[ɔ̃]', {'o~'}), ('[ɛ̃]', {'e~', 'x~'})], 12: [('[j]', {'j'})], 13: [('[wa] [wɛ̃]', {'w_a', 'w_e~', 'wa'})],
 14: [('[p]', {'p'}), ('[b]', {'b'})], 15: [('[t]', {'t'}), ('[d]', {'d'})], 16: [('[k]', {'k', 'k_qu'})], 17: [('[g]', {'g', 'g_u'})], 18: [('[f]', {'f', 'f_ph'}), ('[v]', {'v'})],
 19: [('[ʃ]', {'s^'}), ('[ʒ]', {'z^', 'z^_g'})], 20: [('[m]', {'m'}), ('[n]', {'n'})], 21: [('[l]', {'l'})], 22: [('[ʀ]', {'r'})], 23: [('[s]', {'s', 's_c', 's_t', 's_x'})], 24: [('[z]', {'z', 'z_s'})], 25: [('[ɲ]', {'n~'})]}
VOY = {'[i]', '[o]', '[u]', '[y]', '[a]', '[ø] [œ] [ə]', '[e] [ɛ] (é, è)', '[ɑ̃]', '[ɔ̃]', '[ɛ̃]'}
EXCL = set('whisky ok hey yeah oh ah euh hum bye okay the you and it is to of in that what me my your this no yes'.split())
def units(ph):
    out, off = [], 0
    for c, g in ph:
        if c in ('#', 'verb_3p', 'q_caduc'): off += len(g); continue
        if c.startswith('j_') and c != 'j':  # yod + voyelle : on garde la voyelle avec ses lettres sans le i/y
            v = c[2:]; k = 1 if g[:1] in 'iy' else 0; out.append(('j', g[:1], off)); out.append((v, g[k:], off + k)); off += len(g); continue
        out.append((c, g, off)); off += len(g)
    return out
res = {}
for fiche, sons in SONS.items():
    res[fiche] = []
    for son, codes in sons:
        G = collections.defaultdict(lambda: {'types': 0, 'tok': 0, 'pos': collections.Counter(), 'suiv': collections.Counter(), 'ex': []})
        for w, f, r, ph in data:
            if w in EXCL or r > 15000: continue
            u = units(ph)
            for i, (c, g, off) in enumerate(u):
                if c in codes and g:
                    g = g.lower(); d = G[g]; d['types'] += 1; d['tok'] += f
                    d['pos']['début' if i == 0 else 'fin' if i == len(u) - 1 else 'milieu'] += 1
                    nxt = w[off + len(g)] if off + len(g) < len(w) else '#'
                    d['suiv']['fin du mot' if nxt == '#' else ('voyelle e, i, y' if nxt in 'eéèêiîy' else 'voyelle a, o, u' if nxt in 'aâàoôuû' else 'm, b, p' if nxt in 'mbp' else 'autre consonne')] += 1
                    if len(d['ex']) < 60 and len(w) > 2: d['ex'].append((r, w))
        tot_t = sum(d['tok'] for d in G.values()) or 1; tot_y = sum(d['types'] for d in G.values()) or 1
        gl = sorted(G.items(), key=lambda x: -x[1]['types'])
        gl = [(g, d) for g, d in gl if d['types'] / tot_y >= 0.01]
        # corpus de 48 mots : au moins 3 par graphème présent (s'il y en a), le reste au prorata des mots
        corpus, seen = [], set()
        quota = {g: max(3 if d['types'] / tot_y >= 0.01 else 2, round(48 * d['types'] / tot_y)) for g, d in gl}
        for g, d in gl:
            for r, w in sorted(d['ex'])[:quota[g]]:
                if w not in seen: corpus.append((r, w, g)); seen.add(w)
        corpus = sorted(corpus)[:60]
        res[fiche].append({'son': son, 'voyelle': son in VOY,
            'graphemes': [{'g': g, 'mots': round(100 * d['types'] / tot_y, 1), 'occurrences': round(100 * d['tok'] / tot_t, 1),
                           'places': {k: round(100 * v / d['types']) for k, v in d['pos'].items()}, 'apres': {k: round(100 * v / d['types']) for k, v in d['suiv'].most_common(3)}, 'exemples': [w for r, w in sorted(d['ex'])[:6]]} for g, d in gl],
            'corpus': [w for r, w, g in corpus]})
json.dump(res, open(sys.argv[2], 'w'), ensure_ascii=False, indent=1)
for fiche in (6, 11, 16, 23):
    for s in res[fiche]:
        print(fiche, s['son'], [(x['g'], x['mots'], x['places']) for x in s['graphemes']][:8]); print('   ', ' '.join(s['corpus']))
