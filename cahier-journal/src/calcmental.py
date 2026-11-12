"""Séries de calcul mental au format de la compétence « calcul-mental » (six rubriques, 30 calculs).
Usage : python3 calcmental.py <graine> <tables CM1, ex. 9> <tables CM2> > sortie.json
Version entière pour les CM1, version décimale (dixièmes, diviseur entier) pour les CM2.
"""
import json, random, sys
from fractions import Fraction as F

RUBRIQUES_30 = [('Produit', 5), ('Facteur manquant', 6), ('Quotient', 5), ('Diviseur manquant', 4),
             ('Dividende manquant', 4), ('Égalité inversée', 6)]
RUBRIQUES_15 = [('Produit', 3), ('Facteur manquant', 3), ('Quotient', 3), ('Diviseur manquant', 2),
             ('Dividende manquant', 2), ('Égalité inversée', 2)]
RUBRIQUES = RUBRIQUES_15  # série courte validée le 12/11/2026 (mardi et vendredi)

def fr(x):
    x = F(x)
    if x.denominator == 1:
        n = int(x); s = f'{n:,}'.replace(',', ' ')
        return s
    s = f'{float(x):.3f}'.rstrip('0').rstrip('.')
    e, d = s.split('.')
    return f'{int(e):,}'.replace(',', ' ') + ',' + d

def faits(tables, rng, n):
    """Moitié des faits dans les tables de la semaine (chaque fait au plus deux fois, sous deux formes),
    le reste dans les autres tables de 3 à 9 ; jamais ×1, ×2 ni ×10."""
    focus = [(a, b) for a in tables for b in range(3, 10)]
    autres, vus = [], {(min(f), max(f)) for f in focus}
    for a in range(3, 10):
        for b in range(3, 10):
            k = (min(a, b), max(a, b))
            if a not in tables and k not in vus:
                vus.add(k); autres.append((a, b))
    rng.shuffle(focus); rng.shuffle(autres)
    nf = n // 2
    sel = (focus * 3)[:nf]
    sel += autres[: n - len(sel)]
    if len(sel) < n:
        sel += (focus * 3)[nf: nf + n - len(sel)]
    rng.shuffle(sel)
    return sel

def serie(tables, rng, decimal=False):
    for _ in range(500):
        it = _serie(tables, rng, decimal)
        qs = [x['q'] for x in it]
        np_ = RUBRIQUES[0][1]
        prods = [x['q'].split('=')[0] for x in it[:np_]]
        if len(set(qs)) == len(qs) and len(set(prods)) == np_:
            return it
    raise RuntimeError('pas de série sans doublon')

def _serie(tables, rng, decimal=False):
    fs = faits(tables, rng, sum(n for _, n in RUBRIQUES))
    items, k = [], 0
    for rub, nb in RUBRIQUES:
        for i in range(nb):
            a, b = fs[k]; k += 1
            if decimal:
                x, y, p = F(a, 10), b, F(a * b, 10)   # 0,a × b = p ; diviseur toujours entier (b)
            else:
                x, y, p = a, b, a * b
            if rub == 'Produit':
                q, r = f'{fr(x)} × {fr(y)} = …', p
            elif rub == 'Facteur manquant':
                q, r = (f'{fr(x)} × … = {fr(p)}', y) if i % 2 == 0 else (f'… × {fr(y)} = {fr(p)}', x)
            elif rub == 'Quotient':
                q, r = f'{fr(p)} : {fr(y)} = …', x
            elif rub == 'Diviseur manquant':
                q, r = f'{fr(p)} : … = {fr(x)}', y
            elif rub == 'Dividende manquant':
                q, r = f'… : {fr(y)} = {fr(x)}', p
            else:
                forme = i % 3
                if forme == 0: q, r = f'{fr(p)} = {fr(y)} × …', x
                elif forme == 1: q, r = f'… = {fr(x)} × {fr(y)}', p
                else: q, r = f'{fr(x)} = {fr(p)} : …', y
            items.append({'rub': rub, 'q': q, 'r': fr(r)})
    if decimal:  # piège obligatoire : 4 = … × 8 (réponse 0,5)
        b = rng.choice([2, 4, 6, 8])
        items[-1] = {'rub': 'Égalité inversée', 'q': f'{fr(F(5 * b, 10))} = … × {b}', 'r': '0,5'}
    # vérification indépendante
    for it in items:
        q = it['q'].replace(' ', '').replace(',', '.').replace('×', '*').replace(':', '/')
        r = it['r'].replace(' ', '').replace(',', '.')
        g, d = q.split('=')
        expr = (g + '==' + d).replace('…', r)
        assert abs(eval(expr.split('==')[0]) - eval(expr.split('==')[1])) < 1e-9, it
    return items

if __name__ == '__main__':
    graine = sys.argv[1]
    t1 = [int(x) for x in sys.argv[2].split(',')]
    t2 = [int(x) for x in sys.argv[3].split(',')]
    rng = random.Random(graine)
    print(json.dumps({'CM1': serie(t1, rng), 'CM2': serie(t2, rng, decimal=True)}, ensure_ascii=False))
