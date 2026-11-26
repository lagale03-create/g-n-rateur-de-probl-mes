# Figures du vendredi 27 novembre (P2 S4) : droites graduées du bilan sur les fractions décimales.
# python3 src/p2s4/figures_vendredi.py  -> img/droite_dixiemes_KLM.png (CM1), img/droite_centiemes_PQ.png (CM2) ; imprime les tailles (px docx).
# Aucune écriture à virgule : elle arrive en P2 S5.
import os
from fractions import Fraction as F
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt
IMG = os.path.join(os.path.dirname(__file__), '..', '..', 'img')
PX = 96 / 2.54

def droite(name, n, major, labels, points, long_every=None):
    """n graduations sur 15 cm ; major : indices des grands traits ; labels : {indice: texte} ; points : {lettre: indice}."""
    L = 15.0
    fig, ax = plt.subplots()
    W, H = 16.4, 1.85
    fig.set_size_inches(W / 2.54, H / 2.54)
    x0 = 0.6
    ax.plot([x0, x0 + L + 0.5], [0, 0], color='k', lw=1.6)
    ax.annotate('', xy=(x0 + L + 0.75, 0), xytext=(x0 + L + 0.3, 0), arrowprops=dict(arrowstyle='-|>', color='k', lw=1.6))
    for i in range(n + 1):
        x = x0 + L * i / n
        hgt = 0.32 if i in major else (0.22 if long_every and i % long_every == 0 else 0.14)
        ax.plot([x, x], [-hgt, hgt], color='k', lw=1.6 if i in major else 1)
        if i in labels:
            ax.text(x, -0.62, labels[i], ha='center', va='center', fontsize=12, fontweight='bold')
    for lab, i in points.items():
        x = x0 + L * i / n
        ax.plot([x], [0], marker='o', ms=5, color='k')
        ax.text(x, 0.62, lab, ha='center', va='center', fontsize=12, fontweight='bold')
    ax.set_xlim(0, W); ax.set_ylim(-0.95, 0.9); ax.axis('off')
    fig.subplots_adjust(0, 0, 1, 1)
    fig.savefig(os.path.join(IMG, name), dpi=200)
    plt.close(fig)
    print(name, round(W * PX), round(H * PX))

# CM1 : de 0 à 2, en dixièmes ; K = 4/10, L = 11/10, M = 17/10
droite('droite_dixiemes_KLM.png', 20, {0, 10, 20}, {0: '0', 10: '1', 20: '2'}, {'K': 4, 'L': 11, 'M': 17}, long_every=5)
# CM2 : de 12/10 à 13/10, en centièmes ; P = 123/100, Q = 127/100 ; R = 125/100 à placer (trait moyen)
droite('droite_centiemes_PQ.png', 10, {0, 10}, {0: '12/10', 10: '13/10'}, {'P': 3, 'Q': 7}, long_every=5)
# Valeurs du corrigé
print('K', F(4, 10), 'L', F(11, 10), 'M', F(17, 10))
print('P', F(12, 10) + F(3, 100), 'Q', F(12, 10) + F(7, 100), 'R', F(12, 10) + F(5, 100))
