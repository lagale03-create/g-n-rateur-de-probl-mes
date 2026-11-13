# Exercices de mathématiques générés et vérifiés en arithmétique exacte (Fraction). exos(kind, seed, niv, n) -> [(énoncé, réponse)]
import random
from fractions import Fraction as F

def nb(n):  # entier avec espaces des milliers
    s = f"{n:,}".replace(',', ' ')
    return s
def dec(x, places=None):
    x = F(x)
    if places is None:
        places = 0
        while (x * 10 ** places).denominator != 1: places += 1
    neg = x < 0; x = abs(x)
    ent = int(x); fr = x - ent
    s = nb(ent)
    if places:
        d = str(int(round(fr * 10 ** places))).rjust(places, '0')
        s += ',' + d
    assert F(s.replace(' ', '').replace(',', '.')) == x, (s, x)
    return ('−' if neg else '') + s
def frac(f): f = F(f); return f"{f.numerator}/{f.denominator}" if f.denominator != 1 else str(f.numerator)
LETTRES = {0: 'zéro', 1: 'un', 2: 'deux', 3: 'trois', 4: 'quatre', 5: 'cinq', 6: 'six', 7: 'sept', 8: 'huit', 9: 'neuf', 10: 'dix', 11: 'onze', 12: 'douze', 13: 'treize', 14: 'quatorze', 15: 'quinze', 16: 'seize'}
def lettres(n):
    if n < 17: return LETTRES[n]
    if n < 100:
        d, u = divmod(n, 10)
        base = {1: 'dix', 2: 'vingt', 3: 'trente', 4: 'quarante', 5: 'cinquante', 6: 'soixante', 7: 'soixante', 8: 'quatre-vingt', 9: 'quatre-vingt'}[d]
        if d in (7, 9): return base + ('-et-' if (d == 7 and u == 1) else '-') + lettres(10 + u)
        if u == 0: return base + ('s' if d == 8 else '')
        return base + ('-et-un' if u == 1 and d != 8 else '-' + LETTRES[u])
    if n < 1000:
        c, r = divmod(n, 100)
        t = ('cent' if c == 1 else LETTRES[c] + '-cent') + ('s' if c > 1 and r == 0 else '')
        return t + ('-' + lettres(r) if r else '')
    for val, nom in ((10 ** 9, 'milliard'), (10 ** 6, 'million'), (1000, 'mille')):
        if n >= val:
            q, r = divmod(n, val)
            if nom == 'mille': t = 'mille' if q == 1 else lettres(q).replace('cents', 'cent').replace('vingts', 'vingt') + '-mille'
            else: t = lettres(q) + '-' + nom + ('s' if q > 1 else '')
            return t + ('-' + lettres(r) if r else '')

def exos(kind, seed, niv, n=8):
    R = random.Random(f"{kind}-{seed}-{niv}"); cm2 = niv == 'CM2'; out = []
    for i in range(n):
        if kind == 'numeration':
            x = R.randint(10 ** 5, 10 ** 6 - 1) if not cm2 else R.randint(10 ** 6, 10 ** 9)
            out.append((f"Écris en lettres : {nb(x)}", lettres(x)) if i % 2 == 0 else (f"Décompose {nb(x)} classe par classe", ' + '.join(f"{nb(int(c))} × {nb(10 ** (3 * k))}" for k, c in reversed(list(enumerate(reversed(f'{x:,}'.split(',')))))).replace(' × 1 + ', ' + ').replace(' × 1', '')))
        elif kind == 'comparer':
            a = R.randint(10 ** 5, 10 ** 7 if cm2 else 10 ** 6); b = a + R.choice([-1, 1]) * R.choice([10, 100, 1000, 9000])
            out.append((f"Compare : {nb(a)} … {nb(b)}", '<' if a < b else '>') if i % 2 == 0 else (f"Encadre {nb(a)} entre deux milliers consécutifs", f"{nb(a // 1000 * 1000)} < {nb(a)} < {nb(a // 1000 * 1000 + 1000)}"))
        elif kind == 'addsous':
            a = R.randint(1000, 99999 if cm2 else 9999); b = R.randint(100, a - 1)
            out.append((f"{nb(a)} + {nb(b)}", nb(a + b)) if i % 2 == 0 else (f"{nb(a)} − {nb(b)}", nb(a - b)))
        elif kind == 'mult':
            a = R.randint(100, 9999); b = R.randint(12, 999 if cm2 else 99)
            out.append((f"{nb(a)} × {b}", nb(a * b)))
        elif kind == 'div':
            d = R.randint(12, 45) if cm2 else R.randint(3, 9); q = R.randint(20, 400); r = R.randint(0, d - 1); a = d * q + r
            out.append((f"{nb(a)} : {d}", f"q = {q}, r = {r} ({nb(a)} = {d} × {q} + {r})"))
        elif kind in ('bilan1',):
            return exos('addsous', seed, niv, 3) + exos('mult', seed, niv, 2) + exos('div', seed, niv, 3)
        elif kind == 'fractions':
            d = R.choice([2, 3, 4, 5, 6, 8, 10]); nu = R.randint(1, 2 * d if cm2 else d + 2)
            f = F(nu, d)
            if i % 2 == 0: out.append((f"{nu}/{d} est-elle plus petite, égale ou plus grande que 1 ?", 'plus petite' if f < 1 else 'égale' if f == 1 else 'plus grande'))
            else:
                e = nu // d; out.append((f"Encadre {nu}/{d} entre deux entiers" + (" ; écris-la : entier + fraction" if cm2 and nu > d else ''), f"{e} ≤ {nu}/{d} < {e + 1}" + (f" ; {nu}/{d} = {e} + {nu % d}/{d}" if cm2 and nu > d and nu % d else '')))
        elif kind == 'fracdec':
            d = R.choice([10, 100] + ([1000] if cm2 else [])); nu = R.randint(1, 5 * d)
            out.append((f"Décompose {nu}/{d} : entier + fractions décimales", ' + '.join(x for x in [str(nu // d) if nu // d else ''] + [f"{c}/{10 ** k}" for k, c in enumerate(str(nu % d).rjust(len(str(d)) - 1, '0'), 1) if c != '0'] if x) or '0'))
        elif kind == 'decimaux':
            d = R.choice([10, 100] + ([1000] if cm2 else [])); nu = R.randint(1, 50 * d)
            while nu % 10 == 0: nu = R.randint(1, 50 * d)
            out.append((f"Écris avec une virgule : {nu}/{d}", dec(F(nu, d))) if i % 2 == 0 else (f"Écris sous forme de fraction décimale : {dec(F(nu, d), len(str(d)) - 1)}", f"{nu}/{d}"))
        elif kind == 'compdec':
            a = F(R.randint(100, 9999), 100 if not cm2 else 1000); b = a + F(R.choice([1, -1]) * R.choice([1, 9, 10, 90]), 100 if not cm2 else 1000)
            out.append((f"Compare : {dec(a)} … {dec(b)}", '<' if a < b else '>' if a > b else '='))
        elif kind == 'adddec':
            a = F(R.randint(100, 9999), 100); b = F(R.randint(10, 999), 10 if not cm2 else 100)
            out.append((f"{dec(a)} + {dec(b)}", dec(a + b)) if i % 2 == 0 else (f"{dec(max(a, b))} − {dec(min(a, b))}", dec(max(a, b) - min(a, b))))
        elif kind == 'x10':
            a = F(R.randint(1, 9999), R.choice([10, 100])); k = R.choice([10, 100] + ([1000] if cm2 else []))
            out.append((f"{dec(a)} × {nb(k)}", dec(a * k)) if i % 2 == 0 else (f"{dec(a)} : {nb(k)}", dec(a / k)))
        elif kind == 'multdec':
            a = F(R.randint(11, 999), R.choice([10, 100])); b = R.randint(3, 9) if not cm2 else R.randint(12, 48)
            out.append((f"{dec(a)} × {b}", dec(a * b)))
        elif kind == 'divdec':
            b = R.randint(2, 9); q = F(R.randint(11, 999), 10 if not cm2 else 100); a = q * b
            out.append((f"{dec(a)} : {b}", dec(q)))
        elif kind == 'propor':
            u = R.randint(2, 9) if not cm2 else F(R.randint(11, 99), 10); k1, k2 = R.sample(range(2, 12), 2)
            out.append((f"{k1} objets coûtent {dec(u * k1)} €. Combien coûtent {k2} objets ?", f"{dec(u * k2)} € (1 objet : {dec(u)} €)"))
        elif kind == 'longueurs':
            v = R.randint(105, 9800);
            out.append((f"{nb(v)} m = … km … m", f"{v // 1000} km {v % 1000} m") if i % 2 == 0 else (f"{dec(F(v, 100))} m = … cm", f"{nb(v)} cm"))
        elif kind == 'masses':
            v = R.randint(1050, 9800)
            out.append((f"{nb(v)} g = … kg … g", f"{v // 1000} kg {v % 1000} g") if i % 2 == 0 else (f"{dec(F(v, 100))} L = … cL", f"{nb(v)} cL"))
        elif kind == 'durees':
            m = R.randint(70, 300) if not cm2 else R.randint(70, 600)
            out.append((f"{m} min = … h … min", f"{m // 60} h {m % 60} min") if i % 2 == 0 else (f"Un film commence à 14 h 35 et dure {m} min. À quelle heure finit-il ?", f"{(14 * 60 + 35 + m) // 60} h {(14 * 60 + 35 + m) % 60:02d}"))
        elif kind == 'fracqte':
            d = R.choice([2, 3, 4, 5, 10]); nu = 1 if not cm2 else R.randint(1, d - 1); q = d * R.randint(3, 20)
            out.append((f"{nu}/{d} de {q} = …", str(F(nu, d) * q)) if (i % 2 == 0 or not cm2) else (f"{nu}/{d} de … = {F(nu, d) * q}", str(q)))
        elif kind == 'addfrac':
            d = R.choice([4, 5, 6, 8, 10]); a, b = R.randint(1, d), R.randint(1, d)
            if i % 2 == 0 or not cm2: out.append((f"{a}/{d} + {b}/{d}", f"{a + b}/{d}" + (f" = {frac(F(a + b, d))}" if (a + b) % d == 0 else '')))
            else:
                d2 = d * 2; out.append((f"{a}/{d} + {b}/{d2}", f"{2 * a + b}/{d2}"))
        elif kind == 'aires':
            L, l = R.randint(3, 15), R.randint(2, 9)
            out.append((f"Rectangle de {L} cm sur {l} cm : périmètre ? aire ?", f"périmètre {2 * (L + l)} cm ; aire {L * l} cm²") if cm2 else (f"Combien de carreaux de 1 cm² pour paver un rectangle de {L} cm sur {l} cm ?", f"{L * l} carreaux, soit {L * l} cm²"))
        elif kind == 'pourcent':
            q = R.choice([20, 40, 60, 80, 120, 200, 360]); p = R.choice([10, 50] if not cm2 else [10, 20, 25, 50, 75])
            out.append((f"{p} % de {q} = …", dec(F(p, 100) * q)))
        elif kind == 'volumes':
            a, b, c = R.randint(2, 6), R.randint(2, 6), R.randint(2, 5)
            out.append((f"Combien de cubes de 1 cm³ dans un pavé de {a} cm × {b} cm × {c} cm ?", f"{a * b * c} cm³"))
        elif kind == 'tableaux':
            vals = [R.randint(5, 30) for _ in range(4)]
            out.append((f"Températures relevées : {', '.join(map(str, vals))} °C. Quelle est la plus haute ? l'écart entre la plus haute et la plus basse ?", f"{max(vals)} °C ; écart {max(vals) - min(vals)} °C"))
        elif kind == 'proba':
            r, b = R.randint(2, 6), R.randint(2, 6)
            out.append((f"Un sac contient {r} billes rouges et {b} bleues. Combien de chances sur {r + b} de tirer une rouge ?", f"{r} chances sur {r + b}"))
        elif kind in ('recherche', 'programme', 'voyage', 'bilan5'):
            a = R.randint(2, 9); b = R.randint(3, 20)
            out.append((f"Programme : je pars de {b}, je multiplie par {a}, puis j'ajoute 5. Résultat ?", str(b * a + 5)) if i % 2 == 0 else (f"Je pense à un nombre, je le multiplie par {a} et j'obtiens {a * b}. Quel est ce nombre ?", str(b)))
        else: raise ValueError(kind)
    return out[:n]

SITUATION = {  # situation de découverte du lundi (Brousseau : les procédures connues ne suffisent plus)
 'numeration': "Le jeu du banquier : des cartes de 1, 10, 100… 100 000 ; écrire le nombre obtenu quand on dépasse 999 999.",
 'comparer': "Classer les populations de villes de France (Moulins, Clermont-Ferrand, Lyon, Paris) ; justifier sans calculer.",
 'addsous': "Le budget de la sortie de classe : trouver le reste quand la retenue traverse plusieurs zéros.",
 'mult': "Le carrelage de la salle : compter les carreaux d'un grand rectangle sans les compter un à un.",
 'div': "Partager 245 images entre 7 équipes : combien chacune ? que reste-t-il ?",
 'bilan1': "Rallye de problèmes : quatre stations, une par opération.",
 'fractions': "Le partage des bandes de papier : fabriquer 1/2, 1/4, 3/4 d'une bande unité, puis 5/4.",
 'fracdec': "Le partage de la bande en 10, puis en 100 : nommer chaque morceau.",
 'decimaux': "Mesurer des bandes avec l'unité, le dixième, le centième : écrire la mesure.",
 'compdec': "Classement d'un concours de saut : 3,45 m, 3,5 m, 3,405 m… qui a gagné ?",
 'adddec': "Le ticket de caisse : calculer le total et la monnaie rendue.",
 'propor': "La recette pour 4 personnes à adapter pour 6, puis pour 10 : quelles procédures ?",
 'x10': "La machine à multiplier par 10 : que devient chaque chiffre dans le tableau de numération ?",
 'multdec': "Le prix de 7 cahiers à 1,35 € : chercher sans poser une addition de 7 termes.",
 'divdec': "Partager 12,60 € entre 4 enfants : que faire des centimes ?",
 'longueurs': "Le parcours du cross de l'école : additionner des distances en km et en m.",
 'masses': "Peser le cartable : estimer, puis peser ; comparer des contenances avec des récipients.",
 'durees': "L'emploi du temps d'une journée : calculer des durées entre deux horaires.",
 'fracqte': "Le partage de 24 bonbons : prendre les 3/4 du paquet.",
 'addfrac': "Les morceaux de gâteau : 2/6 + 3/6, et si on dépasse 1 ?",
 'aires': "Paver deux surfaces de formes différentes : laquelle est la plus grande ?",
 'pourcent': "Les soldes : 10 % et 50 % de réduction, que paie-t-on ?",
 'volumes': "Remplir une boîte de cubes : combien en faut-il ?",
 'tableaux': "Le relevé météo de la classe : organiser les données dans un tableau.",
 'proba': "Le sac de billes : est-on sûr, est-ce possible, est-ce impossible ?",
 'recherche': "Le problème des pattes : poules et lapins, 10 têtes et 28 pattes.",
 'programme': "Le nombre mystère : inventer un programme de calcul pour son voisin.",
 'voyage': "Préparer le voyage de fin d'année : distances, horaires, budget.",
 'bilan5': "Rallye mathématique de fin d'année.",
}
if __name__ == '__main__':
    for k in SITUATION:
        for niv in ('CM1', 'CM2'): print(k, niv, exos(k, 1, niv, 2))
