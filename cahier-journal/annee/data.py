# Données de l'année 2026-2027 (cadrage validé + référentiel des progressions). Une entrée par semaine réelle S1-S36.
import datetime as dt

DEBUTS = {1: dt.date(2026, 8, 31), 2: dt.date(2026, 11, 2), 3: dt.date(2027, 1, 4), 4: dt.date(2027, 3, 1), 5: dt.date(2027, 4, 26)}
NBSEM = {1: 7, 2: 7, 3: 6, 4: 6, 5: 10}
FERIES = {dt.date(2026, 8, 31): 'pré-rentrée', dt.date(2027, 3, 29): 'lundi de Pâques', dt.date(2027, 5, 6): 'Ascension',
          dt.date(2027, 5, 7): "pont de l'Ascension", dt.date(2027, 5, 17): 'lundi de Pentecôte'}
JOURS = [('Lundi', 0, '01'), ('Mardi', 1, '02'), ('Jeudi', 3, '03'), ('Vendredi', 4, '04')]
MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
def fdate(d): return f"{'1er' if d.day == 1 else d.day} {MOIS[d.month - 1]}"

def semaines():
    out, s = [], 1
    for p in range(1, 6):
        for k in range(1, NBSEM[p] + 1):
            lun = DEBUTS[p] + dt.timedelta(weeks=k - 1)
            jours = []
            for j, off, num in JOURS:
                d = lun + dt.timedelta(days=off)
                jours.append({'jour': j, 'd': d, 'date': fdate(d), 'num': num, 'off': FERIES.get(d)})
            ven = lun + dt.timedelta(days=4)
            dates = f"{lun.day}-{fdate(ven)}" if lun.month == ven.month else f"{fdate(lun)}-{fdate(ven)}"
            out.append({'S': s, 'P': p, 'k': k, 'lundi': lun, 'jours': jours, 'dates': dates + f" {ven.year}"})
            s += 1
    return out

# ------------------------------------------------------------------ par période
OEUVRE = {1: "Charlie et la chocolaterie (Roald Dahl)", 2: "Le mystère de Lucy Lost (Michael Morpurgo)", 3: "Cheval de guerre (Michael Morpurgo)",
          4: "Matilda (Roald Dahl)", 5: "L'Enfant Océan (Jean-Claude Mourlevat)"}
COURT = {1: 'Charlie', 2: 'Lucy Lost', 3: 'Cheval de guerre', 4: 'Matilda', 5: "L'Enfant Océan"}
FOCUS = {1: 'représentation mentale ; reformuler', 2: 'états mentaux des personnages', 3: 'inférences, implicite',
         4: 'chronologie, retours en arrière ; interroger la morale', 5: 'narrateur et point de vue'}
SUPPORT = {1: 'Albums (texte et image, implicite)', 2: 'Textes documentaires (électricité, République)', 3: 'Nouvelles et récits courts en réseau (la guerre, l\'animal compagnon)',
           4: 'Bande dessinée', 5: 'Poésie et théâtre'}
PE_TYPE = {1: ("phrases d'action simples", "intégrer la phrase de façon cohérente et construire une chaîne de « pourquoi ? »"),
           2: ("phrases à mot polysémique", "choisir et assumer une interprétation, propre ou figurée"),
           3: ("phrases qui imposent de l'implicite", "faire exister le hors-champ et laisser le lecteur déduire"),
           4: ("phrases qui jouent sur le temps", "faire exister le passé et le futur du personnage"),
           5: ("phrases qui imposent un point de vue", "choisir qui regarde et d'où, comme on place une caméra")}
# phrases inductrices : (lundi, jeudi) pour chaque semaine, période par période
PHRASES = {
 1: [("La porte claqua.", "Le vent se leva."), ("Elle courut jusqu'au portail.", "Le verre se brisa."), ("Il ouvrit la fenêtre.", "La lumière s'alluma."),
     ("Le chien aboya.", "Elle lâcha la corde."), ("Il sauta dans l'eau.", "La sonnerie retentit."), ("Elle ferma les yeux.", "Le train s'arrêta."),
     ("Il ramassa la clé.", "Les feuilles tombèrent.")],
 2: [("Elle tourna la page.", "Il perdit la tête."), ("Le ciel s'assombrit.", "Elle garda le silence."), ("Il perdit pied.", "Tout s'éteignit."),
     ("Il fondit en larmes.", "Elle ouvrit la porte."), ("Ils tirèrent un trait.", "Elle prit le large."), ("Il resta de glace.", "Tout bascula."),
     ("Elle sauta le pas.", "Il tendit la main.")],
 3: [("Personne ne se retourna.", "La chaise resta vide."), ("Le téléphone ne sonna pas.", "Elle referma la lettre sans la lire."),
     ("Les volets restèrent clos.", "Il rangea la photo dans sa poche."), ("Personne ne vint ce soir-là.", "La neige avait tout recouvert."),
     ("Il ne dit rien.", "Le bol était encore chaud."), ("Elle éteignit la radio.", "Les traces s'arrêtaient au bord de l'eau.")],
 4: [("Il avait promis de ne jamais revenir.", "Ce jour-là, tout avait commencé."), ("Elle n'avait jamais oublié cette odeur.", "Demain, plus rien ne serait pareil."),
     ("Il y a longtemps, cette maison était habitée.", "Elle saurait bientôt la vérité."), ("Il avait déjà vu ce visage.", "Plus tard, il comprendrait."),
     ("Rien n'avait changé depuis l'hiver.", "Ce serait la dernière fois."), ("Elle se souvint de la promesse.", "Un jour, elle reviendrait.")],
 5: [("De là-haut, tout paraissait minuscule.", "Je n'aurais jamais dû ouvrir cette boîte."), ("Derrière la vitre, il les regardait.", "De ma cachette, je voyais tout."),
     ("Personne ne m'avait vu entrer.", "Vu d'en bas, l'arbre touchait le ciel."), ("Le chat observait la scène.", "J'étais le dernier à savoir."),
     ("Par le trou de la serrure, elle aperçut la lumière.", "Moi, je savais."), ("Depuis le pont, on voyait la mer.", "Ils ne m'ont jamais cru."),
     ("À travers la brume, une silhouette approchait.", "Si j'avais su…"), ("Du haut du phare, la nuit semblait immense.", "Je le vis avant les autres."),
     ("Sous la table, le monde était différent.", "Elle me regarda sans me voir."), ("Au loin, quelqu'un agitait les bras.", "C'est moi qui raconte.")],
}
GRAM = {  # période : liste de (notion, nb de semaines) ; chaque notion se construit sur 4 mardis (observation, affinement, institutionnalisation, entraînement)
 1: [("la phrase : le verbe et le groupe sujet", 4), ("types et formes de phrases", 3)],
 2: [("le groupe nominal : déterminant, nom, adjectif", 4), ("les chaînes d'accord dans le GN", 3)],
 3: [("le groupe verbal : COD et COI", 4), ("le participe passé avec être ; CM2 : l'attribut du sujet", 2)],
 4: [("les compléments circonstanciels", 4), ("prépositions, adverbes, conjonctions de coordination", 2)],
 5: [("phrase simple et phrase complexe", 4), ("coordination et subordination ; CM2 : participe passé avec avoir", 4), ("synthèse des natures", 2)],
}
NATURES = {1: ('verbe, nom, pronom personnel sujet', 'nom commun et nom propre ; sujet inversé'),
           2: ('déterminants (articles, possessifs, démonstratifs), nom, adjectif', 'préposition du complément du nom ; nature et fonction dans le GN'),
           3: ('pronoms personnels sujets ou compléments ; COD et COI simples', 'attribut du sujet et verbes d\'état ; pronoms COD et antécédent'),
           4: ('prépositions, adverbes, conjonctions de coordination', 'nature des compléments circonstanciels : temps, lieu, cause'),
           5: ('premières conjonctions de subordination', 'coordination ou subordination ; participe passé avec avoir')}
CONJ = {1: ["l'imparfait : radical fixe", "l'imparfait : terminaisons invariantes", "l'imparfait : verbes en -cer, -ger", "le futur : infinitif + terminaison",
            "le futur : verbes en -re", "futur et imparfait : choisir le temps", "bilan imparfait et futur"],
        2: ["le présent : verbes en -er", "le présent : être et avoir", "le présent : construire les catégories", "le présent : -endre, -ondre",
            "le présent : la colonne ⚠ (aller, faire, dire, pouvoir, vouloir)", "le présent : verbes en -ir (finir, partir)", "bilan du présent"],
        3: ["le passé composé avec avoir", "le passé composé avec être", "les participes passés en -é, -i, -u", "les participes en -is, -it, -nt, -rt",
            "CM2 : le plus-que-parfait", "bilan des temps composés"],
        4: ["le passé simple : verbes en -er (3e personne)", "le passé simple : colonne (i)", "le passé simple : colonne (u)", "le passé simple : venir, tenir (in)",
            "passé simple et imparfait dans le récit", "bilan du passé simple"],
        5: ["présent : ouvrir, offrir, cueillir", "futur : radicaux irréguliers (viendr-, ser-, aur-)", "futur : ir-, fer-, verr-, pourr-", "imparfait : -ions, -iez (nous criions)",
            "passé composé : être ou avoir ?", "passé simple : faire, dire, voir", "mode impératif (présent)", "révision : choisir le temps", "bilan de l'année", "fiche-mémoire de l'année"]}
MORPHO = {1: "lettres muettes finales : les retrouver par la famille (regard, regarder ; gros, grosse)",
          2: "les accents é, è, ê ; le s disparu (forêt, forestier) ; féminin des noms de métier",
          3: "m devant m, b, p ; préfixes qui doublent la consonne (im-, in-, il-, ir- ; ap-, ac-, af-)",
          4: "suffixes (-age, -tion, -ette, -eur, -ment) ; pluriels en -aux, -oux",
          5: "éléments savants (géo-, bio-, hydro-, -phone, -cide) ; bilan des mots fréquents"}
INVAR = {1: ['hier', "aujourd'hui", 'demain', 'toujours', 'jamais', 'souvent', 'parfois', 'longtemps', 'maintenant', 'bientôt', 'déjà', 'encore', 'autrefois', 'désormais'],
         2: ['ici', 'là', 'dehors', 'dedans', 'partout', 'loin', 'près', 'beaucoup', 'trop', 'assez', 'peu', 'autant', 'ailleurs', 'autour'],
         3: ['alors', 'ensuite', 'puis', 'aussi', 'pourtant', 'donc', 'mais', 'car', 'ainsi', 'enfin', "d'abord", 'quand'],
         4: ['vite', 'bien', 'mal', 'très', 'presque', 'ensemble', 'comme', 'avec', 'sans', 'pendant', 'depuis', 'vers'],
         5: ['chez', 'sous', 'entre', 'devant', 'derrière', 'avant', 'après', 'contre', 'dessus', 'dessous', 'combien', 'pourquoi', 'quelquefois', 'selon', 'hormis', 'tandis que', 'malgré', 'parmi', 'volontiers', 'plutôt']}
VOCA = {1: ("les émotions", "synonymes et nuances d'intensité", ['joie', 'gaieté', 'bonheur', 'colère', 'rage', 'agacement', 'peur', 'crainte', 'terreur', 'tristesse', 'chagrin', 'surprise', 'stupeur', 'fierté', 'honte']),
        2: ("les mots de la mer et de l'île", "polysémie, sens propre et sens figuré", ['la vague', 'la marée', 'le large', 'le courant', 'la houle', "l'écume", 'le phare', 'la grève', 'le récif', 'le port', 'le pont', 'la barre', 'la voile', 'le mât', 'la coque']),
        3: ("voir, entendre, percevoir", "verbes de perception, précision du lexique", ['apercevoir', 'distinguer', 'observer', 'contempler', 'guetter', 'scruter', 'entrevoir', 'entendre', 'percevoir', 'écouter', 'sentir', 'flairer', 'frôler', 'effleurer', 'deviner']),
        4: ("les mots de Matilda : inventés, déformés, composés", "formation des mots : préfixes, suffixes, mots composés", ['dévoreuse', 'lecteur', 'relire', 'malhonnête', 'injustice', 'impoli', 'gentillesse', 'méchanceté', 'garde-robe', 'porte-clés', 'marchand', 'intelligent', 'incroyable', 'défaire', 'tyrannique']),
        5: ("dire et raconter", "verbes de parole, registres de langue", ['dire', 'raconter', 'déclarer', 'avouer', 'murmurer', 'chuchoter', 'crier', 'hurler', 'répliquer', 'répondre', 'affirmer', 'témoigner', 'bredouiller', 'confier', 'protester'])}
VOCA_ETAPES = ["collecte dans le roman : relever les mots du réseau", "structurer : classer par sens", "structurer : synonymes et antonymes", "structurer : intensité (du plus faible au plus fort)",
               "structurer : familles et dérivation", "réemploi en écriture", "bilan : la carte du réseau"]
PROC = {1: ('± 8, 9, 18, 19… 39 ; × 10, 100, 1 000 sur les entiers', '± jusqu\'à 98, 99'),
        2: ('relations fractions usuelles / écritures décimales ; × 10 et : 10 sur les décimaux', '× et : par 10, 100, 1 000 sur les décimaux'),
        3: ('décimal ± entier, dixièmes, centièmes sans retenue ; × 4, × 8, × 5', 'somme de deux décimaux ; double et moitié d\'un décimal ; × 5 et × 50'),
        4: ('un chiffre × dizaines ou centaines ; distributivité simple', 'dizaines × centaines ; : 4, : 8 ; distributivité'),
        5: ('consolidation mélangée', 'consolidation mélangée')}
TABLES = [(2, 5), (3, 4), (2, 3), (4, 5), (6, 7), (3, 6), (6, 8), (7, 9), (6, 9), (8, 9), (7, 8), (4, 8), (6, 7), (3, 9)]

# ------------------------------------------------------------------ maths (notion de la semaine) : S1-S36
MATHS = [
 ("Nombres entiers jusqu'à 999 999 : lire, écrire, décomposer", "jusqu'au million", 'numeration'),
 ("Grands nombres : millions et milliards", "classes jusqu'aux milliards", 'numeration'),
 ("Comparer, ranger, encadrer les grands nombres", "droite graduée", 'comparer'),
 ("Addition et soustraction posées", "grands nombres", 'addsous'),
 ("Multiplication posée", "multiplicateur à 3 chiffres", 'mult'),
 ("Division : sens et quotient", "division posée, diviseur à 2 chiffres", 'div'),
 ("Bilan de période : nombres et opérations", "", 'bilan1'),
 ("Fractions simples : partager l'unité, nommer", "fractions de longueur", 'fractions'),
 ("Fractions sur la droite graduée", "fractions > 1 sur la droite", 'fractions'),
 ("Fractions plus grandes que 1 : comparer à l'unité, encadrer", "fraction > 1 = entier + fraction", 'fractions'),
 ("Fractions décimales", "millièmes", 'fracdec'),
 ("De la fraction décimale à l'écriture à virgule", "jusqu'aux millièmes", 'decimaux'),
 ("Comparer, ranger, encadrer des décimaux", "intercaler", 'compdec'),
 ("Décimaux en contexte ; bilan", "", 'compdec'),
 ("Addition et soustraction de décimaux", "", 'adddec'),
 ("Proportionnalité : est-ce proportionnel ?", "", 'propor'),
 ("× 10, 100, 1 000 et : 10, 100", "", 'x10'),
 ("Proportionnalité : linéarité multiplicative et additive", "avec des décimaux", 'propor'),
 ("Multiplier un décimal par un entier", "entier à 2 chiffres", 'multdec'),
 ("Proportionnalité : passage à l'unité", "prix unitaire décimal", 'propor'),
 ("Diviser un décimal par un entier ; bilan", "CM1 : partage de sommes d'argent", 'divdec'),
 ("Longueurs, périmètre, conversions", "unités mixtes", 'longueurs'),
 ("Masses et contenances", "", 'masses'),
 ("Durées", "secondes", 'durees'),
 ("Fraction d'une quantité", "fractions > 1", 'fracqte'),
 ("Ajouter et soustraire des fractions de même dénominateur", "dénominateurs multiples", 'addfrac'),
 ("Aires : comparer, paver, cm²", "m², aire du rectangle", 'aires'),
 ("CM2 : pourcentages ; CM1 : proportionnalité ; bilan", "", 'pourcent'),
 ("Contenances et volumes", "volume du pavé", 'volumes'),
 ("Tableaux et diagrammes", "double entrée", 'tableaux'),
 ("Graphiques", "courbe, diagramme circulaire", 'tableaux'),
 ("Probabilités", "« 3 chances sur 10 »", 'proba'),
 ("Problèmes de recherche : essais et ajustements", "", 'recherche'),
 ("Programmes de calcul, suites", "produire un programme", 'programme'),
 ("Grand projet : le voyage", "", 'voyage'),
 ("Bilan, liaison 6e", "", 'bilan5')]
GEOM_P = {1: list(range(7)), 2: list(range(7))}
from geom import GEOM
def geom(s):
    # P1-P2 : tableau direct ; P3-P5 : suite continue (P3 S7 → P4 S1, P4 S1-S7 → P4 S2-P5 S2, P5 S1-S7 → P5 S3-S9, P5 S10 → défi)
    if s <= 14: return GEOM[s - 1]
    seq = GEOM[14:]  # 21 séances P3 S1 … P5 S7
    i = s - 15
    return seq[i] if i < len(seq) else ('P5', 'S8', 'Défi géométrie : figure mystère', 'Rédiger puis tracer un programme de construction pour une autre classe', 'Programme avec notations', 'Mathé et Barrier')
