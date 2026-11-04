/**
 * Pour chaque schéma, chaque contexte compatible et chaque niveau :
 * 1 000 tirages au total par niveau (Jour 1, Jour 2, évaluation), tous validés par le vérificateur.
 */
import { describe, expect, it } from "vitest";
import { genererProbleme } from "../src/core/moteur";
import { SCHEMAS } from "../src/data/schemas";
import { CONTEXTES } from "../src/data/contextes";
import type { Jour, Niveau, Probleme } from "../src/core/types";
import { Q } from "../src/core/rational";

const TIRAGES = 1000;

for (const schema of SCHEMAS) {
  const ctxs = CONTEXTES.filter((c) => c.schemas[schema.id]);
  describe(`schéma ${schema.id}`, () => {
    it("au moins 5 contextes compatibles", () => expect(ctxs.length).toBeGreaterThanOrEqual(5));
    for (const niveau of [1, 2, 3] as Niveau[]) {
      it(`niveau ${niveau} : ${TIRAGES} tirages valides`, () => {
        const inconnues = new Set<string>();
        for (let k = 0; k < TIRAGES; k++) {
          const contexte = ctxs[k % ctxs.length];
          const jour: Jour = k % 2 === 0 ? 1 : 2;
          const p: Probleme = genererProbleme({ schema, contexte, niveau, jour, graine: `T${k}`, chemin: "test" });
          inconnues.add(p.inconnue);
          // contrôles indépendants du vérificateur
          expect(p.enonce).not.toMatch(/[{}[\]]/);
          expect(p.question).toMatch(/\?$/);
          for (const v of Object.values(p.monde)) expect(Q.from(v).isNegative).toBe(false);
          if (niveau === 1) {
            expect(p.guidees.length).toBe(p.etapes.length);
            expect(p.parasites.length).toBe(0);
          }
          if (niveau === 3) expect(p.parasites.length).toBeGreaterThanOrEqual(1);
          if (jour === 2) expect(p.inconnue).not.toBe(schema.structure(niveau, contexte.schemas[schema.id]).j1.inconnue);
        }
        // le Jour 2 utilise bien plusieurs inconnues inversées
        expect(inconnues.size).toBeGreaterThanOrEqual(3);
      });
    }
  });
}

describe("reproductibilité", () => {
  it("même graine → même problème", () => {
    const d = { schema: SCHEMAS[0], contexte: CONTEXTES[0], niveau: 2 as Niveau, jour: 1 as Jour, graine: "ABC", chemin: "x" };
    expect(genererProbleme(d)).toEqual(genererProbleme(d));
    expect(genererProbleme({ ...d, graine: "ABD" }).enonce).not.toBe(genererProbleme(d).enonce);
  });
});
