import { describe, expect, it } from "vitest";
import { genererSemaine } from "../src/core/semaine";
import { semaineProg } from "../src/data/progression";
import { schemaParId } from "../src/data/schemas";
import { CONTEXTES } from "../src/data/contextes";
import type { Niveau } from "../src/core/types";

const gen = (num: number, graine: string) => {
  const p = semaineProg(num);
  return genererSemaine({
    numero: num, titre: p.titre, graine, contextes: CONTEXTES,
    schemas: p.schemas.map(schemaParId), principal: p.principal ? schemaParId(p.principal) : undefined,
  });
};

describe("semaine", () => {
  for (const num of [5, 8, 19]) {
    for (let g = 0; g < 20; g++) {
      it(`S${num} graine ${g} : structure respectée`, () => {
        const s = gen(num, `G${g}`);
        expect(new Set(s.contextes).size).toBe(4);
        expect(s.contextes).not.toContain(s.contexteEval);
        for (const n of [1, 2, 3] as Niveau[]) {
          const ns = s.niveaux[n]!;
          expect(ns.jour1).toHaveLength(4);
          expect(ns.jour2).toHaveLength(4);
          ns.jour2.forEach((p, i) => {
            expect(p.contexteId).toBe(ns.jour1[i].contexteId);
            expect(p.schemaId).toBe(ns.jour1[i].schemaId);
            expect(p.inconnue).not.toBe(ns.jour1[i].inconnue);
            expect(p.monde).not.toEqual(ns.jour1[i].monde);
          });
          expect(ns.evaluation.contexteId).toBe(s.contexteEval);
        }
      });
    }
  }
  it("contextes imposés et exclus", () => {
    const p = semaineProg(5);
    const s = genererSemaine({
      numero: 5, titre: p.titre, graine: "X", contextes: CONTEXTES, schemas: p.schemas.map(schemaParId),
      imposes: ["zoo"], exclus: ["cantine"],
    });
    expect(s.contextes[0]).toBe("zoo");
    expect([...s.contextes, s.contexteEval]).not.toContain("cantine");
  });
});
