"""Calculs de procédures et de faits usuels pour le rituel de calcul mental (progression validée le 12/11/2026).
Usage : python3 procedures.py <graine> <periode 1-5> <niveau CM1|CM2> <n>
Chaque calcul est vérifié en arithmétique exacte (Fraction).
"""
import json, random, sys
from fractions import Fraction as F

def fr(x):
    x = F(x)
    if x.denominator == 1:
        return f'{int(x):,}'.replace(',', ' ')
    # écriture décimale exacte (aucun arrondi) ; les dénominateurs sont des puissances de 2 et 5
    k = 0
    while (x * 10**k).denominator != 1:
        k += 1
        assert k < 8, x
    n = int(x * 10**k); e, d = divmod(n, 10**k)
    return f'{e:,}'.replace(',', ' ') + ',' + str(d).zfill(k)

def dec(r, a, b, nd):  # décimal aléatoire à nd chiffres après la virgule
    return F(r.randint(a * 10**nd, b * 10**nd), 10**nd)

# --- générateurs : renvoient (question, réponse exacte) ---
def ajout_89(r, maxi):
    k = r.choice([x for x in [8, 9, 18, 19, 28, 29, 38, 39, 48, 49, 58, 59, 68, 69, 78, 79, 88, 89, 98, 99] if x <= maxi])
    n = r.randint(40, 900)
    return (f'{n} + {k}', n + k) if r.random() < .5 else (f'{n + k + 20} − {k}', n + 20)

def x10_entier(r):
    n, p = r.randint(3, 999), r.choice([10, 100, 1000])
    return f'{n} × {fr(p)}', n * p

def x10_dec(r, puissances, nd):
    x, p = dec(r, 0, 99, nd), r.choice(puissances)
    if x == 0: x = F(37, 10)
    return (f'{fr(x)} × {fr(p)}', x * p) if r.random() < .5 else (f'{fr(x)} : {fr(p)}', x / p)

FRACTIONS_CM1 = [('1/2 = …/4', 2), ('1/2 = …/10', 5), ('1/4 + 1/4 = …/2', 1), ('3/4 = 1/4 + …/4', 2), ('1/2 = 0,…', 5),
                 ('1/4 = 0,…', 25), ('3/4 = 0,…', 75), ('1/10 = 0,…', 1), ('1/100 = 0,0…', 1), ('2/4 = …/2', 1),
                 ('0,5 = …/2', 1), ('0,25 = 1/…', 4), ('0,75 = …/4', 3), ('5/10 = …/2', 1)]
FRACTIONS_CM2 = FRACTIONS_CM1 + [('1/5 = 0,…', 2), ('1/1 000 = 0,00…', 1), ('1/2 = …/100', 50), ('2/5 = 0,…', 4), ('0,2 = 1/…', 5), ('3/4 = …/100', 75)]

def fraction_usuelle(r, niv):
    q, a = r.choice(FRACTIONS_CM1 if niv == 'CM1' else FRACTIONS_CM2)
    return q, a

def dec_plus_entier(r):  # CM1 P3 : sans retenue
    choix = r.choice(['u', 'd', 'c', 'e'])
    if choix == 'e':
        x = dec(r, 1, 50, 1); k = r.randint(1, 9); return f'{fr(x)} + {k}', x + k
    nd = 1 if choix == 'd' else 2
    x = F(r.randint(10, 500), 10**nd)
    pas = F(1, 10**nd) * r.randint(1, 3)
    # éviter la retenue : chiffre concerné ≤ 6
    chiffres = int(x * 10**nd) % 10
    if chiffres > 6: x -= F(chiffres - 3, 10**nd)
    return (f'{fr(x)} + {fr(pas)}', x + pas) if r.random() < .6 else (f'{fr(x + pas)} − {fr(pas)}', x)

def deux_decimaux(r):  # CM2 P3 : deux décimaux < 10, un chiffre après la virgule
    a, b = dec(r, 0, 9, 1), dec(r, 0, 9, 1)
    return f'{fr(a)} + {fr(b)}', a + b

def entier_plus_dec_retenue(r):
    x = F(r.randint(10, 300) * 10 + r.randint(1, 9), 10); k = r.randint(5, 49)
    return f'{fr(x)} + {k}', x + k

def double_moitie_dec(r):
    x = dec(r, 1, 50, 1)
    if r.random() < .5: return f'double de {fr(x)}', 2 * x
    y = 2 * dec(r, 1, 25, 1); return f'moitié de {fr(y)}', y / 2

def moitie_impair(r):
    n = r.choice([1, 3, 5, 7, 9, 11, 13, 15]); return f'moitié de {n}', F(n, 2)

def fois_458(r):
    k, n = r.choice([4, 5, 8]), r.randint(12, 125)
    return f'{n} × {k}', n * k

def fois_5_50_dec(r):
    k, x = r.choice([5, 50]), dec(r, 1, 30, 1)
    return f'{fr(x)} × {k}', x * k

def chiffre_x_dizaines(r):
    a, b = r.randint(2, 9), r.randint(2, 9) * r.choice([10, 100])
    return f'{a} × {b}', a * b

def dizaines_x_centaines(r):
    a = r.randint(2, 9) * r.choice([10, 100, 1000]); b = r.randint(2, 9) * r.choice([10, 100])
    if a * b > 10**7: b //= 10
    return f'{fr(a)} × {fr(b)}', a * b

def distributivite(r):
    n, k = r.choice([11, 12, 13, 14, 15, 21, 22, 25, 31, 41, 101]), r.randint(3, 9)
    return f'{n} × {k}', n * k

def div_4_8(r):
    k = r.choice([4, 8]); q = r.randint(5, 125)
    return f'{fr(q * k)} : {k}', q

def faits_usuels(r, niv):
    t = r.choice(['c10', 'c100', 'double', 'moitie', 'quatre'])
    if t == 'c10': n = r.randint(1, 9); return f'{n} + … = 10', 10 - n
    if t == 'c100': n = r.randint(5, 95); return f'{n} + … = 100', 100 - n
    if t == 'double': n = r.choice([15, 25, 35, 45, 16, 18, 24, 36, 48, 75, 150, 250]); return f'double de {fr(n)}', 2 * n
    if t == 'moitie': n = r.choice([30, 50, 70, 90, 34, 56, 78, 120, 300, 500, 1000]); return f'moitié de {fr(n)}', F(n, 2)
    q = r.choice([('4 × 25', 100), ('2 × 50', 100), ('5 × 20', 100), ('… × 25 = 100', 4), ('20 × … = 100', 5)] + ([('8 × 125', 1000), ('… × 125 = 1 000', 8)] if niv == 'CM2' else []))
    return q


# --- fraction d'une quantité (P3 à P5) ---
def fraction_quantite(r, niv, periode):
    if niv == 'CM1' and periode == 3:   # fractions unitaires
        b, a = r.choice([2, 3, 4, 5, 10]), 1
    elif niv == 'CM1':                   # puis fractions simples non unitaires
        b = r.choice([2, 3, 4, 5, 10]); a = r.randint(1, b - 1)
    else:
        b = r.choice([3, 4, 5, 6, 8, 10]); a = r.randint(1, b - 1)
    from math import gcd
    while gcd(a, b) != 1: a = r.randint(1, b - 1)
    k = r.randint(2, 12 if niv == 'CM1' else 15)
    n = b * k; res = a * k
    inverse = (niv == 'CM2' and r.random() < .5) or (niv == 'CM1' and periode >= 4 and r.random() < .3)
    if inverse:
        return f'{a}/{b} de … = {fr(res)}', n
    return f'{a}/{b} de {fr(n)}', res

# --- pourcentages (P4 et P5) : 10 % = 10/100 = 0,1 ---
def pourcentage(r, niv):
    taux = r.choice([10, 50] if niv == 'CM1' else [10, 20, 25, 50, 75])
    base = r.choice([20, 30, 40, 50, 60, 80, 100, 120, 200, 300, 400, 500])
    if taux == 25 or taux == 75: base = r.choice([20, 40, 60, 80, 100, 200, 400])
    res = F(taux * base, 100)
    if niv == 'CM2' and r.random() < .3:
        return f'{taux} % de … = {fr(res)}', base
    return f'{taux} % de {fr(base)}', res

PROCEDURES = {
    (1, 'CM1'): [lambda r: ajout_89(r, 39), x10_entier], (1, 'CM2'): [lambda r: ajout_89(r, 99), x10_entier],
    (2, 'CM1'): [lambda r: fraction_usuelle(r, 'CM1'), lambda r: x10_dec(r, [10], 1)],
    (2, 'CM2'): [lambda r: fraction_usuelle(r, 'CM2'), lambda r: x10_dec(r, [10, 100, 1000], 2)],
    (3, 'CM1'): [dec_plus_entier, fois_458],
    (3, 'CM2'): [deux_decimaux, entier_plus_dec_retenue, double_moitie_dec, fois_5_50_dec, moitie_impair],
    (4, 'CM1'): [chiffre_x_dizaines, distributivite], (4, 'CM2'): [dizaines_x_centaines, div_4_8, distributivite],
}
PROCEDURES[(5, 'CM1')] = [g for p in (1, 2, 3, 4) for g in PROCEDURES[(p, 'CM1')]]
PROCEDURES[(5, 'CM2')] = [g for p in (1, 2, 3, 4) for g in PROCEDURES[(p, 'CM2')]]
# Ajouts validés le 12/11/2026 : fraction d'une quantité dès P3, pourcentages dès P4
for p in (3, 4, 5):
    for niv in ('CM1', 'CM2'):
        PROCEDURES[(p, niv)] = PROCEDURES[(p, niv)] + [lambda r, niv=niv, p=p: fraction_quantite(r, niv, p)] * 2
for p in (4, 5):
    for niv in ('CM1', 'CM2'):
        PROCEDURES[(p, niv)] = PROCEDURES[(p, niv)] + [lambda r, niv=niv: pourcentage(r, niv)] * 2
RAPPEL = {4: '10 % = 10/100 = 0,1', 5: '10 % = 10/100 = 0,1'}

def verifier(q, a):
    """Contrôle indépendant quand l'expression est calculable."""
    import re
    m = re.fullmatch(r'(\d+)/(\d+) de (…|[\d ]+)( = ([\d ,]+))?', q)
    if m:
        f = F(int(m.group(1)), int(m.group(2)))
        if m.group(3) == '…': assert f * F(a) == F(m.group(5).replace(' ', '').replace(',', '.')), (q, a)
        else: assert f * int(m.group(3).replace(' ', '')) == F(a), (q, a)
        return
    m = re.fullmatch(r'(\d+) % de (…|[\d ]+)( = ([\d ,]+))?', q)
    if m:
        t = F(int(m.group(1)), 100)
        if m.group(2) == '…': assert t * F(a) == F(m.group(4).replace(' ', '').replace(',', '.')), (q, a)
        else: assert t * int(m.group(2).replace(' ', '')) == F(a), (q, a)
        return
    if any(s in q for s in ('double', 'moitié', '…', '/')): return
    expr = q.replace(' ', '').replace(',', '.').replace('×', '*').replace(':', '/').replace('−', '-')
    v = eval(expr)
    assert abs(v - float(a)) < 1e-9, (q, a, v)

def serie(graine, periode, niv, n, avec_faits=True):
    r = random.Random(f'{graine}|{periode}|{niv}')
    gens = PROCEDURES[(periode, niv)]
    out, vus = [], set()
    while len(out) < n:
        if avec_faits and len(out) % 4 == 3:
            q, a = faits_usuels(r, niv); rub = 'Fait usuel'
        else:
            q, a = r.choice(gens)(r); rub = 'Procédure'
        if q in vus: continue
        vus.add(q); verifier(q, a)
        assert F(fr(a).replace(' ', '').replace(',', '.')) == F(a), (q, a)
        out.append({'rub': rub, 'q': q if '…' in q or 'de ' in q else q + ' = …', 'r': fr(a)})
    return out

if __name__ == '__main__':
    g, p, niv, n = sys.argv[1], int(sys.argv[2]), sys.argv[3], int(sys.argv[4])
    print(json.dumps(serie(g, p, niv, n), ensure_ascii=False))
