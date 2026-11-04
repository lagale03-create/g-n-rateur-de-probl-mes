/**
 * Vérificateur automatique : chaque problème est contrôlé avant d'être affiché.
 * Un problème qui échoue est régénéré par le moteur.
 */
import { Q } from "./rational";
import { resoudre } from "./solveur";
import type { Monde, Niveau, Structure } from "./types";

export interface Brouillon {
  struct: Structure;
  monde: Monde;
  donnees: string[];
  inconnue: string;
  niveau: Niveau;
  /** Variables citées dans l'énoncé et la question. */
  citees: Set<string>;
  /** Valeurs numériques des données parasites. */
  parasites: Q[];
  guideesManquantes: string[];
}

export function implicites(struct: Structure): string[] {
  return Object.entries(struct.variables).filter(([, d]) => d.grandeur === "facteur").map(([k]) => k);
}

export function verifier(b: Brouillon): string[] {
  const err: string[] = [];
  const { struct, monde, donnees, inconnue, niveau } = b;
  const vars = Object.keys(struct.variables);

  // 1. toutes les grandeurs sont définies
  for (const v of vars) if (!monde[v]) err.push(`variable non calculée : ${v}`);
  if (err.length) return err;

  // 2. recalcul à partir des seules données
  const connu: Monde = {};
  for (const d of [...donnees, ...implicites(struct)]) connu[d] = monde[d];
  const sol = resoudre(struct.relations, connu, inconnue);
  if (!sol) return [`inconnue ${inconnue} impossible à calculer à partir des données`];
  if (!sol.valeur.eq(monde[inconnue])) err.push(`recalcul de ${inconnue} incohérent`);
  if (sol.etapes.length < 2) err.push("moins de 2 étapes");

  // 3. positivité, entiers, décimales
  const maxDec = niveau === 1 ? 1 : 2;
  for (const v of vars) {
    const g = struct.variables[v].grandeur;
    const x = monde[v];
    if (g === "facteur") continue;
    if (x.isNegative) err.push(`${v} négatif`);
    if ((donnees.includes(v) || v === inconnue) && x.cmp(0) <= 0) err.push(`${v} nul`);
    if (g === "compte" && !x.isInteger) err.push(`${v} : quantité non entière (${x})`);
    if (g === "euro" && x.decimales > 2) err.push(`${v} : plus de 2 décimales en euros`);
    if (g === "euro" && niveau === 1 && x.decimales > 1 && !x.mul(2).isInteger) err.push(`${v} : prix trop complexe pour ★`);
    if (g !== "euro" && g !== "compte" && x.decimales > (g === "quantiteGrande" ? 3 : maxDec)) err.push(`${v} : trop de décimales (${x})`);
  }

  // 4. pas de décimal × décimal ; on ne divise que par un entier
  for (const e of sol.etapes) {
    const g = connu[e.g] ?? monde[e.g], d = connu[e.d] ?? monde[e.d];
    if (e.op === "×" && !g.isInteger && !d.isInteger) err.push(`multiplication décimal × décimal (${e.cible})`);
    if (e.op === "÷" && !d.isInteger) err.push(`division par un décimal (${e.cible})`);
  }

  // 5. toutes les données servent ; aucune inconnue n'est révélée
  const utilisees = new Set(sol.etapes.flatMap((e) => [e.g, e.d]));
  for (const d of donnees) if (!utilisees.has(d)) err.push(`donnée inutile non voulue : ${d}`);
  for (const d of donnees) if (!b.citees.has(d)) err.push(`donnée absente du texte : ${d}`);
  for (const c of b.citees) if (!donnees.includes(c)) err.push(`le texte révèle ${c}`);

  // 6. les données parasites ne servent à rien et ne se confondent pas avec une donnée utile
  const valeursUtiles = vars.filter((v) => struct.variables[v].grandeur !== "facteur").map((v) => monde[v]);
  for (const p of b.parasites) if (valeursUtiles.some((u) => u.eq(p))) err.push(`parasite égale à une valeur utile (${p})`);

  // 7. contraintes du schéma et textes du niveau ★
  const c = struct.contraintes?.(monde);
  if (c) err.push(c);
  for (const g of b.guideesManquantes) err.push(`question guidée manquante : ${g}`);
  return err;
}
