// Générateur Word du cahier journal : planning, séances détaillées, fiches élèves
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  ShadingType, BorderStyle, AlignmentType, PageOrientation, PageBreak, Footer,
  PageNumber, LevelFormat, VerticalAlign, HeadingLevel, TableLayoutType, ImageRun,
} = require('docx');

const C = {
  bleu: '1F4E79', bleuClair: 'DEEAF6', gris: 'F2F2F2', creme: 'FFF8E7',
  vert: 'E2F0D9', orange: 'FCE4D6', violet: 'EDE7F6', jaune: 'FFF2CC', trait: 'A6A6A6',
};
const DOM_COL = {
  'Conjugaison': C.violet, 'Calcul mental': C.jaune, 'Production d\'écrits': C.orange,
  'Réécriture': C.orange, 'Dictée réflexive': C.violet, 'Dictée bilan': C.violet,
  'Problème du jour': C.jaune, 'Mathématiques': C.jaune, 'Géométrie': C.jaune,
  'Fractions': C.jaune, 'Décimaux': C.jaune, 'Lecture': C.orange, 'Lecture à voix haute': C.orange,
  'Grammaire': C.violet, 'Vocabulaire': C.violet, 'Anglais': C.vert, 'Sciences': C.vert,
  'EPS': C.vert, 'Histoire': C.bleuClair, 'Géographie': C.bleuClair, 'EMC': C.bleuClair,
  'Orthographe': C.violet, 'Arts plastiques': C.gris, 'Éducation musicale': C.gris,
};

const A4 = { width: 11906, height: 16838 };
const MARG = 851; // 1,5 cm
const W = A4.width - 2 * MARG;          // largeur utile portrait
const WL = A4.height - 2 * MARG;        // largeur utile paysage

const bordure = { style: BorderStyle.SINGLE, size: 4, color: C.trait };
const bords = { top: bordure, bottom: bordure, left: bordure, right: bordure };
const sansBord = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const sansBords = { top: sansBord, bottom: sansBord, left: sansBord, right: sansBord };

// Texte enrichi minimal : **gras**
function runs(txt, o = {}) {
  const parts = String(txt).split(/(\*\*[^*]+\*\*)/);
  return parts.filter(p => p !== '').map(p => p.startsWith('**')
    ? new TextRun({ text: p.slice(2, -2), bold: true, font: o.font, size: o.size, color: o.color })
    : new TextRun({ text: p, bold: o.bold, italics: o.italics, font: o.font, size: o.size, color: o.color }));
}
function P(txt, o = {}) {
  return new Paragraph({
    children: runs(txt, o), alignment: o.align, spacing: { before: o.before ?? 0, after: o.after ?? 80, line: o.line },
    keepNext: o.keepNext, numbering: o.bullet ? { reference: 'puces', level: 0 } : (o.num ? { reference: o.num, level: 0 } : undefined),
    shading: o.shade ? { type: ShadingType.CLEAR, fill: o.shade, color: 'auto' } : undefined,
    border: o.rule ? { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.bleu, space: 2 } } : undefined,
    indent: o.indent ? { left: o.indent } : undefined,
  });
}
function cell(content, width, o = {}) {
  const kids = (Array.isArray(content) ? content : [content]).map(c => typeof c === 'string' ? P(c, o) : c);
  return new TableCell({
    children: kids.length ? kids : [P('')], width: { size: width, type: WidthType.DXA },
    shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: 'auto' } : undefined,
    borders: o.noBorder ? sansBords : bords, columnSpan: o.span,
    margins: { top: 60, bottom: 60, left: 100, right: 100 }, verticalAlign: o.valign,
  });
}
function table(widths, rows, o = {}) {
  const total = widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED,
    rows: rows.map((r, i) => new TableRow({
      cantSplit: o.cantSplit, tableHeader: o.head && i === 0,
      children: r.map((c, j) => {
        if (c && c.__cell) return c.__cell(widths, j);
        const head = o.head && i === 0;
        return cell(c ?? '', widths[j], { font: o.font, size: o.size, bold: head, fill: head ? (o.headFill || C.bleuClair) : (o.fills && o.fills[i]) });
      }),
    })),
  });
}
function bandeau(txt, fill, o = {}) {
  return new Table({
    width: { size: o.w || W, type: WidthType.DXA }, columnWidths: [o.w || W], layout: TableLayoutType.FIXED,
    rows: [new TableRow({ children: [cell([P(txt, { bold: true, size: o.size || 24, color: o.color, font: o.font, after: 0 })], o.w || W, { fill })] })],
  });
}
const vide = (after = 80) => new Paragraph({ children: [], spacing: { after } });
const saut = () => new Paragraph({ children: [new PageBreak()] });

function numbering() {
  const cfg = [{ reference: 'puces', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 240 } } } }] }];
  for (let i = 0; i < 60; i++) cfg.push({ reference: 'n' + i, levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 300 } } } }] });
  return { config: cfg };
}
function styles(font, size) {
  const h = (s, sp) => ({ run: { font, size: s, bold: true, color: C.bleu }, paragraph: { spacing: { before: sp, after: 100 }, keepNext: true } });
  return { default: { document: { run: { font, size } }, title: h(40, 0), heading1: h(32, 240), heading2: h(26, 200), heading3: h(24, 160) } };
}
function footer(txt) {
  return { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
    new TextRun({ text: txt + ' · page ', size: 16, color: '808080' }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '808080' })] })] }) };
}
async function save(doc, file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, await Packer.toBuffer(doc));
}

// ---------- Planning de la semaine (paysage) ----------
async function planning(week, file) {
  const pl = week.planning;
  const wDom = 2200; const wDay = Math.floor((WL - wDom) / 4); const widths = [wDom, wDay, wDay, wDay, WL - wDom - 3 * wDay];
  const rows = [['Domaine', ...week.days.map(d => d.jour + ' ' + d.date)]];
  const fills = [null];
  pl.rows.forEach(r => { rows.push([r[0], r[1], r[2], r[3], r[4]]); fills.push(null); });
  const kids = [
    P(`Période ${week.periode} · Semaine ${week.semaine} · ${week.dates}`, { size: 36, bold: true, color: C.bleu, after: 60 }),
    P(pl.lead, { size: 20, after: 120 }),
    table(widths, rows, { head: true, size: 15, cantSplit: true }),
    vide(120),
  ];
  if (pl.objectifs) {
    kids.push(saut());
    kids.push(P('Notions visées en fin de semaine', { bold: true, size: 22, color: C.bleu, after: 60 }));
    const w2 = [2200, WL - 2200];
    kids.push(table(w2, [['Domaine', 'Ce que les élèves savent faire vendredi'], ...pl.objectifs], { head: true, size: 15 }));
  }
  const doc = new Document({ styles: styles('Arial', 18), numbering: numbering(), sections: [{
    properties: { page: { size: { width: A4.width, height: A4.height, orientation: PageOrientation.LANDSCAPE }, margin: { top: MARG, bottom: MARG, left: MARG, right: MARG } } },
    footers: footer(`Planning P${week.periode} S${week.semaine}`), children: kids }] });
  await save(doc, file);
}

// ---------- Séances détaillées d'une journée ----------
function blocSeance(s, idx) {
  const out = [];
  out.push(bandeau(`${s.h} · ${s.dom}${s.titre ? ' — ' + s.titre : ''}`, DOM_COL[s.dom] || C.gris, { size: 22 }));
  const w2 = [2100, W - 2100];
  const info = [];
  if (s.comp) info.push(['Compétence', s.comp]);
  info.push(['Objectif', s.obj]);
  if (s.crit) info.push(['Critères de réussite', s.crit.map(c => '– ' + c).join('  ')]);
  if (s.mat) info.push(['Matériel', s.mat]);
  if (s.ref) info.push(['Appui didactique', s.ref]);
  if (s.fiche) info.push(['Fiches élèves', s.fiche]);
  out.push(table(w2, info.map(r => [{ __cell: (w, j) => cell(P(r[0], { bold: true, size: 18 }), w[0], { fill: C.gris }) }, r[1]].map((c, j) => j === 0 ? c : c)), { size: 18 }));
  if (s.phases) {
    const wp = [1500, 700, (W - 2200) / 2, (W - 2200) / 2];
    const rows = [['Phase', 'Durée', 'Enseignant', 'Élèves']].concat(s.phases);
    out.push(table(wp, rows, { head: true, size: 17, headFill: C.gris }));
  }
  const extra = [];
  if (s.diff) extra.push(['Différenciation', s.diff.map(d => '**' + d[0] + '** : ' + d[1])]);
  if (s.trace) extra.push(['Trace écrite', Array.isArray(s.trace) ? s.trace : [s.trace]]);
  if (s.eval) extra.push(['Observables', [s.eval]]);
  if (s.corrige) extra.push(['Corrigé', s.corrige]);
  if (s.note) extra.push(['À noter', [s.note]]);
  if (extra.length) {
    out.push(table(w2, extra.map(r => [
      { __cell: (w) => cell(P(r[0], { bold: true, size: 18 }), w[0], { fill: C.gris }) },
      { __cell: (w) => cell(r[1].map(t => P(t, { size: 18, after: 40 })), w[1]) },
    ])));
  }
  out.push(vide(160));
  return out;
}
async function seances(week, day, file) {
  const kids = [
    P(`${day.jour} ${day.date} 2026`, { size: 40, bold: true, color: C.bleu, after: 40 }),
    P(`Période ${week.periode} · Semaine ${week.semaine} · Cahier journal détaillé`, { size: 20, color: '595959', after: 80, rule: true }),
    P(day.lead, { size: 20, after: 160 }),
  ];
  // Vue d'ensemble
  const wv = [1500, 2300, W - 3800];
  kids.push(table(wv, [['Horaire', 'Domaine', 'Objectif'], ...day.seances.map(s => [s.h, s.dom, s.obj])], { head: true, size: 17 }));
  kids.push(vide(200));
  day.seances.forEach((s, i) => kids.push(...blocSeance(s, i)));
  const doc = new Document({ styles: styles('Arial', 19), numbering: numbering(), sections: [{
    properties: { page: { size: A4, margin: { top: MARG, bottom: MARG, left: MARG, right: MARG } } },
    footers: footer(`${day.jour} ${day.date} · séances`), children: kids }] });
  await save(doc, file);
}

// ---------- Fiches élèves ----------
let numCounter = 0;
function lignes(n, font, size) {
  const pointille = { style: BorderStyle.DOTTED, size: 6, color: C.trait };
  const h = size >= 28 ? 620 : 520;
  return [new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [W], layout: TableLayoutType.FIXED,
    rows: Array.from({ length: n }, () => new TableRow({ height: { value: h, rule: 'exact' }, children: [new TableCell({
      children: [new Paragraph({ children: [] })], width: { size: W, type: WidthType.DXA },
      borders: { top: sansBord, left: sansBord, right: sansBord, bottom: pointille } })] })) }), vide(100)];
}
function blocFiche(b, f) {
  const font = f.font; const size = f.size; const o = { font, size };
  switch (b.t) {
    case 'consigne': return [new Paragraph({ children: [new TextRun({ text: (b.n ? b.n + '. ' : ''), bold: true, font, size, color: C.bleu }), ...runs(b.x, { font, size, bold: true })], spacing: { before: 200, after: 80 }, keepNext: true })];
    case 'texte': return [new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [W], layout: TableLayoutType.FIXED,
      rows: [new TableRow({ children: [cell((Array.isArray(b.x) ? b.x : [b.x]).map(x => P(x, { font, size: b.small ? size - 4 : size, after: 80, line: f.n1 ? 360 : 300 })), W, { fill: b.fill || C.gris })] })] }), vide(80)];
    case 'p': return (Array.isArray(b.x) ? b.x : [b.x]).map(x => P(x, { font, size, after: 80 }));
    case 'liste': return b.x.map(x => P(x, { font, size, bullet: true, after: 60 }));
    case 'lignes': return lignes(b.n, font, size);
    case 'calc': {
      const cols = b.cols || 2; const wc = Math.floor(W / cols); const widths = Array(cols).fill(wc);
      const rows = []; for (let i = 0; i < b.x.length; i += cols) rows.push(b.x.slice(i, i + cols).concat(Array(cols).fill('')).slice(0, cols));
      return [new Table({ width: { size: wc * cols, type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED,
        rows: rows.map(r => new TableRow({ children: r.map(x => cell([P(x, { font, size, after: 0 })], wc, { noBorder: true })) })) }), vide(80)];
    }
    case 'table': {
      const n = (b.head || b.rows[0]).length; const widths = b.w || Array(n).fill(Math.floor(W / n));
      const rows = b.head ? [b.head, ...b.rows] : b.rows; const hd = !!b.head;
      return [new Table({ width: { size: widths.reduce((a, c) => a + c, 0), type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED,
        rows: rows.map((r, i) => { const isH = hd && i === 0; return new TableRow({ height: !isH && b.h ? { value: b.h, rule: 'atLeast' } : undefined, children: r.map((x, j) => cell([P(x, { font, size: b.big ? size + 6 : size, bold: isH || b.big, after: 0, align: b.center ? AlignmentType.CENTER : undefined })], widths[j], { fill: isH ? C.bleuClair : undefined, valign: b.center ? VerticalAlign.CENTER : undefined })) }); }) }), vide(100)];
    }
    case 'qcm': return b.x.flatMap(q => [P(q[0], { font, size, bold: true, after: 40, keepNext: true }), ...q.slice(1).map(r => P('☐  ' + r, { font, size, indent: 360, after: 40 }))].concat([vide(60)]));
    case 'pose': { // opérations à poser : cases quadrillées
      const n = b.x.length; const wc = Math.floor(W / n);
      return [new Table({ width: { size: wc * n, type: WidthType.DXA }, columnWidths: Array(n).fill(wc), layout: TableLayoutType.FIXED,
        rows: [new TableRow({ children: b.x.map(x => cell([P(x, { font, size, bold: true, after: 0 })], wc, { fill: C.gris })) }),
          new TableRow({ height: { value: b.h || 2600, rule: 'exact' }, children: b.x.map(() => cell([P('')], wc)) })] }), vide(100)];
    }
    case 'cadre': return [new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [W], layout: TableLayoutType.FIXED,
      rows: [new TableRow({ height: { value: b.h || 2400, rule: 'exact' }, children: [cell([P(b.x || '', { font, size: size - 4, color: '808080' })], W)] })] }), vide(100)];
    case 'saut': return [saut()];
    case 'img': { const buf = fs.readFileSync(b.src); return [new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ type: 'png', data: buf, transformation: { width: b.w, height: b.h } })] }), vide(80)]; }
    default: throw new Error('bloc inconnu ' + b.t);
  }
}
function pageFiche(f, day) {
  const font = f.n1 ? 'Verdana' : 'Arial'; const size = f.n1 ? 28 : 24;
  const ff = { ...f, font, size };
  const kids = [];
  const wh = [Math.floor(W * 0.62), W - Math.floor(W * 0.62)];
  kids.push(new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: wh, layout: TableLayoutType.FIXED, rows: [new TableRow({ children: [
    cell([P(f.dom + ' · ' + f.niv, { font, size: 20, bold: true, color: C.bleu, after: 20 }), P(f.titre, { font, size: f.n1 ? 30 : 28, bold: true, after: 0 })], wh[0], { fill: DOM_COL[f.dom] || C.gris }),
    cell([P('Prénom : ……………………', { font, size: 20, after: 60 }), P('Date : ' + day.jour.toLowerCase() + ' ' + day.date, { font, size: 20, after: 0 })], wh[1], { fill: DOM_COL[f.dom] || C.gris }),
  ] })] }));
  kids.push(vide(120));
  if (f.n1) kids.push(P('Version aménagée', { font, size: 18, color: '808080', after: 80 }));
  f.b.forEach(b => kids.push(...blocFiche(b, ff)));
  return kids;
}
async function fiches(week, day, file) {
  const kids = [];
  // Sommaire d'impression
  kids.push(P(`${day.jour} ${day.date} · fiches élèves`, { size: 36, bold: true, color: C.bleu, after: 60 }));
  kids.push(P('Récapitulatif d\'impression : une fiche par page, dans l\'ordre de la journée. Le nombre d\'exemplaires dépend de tes effectifs par niveau et du nombre d\'élèves en version aménagée.', { size: 18, after: 100 }));
  const wv = [700, 2300, 4600, 1500, W - 9100];
  const rec = day.fiches.map((f, i) => [String(i + 2), f.dom, f.titre, f.niv, f.ex || '']);
  (day.externes || []).forEach(a => rec.push(['—', a[0], a[1], a[2], 'fichier séparé']));
  (day.attente || []).forEach(a => rec.push(['—', a[0], a[1], a[2], 'en attente']));
  kids.push(table(wv, [['Page', 'Domaine', 'Fiche', 'Pour', 'Remarque'], ...rec], { head: true, size: 17 }));
  if (day.attente && day.attente.length) kids.push(P('« En attente » : fiches de lecture suivie, produites à partir du texte du chapitre pivot dès que tu l\'envoies.', { size: 17, color: '808080', before: 80 }));
  day.fiches.forEach(f => { kids.push(saut()); kids.push(...pageFiche(f, day)); });
  const doc = new Document({ styles: styles('Arial', 24), numbering: numbering(), sections: [{
    properties: { page: { size: A4, margin: { top: MARG, bottom: MARG, left: MARG, right: MARG } } },
    footers: footer(`${day.jour} ${day.date} · fiches`), children: kids }] });
  await save(doc, file);
}

module.exports = { planning, seances, fiches };
