/**
 * Résolution par propagation : tant qu'une relation a deux variables connues sur trois,
 * on calcule la troisième. On obtient ainsi la chaîne d'étapes, dans un sens ou dans l'autre,
 * sans jamais écrire la solution à la main.
 */
import { Q } from "./rational";
import type { Monde, Relation, Situation } from "./types";

export interface EtapeBrute {
  rel: Relation;
  cible: string;
  op: "×" | "÷" | "+" | "−" | "conv";
  g: string;   // opérande gauche
  d: string;   // opérande droit
  situation: Situation;
  valeur: Q;
}

function calcule(rel: Relation, connu: Monde, cible: "a" | "b" | "c"): EtapeBrute {
  const { a, b, c } = rel;
  const noms = rel.noms ?? {};
  if (rel.type === "mul" || rel.type === "conv") {
    if (cible === "c") return { rel, cible: c, op: rel.type === "conv" ? "conv" : "×", g: a, d: b, valeur: connu[a].mul(connu[b]),
      situation: noms.c ?? (rel.type === "conv" ? "Conversion" : "Réitération") };
    if (cible === "a") return { rel, cible: a, op: rel.type === "conv" ? "conv" : "÷", g: c, d: b, valeur: connu[c].div(connu[b]),
      situation: noms.a ?? (rel.type === "conv" ? "Conversion" : "Partage") };
    return { rel, cible: b, op: "÷", g: c, d: a, valeur: connu[c].div(connu[a]), situation: noms.b ?? "Groupement" };
  }
  if (cible === "c") return { rel, cible: c, op: "+", g: a, d: b, valeur: connu[a].add(connu[b]), situation: noms.c ?? "Union" };
  if (cible === "a") return { rel, cible: a, op: "−", g: c, d: b, valeur: connu[c].sub(connu[b]), situation: noms.a ?? "Différence" };
  return { rel, cible: b, op: "−", g: c, d: a, valeur: connu[c].sub(connu[a]), situation: noms.b ?? "Différence" };
}

/** Complète `connu` avec tout ce qui peut s'en déduire. Renvoie les étapes dans l'ordre. */
export function propager(relations: Relation[], connu: Monde, arret?: string): EtapeBrute[] {
  const etapes: EtapeBrute[] = [];
  let progres = true;
  while (progres) {
    progres = false;
    for (const rel of relations) {
      const k = (["a", "b", "c"] as const).filter((x) => connu[rel[x]] !== undefined);
      if (k.length !== 2) continue;
      const manque = (["a", "b", "c"] as const).find((x) => connu[rel[x]] === undefined)!;
      // une conversion ne se « divise » pas par son facteur
      if (rel.type === "conv" && manque === "b") continue;
      const e = calcule(rel, connu, manque);
      connu[e.cible] = e.valeur;
      etapes.push(e);
      progres = true;
      if (arret && e.cible === arret) return etapes;
    }
  }
  return etapes;
}

/**
 * Résout le problème à partir des seules données : renvoie les étapes utiles
 * (élaguées) pour atteindre l'inconnue, ou null si c'est impossible.
 */
export function resoudre(relations: Relation[], donnees: Monde, inconnue: string): { etapes: EtapeBrute[]; valeur: Q } | null {
  const connu: Monde = { ...donnees };
  const toutes = propager(relations, connu, inconnue);
  if (connu[inconnue] === undefined) return null;
  // élagage : on ne garde que les étapes dont dépend l'inconnue
  const utiles = new Set([inconnue]);
  const garde: EtapeBrute[] = [];
  for (let i = toutes.length - 1; i >= 0; i--) {
    const e = toutes[i];
    if (utiles.has(e.cible)) {
      garde.unshift(e);
      utiles.add(e.g);
      utiles.add(e.d);
    }
  }
  return { etapes: garde, valeur: connu[inconnue] };
}

