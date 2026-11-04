/**
 * Mode « problème isolé » : l'enseignant choisit des types de situations à combiner
 * et un niveau ; on cherche les structures (schéma × inconnue × contexte) qui les contiennent toutes.
 */
import { genererProbleme } from "./moteur";
import { rngFor } from "./rng";
import { habillage } from "./habillage";
import type { Contexte, Niveau, Probleme, Schema, Situation } from "./types";

export interface EntreeCatalogue {
  schemaId: string;
  contexteId: string;
  niveau: Niveau;
  inconnue: string;
  situations: Situation[];
}

const caches = new WeakMap<Schema[], EntreeCatalogue[]>();

/** Catalogue des combinaisons de situations que les schémas savent produire (calculé une fois). */
export function catalogue(schemas: Schema[], contextes: Contexte[]): EntreeCatalogue[] {
  const c = caches.get(schemas);
  if (c) return c;
  const res: EntreeCatalogue[] = [];
  for (const schema of schemas) {
    for (const contexte of contextes.filter((x) => habillage(schema, x))) {
      for (const niveau of [1, 2, 3] as Niveau[]) {
        const st = schema.structure(niveau, habillage(schema, contexte)!);
        for (const inc of [st.j1, ...st.j2]) {
          try {
            const p = genererProbleme({ schema, contexte, niveau, jour: 1, graine: "catalogue", chemin: "c", inconnue: inc.inconnue });
            res.push({ schemaId: schema.id, contexteId: contexte.id, niveau, inconnue: inc.inconnue, situations: p.situations });
          } catch { /* combinaison impossible dans ce contexte */ }
        }
      }
    }
  }
  caches.set(schemas, res);
  return res;
}

/** Toutes les situations que l'on sait produire actuellement. */
export function situationsDisponibles(schemas: Schema[], contextes: Contexte[]): Set<Situation> {
  return new Set(catalogue(schemas, contextes).flatMap((e) => e.situations));
}

export interface DemandeIsolee {
  situations: Situation[];
  niveau: Niveau;
  graine: string;
  /** Contextes permis (tous si absent). */
  contextes?: string[];
  variante?: number;
}

export type ResultatIsole =
  | { ok: true; probleme: Probleme }
  | { ok: false; message: string; proches: Situation[][] };

export function genererIsole(d: DemandeIsolee, schemas: Schema[], contextes: Contexte[]): ResultatIsole {
  const cat = catalogue(schemas, contextes).filter((e) => e.niveau === d.niveau && (!d.contextes || d.contextes.includes(e.contexteId)));
  const ok = cat.filter((e) => d.situations.every((s) => e.situations.includes(s)));
  if (ok.length === 0) {
    // combinaisons les plus proches, pour guider l'enseignant
    const score = (e: EntreeCatalogue) => d.situations.filter((s) => e.situations.includes(s)).length;
    const max = Math.max(0, ...cat.map(score));
    const proches = [...new Map(cat.filter((e) => score(e) === max && max > 0)
      .map((e) => [e.situations.join("+"), e.situations])).values()].slice(0, 5);
    return { ok: false, message: "Aucun schéma ne combine encore toutes ces situations à ce niveau.", proches };
  }
  // on privilégie les problèmes les plus courts qui contiennent toutes les situations demandées
  const minEtapes = Math.min(...ok.map((e) => e.situations.length));
  const choix = rngFor(d.graine, "isole", d.variante ?? 0).pick(ok.filter((e) => e.situations.length <= minEtapes + 1));
  const schema = schemas.find((s) => s.id === choix.schemaId)!;
  const contexte = contextes.find((c) => c.id === choix.contexteId)!;
  const probleme = genererProbleme({
    schema, contexte, niveau: d.niveau, jour: 1, graine: d.graine, inconnue: choix.inconnue,
    chemin: `ISOLE/${d.situations.join("+")}/N${d.niveau}~${d.variante ?? 0}`,
  });
  return { ok: true, probleme };
}
