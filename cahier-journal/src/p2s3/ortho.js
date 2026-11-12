// Orthographe lexicale : le son [ɛ] (fiche 7 de la progression : ai, ait, ais, ei, …er)
// Séquence en 4 temps : repérage, régularités et trace, mise à l'épreuve et ajustement, entraînement.
const LISTE = ['la laine', 'le pain', 'jamais', 'manger', 'la neige', 'l\'ail', 'la mer', 'il parlait', 'plein', 'une aile',
  'le maïs', 'seize', 'du lait', 'la main', 'l\'hiver', 'la fontaine', 'parler', 'la baleine', 'un marais', 'la paille',
  'maigre', 'la faim', 'une reine', 'épais', 'le boulanger', 'la craie', 'naïf', 'un souhait', 'la peinture', 'le fer'];
const COMP = 'Orthographe lexicale : correspondances phonème-graphèmes, régularités de position (programme cycle 3)';
const REF = 'Démarche inductive en orthographe (Brissaud et Cogis : observer, classer, formuler, éprouver) ; Catach (graphèmes et valeurs de position)';

module.exports = {
  son: '[ɛ]', fiche: 7,
  Lundi: {
    avant: 'Histoire',
    seance: {
      h: '14h45-15h00', dom: 'Orthographe', titre: 'le son [ɛ] (1/4) : repérer les graphèmes',
      comp: COMP, obj: 'Trier une liste de mots : ceux où l\'on entend [ɛ] et ceux qui contiennent les mêmes lettres sans faire ce son ; colorier le graphème.',
      crit: ['les 18 mots en [ɛ] sont trouvés', 'les 12 intrus sont barrés', 'le graphème est colorié en entier (ait, pas seulement ai)'],
      mat: 'Fiche « Le son [ɛ] : je repère » ; crayons de couleur ; liste agrandie au tableau', ref: REF, fiche: 'Tous',
      phases: [
        ['Écoute', '3 min', 'Lit la liste lentement, une fois, en articulant.', 'Lèvent la main quand ils entendent [ɛ]'],
        ['Tri individuel', '7 min', 'Consigne : « Entoure si tu entends [ɛ], barre si la lettre est là mais pas le son. » Aide les CM1 fragiles en relisant à voix basse.', 'Trient, colorient le graphème'],
        ['Mise en commun', '5 min', 'Corrige les intrus seulement : « Pourquoi pain n\'est-il pas dans la famille ? » Garde les autres questions pour demain.', 'Justifient à l\'oral'],
      ],
      diff: [['CM1 fragiles', 'liste lue par un camarade tuteur ; 20 premiers mots seulement'], ['CM2', 'classer aussi les intrus selon le son entendu']],
      corrige: ['[ɛ] (18) : laine, aile, fontaine, maigre, craie (ai) ; parlait, lait, souhait (ait) ; jamais, marais, épais (ais) ; neige, seize, baleine, reine (ei) ; mer, hiver, fer (er).', 'Intrus (12) : pain, main, faim (ain, aim = [ɛ̃]) ; plein, peinture (ein = [ɛ̃]) ; manger, parler, boulanger (er = [e]) ; ail, paille (ail, aille = [aj]) ; maïs, naïf (ï : on sépare a-ï).'],
    },
    fiches: [{ dom: 'Orthographe', niv: 'Tous', titre: 'Le son [ɛ] : je repère', b: [
      { t: 'consigne', n: 1, x: 'Lis chaque mot à voix basse. Entoure le mot si tu entends [ɛ] (comme dans « lait »). Barre-le si tu n\'entends pas [ɛ].' },
      { t: 'calc', cols: 3, x: LISTE.map((m, i) => `${i + 1}. ${m}`) },
      { t: 'consigne', n: 2, x: 'Dans les mots entourés, colorie les lettres qui font le son [ɛ].' },
      { t: 'consigne', n: 3, x: 'Range les mots entourés selon leur écriture du son [ɛ].' },
      { t: 'table', head: ['ai', 'ait', 'ais', 'ei', 'er'], rows: [['', '', '', '', '']], h: 2600 },
    ] }],
  },
  Mardi: {
    avant: 'EPS',
    seance: {
      h: '13h30-13h50', dom: 'Orthographe', titre: 'le son [ɛ] (2/4) : régularités et première trace',
      comp: COMP, obj: 'Observer où se place chaque graphème dans le mot et expliquer les intrus ; écrire une première trace écrite.',
      crit: ['une régularité de position est formulée pour chaque graphème', 'les trois sortes d\'intrus sont expliquées'],
      mat: 'Fiche « Le son [ɛ] : je cherche des régularités » ; tableau de lundi corrigé au tableau', ref: REF, fiche: 'Tous',
      phases: [
        ['Rappel', '3 min', 'Affiche le tableau de classement corrigé.', 'Vérifient leur tableau de lundi'],
        ['Recherche en binômes', '7 min', 'Distribue la fiche : « Où se trouve chaque graphème ? Que remarques-tu pour les intrus ? »', 'Répondent aux questions guidées'],
        ['Mise en commun', '6 min', 'Recueille les remarques, reformule, garde les désaccords en suspens.', 'Proposent, contestent avec des exemples'],
        ['Trace écrite', '4 min', 'Écrit la première version au tableau, en précisant qu\'elle sera mise à l\'épreuve jeudi.', 'Complètent la trace sur la fiche'],
      ],
      diff: [['CM1', 'questions 1 à 4'], ['CM2', 'question 5 : trouver un mot de la même famille qui fait entendre la lettre muette (lait → laitier, épais → épaisse)']],
      trace: ['Le son [ɛ] peut s\'écrire : ai au début ou au milieu du mot (une aile, la laine) ; ait ou ais à la fin du mot (du lait, jamais), avec une lettre muette ; ei au milieu du mot, souvent devant n, ge ou z (la reine, la neige, seize) ; er quand on entend le r (la mer, l\'hiver).', 'Attention : ain, aim, ein font [ɛ̃] (le pain, la faim, plein) ; ail, aille font [aj] (l\'ail, la paille) ; avec un tréma, on sépare : maïs ; à la fin des verbes, er fait [e] (manger).'],
      corrige: ['1. ai : début ou milieu (aile, laine, fontaine, maigre) ; à la fin seulement suivi de e (craie). 2. ait, ais : toujours à la fin. 3. ei : au milieu, devant n, ge, z. 4. er : on entend le r. 5. Intrus : ai/ei + n ou m → [ɛ̃] ; ail, aille → [aj] ; ï → on sépare ; er des verbes → [e].'],
    },
    fiches: [{ dom: 'Orthographe', niv: 'Tous', titre: 'Le son [ɛ] : je cherche des régularités', b: [
      { t: 'consigne', n: 1, x: 'Regarde les mots en ai. Le son est-il au début, au milieu ou à la fin du mot ?' },
      { t: 'lignes', n: 1 },
      { t: 'consigne', n: 2, x: 'Et pour ait et ais ? Quelle lettre ne s\'entend pas ?' },
      { t: 'lignes', n: 1 },
      { t: 'consigne', n: 3, x: 'Les mots en ei : quelles lettres viennent juste après ei ?' },
      { t: 'lignes', n: 1 },
      { t: 'consigne', n: 4, x: 'Pourquoi « la mer » est-il dans la famille, mais pas « manger » ?' },
      { t: 'lignes', n: 1 },
      { t: 'consigne', n: 5, x: 'Les intrus : explique pourquoi on n\'entend pas [ɛ] dans le pain, l\'ail, le maïs. CM2 : trouve un mot de la famille de « lait » et de « épais » où l\'on entend la lettre muette.' },
      { t: 'lignes', n: 2 },
      { t: 'consigne', x: 'Ma trace écrite (première version)' },
      { t: 'texte', x: ['Le son [ɛ] peut s\'écrire :', '• ……… au début ou au milieu du mot : une aile, la laine', '• ……… ou ……… à la fin du mot, avec une lettre muette : du lait, jamais', '• ……… au milieu du mot, devant n, ge ou z : la reine, la neige, seize', '• ……… quand on entend le r : la mer, l\'hiver', 'Attention : ain, aim, ein font [ɛ̃] ; ail fait [aj] ; à la fin des verbes, er fait [e].'], fill: 'FFF8E7' },
    ] }],
  },
  Jeudi: {
    avant: 'Éducation musicale',
    seance: {
      h: '14h45-15h00', dom: 'Orthographe', titre: 'le son [ɛ] (3/4) : mettre la trace à l\'épreuve',
      comp: COMP, obj: 'Utiliser la trace écrite pour prévoir comment se lisent de nouveaux mots ; repérer les mots qu\'elle n\'explique pas et l\'ajuster.',
      crit: ['chaque mot est classé avec la règle qui le justifie', 'au moins un ajustement de la trace est proposé'],
      mat: 'Fiche « Le son [ɛ] : ma trace résiste-t-elle ? » ; trace de mardi', ref: REF, fiche: 'Tous',
      phases: [
        ['Consigne', '2 min', '« Notre trace marche-t-elle avec d\'autres mots ? »', ''],
        ['Mise à l\'épreuve', '7 min', 'Circule ; repère les élèves qui hésitent sur balai, rocher, cahier et sur fête, mère.', 'Classent les 16 mots, cochent la règle utilisée'],
        ['Ajustement', '6 min', 'Fait émerger : er en fin de nom fait souvent [e] (rocher) ; è et ê écrivent aussi [ɛ] (étudiés la semaine prochaine). Corrige la trace au tableau.', 'Complètent la trace ajustée'],
      ],
      diff: [['CM1 fragiles', 'mots lus par l\'enseignant ; 10 premiers mots'], ['CM2', 'chercher un autre mot qui contredit la trace']],
      trace: ['Ajouts à la trace : « ai peut aussi se trouver à la fin du mot (un balai). » « er à la fin d\'un mot fait souvent [e] (le rocher, le cahier, manger) ; on entend [ɛʀ] dans quelques mots courts : la mer, le fer, cher, l\'hiver, le désert. » « Le son [ɛ] s\'écrit aussi è et ê (la mère, la fête) : la suite la semaine prochaine. »'],
      corrige: ['Expliqués par la trace : semaine, éclair (ai) ; palais, il venait (ais, ait) ; peine (ei) ; désert (er avec r entendu) ; intrus prévus : bain, frein ([ɛ̃]), éventail ([aj]).', 'Non expliqués → ajustement : balai (ai à la fin du mot, sans e) ; rocher, cahier (er = [e] sans être un verbe) ; fête, mère, forêt, très (è, ê).'],
    },
    fiches: [{ dom: 'Orthographe', niv: 'Tous', titre: 'Le son [ɛ] : ma trace résiste-t-elle ?', b: [
      { t: 'consigne', n: 1, x: 'Pour chaque mot : entend-on [ɛ] ? Quelle partie de la trace l\'explique ? Si la trace n\'explique pas le mot, mets un point d\'interrogation.' },
      { t: 'table', head: ['Mot', 'J\'entends [ɛ] ?', 'Ce que dit la trace'], rows: ['la semaine', 'le bain', 'un balai', 'le palais', 'le rocher', 'il venait', 'la peine', 'le frein', 'le désert', 'la fête', 'un éclair', 'l\'éventail', 'le cahier', 'la mère', 'la forêt', 'très'].map(m => [m, '', '']), w: [2800, 2200, 5200], h: 420 },
      { t: 'consigne', n: 2, x: 'Quels mots la trace n\'explique-t-elle pas ? Que faut-il ajouter ?' },
      { t: 'lignes', n: 3 },
    ] }],
  },
  Vendredi: {
    avant: 'Histoire',
    seance: {
      h: '14h45-15h00', dom: 'Orthographe', titre: 'le son [ɛ] (4/4) : entraînement',
      comp: COMP, obj: 'Choisir la bonne graphie de [ɛ] en s\'appuyant sur la trace ; écrire sous la dictée des mots de la semaine.',
      crit: ['8 graphies justes sur 10 à l\'exercice 1', '6 mots justes sur 8 à la dictée'],
      mat: 'Fiche « Le son [ɛ] : je m\'entraîne » ; trace écrite ajustée', ref: REF, fiche: 'Tous',
      phases: [
        ['Exercices', '8 min', 'Laisse la trace visible ; aide les CM1 fragiles sur l\'exercice 1.', 'Exercices 1 à 3'],
        ['Dictée de mots', '5 min', 'Dicte : la semaine, jamais, la neige, un éclair, il venait, épais, la mer, la baleine.', 'Écrivent, puis vérifient avec la trace'],
        ['Bilan', '2 min', '« Quelle graphie te pose encore problème ? » Note les mots à revoir en dictée réflexive la semaine prochaine.', 'Le disent'],
      ],
      diff: [['CM1 fragiles', 'exercice 1 avec deux choix proposés'], ['CM2', 'exercice 2 : justifier ait ou ais par un mot de la famille ou par la conjugaison']],
      corrige: ['Ex. 1 : baignoire, peine, vert, éclair, neige, maison, dessert, semaine, treize, hiver. Ex. 2 : lait, je chantais, il dormait, balai, jamais, palais, souhait, épais. Ex. 3 : le pain ; le boulanger ; la paille.'],
    },
    fiches: [{ dom: 'Orthographe', niv: 'Tous', titre: 'Le son [ɛ] : je m\'entraîne', b: [
      { t: 'consigne', n: 1, x: 'Complète avec ai, ei ou er.' },
      { t: 'calc', cols: 2, x: ['une b……gnoire', 'la p……ne', 'le v……t', 'un écl……r', 'la n……ge', 'la m……son', 'le dess……t', 'la sem……ne', 'tr……ze', 'l\'hiv……'] },
      { t: 'consigne', n: 2, x: 'Complète la fin du mot avec ai, ait ou ais.' },
      { t: 'calc', cols: 2, x: ['du l……', 'je chant……', 'il dorm……', 'un bal……', 'jam……', 'le pal……', 'un souh……', 'ép……'] },
      { t: 'consigne', n: 3, x: 'Barre l\'intrus : le mot où l\'on n\'entend pas [ɛ].' },
      { t: 'p', x: ['la laine – le pain – la reine – seize', 'la mer – le boulanger – l\'hiver – le fer', 'la paille – la craie – la fontaine – maigre'] },
      { t: 'consigne', n: 4, x: 'Dictée de mots.' },
      { t: 'lignes', n: 4 },
    ] }],
  },
};
