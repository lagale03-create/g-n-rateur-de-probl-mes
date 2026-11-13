# Génère les 36 semaines du cahier journal (JSON lu par src/build_annee.js) : planning, séances détaillées, fiches élèves.
import json, os, sys, random, subprocess, shutil
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from data import *
from data2 import *
from lecture import LECT
from dictees import D, FICHE, PART
from sons import mots_semaine
from exos import exos, SITUATION, dec
from conj import conj
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTJ = os.path.join(ROOT, 'gen', 'annee_json'); os.makedirs(OUTJ, exist_ok=True)
SONS_TXT = {l.split('\t')[0]: l.split('\t') for l in subprocess.run(['node', os.path.join(ROOT, 'src', 'progression_sons.js')], capture_output=True, text=True).stdout.strip().split('\n')}
PERS = ['je', 'tu', 'il, elle, on', 'nous', 'vous', 'ils, elles']
TEMPS_P = {1: ['Imparfait', 'Futur'], 2: ['Présent'], 3: ['Passé composé'], 4: ['Passé simple'], 5: ['Présent', 'Futur', 'Imparfait', 'Passé composé', 'Passé simple']}
ETAPES_G = ['observation du corpus', 'affinement : critères et manipulations', 'institutionnalisation', 'entraînement et réinvestissement']

def S_(h, dom, titre, obj, **k):
    d = {'h': h, 'dom': dom, 'titre': titre, 'obj': obj}; d.update({a: b for a, b in k.items() if b}); return d
def F_(dom, niv, titre, b, n1=False, ex=''):
    return {'dom': dom, 'niv': niv, 'titre': titre, 'b': b, 'n1': n1, 'ex': ex}

def gram_step(per, k):
    i = 0
    for notion, n in GRAM[per]:
        if k <= i + n: return notion, k - i, n
        i += n
def conj_topic(per, k): l = CONJ[per]; return l[min(k, len(l)) - 1]

# ------------------------------------------------------------ séances
def verbe_du_jour(h, v, aux, phrase, per):
    c = conj(v)
    rows = [[t] + c[t] for t in ['Présent', 'Imparfait', 'Futur', 'Passé composé', 'Passé simple']]
    focus = {1: "imparfait et futur : radical et terminaisons", 2: "présent : dans quelle colonne du tableau de la classe ?", 3: f"passé composé : auxiliaire {aux}" + (" (avoir bloque l'accord)" if aux == 'avoir' else " (être laisse passer l'accord)"),
             4: "passé simple : quelle colonne (-a, (i), (u), (in)) ?", 5: "cas particuliers : ce qui change selon le temps"}[per]
    return S_(h, 'Conjugaison', f'verbe du jour : {v}', f"Conjuguer « {v} » aux cinq temps de référence et relier chaque forme aux tableaux de la classe ({focus}).",
              comp="Maîtriser les formes des verbes : présent, imparfait, futur, passé composé, passé simple (programmes 2025)",
              crit=['les six personnes sont justes aux temps étudiés', 'la forme est reliée à sa colonne du tableau', 'CM1 : le passé simple est repéré, pas exigé'],
              mat='Support du verbe du jour de la classe ; tableaux de conjugaison affichés', ref='Gourdet (plus grande récurrence) ; Brissaud et Cogis',
              phases=[['Repérage', '3 min', f"Lit la phrase : « {phrase} » Fait trouver le verbe et son infinitif.", 'Soulignent le verbe, donnent l\'infinitif'],
                      ['Conjugaison', '5 min', 'Fait compléter le support aux cinq temps, par binômes.', 'Conjuguent, vérifient avec les tableaux'],
                      ['Correction', '2 min', f"Corrige ; focus : {focus}.", 'Corrigent au vert']],
              corrige=[f"{r[0]} : " + ' ; '.join(r[1:]) for r in rows])

def dictee_refl(h, phrase, focus, per, son=None):
    return S_(h, 'Dictée réflexive', focus, f"Écrire la phrase sous la dictée puis justifier les choix orthographiques en binôme ({focus}).",
              comp="Orthographe grammaticale et lexicale : accords, participe passé, graphies (Brissaud et Cogis)",
              crit=['les accords du GN et du verbe sont justifiés', 'le participe passé est accordé selon l\'auxiliaire', 'les graphies du son sont justifiées' if son else 'les mots invariables sont justes'],
              mat="Cahier d'essai ; codes d'accord de la classe", ref='Brissaud et Cogis (dictée réflexive, négociation graphique)',
              phases=[['Dictée', '3 min', f"Dicte : « {phrase} »", 'Écrivent seuls'],
                      ['Binômes', '4 min', '« Comparez, entourez ce qui diffère, mettez-vous d\'accord. »', 'Négocient, justifient'],
                      ['Collectif', '8 min', 'Écrit les variantes sans juger ; fait justifier chaque choix (chaînes d\'accord, auxiliaire, graphie). Avoir bloque l\'accord avec le sujet, être le laisse passer.', 'Justifient, corrigent']],
              corrige=[phrase])

def calcul(h, jour, w, cm):
    per = w['P']; t = cm['tables']; p1, p2 = PROC[per]
    if jour in ('Lundi', 'Jeudi'):
        c1, c2 = cm['proc'][jour]['CM1'], cm['proc'][jour]['CM2']
        return S_(h, 'Calcul mental', 'calcul réfléchi : ' + p1 if jour == 'Lundi' else 'entraînement de la procédure et flash',
                  "Trouver, comparer et nommer une procédure de calcul (procédure de la période), puis l'appliquer." if jour == 'Lundi' else "Automatiser la procédure de lundi ; retrouver vite les faits usuels.",
                  comp='Calculer mentalement : faits numériques, procédures (programmes 2025)', crit=['la procédure est dite avec les mots de la classe', '9 réponses justes sur 12'],
                  mat='Ardoises ; tableau de numération affiché', ref='Butlen et Pézard ; Charnay (calcul réfléchi)',
                  phases=[['Problème', '3 min', f"Écrit un calcul de chaque niveau (le 1er de la liste) : « sans poser le calcul ».", 'Cherchent sur l\'ardoise'],
                          ['Comparaison', '5 min', 'Affiche trois procédures d\'élèves, fait comparer et nommer la plus efficace.', 'Argumentent'],
                          ['Application', '7 min', 'Dicte les 12 calculs de chaque niveau.', 'Ardoise levée']] if jour == 'Lundi' else
                         [['Furet', '4 min', 'Furet sur la procédure de la période.', 'Enchaînent'], ['Ardoise', '7 min', 'Dicte les 12 calculs de chaque niveau.', 'Écrivent, lèvent l\'ardoise'], ['Flash', '4 min', 'Cartes de faits usuels (fractions, doubles, compléments).', 'Répondent à l\'oral']],
                  diff=[['CM1 fragiles', 'tableau de numération ou table sous les yeux'], ['CM2 experts', 'inventer un calcul piège']],
                  corrige=[f"CM1 ({p1}) : " + ' · '.join(f"{i + 1}) {x['q']} → {x['r']}" for i, x in enumerate(c1)), f"CM2 ({p2}) : " + ' · '.join(f"{i + 1}) {x['q']} → {x['r']}" for i, x in enumerate(c2))])
    s = cm['series'][jour]; bilan = jour == 'Vendredi'
    pr = cm['proc'][jour]
    return S_(h, 'Calcul mental', ('bilan : ' if bilan else 'série : ') + f"tables de {t[0]} et {t[1]} et procédures",
              f"Retrouver un fait des tables de {t[0]} et {t[1]} sous six formes (CM2 en dixièmes, diviseur entier) et appliquer la procédure de la période.",
              comp='Calculer mentalement (programmes 2025)', crit=['16 réponses justes sur 20', 'CM2 : virgule bien placée'], mat='Fiches CM1 et CM2 ; graphique personnel', fiche='CM1 et CM2',
              ref='Compétence calcul mental de la classe (six formes) ; générateur de procédures',
              phases=([['Série', '9 min', 'Pas d\'aide, pas de chronomètre affiché.', 'Calculent seuls'], ['Autocorrection', '4 min', 'Dicte les réponses.', 'Corrigent au vert'], ['Graphique', '2 min', 'On se compare à soi-même.', 'Reportent leur score']] if bilan else
                      [['Échauffement', '2 min', f"Table de {t[0]} à rebours.", 'Récitent'], ['Série', '9 min', 'Lance la série.', 'Calculent'], ['Correction', '4 min', 'Corrige l\'égalité inversée et le piège décimal.', 'Corrigent au vert']]),
              corrige=[f"CM1 : " + ' – '.join(f"{i + 1}) {x['r']}" for i, x in enumerate(s['CM1'][:15] + pr['CM1'][:5])), f"CM2 : " + ' – '.join(f"{i + 1}) {x['r']}" for i, x in enumerate(s['CM2'][:15] + pr['CM2'][:5]))])

def fiches_calcul(jour, cm):
    if jour not in ('Mardi', 'Vendredi'): return []
    s = cm['series'][jour]; t = cm['tables']; out = []
    for niv in ('CM1', 'CM2'):
        b = [{'t': 'p', 'x': 'On divise toujours par un nombre entier. Pense à 4 = 4,0.'}] if niv == 'CM2' else []
        k = 0
        for rub in ['Produit', 'Facteur manquant', 'Quotient', 'Diviseur manquant', 'Dividende manquant', 'Égalité inversée']:
            it = [x for x in s[niv][:15] if x['rub'] == rub]
            if not it: continue
            b += [{'t': 'consigne', 'x': rub}, {'t': 'calc', 'cols': 3, 'x': [f"{k + i + 1}) {x['q']}" for i, x in enumerate(it)]}]; k += len(it)
        b += [{'t': 'consigne', 'x': 'Procédures'}, {'t': 'calc', 'cols': 3, 'x': [f"{k + i + 1}) {x['q']}" for i, x in enumerate(cm['proc'][jour][niv][:5])]}, {'t': 'p', 'x': f"Mon score : ……… / {k + 5}"}]
        out.append(F_('Calcul mental', niv, f"{'Bilan' if jour == 'Vendredi' else 'Série'} : tables de {t[0]} et {t[1]}" + (' (décimaux)' if niv == 'CM2' else ''), b))
    return out

ETOILES = {'1': '★', '2': '★★', '3': '★★★'}
def probleme(h, jour, gdir):
    r = json.load(open(os.path.join(gdir, 'resume.json'))); d = r[jour]
    corr = []
    for n in ('1', '2', '3'):
        for i, p in enumerate(d.get(n, [])):
            corr.append(f"**{ETOILES[n]}{' · problème ' + str(i + 1) if len(d[n]) > 1 else ''}** ({p['contexte']}) : {' ; '.join(p['etapes'])}. {p['reponse']}" + (f" Données inutiles : {' '.join(p['parasites'])}" if p['parasites'] else ''))
    sit = ', '.join(sorted({s for ps in d.values() for p in ps for s in p['situations']}))
    ev = jour == 'Vendredi'
    MOM = {'Lundi': 'jour 1, problème 1', 'Mardi': 'jour 1, problème 2', 'Jeudi': 'jour 2 : mêmes histoires, inconnue « à l\'envers »', 'Vendredi': 'évaluation (nouveau contexte)'}
    return S_(h, 'Problème du jour', f"{r['titre']} (générateur, semaine {r['numero']})", "Résoudre seul un problème du même type dans un nouveau contexte." if ev else f"Résoudre un problème à étapes : {MOM[jour]}. Situations : {sit}.",
              comp='Résoudre des problèmes à étapes ; nommer les situations (Vergnaud, Houdement)', crit=['les étapes sont écrites', 'la phrase réponse répond à la question'] + ([] if ev else ['★★★ : données inutiles surlignées']),
              mat=f"Fichier du générateur (graine {r['graine']}) : ★ CM1 fragiles, ★★ CM1, ★★★ CM2", fiche='Fichier séparé du générateur',
              phases=[['Consigne', '2 min', 'Distribue la fiche de chaque niveau ; pas d\'aide sur la démarche.', 'Lisent'], ['Évaluation', '18 min', 'Observe ; note qui schématise.', 'Résolvent seuls']] if ev else
                     [['Lecture', '3 min', 'Lit l\'énoncé de chaque niveau.', 'Surlignent la question'], ['Recherche', '10 min', 'Passe auprès des ★ : questions guidées.', 'Cherchent, écrivent les étapes'], ['Mise en commun', '7 min', 'Fait nommer les situations ; compare deux procédures.', 'Expliquent, corrigent']],
              diff=[['★', 'questions guidées'], ['★★★', 'données parasites, plus d\'étapes']], corrige=corr)

def ecrit(h, phrase, per, jour):
    typ, comp = PE_TYPE[per]
    return S_(h, "Production d'écrits", f"« {phrase} »", f"Intégrer la phrase inductrice dans un récit : {comp} ; faire voir une émotion sans dialogue.",
              comp="Produire des écrits en s'appropriant les dimensions de l'activité d'écriture (programmes 2025)",
              crit=['la phrase est intégrée à l\'endroit choisi', 'le récit est cohérent (chaîne de « pourquoi ? »)', 'une émotion est montrée par le corps, les gestes, les sens', 'pas de dialogue'],
              mat="Carte d'écrivain ; version aménagée imprimée ; cahier de l'écrivain ; répertoires des émotions et des sens",
              ref=f"Kervyn (écriture longue, réécriture différée, 4 points annotés) ; film mental (Cèbe et Goigoux) ; période {per} : {typ}", fiche='Version aménagée seulement',
              phases=[['Découverte orale', '8 min', f"Écrit « {phrase} ». « Que peut-il se passer ? » Fait émerger plusieurs situations et au moins trois émotions ; sens propre et figuré quand c'est possible.", 'Proposent, classent'],
                      ["Carte d'écrivain", '7 min', '« Où est la caméra ? Que voit-on, que ne voit-on pas (hors-champ) ? »', 'Remplissent la carte'],
                      ['Pitch', '5 min', 'Fait raconter trois pitchs ; relance « pourquoi ? ».', 'Racontent en trois phrases'],
                      ['Écriture', '20 min', 'Circule ; dictée à l\'adulte pour le groupe fragile.', 'Écrivent'],
                      ['Clôture', '5 min', 'Ramasse pour annoter (4 points au plus) avant la réécriture de vendredi.', 'Relisent : ma phrase est-elle dedans ?']],
              diff=[['Version aménagée', 'amorces, banque de mots, longueur réduite'], ['CM2 experts', 'faire deviner l\'émotion sans la nommer']],
              corrige=['Émotions possibles : peur, joie, surprise, tristesse, colère, soulagement (répertoire de la classe).', 'Relances : « Pourquoi ? Où est-il ? Qui le voit ? Que ressent-il dans son corps ? Que se passe-t-il juste avant, juste après ? »'])
def fiche_ecrit(phrase, per):
    return F_("Production d'écrits", 'Version aménagée', f"« {phrase} »", [
        {'t': 'consigne', 'n': 1, 'x': 'Ma carte d\'écrivain'},
        {'t': 'table', 'head': ['Qui ?', 'Où ?', 'Quand ?', 'Quelle émotion ?'], 'rows': [['', '', '', '']], 'h': 1200},
        {'t': 'consigne', 'n': 2, 'x': 'Je commence mon histoire'},
        {'t': 'p', 'x': 'Amorces : « Ce jour-là, … » · « Au bout du chemin, … » · « Soudain, … »'},
        {'t': 'p', 'x': 'Mots utiles : trembler, sourire, le cœur qui bat, les mains moites, retenir son souffle, crier de joie.'},
        {'t': 'lignes', 'n': 9}, {'t': 'p', 'x': f'Ma phrase « {phrase} » est dans mon texte : ☐ oui'}], n1=True)

def maths_seance(h, jour, w, m, seed):
    titre, ext, kind = m
    ex1, ex2 = exos(kind, seed, 'CM1', 8), exos(kind, seed, 'CM2', 8)
    rap = exos('addsous', seed + 7, 'CM1', 1)[0], exos('mult', seed + 7, 'CM2', 1)[0]
    base = dict(comp='Programmes de mathématiques 2025 : nombres, calculs, grandeurs, résolution de problèmes', ref='Brousseau (situations) ; Brissiaud ; Vergnaud', fiche='CM1 et CM2')
    if jour == 'Lundi':
        return S_(h, 'Mathématiques', f"{titre} : situation de recherche", f"Chercher une situation où les procédures connues ne suffisent plus ; formuler une première procédure. Extension CM2 : {ext or 'approfondissement'}.",
                  crit=['une procédure est proposée et expliquée', 'le résultat est vérifié'], mat='Matériel de la situation ; fiche de recherche CM1 et CM2',
                  phases=[['Rappels', '8 min', f"Calcul posé : CM1 {rap[0][0]} ; CM2 {rap[1][0]}. Flash géométrie.", 'Calculent'],
                          ['Situation', '3 min', SITUATION[kind], 'Écoutent, reformulent'], ['Recherche', '14 min', 'Ne valide pas ; observe les procédures ; relance.', 'Cherchent en binômes'],
                          ['Mise en commun', '10 min', 'Confronte les procédures (de la plus coûteuse à la plus experte) ; débat de validité.', 'Présentent, contestent'], ['Bilan', '5 min', 'Note ce qu\'on a découvert ; à institutionnaliser demain.', 'Recopient']],
                  diff=[['CM1 fragiles', 'matériel manipulable, nombres plus petits'], ['CM2', ext or 'nombres plus grands']], corrige=[f"Rappels : {rap[0][0]} = {rap[0][1]} ; {rap[1][0]} = {rap[1][1]}.", 'CM1 : ' + ' · '.join(f'{q} → {r}' for q, r in ex1[:3]), 'CM2 : ' + ' · '.join(f'{q} → {r}' for q, r in ex2[:3])], **base)
    if jour == 'Mardi':
        return S_(h, 'Mathématiques', f"{titre} : institutionnalisation", "Formuler ce qu'on retient (trace écrite) et l'appliquer à des exercices simples.",
                  crit=['la trace est comprise et reformulée', '4 exercices justes sur 5'], mat='Fiche « Je retiens » CM1 et CM2',
                  phases=[['Rappels', '8 min', 'Numération et conversions (ardoise).', 'Ardoise'], ['Retour sur lundi', '7 min', 'Rappelle la procédure la plus efficace.', 'Reformulent'],
                          ['Institutionnalisation', '10 min', 'Écrit la trace avec les élèves.', 'Copient la trace'], ['Exercices', '15 min', 'Exercices 1 à 5 ; aide les CM1 fragiles.', 'S\'entraînent']],
                  trace=[f"{titre} : ce que je retiens (procédure de la classe, exemple résolu, piège à éviter)."], corrige=['CM1 : ' + ' · '.join(f'{q} → {r}' for q, r in ex1[:5]), 'CM2 : ' + ' · '.join(f'{q} → {r}' for q, r in ex2[:5])], **base)
    return S_(h, 'Mathématiques', f"{titre} : entraînement et bilan", "S'entraîner en autonomie, puis réussir le bilan de la semaine.",
              crit=['6 exercices justes sur 8'], mat='Fiche d\'entraînement CM1 et CM2',
              phases=[['Rappels', '8 min', 'Flash géométrie ; calcul posé.', 'Ardoise'], ['Entraînement', '22 min', 'Plan de travail différencié ; les CM2 tutorent.', 'S\'entraînent'], ['Bilan', '10 min', 'Exercices 7 et 8 en autonomie, corrigés ensemble.', 'Bilan']],
              corrige=['CM1 : ' + ' · '.join(f'{i + 1}) {r}' for i, (q, r) in enumerate(ex1)), 'CM2 : ' + ' · '.join(f'{i + 1}) {r}' for i, (q, r) in enumerate(ex2))], **base)
def fiches_maths(jour, m, seed):
    titre, ext, kind = m; out = []
    for niv in ('CM1', 'CM2'):
        ex = exos(kind, seed, niv, 8)
        if jour == 'Lundi': b = [{'t': 'texte', 'x': SITUATION[kind]}, {'t': 'consigne', 'n': 1, 'x': 'Je cherche et j\'explique ma procédure'}, {'t': 'cadre', 'h': 4200, 'x': 'Mes essais'}, {'t': 'consigne', 'n': 2, 'x': 'Je m\'entraîne'}, {'t': 'calc', 'cols': 1, 'x': [f"{i + 1}) {q} = …………" for i, (q, r) in enumerate(ex[:3])]}]
        elif jour == 'Mardi': b = [{'t': 'consigne', 'x': 'Je retiens'}, {'t': 'cadre', 'h': 2600, 'x': 'Trace écrite collective (à compléter en classe)'}, {'t': 'consigne', 'x': 'Je m\'exerce'}, {'t': 'calc', 'cols': 1, 'x': [f"{i + 1}) {q} : …………" for i, (q, r) in enumerate(ex[:5])]}]
        else: b = [{'t': 'consigne', 'x': 'Entraînement'}, {'t': 'calc', 'cols': 1, 'x': [f"{i + 1}) {q} : …………" for i, (q, r) in enumerate(ex[:6])]}, {'t': 'consigne', 'x': 'Bilan'}, {'t': 'calc', 'cols': 1, 'x': [f"{i + 7}) {q} : …………" for i, (q, r) in enumerate(ex[6:8])]}]
        out.append(F_('Mathématiques', niv, titre + (' (' + ext + ')' if niv == 'CM2' and ext else ''), b))
    return out

def geometrie(h, g):
    _, _, titre, sit, cm2, appui = g
    return S_(h, 'Géométrie', titre, f"{sit}.", comp='Espace et géométrie : reconnaître, nommer, décrire, construire (programmes 2025)',
              crit=['la construction est exacte (contrôle aux instruments)', 'le vocabulaire est employé', f'CM2 : {cm2}'], mat='Règle, équerre, compas, gabarits, papier calque ; fiche',
              ref=f"{appui} ; Duval et Perrin-Glorian (vision des surfaces → lignes → points)", fiche='CM1 et CM2',
              phases=[['Prédire', '5 min', 'Présente la figure ou la situation ; « que va-t-il se passer ? »', 'Prédisent'], ['Vérifier', '15 min', sit + ' : en dyade, avec les instruments.', 'Construisent, vérifient'],
                      ['Formuler', '10 min', 'Fait formuler ce qui permet de réussir ; l\'instrument contredit la perception.', 'Formulent'], ['Institutionnaliser', '5 min', 'Trace et vocabulaire.', 'Copient'], ['Réinvestir', '5 min', f'CM2 : {cm2}.', 'Réinvestissent']],
              diff=[['CM1 fragiles', 'gabarits, figure amorcée'], ['CM2', cm2]])
def fiche_geo(g):
    _, _, titre, sit, cm2, _ = g
    return [F_('Géométrie', 'CM1 et CM2', titre, [{'t': 'texte', 'x': sit}, {'t': 'consigne', 'n': 1, 'x': 'Je prédis, puis je vérifie avec mes instruments'}, {'t': 'cadre', 'h': 6200, 'x': 'Espace de construction'},
            {'t': 'consigne', 'n': 2, 'x': 'J\'écris ce que j\'ai compris'}, {'t': 'lignes', 'n': 3}, {'t': 'consigne', 'n': 3, 'x': f'CM2 : {cm2}'}, {'t': 'cadre', 'h': 2600}])]

def lecture_pivot(h, w, L, temps):
    per = w['P']; piv = L['piv']; dos = L.get('dos')
    t13 = temps == '1-3'
    if t13:
        ph = [['1. Rappel', '5 min', 'Un ou deux élèves racontent l\'épisode précédent ; la classe complète.', 'Racontent'],
              ['2. Lecture', '10 min', 'N1 : lecture magistrale ou audio, texte ● sous les yeux ; N2 : silencieuse puis relecture d\'un passage clé ; N3 : autonome.', 'Lisent'],
              ['3. Questions → débat', '20 min', f"Réponse individuelle, binômes, débat à partir des désaccords : « {L.get('deb', '…')} » Chaque réponse s'appuie sur une phrase du texte et sa page.", 'Répondent, justifient, débattent']]
    else:
        ph = [['4. Rituels', '8 min', 'Chaînes anaphoriques ; tableau « Où ? Quand ? Dans quel monde ? ».', 'Relèvent, complètent'], ['5. Activités', '12 min', 'Activités différenciées (fiche) ; l\'enseignant commence avec les N1.', 'Travaillent'],
              ['6. Mise en commun → écrit', '10 min', 'Synthèse « comment on a compris » ; lancement de l\'écrit d\'appropriation.', 'Formulent, écrivent']]
    corr = []
    if L.get('q'):
        corr += [f"{n} : {q} → {a}" for n, (q, a) in zip(['N1 ●', 'N2 ●●', 'N3 ●●●'], L['q'])]
    if L.get('act'): corr.append('Activités : ' + ' ; '.join(f"{n} {a}" for n, a in zip(['●', '●●', '●●●'], L['act'])))
    if L.get('ecr'): corr.append('Écrits : ' + ' ; '.join(L['ecr']))
    return S_(h, 'Lecture', f"{COURT[per]}, pivot {piv} (temps {temps})", ("Comprendre le sens général et les pensées des personnages ; justifier par le texte ; débattre." if t13 else "Automatiser les rituels (chaînes, contexte), mener l'activité de lecture du chapitre et écrire pour s'approprier le texte."),
              comp=f"Comprendre un texte littéraire et l'interpréter (programmes 2025) ; focus de la période : {FOCUS[per]}",
              crit=['la réponse est justifiée par une phrase du texte', 'le débat s\'appuie sur des indices'] if t13 else ['les désignations sont reliées au bon personnage', 'l\'écrit est cohérent avec le chapitre'],
              mat=f"Livre ou textes adaptés ●/●●/●●● ; {('dossier : ' + dos) if dos else 'fiche de compréhension de la semaine'}", ref='Goigoux et Cèbe (Lector et Lectrix) ; Giasson ; Tauveron',
              fiche=('Dossier de compréhension (fichier séparé)' if dos else 'N1, N2, N3'), phases=ph, corrige=corr or None,
              note=(L.get('vig') or None))
def fiches_pivot(w, L, temps):
    if L.get('dos') or not L.get('q'): return []
    per = w['P']; out = []
    if temps == '1-3':
        for i, n in enumerate(['N1', 'N2', 'N3']):
            q = L['q'][i]; b = [{'t': 'consigne', 'n': 1, 'x': 'Je comprends le chapitre'}, {'t': 'p', 'x': q[0]}, {'t': 'lignes', 'n': 2},
                                {'t': 'p', 'x': 'La phrase qui le prouve : …………………………………… page …'}, {'t': 'lignes', 'n': 1},
                                {'t': 'consigne', 'n': 2, 'x': '★ Question à débattre : ' + L['deb']}, {'t': 'p', 'x': 'Ma réponse, avec une phrase du texte et sa page :'}, {'t': 'lignes', 'n': 3 if n != 'N1' else 2}]
            if n == 'N3': b += [{'t': 'consigne', 'n': 3, 'x': 'Pour aller plus loin'}, {'t': 'p', 'x': L['q'][2][0]}, {'t': 'lignes', 'n': 2}]
            out.append(F_('Lecture', n + ' ' + '●' * (i + 1), f"{COURT[per]} – pivot {L['piv']}", b, n1=(n == 'N1')))
    else:
        b = [{'t': 'consigne', 'n': 1, 'x': 'Qui est qui ? Les mots qui désignent'}, {'t': 'table', 'head': ['Personnage', 'Les mots qui le désignent (page)'], 'rows': [['', ''], ['', ''], ['', '']], 'h': 800},
             {'t': 'consigne', 'n': 2, 'x': 'Où ? Quand ? Dans quel monde ?'}, {'t': 'table', 'head': ['Où ?', 'Quand ?', 'Dans quel monde ?'], 'rows': [['', '', '']], 'h': 1400},
             {'t': 'consigne', 'n': 3, 'x': 'Activité'}, {'t': 'liste', 'x': [f"{s} : {a}" for s, a in zip(['●', '●●', '●●●'], L['act'])]}, {'t': 'cadre', 'h': 2400},
             {'t': 'consigne', 'n': 4, 'x': "J'écris (au choix)"}, {'t': 'liste', 'x': L['ecr']}, {'t': 'lignes', 'n': 5}]
        out.append(F_('Lecture', 'N1, N2, N3', f"{COURT[per]} – pivot {L['piv']} : rituels, activité, écrit", b))
    return out

def lecture_mardi(h, w):
    per, k = w['P'], w['k']
    strat = ['anticiper à partir du titre et de l\'image', 'reformuler', 'repérer l\'implicite', 'relier texte et image', 'se faire un film', 'repérer qui parle', 'résumer']
    st = strat[(k - 1) % len(strat)]
    return S_(h, 'Lecture', f"autre support : {SUPPORT[per].split(' (')[0].lower()} – stratégie : {st}", f"Lire un support de la période ({SUPPORT[per]}) en appliquant explicitement une stratégie : {st}.",
              comp='Lire et comprendre des textes variés (programmes 2025)', crit=['la stratégie est nommée et utilisée', 'la réponse est justifiée'], mat=f"Support de la semaine ({SUPPORT[per]}) ; fiche de stratégie",
              ref='Cèbe et Goigoux (enseignement explicite des stratégies) ; Giasson', fiche='Tous',
              phases=[['Modelage', '5 min', f"Pense à voix haute sur le début du support : comment {st} ?", 'Écoutent'], ['Pratique guidée', '8 min', 'Lecture en binômes ; questions de la fiche.', 'Lisent, répondent'], ['Bilan', '7 min', '« Qu\'est-ce qui nous a aidés à comprendre ? »', 'Formulent la stratégie']],
              note='Choisir le support de la semaine dans la bibliothèque de classe ; la fiche est commune à tous les supports de la période.')
def fiche_lecture_mardi(w):
    per = w['P']
    return F_('Lecture', 'Tous', f"Lire un support : {SUPPORT[per].split(' (')[0]}", [{'t': 'p', 'x': 'Titre du support : ……………………………………'},
             {'t': 'consigne', 'n': 1, 'x': 'Avant de lire : qu\'est-ce que je m\'attends à lire ? Pourquoi ?'}, {'t': 'lignes', 'n': 2},
             {'t': 'consigne', 'n': 2, 'x': 'Pendant la lecture : je note un passage difficile et ce qui m\'a aidé'}, {'t': 'lignes', 'n': 3},
             {'t': 'consigne', 'n': 3, 'x': 'Après la lecture : je résume en deux phrases'}, {'t': 'lignes', 'n': 3},
             {'t': 'consigne', 'n': 4, 'x': 'La stratégie que j\'ai utilisée :'}, {'t': 'lignes', 'n': 1}])

def grammaire(h, w, Ln):
    per = w['P']; notion, step, n = gram_step(per, w['k'])
    et = ETAPES_G[min(step, 4) - 1] if step <= 4 else 'réinvestissement'
    c1, c2 = NATURES[per]
    return S_(h, 'Grammaire', f"{notion} ({step}/{n}) : {et}", f"{notion.capitalize()} : {et}. Natures CM1 : {c1} ; CM2 : {c2}.",
              comp='Comprendre le fonctionnement de la phrase ; identifier les classes de mots (programmes 2025, sans « prédicat »)',
              crit=['les critères de tri sont formulés', 'les manipulations (remplacer, déplacer, supprimer) sont utilisées'], mat=f"Corpus de phrases tirées du roman de la période ({COURT[per]}, chapitres déjà lus), étiquettes", fiche='CM1 et CM2',
              ref='Démarche inductive : observer, classer, formuler, éprouver (Brissaud et Cogis) ; programmes 2025',
              phases={'observation du corpus': [['Tri', '15 min', 'Distribue le corpus ; « classez ces phrases ou groupes selon un critère que vous choisissez ».', 'Classent en binômes'], ['Mise en commun', '20 min', 'Recueille les critères, garde ceux qui sont grammaticaux.', 'Justifient'], ['Bilan', '10 min', 'Note les questions ouvertes.', 'Copient']],
                      'affinement : critères et manipulations': [['Manipulations', '20 min', 'Fait remplacer, déplacer, supprimer les groupes : qu\'est-ce qui change ?', 'Manipulent'], ['Critères', '15 min', 'Affine les critères.', 'Formulent'], ['Bilan', '10 min', 'Affiche les critères.', 'Copient']],
                      'institutionnalisation': [['Rappel', '10 min', 'Rappelle les critères.', 'Reformulent'], ['Trace écrite', '20 min', 'Écrit la règle avec les élèves.', 'Copient la trace'], ['Application', '15 min', 'Exercices de la fiche.', 'S\'exercent']]}.get(et, [['Rappel', '5 min', 'Rappelle la règle.', 'Reformulent'], ['Entraînement', '25 min', 'Exercices différenciés.', 'S\'entraînent'], ['Réinvestissement', '15 min', 'Repérage dans un texte du roman.', 'Repèrent']]),
              note="Corpus : relever 8 à 10 phrases courtes dans les chapitres déjà lus (pas de texte de roman dans le dépôt public).")
def fiche_gram(w):
    per = w['P']; notion, step, n = gram_step(per, w['k'])
    return F_('Grammaire', 'CM1 et CM2', f"{notion.capitalize()} ({step}/{n})", [{'t': 'consigne', 'n': 1, 'x': 'Le corpus (phrases du roman, collées ici)'}, {'t': 'cadre', 'h': 3600},
            {'t': 'consigne', 'n': 2, 'x': 'Je classe et j\'explique mon critère'}, {'t': 'cadre', 'h': 3000}, {'t': 'consigne', 'n': 3, 'x': 'Ce que je retiens'}, {'t': 'lignes', 'n': 4}])

def ortho(h, w, j, mots, inv, fiche, son, graph):
    per = w['P']
    T = {1: ('repérer les graphèmes et les intrus', [['Remémoration', '2 min', 'Dictée flash de 3 mots des semaines précédentes.', 'Écrivent'], ['Repérage', '10 min', f"Liste de mots avec {son} et des intrus : trier, colorier le graphème.", 'Trient'], ['Les dix mots', '3 min', 'Lit la liste ; deux mots en copie flash.', 'Copient']]),
         2: ('régularités et trace écrite ; mémorisation', [['Régularités', '10 min', 'Où se place chaque graphème ? Pourquoi les intrus ?', 'Formulent'], ['Trace', '5 min', 'Trace dans le répertoire.', 'Copient'], ['Mémorisation', '5 min', '« J\'observe, je lis, je repère, j\'épelle, je ferme les yeux, je vérifie, j\'écris. »', 'Mémorisent']]),
         4: ('entraînement et dictée des dix mots', [['Entraînement', '8 min', 'Copie flash, transport copie, copie retournée.', 'S\'entraînent'], ['Dictée', '5 min', 'Dicte les dix mots.', 'Écrivent'], ['Bilan', '2 min', 'Les mots ratés vont dans la liste personnelle.', 'Notent']])}[j]
    return S_(h, 'Orthographe', f"son {son} ({fiche}) – jour {j} : {T[0]}", f"{T[0].capitalize()} ; graphies : {graph}. Point de morphologie de la période : {MORPHO[per]}.",
              comp='Écrire correctement les mots fréquents en s\'appuyant sur les régularités et la formation (programmes 2025)', crit=['le graphème est identifié', '8 mots sur 10 justes à la dictée'],
              mat='Répertoire orthographique ; fiche', ref='Brissaud et Cogis (démarche inductive) ; Catach ; Éduscol « Écrire des mots »', fiche='Tous', phases=T[1],
              corrige=['Dix mots : ' + ', '.join(mots + inv[:2]) + ' (CM2 : + ' + ', '.join(inv[2:4]) + ').'])
def fiche_ortho(j, mots, intr, inv, son, graph):
    if j == 1:
        l = mots + intr; random.Random(son).shuffle(l)
        return F_('Orthographe', 'Tous', f"Le son {son} : je trie", [{'t': 'consigne', 'n': 1, 'x': f"Lis chaque mot. Entends-tu {son} ? Colorie le graphème. Barre les intrus."}, {'t': 'calc', 'cols': 3, 'x': l},
                  {'t': 'consigne', 'n': 2, 'x': 'Je classe par graphème'}, {'t': 'table', 'head': graph.replace(' ; ', ', ').split(', ')[:5], 'rows': [[''] * min(5, len(graph.replace(' ; ', ', ').split(', ')))], 'h': 1600}])
    if j == 2:
        return F_('Orthographe', 'Tous', f"Le son {son} : les dix mots de la semaine", [{'t': 'table', 'head': ['Les dix mots', 'Je repère (lettres muettes, doubles, accents)'], 'rows': [[m, ''] for m in mots + inv[:2] + inv[2:4]], 'h': 500},
                  {'t': 'p', 'x': 'CM2 : les deux derniers mots en plus. Élèves fragiles : les six premiers.'}, {'t': 'consigne', 'x': 'Ce que je retiens (trace)'}, {'t': 'lignes', 'n': 3}])
    return F_('Orthographe', 'Tous', f"Le son {son} : dictée des dix mots", [{'t': 'table', 'head': ['N°', 'Mot'], 'rows': [[str(i + 1), ''] for i in range(12)], 'w': [900, 9300], 'h': 560},
              {'t': 'p', 'x': 'Mon score : ……… / 10 (CM2 : / 12). Mes mots à revoir vont dans ma liste personnelle.'}])

def conj_seance(h, w, j, verbes):
    per, k = w['P'], w['k']; topic = conj_topic(per, k); T = TEMPS_P[per]
    forms = [conj(v)[T[(i) % len(T)]] for i, (v, a) in enumerate(verbes)]
    if j == 'construction':
        return S_(h, 'Conjugaison', f"{topic} : construire la règle", f"Classer les formes du corpus (verbes du jour) pour construire ou compléter le tableau de la classe : {topic}.",
                  comp='Maîtriser les formes des verbes (programmes 2025)', crit=['les formes sont classées selon un critère', 'les colonnes sont nommées', 'ce qui n\'entre nulle part est mis de côté (⚠)'],
                  mat='Corpus des verbes du jour ; tableau de la classe', ref='Gourdet (plus grande récurrence)', fiche='Tous',
                  phases=[['Corpus', '3 min', 'Distribue le corpus des verbes du jour.', 'Lisent'], ['Classement', '7 min', 'Binômes : classer selon les terminaisons.', 'Classent'], ['Mise en commun', '5 min', 'Nomme les colonnes ; met de côté les ⚠.', 'Justifient']],
                  corrige=[f"{v} : " + ' ; '.join(f) for (v, a), f in zip(verbes, forms)])
    return S_(h, 'Conjugaison', f"{topic} : entraînement", f"S'entraîner à conjuguer ({topic}) en s'appuyant sur le tableau de la classe.", comp='Maîtriser les formes des verbes (programmes 2025)',
              crit=['8 formes justes sur 10'], mat='Fiche d\'entraînement', fiche='Tous', phases=[['Exercice', '10 min', 'Fiche ; les rapides inventent des phrases.', 'Conjuguent'], ['Correction', '5 min', 'Correction collective avec le tableau.', 'Corrigent']],
              corrige=[f"{v} ({T[0]}) : " + ' ; '.join(conj(v)[T[0]]) for v, a in verbes[:3]])
def fiche_conj(w, j, verbes):
    per, k = w['P'], w['k']; T = TEMPS_P[per]; topic = conj_topic(per, k)
    if j == 'construction':
        forms = [x for i, (v, a) in enumerate(verbes) for x in conj(v)[T[i % len(T)]][::2]]
        random.Random(k).shuffle(forms)
        return F_('Conjugaison', 'Tous', f"{topic} : je classe", [{'t': 'consigne', 'n': 1, 'x': 'Découpe ou recopie les formes et classe-les selon leur terminaison'}, {'t': 'calc', 'cols': 3, 'x': forms},
                  {'t': 'consigne', 'n': 2, 'x': 'Mon tableau (je nomme les colonnes)'}, {'t': 'table', 'head': ['', '', '', '⚠'], 'rows': [['', '', '', '']], 'h': 2400}])
    v = [x for x, a in verbes]
    return F_('Conjugaison', 'Tous', f"{topic} : je m'entraîne", [{'t': 'consigne', 'n': 1, 'x': f"Conjugue au {T[0].lower()}"},
              {'t': 'table', 'head': [''] + v[:3], 'rows': [[p, '', '', ''] for p in PERS], 'h': 520}, {'t': 'consigne', 'n': 2, 'x': 'Écris une phrase avec le verbe ' + v[3] + ' au ' + T[0].lower()}, {'t': 'lignes', 'n': 2}])

def sciences(h, w, jour):
    th, q, xp, concl = SCIENCES[w['S'] - 1]
    if jour == 'Lundi':
        return S_(h, 'Sciences', f"{th} : {q}", f"Formuler ses conceptions et des hypothèses, puis concevoir un protocole pour répondre à la question : « {q} »",
                  comp='Pratiquer des démarches scientifiques (programme de sciences et technologie 2026, CM1 ; cycle 3, CM2)', crit=['une hypothèse est formulée', 'le protocole ne change qu\'une variable'],
                  mat="Cahier d'expériences ; relevé météo (5 min)", ref='La main à la pâte (démarche d\'investigation)', fiche='Tous',
                  phases=[['Météo', '5 min', 'Relevé hebdomadaire : température, pluie, vent.', 'Relèvent'], ['Situation', '10 min', f"Question : « {q} » Trace de la semaine précédente.", 'Écrivent leurs conceptions'], ['Hypothèses', '15 min', 'Recueille et classe les hypothèses.', 'Proposent'], ['Protocole', '15 min', 'Groupes : protocole et matériel pour jeudi.', 'Rédigent']])
    return S_(h, 'Sciences', f"{th} : expérimentation", f"Mener l'expérience ({xp}), comparer les résultats des groupes et conclure.",
              comp='Pratiquer des démarches scientifiques ; mesurer, comparer, conclure', crit=['les résultats sont notés', 'la conclusion répond à la question'], mat=xp, ref='La main à la pâte', fiche='Tous',
              phases=[['Expérience', '35 min', 'Rôles tournants dans les groupes ; mesures.', 'Expérimentent'], ['Comparaison', '20 min', 'Compare les résultats des groupes (reproductibilité).', 'Présentent'], ['Conclusion', '20 min', 'Rédige la conclusion avec la classe.', 'Copient']],
              trace=[concl])
def fiche_sciences(w, jour):
    th, q, xp, concl = SCIENCES[w['S'] - 1]
    if jour == 'Lundi':
        return F_('Sciences', 'Tous', f"{th} : {q}", [{'t': 'consigne', 'n': 1, 'x': 'Ce que je pense (mes conceptions)'}, {'t': 'cadre', 'h': 2000}, {'t': 'consigne', 'n': 2, 'x': 'Mon hypothèse'}, {'t': 'lignes', 'n': 2},
                  {'t': 'consigne', 'n': 3, 'x': 'Notre protocole (matériel, étapes, ce qu\'on va mesurer)'}, {'t': 'cadre', 'h': 3200}])
    return F_('Sciences', 'Tous', f"{th} : résultats et conclusion", [{'t': 'texte', 'x': f"Expérience : {xp}"}, {'t': 'consigne', 'n': 1, 'x': 'Nos résultats'}, {'t': 'cadre', 'h': 3000},
              {'t': 'consigne', 'n': 2, 'x': 'Les autres groupes ont-ils trouvé la même chose ?'}, {'t': 'lignes', 'n': 2}, {'t': 'consigne', 'n': 3, 'x': 'Conclusion'}, {'t': 'lignes', 'n': 3}])

def hg(h, w, jour):
    tg, th, suj, docs = HG[w['S'] - 1]; dom = 'Histoire' if tg == 'H' else 'Géographie'
    if jour == 'Lundi':
        return S_(h, dom, suj, f"Étudier des documents pour répondre à la question de la semaine : {suj}.", comp=f"{dom} : se repérer dans le temps et l'espace ; comprendre un document (nouveau programme cycle 3, année B)",
                  crit=['les informations sont prélevées dans les documents', 'la source est identifiée (auteur, date, nature)'], mat=f"Documents : {docs} (sources originales ; photographies de personnes en lien seulement)",
                  ref='Audigier ; Heimberg (repères temporels)', fiche='Tous',
                  phases=[['Question', '10 min', f"Pose la question : {suj}. Recueille les représentations.", 'Proposent'], ['Documents', '30 min', 'Étude en groupes : qui a produit le document ? quand ? que montre-t-il ?', 'Prélèvent, confrontent'], ['Mise en commun', '20 min', 'Construit la réponse ; écrit de travail.', 'Formulent']],
                  note='Ne jamais reproduire de photographie de personne réelle : lien seulement ; vérifier chaque source avant de l\'utiliser.')
    return S_(h, dom, f"{suj} : trace écrite, frise ou carte", 'Écrire la trace validée et placer le repère (frise ou carte).', comp=f'{dom} : construire des repères', crit=['la trace répond à la question', 'le repère est placé'],
              mat='Frise de classe ou fond de carte', fiche='Tous', phases=[['Rappel', '5 min', 'Rappel de lundi.', 'Rappellent'], ['Trace', '15 min', 'Rédaction collective.', 'Copient'], ['Repère', '10 min', 'Frise ou carte.', 'Placent']])
def fiche_hg(w, jour):
    tg, th, suj, docs = HG[w['S'] - 1]; dom = 'Histoire' if tg == 'H' else 'Géographie'
    if jour == 'Lundi':
        return F_(dom, 'Tous', suj, [{'t': 'texte', 'x': f"Documents : {docs}"}, {'t': 'table', 'head': ['Document', 'Qui l\'a produit ?', 'Quand ?', 'Ce qu\'il montre'], 'rows': [['1', '', '', ''], ['2', '', '', '']], 'h': 1400},
                 {'t': 'consigne', 'x': 'Ma réponse à la question'}, {'t': 'lignes', 'n': 4}])
    return F_(dom, 'Tous', f"{suj} : je retiens", [{'t': 'consigne', 'x': 'Trace écrite'}, {'t': 'lignes', 'n': 6}, {'t': 'consigne', 'x': 'Je place le repère' + (' sur la frise' if tg == 'H' else ' sur la carte')}, {'t': 'cadre', 'h': 3000}])

def anglais(h, w, jour, dur):
    per = w['P']; alb, th, l1, l2, tache, pho, steps = ANGLAIS[per]; st = steps[(w['k'] - 1) % len(steps)]
    role = {'Lundi': 'rituel et réactivation', 'Mardi': 'découverte, compréhension orale, phonologie', 'Jeudi': 'pratique guidée en binômes, écrit court', 'Vendredi': 'mini-production, chant, étape de la tâche finale'}[jour]
    return S_(h, 'Anglais', f"{st} ({dur})", f"{role.capitalize()} : {st}. Langue : CM1 {l1} ; CM2 {l2}.", comp='Langues vivantes : comprendre, réagir, parler en continu (A1)',
              crit=['comprend la consigne orale', 'produit la structure de la semaine'], mat=f"Album : {alb} ; flashcards ; « My English notebook »", ref='Ellis et Brewster (storybook approach)',
              fiche='Tous' if jour == 'Jeudi' else None, phases=[['Warm-up', '3 min' if dur == '15 min' else '5 min', 'Rituel : date, météo, chant.', 'Répondent'], ['Activité', '9 min' if dur == '15 min' else '20 min', f"{st} ; phonologie : {pho}.", 'Écoutent, répètent, jouent'], ['Wrap-up', '3 min' if dur == '15 min' else '5 min', 'Récapitule la structure.', 'Redisent']],
              note=f"Tâche finale de la période : {tache}.")
def fiche_anglais(w):
    per = w['P']; alb, th, l1, l2, tache, pho, steps = ANGLAIS[per]; st = steps[(w['k'] - 1) % len(steps)]
    return F_('Anglais', 'Tous', f"My English notebook – {st}", [{'t': 'consigne', 'x': 'Today I learnt…'}, {'t': 'lignes', 'n': 3}, {'t': 'consigne', 'x': 'Draw and write'}, {'t': 'cadre', 'h': 3600}, {'t': 'p', 'x': 'I can… ☐ understand  ☐ say  ☐ write'}])

def eps(h, w, jour, long_=False):
    per = w['P']; par, seq = EPS[per]; et = EPS_ETAPES[min(w['k'], 7) - 1]
    if long_:
        return S_(h, 'EPS', f"{seq} : {et}", f"Séance longue : {seq} — {et}.", comp='EPS : adapter ses déplacements, conduire et maîtriser un affrontement, s\'exprimer devant les autres', crit=['respecte les règles et la sécurité', 'progresse par rapport à la situation de référence'],
                  mat='Salle polyvalente ; malles USEP', ref='Situations de référence ; rôles sociaux', phases=[['Échauffement', '10 min', 'Échauffement spécifique.', 'S\'échauffent'], ['Situation', '40 min', f"{et} ; rôles tournants.", 'Pratiquent'], ['Retour au calme', '10 min', 'Bilan et étirements.', 'Verbalisent']])
    return S_(h, 'EPS', f"parcours athlétique : {par}", f"Parcours quotidien de 15 min : {par}.", comp='EPS : produire une performance', crit=['enchaîne le parcours sans s\'arrêter'], mat='Cour ; plots, haies', phases=[['Parcours', '15 min', 'Parcours en vagues ; chronomètre selon la période.', 'Courent']])

def arts(h, w, jour):
    per = w['P']; ap, ref, mus, ecoute = ARTS[per]
    if jour == 'Mardi':
        return S_(h, 'Arts plastiques', ap, f"Pratique, verbalisation, référence : {ap}.", comp='Expérimenter, produire, créer ; s\'exprimer sur son travail et sur des œuvres', crit=['la production répond à l\'incitation', 'l\'élève explique ses choix'],
                  mat='Matériel de peinture, collage', ref=f"Gaillot ; œuvre de référence : {ref}", phases=[['Incitation', '5 min', 'Incitation ouverte.', 'Écoutent'], ['Production', '25 min', 'Circule, questionne.', 'Produisent'], ['Verbalisation', '10 min', 'Mise en mots des choix.', 'Expliquent'], ['Référence', '5 min', f"Présente l'œuvre : {ref}.", 'Observent']])
    return S_(h, 'Éducation musicale', mus, f"Écouter, chanter, produire : {mus}.", comp='Chanter, écouter, comparer, explorer', crit=['chante juste en groupe', 'décrit un extrait avec le vocabulaire'], mat=f"Écoute : {ecoute}", ref='Écouter, chanter, produire',
              phases=[['Chant', '12 min', 'Chant appris par imitation.', 'Chantent'], ['Écoute', '10 min', f"Écoute active : {ecoute}.", 'Décrivent'], ['Production', '8 min', 'Production sonore.', 'Produisent']])

def emc(h, w):
    t = EMC[w['S'] - 1]
    return S_(h, 'EMC', t, f"Débat réglé ou étude de cas : {t}.", comp='EMC : respecter autrui, acquérir et partager les valeurs de la République, construire une culture civique', crit=['respecte les règles du débat', 'argumente avec des connaissances'],
              mat='Rôles du débat (président, reformulateur, gardien du temps, secrétaire)', ref='Tozzi (débat réglé)', fiche='Tous',
              phases=[['Question', '5 min', f"Pose la question du jour : {t}.", 'Écoutent'], ['Débat', '20 min', 'Débat réglé.', 'Argumentent'], ['Trace', '5 min', 'Ce que nous retenons.', 'Copient']],
              note='EVAR : séances séparées par niveau, livrets Éduscol, familles informées.' if 'EVAR' in t else None)
def fiche_emc(w):
    t = EMC[w['S'] - 1]
    return F_('EMC', 'Tous', t, [{'t': 'table', 'head': ['Président', 'Reformulateur', 'Gardien du temps', 'Secrétaire'], 'rows': [['', '', '', '']], 'h': 600},
             {'t': 'consigne', 'n': 1, 'x': 'Ce que je pense avant le débat, et pourquoi'}, {'t': 'lignes', 'n': 3}, {'t': 'consigne', 'n': 2, 'x': 'Un argument entendu qui m\'a fait réfléchir'}, {'t': 'lignes', 'n': 2},
             {'t': 'consigne', 'n': 3, 'x': 'Ce que nous retenons'}, {'t': 'lignes', 'n': 3}])

def vocabulaire(h, w):
    per = w['P']; res, outil, mots = VOCA[per]; et = VOCA_ETAPES[min(w['k'], 7) - 1]
    return S_(h, 'Vocabulaire', f"{res} : {et}", f"Réseau lexical de la période ({res}) — {et} ; outil : {outil}.", comp='Enrichir son lexique ; comprendre la formation des mots (programmes 2025)', crit=['les mots sont classés avec un critère', 'les mots sont réemployés'],
              mat='Cahier de lexique (carte du réseau)', ref='Picoche ; Sardier', fiche='Tous', phases=[['Rappel', '3 min', 'Rappel de la carte.', 'Rappellent'], ['Activité', '9 min', et.capitalize() + '.', 'Classent, cherchent'], ['Trace', '3 min', 'Complète la carte.', 'Copient']],
              corrige=['Mots du réseau : ' + ', '.join(mots)])
def fiche_voca(w):
    per = w['P']; res, outil, mots = VOCA[per]; et = VOCA_ETAPES[min(w['k'], 7) - 1]
    return F_('Vocabulaire', 'Tous', f"{res.capitalize()} : {et}", [{'t': 'calc', 'cols': 3, 'x': mots}, {'t': 'consigne', 'n': 1, 'x': 'Je classe ces mots (j\'écris mon critère)'}, {'t': 'cadre', 'h': 3200},
             {'t': 'consigne', 'n': 2, 'x': 'J\'écris une phrase avec deux mots du réseau'}, {'t': 'lignes', 'n': 2}])

def reecriture(h):
    return S_(h, 'Réécriture', 'réécriture différée de la production de lundi', 'Améliorer son texte à partir des 4 points annotés et de critères de forme.', comp='Réviser et améliorer son écrit (programmes 2025)',
              crit=['les 4 points annotés sont traités', 'le texte est plus précis'], mat='Cahier de l\'écrivain annoté ; grille de réécriture', ref='Kervyn (réécriture différée)', fiche='Tous',
              phases=[['Lecture des annotations', '5 min', 'Rappelle les codes.', 'Lisent'], ['Réécriture', '30 min', 'Conférences d\'écriture avec 4 élèves.', 'Réécrivent'], ['Partage', '10 min', 'Deux élèves lisent avant / après.', 'Écoutent, commentent']])
def fiche_reecr():
    return F_('Réécriture', 'Tous', 'Ma grille de réécriture', [{'t': 'table', 'head': ['Point annoté', 'Ce que je change', 'Fait'], 'rows': [['1', '', '☐'], ['2', '', '☐'], ['3', '', '☐'], ['4', '', '☐']], 'h': 900},
            {'t': 'liste', 'x': ['Ma phrase inductrice est bien placée.', 'Le lecteur voit la scène (caméra, détails).', 'Une émotion est montrée sans être nommée.', 'Il n\'y a pas de dialogue.']}])

def dictee_bilan(h, w, ph):
    txt = ' '.join(p for p, v, a in ph)
    return S_(h, 'Dictée bilan', 'les verbes, la notion et le son de la semaine', 'Écrire un texte qui réunit les verbes du jour, la notion de grammaire et le son de la semaine ; relire avec ses outils.',
              comp='Orthographe : réinvestir en dictée (programmes 2025)', crit=['accords justes', 'verbes du jour justes', 'mots du son justes'], mat='Version courte CM1 ; texte à trous en version aménagée', fiche='Version aménagée',
              phases=[['Dictée', '20 min', f"Dicte : « {txt} » (CM1 : les trois premières phrases).", 'Écrivent'], ['Relecture', '10 min', 'Relecture guidée : verbes, accords, son.', 'Relisent'], ['Ramassage', '5 min', 'Correction lundi en dictée réflexive.', '—']],
              corrige=[txt])
def fiche_dictee(ph, mots):
    txt = ' '.join(p for p, v, a in ph)
    for m in mots:
        txt = txt.replace(m, '……', 1)
    return F_('Dictée bilan', 'Version aménagée', 'Dictée bilan : texte à compléter', [{'t': 'texte', 'x': txt}, {'t': 'p', 'x': 'Je relis : ☐ les verbes  ☐ les accords  ☐ le son de la semaine'}], n1=True)

def lecture_fluence(h, w, L):
    return S_(h, 'Lecture', 'fluence et lecture offerte', f"Lire avec fluidité un passage du pivot ({L['piv']}) ; écouter la lecture offerte des chapitres de la semaine.", comp='Lire à voix haute avec fluidité (repères : 110 mots/min CM1, 120 CM2)',
              crit=['le nombre de mots lus progresse', 'la lecture respecte la ponctuation'], mat='Passage du pivot ; graphique personnel', ref='Fluence en binômes : trois lectures d\'une minute', fiche='Tous',
              phases=[['Fluence', '10 min', 'Binômes : trois lectures d\'une minute ; report sur le graphique.', 'Lisent, comptent'], ['Lecture offerte', '10 min', f"Lit la suite de l'œuvre (chapitres {L['ch']}) ; audio pour les N1." if L.get('classe') else 'Lecture offerte d\'un texte du réseau.', 'Écoutent']])
def fiche_fluence():
    return F_('Lecture', 'Tous', 'Ma fluence', [{'t': 'table', 'head': ['Lecture', '1', '2', '3'], 'rows': [['Mots lus en 1 min', '', '', ''], ['Erreurs', '', '', '']], 'h': 700}, {'t': 'p', 'x': 'Je colorie mon meilleur score sur mon graphique de la période.'}])

# ------------------------------------------------------------ semaine
def jour_seances(w, j, ctx):
    J = j['jour']; per = w['P']; L = ctx['L']; ph = ctx['ph']; s = []; f = []
    v = ctx['ph'][{'Lundi': 0, 'Mardi': 1, 'Jeudi': 2, 'Vendredi': 3}[J]]
    s.append(verbe_du_jour('8h30-8h40', v[1], v[2], v[0], per))
    if J == 'Lundi':
        s.append(dictee_refl('8h40-8h55', ph[0][0], 'notion de grammaire ; participe passé', per)); s.append(calcul('8h55-9h10', J, w, ctx['cm']))
        s.append(ecrit('9h10-9h55', ctx['pe'][0], per, J)); f.append(fiche_ecrit(ctx['pe'][0], per))
        s.append(probleme('9h55-10h15', J, ctx['gdir'])); s.append(maths_seance('10h30-11h10', J, w, ctx['m'], w['S'])); f += fiches_maths(J, ctx['m'], w['S'])
        s.append(lecture_pivot('11h10-11h45', w, L, '1-3')); f += fiches_pivot(w, L, '1-3')
        s.append(anglais('11h45-12h00', w, J, '15 min'))
        s.append(sciences('13h30-14h15', w, J)); f.append(fiche_sciences(w, J))
        s.append(ortho('14h15-14h30', w, 1, *ctx['o'])); f.append(fiche_ortho(1, ctx['o'][0], ctx['intr'], ctx['o'][1], ctx['o'][3], ctx['o'][4]))
        s.append(conj_seance('14h30-14h45', w, 'construction', ctx['verbes'])); f.append(fiche_conj(w, 'construction', ctx['verbes']))
        s.append(eps('14h45-15h00', w, J)); s.append(hg('15h00-16h00', w, J)); f.append(fiche_hg(w, J))
    elif J == 'Mardi':
        s.append(dictee_refl('8h40-8h55', ph[1][0], 'participe passé avec être et avec avoir', per)); s.append(calcul('8h55-9h10', J, w, ctx['cm'])); f += fiches_calcul(J, ctx['cm'])
        s.append(grammaire('9h10-9h55', w, L)); f.append(fiche_gram(w))
        s.append(probleme('9h55-10h15', J, ctx['gdir'])); s.append(maths_seance('10h30-11h10', J, w, ctx['m'], w['S'])); f += fiches_maths(J, ctx['m'], w['S'])
        if ctx['lundi_off']:
            s.append(lecture_pivot('11h10-11h30', w, L, '1-3')); f += fiches_pivot(w, L, '1-3')
        else:
            s.append(lecture_mardi('11h10-11h30', w)); f.append(fiche_lecture_mardi(w))
        s.append(anglais('11h30-12h00', w, J, '30 min'))
        s.append(ortho('13h30-13h50', w, 2, *ctx['o'])); f.append(fiche_ortho(2, ctx['o'][0], ctx['intr'], ctx['o'][1], ctx['o'][3], ctx['o'][4]))
        s.append(eps('13h50-15h00', w, J, long_=True)); s.append(arts('15h00-15h45', w, J))
        s.append(conj_seance('15h45-16h00', w, 'entrainement', ctx['verbes'])); f.append(fiche_conj(w, 'entrainement', ctx['verbes']))
    elif J == 'Jeudi':
        s.append(dictee_refl('8h40-8h55', ph[2][0], f"son {ctx['o'][3]} : la trace à l'épreuve", per, son=True)); s.append(calcul('8h55-9h10', J, w, ctx['cm']))
        s.append(ecrit('9h10-9h55', ctx['pe'][1], per, J)); f.append(fiche_ecrit(ctx['pe'][1], per))
        s.append(probleme('9h55-10h15', J, ctx['gdir'])); g = geom(w['S']); s.append(geometrie('10h30-11h10', g)); f += fiche_geo(g)
        s.append(lecture_fluence('11h10-11h30', w, L)); f.append(fiche_fluence())
        s.append(anglais('11h30-12h00', w, J, '30 min')); f.append(fiche_anglais(w))
        s.append(sciences('13h30-14h45', w, J)); f.append(fiche_sciences(w, J))
        s.append(eps('14h45-15h00', w, J)); s.append(arts('15h00-15h30', w, J)); s.append(emc('15h30-16h00', w)); f.append(fiche_emc(w))
    else:
        s.append(vocabulaire('8h40-8h55', w)); f.append(fiche_voca(w)); s.append(calcul('8h55-9h10', J, w, ctx['cm'])); f += fiches_calcul(J, ctx['cm'])
        s.append(reecriture('9h10-9h55')); f.append(fiche_reecr())
        s.append(probleme('9h55-10h15', J, ctx['gdir'])); s.append(maths_seance('10h30-11h10', J, w, ctx['m'], w['S'])); f += fiches_maths(J, ctx['m'], w['S'])
        s.append(dictee_bilan('11h10-11h45', w, ph)); f.append(fiche_dictee(ph, ctx['o'][0]))
        s.append(anglais('11h45-12h00', w, J, '15 min'))
        s.append(ortho('13h30-13h45', w, 4, *ctx['o'])); f.append(fiche_ortho(4, ctx['o'][0], ctx['intr'], ctx['o'][1], ctx['o'][3], ctx['o'][4]))
        s.append(S_('13h45-14h15', 'Lecture à voix haute', 'lire ses textes', 'Lire à voix haute sa production réécrite, pour un public.', comp='Lire à voix haute ; écouter et réagir', crit=['lit de façon audible et expressive'], mat='Cahiers de l\'écrivain',
                    phases=[['Préparation', '10 min', 'Binômes : s\'entraîner.', 'S\'entraînent'], ['Lectures', '20 min', 'Quatre à six lecteurs ; retours bienveillants.', 'Lisent, écoutent']]))
        s.append(lecture_pivot('14h15-14h45', w, L, '4-6')); f += fiches_pivot(w, L, '4-6')
        s.append(eps('14h45-15h00', w, J)); s.append(hg('15h00-15h30', w, J)); f.append(fiche_hg(w, J))
        s.append(S_('15h30-16h00', 'EMC', 'conseil de classe', 'Réguler la vie de la classe : félicitations, propositions, problèmes.', comp='EMC : s\'engager, coopérer', crit=['respecte le tour de parole'], mat='Cahier du conseil', ref='Oury et Vasquez (conseil coopératif)',
                    phases=[['Félicitations', '5 min', '—', 'Félicitent'], ['Propositions et problèmes', '20 min', 'Préside avec le président élève.', 'Proposent, votent'], ['Décisions', '5 min', 'Secrétaire : compte rendu.', 'Notent']]))
    return s, f

def build():
    W = semaines(); index = []
    for w in W:
        S, per, k = w['S'], w['P'], w['k']
        L = LECT[S]; fiche = FICHE[S - 1]; part, nparts = PART[S - 1]
        mots, intr = mots_semaine(fiche, part, nparts); ss = SONS_TXT[f'S{S}']; son, graph = ss[3], ss[4]
        inv = INVAR[per][((k - 1) * 2) % len(INVAR[per]):((k - 1) * 2) % len(INVAR[per]) + 4]
        while len(inv) < 4: inv += INVAR[per][:4 - len(inv)]
        t = TABLES[(S - 1) % len(TABLES)]
        cm = {'tables': t, 'series': {}, 'proc': {}}
        for J in ('Mardi', 'Vendredi'):
            cm['series'][J] = json.loads(subprocess.run(['python3', os.path.join(ROOT, 'src', 'calcmental.py'), f'CJ{S}{J}', f'{t[0]},{t[1]}', f'{t[0]},{t[1]}'], capture_output=True, text=True).stdout)
        for J in ('Lundi', 'Mardi', 'Jeudi', 'Vendredi'):
            cm['proc'][J] = {n: json.loads(subprocess.run(['python3', os.path.join(ROOT, 'src', 'procedures.py'), f'CJ{S}{J}', str(per), n, '12'], capture_output=True, text=True).stdout) for n in ('CM1', 'CM2')}
        ctx = {'L': L, 'ph': D[S - 1], 'verbes': [(v, a) for p, v, a in D[S - 1]], 'pe': PHRASES[per][(k - 1) % len(PHRASES[per])], 'm': MATHS[S - 1], 'cm': cm,
               'gdir': os.path.join(ROOT, 'gen', 'annee', f's{S:02d}'), 'o': (mots, inv, f'fiche {fiche}', son, graph), 'intr': intr, 'lundi_off': bool(w['jours'][0]['off'])}
        ctx['verbes'] = [(v, a) for p, v, a in D[S - 1]]
        days = []
        for j in w['jours']:
            if j['off']: continue
            s, f = jour_seances(w, j, ctx)
            lead = f"{j['jour']} {j['date']} : verbe {ctx['verbes'][{'Lundi': 0, 'Mardi': 1, 'Jeudi': 2, 'Vendredi': 3}[j['jour']]][0]} ; son {son} ; {MATHS[S - 1][0].lower()} ; lecture : {COURT[per]}, pivot {L['piv']}."
            ext = [['Problème du jour', f"Fichier {j['num']}_{j['jour']}_{j['date'].replace(' ', '_')}_probleme_du_jour.docx (générateur)", '★ ★★ ★★★']]
            if L.get('dos') and (j['jour'] == 'Vendredi' or (j['jour'] == 'Lundi') or (j['jour'] == 'Mardi' and ctx['lundi_off'])): ext.append(['Lecture', f"Dossier de compréhension : {L['dos']}", 'N1, N2, N3'])
            days.append({'jour': j['jour'], 'date': j['date'], 'annee': j['d'].year, 'num': j['num'], 'lead': lead, 'seances': s, 'fiches': f, 'externes': ext})
        offs = [f"{j['jour']} {j['date']} ({j['off']})" for j in w['jours'] if j['off']]
        notion, st, nn = gram_step(per, k); g = geom(S)
        rows = [['Verbe du jour (8h30)'] + [x[0] for x in ctx['verbes']],
                ['Dictée réflexive · vocabulaire (8h40)', 'grammaire ; PP', 'PP être / avoir', f'son {son}', VOCA_ETAPES[min(k, 7) - 1]],
                ['Calcul mental (8h55)', 'calcul réfléchi', f'tables de {t[0]} et {t[1]}', 'entraînement, flash', 'bilan'],
                ['Écrit · langue (9h10)', f"« {ctx['pe'][0]} »", f'grammaire : {notion} ({st}/{nn})', f"« {ctx['pe'][1]} »", 'réécriture'],
                ['Problème du jour (9h55)', 'jour 1, problème 1', 'jour 1, problème 2', 'jour 2', 'évaluation'],
                ['Mathématiques (10h30)', MATHS[S - 1][0] + ' : recherche', 'institutionnalisation', 'Géométrie : ' + g[2], 'entraînement, bilan'],
                ['Lecture (11h10)', f"{COURT[per]} pivot {L['piv']} (1-3)" if not ctx['lundi_off'] else '—', f"pivot (1-3)" if ctx['lundi_off'] else f"{SUPPORT[per].split(' (')[0]}", 'fluence, lecture offerte', f"dictée bilan ; pivot (4-6) à 14h15"],
                ['Anglais', '15 min', '30 min', '30 min', '15 min'],
                ['Orthographe', f'son {son} 1/4', '2/4', '3/4 (dictée)', '4/4 dix mots'],
                ['Conjugaison', conj_topic(per, k) + ' (construction)', 'entraînement', '—', '—'],
                ['Sciences', SCIENCES[S - 1][1], '—', 'expérimentation', '—'],
                ['Histoire-géographie · EMC', HG[S - 1][2], '—', 'EMC : ' + EMC[S - 1], 'trace · conseil'],
                ['EPS · arts', EPS[per][0], EPS[per][1] + ' · AP', 'parcours · musique', 'parcours · lecture à voix haute']]
        jours_pres = [j['jour'] for j in w['jours']]
        for r in rows:
            for i, j in enumerate(w['jours']):
                if j['off']: r[i + 1] = f"pas de classe ({j['off']})"
        lead = (f"Période {per}, semaine {k} (S{S}). Lecture suivie : {OEUVRE[per]}, chapitres {L['ch']}, pivot {L['piv']} ({'lecture en classe' if L.get('classe') else 'lecture à la maison'}). Son : {son} ({ss[2]}). "
                f"Mathématiques : {MATHS[S - 1][0].lower()}. Grammaire : {notion}. Conjugaison : {conj_topic(per, k)}." + (f" Pas de classe : {', '.join(offs)}." if offs else ''))
        obj = [['Français', f"Grammaire : {notion} ; conjugaison : {conj_topic(per, k)} ; orthographe : graphies de {son} ({graph}) et dix mots ; écriture : {PE_TYPE[per][1]}."],
               ['Lecture', f"{OEUVRE[per]} : comprendre le pivot ({L['piv']}) ; focus : {FOCUS[per]}."],
               ['Mathématiques', f"{MATHS[S - 1][0]}{' ; CM2 : ' + MATHS[S - 1][1] if MATHS[S - 1][1] else ''} ; géométrie : {g[2]} ; calcul mental : tables de {t[0]} et {t[1]}, {PROC[per][0]}."],
               ['Autres', f"Sciences : {SCIENCES[S - 1][3]} {('Histoire' if HG[S - 1][0] == 'H' else 'Géographie')} : {HG[S - 1][2]}. EMC : {EMC[S - 1]}."]]
        dossier = f"Periode_{per}/Semaine_{k:02d}_{w['dates'].rsplit(' ', 1)[0].replace(' ', '_')}"
        wk = {'periode': per, 'semaine': k, 'S': S, 'dates': w['dates'], 'dossier': dossier, 'gdir': ctx['gdir'], 'planning': {'lead': lead, 'rows': rows, 'objectifs': obj, 'jours': [f"{j['jour']} {j['date']}" for j in w['jours']]}, 'days': days}
        json.dump(wk, open(os.path.join(OUTJ, f's{S:02d}.json'), 'w'), ensure_ascii=False)
        index.append((S, per, k, w['dates'], len(days)))
        print('ok', S, per, k, w['dates'], len(days), flush=True)
    return index
if __name__ == '__main__':
    build()
