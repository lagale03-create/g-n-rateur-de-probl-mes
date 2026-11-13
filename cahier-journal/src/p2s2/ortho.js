// Orthographe lexicale P2 S2 : le son [e] (fiche 6 : é, ée, et, er, ez). Seul le vendredi (4/4) est produit ici.
const COMP = 'Orthographe lexicale : correspondances phonème-graphèmes, régularités de position ; homophones verbaux en [e] (programme cycle 3)';
const REF = 'Démarche inductive en orthographe (Brissaud et Cogis : observer, classer, formuler, éprouver) ; Catach (graphèmes et valeurs de position)';
const DIX = ['la marée', 'le rocher', 'l\'été', 'le nez', 'la journée', 'le métier', 'dehors', 'partout', 'la région', 'une fraction'];
const DIX_CM2 = ['ailleurs', 'autour'];
module.exports = {
  son: '[e]', fiche: 6, DIX, DIX_CM2,
  Vendredi: {
    seance: {
      h: '13h30-13h45', dom: 'Orthographe', titre: 'le son [e] (4/4) : entraînement et dictée des dix mots',
      comp: COMP, obj: 'Choisir la bonne graphie de [e] (é, ée, er, ez, et) en s\'appuyant sur la trace ; choisir é, er ou ez à la fin d\'un verbe ; écrire les dix mots de la semaine.',
      crit: ['10 graphies justes sur 12 à l\'exercice 1', '4 verbes justes sur 5 à l\'exercice 2', '8 mots justes sur 10 à la dictée (CM2 : 10 sur 12)'],
      mat: 'Fiche « Le son [e] : je m\'entraîne » ; trace écrite du son [e] ; répertoire orthographique', ref: REF, fiche: 'Tous',
      phases: [
        ['Exercices', '7 min', 'Laisse la trace visible ; aide les CM1 fragiles sur l\'exercice 1 ; exercice 2 : « Remplace par vendre ou vendu : vous vendez → -ez ; il va vendre → -er ; elle a vendu → -é. »', 'Exercices 1 à 3'],
        ['Copie flash', '2 min', 'Montre 5 s un des dix mots, le cache : on l\'écrit de mémoire (2 mots).', 'Écrivent, vérifient'],
        ['Dictée des dix mots', '5 min', `Dicte : ${DIX.join(', ')} ; CM2 : + ${DIX_CM2.join(', ')}. Élèves fragiles : les 6 premiers.`, 'Écrivent, vérifient avec la trace'],
        ['Bilan', '1 min', 'Les mots ratés vont dans la liste personnelle.', 'Notent leurs mots à revoir'],
      ],
      diff: [['CM1 fragiles', 'exercice 1 avec deux choix proposés ; dictée des 6 premiers mots'], ['CM2', 'exercice 2 : justifier chaque choix par le remplacement (vendre, vendu, vendez)']],
      corrige: ['Ex. 1 : le rocher, la marée, le nez, le blé, l\'année, le boulanger, assez, la clé, la fusée, le dîner, chez, le cahier.', 'Ex. 2 : vous chantez ; il va chanter ; elle a chanté ; nous allons pêcher ; avez-vous pêché ?', 'Ex. 3 : la mer (er se lit [ɛʁ]) ; le gaz (on entend [a]) ; elle (e sans accent devant deux consonnes : [ɛ]).'],
      note: 'Si ta liste des dix mots de lundi diffère, dicte la tienne : la fiche laisse la dictée sur lignes vides.',
    },
    fiches: [{ dom: 'Orthographe', niv: 'Tous', titre: 'Le son [e] : je m\'entraîne', b: [
      { t: 'consigne', n: 1, x: 'Complète avec é, ée, er ou ez.' },
      { t: 'calc', cols: 3, x: ['le roch……', 'la mar……', 'le n……', 'le bl……', 'l\'ann……', 'le boulang……', 'ass……', 'la cl……', 'la fus……', 'le dîn……', 'ch……', 'le cahi……'] },
      { t: 'consigne', n: 2, x: 'Complète la fin du verbe avec é, er ou ez.' },
      { t: 'p', x: ['Vous chant…… .', 'Il va chant…… .', 'Elle a chant…… .', 'Nous allons pêch…… .', 'Avez-vous pêch…… ?'] },
      { t: 'consigne', n: 3, x: 'Barre l\'intrus : le mot où l\'on n\'entend pas [e].' },
      { t: 'p', x: ['le rocher – la mer – le boulanger – le dîner', 'le nez – assez – chez – le gaz', 'le blé – la clé – le thé – elle'] },
      { t: 'consigne', n: 4, x: 'Dictée des dix mots.' },
      { t: 'lignes', n: 5 },
    ] }],
  },
};
