// P2 S2 (9-13 novembre 2026) : semaine antérieure à la mise en route du cahier journal ; seul le vendredi est produit.
module.exports = {
  periode: 2, semaine: 2,
  generateurs: { dir: require('path').join(__dirname, '..', '..', 'gen', 'p2s2'), tables: { Vendredi: '7 et 8' } },
  dates: '9-13 novembre 2026', dossier: 'Periode_2/Semaine_02_9-13_novembre',
  days: [require('./vendredi')],
};
