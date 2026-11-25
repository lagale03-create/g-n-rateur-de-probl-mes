# Figures du jeudi 26 novembre (P2 S4) : perpendiculaire passant par un point. Échelle 1 (cm réels à l'impression à 100 %).
# python3 src/p2s4/figures_jeudi.py  -> img/perp_modele.png, img/perp_amorce.png, img/perp_cm1.png, img/perp_cm2.png ; imprime les tailles (px docx) et les mesures du corrigé.
import math, json, os
import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt
IMG = os.path.join(os.path.dirname(__file__), '..', '..', 'img')
PX = 96 / 2.54  # px docx par cm
out = {}

def vec(t): return (math.cos(t), math.sin(t))
def add(p, v, k=1): return (p[0] + k * v[0], p[1] + k * v[1])

def save(fig, ax, name, xmin, xmax, ymin, ymax):
    w, h = xmax - xmin, ymax - ymin
    fig.set_size_inches(w / 2.54, h / 2.54)
    ax.set_xlim(xmin, xmax); ax.set_ylim(ymin, ymax); ax.set_aspect('equal'); ax.axis('off')
    fig.subplots_adjust(0, 0, 1, 1)
    fig.savefig(os.path.join(IMG, name), dpi=200)
    plt.close(fig)
    out[name] = {'w': round(w * PX), 'h': round(h * PX), 'cm': [round(w, 2), round(h, 2)]}

def pt(ax, p, lab, d=(0.2, 0.2), c='k'):
    ax.plot([p[0]], [p[1]], marker='+', color=c, ms=9, mew=1.5)
    ax.text(p[0] + d[0], p[1] + d[1], lab, fontsize=12, color=c, ha='center', va='center', fontweight='bold')

def seg(ax, p, q, **k): ax.plot([p[0], q[0]], [p[1], q[1]], color=k.get('c', 'k'), lw=k.get('lw', 1.6), ls=k.get('ls', '-'))

def angle_droit(ax, o, u, n, s=0.35):
    a = add(o, u, s); b = add(a, n, s); c = add(o, n, s)
    ax.plot([a[0], b[0], c[0]], [a[1], b[1], c[1]], color='k', lw=1)

# Restauration : le peigne penché. AB = 7 cm, M à 2,5 cm de A ; AD = 2,5 (côté n), ME = 3,5 (côté -n), BF = 2 (côté n) ;
# CM2 : G, à 2 cm de (AB), pied H à 8,5 cm de A (au-delà de B : prolonger la droite).
t = math.radians(20); u = vec(t); n = (-u[1], u[0])
A = (0, 0); B = add(A, u, 7); M = add(A, u, 2.5); D = add(A, n, 2.5); E = add(M, n, -3.5); F = add(B, n, 2); H = add(A, u, 8.5); G = add(H, n, 2)
pts = [A, B, M, D, E, F, H, G]
xmin = min(p[0] for p in pts) - 0.8; xmax = max(p[0] for p in pts) + 0.8; ymin = min(p[1] for p in pts) - 0.7; ymax = max(p[1] for p in pts) + 0.7
for name, full in (('perp_modele.png', True), ('perp_amorce.png', False)):
    fig, ax = plt.subplots()
    seg(ax, A, B, lw=2)
    seg(ax, A, D, lw=2); angle_droit(ax, A, u, n)
    if full:
        seg(ax, M, E, lw=2); angle_droit(ax, M, u, (-n[0], -n[1]))
        seg(ax, B, F, lw=2); angle_droit(ax, B, (-u[0], -u[1]), n)
        seg(ax, B, H, ls='--', lw=1.2); seg(ax, G, H, lw=1.6, c='#1f4e9a'); angle_droit(ax, H, (-u[0], -u[1]), n)
        pt(ax, E, 'E', (0.35, -0.1)); pt(ax, F, 'F', (0.3, 0.2)); pt(ax, H, 'H', (0.3, -0.3))
    pt(ax, A, 'A', (-0.1, -0.4)); pt(ax, M, 'M', (0.15, 0.4)); pt(ax, B, 'B', (0.25, -0.4)); pt(ax, D, 'D', (-0.35, 0.1))
    pt(ax, G, 'G', (0.35, 0.15), c='#1f4e9a')
    save(fig, ax, name, xmin, xmax, ymin, ymax)

# Entraînement CM1 : point SUR la droite. Trois droites, longueur 5 cm, orientations 0°, 65°, -30° ; point à 2,5 cm du début.
def droite(ax, P0, ang, L, lab, labpos):
    v = vec(math.radians(ang)); Q = add(P0, v, L); seg(ax, P0, Q, lw=1.6)
    ax.text(Q[0] + labpos[0], Q[1] + labpos[1], lab, fontsize=12, style='italic', ha='center', va='center')
    return v, Q
fig, ax = plt.subplots()
v1, _ = droite(ax, (0.3, 1.2), 0, 5, '(d1)', (0.45, 0)); pt(ax, add((0.3, 1.2), v1, 2.5), 'A', (0, -0.4))
v2, _ = droite(ax, (6.6, 0.4), 65, 5, '(d2)', (0.2, 0.3)); pt(ax, add((6.6, 0.4), v2, 2.5), 'B', (0.4, -0.1))
v3, _ = droite(ax, (10.6, 4.4), -30, 5, '(d3)', (0.45, 0)); pt(ax, add((10.6, 4.4), v3, 2.5), 'C', (-0.1, -0.45))
save(fig, ax, 'perp_cm1.png', 0, 16.2, -0.3, 5.6)

# Entraînement CM2 : point HORS de la droite. Pour (d6), le pied est au-delà du segment dessiné : prolonger.
fig, ax = plt.subplots()
mes = {}
def hors(ax, P0, ang, L, k, dist, lab, plab, dl, dp):
    v = vec(math.radians(ang)); nn = (-v[1], v[0]); _ = droite(ax, P0, ang, L, lab, dl)
    pied = add(P0, v, k); P = add(pied, nn, dist); pt(ax, P, plab, dp)
    mes[plab] = {'droite': lab, 'pied_depuis_debut_cm': k, 'longueur_segment_cm': L, 'distance_cm': dist, 'prolonger': k > L}
hors(ax, (0.3, 0.8), 10, 5, 2.0, 2.5, '(d4)', 'R', (0.45, 0.1), (0.35, 0.1))
hors(ax, (6.3, 0.3), 70, 5.2, 3.0, -2.2, '(d5)', 'S', (0.2, 0.3), (0.4, 0))
hors(ax, (10.3, 4.6), -25, 3.6, 5.0, -1.8, '(d6)', 'T', (0.45, 0.1), (0.35, -0.1))
save(fig, ax, 'perp_cm2.png', 0, 16.5, -0.6, 5.8)
out['mesures_cm2'] = mes
# Mesures du modèle (corrigé) : vérification des angles droits par produit scalaire
dot = lambda a, b: a[0] * b[0] + a[1] * b[1]
sub = lambda p, q: (p[0] - q[0], p[1] - q[1])
d = lambda p, q: math.dist(p, q)
out['modele'] = {'AB': d(A, B), 'AM': d(A, M), 'AD': d(A, D), 'ME': d(M, E), 'BF': d(B, F), 'BH': d(B, H), 'GH': d(G, H),
                 'ps_AD_AB': dot(sub(D, A), sub(B, A)), 'ps_ME_AB': dot(sub(E, M), sub(B, A)), 'ps_BF_AB': dot(sub(F, B), sub(B, A)), 'ps_GH_AB': dot(sub(G, H), sub(B, A))}
print(json.dumps(out, indent=1))
