# Référentiel des progressions CM1-CM2 2026-2027 : génère un HTML imprimable (A4) puis un PDF.
import html, subprocess, json, os
E = html.escape
OUT = os.path.dirname(os.path.abspath(__file__))

def t(head, rows, widths=None, cls=''):
    cg = ''.join(f'<col style="width:{w}%">' for w in widths) if widths else ''
    h = ''.join(f'<th>{c}</th>' for c in head)
    b = ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in rows)
    return f'<table class="{cls}"><colgroup>{cg}</colgroup><thead><tr>{h}</tr></thead><tbody>{b}</tbody></table>'

def kv(rows):
    return '<table class="kv">' + ''.join(f'<tr><th>{a}</th><td>{b}</td></tr>' for a, b in rows) + '</table>'

def sec(id_, num, titre, coul, corps, saut=True):
    return f'<section id="{id_}" class="{"saut" if saut else ""}" style="--c:{coul}"><h1><span class="num">{num}</span>{titre}</h1>{corps}</section>'

def h2(x): return f'<h2>{x}</h2>'
def p(x): return f'<p>{x}</p>'
def note(x): return f'<p class="note">{x}</p>'
def ul(xs): return '<ul>' + ''.join(f'<li>{x}</li>' for x in xs) + '</ul>'

FR, MA, LV, SC, HG, EMC, EPS, ART, GEN = '#B4532A', '#2E6B8A', '#3C7D4F', '#4F7A28', '#7A4E8C', '#8C4E6B', '#B08A1E', '#6B6B6B', '#1F3A5F'

# ---------------------------------------------------------------- 0. cadre général
EDT = [
    ('8h30', 'Verbe du jour', 'Verbe du jour', 'Verbe du jour', 'Verbe du jour'),
    ('8h40', 'Dictée réflexive (grammaire)', 'Dictée réflexive (grammaire)', 'Dictée réflexive (son de la semaine, orthographe jour 3)', 'Vocabulaire'),
    ('8h55', 'Calcul mental : calcul réfléchi', 'Calcul mental : série des tables + procédures', 'Calcul mental : entraînement, flash fractions', 'Calcul mental : bilan'),
    ('9h10', 'Production d\'écrits', 'Grammaire', 'Production d\'écrits', 'Réécriture'),
    ('9h55', 'Problème du jour', 'Problème du jour', 'Problème du jour', 'Problème du jour (évaluation)'),
    ('10h15', '<i>Récréation</i>', '<i>Récréation</i>', '<i>Récréation</i>', '<i>Récréation</i>'),
    ('10h30', 'Mathématiques : découverte', 'Mathématiques : institutionnalisation', 'Géométrie', 'Mathématiques : entraînement, bilan'),
    ('11h10', 'Lecture : œuvre longue, pivot temps 1 à 3 (→ 11h45)', 'Lecture : autre support (→ 11h30)', 'Fluence + lecture offerte (→ 11h30)', 'Dictée bilan (→ 11h45)'),
    ('11h30 / 11h45', 'Anglais 15 min (11h45)', 'Anglais 30 min (11h30)', 'Anglais 30 min (11h30)', 'Anglais 15 min (11h45)'),
    ('13h30', 'Sciences (45 min)', 'Orthographe jour 2 (20 min)', 'Sciences (1 h 15)', 'Orthographe jour 4 (15 min)'),
    ('', '14h15 Orthographe jour 1 · 14h30 Conjugaison (construction)', '13h50 EPS, salle polyvalente (1 h 10)', '', '13h45 Lecture à voix haute · 14h15 Pivot temps 4 à 6'),
    ('14h45', 'Parcours athlétique (15 min)', '(dans la séance d\'EPS)', 'Parcours athlétique (15 min)', 'Parcours athlétique (15 min)'),
    ('15h00', 'Histoire ou géographie (1 h) : étude de documents', 'Arts plastiques (45 min) · 15h45 Conjugaison (entraînement)', 'Éducation musicale (30 min) · 15h30 EMC : débat réglé', 'Histoire ou géographie (30 min) : trace, frise ou carte · 15h30 Conseil de classe'),
]
VOL = [('Français', '8 h 50', '8 h', '+ 50 min'), ('Mathématiques', '5 h', '5 h', '—'), ('Langues vivantes', '1 h 30', '1 h 30', '—'),
       ('Sciences et technologie', '2 h', '2 h', '—'), ('Histoire-géographie et EMC', '2 h 30', '2 h 30', '—'),
       ('EPS', '1 h 55 (hors piscine)', '3 h', '− 1 h 05'), ('Enseignements artistiques', '1 h 15', '2 h', '− 45 min')]
cadre = (
    p('Ce référentiel rassemble les progressions de la classe de CM1-CM2 pour 2026-2027, telles qu\'elles ont été arrêtées discipline par discipline le 12 novembre 2026, et tout ce qu\'il faut pour les lire : créneaux, démarche, outils, appuis didactiques. Il sert de base au cahier journal, produit semaine par semaine.')
    + h2('Principes communs')
    + ul(['<b>Socio-constructivisme.</b> Chaque notion part d\'une situation qui pose vraiment problème (Brousseau) ; les procédures sont confrontées entre pairs (conflit sociocognitif, Doise et Mugny), puis institutionnalisées.',
          '<b>Double niveau.</b> Une même situation de départ, des variables différenciées (taille des nombres, complexité des textes, autonomie) et des extensions CM2. Les CM2 tutorent sur les notions revues.',
          '<b>Trois niveaux de lecteurs</b> en compréhension (N1 fragiles, N2, N3 experts) ; une <b>version aménagée</b> (Verdana 14, amorces, banque de mots) pour les élèves qui en ont besoin.',
          '<b>Sources originales</b> en histoire-géographie et en arts : documents d\'époque intégrés aux fiches, ou lien fourni (photographies de personnes réelles en lien seulement).'])
    + h2('Emploi du temps de la semaine ordinaire')
    + p('Classe le lundi, le mardi, le jeudi et le vendredi, 8h30-12h et 13h30-16h ; 23 h d\'enseignement.')
    + t(['Heure', 'Lundi', 'Mardi', 'Jeudi', 'Vendredi'], EDT, [10, 22.5, 22.5, 22.5, 22.5], 'edt')
    + note('Semaines de piscine (9 vendredis, du 19 mars au 4 juin) : l\'après-midi du vendredi est banalisé. Le pivot de lecture (temps 4 à 6) passe le mardi à 11h10 ; la lecture à voix haute se fait dans les répétitions ; l\'orthographe jour 4 et le conseil passent le jeudi à 15h30, en alternance avec le débat ; l\'histoire-géographie se fait le lundi seulement.')
    + h2('Volumes horaires')
    + t(['Domaine', 'Par semaine', 'Repère cycle 3', 'Écart'], VOL, [40, 22, 20, 18])
    + p('Le français dépasse son volume et l\'EPS et les arts sont en dessous, par choix pédagogique (orthographe, conjugaison et verbe du jour quotidiens). Les semaines de piscine et les répétitions du spectacle remontent l\'EPS et les arts sur l\'année ; l\'écart reste à justifier dans le projet de classe.')
    + h2('Découpage de l\'année')
    + t(['Période', 'Semaines', 'Repères'], [
        ['P1', 'S1 à S7', 'Rentrée, réactivation ; P1 faite au moment de ce référentiel'],
        ['P2', 'S8 à S14 (2 nov.-18 déc.)', 'Semaine modèle du cahier journal : P2 S3 (16-20 novembre) ; droits de l\'enfant le 20 novembre ; laïcité le 9 décembre'],
        ['P3', 'S15 à S20 (4 janv.-12 févr.)', 'Dès février : élire, la Ve République (préparation de l\'élection présidentielle)'],
        ['P4', 'S21 à S26 (1er mars-9 avr.)', 'Piscine à partir du 19 mars ; élection présidentielle le 18 avril et le 2 mai 2027'],
        ['P5', 'S27 à S36 (26 avr.-2 juil.)', 'Piscine jusqu\'au 4 juin ; rugby toucher ensuite ; spectacle tiré de Lucy Lost autour du 22 juin']], [12, 16, 72])
    + note('Calendrier de la zone A : P3 et P4 durent 6 semaines, P5 en dure 10. La numérotation S1 à S36 (sons, générateur de problèmes) suit les semaines réelles. Les tableaux de mathématiques et de géométrie, écrits sur 7 + 7 + 8 semaines, se lisent comme une suite continue : la semaine « P3 S7 » se fait en P4 S1, « P4 S1 à S5 » en P4 S2 à S6, « P4 S6 et S7 » en P5 S1 et S2, « P5 S1 à S8 » en P5 S3 à S10.')
    + h2('Ce que contient chaque semaine du cahier journal')
    + ul(['Un planning synthétique (une ligne par domaine, une colonne par jour) et les notions visées en fin de semaine.',
          'Pour chaque jour : les séances détaillées (compétence, objectif, critères de réussite, matériel, appui didactique, phases enseignant / élèves, différenciation, trace écrite, corrigé) et les fiches élèves prêtes à imprimer, une par page.',
          'Les fichiers du générateur de problèmes (problème du jour, trois niveaux ★ ★★ ★★★).'])
)

# ---------------------------------------------------------------- 1. français
lecture = (
    h2('1.1 Lecture et compréhension')
    + p('<b>Appuis</b> : enseignement explicite de la compréhension (Cnesco ; Goigoux et Cèbe, <i>Lector et Lectrix</i>) ; œuvre longue étudiée par passages choisis, pas chapitre par chapitre (Tauveron, Dufays) ; variété des textes et lecture dans les disciplines ; lecture à voix haute régulière.')
    + t(['Créneau', 'Contenu'], [
        ['Lundi 11h10-11h45', 'Œuvre longue : rappel, puis chapitre pivot, temps 1 à 3 (lecture différenciée, QCM avec citations, débat)'],
        ['Mardi 11h10-11h30', 'Lecture d\'un autre support, qui change à chaque période, avec une stratégie explicite par séance'],
        ['Jeudi 11h10-11h30', 'Fluence sur un passage du pivot ; les semaines « en classe », 10 min de fluence et 10 min de lecture offerte'],
        ['Vendredi 13h45-14h15', 'Lecture à voix haute des textes produits'],
        ['Vendredi 14h15-14h45', 'Pivot, temps 4 à 6 (rituels, activités, écrit d\'appropriation) ; commande de natures (chasse au mot)']], [28, 72])
    + h2('La séance sur un chapitre pivot (six temps)')
    + t(['Temps', 'Contenu'], [
        ['1. Rappel', 'Un ou deux élèves racontent l\'épisode précédent ; la classe complète.'],
        ['2. Lecture différenciée', 'N1 : lecture magistrale ou audio, texte sous les yeux ; N2 : silencieuse puis relecture d\'un passage clé ; N3 : autonome.'],
        ['3. QCM et débat', 'Sens général, pensées et intentions des personnages ; chaque réponse justifiée par une citation et une page ; une question où deux réponses se défendent ouvre le débat.'],
        ['4. Rituels', 'Chaînes anaphoriques (personnages et objets) ; tableau « Où ? Quand ? Dans quel monde ? » complété au fil de l\'œuvre.'],
        ['5. Activités de lecture', 'Choisies selon ce qui résiste dans le chapitre (implicite, point de vue, chronologie…), pas un questionnaire.'],
        ['6. Mise en commun et écrit', 'Synthèse de la stratégie (« comment on a compris »), puis écrit d\'appropriation étayé par niveau.']], [24, 76])
    + p('<b>Lecture en classe et à la maison, en alternance.</b> Une semaine sur deux, les chapitres hors pivot sont lus en classe (lecture offerte, audio pour les N1) ; l\'autre semaine, à la maison. Trois garde-fous : le pivot est toujours lu en classe ; une lecture à la maison n\'est jamais un prérequis non vérifié (rappel collectif) ; les élèves fragiles ont l\'audio et un résumé illustré.')
    + t(['Période', 'Œuvre longue', 'Support du mardi', 'Entrée littéraire', 'Focus de compréhension'], [
        ['P1', '<i>Charlie et la chocolaterie</i> (Dahl)', 'Albums (texte et image, implicite)', 'Héros et héroïnes', 'Représentation mentale ; reformuler'],
        ['P2', '<i>Le Mystère de Lucy Lost</i> (Morpurgo), étude par passages pour tenir dans la période', 'Textes documentaires (électricité, République)', 'Le merveilleux et l\'étrange', 'États mentaux des personnages'],
        ['P3', '<i>Cheval de guerre</i> (Morpurgo), 21 chapitres en 6 semaines, un pivot par semaine (chapitres 1, 4, 8, 12, 15, 19)', 'Nouvelles et récits courts en réseau (la guerre, l\'animal compagnon)', 'Imaginer et vivre d\'autres vies', 'Inférences, implicite'],
        ['P4', '<i>Matilda</i> (Dahl), 21 chapitres en 6 semaines, un pivot par semaine (chapitres 1, 3, 8, 11, 14, 17)', 'Bande dessinée', 'Comprendre et interroger la morale', 'Chronologie, retours en arrière'],
        ['P5', '<i>L\'Enfant Océan</i> (Mourlevat), récits de témoins, un pivot par semaine (S1 à S9), bilan en S10', 'Poésie et théâtre', 'Se découvrir dans le rapport aux autres', 'Narrateur et point de vue']], [8, 28, 24, 20, 20])
    + p('<b>Fluence</b> : repères de fin d\'année, 110 mots par minute en CM1, 120 en CM2 ; binômes, trois lectures d\'une minute, graphique personnel par période.')
    + p('<b>Chasse au mot</b> (lien lecture et grammaire) : chaque jour, 2 min au début du créneau de lecture, trouver dans le roman un mot selon des critères (ex. : un nom masculin singulier). Le vendredi, commande de 5 natures différentes en 5 min sur le chapitre pivot. Consignes CM1 et CM2 alignées sur la progression des natures. Support : un carnet de chasse d\'une page par semaine (consigne, mot trouvé, page, et une case où l\'élève écrit ses critères de choix).')
)
PHRASES = [
    ['P1', 'Phrases d\'action simples', 'Intégrer la phrase de façon cohérente ; construire une chaîne de « pourquoi ? »', '« La porte claqua. »'],
    ['P2', 'Phrases à mot polysémique', 'Choisir et assumer une interprétation, propre ou figurée', '« Il perdit pied. » · « Tout s\'éteignit. »'],
    ['P3', 'Phrases qui imposent de l\'implicite', 'Faire exister le hors-champ, laisser le lecteur déduire', '« Personne ne se retourna. »'],
    ['P4', 'Phrases qui jouent sur le temps', 'Faire exister le passé et le futur du personnage (retour en arrière, anticipation)', '« Il avait promis de ne jamais revenir. »'],
    ['P5', 'Phrases qui imposent un point de vue', 'Choisir qui regarde et d\'où, comme on place une caméra', '« De là-haut, tout paraissait minuscule. »']]
ecrit = (
    h2('1.2 Production d\'écrits')
    + kv([('Créneaux', 'Lundi et jeudi 9h10-9h55 (production) ; vendredi 9h10-9h55 (réécriture différée)'),
          ('Démarche', 'Phrase inductrice insérée librement dans le récit ; carte mentale ; pitch ; storyboard ; écriture 20 min ; annotation par codes, 4 points au plus (Kervyn) ; film mental (Cèbe et Goigoux). Le cinéma est central : plans, hors-champ, mouvements de caméra. Les élèves décrivent : pas de récit construit sur des dialogues pour l\'instant.'),
          ('Critère transversal', 'Chaque phrase peut s\'interpréter avec au moins trois émotions (répertoire des émotions de la classe) ; sens propre et sens figuré explorés, y compris avec les élèves fragiles.'),
          ('Support élève', '« Carte d\'écrivain » de la classe ; seule la version aménagée (amorces, banque de mots) est imprimée en plus.'),
          ('Réécriture', 'Les 4 points annotés et des critères de forme, sans critère de langue imposé ; les points de langue sont travaillés en enseignement décroché.'),
          ('Évaluation', 'Continue, sur le cahier de l\'écrivain ; pas de production évaluée dédiée.')])
    + t(['Période', 'Type de phrase', 'Compétence', 'Exemple'], PHRASES, [8, 24, 44, 24])
    + p('<b>Écrits courts dans les disciplines</b> : écrire pour réfléchir (P1), trier des informations (P2), comparer deux documents en CM2 (P3), schématiser une leçon (P4), formuler les étapes d\'une expérience en CM2 (P5).')
)
GRAM = [
    ['P1', 'La phrase : verbe et groupe sujet ; types et formes', 'Verbe, nom, pronom personnel sujet', '+ nom commun et nom propre ; sujet inversé'],
    ['P2', 'Le groupe nominal ; chaînes d\'accord', 'Déterminants (articles, possessifs, démonstratifs), nom, adjectif', '+ préposition du complément du nom ; nature et fonction dans le GN'],
    ['P3', 'Le groupe verbal ; participe passé avec être', 'Pronoms personnels sujets ou compléments ; COD et COI simples', '+ attribut du sujet et verbes d\'état ; pronoms COD et antécédent'],
    ['P4', 'Compléments circonstanciels', 'Prépositions, adverbes, conjonctions de coordination', '+ nature des compléments circonstanciels ; temps, lieu, cause'],
    ['P5', 'Phrase simple et phrase complexe', 'Premières conjonctions de subordination', '+ coordination ou subordination ; synthèse des natures ; participe passé avec avoir']]
gram = (
    h2('1.3 Grammaire')
    + p('<b>Démarche.</b> Observation d\'un corpus et repérage des récurrences (ex. : certains groupes complètent le sujet, d\'autres le verbe), affinement par critères et manipulations (ces groupes suivent toujours un verbe d\'état), puis savoir institutionnel. Une notion se construit sur <b>4 mardis</b> : observation, affinement, institutionnalisation, entraînement et réinvestissement. Le corpus vient <b>uniquement du roman</b>, dans des chapitres déjà lus. Vocabulaire des programmes 2025 : pas de « prédicat ».')
    + t(['Période', 'Syntaxe', 'Natures CM1', 'Natures CM2'], GRAM, [8, 30, 31, 31])
    + note('Le programme 2025 fixe les contenus par année, sans répartition par période ni nombre de notions ; cette progression couvre tous les contenus CM1 et CM2.')
)
def tab_conj(titre, head, rows, w=None):
    return f'<div class="conj"><div class="conj-t">{titre}</div>' + t(head, rows, w, 'mini') + '</div>'
conj = (
    h2('1.4 Conjugaison')
    + t(['Période', 'Contenu'], [
        ['P1', 'Réactivation de l\'imparfait (radical fixe, terminaisons invariantes) et du futur (infinitif + terminaisons)'],
        ['P2', 'Le présent'], ['P3', 'Les temps composés'], ['P4', 'Le passé simple'], ['P5', 'Les cas particuliers de chaque temps'],
        ['En plus', 'CM2 : plus-que-parfait, accord du participe passé avec le COD (dès le début de l\'année). CM1 : le passé simple est repéré en lecture, sans être conjugué.']], [12, 88])
    + kv([('Verbe du jour', 'Chaque jour à 8h30, 10 min : un verbe conjugué à toutes les personnes du présent, de l\'imparfait, du futur, du passé composé et du passé simple, même pour les temps non étudiés. Support de la classe. Le verbe vient de la phrase de dictée réflexive et prépare la dictée bilan du vendredi ; la correction reste en classe et enrichit le corpus.'),
          ('Récapitulatif', 'En fin de période, une feuille des verbes de la période, conjugués et corrigés, à coller dans le cahier.'),
          ('Accord du participe passé', 'En dictée réflexive, pour tous dès le début de l\'année : repérer l\'auxiliaire. <b>Avoir bloque l\'accord avec le sujet, être le laisse passer.</b> Verbes en -er en priorité. Accord avec le COD : CM2 seulement.'),
          ('Construction des règles', 'Plus grande récurrence (Gourdet) : corpus tiré d\'abord du texte, puis enrichi par les verbes du jour ; on classe, on nomme les colonnes, on met de côté ce qui n\'entre nulle part.'),
          ('Créneaux dédiés', 'Lundi 14h30-14h45 (construction) ; mardi 15h45-16h00 (entraînement).')])
    + p('<b>Les tableaux de conjugaison de la classe</b> (la règle visée à la fin de chaque construction) :')
    + '<div class="conj-grid">'
    + tab_conj('Présent', ['', '-er (sauf aller)', '-endre, -ondre', 'tous les autres', '⚠'], [
        ['je', '-e', '-ds', '-s', 'je vais, je veux, je peux, j\'ai'], ['tu', '-es', '-ds', '-s', 'tu veux, tu peux'],
        ['il, elle, on', '-e', '-d', '-t', 'il a, il va'], ['nous', '-ons', '-ons', '-ons', 'nous sommes'],
        ['vous', '-ez', '-ez', '-ez', 'vous faites, vous dites, vous êtes'], ['ils, elles', '-ent', '-ent', '-ent ou -ont', '']], [14, 16, 16, 18, 36])
    + tab_conj('Imparfait (radical fixe)', ['', 'terminaison'], [['je', '-ais'], ['tu', '-ais'], ['il, elle, on', '-ait'], ['nous', '-ions'], ['vous', '-iez'], ['ils, elles', '-aient']])
    + tab_conj('Futur (infinitif, sans le e final, + terminaison)', ['', 'terminaison'], [['je', '-ai'], ['tu', '-as'], ['il, elle, on', '-a'], ['nous', '-ons'], ['vous', '-ez'], ['ils, elles', '-ont']])
    + tab_conj('Passé simple', ['', '-er', '(i)', '(u)', '(in) venir, tenir'], [
        ['je', '-ai', '-is', '-us', '-ins'], ['tu', '-as', '-is', '-us', '-ins'], ['il, elle, on', '-a', '-it', '-ut', '-int'],
        ['nous', '-âmes', '-îmes', '-ûmes', '-înmes'], ['vous', '-âtes', '-îtes', '-ûtes', '-întes'], ['ils, elles', '-èrent', '-irent', '-urent', '-inrent']])
    + tab_conj('Passé composé', ['Auxiliaire', 'Participe passé'], [
        ['<b>avoir</b> : bloque l\'accord avec le sujet', 'en -é, -u, -i, -is(e), -it(e), -nt(e), -rt(e)'],
        ['<b>être</b> : laisse passer l\'accord avec le sujet', 'ex. : elles sont venues ; ils ont trouvé']], [50, 50])
    + '</div>'
    + note('Points de vigilance : ouvrir, offrir, couvrir, souffrir et cueillir se conjuguent au singulier du présent comme les verbes en -er (j\'ouvre) : à ajouter à la colonne ⚠ quand ils apparaissent. Les futurs à radical irrégulier (viendr-, ser-, aur-, ir-, fer-, verr-, pourr-) relèvent des cas particuliers de la période 5.')
)
SONS = [l.split('\t') for l in subprocess.run(['node', '/home/claude/cj/src/progression_sons.js'], capture_output=True, text=True).stdout.strip().split('\n')]
SONS = [[a, b, c.replace('fiche ', ''), d, e] for a, b, c, d, e in SONS]
ortho = (
    h2('1.5 Orthographe lexicale')
    + p('<b>Ce que fixe le programme 2025.</b> CM1 : « Écrire correctement les mots les plus fréquents de la langue en s\'appuyant sur les régularités et la formation » et « S\'appuyer sur la dimension morphologique des mots rencontrés lors de ses différentes lectures pour les orthographier ». CM2 : « Écrire correctement les mots fréquents en s\'appuyant sur les régularités et la formation ». Le programme ajoute que « les listes de fréquence sont des outils indispensables pour définir des objectifs atteignables par les élèves » et que les pluriels irréguliers (-x, -al/-aux) sont stabilisés au cours du cycle.')
    + t(['Exemples de réussite (Éduscol)', 'CM1', 'CM2'], [
        ['Mots fréquents', 'Automatise l\'orthographe des mots les plus fréquents étudiés au cycle 2 et dans l\'année, en s\'appuyant sur ses connaissances et sa mémoire', 'Automatise l\'orthographe des mots fréquents étudiés à l\'école'],
        ['Morphologie', 'S\'appuie sur la famille du mot : hasardeux, hasarder, hasard ; laideur, laid ; progresser, progrès', 'Systématise l\'appui sur la morphologie : connaître insecticide aide à écrire régicide'],
        ['Analogie', 'S\'appuie sur les ressemblances entre mots : agriculteur, agricultrice', '—'],
        ['Mots irréguliers', 'Sait écrire les mots irréguliers les plus fréquents', 'Sait écrire les mots irréguliers fréquents']], [20, 40, 40])
    + p('<b>Ce que recommande Éduscol</b> (fiche d\'intervention « Écrire des mots », évaluations de début de CM1, 2025) : mémoriser environ <b>dix mots par semaine</b> en CM1, nombre différencié selon les élèves ; les mémoriser <b>en classe</b> et les dicter <b>chaque jour</b>, de façon progressive ; enseigner explicitement les mots invariables et irréguliers ; travailler les lettres muettes finales par la famille du mot ; automatiser la valeur des lettres selon leur position (s/ss, c/ç, g/gu/ge) ; varier copies et dictées. Le programme prévoit aussi, chaque semaine, une remémoration des corpus étudiés.')
    + h2('Organisation de la semaine')
    + p('Trois fils tenus dans les mêmes créneaux : le <b>son de la semaine</b> (démarche inductive), les <b>dix mots de la semaine</b> (mémorisation) et le <b>point de morphologie de la période</b>.')
    + t(['Jour', 'Créneau', 'Contenu'], [
        ['Lundi', '14h15-14h30', '<b>Remémoration</b> (2 min) : dictée flash de 3 mots des semaines précédentes. <b>Repérage</b> (10 min) : dans une liste qui contient les différentes graphies du phonème et des intrus (mots qui ont les lettres sans faire le son), trier, colorier le graphème. <b>Les dix mots de la semaine</b> (3 min) : liste lue, deux mots en copie flash.'],
        ['Mardi', '13h30-13h50', '<b>Régularités</b> (10 min) : où se place chaque graphème ? pourquoi les intrus ? lien avec le point de morphologie. <b>Trace écrite</b> (5 min). <b>Mémorisation explicite</b> des dix mots (5 min), selon la procédure ci-dessous.'],
        ['Jeudi', '8h40-8h55 (dictée réflexive)', '<b>Mise à l\'épreuve</b> : dictée de mots nouveaux et de 3 mots de la semaine ; la trace les explique-t-elle ? Ajustement de la trace.'],
        ['Vendredi', '13h30-13h45', '<b>Entraînement</b> (8 min) : copie flash, transport copie, copie retournée, jeux de Kim, tri par familles. <b>Dictée des dix mots</b> (5 min). <b>Bilan</b> (2 min) : les mots ratés vont dans la liste personnelle, redictée en remémoration et en dictée réflexive.']], [12, 18, 70])
    + kv([('Les dix mots de la semaine', 'Pris dans la liste de fréquence lexicale d\'Éduscol (ou l\'échelle Dubois-Buyse) : 6 mots du son de la semaine, 2 mots invariables de la période, 2 mots des disciplines (sciences, histoire). CM2 : 2 mots de plus, plus longs ou plus rares. Élèves fragiles : les 6 mots du son. Les mots réapparaissent dans la dictée bilan.'),
          ('Procédure de mémorisation', '« J\'observe le mot. Je le lis. Je repère les lettres muettes, les doubles consonnes, les accents. Je l\'épelle. Je ferme les yeux et je le vois dans ma tête. Je vérifie. Je l\'écris syllabe par syllabe. » Mémoires visuelle, auditive et gestuelle sollicitées ensemble ; épellation sans modèle ; réécriture du mot tout au long de l\'année.'),
          ('Copies d\'entraînement', '<b>Copie flash</b> : le mot est lu, regardé, épelé dans la tête, effacé, écrit. <b>Transport copie</b> : modèle affiché loin, en binômes, on compte les déplacements. <b>Copie retournée</b> : modèle au dos de la feuille. Une courte mise en commun des stratégies (lettre à lettre, syllabe, appui sur la famille : le d de regard vient de regarder) suit chaque jeu.'),
          ('Outil de l\'élève', 'Un répertoire orthographique tenu toute l\'année : une page par son (la trace et les mots de la semaine), les mots invariables par catégorie, les familles de mots du point de morphologie, la liste personnelle des mots à revoir.'),
          ('Évaluation', 'Dictée des dix mots le vendredi ; mots de la période redictés en semaine 7 ; transfert observé dans la dictée bilan et dans les écrits.')])
    + h2('Progression annuelle : morphologie et mots invariables')
    + t(['Période', 'Point de morphologie (lien avec les sons et le vocabulaire)', 'Mots invariables CM1', 'En plus CM2'], [
        ['P1', 'Lettres muettes finales : les retrouver par la famille (regard, regarder ; gros, grosse ; galop, galoper ; tapis, tapisser) ; celles qui n\'ont pas de famille (souris, temps) s\'apprennent', 'hier, aujourd\'hui, demain, toujours, jamais, souvent, parfois, longtemps, maintenant, bientôt, déjà, encore', 'autrefois, désormais, aussitôt, tard'],
        ['P2', 'Les accents é, è, ê (sons [e] et [ɛ]) : l\'accent circonflexe et le s disparu (forêt, forestier ; fête, festin ; hôpital, hospitalier). Le féminin des noms de métier : -eur, -euse ; -teur, -trice (agriculteur, agricultrice) ; -er, -ère', 'ici, là, dehors, dedans, partout, loin, près, beaucoup, trop, assez, peu, autant', 'ailleurs, autour, davantage, environ'],
        ['P3', 'm devant m, b, p (sons [ɑ̃], [ɔ̃], [ɛ̃]) ; les préfixes qui doublent la consonne : im-, in-, il-, ir- (immobile, impossible, illisible, irrégulier), ap-, ac-, af- (apporter, accourir, affaiblir)', 'alors, ensuite, puis, aussi, pourtant, donc, mais, car, ainsi, enfin, d\'abord, quand', 'cependant, néanmoins, lorsque, puisque'],
        ['P4', 'Les suffixes (-age, -tion, -ette, -eur ; -ment des adverbes : lent, lente, lentement) ; les pluriels irréguliers : -al, -aux (cheval, chevaux ; sauf bal, carnaval, festival, régal…), -ou, -oux (bijou, caillou, chou, genou, hibou, joujou, pou), -ail, -aux (travail, vitrail, corail)', 'vite, bien, mal, très, presque, ensemble, comme, avec, sans, pendant, depuis, vers', 'volontiers, plutôt, malgré, parmi ; adverbes en -amment, -emment (prudemment, bruyamment)'],
        ['P5', 'Les mots des disciplines et les éléments savants : géo- (géographie, géométrie), bio-, hydro-, -phone, -cide (insecticide, régicide) ; bilan des mots fréquents de l\'année', 'chez, sous, entre, devant, derrière, avant, après, contre, dessus, dessous, combien, pourquoi', 'quelquefois, tandis que, selon, hormis']], [8, 42, 30, 20], 'mini')
    + h2('Progression des sons (fiches de la classe)')
    + p('<b>Appuis</b> : démarche inductive (Brissaud et Cogis : observer, classer, formuler, éprouver) ; Catach (graphèmes et valeurs de position). Les sons riches en graphies prennent 2 ou 3 semaines ; la valeur des lettres selon leur position (s/ss, c/ç, g/gu/ge) est travaillée avec les fiches 16, 17, 19 et 23.')
    + '<div class="cols2">' + t(['Sem.', 'Pér.', 'Fiche', 'Son', 'Graphies'], [r for r in SONS[:18]], [10, 9, 10, 26, 45], 'mini') + t(['Sem.', 'Pér.', 'Fiche', 'Son', 'Graphies'], [r for r in SONS[18:]], [10, 9, 10, 26, 45], 'mini') + '</div>'
    + note('Graphies des fiches 6 et 8 reconstituées d\'après la photo des fiches : à vérifier sur les fiches de la classe. Sources : programme de français du cycle 3 (BO du 17 avril 2025) ; Éduscol, exemples de réussite CM1 et CM2 ; Éduscol, fiche d\'intervention « Écrire des mots » (évaluations de début de CM1, 2025) ; liste de fréquence lexicale (eduscol.education.fr/186/liste-de-frequence-lexicale).')
)
dictee = (
    h2('1.6 Dictées et vocabulaire')
    + kv([('Dictée réflexive', 'Lundi à jeudi, 8h40-8h55 : une phrase dictée, comparaison en binômes, discussion collective des variantes. Lundi et mardi : notion de grammaire de la période et accord du participe passé ; jeudi : mots du son de la semaine (orthographe jour 3).'),
          ('Dictée bilan', 'Vendredi 11h10-11h45 : texte qui réunit les verbes du jour, la notion de grammaire et le son de la semaine ; version courte en CM1, texte à trous en version aménagée ; correction le lundi suivant en dictée réflexive.'),
          ('Vocabulaire', 'Vendredi 8h40-8h55. Un réseau lexical par période (Picoche, Sardier), tiré du roman et aligné sur la progression des phrases inductrices. Semaine 1 : collecte dans le roman ; semaines 2 à 5 : structuration (synonymes, antonymes, intensité, familles, dérivation) ; semaine 6 : réemploi en écriture ; semaine 7 : bilan. Cahier de lexique : une carte par réseau.')])
    + t(['Période', 'Réseau', 'Outil linguistique'], [
        ['P1', 'Les émotions (répertoire de la classe, <i>Charlie et la chocolaterie</i>)', 'Synonymes et nuances d\'intensité'],
        ['P2', 'Les mots de la mer et de l\'île (<i>Lucy Lost</i>)', 'Polysémie, sens propre et sens figuré'],
        ['P3', 'Voir, entendre, percevoir (<i>Cheval de guerre</i>)', 'Verbes de perception, précision du lexique'],
        ['P4', 'Les mots de <i>Matilda</i> : inventés, déformés, composés', 'Formation des mots : préfixes, suffixes, mots composés'],
        ['P5', 'Dire et raconter (<i>L\'Enfant Océan</i>, plusieurs narrateurs)', 'Verbes de parole, registres de langue']], [10, 50, 40])
)
francais = lecture + ecrit + gram + conj + ortho + dictee

# ---------------------------------------------------------------- 2. mathématiques
MATHS = [
    ['P2 S3', 'Fractions simples : comparer à l\'unité, encadrer', 'Fraction > 1 = entier + fraction', 'Proportionnalité simple (anticipation)'],
    ['P2 S4', 'Fractions décimales', 'Millièmes', 'Longueurs, parcours (anticipation)'],
    ['P2 S5', 'De la fraction décimale à l\'écriture à virgule', 'Jusqu\'aux millièmes', 'Monnaie, liste de courses'],
    ['P2 S6', 'Comparer, ranger, encadrer des décimaux', 'Intercaler', 'Durées (anticipation)'],
    ['P2 S7', 'Décimaux en contexte ; bilan', '', 'Synthèse de Noël'],
    ['P3 S1', 'Addition et soustraction de décimaux', '', 'Proportionnel ou non (anticipation)'],
    ['P3 S2', 'Proportionnalité : est-ce proportionnel ?', '', 'Découpe (anticipation)'],
    ['P3 S3', '× 10, 100, 1 000 et : 10, 100', '', 'Linéarité (anticipation)'],
    ['P3 S4', 'Proportionnalité : linéarité multiplicative et additive', 'Avec des décimaux', 'Achat à l\'unité (anticipation)'],
    ['P3 S5', 'Multiplier un décimal par un entier', 'Entier à 2 chiffres', 'Masses, remplissage (anticipation)'],
    ['P3 S6', 'Proportionnalité : passage à l\'unité', 'Prix unitaire décimal', 'Partage des frais (anticipation)'],
    ['P3 S7', 'Diviser un décimal par un entier ; bilan', 'CM1 : partage de sommes d\'argent', 'Fraction d\'une quantité (anticipation)'],
    ['P4 S1', 'Longueurs, périmètre, conversions', 'Unités mixtes', 'Aire et périmètre (anticipation)'],
    ['P4 S2', 'Masses et contenances', '', 'Pourcentages simples (anticipation CM2)'],
    ['P4 S3', 'Durées', 'Secondes', 'Fraction d\'une quantité'],
    ['P4 S4', 'Fraction d\'une quantité', 'Fractions > 1', 'Somme de fractions (anticipation)'],
    ['P4 S5', 'Ajouter et soustraire des fractions de même dénominateur', 'Dénominateurs multiples', 'Volume (anticipation)'],
    ['P4 S6', 'Aires : comparer, paver, cm²', 'm², aire du rectangle', 'Tableau (anticipation)'],
    ['P4 S7', 'CM2 pourcentages ; CM1 proportionnalité ; bilan', '', 'Synthèse : la cour'],
    ['P5 S1', 'Contenances et volumes', 'Volume du pavé', 'Graphique (anticipation)'],
    ['P5 S2', 'Tableaux et diagrammes', 'Double entrée', 'Probabilité (anticipation)'],
    ['P5 S3', 'Graphiques', 'Courbe, diagramme circulaire', 'Deux sortes (anticipation)'],
    ['P5 S4', 'Probabilités', '« 3 chances sur 10 »', 'Partages inégaux'],
    ['P5 S5', 'Problèmes de recherche : essais et ajustements', '', 'Deux sortes'],
    ['P5 S6', 'Programmes de calcul, suites', 'Produire un programme', 'Synthèse voyage'],
    ['P5 S7', 'Grand projet : le voyage', '', 'Synthèse voyage'],
    ['P5 S8', 'Bilan, liaison 6e', '', 'Bilan et rallye']]
GEOM = [['P1', 'S1', 'Évaluation diagnostique : comment les élèves regardent une figure', 'Restauration d\'une figure (carré, diagonales, triangle) avec amorce et règle non graduée', 'Décrire la figure en deux phrases', 'Perrin-Glorian, Mathé et Leclercq ; Duval'], ['P1', 'S2', 'Point, droite, segment, demi-droite', 'Prolonger des segments pour retrouver des intersections (vision ligne)', 'Notations [AB], (AB), [AB) ; ∈, ∉', 'Duval et Godin'], ['P1', 'S3', 'Alignement', 'Restauration : points comme intersections de droites prolongées', 'Justifier « A, B, C sont alignés »', 'Mathé, Perrin-Glorian et Barrier ; Petitfour'], ['P1', 'S4', 'Report de longueur sans règle graduée', 'Reproduire à l\'échelle 1 avec bande de papier puis compas', 'Comparer des périmètres au compas', 'Perrin-Glorian'], ['P1', 'S5', 'Milieu d\'un segment', 'Milieu sans règle graduée (pliage, bande, compas), puis avec', 'Milieu par intersection de deux cercles', 'Mathé et Barrier'], ['P1', 'S6', 'Espace : assemblages de cubes', 'Dénombrer les cubes, y compris cachés', 'Vues de face, de dessus, de côté', 'Berthelot et Salin'], ['P1', 'S7', 'Bilan de période', 'Restauration-bilan comparée à S1', 'Message de construction', 'Duval'],
        ['P2', 'S1', 'Angles : vocabulaire et comparaison', 'Comparer avec des gabarits ; aigu, droit, obtus', 'Angle somme ou multiple ; l\'angle droit mesure 90°', 'Éduscol'], ['P2', 'S2', 'L\'angle droit', 'Gabarit par double pliage ; l\'équerre comme gabarit', 'Moitié de l\'angle droit : 45°', 'Mathé, Perrin-Glorian et Barrier'], ['P2', 'S3', 'Droites perpendiculaires : reconnaître', 'Trier des paires de droites, dont des orientations non prototypiques ; vérifier à l\'équerre', 'Symbole ⊥', 'Duval : vision ligne'], ['P2', 'S4', 'Tracer une perpendiculaire passant par un point', 'Restauration : compléter une figure à angles droits', 'Point hors de la droite ; droite à prolonger', 'Petitfour'], ['P2', 'S5', 'Construire carré et rectangle sur papier uni', 'Construire à partir de dimensions, puis coder', 'Triangle rectangle à partir de deux côtés', 'Éduscol'], ['P2', 'S6', 'Espace : déplacements codés', 'Coder et décoder un déplacement sur quadrillage', '« Tourner de 90° » ; Scratch ou robot', 'Berthelot et Salin'], ['P2', 'S7', 'Bilan et méso-espace', 'Angle droit et perpendiculaires en grand dans la cour', 'Comparer feuille et cour', 'Bloch et Salin'],
        ['P3', 'S1', 'Droites sécantes et parallèles', 'Classer des paires, dont des sécantes hors de la feuille', 'Symbole //', 'Éduscol'], ['P3', 'S2', 'Tracer une parallèle', 'Restauration avec équerre et règle (deux perpendiculaires)', 'Justifier par la propriété', 'Duval'], ['P3', 'S3', 'Le cercle : points à même distance', 'Tous les points à 4 cm de A (jetons, puis corde dans la cour)', 'Corde, arc', 'Mathé et Maillot'], ['P3', 'S4', 'Cercle, disque, rayon, diamètre', 'Reproduire une figure de cercles (vision point)', 'Cercle de diamètre donné', 'Mathé et Maillot'], ['P3', 'S5', 'Problème de synthèse', 'Restauration : parallèles, perpendiculaires, cercles', 'Rédiger le programme de construction', 'Perrin-Glorian et Godin'], ['P3', 'S6', 'Solides : nommer et décrire', 'Jeu du portrait : faces, arêtes, sommets', 'Justifier la nature d\'un solide', 'Éduscol'], ['P3', 'S7', 'Solides : construire', 'Assembler les faces d\'un cube, d\'un pavé, d\'une pyramide', 'Solide et perspective', 'Éduscol'],
        ['P4', 'S1', 'Polygones et triangles', 'Classer des triangles (côtés, angles) aux instruments', 'Pentagone, hexagone', 'Houdement et Kuzniak'], ['P4', 'S2', 'Triangles particuliers', 'Construire rectangle, isocèle, équilatéral (compas)', 'Isocèle rectangle', 'Éduscol'], ['P4', 'S3', 'Quadrilatères : définitions', 'Carré, rectangle, losange : « c\'est un rectangle car… »', 'Trapèze', 'Duval ; Éduscol'], ['P4', 'S4', 'Définition ou propriété ?', 'Contre-exemples ; géométrie dynamique', '« Côtés opposés égaux » ne suffit pas', 'Coutat et Richard'], ['P4', 'S5', 'Construire sur papier uni', 'Quadrilatères à partir de dimensions, puis coder', 'Losange (côté et diagonale)', 'Éduscol'], ['P4', 'S6', 'Patrons du cube', 'Reconnaître, compléter, construire ; faces opposées', 'Patrons du pavé', 'Éduscol'], ['P4', 'S7', 'Bilan figures usuelles', 'Restauration-bilan', 'Programme de construction', 'Duval'],
        ['P5', 'S1', 'Axes de symétrie', 'Nombre d\'axes, vérifier par pliage', 'Figures plus complexes', 'Éduscol'], ['P5', 'S2', 'Compléter une figure symétrique', 'Sur quadrillage, axe vertical ou horizontal', 'Axe en diagonale', 'Éduscol'], ['P5', 'S3', 'Symétrique d\'un point, d\'un segment, d\'un triangle', 'Sur quadrillage, axe ne coupant pas la figure', 'Figure quelconque, axe en diagonale', 'Éduscol'], ['P5', 'S4', 'Suivre un programme de construction', 'Rectangle, cercle, perpendiculaires', 'Programmes plus longs, notations', 'Éduscol'], ['P5', 'S5', 'Communiquer une construction', 'Émetteur / récepteur', 'Programme formel avec notations', 'Mathé et Barrier'], ['P5', 'S6', 'Géométrie dynamique', 'Construire avec un logiciel ; la figure résiste-t-elle ?', 'Figure robuste', 'Coutat et Richard'], ['P5', 'S7', 'Bilan annuel', 'Restauration de la figure de P1 S1', 'Programme de la figure', 'Duval']]
maths = (
    kv([('Semaine type', 'Lundi, mardi, vendredi 10h30-11h10 : rappels (8 min), puis notion de la semaine (lundi découverte, mardi formulation et institutionnalisation, vendredi entraînement différencié et bilan). Jeudi : géométrie.'),
        ('Rappels', 'Tournants : calcul posé des quatre opérations, conversions, numération ; routine flash de géométrie le lundi et le vendredi.'),
        ('Découverte', 'La situation de recherche doit vraiment poser un problème : les procédures connues ne suffisent plus (Brousseau).'),
        ('Niveaux', 'Même notion pour les deux niveaux, variables différenciées, extensions CM2.'),
        ('Acquis de P1', 'Numération jusqu\'aux milliards (CM1 et CM2), sens et techniques des quatre opérations, sens des fractions.')])
    + h2('2.1 Progression de la notion de la semaine et du problème du jour')
    + t(['Semaine', 'Notion de la semaine', 'Extension CM2', 'Problème du jour'], MATHS, [10, 42, 22, 26], 'mini')
    + p('<b>Problème du jour</b> (9h55-10h15, quatre par semaine) : générateur de problèmes de la classe, en mode « notion libre », trois niveaux ★ (CM1 fragiles, questions guidées), ★★ (CM1), ★★★ (CM2, données parasites). Lundi : jour 1, problème 1 ; mardi : jour 1, problème 2 ; jeudi : jour 2 (mêmes histoires, inconnue « à l\'envers ») ; vendredi : évaluation dans un nouveau contexte. Le générateur <b>anticipe</b> : les problèmes simples de proportionnalité et de grandeurs arrivent avant la notion et servent de questionnement initial ; sinon il réinvestit une notion vue. Situations nommées selon Vergnaud et Houdement.')
    + h2('2.2 Calcul mental (8h55-9h10)')
    + p('Programme 2025 : faits numériques à mémoriser, connaissances de numération, procédures à automatiser ; entraînement détaché de toute pression évaluative.')
    + t(['Jour', 'Contenu'], [
        ['Lundi', 'Calcul réfléchi (10 min) sur la procédure de la période : recherche, comparaison et dénomination des procédures (Butlen et Pézard, Charnay) ; flash de faits (5 min)'],
        ['Mardi', 'Série de la compétence calcul mental : 15 calculs sur les tables (six formes : produit, facteur manquant, quotient, diviseur manquant, dividende manquant, égalité inversée ; CM1 entiers, CM2 dixièmes, diviseur toujours entier) + 5 calculs de procédure'],
        ['Jeudi', 'Entraînement de la procédure (furet, ardoise, jeu) ; flash fractions et décimaux'],
        ['Vendredi', 'Bilan sans pression : série courte de faits et de procédures ; score reporté sur le graphique personnel']], [14, 86])
    + t(['Faits à mémoriser', 'CM1', 'CM2'], [
        ['Tables', 'Addition et multiplication jusqu\'à 10', '+ produits par dizaines et centaines'],
        ['Faits usuels', 'Compléments à 10 et à 100 ; doubles et moitiés usuels ; 4 × 25, 2 × 50, 5 × 20', '+ moitié des impairs jusqu\'à 15 ; 8 × 125'],
        ['Fractions usuelles', '½ = 2/4 = 5/10 ; ¼ + ¼ = ½ ; ¾ ; 0,5 ; 0,25 ; 0,75 ; 0,1 ; 0,01', '+ 1/5 = 0,2 ; 0,001 ; ½ = 50/100']], [20, 40, 40])
    + t(['Période', 'Procédures CM1', 'Procédures CM2'], [
        ['P1', '± 8, 9, 18, 19… 39 ; × 10, 100, 1 000 (entiers)', '± jusqu\'à 98, 99'],
        ['P2', 'Relations entre fractions usuelles et écritures décimales ; × 10 et : 10 sur les décimaux', '× et : par 10, 100, 1 000 sur les décimaux'],
        ['P3', 'Décimal ± entier, dixièmes, centièmes sans retenue ; × 4, × 8, × 5', 'Somme de deux décimaux à un chiffre après la virgule ; entier + décimal avec retenue ; double et moitié d\'un décimal ; × 5 et × 50 sur les décimaux'],
        ['P4', 'Un chiffre × dizaines ou centaines ; distributivité simple', 'Dizaines × centaines ; : 4, : 8 ; distributivité'],
        ['P5', 'Consolidation mélangée', 'Consolidation mélangée']], [10, 45, 45])
    + p('<b>Fraction d\'une quantité</b> (P3 à P5), dans les deux sens : 2/3 de 60 = … ; 7/8 de … = 70. CM1 : fractions unitaires en P3 (1/4 de 40), puis fractions simples et premiers calculs inverses en P4-P5. CM2 : toutes fractions irréductibles (tiers à dixièmes), la moitié des calculs en sens inverse.')
    + p('<b>Pourcentages</b> (P4 et P5), toujours introduits par le rappel <b>10 % = 10/100 = 0,1</b> : CM1 10 % et 50 % (lien avec 1/10 et 1/2) ; CM2 10, 20, 25, 50, 75 % et le sens inverse (25 % de … = 100).')
    + note('Outils : compétence calcul mental (tables) et générateur de procédures et de faits usuels par période ; chaque calcul est vérifié en arithmétique exacte.')
    + h2('2.3 Géométrie (jeudi 10h30-11h10)')
    + p('<b>Démarche.</b> Faire passer le regard de la vision des surfaces à la vision des lignes et des points (Duval ; Perrin-Glorian), par la restauration de figures avec des instruments limités ; l\'instrument contredit la perception. Séance type : prédire, vérifier en dyade, formuler, institutionnaliser, réinvestir. Routine flash le lundi et le vendredi (dictée-flash, copie-flash, vrai / faux, espace-flash).')
    + t(['Pér.', 'Sem.', 'Séance (tronc commun)', 'Situation de référence', 'Ajout CM2', 'Appui'], GEOM, [6, 6, 22, 32, 20, 14], 'mini')
)

# ---------------------------------------------------------------- 3. anglais
anglais = (
    kv([('Cadre', 'Programme de langues vivantes du cours moyen : 90 min par semaine en séances courtes, priorité à l\'oral et à la phonologie, perspective actionnelle ; A1 en fin de CM1, A1 consolidé en fin de CM2.'),
        ('Démarche', 'Un album authentique par période et une tâche finale (<i>storybook approach</i>, Ellis et Brewster) : beaucoup de compréhension avant la production, structures répétées, récupération espacée, parole finalisée.'),
        ('Semaine type', 'Lundi 15 min : rituel et réactivation. Mardi 30 min : découverte par l\'album, compréhension orale, focus phonologique. Jeudi 30 min : pratique guidée en binômes, écrit court (CM1 copie sur modèle, CM2 connecteurs). Vendredi 15 min : mini-production, chant, étape de la tâche finale.'),
        ('Phonologie', 'Un fait par période : h aspiré, th, accent de mot, intonation des questions, pluriels.'),
        ('Documents', 'Une page « My English notebook » par semaine ; fiches et grille de la tâche finale ; livret de comptines et de chants.'),
        ('Évaluation', 'Critères définis avec les élèves, autoévaluation, observation continue, retours positifs.')])
    + t(['Période', 'Album', 'Thèmes', 'Langue CM1 / CM2', 'Tâche finale'], [
        ['P1', '—', 'Se présenter, l\'école', '<i>Be, have got</i>, nombres', 'Se présenter'],
        ['P2', '<i>Stick Man</i> (Donaldson), à partir de la semaine 4', 'Famille, Noël', 'Possessifs, <i>like / don\'t like</i> ; CM2 comparatifs', 'Interview d\'un camarade'],
        ['P3', '<i>The Gruffalo</i> (Donaldson)', 'Animaux, corps, description', '<i>Have got</i>, présent simple 3e personne, <i>can / can\'t</i> ; CM2 comparatifs, superlatifs', 'Inventer et présenter sa créature'],
        ['P4', '<i>We\'re Going on a Bear Hunt</i> (Rosen)', 'Environnement proche, ville et campagne, météo', 'Prépositions, impératif ; CM2 présent en -ing', 'Guider un camarade sur un parcours dans l\'école'],
        ['P5', '<i>The Snail and the Whale</i> (Donaldson)', 'Voyages, pays, rencontres interculturelles', '<i>There is / are, can</i> ; CM2 prétérit (<i>was, went</i>)', 'Carte postale ou vidéo pour une classe étrangère (eTwinning), sinon conte mis en scène pour une autre classe']], [8, 22, 20, 28, 22])
)

# ---------------------------------------------------------------- 4. sciences
sciences = (
    p('Le nouveau programme de sciences et technologie (BO n° 24 du 11 juin 2026) s\'applique au CM1 dès cette année ; les CM2 suivent encore l\'ancien programme de cycle 3 jusqu\'en juin 2027. La progression commune s\'appuie sur les contenus du nouveau programme de CM1, tous présents aussi dans l\'ancien programme ; les CM2 ont des extensions.')
    + kv([('Créneaux', 'Lundi 13h30-14h15 (45 min) ; jeudi 13h30-14h45 (1 h 15)'),
          ('Démarche', 'Investigation : situation de départ, conceptions initiales écrites, question, hypothèses, protocole, expérience, conclusion confrontée aux hypothèses (La main à la pâte). Nouveau programme : mesures quantitatives (lien avec les grandeurs), reproductibilité vérifiée en comparant les groupes, rôles tournants.'),
          ('Semaine type', 'Lundi : trace écrite de l\'expérience précédente (10 min), nouvelle question, conceptions, hypothèses, protocole (35 min). Jeudi : expérimentation et mesures en groupes, comparaison entre groupes, conclusion.'),
          ('Fil rouge annuel', 'Relevé météo hebdomadaire avec instruments (température, pluie, vent), 5 min le lundi ; bilan des variations saisonnières en P5 ; CM2 : climat local.'),
          ('Documents', 'Cahier d\'expériences (conceptions, hypothèses, protocole, résultats) ; trace écrite collective ; fiches de relevé.')])
    + t(['Période', 'Séquences', 'Extension CM2'], [
        ['P1', 'Objets techniques : besoin, fonction, matériaux, représentation', '—'],
        ['P2', 'Fin de la séquence circuits (conducteurs, isolants, fonction des composants) ; la lumière : transparent, translucide, opaque, ombres ; début de l\'observation de la Lune sur deux lunaisons', 'Circuit électrique et formes d\'énergie'],
        ['P3', 'La masse : comparer, mesurer, la tare ; mélanges, séparation, dissolution, saturation ; le cerveau : attention, mémorisation, illusions sensorielles ; bilan des phases de la Lune', 'États et changements d\'état'],
        ['P4', 'Le vivant : espèce, classification, clé de détermination ; reproduction et développement (ovipare, vivipare), avec un élevage ; besoins des végétaux, avec des plantations', 'Fonctions de nutrition'],
        ['P5', 'Écosystèmes : coopération, prédation, réseaux alimentaires ; la puberté (en lien avec l\'EVAR) ; mouvement : distance et durée, programmer un robot ; bilan météo', 'Organes reproducteurs ; climat local']], [8, 66, 26])
    + note('Matériel à confirmer : instruments météo, balances, élevage (phasmes, escargots), coin de plantation, robot programmable.')
)

# ---------------------------------------------------------------- 5. histoire-géo
hg = (
    p('Nouveau programme d\'histoire-géographie du cycle 3. <b>Année B</b> de l\'alternance : thèmes de CM2 pour toute la classe ; l\'année A traitera les thèmes de CM1 (Moyen Âge, monarchie, explorations, 1789).')
    + kv([('Créneaux', 'Lundi 15h00-16h00 et vendredi 15h00-15h30 (1 h 30)'),
          ('Parité', 'Alternance une semaine d\'histoire, une semaine de géographie (lundi : étude de documents ; vendredi : trace écrite, frise ou carte).'),
          ('Démarche', 'Les trois modalités du programme : étude de documents (prélever, formuler des hypothèses, interroger la fiabilité de la source), étude d\'un sujet menée par l\'enseignant à partir de documents majeurs, récit ; frise commune et cartes ; écrits de travail distincts des écrits validés ; au moins une production graphique par an en géographie.'),
          ('Sources', 'Uniquement des sources originales (photographies, textes, peintures, cartes, archives) avec leur référence et leur lien. Documents du domaine public intégrés aux fiches ; photographies de personnes : lien fourni, non reproduites. Banques : Gallica, L\'Histoire par l\'image, POP, Musée national de l\'Éducation, Légifrance, INA, Mémoire des hommes, Géoportail, Archives départementales de l\'Allier.'),
          ('Histoire locale', 'Moulins et l\'Allier à chaque thème : industrie de Montluçon et mines de Commentry ; monument aux morts ; Vichy et la ligne de démarcation qui traversait l\'Allier ; la rivière Allier pour l\'eau douce.')])
    + t(['Période', 'Histoire', 'Géographie'], [
        ['P1', 'De la République à l\'Empire (1792-1815)', 'L\'organisation du territoire : commune, département, région'],
        ['P2', 'Vers une France républicaine (1848, lois Ferry, 1905, symboles, empire colonial) ; l\'âge industriel', 'L\'organisation du territoire : 18 régions, grandes agglomérations, axes de transport ; deux régions, dont Auvergne-Rhône-Alpes'],
        ['P3', 'La France dans la Première Guerre mondiale (bataille choisie : Verdun)', 'Les usages de l\'eau douce (1) : une ressource limitée, fleuves et massifs'],
        ['P4', 'La France pendant la Seconde Guerre mondiale (Vichy, la ligne de démarcation dans l\'Allier)', 'Les usages de l\'eau douce (2) : conflits d\'usages, l\'exemple de l\'Allier'],
        ['P5', 'La France depuis 1945', 'L\'Union européenne : dix pays dont les six fondateurs ; un aménagement soutenu par l\'UE près de Moulins']], [8, 46, 46])
)

# ---------------------------------------------------------------- 6. EMC
emc = (
    p('Programme d\'EMC 2024 (CM1 « Faire société », CM2 « Vivre en République ») ; programme d\'EVAR (arrêté du 3 février 2025) : au moins trois séances par an et par niveau, familles informées.')
    + kv([('Créneaux', 'Jeudi 15h30-16h00 : débat réglé ou étude de cas sur la notion ; vendredi 15h30-16h00 : conseil de classe.'),
          ('Démarche', 'Débat réglé avec rôles (président, reformulateur, gardien du temps, secrétaire), appuyé sur des connaissances plutôt que sur des opinions ; conseil coopératif (Oury et Vasquez) ; projets d\'engagement ; études de cas tirées de la vie de classe, de l\'actualité ou du roman. Pas de dilemmes moraux (cycle 4).'),
          ('Double niveau', 'Débats communs ; chaque niveau institutionnalise ses notions.'),
          ('EVAR', 'Trois séances par niveau, séparées CM1 et CM2, menées avec les livrets d\'accompagnement Éduscol ; familles informées avant chaque séance.')])
    + t(['Période', 'Notions CM1', 'Notions CM2', 'Moments forts, EVAR'], [
        ['P1', 'Civisme, démocratie : règles, conseil, délégués', 'Citoyenneté', '—'],
        ['P2', 'Égalité, dignité, discriminations, tolérance', 'Libertés et droits fondamentaux ; discriminations, stéréotypes ; l\'école laïque', 'Harcèlement (5 nov.) ; droits de l\'enfant (20 nov.) ; laïcité (9 déc.) ; EVAR 1 : relations aux autres, amitié, respect'],
        ['P3', 'Fraternité, empathie ; sobriété numérique, incivilités ; dès février : qu\'est-ce qu\'élire ?', 'Citoyenneté et nationalité, droits civils et politiques (le droit de vote), devoirs ; dès février : la Ve République et la Constitution de 1958', 'EVAR 2 : la vie numérique, violences en ligne, images'],
        ['P4', 'La Ve République et l\'élection présidentielle : le rôle du président, voter (suffrage universel direct, deux tours), décider ensemble ; visite de la mairie de Moulins', 'Fonctionnement de la Ve République : président, gouvernement, Parlement, séparation des pouvoirs ; la campagne et ses règles (égalité du temps de parole) ; symboles républicains', 'Semaine de la presse : s\'informer sur une élection, sources fiables ; élection simulée sur un projet de classe (sans candidats réels)'],
        ['P5', 'Après le vote : l\'investiture, le rôle du nouveau mandat ; engagement : un projet solidaire de la classe', 'Résultats et institutions (lien avec l\'histoire : 1958) ; engagement : conseil municipal des jeunes, Parlement des enfants', 'Présidentielle les 18 avril et 2 mai 2027 ; 8 mai ; EVAR 3 : grandir, puberté, égalité filles-garçons']], [8, 31, 31, 30])
    + note('Séquence élection présidentielle (février à mai). Neutralité du service public : on étudie les institutions, le vote et ses règles, jamais les candidats ni leurs programmes. Sources officielles : Constitution de 1958 (Conseil constitutionnel, Légifrance), vie-publique.fr, elysee.fr, Assemblée nationale et Sénat (espaces jeunes), Lumni.')
)

# ---------------------------------------------------------------- 7. EPS
eps = (
    kv([('Quotidien', '15 min de parcours athlétique dans la cour lundi, jeudi, vendredi à 14h45 (et dans la séance du mardi), quand la météo le permet ; repli dans la salle polyvalente le mardi et le jeudi, activité calme en classe sinon.'),
        ('Séance longue', 'Mardi 13h50-15h00, salle polyvalente.'),
        ('Ressources', 'Salle polyvalente mardi et jeudi après-midi ; malles USEP de l\'Allier.'),
        ('Natation', '9 séances le vendredi après-midi (banalisé), du 19 mars au 4 juin ; objectif : attestation scolaire du savoir-nager.'),
        ('Spectacle', 'Danses de la pièce tirée de <i>Lucy Lost</i>, préparées à partir de janvier ; répétitions dans la salle ; représentation autour du 22 juin.'),
        ('Démarche', 'Situations de référence en début et en fin de cycle, problèmes moteurs résolus en équipe, rôles sociaux (arbitre, observateur, juge), critères de réussite construits avec les élèves.')])
    + t(['Période', 'Parcours quotidien', 'Séance du mardi', 'Autre'], [
        ['P1', 'Courir longtemps, franchir', 'Athlétisme : course longue, sauts, lancers', '—'],
        ['P2', 'Allure régulière, obstacles', 'Lutte (malle USEP des jeux d\'opposition)', '—'],
        ['P3', 'Vitesse, relais, départs', 'Danse : création des danses de la pièce', '—'],
        ['P4', 'Sauts et lancers en parcours', 'Danse jusqu\'à la mi-mars, puis jeux collectifs ou orientation (malles USEP)', 'Piscine à partir du 19 mars'],
        ['P5', 'Parcours chronométré, défis', 'Jeux collectifs, répétitions des danses, rugby toucher après le 4 juin', 'Piscine jusqu\'au 4 juin ; spectacle autour du 22 juin']], [8, 26, 40, 26])
)

# ---------------------------------------------------------------- 8. arts
arts = (
    kv([('Créneaux', 'Arts plastiques mardi 15h00-15h45 ; éducation musicale jeudi 15h00-15h30. À partir de P3, les deux disciplines servent le spectacle tiré de <i>Lucy Lost</i>.'),
        ('Arts plastiques', 'Pratique, verbalisation, référence (Gaillot) : une incitation ouverte, une production, une mise en mots des choix, puis la rencontre d\'une œuvre.'),
        ('Musique', 'Écouter, chanter, produire : un chant appris par imitation, une écoute active (comparer, décrire), une production sonore.'),
        ('Œuvres de référence', 'Sources originales avec leur référence et leur lien, comme en histoire-géographie.')])
    + t(['Période', 'Arts plastiques', 'Éducation musicale'], [
        ['P1', 'L\'autoportrait', 'Pulsation, tempo, chant à l\'unisson'],
        ['P2', 'Matières et textures ; paysage d\'île (référence : Courbet, <i>La Vague</i>, 1869)', 'Le canon ; les timbres (<i>Pierre et le loup</i>, Prokofiev) ; chant de fin d\'année'],
        ['P3', 'La mer et la lumière : peindre un paysage marin (marines de Turner et de Monet)', 'Chants de marins en anglais ; rythmes'],
        ['P4', 'Personnages et costumes de la pièce : silhouettes, masques, accessoires', 'Paysage sonore de la pièce : bruitages, mer, tempête, navire'],
        ['P5', 'Décors et affiche du spectacle', 'Chants du spectacle, répétitions avec la danse ; représentation']], [8, 50, 42])
)

# ---------------------------------------------------------------- 9. références
refs = (
    h2('Textes officiels')
    + ul(['Programmes de français et de mathématiques du cycle 3 (2025).', 'Programme de sciences et technologie : BO n° 24 du 11 juin 2026 (CM1) ; programme de cycle 3 antérieur (CM2 jusqu\'en juin 2027).',
          'Nouveau programme d\'histoire-géographie du cycle 3 (alternance année A / année B).', 'Programme d\'EMC (2024) ; programme d\'EVAR, arrêté du 3 février 2025 (BO n° 6 du 6 février 2025).',
          'Programme de langues vivantes du cours moyen (90 min par semaine, A1).', 'Programmes d\'EPS et d\'enseignements artistiques du cycle 3.'])
    + h2('Didactique et pédagogie')
    + t(['Domaine', 'Appuis'], [
        ['Compréhension de lecture', 'Goigoux et Cèbe (<i>Lector et Lectrix</i>) ; Cnesco (2016) ; Tauveron ; Dufays ; Giasson ; Bianco ; Palincsar et Brown'],
        ['Écriture', 'Kervyn (écriture longue, réécriture différée) ; film mental (Cèbe et Goigoux)'],
        ['Étude de la langue', 'Brissaud et Cogis (dictée réflexive, démarche inductive) ; Gourdet (plus grande récurrence en conjugaison) ; Catach ; Picoche et Sardier (vocabulaire)'],
        ['Mathématiques', 'Brousseau (situations) ; Vergnaud et Houdement (problèmes) ; Butlen et Pézard, Charnay (calcul mental) ; Brissiaud ; Perrin-Glorian, Duval, Mathé, Petitfour (géométrie)'],
        ['Sciences', 'La main à la pâte (démarche d\'investigation)'],
        ['Histoire-géographie', 'Audigier ; Heimberg (repères temporels)'],
        ['EMC', 'Tozzi (débat réglé, discussion à visée philosophique) ; Oury et Vasquez (conseil coopératif)'],
        ['Anglais', 'Ellis et Brewster (<i>storybook approach</i>)'],
        ['Arts', 'Gaillot (pratique, verbalisation, référence)'],
        ['Cadre général', 'Brousseau ; Doise et Mugny (conflit sociocognitif) ; Vygotski (zone proximale)']], [24, 76])
    + h2('Points en attente')
    + ul(['Textes des chapitres pivots de <i>Lucy Lost</i> (fiches de compréhension et corpus de grammaire).', 'Graphies des fiches de sons 6 et 8 à vérifier.',
          'Matériel de sciences à confirmer.', 'Partenaire eTwinning pour la tâche finale d\'anglais de P5 (sinon conte mis en scène).'])
)

SECTIONS = [
    ('cadre', '0', 'Cadre général', GEN, cadre), ('fr', '1', 'Français', FR, francais), ('ma', '2', 'Mathématiques', MA, maths),
    ('lv', '3', 'Anglais', LV, anglais), ('sc', '4', 'Sciences et technologie', SC, sciences), ('hg', '5', 'Histoire-géographie', HG, hg),
    ('emc', '6', 'EMC et EVAR', EMC, emc), ('eps', '7', 'EPS', EPS, eps), ('art', '8', 'Enseignements artistiques', ART, arts), ('ref', '9', 'Références', GEN, refs)]
toc = '<ol class="toc">' + ''.join(f'<li style="--c:{c}"><span>{n}</span>{tt}</li>' for (_, n, tt, c, _) in SECTIONS) + '</ol>'

CSS = '''
@page { size: A4; margin: 15mm 14mm 16mm 14mm;
  @bottom-center { content: "Référentiel des progressions CM1-CM2 · 2026-2027 · page " counter(page); font: 8pt "DejaVu Sans", sans-serif; color: #888; } }
* { box-sizing: border-box; }
body { font-family: "Liberation Sans", "DejaVu Sans", Arial, sans-serif; font-size: 9.6pt; line-height: 1.38; color: #1d1d1d; margin: 0; }
.cover { height: 262mm; display: flex; flex-direction: column; justify-content: space-between; page-break-after: always; }
.cover .band { background: #1F3A5F; color: #fff; padding: 22mm 14mm 14mm; border-radius: 4px; }
.cover h1 { font-size: 30pt; margin: 0 0 4mm; line-height: 1.1; }
.cover .sub { font-size: 13pt; opacity: .9; }
.cover .meta { font-size: 10pt; color: #444; }
.toc { list-style: none; padding: 0; margin: 0; columns: 2; column-gap: 8mm; }
.toc li { break-inside: avoid; display: flex; align-items: center; gap: 3mm; padding: 2.2mm 0; border-bottom: 1px solid #e3e3e3; font-size: 11pt; }
.toc li span { background: var(--c); color: #fff; font-weight: 700; width: 8mm; height: 8mm; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 10pt; }
section.saut { page-break-before: always; }
h1 { font-size: 17pt; color: var(--c); border-bottom: 2.5px solid var(--c); padding-bottom: 1.5mm; margin: 0 0 4mm; display: flex; align-items: center; gap: 3mm; }
h1 .num { background: var(--c); color: #fff; border-radius: 3px; padding: 0 2.5mm; font-size: 14pt; }
h2 { font-size: 11.5pt; color: var(--c); margin: 5mm 0 2mm; break-after: avoid; }
p { margin: 0 0 2.2mm; }
.note { font-size: 8.4pt; color: #555; border-left: 3px solid var(--c); padding: 1mm 0 1mm 3mm; background: #f7f7f5; }
ul { margin: 0 0 2.5mm; padding-left: 5mm; } li { margin-bottom: 1mm; }
table { width: 100%; border-collapse: collapse; margin: 1mm 0 3.5mm; font-size: 8.6pt; table-layout: fixed; }
th, td { border: 1px solid #cfcfcf; padding: 1.3mm 1.8mm; vertical-align: top; text-align: left; }
thead th { background: var(--c); color: #fff; font-weight: 700; }
thead { display: table-header-group; } tr { break-inside: avoid; }
tbody tr:nth-child(even) td { background: #f6f6f4; }
table.kv th { width: 27%; background: #eeeeea; color: #222; }
table.mini { font-size: 7.8pt; } table.mini th, table.mini td { padding: 0.9mm 1.4mm; }
table.edt { font-size: 7.6pt; } table.edt td:first-child { font-weight: 700; white-space: nowrap; }
.cols2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }
.conj-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; }
.conj { break-inside: avoid; } .conj:first-child { grid-column: 1 / -1; } .conj:last-child, .conj:nth-child(4) { grid-column: 1 / -1; }
.conj-t { font-weight: 700; color: var(--c); margin-bottom: 0.5mm; }
'''
HTML = f'''<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Référentiel des progressions CM1-CM2</title><style>{CSS}</style></head><body>
<div class="cover"><div class="band"><h1>Référentiel des progressions</h1><div class="sub">Classe de CM1-CM2 · année scolaire 2026-2027<br>Progressions, démarches, emploi du temps et outils de chaque discipline</div></div>
<div style="--c:#1F3A5F"><h2 style="color:#1F3A5F">Sommaire</h2>{toc}</div>
<div class="meta">Pierre Galan · CM1-CM2 · Moulins (Allier) · version du 12 novembre 2026, d'après les décisions validées discipline par discipline</div></div>
{''.join(sec(i, n, tt, c, b) for (i, n, tt, c, b) in SECTIONS)}
</body></html>'''
open(os.path.join(OUT, 'referentiel.html'), 'w').write(HTML)
print('html ok')
