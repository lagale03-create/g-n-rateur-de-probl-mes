const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage();
  await pg.goto('file://' + __dirname + '/referentiel.html'); await pg.waitForTimeout(300);
  await pg.pdf({ path: __dirname + '/Referentiel_progressions_CM1-CM2_2026-2027.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close();
})();
