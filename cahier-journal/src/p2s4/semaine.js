// P2 S4 (23-27 novembre 2026), S11 de l'année. Planning préparé le dimanche 22 novembre (tâche planifiée).
// Les fichiers des jours (lundi.js, mardi.js, jeudi.js, vendredi.js) sont écrits la veille au soir de chaque jour de classe,
// d'après ce planning, le cadrage et la semaine modèle p2s3 ; les ajouter alors à `days`.
const path = require('path');
const fs = require('fs');
const O = require('./ortho');
const C = require('./commun');
const JOURS = ['lundi', 'mardi', 'jeudi', 'vendredi'];

module.exports = {
  periode: 2, semaine: 4,
  generateurs: { dir: path.join(__dirname, '..', '..', 'gen', 'p2s4'), tables: { Lundi: '7 et 8', Mardi: '7 et 8', Jeudi: '7 et 8', Vendredi: '7 et 8' } },
  dates: '23-27 novembre 2026', dossier: 'Periode_2/Semaine_04_23-27_novembre',
  planning: {
    jours: ['Lundi 23 novembre', 'Mardi 24 novembre', 'Jeudi 26 novembre', 'Vendredi 27 novembre'],
    lead: "Semaine des fractions décimales (CM2 : millièmes), de l'entraînement sur le GN et du présent en -endre, -ondre. Lucy Lost, chapitres 10 à 14, pivot : chapitre 10 « Il faut toujours garder espoir » (chapitres 11 à 14 lus à la maison) ; lundi, rappel des chapitres 6 à 9. Début de Stick Man en anglais. Son : [ɛ] (fiche 8 : è, ê, e + deux consonnes), en synthèse avec [e]. Ni férié ni temps fort (prochain : laïcité, 9 décembre).",
    rows: [
      ['Verbe du jour (8h30)', 'soigner (avoir)', 'rester (être)', 'fêter (avoir)', 'jouer (avoir)'],
      ['Dictée réflexive · vocabulaire (8h40)', 'GN ; PP avec avoir', 'PP avec être : accord', 'Son [ɛ] 3/4 : la trace à l\'épreuve', 'Voc : mer et île, intensité (brise → tempête)'],
      ['Calcul mental (8h55)', 'Calcul réfléchi : 1/10 = 0,1 ; 25/100 = 0,25 ; × et : 10', 'Série tables de 7 et 8 + 5 procédures', 'Furet, ardoise, flash fractions et décimaux', 'Bilan : tables de 7 et 8 + procédures'],
      ['Écrit · langue (9h10)', '« Il fondit en larmes. »', 'Grammaire : le GN (4/4), entraînement et réinvestissement', '« Elle ouvrit la porte. »', 'Réécriture de lundi'],
      ['Problème du jour (9h55)', 'Longueurs, parcours (anticipation) : jour 1, problème 1', 'Jour 1, problème 2', 'Jour 2 : la distance d\'une étape (inconnue à l\'envers)', 'Évaluation, nouveau contexte (le livreur)'],
      ['Mathématiques (10h30)', 'Fractions décimales : situation de recherche (unité partagée en 10, puis en 100)', 'Dixièmes, centièmes (CM2 : millièmes) : institutionnalisation', 'Géom : tracer la perpendiculaire à une droite passant par un point', 'Fractions décimales : entraînement différencié et bilan'],
      ['Lecture (11h10)', 'Rappel ch. 6 à 9 (10 min) ; ch. 10, temps 1 à 3, débat · chasse', 'Documentaire : titres, intertitres, légendes pour trouver une information · chasse', 'Fluence sur un passage du ch. 10 (20 min) · chasse', 'Dictée bilan (11h10) ; ch. 10, temps 4 à 6 en groupes hétérogènes + commande (14h15)'],
      ['Anglais', 'Rituel ; la famille : réactivation (15 min)', 'Stick Man : découverte de l\'album, compréhension orale, th (30 min)', 'Binômes : my, his, her ; CM2 comparatifs ; notebook (30 min)', 'Chant ; préparer les questions de l\'interview (15 min)'],
      ['Orthographe [ɛ]', '1/4 grand corpus : chercher et classer (14h15)', '2/4 des constats à la règle, trace (13h30)', '3/4 en dictée réflexive', '4/4 dix mots, dictée (13h30)'],
      ['Conjugaison', 'Présent -endre, -ondre : construire la colonne (14h30)', 'Présent -endre, -ondre : entraînement (15h45)', '—', '—'],
      ['Sciences', 'Météo ; circuits en panne : hypothèses, protocole', '—', 'Expérience : chercher la panne ; schémas normalisés ; conclusion', '—'],
      ['Histoire · EMC', 'H : 1789, comment la monarchie absolue prend-elle fin ? (documents)', '—', 'EMC : stéréotypes et discriminations, débat réglé', 'H : trace, frise (1789) · conseil de classe'],
      ['EPS', 'Parcours : allure régulière', 'Lutte : progresser en équipe (70 min)', 'Parcours : obstacles', 'Parcours : bilan'],
      ['Arts', '—', 'AP : paysage d\'île, matières et textures (production)', 'Musique : le canon (« Vent frais, vent du matin ») ; chant de fin d\'année', 'Lecture à voix haute (13h45)'],
    ],
    objectifs: [
      ['Français', 'Identifier et accorder les mots du GN (déterminant, nom, adjectif) dans une phrase nouvelle ; CM2 : complément du nom et sa préposition (de, à, en). Accorder le participe passé avec être, ne pas l\'accorder avec avoir. Conjuguer au présent les verbes en -endre et -ondre (-ds, -ds, -d) ; ⚠ prendre au pluriel.'],
      ['Orthographe et vocabulaire', 'Choisir la graphie de [ɛ] et de [e] (è, ê, e + deux consonnes, ai, é, er, ez) selon sa place et la lettre qui suit ; écrire les dix mots (8 sur 10 attendus ; CM2 sur 12). Ranger des mots de la mer du plus faible au plus fort.'],
      ['Écriture et lecture', 'Intégrer une phrase inductrice en choisissant un sens et le tenir ; faire voir une émotion sans dialogue. Comprendre une journée racontée dans un journal intime (chapitre 10) et justifier ce qui aide Lucy à guérir par une phrase du texte. Utiliser titres, intertitres et légendes pour trouver une information.'],
      ['Mathématiques', 'Écrire et lire des fractions décimales (dixièmes, centièmes ; CM2 : millièmes), savoir que 10 centièmes = 1 dixième, décomposer (3 + 4/10 + 7/100) et placer sur une droite graduée. Tracer à l\'équerre la perpendiculaire à une droite passant par un point. Résoudre un problème de parcours avec conversion km / m.'],
      ['Autres', 'Trouver la panne d\'un circuit et le représenter par un schéma normalisé ; expliquer comment la monarchie absolue prend fin en 1789 à partir de documents ; distinguer un stéréotype d\'une discrimination ; comprendre une histoire en anglais à partir d\'un album ; chanter en canon.'],
    ],
    son: {
      titre: 'Son [ɛ] (fiche 8) : è, ê, e devant deux consonnes, et — en synthèse avec [e] et ai',
      seq: 'Séquence inductive en 4 temps (révision du 18 novembre : é et è regroupés, corpus des mots les plus fréquents) : lundi, classer librement un grand corpus de 48 mots en groupes hétérogènes ; mardi, constats (graphème, place dans le mot, lettre qui suit), contre-exemples, trace ; jeudi, la trace à l\'épreuve dans la dictée réflexive ; vendredi, mémorisation et dictée des dix mots (8 sur 10 attendus).',
      mots: O.dixMots,
      note: `CM2 : + ${O.cm2Plus.join(', ')} (sur 12). Élèves fragiles : les 6 premiers. Point de morphologie de la période : les accents (é, è, ê) et le s disparu (forêt, forestier ; fête, festin). Pièges : e devant deux consonnes sans accent (elle, cette, presque) ; et final (le jouet) ; « aller », « premier » : er final fait [e].`,
    },
    verbes: [
      ['Lundi', 'soigner', 'avoir', `1er groupe, colonne -er ; ${C.PIEGES.soigner}`, `Phrase : « ${C.PHRASES.Lundi} »`],
      ['Mardi', 'rester', 'être', `1er groupe ; ${C.PIEGES.rester}`, `Phrase : « ${C.PHRASES.Mardi} »`],
      ['Jeudi', 'fêter', 'avoir', `1er groupe ; ${C.PIEGES.fêter}`, `Phrase : « ${C.PHRASES.Jeudi} »`],
      ['Vendredi', 'jouer', 'avoir', `1er groupe ; ${C.PIEGES.jouer} ; récapitulatif des quatre verbes avant la dictée bilan`, `Phrase de la dictée bilan : « ${C.PHRASES.Vendredi} »`],
    ],
    materiel: [
      ['Lundi', 'Bandes unité cartonnées (une par élève) à partager en 10 puis en 100, règles graduées, droite graduée en dixièmes au tableau (fractions décimales) ; corpus de 48 mots en étiquettes, un jeu par groupe de quatre ; frise des deux histoires de Lucy Lost (rappel) ; instruments météo ; circuits « en panne » préparés à l\'avance (lampe dévissée, pile usée, fil coupé, borne non reliée) ; documents de 1789 à projeter ; plots, chronomètre.'],
      ['Mardi', 'Affiche du corpus de GN (Lucy Lost ch. 5 et 6) et étiquettes des classes de mots ; tableau du présent de la classe (colonne -endre, -ondre à compléter) ; salle polyvalente, tapis (lutte) ; gouaches, colle, sable, papiers, tissus, supports cartonnés A4 (paysage d\'île) ; album Stick Man et flashcards de la famille ; texte documentaire de la semaine.'],
      ['Jeudi', 'Équerres, règles, crayons bien taillés, figures à compléter (perpendiculaire passant par un point) ; circuits, piles 4,5 V, lampes, fils, interrupteurs, fiche des symboles normalisés ; chronomètres et graphique de fluence ; haies basses, cerceaux, plots ; cartes de rôles du débat ; partition et enregistrement du canon.'],
      ['Vendredi', 'Fiches bilan fractions décimales CM1 et CM2 ; version aménagée de la dictée (texte à trous) ; frise de classe (placer 1789) ; cahier du conseil ; cahier de lexique (carte de la mer et de l\'île).'],
      ['Toute la semaine', 'Fiches élèves de chaque jour (fichiers « fiches_eleves » du cahier journal du jour) ; carnet de chasse au mot de la semaine ; affiche « avoir bloque, être laisse passer » ; tableau du présent ; fichier « problème du jour » de chaque jour (générateur, graine CJ-P2S4).'],
    ],
    fournir: [
      ['Lecture suivie, pivot', 'Chapitre 10 « Il faut toujours garder espoir » : Lucy-Lost/1_Textes_adaptes/10_Lucy-Lost_chapitre.docx (●, ●●, ●●●) et Lucy-Lost/2_Comprehension/10_Lucy-Lost_chapitre.docx (QCM N1-N3, activités du temps 5, version enseignant) — lundi et vendredi. Le passage de fluence de jeudi est à choisir dans le chapitre 10.'],
      ['Lecture à la maison', 'Textes adaptés des chapitres 11 à 14 (11 à 14_Lucy-Lost_chapitre.docx), à distribuer lundi ; audio et résumé illustré pour les lecteurs fragiles (garde-fou du cadrage) ; rappel collectif lundi 30 novembre.'],
      ['Supports à réunir', 'Album Stick Man (Julia Donaldson) ; un texte documentaire court avec titres, intertitres et légendes (BCD : électricité ou Révolution française) ; documents de 1789 (fiche DANE Nancy-Metz « Prise de la Bastille », lien à vérifier ; Déclaration des droits de l\'homme et du citoyen, article 1) ; séquence La main à la pâte « Électricité cycle 3 » (étape des circuits en panne) ; partition du canon.'],
      ['Vigilance chapitre 10', 'Jack Brody et le risque de « septicémie » : rester sobre ; une naissance évoquée simplement ; « Lusitania » apparaît (versions ●● et ●●●) : accueillir les liens sans confirmer ; l\'avis du docteur sur la guerre est celui d\'un personnage (voir la version enseignant).'],
    ],
  },
  // Jours ajoutés au fil de la semaine par la tâche du soir
  days: JOURS.filter(j => fs.existsSync(path.join(__dirname, j + '.js'))).map(j => require('./' + j)),
};
