# Document d'accompagnement de la révision du 18 novembre : organisation coopérative, problèmes, sons, ressources.
import json, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from data3 import HG3, SCI3, SRC
from data import semaines
d = Document(); st = d.styles['Normal']; st.font.name = 'Arial'; st.font.size = Pt(10)
for s in d.sections: s.left_margin = s.right_margin = Cm(1.8); s.top_margin = s.bottom_margin = Cm(1.5)
H = lambda t, l=1: d.add_heading(t, l)
P = lambda t: d.add_paragraph(t)
L = lambda t: d.add_paragraph(t, style='List Bullet')
def T(head, rows, w=None):
    t = d.add_table(rows=1, cols=len(head)); t.style = 'Table Grid'
    for i, h in enumerate(head): t.rows[0].cells[i].text = h; t.rows[0].cells[i].paragraphs[0].runs[0].bold = True
    for r in rows:
        c = t.add_row().cells
        for i, v in enumerate(r): c[i].text = str(v)
    if w:
        from docx.oxml.ns import qn
        t.autofit = False
        for j, gc in enumerate(t._tbl.tblGrid.findall(qn('w:gridCol'))): gc.set(qn('w:w'), str(int(w[j] * 567)))
        for row in t.rows:
            for i, x in enumerate(w): row.cells[i].width = Cm(x)
d.add_heading('Cahier journal CM1-CM2 : organisation et ressources (révision du 18 novembre 2026)', 0)
H('1. Personnaliser sans individualiser (Sylvain Connac)')
P("Connac distingue l'individualisation (un parcours par élève, sur des tâches séparées, sans interaction) de la personnalisation, qui tient ensemble la personne et le groupe. Le cahier journal s'organise donc autour de trois temps articulés :")
for x in ["Des temps collectifs étayés par l'enseignant : toute la classe cherche le même problème, la même question.", "Des temps de travail individuel vers des objectifs communs : chacun avance, avec des étayages au choix (texte ●, ●● ou ●●●, coup de pouce ★, fiche d'étayage).", "Une organisation coopérative : aide, entraide, tutorat, travail en groupe ; chaque séance précise sa forme de coopération."]: L(x)
H('La table d\'appui', 2); P("Elle remplace le « groupe fragile » : l'enseignant s'y installe, vient qui en a besoin, au moment où il en a besoin ; personne n'y est assigné durablement.")
H("Les règles de l'aide (à afficher)", 2)
T(['Celui qui demande', 'Celui qui aide'], [["J'essaie d'abord seul.", "J'ai fini mon travail."], ['Je pose une question précise.', 'Je ne donne pas la réponse : je montre, je questionne.'], ['Je remercie.', "J'encourage et je vérifie que mon camarade a compris."]], [8.5, 8.5])
H('Les groupes hétérogènes', 2); P("Groupes de quatre, composés par l'enseignant et changés à chaque période ; rôles tournants : lecteur, gardien des citations ou des sources, secrétaire, porte-parole. Démarche : recherche individuelle, travail de groupe, confrontation des désaccords, synthèse de l'enseignant, retour réflexif.")
H('Le tutorat', 2); P("Tuteurs volontaires, CM1 comme CM2, sur les compétences qu'ils ont réussies dans la semaine ; un tuteur ne donne pas la réponse ; on ne tutore pas toujours les mêmes.")
H('Les intersessions', 2); P("Les activités de lecture construites et adaptées au niveau des élèves (fiches ●, ●●, ●●● des dossiers, activités par niveau) sont réservées aux intersessions : APC, aide personnalisée, ateliers. En classe, les chapitres pivots se travaillent en classe entière et en groupes hétérogènes.")
H('2. Problème du jour : deux problèmes par jour')
P("Toute la classe travaille la même histoire. Problème 1 : le problème du jour. Problème 2, pour les nombreux élèves qui finissent vite : même histoire, données changées et autre chose à chercher (état initial, transformation ou état final, Vergnaud) ; le vendredi, une étape de plus. ★★ = objectif CM1, ★★★ = objectif CM2, ★ = coup de pouce de la table d'appui.")
H('3. Les sons : analyse de la langue')
P("Pour chaque son, j'ai analysé les 20 000 mots les plus fréquents d'une liste de fréquences du français (FrequencyWords, établie sur des sous-titres de films) avec un aligneur graphèmes-phonèmes (LireCouleur) : graphèmes, part des mots, place dans le mot, lettre qui suit. é et è sont regroupés. Les élèves reçoivent un grand corpus (40 à 60 mots fréquents) et le classent librement en groupes ; les constats sont confrontés puis validés avec ces chiffres.")
SJ = json.load(open(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'sons', 'sons.json')))
rows, seen = [], set()
for f in sorted(SJ, key=int):
    for x in SJ[f]:
        if x['son'] in seen: continue
        seen.add(x['son'])
        rows.append([x['son'], ' ; '.join(f"{g['g']} {g['mots']} %" for g in x['graphemes']), ' ; '.join(f"{g['g']} : " + ', '.join(f"{k} {v} %" for k, v in g['places'].items()) for g in x['graphemes'][:4])])
T(['Son', 'Graphèmes (part des mots)', 'Place dans le mot (graphèmes principaux)'], rows, [2.2, 7, 8])
H('4. Histoire, géographie, sciences : ressources retenues (S11 à S36)')
P("Choix guidés par les points d'appui : séquences existantes avec documents et traces écrites (ressources d'accompagnement Éduscol, DANE Nancy-Metz, Géoconfluences, Commission européenne ; La main à la pâte et académies en sciences). Liens vérifiés le 18 novembre 2026. Programmes : en 2026-2027, le CM1 suit le nouveau programme (BO n° 22 du 28 mai 2026 : en géographie Se nourrir, Les inégalités, Se déplacer, Communiquer avec Internet ; en histoire Moyen Âge, monarchie, explorations, 1789) et le CM2 l'ancien (Se déplacer, Communiquer grâce à l'Internet, Mieux habiter ; Le temps de la République, L'âge industriel, Des guerres mondiales à l'Union européenne). La géographie suit les thèmes communs aux deux niveaux. En histoire, le fil « Comment est-on arrivé à 1914 ? » couvre 1789 pour le CM1, mais pas le Moyen Âge, la monarchie ni les explorations.")
W = {w['S']: w for w in semaines()}
rows = []
for S in range(11, 37):
    tg, th, q, s1, s2, tr = HG3[S]; sc = SCI3[S]
    rows.append([f"S{S} ({W[S]['dates']})", ('Histoire : ' if tg == 'H' else 'Géographie : ') + th + '\n' + SRC[s1][0] + ' : ' + SRC[s1][1], f"{sc[0]} : {sc[1]}" + (('\n' + SRC[sc[4]][0] + ' : ' + SRC[sc[4]][1]) if sc[4] else '')])
T(['Semaine', 'Histoire / géographie', 'Sciences'], rows, [3, 7.5, 6.5])
d.save(sys.argv[1])
