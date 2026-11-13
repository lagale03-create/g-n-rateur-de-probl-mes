// node build_jour.js pXsY Jour : construit un seul jour sans la feuille de planning (semaine incomplète).
const path = require('path'); const fs = require('fs');
const { seances, fiches } = require('./lib');
(async () => {
  const [wk, jour] = process.argv.slice(2);
  const week = require('./' + wk + '/semaine');
  const base = path.join(__dirname, '..', 'out', 'Cahier_journal_CM1-CM2_2026-2027', week.dossier);
  fs.mkdirSync(base, { recursive: true });
  const d = week.days.find(x => x.jour === jour);
  const stem = `${d.num}_${d.jour}_${d.date.replace(' ', '_')}`;
  const g = week.generateurs; const fp = `${stem}_probleme_du_jour.docx`;
  require('./gen').integrer(d, g.dir, g.tables[d.jour], fp);
  fs.copyFileSync(path.join(g.dir, d.jour + '.docx'), path.join(base, fp));
  await seances(week, d, path.join(base, `${stem}_seances.docx`));
  await fiches(week, d, path.join(base, `${stem}_fiches_eleves.docx`));
  console.log(base);
})().catch(e => { console.error(e); process.exit(1); });
