/**
 * Graphiques des énoncés (diagramme en barres, courbe, diagramme circulaire).
 * Une seule description géométrique (« primitives ») sert à trois sorties :
 *  - SVG pour l'aperçu à l'écran ;
 *  - PNG via le canvas du navigateur pour le fichier Word (rendu net, polices du système) ;
 *  - PNG simplifié sans texte quand il n'y a pas de navigateur (tests, scripts Node).
 * Couleurs : bleu unique pour une série ; quatre teintes validées (daltonisme) pour les secteurs,
 * toujours accompagnées d'étiquettes directes.
 */
import type { Visuel } from "../core/types";

export const LARGEUR_G = 900, HAUTEUR_G = 520;
const ENCRE = "#1d1d1f", ENCRE2 = "#555555", GRILLE = "#d9d9d9", SERIE = "#2a78d6";
const SECTEURS = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100"];

export type Prim =
  | { t: "rect"; x: number; y: number; w: number; h: number; fill: string }
  | { t: "line"; x1: number; y1: number; x2: number; y2: number; stroke: string; width: number }
  | { t: "poly"; pts: [number, number][]; fill: string; stroke?: string }
  | { t: "text"; x: number; y: number; s: string; size: number; anchor: "start" | "middle" | "end"; bold?: boolean; fill?: string };

function pasGrille(max: number): number {
  for (const p of [5, 10, 20, 25, 50, 100, 200, 250, 500, 1000]) if (max / p <= 12) return p;
  return 2000;
}

export function primitives(v: Visuel, W = LARGEUR_G, H = HAUTEUR_G): Prim[] {
  const P: Prim[] = [{ t: "rect", x: 0, y: 0, w: W, h: H, fill: "#ffffff" }];
  P.push({ t: "text", x: W / 2, y: 34, s: v.titre, size: 24, anchor: "middle", bold: true, fill: ENCRE });
  const vals = v.lignes[0].valeurs;

  if (v.type === "secteurs") {
    const cx = W * 0.34, cy = H * 0.55, r = H * 0.36;
    let a0 = -Math.PI / 2;
    vals.forEach((val, i) => {
      const part = (val.nombre ?? 0) / 100;
      const a1 = a0 + part * 2 * Math.PI;
      const pts: [number, number][] = [[cx, cy]];
      for (let k = 0; k <= 48; k++) { const a = a0 + ((a1 - a0) * k) / 48; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
      P.push({ t: "poly", pts, fill: SECTEURS[i % 4], stroke: "#ffffff" });
      // étiquette directe : pourcentage dans le secteur
      const am = (a0 + a1) / 2;
      // (les petits secteurs gardent leur valeur dans la légende seulement)
      if (part >= 0.08) P.push({ t: "text", x: cx + r * 0.62 * Math.cos(am), y: cy + r * 0.62 * Math.sin(am) + 9, s: val.texte, size: 26, anchor: "middle", bold: true, fill: "#ffffff" });
      // légende
      const ly = H * 0.3 + i * 52;
      P.push({ t: "rect", x: W * 0.66, y: ly - 20, w: 28, h: 28, fill: SECTEURS[i % 4] });
      P.push({ t: "text", x: W * 0.66 + 40, y: ly, s: `${v.colonnes[i]} : ${val.texte}`, size: 22, anchor: "start", fill: ENCRE });
      a0 = a1;
    });
    return P;
  }

  // axes et grille (barres et courbe)
  const g = 90, d = 30, haut = 70, bas = 70;
  const max = Math.max(...vals.map((x) => x.nombre ?? 0), 10);
  const pas = pasGrille(max);
  const ymax = Math.ceil((max * 1.05) / pas) * pas;
  const y = (val: number) => H - bas - ((H - bas - haut) * val) / ymax;
  for (let k = 0; k <= ymax; k += pas) {
    P.push({ t: "line", x1: g, y1: y(k), x2: W - d, y2: y(k), stroke: GRILLE, width: 1.5 });
    if ((k / pas) % (ymax / pas > 10 ? 2 : 1) === 0) P.push({ t: "text", x: g - 12, y: y(k) + 7, s: String(k), size: 18, anchor: "end", fill: ENCRE2 });
  }
  P.push({ t: "line", x1: g, y1: H - bas, x2: W - d, y2: H - bas, stroke: ENCRE, width: 2 });
  P.push({ t: "line", x1: g, y1: haut - 10, x2: g, y2: H - bas, stroke: ENCRE, width: 2 });
  if (v.unite) P.push({ t: "text", x: g - 12, y: haut - 22, s: v.unite, size: 18, anchor: "start", fill: ENCRE2 });
  const n = vals.length, larg = (W - g - d) / n;
  const xc = (i: number) => g + larg * (i + 0.5);
  vals.forEach((_, i) => P.push({ t: "text", x: xc(i), y: H - bas + 32, s: v.colonnes[i], size: 20, anchor: "middle", fill: ENCRE }));

  if (v.type === "barres") {
    vals.forEach((val, i) => {
      if (val.nombre === null) { P.push({ t: "text", x: xc(i), y: H - bas - 14, s: "?", size: 34, anchor: "middle", bold: true, fill: ENCRE }); return; }
      const bw = Math.min(90, larg * 0.55);
      P.push({ t: "rect", x: xc(i) - bw / 2, y: y(val.nombre), w: bw, h: H - bas - y(val.nombre), fill: SERIE });
    });
  } else {
    let prec: [number, number] | null = null;
    vals.forEach((val, i) => {
      if (val.nombre === null) { P.push({ t: "text", x: xc(i), y: H - bas - 14, s: "?", size: 34, anchor: "middle", bold: true, fill: ENCRE }); prec = null; return; }
      const pt: [number, number] = [xc(i), y(val.nombre)];
      if (prec) P.push({ t: "line", x1: prec[0], y1: prec[1], x2: pt[0], y2: pt[1], stroke: SERIE, width: 4 });
      prec = pt;
    });
    vals.forEach((val, i) => {
      if (val.nombre === null) return;
      const cx = xc(i), cy = y(val.nombre), r = 8;
      const pts: [number, number][] = Array.from({ length: 20 }, (_, k) => [cx + r * Math.cos((k / 20) * 2 * Math.PI), cy + r * Math.sin((k / 20) * 2 * Math.PI)]);
      P.push({ t: "poly", pts, fill: SERIE, stroke: "#ffffff" });
    });
  }
  return P;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function versSVG(prims: Prim[], W = LARGEUR_G, H = HAUTEUR_G): string {
  const c = prims.map((p) => {
    switch (p.t) {
      case "rect": return `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" fill="${p.fill}"/>`;
      case "line": return `<line x1="${p.x1}" y1="${p.y1}" x2="${p.x2}" y2="${p.y2}" stroke="${p.stroke}" stroke-width="${p.width}" stroke-linecap="round"/>`;
      case "poly": return `<polygon points="${p.pts.map((q) => q.join(",")).join(" ")}" fill="${p.fill}"${p.stroke ? ` stroke="${p.stroke}" stroke-width="3" stroke-linejoin="round"` : ""}/>`;
      case "text": return `<text x="${p.x}" y="${p.y}" font-family="Arial, Helvetica, sans-serif" font-size="${p.size}" text-anchor="${p.anchor}" fill="${p.fill ?? ENCRE}"${p.bold ? ' font-weight="bold"' : ""}>${esc(p.s)}</text>`;
    }
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${c}</svg>`;
}

export const svgDuVisuel = (v: Visuel) => versSVG(primitives(v));

// ---------- PNG ----------

/** Dans le navigateur : rendu de l'image SVG dans un canvas, puis PNG. */
export async function pngNavigateur(svg: string, W = LARGEUR_G, H = HAUTEUR_G): Promise<Uint8Array> {
  const img = new Image();
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  canvas.getContext("2d")!.drawImage(img, 0, 0, W, H);
  const blob: Blob = await new Promise((ok) => canvas.toBlob((b) => ok(b!), "image/png"));
  return new Uint8Array(await blob.arrayBuffer());
}

/** Sans navigateur : rasterisation simple (rectangles, traits, polygones ; pas de texte). */
export function pngSimple(prims: Prim[], W = LARGEUR_G, H = HAUTEUR_G): Uint8Array {
  const px = new Uint8Array(W * H * 3).fill(255);
  const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const set = (x: number, y: number, [r, g, b]: number[]) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = (y * W + x) * 3; px[i] = r; px[i + 1] = g; px[i + 2] = b;
  };
  const poly = (pts: [number, number][], col: number[]) => {
    const ys = pts.map((p) => p[1]);
    for (let y = Math.max(0, Math.floor(Math.min(...ys))); y <= Math.min(H - 1, Math.ceil(Math.max(...ys))); y++) {
      const xs: number[] = [];
      for (let i = 0; i < pts.length; i++) {
        const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length];
        if ((y1 <= y && y < y2) || (y2 <= y && y < y1)) xs.push(x1 + ((y - y1) * (x2 - x1)) / (y2 - y1));
      }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) for (let x = Math.round(xs[k]); x < Math.round(xs[k + 1]); x++) set(x, y, col);
    }
  };
  for (const p of prims) {
    if (p.t === "rect") poly([[p.x, p.y], [p.x + p.w, p.y], [p.x + p.w, p.y + p.h], [p.x, p.y + p.h]], hex(p.fill));
    else if (p.t === "poly") poly(p.pts, hex(p.fill));
    else if (p.t === "line") {
      const dx = p.x2 - p.x1, dy = p.y2 - p.y1, l = Math.hypot(dx, dy) || 1, nx = (-dy / l) * p.width / 2, ny = (dx / l) * p.width / 2;
      poly([[p.x1 + nx, p.y1 + ny], [p.x2 + nx, p.y2 + ny], [p.x2 - nx, p.y2 - ny], [p.x1 - nx, p.y1 - ny]], hex(p.stroke));
    }
  }
  return encoderPNG(px, W, H);
}

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
function crc32(b: Uint8Array): number { let c = 0xffffffff; for (const x of b) c = CRC[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }

/** PNG RVB 8 bits, compression « stockée » (sans dépendance). */
function encoderPNG(rgb: Uint8Array, W: number, H: number): Uint8Array {
  const brut = new Uint8Array((W * 3 + 1) * H);
  for (let y = 0; y < H; y++) brut.set(rgb.subarray(y * W * 3, (y + 1) * W * 3), y * (W * 3 + 1) + 1);
  const blocs: number[] = [0x78, 0x01];
  for (let i = 0; i < brut.length; i += 65535) {
    const n = Math.min(65535, brut.length - i);
    blocs.push(i + n >= brut.length ? 1 : 0, n & 0xff, n >> 8, ~n & 0xff, (~n >> 8) & 0xff);
    for (let k = 0; k < n; k++) blocs.push(brut[i + k]);
  }
  let a = 1, b = 0;
  for (const x of brut) { a = (a + x) % 65521; b = (b + a) % 65521; }
  blocs.push(b >> 8, b & 0xff, a >> 8, a & 0xff);
  const morceau = (type: string, data: Uint8Array) => {
    const out = new Uint8Array(12 + data.length);
    const dv = new DataView(out.buffer);
    dv.setUint32(0, data.length);
    for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
    out.set(data, 8);
    dv.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
    return out;
  };
  const ihdr = new Uint8Array(13);
  const dv = new DataView(ihdr.buffer);
  dv.setUint32(0, W); dv.setUint32(4, H); ihdr[8] = 8; ihdr[9] = 2;
  const parts = [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), morceau("IHDR", ihdr), morceau("IDAT", new Uint8Array(blocs)), morceau("IEND", new Uint8Array())];
  const total = new Uint8Array(parts.reduce((s, p) => s + p.length, 0));
  let o = 0; for (const p of parts) { total.set(p, o); o += p.length; }
  return total;
}

/** PNG d'un visuel : navigateur si disponible, sinon rendu simplifié. */
export async function pngDuVisuel(v: Visuel): Promise<Uint8Array> {
  const prims = primitives(v);
  if (typeof document !== "undefined" && typeof Image !== "undefined") {
    try { return await pngNavigateur(versSVG(prims)); } catch { /* rendu simplifié */ }
  }
  return pngSimple(prims);
}
