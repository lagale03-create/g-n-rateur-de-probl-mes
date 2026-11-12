// node build.js p2s3 [jour]
const path = require('path');
const { planning, seances, fiches } = require('./lib');
(async () => {
  const wk = process.argv[2]; const only = process.argv[3];
  const week = require('./' + wk + '/semaine');
  const base = path.join(__dirname, '..', 'out', 'Cahier_journal_CM1-CM2_2026-2027', week.dossier);
  await planning(week, path.join(base, `00_Planning_P${week.periode}S${week.semaine}.docx`));
  for (const d of week.days) {
    if (only && d.jour !== only) continue;
    const stem = `${d.num}_${d.jour}_${d.date.replace(' ', '_')}`;
    if (week.generateurs) {
      const g = week.generateurs; const fp = `${stem}_probleme_du_jour.docx`;
      require('./gen').integrer(d, g.dir, g.tables[d.jour], fp);
      require('fs').copyFileSync(path.join(g.dir, d.jour + '.docx'), path.join(base, fp));
    }
    if (week.ortho) require('./ortho_integ').integrerOrtho(d, week.ortho);
    await seances(week, d, path.join(base, `${stem}_seances.docx`));
    await fiches(week, d, path.join(base, `${stem}_fiches_eleves.docx`));
    console.log('ok', stem);
  }
})().catch(e => { console.error(e); process.exit(1); });
