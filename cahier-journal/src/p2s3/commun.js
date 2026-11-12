// Éléments communs de la semaine P2 S3 (16-20 novembre) : verbe du jour, chasse au mot, dictées.
const path = require('path');
const IMG = f => path.join(__dirname, '..', '..', 'img', f);
const PRON = ['je', 'tu', 'il, elle', 'nous', 'vous', 'ils, elles'];

// Conjugaison d'un verbe régulier en -er aux cinq temps du rituel
function verbeEr(inf, aux) {
  const r = inf.slice(0, -2); const j = s => (/^[aeéiouyh]/.test(s) ? "j'" : 'je ') + s;
  const voy = /^[aeéiouyh]/.test(r);
  const pp = r + 'é';
  const pc = aux === 'être'
    ? ['je suis ' + pp + '(e)', 'tu es ' + pp + '(e)', 'il est ' + pp + ', elle est ' + pp + 'e', 'nous sommes ' + pp + '(e)s', 'vous êtes ' + pp + '(e)s', 'ils sont ' + pp + 's, elles sont ' + pp + 'es']
    : ["j'ai " + pp, 'tu as ' + pp, 'il a ' + pp, 'nous avons ' + pp, 'vous avez ' + pp, 'ils ont ' + pp];
  const t = (term, base = r) => [voy ? j(base + term[0]) : 'je ' + base + term[0], ...['tu', 'il', 'nous', 'vous', 'ils'].map((p, i) => p + ' ' + base + term[i + 1])];
  return {
    inf, aux,
    reperes: `présent, colonne -er (-e, -es, -e) ; imparfait, radical ${r}- + -ais… ; futur, infinitif ${inf} + -ai… ; passé composé, ${aux} + participe en -é${aux === 'être' ? ' (être laisse passer l\'accord)' : ' (avoir bloque l\'accord)'} ; passé simple, colonne -er (-ai, -as, -a, -âmes, -âtes, -èrent).`,
    'Présent': t(['e', 'es', 'e', 'ons', 'ez', 'ent']),
    'Imparfait': t(['ais', 'ais', 'ait', 'ions', 'iez', 'aient']),
    'Futur': t(['ai', 'as', 'a', 'ons', 'ez', 'ont'], inf),
    'Passé composé': pc,
    'Passé simple': t(['ai', 'as', 'a', 'âmes', 'âtes', 'èrent']),
  };
}
const VENIR = {
  inf: 'venir', aux: 'être',
  reperes: 'présent, colonne « tous les autres » (-s, -s, -t), radical qui change (vien- / ven- / vienn-) ; imparfait, radical ven- + -ais… ; futur, radical viendr- (cas particulier, période 5) ; passé composé, être + participe en -u (être laisse passer l\'accord) ; passé simple, colonne (in) comme tenir : -ins, -ins, -int, -înmes, -întes, -inrent.',
  'Présent': ['je viens', 'tu viens', 'il vient', 'nous venons', 'vous venez', 'ils viennent'],
  'Imparfait': ['je venais', 'tu venais', 'il venait', 'nous venions', 'vous veniez', 'ils venaient'],
  'Futur': ['je viendrai', 'tu viendras', 'il viendra', 'nous viendrons', 'vous viendrez', 'ils viendront'],
  'Passé composé': ['je suis venu(e)', 'tu es venu(e)', 'il est venu, elle est venue', 'nous sommes venu(e)s', 'vous êtes venu(e)s', 'ils sont venus, elles sont venues'],
  'Passé simple': ['je vins', 'tu vins', 'il vint', 'nous vînmes', 'vous vîntes', 'ils vinrent'],
};
const TEMPS = ['Présent', 'Imparfait', 'Futur', 'Passé composé', 'Passé simple'];

function verbeDuJour(v, phrase, focus) {
  return {
    h: '8h30-8h40', dom: 'Conjugaison', titre: `verbe du jour : ${v.inf}`,
    comp: 'Maîtriser la morphologie verbale écrite ; identifier le verbe et son infinitif (programmes 2025)',
    obj: `Conjuguer ${v.inf} à toutes les personnes du présent, de l'imparfait, du futur, du passé composé et du passé simple ; repérer ce qui ne change pas et ce qui change.`,
    crit: ['les terminaisons des temps déjà étudiés (imparfait, futur, présent) sont justes', `au passé composé, l'auxiliaire ${v.aux} est repéré${v.aux === 'être' ? ' et le participe s\'accorde avec le sujet' : ' et le participe ne s\'accorde pas avec le sujet'}`],
    mat: 'Support du verbe du jour de la classe (ardoise ou fiche selon le jour) ; affichage des corpus de conjugaison',
    ref: 'Gourdet (plus grande récurrence) ; tableaux de conjugaison de la classe : la correction alimente le corpus',
    phases: [
      ['Lancement', '1 min', `Écrit l'infinitif ${v.inf}, tiré de la phrase de dictée : « ${phrase} »`, 'Lisent, repèrent le verbe dans la phrase'],
      ['Conjugaison', '6 min', 'Laisse chercher, même pour les temps non étudiés (passé simple, temps composés) : on essaie, on comparera.', 'Conjuguent sur le support'],
      ['Correction', '3 min', focus, 'Corrigent au vert ; la correction reste en classe'],
    ],
    corrige: [...TEMPS.map(t => `**${t}** : ${v[t].join(', ')}.`), `**Repères dans nos tableaux** : ${v.reperes}`],
    note: 'Le verbe est ajouté à la liste de la période (récapitulatif à coller dans le cahier en fin de période).',
  };
}

// Chasse au mot : consignes du jour (2 min en début de lecture) et commande du vendredi
const CHASSE = {
  Lundi: { CM1: 'un nom féminin au pluriel', CM2: 'un adjectif au féminin pluriel' },
  Mardi: { CM1: 'un déterminant possessif', CM2: 'un complément du nom introduit par « de »' },
  Jeudi: { CM1: 'un adjectif au masculin singulier', CM2: 'un déterminant démonstratif suivi d\'un nom' },
  Vendredi: {
    CM1: 'commande : un nom propre, un déterminant indéfini, un adjectif, un verbe conjugué, un pronom personnel sujet',
    CM2: 'commande : un nom propre, un déterminant possessif pluriel, un adjectif placé avant le nom, un verbe au passé simple, une préposition',
  },
};
function chasse(jour) {
  const c = CHASSE[jour];
  return `Chasse au mot (2 min, carnet de chasse) : CM1 ${c.CM1} ; CM2 ${c.CM2}.`;
}
const carnet = {
  dom: 'Lecture', niv: 'CM1 et CM2', titre: 'Mon carnet de chasse · semaine du 16 novembre', b: [
    { t: 'p', x: 'Chaque jour, je cherche dans le livre le mot demandé. J\'écris le mot, la page, et pourquoi je l\'ai choisi (mes critères).' },
    { t: 'table', head: ['Jour', 'Ce que je cherche', 'Mot trouvé', 'Page', 'Mes critères de choix'], w: [1300, 2900, 2000, 900, 3100], h: 900, rows: [
      ['Lundi', 'CM1 : un nom féminin pluriel\nCM2 : un adjectif féminin pluriel', '', '', ''],
      ['Mardi', 'CM1 : un déterminant possessif\nCM2 : un complément du nom avec « de »', '', '', ''],
      ['Jeudi', 'CM1 : un adjectif masculin singulier\nCM2 : un déterminant démonstratif + nom', '', '', ''],
    ].map(r => [r[0], r[1].split('\n').join(' · '), '', '', '']) },
    { t: 'consigne', x: 'Vendredi : la commande (5 minutes, 5 natures différentes)' },
    { t: 'table', head: ['CM1', 'CM2', 'Mot trouvé', 'Page', 'Mes critères'], w: [2300, 2700, 2000, 900, 2300], h: 620, rows: [
      ['un nom propre', 'un nom propre', '', '', ''],
      ['un déterminant indéfini', 'un déterminant possessif pluriel', '', '', ''],
      ['un adjectif', 'un adjectif placé avant le nom', '', '', ''],
      ['un verbe conjugué', 'un verbe au passé simple', '', '', ''],
      ['un pronom personnel sujet', 'une préposition', '', '', ''],
    ] },
  ],
};

module.exports = { IMG, verbeEr, VENIR, verbeDuJour, chasse, carnet, CHASSE };
