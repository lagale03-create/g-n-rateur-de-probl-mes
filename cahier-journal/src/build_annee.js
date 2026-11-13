// node src/build_annee.js [S1 S2 …] : construit les semaines de l'année depuis gen/annee_json/sNN.json
const fs = require('fs'); const path = require('path');
const { planning, seances, fiches } = require('./lib');
(async () => {
  const dir = path.join(__dirname, '..', 'gen', 'annee_json');
  const want = process.argv.slice(2).map(Number);
  const files = fs.readdirSync(dir).filter(f => /^s\d\d\.json$/.test(f)).sort();
  for (const f of files) {
    const week = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (want.length && !want.includes(week.S)) continue;
    const base = path.join(__dirname, '..', 'out', 'Cahier_journal_CM1-CM2_2026-2027', week.dossier);
    fs.mkdirSync(base, { recursive: true });
    await planning(week, path.join(base, `00_Planning_P${week.periode}S${week.semaine}.docx`));
    for (const d of week.days) {
      const stem = `${d.num}_${d.jour}_${d.date.replace(' ', '_')}`;
      fs.copyFileSync(path.join(week.gdir, d.jour + '.docx'), path.join(base, `${stem}_probleme_du_jour.docx`));
      await seances(week, d, path.join(base, `${stem}_seances.docx`));
      await fiches(week, d, path.join(base, `${stem}_fiches_eleves.docx`));
    }
    console.log('ok', week.S, week.dossier);
  }
})().catch(e => { console.error(e); process.exit(1); });
