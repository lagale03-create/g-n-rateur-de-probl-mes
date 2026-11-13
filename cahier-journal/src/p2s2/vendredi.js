// P2 S2 · vendredi 13 novembre 2026. Notions de la semaine (données par Pierre) : fractions (sens, lire, écrire) ;
// grammaire : compléments essentiels du verbe (compléments d'objet, ni déplaçables ni supprimables) et compléments
// circonstanciels (temps, lieu, manière ; déplaçables et supprimables) ; son [e].
const path = require('path');
const { verbeEr, verbeDuJour } = require('../p2s3/commun');
const O = require('./ortho');
const IMG = f => path.join(__dirname, '..', '..', 'img', f);

const DICTEE_CM2 = ['Ce matin-là, Alfie et son père ont cherché des homards près de l\'île.', 'Soudain, ils ont entendu un cri étrange derrière les rochers.', 'Une fillette épuisée dormait sous une vieille couverture.', 'Avec douceur, le pêcheur a soulevé l\'enfant.', 'Le soir, toute la famille est restée près d\'elle.'];
const DICTEE_CM1 = DICTEE_CM2.slice(0, 4);
const COMMANDE = {
  CM1: 'un nom propre, un déterminant possessif, un adjectif, un verbe conjugué, un pronom personnel sujet',
  CM2: 'un nom propre, un déterminant démonstratif, un adjectif placé avant le nom, un verbe au passé simple, une préposition',
};

module.exports = {
  jour: 'Vendredi', date: '13 novembre', num: '04',
  lead: 'Journée bilan de la semaine 2 : dictée bilan qui réunit le verbe du jour, les compléments du verbe (essentiels ou circonstanciels) et le son [e] ; bilan des fractions ; réécriture ; Lucy Lost, temps 4 à 6 du chapitre pivot ; géographie : les régions françaises ; conseil.',
  seances: [
    verbeDuJour(verbeEr('chercher', 'avoir'), DICTEE_CM2[0],
      'Fait relire le passé composé : « ils ont cherché » : avoir bloque l\'accord avec le sujet. Relie au son [e] : -é au participe (ils ont cherché), -er à l\'infinitif (ils vont chercher), -ez avec vous (vous cherchez).'),
    {
      h: '8h40-8h55', dom: 'Vocabulaire', titre: 'les mots de la mer et de l\'île : classer et trouver des familles',
      comp: 'Enrichir son lexique ; organiser les mots en réseaux et en familles (programmes 2025)',
      obj: 'Structurer les mots collectés dans Lucy Lost en quatre catégories ; relier un mot à sa famille.',
      crit: ['14 mots bien classés sur 16', '4 familles justes sur 5'],
      mat: 'Fiche « Les mots de la mer et de l\'île » ; carte du réseau commencée la semaine dernière (cahier de lexique)',
      ref: 'Picoche (réseau lexical) ; Sardier ; réseau de la période 2, semaine 2 : structuration',
      fiche: 'Tous',
      phases: [
        ['Rappel', '3 min', 'Relit la carte du réseau : « Quels mots avons-nous trouvés dans les chapitres 1 à 4 ? »', 'Citent des mots'],
        ['Recherche', '8 min', 'Accompagne les CM1 fragiles (lit les mots, un à la fois).', 'Exercices 1 à 3'],
        ['Mise en commun', '4 min', 'Ajoute les catégories et les familles sur la carte du réseau ; annonce la semaine prochaine : un mot peut avoir plusieurs sens.', 'Complètent leur carte'],
      ],
      diff: [['CM1 fragiles', 'exercice 1 seulement, mots lus par l\'adulte'], ['CM2', 'exercice 2 : ajouter un troisième mot à chaque famille']],
      corrige: ['Ex. 1 : la mer : la vague, la marée, l\'écume, le courant ; le bateau : la voile, le mât, la barque, la coque ; la pêche : le filet, le casier, l\'hameçon, le homard ; l\'île : la plage, le rocher, la crique, le phare.', 'Ex. 2 : marin → la mer ; pêcheur → la pêche ; îlot → l\'île ; vaguelette → la vague ; batelier → le bateau. CM2 (exemples) : maritime, pêcher, insulaire, voilier.'],
    },
    { h: '8h55-9h10', dom: 'Calcul mental' },
    {
      h: '9h10-9h55', dom: 'Réécriture', titre: 'réécrire le texte de lundi',
      comp: 'Réviser et améliorer son écrit en fonction des annotations (programmes 2025)',
      obj: 'Réécrire son texte de lundi en traitant les points annotés (4 au plus).',
      crit: ['chaque point annoté est traité', 'le sens choisi reste clair', 'le texte réécrit est plus long ou plus précis'],
      mat: 'Cahier de l\'écrivain annoté (codes de la classe) ; Carte d\'écrivain ; répertoires des émotions et des sens ; pas de fiche',
      ref: 'Kervyn (réécriture différée, annotations ciblées, pas de critère de langue imposé)',
      phases: [
        ['Lecture des annotations', '5 min', 'Rappelle les codes ; montre un exemple de passage amélioré (avec l\'accord de l\'élève).', 'Lisent leurs annotations'],
        ['Réécriture', '30 min', 'Conférences de 3 minutes avec les élèves qui en ont besoin.', 'Réécrivent les passages annotés'],
        ['Partage', '10 min', 'Deux élèves lisent l\'avant et l\'après d\'un passage.', 'Repèrent ce qui a changé'],
      ],
      eval: 'Évaluation continue sur le cahier de l\'écrivain : nombre de points traités.',
    },
    { h: '9h55-10h15', dom: 'Problème du jour' },
    {
      h: '10h30-11h10', dom: 'Mathématiques', titre: 'les fractions : sens, lire, écrire (entraînement et bilan)',
      comp: 'Comprendre et utiliser des fractions simples pour exprimer une partie d\'une unité partagée en parts égales ; les lire et les écrire (programmes 2025)',
      obj: 'Réinvestir seul ce qui a été construit dans la semaine : écrire la fraction d\'une figure, passer des lettres aux chiffres, représenter une fraction.',
      crit: ['13 réponses justes sur 16', 'les parts égales sont vérifiées avant de nommer une fraction'],
      mat: 'Fiches bilan CM1 et CM2 ; trace de la semaine visible ; crayons de couleur',
      ref: 'Brousseau (fractions-mesure) ; Éduscol cycle 3 : fractions simples',
      fiche: 'CM1 et CM2',
      phases: [
        ['Rappels', '8 min', 'Calcul posé : CM1 2 345 + 1 678 ; CM2 3 456 × 7. Flash géométrie : un angle projeté, aigu, droit ou obtus ? (vérifier avec le gabarit d\'angle droit)', 'Calculent, répondent'],
        ['Entraînement', '25 min', 'Commence avec les CM1 fragiles (bandes à découper, exercice 1) ; les CM2 en autonomie.', 'Fiches bilan'],
        ['Correction', '7 min', 'Corrige l\'exercice 1 collectivement (CM2 : la figure H) ; relève les élèves à reprendre lundi, avant les fractions plus grandes que 1.', 'Corrigent au vert'],
      ],
      diff: [['CM1 fragiles', 'bandes de papier et trace sous les yeux ; exercices 1 et 3'], ['Experts', 'défi : dessiner une bande et colorier 3/4, puis montrer que c\'est aussi 6/8']],
      corrige: ['Rappels : 4 023 ; 24 192.', 'CM1 et CM2, ex. 1 : A = 3/4 ; B = 1/6 ; C = 7/10 ; D = 5/8. CM2 : H n\'est pas 1/4, les 4 parts ne sont pas égales.', 'CM1, ex. 2 : 3/4 ; 2/5 ; 7/10 ; 1/2 ; cinq huitièmes ; un tiers ; quatre sixièmes. CM2, ex. 2 : 3/4 ; 2/5 ; 9/100 ; 13/100 ; cinq huitièmes ; trois centièmes ; sept douzièmes.', 'Ex. 3 : E : 2 parts sur 5 ; F : 2 parts sur 3 ; G : 9 parts sur 10.', 'CM1, ex. 4 : Lucie a mangé 3/10 de la tablette ; il reste 7/10. CM2, ex. 4 : oui, en regroupant les parts deux par deux on obtient 3 parts égales, et Tom en a colorié 2 : 4/6 = 2/3.'],
    },
    {
      h: '11h10-11h45', dom: 'Dictée bilan', titre: 'le verbe du jour, les compléments du verbe, le son [e]',
      comp: 'Orthographe grammaticale et lexicale : réinvestir les accords et les graphies de la semaine ; reconnaître les compléments du verbe',
      obj: 'Écrire sous la dictée un texte qui réunit le participe passé avec avoir, des mots en [e] et des phrases à compléments essentiels et circonstanciels ; distinguer ces compléments en relecture.',
      crit: ['ont cherché, ont entendu, a soulevé sans accord ; CM2 : est restée accordé', 'étrange, épuisée, cherché, soulevé : graphie de [e] juste', 'en relecture, les compléments que l\'on peut déplacer ou supprimer sont soulignés'],
      mat: 'Cahier du jour ; version aménagée (texte à trous) pour les élèves qui en ont besoin',
      ref: 'Dictée bilan de la classe ; manipulations syntaxiques (déplacement, suppression) : Chartrand, grammaire nouvelle',
      fiche: 'Version aménagée',
      phases: [
        ['Préparation', '5 min', 'Rappelle les outils : affiche « avoir bloque, être laisse passer », trace du son [e], affiche des compléments (« je peux le déplacer ? le supprimer ? »).', 'Relisent les affiches'],
        ['Dictée', '15 min', 'CM1 : 4 phrases ; CM2 : 5 phrases. Lit le texte entier, puis phrase par phrase, puis relecture.', 'Écrivent'],
        ['Relecture guidée', '10 min', '« Entoure les auxiliaires, vérifie les mots en [e], souligne en vert les compléments que tu peux déplacer et supprimer ; encadre le complément qu\'on ne peut pas enlever. »', 'Relisent avec les codes'],
        ['Ramassage', '5 min', 'Ramasse ; la correction se fait lundi en dictée réflexive.', ''],
      ],
      corrige: ['CM2 : ' + DICTEE_CM2.join(' '), 'CM1 : ' + DICTEE_CM1.join(' '), 'Compléments circonstanciels (déplaçables, supprimables) : Ce matin-là, près de l\'île (temps, lieu) ; Soudain, derrière les rochers (temps, lieu) ; sous une vieille couverture (lieu) ; Avec douceur (manière) ; CM2 : Le soir (temps).', 'Compléments essentiels (compléments d\'objet, ni déplaçables ni supprimables) : des homards ; un cri étrange ; l\'enfant. CM2 : « près d\'elle » après « est restée » se discute (rester près de quelqu\'un) : accepter les deux analyses si elles sont justifiées par les manipulations.', 'Points observés (10) : cherché, entendu, soulevé, (CM2) restée, étrange, épuisée, vieille, pêcheur, 2 compléments circonstanciels et 1 complément essentiel bien repérés.'],
    },
    {
      h: '11h45-12h00', dom: 'Anglais', titre: 'my family : Who\'s this? This is my…',
      comp: 'Parler en continu et réagir (CECRL A1) ; préparer la tâche finale de la période (interview d\'un camarade)',
      obj: 'Présenter un membre de sa famille avec un possessif : « This is my brother. His name is Tom. »',
      crit: ['une phrase juste avec my, his ou her'],
      mat: 'Flashcards de la famille de la classe ; pas de fiche',
      phases: [
        ['Rituel', '3 min', 'Date, météo ; rappelle mother, father, sister, brother, grandma, grandpa.', 'Répètent, montrent la flashcard'],
        ['Jeu « Who\'s this? »', '9 min', 'Montre une flashcard : « Who\'s this? » ; introduit his / her name is.', 'Répondent en binômes, puis devant la classe'],
        ['Notebook', '3 min', 'Fait écrire une phrase dans My English notebook.', 'Écrivent « This is my… »'],
      ],
    },
    O.Vendredi.seance,
    {
      h: '13h45-14h15', dom: 'Lecture à voix haute', titre: 'lire son texte réécrit',
      comp: 'Lire à voix haute un texte, pour être compris d\'un auditoire',
      obj: 'Lire son texte réécrit en rendant perceptible l\'émotion choisie.',
      crit: ['lecture fluide, volume adapté', 'l\'auditoire retrouve le sens choisi (propre ou figuré)'],
      mat: 'Cahier de l\'écrivain ; affiche des critères d\'écoute ; pas de fiche',
      phases: [
        ['Préparation', '5 min', 'Rappelle les critères : volume, pauses, regard.', 'Relisent à voix basse'],
        ['Lectures', '25 min', '6 lecteurs ; après chaque lecture : « Quel sens a-t-il choisi ? Quelle émotion ? Quel passage t\'a plu ? »', 'Lisent, écoutent, commentent'],
      ],
    },
    {
      h: '14h15-14h45', dom: 'Lecture', titre: 'Lucy Lost, chapitre pivot de la semaine : temps 4 à 6 ; commande de natures',
      comp: 'Comprendre un texte littéraire et l\'interpréter ; identifier les classes de mots',
      obj: 'Seconde partie de la séance pivot : rituels, activité de lecture selon le niveau (N1, N2, N3), écrit d\'appropriation ; commande de 5 natures.',
      crit: ['les rituels de son niveau sont justes', 'l\'activité de son niveau est réussie', 'la commande : 5 natures justes avec la page'],
      mat: 'Ton fichier NN_Lucy-Lost_chapitre.docx du chapitre pivot (dossier 2_Comprehension : rituels, activités N1, N2, N3, version enseignant) ; carnet de chasse',
      ref: 'Dossier Lucy Lost, version enseignant du chapitre : Goigoux et Cèbe (Lector & Lectrix), Giasson',
      fiche: 'Fiches du chapitre (fichier séparé de ton dossier)',
      phases: [
        ['Commande', '5 min', `Commande de 5 natures : CM1 ${COMMANDE.CM1} ; CM2 ${COMMANDE.CM2}.`, 'Cherchent dans le chapitre, notent page et critères'],
        ['Temps 4 · rituels', '7 min', 'Rituels du chapitre selon la version enseignant (N1 : relier ; N2 : passage délimité ; N3 : tout le chapitre).', 'Relèvent selon leur niveau'],
        ['Temps 5 · activités', '12 min', 'Commence avec les N1.', 'Activités N1, N2, N3 du dossier'],
        ['Temps 6 · mise en commun et écrit', '6 min', 'Synthèse ; lance l\'écrit d\'appropriation du chapitre (sujet au choix).', 'Choisissent un sujet ; l\'écrit est terminé lundi en autonomie'],
      ],
      corrige: ['Rituels, attendus des activités et critères des écrits : version enseignant du fichier du chapitre.'],
      note: 'Le dépôt n\'a pas le texte du roman : cette séance renvoie à ton dossier Lucy Lost (chapitre 3 ou 4 selon ton avancée de la semaine).',
    },
    {
      h: '14h45-15h00', dom: 'EPS', titre: 'parcours athlétique : allure régulière',
      obj: 'Courir trois tours à allure régulière : écart de moins de 5 secondes entre le tour le plus rapide et le plus lent.',
      mat: 'Plots du parcours ; chronomètre ; pas de fiche',
      phases: [['Parcours', '15 min', 'Annonce les temps de passage à chaque tour ; les binômes notent les trois temps.', 'Courent, observent leur binôme, calculent l\'écart']],
    },
    {
      h: '15h00-15h30', dom: 'Géographie', titre: 'les régions françaises : trace écrite',
      comp: 'Se repérer dans l\'espace : connaître l\'organisation du territoire français (communes, départements, régions) ; lire une carte',
      obj: 'Savoir que la France compte 18 régions, situer l\'Allier dans la région Auvergne-Rhône-Alpes et associer quelques régions à leur grande ville.',
      crit: ['trace complétée sans aide', '4 associations justes sur 6'],
      mat: 'Fiche « Ce que je retiens : les régions » ; carte officielle des régions projetée (Géoportail de l\'IGN, couche « Régions », ou carte des régions de l\'Insee) ; atlas',
      ref: 'Source à projeter : carte officielle (IGN ou Insee) ; programme d\'histoire-géographie, année B',
      fiche: 'CM1 et CM2',
      phases: [
        ['Rappel', '5 min', 'Projette la carte : « Où est Moulins ? l\'Allier ? notre région ? » Fait montrer les régions d\'outre-mer.', 'Montrent, nomment'],
        ['Trace', '15 min', 'Fait compléter les exercices 1 et 2 avec la carte, puis lire à voix haute.', 'Complètent la fiche'],
        ['Correction', '10 min', 'Corrige sur la carte projetée ; exercice 3 à l\'oral pour les CM1 fragiles.', 'Corrigent'],
      ],
      corrige: ['Ex. 1 : 18 ; 13 ; 5 ; Allier ; Auvergne-Rhône-Alpes ; Moulins ; Lyon.', 'Ex. 2 : Île-de-France – Paris ; Nouvelle-Aquitaine – Bordeaux ; Occitanie – Toulouse ; Hauts-de-France – Lille ; Bourgogne-Franche-Comté – Dijon ; Auvergne-Rhône-Alpes – Lyon.', 'Ex. 3 : Guadeloupe, Martinique, Guyane, La Réunion, Mayotte. CM2 : départements voisins de l\'Allier : Puy-de-Dôme, Creuse, Cher, Nièvre, Saône-et-Loire, Loire.'],
    },
    {
      h: '15h30-16h00', dom: 'EMC', titre: 'conseil de classe',
      comp: 'Coopérer, prendre part à la vie de la classe (conseil coopératif, Oury et Vasquez)',
      obj: 'Tenir le conseil de la semaine ; annoncer le débat de jeudi prochain sur les droits de l\'enfant (20 novembre).',
      crit: ['le conseil suit l\'ordre du jour', 'chaque rôle est tenu'],
      mat: 'Cahier du conseil ; boîte à messages',
      phases: [
        ['Conseil', '25 min', 'Ordre du jour : félicitations, critiques, propositions ; suivi des décisions de la semaine précédente.', 'Président, secrétaire et gardien du temps tiennent leur rôle'],
        ['Annonce', '5 min', '« Jeudi, nous débattrons des droits de l\'enfant. Pensez à un droit qui vous paraît le plus important. »', 'Notent l\'annonce dans l\'agenda'],
      ],
    },
  ],
  externes: [['Lecture', 'Lucy Lost, chapitre pivot de la semaine : rituels et activités N1, N2, N3 (ton dossier, 2_Comprehension)', '● ●● ●●●']],
  fiches: [
    {
      dom: 'Vocabulaire', niv: 'Tous', titre: 'Les mots de la mer et de l\'île', b: [
        { t: 'consigne', n: 1, x: 'Range chaque mot dans la bonne colonne.' },
        { t: 'texte', fill: 'FFF8E7', x: 'la vague · la voile · le filet · la plage · la marée · le mât · le casier · le rocher · l\'écume · la barque · l\'hameçon · la crique · le courant · la coque · le homard · le phare' },
        { t: 'table', head: ['La mer', 'Le bateau', 'La pêche', 'L\'île'], rows: [['', '', '', '']], h: 2200 },
        { t: 'consigne', n: 2, x: 'Relie chaque mot au mot de sa famille.' },
        { t: 'table', head: ['Mot', 'Sa famille'], w: [5100, 5100], h: 480, rows: [['marin', 'la pêche'], ['pêcheur', 'le bateau'], ['îlot', 'la mer'], ['vaguelette', 'l\'île'], ['batelier', 'la vague']] },
        { t: 'consigne', n: 3, x: 'Écris une phrase avec trois mots de la colonne de ton choix.' },
        { t: 'lignes', n: 2 },
      ],
    },
    {
      dom: 'Mathématiques', niv: 'CM1', titre: 'Bilan : les fractions', b: [
        { t: 'consigne', n: 1, x: 'Écris la fraction coloriée de chaque figure.' },
        { t: 'img', src: IMG('frac_AB.png'), w: 470, h: 94 },
        { t: 'img', src: IMG('frac_CD.png'), w: 470, h: 94 },
        { t: 'p', x: 'A = ………     B = ………     C = ………     D = ………' },
        { t: 'consigne', n: 2, x: 'Écris en chiffres, puis en lettres.' },
        { t: 'p', x: ['trois quarts = ………     deux cinquièmes = ………', 'sept dixièmes = ………     un demi = ………', '5/8 = ……………………………', '1/3 = ……………………………', '4/6 = ……………………………'] },
        { t: 'consigne', n: 3, x: 'Colorie : 2/5 de la bande E, 2/3 de la bande F, 9/10 de la bande G.' },
        { t: 'img', src: IMG('frac_vides.png'), w: 290, h: 206 },
        { t: 'consigne', n: 4, x: 'Une tablette de chocolat a 10 carrés. Lucie mange 3 carrés. Quelle fraction de la tablette a-t-elle mangée ? Quelle fraction reste-t-il ?' },
        { t: 'lignes', n: 2 },
      ],
    },
    {
      dom: 'Mathématiques', niv: 'CM2', titre: 'Bilan : les fractions', b: [
        { t: 'consigne', n: 1, x: 'Écris la fraction coloriée de chaque figure.' },
        { t: 'img', src: IMG('frac_AB.png'), w: 420, h: 84 },
        { t: 'img', src: IMG('frac_CD.png'), w: 420, h: 84 },
        { t: 'p', x: 'A = ………     B = ………     C = ………     D = ………' },
        { t: 'p', x: 'La partie coloriée de H est-elle 1/4 de la bande ? Explique.' },
        { t: 'img', src: IMG('frac_piege.png'), w: 340, h: 82 },
        { t: 'p', x: '…………………………………………………………………………………………………………' },
        { t: 'consigne', n: 2, x: 'Écris en chiffres, puis en lettres.' },
        { t: 'p', x: ['trois quarts = ………     deux cinquièmes = ………', 'neuf centièmes = ………     treize centièmes = ………', '5/8 = ……………………………', '3/100 = ……………………………', '7/12 = ……………………………'] },
        { t: 'consigne', n: 3, x: 'Colorie : 2/5 de la bande E, 2/3 de la bande F, 9/10 de la bande G.' },
        { t: 'img', src: IMG('frac_vides.png'), w: 240, h: 170 },
        { t: 'consigne', n: 4, x: 'Une bande est partagée en 6 parts égales. Tom en colorie 4. Sa sœur dit : « Tom a colorié les 2/3 de la bande. » A-t-elle raison ? Explique avec un dessin.' },
        { t: 'lignes', n: 1 },
      ],
    },
    {
      dom: 'Dictée bilan', niv: 'Version aménagée', n1: true, titre: 'Dictée bilan', b: [
        { t: 'p', x: 'J\'écoute la dictée. Je complète les mots.' },
        { t: 'texte', fill: 'FFF8E7', x: ['Ce matin-là, Alfie et son père ont cherch………… des homards près de l\'île.', 'Soudain, ils ont entend………… un cri étrang………… derrière les rochers.', 'Une fillette épuis………… dormait sous une vieille couverture.', 'Avec douceur, le pêcheur a soulev………… l\'enfant.'] },
        { t: 'consigne', n: 1, x: 'J\'entoure les auxiliaires avoir.' },
        { t: 'consigne', n: 2, x: 'Je souligne en vert les groupes que je peux déplacer.' },
      ],
    },
    ...O.Vendredi.fiches,
    {
      dom: 'Géographie', niv: 'CM1 et CM2', titre: 'Ce que je retiens : les régions françaises', b: [
        { t: 'consigne', n: 1, x: 'Complète avec : 18 · 13 · 5 · Allier · Auvergne-Rhône-Alpes · Moulins · Lyon' },
        { t: 'texte', x: 'La France compte ……… régions : ……… en métropole et ……… en outre-mer. Notre département, l\'……………… , se trouve dans la région ……………………………………… . La préfecture de notre département est ……………… ; la grande ville de notre région est ……………… .' },
        { t: 'consigne', n: 2, x: 'Relie chaque région à sa grande ville.' },
        { t: 'table', head: ['Région', 'Grande ville'], w: [5100, 5100], h: 480, rows: [['Île-de-France', 'Toulouse'], ['Nouvelle-Aquitaine', 'Lyon'], ['Occitanie', 'Paris'], ['Hauts-de-France', 'Dijon'], ['Bourgogne-Franche-Comté', 'Bordeaux'], ['Auvergne-Rhône-Alpes', 'Lille']] },
        { t: 'consigne', n: 3, x: 'Écris le nom des 5 régions d\'outre-mer. CM2 : cite 3 départements voisins de l\'Allier.' },
        { t: 'lignes', n: 3 },
      ],
    },
  ],
};
