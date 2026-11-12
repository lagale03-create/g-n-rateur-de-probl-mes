// Progression annuelle des sons (fiches 1 à 25 du support de Pierre) répartie sur 36 semaines.
// Semaine n de l'année = même numérotation que le générateur de problèmes (P1 = S1-7, P2 = S8-14, …).
const S = (fiche, son, graphies) => ({ fiche, son, graphies });
const F = {
  1: S(1, '[i]', 'i, y, î, ï'), 2: S(2, '[o]', 'o, au, eau, ô'), 3: S(3, '[u] [y]', 'ou, où, oû ; u, û'), 4: S(4, '[a]', 'a, à, â'),
  5: S(5, '[ø] [œ]', 'eu, œu, e'), 6: S(6, '[e]', 'é, ée, et, er, ez'), 7: S(7, '[ɛ]', 'ai, ait, ais, ei, (…)er'), 8: S(8, '[ɛ] 3e fiche', 'è, ê, e devant deux consonnes, et'),
  9: S(9, '[ɑ̃] 1', 'an, am'), 10: S(10, '[ɑ̃] 2', 'en, em'), 11: S(11, '[ɔ̃] [ɛ̃] [œ̃]', 'on, om ; in, im, ain, ein, un, um'), 12: S(12, '[j]', 'y, ill, il, i'),
  13: S(13, '[w]', 'oi, oin, w'), 14: S(14, '[p] [b]', 'p, pp ; b, bb'), 15: S(15, '[t] [d]', 't, tt, th ; d, dd'), 16: S(16, '[k]', 'c, qu, k, ch, ck, cc'),
  17: S(17, '[g]', 'g, gu, gg'), 18: S(18, '[f] [v]', 'f, ff, ph ; v, w'), 19: S(19, '[ʃ] [ʒ]', 'ch, sh ; j, g, ge'), 20: S(20, '[m] [n]', 'm, mm ; n, nn'),
  21: S(21, '[l]', 'l, ll'), 22: S(22, '[ʀ]', 'r, rr, rh'), 23: S(23, '[s]', 's, ss, c, ç, sc, t'), 24: S(24, '[z]', 's, z, x'), 25: S(25, '[ɲ]', 'gn'),
};
// fiche par semaine : les sons riches en graphies prennent 2 ou 3 semaines
const ORDRE = [1, 2, 2, 3, 3, 4, 5, 5, 6, 7, 8, 9, 10, 11, 11, 11, 12, 12, 13, 14, 15, 16, 16, 17, 17, 18, 19, 19, 20, 21, 22, 23, 23, 23, 24, 25];
const PERIODES = [[1, 7], [8, 14], [15, 21], [22, 28], [29, 36]];
const sonDeLaSemaine = n => {
  const f = F[ORDRE[n - 1]];
  const rang = ORDRE.slice(0, n).filter(x => x === f.fiche).length;
  const total = ORDRE.filter(x => x === f.fiche).length;
  return { ...f, semaine: n, rang, total };
};
module.exports = { ORDRE, F, PERIODES, sonDeLaSemaine };
if (require.main === module) {
  for (let n = 1; n <= 36; n++) { const s = sonDeLaSemaine(n); const p = PERIODES.findIndex(([a, b]) => n >= a && n <= b) + 1;
    console.log(`S${n}\tP${p}\tfiche ${s.fiche}\t${s.son}${s.total > 1 ? ` (${s.rang}/${s.total})` : ''}\t${s.graphies}`); }
}
