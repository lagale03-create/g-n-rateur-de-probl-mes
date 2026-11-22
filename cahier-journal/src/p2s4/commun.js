// Éléments communs de la semaine P2 S4 (23-27 novembre) : verbes du jour, chasse au mot (chapitre 10 : journal du docteur Crow).
// Les fonctions de conjugaison et de séance viennent de la semaine modèle p2s3.
const base = require('../p2s3/commun');
const { verbeEr } = base;

// Verbes du jour : tirés des phrases de dictée réflexive (annee/dictees.py, S11) ; tous du 1er groupe
const SOIGNER = verbeEr('soigner', 'avoir');
const RESTER = verbeEr('rester', 'être');
const FETER = verbeEr('fêter', 'avoir');
const JOUER = verbeEr('jouer', 'avoir');
const PHRASES = {
  Lundi: 'Le docteur a soigné la jeune fille.',
  Mardi: 'Les femmes de l\'île sont restées près de la grève.',
  Jeudi: 'Mon père fête son anniversaire dans la forêt.',
  Vendredi: 'Lucy a joué une belle mélodie au piano.',
};
const PIEGES = {
  soigner: '⚠ gn garde sa place partout ; imparfait « nous soignions, vous soigniez » (gn + i) ; avoir : « a soigné » sans accord',
  rester: '⚠ passé composé avec être : « elles sont restées » s\'accorde avec le sujet',
  fêter: '⚠ ê à toutes les formes (lien avec le son de la semaine) ; futur « fêterai » ; avoir : pas d\'accord',
  jouer: '⚠ futur « jouerai » : le e de l\'infinitif reste, muet ; imparfait « nous jouions » (deux i qui se suivent à l\'oral comme à l\'écrit)',
};

// Chasse au mot (2 min) : natures de P2 (déterminants, nom, adjectif ; CM2 : préposition du complément du nom)
const CHASSE = {
  Lundi: { CM1: 'un déterminant démonstratif', CM2: 'un complément du nom introduit par « à »' },
  Mardi: { CM1: 'un adjectif au féminin singulier', CM2: 'une préposition autre que « de »' },
  Jeudi: { CM1: 'un nom masculin pluriel', CM2: 'un adjectif placé avant le nom' },
  Vendredi: {
    CM1: 'commande : un nom commun, un article défini, un déterminant possessif, un adjectif, un verbe conjugué',
    CM2: 'commande : un nom propre, un déterminant démonstratif, un complément du nom, une préposition, un verbe au passé composé',
  },
};
function chasse(jour) {
  const c = CHASSE[jour];
  return `Chasse au mot (2 min, carnet de chasse) : CM1 ${c.CM1} ; CM2 ${c.CM2}.`;
}
const carnet = {
  dom: 'Lecture', niv: 'CM1 et CM2', titre: 'Mon carnet de chasse · semaine du 23 novembre', b: [
    { t: 'p', x: 'Chaque jour, je cherche dans le chapitre 10 le mot demandé. J\'écris le mot, la page, et pourquoi je l\'ai choisi (mes critères).' },
    { t: 'table', head: ['Jour', 'Ce que je cherche', 'Mot trouvé', 'Page', 'Mes critères de choix'], w: [1300, 2900, 2000, 900, 3100], h: 900, rows:
      ['Lundi', 'Mardi', 'Jeudi'].map(j => [j, `CM1 : ${CHASSE[j].CM1} · CM2 : ${CHASSE[j].CM2}`, '', '', '']) },
    { t: 'consigne', x: 'Vendredi : la commande (5 minutes, 5 natures différentes)' },
    { t: 'table', head: ['CM1', 'CM2', 'Mot trouvé', 'Page', 'Mes critères'], w: [2300, 2700, 2000, 900, 2300], h: 620, rows: [
      ['un nom commun', 'un nom propre', '', '', ''],
      ['un article défini', 'un déterminant démonstratif', '', '', ''],
      ['un déterminant possessif', 'un complément du nom', '', '', ''],
      ['un adjectif', 'une préposition', '', '', ''],
      ['un verbe conjugué', 'un verbe au passé composé', '', '', ''],
    ] },
  ],
};

module.exports = { ...base, SOIGNER, RESTER, FETER, JOUER, PHRASES, PIEGES, chasse, carnet, CHASSE };
