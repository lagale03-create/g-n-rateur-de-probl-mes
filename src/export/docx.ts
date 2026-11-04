/**
 * Export Word (.docx) d'une semaine, avec la librairie `docx`.
 * Mise en page : A4, Arial, marges de 2 cm, pied de page « Semaine X · page N ».
 * Chaque niveau et chaque jour commence sur une nouvelle page (une section Word chacun),
 * pour n'imprimer que les pages d'un groupe. Le corrigé enseignant est à la fin.
 */
import {
  AlignmentType, BorderStyle, Document, Footer, HeightRule, LevelFormat, Packer,
  PageNumber, Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, WidthType,
  type ISectionOptions,
} from "docx";
import type { Semaine } from "../core/semaine";
import type { Niveau, Probleme } from "../core/types";

// ---------- constantes de mise en page (en DXA : 1 cm = 567) ----------
const CM = 567;
const PAGE = { largeur: 11906, hauteur: 16838, marge: 2 * CM };
const LARGEUR = PAGE.largeur - 2 * PAGE.marge;            // 9 638
const HAUTEUR_UTILE = PAGE.hauteur - 2 * PAGE.marge;      // 14 570
const BLEU_FONCE = "1F3864", ORANGE = "C55A11", BLEU = "2E75B6", BLEU_CLAIR = "DEEAF6", GRIS = "7F7F7F", ROUGE = "C00000";
const TAILLE = 24; // 12 pt (demi-points)

export const CONSIGNE_3 = "Attention : certaines informations ne servent à rien ! Surligne d'abord les données utiles.";

type Bloc = Paragraph | Table;
type NomJour = "Jour 1" | "Jour 2" | "Évaluation";

/** Nom de fichier : « S08_Decimaux_et_monnaie.docx ». */
export function nomFichier(numero: number, titre: string, ext = "docx"): string {
  const t = titre
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/['’:,;!?().]/g, " ").trim().replace(/\s+/g, "_");
  return `S${String(numero).padStart(2, "0")}_${t}.${ext}`;
}

const etoiles = (n: Niveau) => "★".repeat(n);
const txt = (t: string, o: { bold?: boolean; italics?: boolean; color?: string; size?: number } = {}) => new TextRun({ text: t, ...o });

// ---------- éléments communs ----------

function enTete(sem: Semaine, niveau: Niveau, jour: NomJour): Bloc[] {
  return [
    new Paragraph({ spacing: { after: 60 }, children: [txt(`Semaine ${sem.numero} : ${sem.titre}`, { bold: true, color: BLEU_FONCE, size: 30 })] }),
    new Paragraph({ spacing: { after: 120 }, children: [txt(`Niveau ${etoiles(niveau)} · ${jour}`, { bold: true, color: ORANGE, size: 26 })] }),
    new Paragraph({
      spacing: { after: 60 },
      children: [txt("Prénom : ……………………………………        Date : ……………………………")],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT, spacing: { after: 200 },
      children: [txt(`Code de la fiche : ${sem.graine}`, { color: GRIS, size: 16 })],
    }),
  ];
}
const HAUTEUR_EN_TETE = 2100;

function consigne(): Paragraph {
  return new Paragraph({
    spacing: { after: 200 },
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: ORANGE, space: 8 } },
    children: [txt(CONSIGNE_3, { bold: true, italics: true })],
  });
}
const HAUTEUR_CONSIGNE = 800;

/** Cadre bleu clair à bordure bleue contenant l'énoncé. */
function cadreEnonce(p: Probleme, numero: number, avecQuestion: boolean): Table {
  const bord = { style: BorderStyle.SINGLE, size: 12, color: BLEU };
  const enfants = [
    new Paragraph({ spacing: { after: 100 }, children: [txt(`Problème ${numero} : ${p.titreContexte}`, { bold: true })] }),
    new Paragraph({ spacing: { after: avecQuestion ? 100 : 0, line: 300 }, children: [txt(p.enonce)] }),
  ];
  if (avecQuestion) enfants.push(new Paragraph({ spacing: { line: 300 }, children: [txt(p.question, { bold: true })] }));
  return new Table({
    width: { size: LARGEUR, type: WidthType.DXA },
    columnWidths: [LARGEUR],
    borders: { top: bord, bottom: bord, left: bord, right: bord, insideHorizontal: bord, insideVertical: bord },
    rows: [new TableRow({
      cantSplit: true,
      children: [new TableCell({
        width: { size: LARGEUR, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: BLEU_CLAIR, color: "auto" },
        margins: { top: 140, bottom: 140, left: 200, right: 200 },
        children: enfants,
      })],
    })],
  });
}

/** Estimation prudente de la hauteur d'un cadre d'énoncé (pour dimensionner l'espace de recherche). */
export function hauteurEnonce(p: Probleme, avecQuestion: boolean): number {
  const lignes = (t: string) => Math.max(1, Math.ceil(t.length / 72));
  const n = 1 + lignes(p.enonce) + (avecQuestion ? lignes(p.question) : 0);
  return n * 330 + 280 + 400;
}

function ligneReponse(avant = 640, variante = 0): Paragraph {
  // deux paragraphes voisins à bordure identique sont fusionnés par Word : on varie l'épaisseur
  return new Paragraph({
    spacing: { before: avant, after: 0 },
    border: { bottom: { style: BorderStyle.DOTTED, size: 6 + variante, color: GRIS, space: 1 } },
    children: [],
  });
}

/** Paragraphe vide qui commence une nouvelle page (pas de page blanche en cas de débordement). */
function sautDePage(): Paragraph {
  return new Paragraph({ pageBreakBefore: true, spacing: { before: 0, after: 0 }, children: [] });
}

// ---------- pages élèves ----------

/** Niveau ★ (Jours 1 et 2) : 2 problèmes par page, questions guidées suivies d'une ligne. */
function pagesGuidees(probs: readonly Probleme[]): Bloc[] {
  const blocs: Bloc[] = [];
  probs.forEach((p, i) => {
    if (i > 0 && i % 2 === 0) blocs.push(sautDePage());
    if (i % 2 === 1) blocs.push(new Paragraph({ spacing: { before: 360 }, children: [] }));
    blocs.push(cadreEnonce(p, i + 1, false));
    p.guidees.forEach((g, k) => {
      blocs.push(new Paragraph({
        spacing: { before: 200 }, keepNext: true,
        children: [txt(`${String.fromCharCode(97 + k)}) `, { bold: true }), txt(g)],
      }));
      blocs.push(ligneReponse());
    });
  });
  return blocs;
}

/** Niveaux ★★, ★★★ et évaluations : 1 problème par page, cadre de recherche en pointillés. */
function pagesOuvertes(probs: readonly Probleme[], niveau: Niveau): Bloc[] {
  const blocs: Bloc[] = [];
  probs.forEach((p, i) => {
    if (i > 0) blocs.push(sautDePage());
    blocs.push(cadreEnonce(p, i + 1, true));
    const occupe = (i === 0 ? HAUTEUR_EN_TETE + (niveau === 3 ? HAUTEUR_CONSIGNE : 0) : 0)
      + hauteurEnonce(p, true) + 1800 + 2000;
    const hauteur = Math.max(4 * CM, HAUTEUR_UTILE - occupe);
    const pointille = { style: BorderStyle.DASHED, size: 8, color: GRIS };
    blocs.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
    blocs.push(new Table({
      width: { size: LARGEUR, type: WidthType.DXA },
      columnWidths: [LARGEUR],
      borders: { top: pointille, bottom: pointille, left: pointille, right: pointille, insideHorizontal: pointille, insideVertical: pointille },
      rows: [new TableRow({
        height: { value: hauteur, rule: HeightRule.EXACT },
        cantSplit: true,
        children: [new TableCell({
          width: { size: LARGEUR, type: WidthType.DXA },
          margins: { top: 100, left: 160, right: 160 },
          children: [new Paragraph({ children: [txt("Je cherche, je calcule :", { bold: true, color: GRIS })] })],
        })],
      })],
    }));
    blocs.push(new Paragraph({ spacing: { before: 240 }, keepNext: true, children: [txt("Ma phrase réponse :", { bold: true })] }));
    blocs.push(ligneReponse(480, 0));
    blocs.push(ligneReponse(480, 1));
  });
  return blocs;
}

// ---------- corrigé ----------

function corrige(sem: Semaine, niveaux: Niveau[]): Bloc[] {
  const blocs: Bloc[] = [
    new Paragraph({ spacing: { after: 60 }, children: [txt(`Semaine ${sem.numero} : ${sem.titre}`, { bold: true, color: BLEU_FONCE, size: 30 })] }),
    new Paragraph({
      spacing: { after: 240 },
      children: [txt("Corrigé enseignant · ", { bold: true, size: 28 }), txt("NE PAS DISTRIBUER", { bold: true, color: ROUGE, size: 28 })],
    }),
    new Paragraph({ spacing: { after: 240 }, children: [txt(`Graine : ${sem.graine}`, { color: GRIS, size: 18 })] }),
  ];
  niveaux.forEach((n, idx) => {
    const ns = sem.niveaux[n];
    if (!ns) return;
    if (idx > 0) blocs.push(sautDePage());
    blocs.push(new Paragraph({ spacing: { before: 120, after: 120 }, keepNext: true, children: [txt(`Niveau ${etoiles(n)}`, { bold: true, color: ORANGE, size: 28 })] }));
    for (const [nom, liste] of [["Jour 1", ns.jour1], ["Jour 2", ns.jour2], ["Évaluation", [ns.evaluation]]] as const) {
      blocs.push(new Paragraph({ spacing: { before: 200, after: 80 }, keepNext: true, children: [txt(nom, { bold: true, color: BLEU_FONCE, size: 24 })] }));
      liste.forEach((p, i) => {
        blocs.push(new Paragraph({
          spacing: { before: 120 }, keepNext: true,
          children: [txt(`Problème ${i + 1} : ${p.titreContexte}`, { bold: true, size: 22 }),
            txt(`  (on cherche : ${p.etapes.at(-1)?.libelle ?? p.inconnue})`, { italics: true, size: 22, color: GRIS })],
        }));
        blocs.push(new Paragraph({ keepNext: true, children: [txt(`Situations : ${p.situations.join(", ")}`, { italics: true, size: 22 })] }));
        p.etapes.forEach((e) => blocs.push(new Paragraph({
          numbering: { reference: "puces", level: 0 }, keepNext: true,
          children: [txt(`${e.situation} : `, { bold: true, size: 22 }), txt(`${e.calcul} (${e.libelle})`, { size: 22 })],
        })));
        if (p.parasites.length) {
          blocs.push(new Paragraph({ keepNext: true, children: [txt("Données parasites : ", { italics: true, size: 22 }), txt(p.parasites.join(" "), { size: 22 })] }));
        }
        blocs.push(new Paragraph({ spacing: { after: 120 }, children: [txt(`Réponse : ${p.reponse}`, { bold: true, size: 22 })] }));
      });
    }
  });
  return blocs;
}

// ---------- document ----------

export interface OptionsExport {
  niveaux?: Niveau[];
  /** Inclure le corrigé enseignant à la fin (oui par défaut). */
  corrige?: boolean;
}

export function documentSemaine(sem: Semaine, o: OptionsExport = {}): Document {
  const niveaux = (o.niveaux ?? ([1, 2, 3] as Niveau[])).filter((n) => sem.niveaux[n]);
  const pied = new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: [`Semaine ${sem.numero} · page `, PageNumber.CURRENT], size: 18, color: GRIS })],
    })],
  });
  const proprietes = {
    page: {
      size: { width: PAGE.largeur, height: PAGE.hauteur },
      margin: { top: PAGE.marge, bottom: PAGE.marge, left: PAGE.marge, right: PAGE.marge, footer: 567 },
    },
  };
  const sections: ISectionOptions[] = [];
  for (const n of niveaux) {
    const ns = sem.niveaux[n]!;
    for (const [nom, liste] of [["Jour 1", ns.jour1], ["Jour 2", ns.jour2], ["Évaluation", [ns.evaluation]]] as const) {
      const guide = n === 1 && nom !== "Évaluation";
      sections.push({
        properties: proprietes,
        footers: { default: pied },
        children: [
          ...enTete(sem, n, nom),
          ...(n === 3 ? [consigne()] : []),
          ...(guide ? pagesGuidees(liste) : pagesOuvertes(liste, n)),
        ],
      });
    }
  }
  if (o.corrige ?? true) sections.push({ properties: proprietes, footers: { default: pied }, children: corrige(sem, niveaux) });

  return new Document({
    creator: "Générateur de problèmes CM1-CM2",
    title: `Semaine ${sem.numero} : ${sem.titre}`,
    styles: { default: { document: { run: { font: "Arial", size: TAILLE } } } },
    numbering: {
      config: [{
        reference: "puces",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 500, hanging: 260 } } } }],
      }],
    },
    sections,
  });
}

/** Dans le navigateur : fichier prêt à télécharger. */
export function semaineEnBlob(sem: Semaine, o?: OptionsExport): Promise<Blob> {
  return Packer.toBlob(documentSemaine(sem, o));
}

/** Dans Node (tests, scripts). */
export function semaineEnBuffer(sem: Semaine, o?: OptionsExport): Promise<Buffer> {
  return Packer.toBuffer(documentSemaine(sem, o));
}
