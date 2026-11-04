import { describe, expect, it } from "vitest";
import { genererSemaine } from "../src/core/semaine";
import { semaineProg } from "../src/data/progression";
import { schemaParId } from "../src/data/schemas";
import { contextesPour } from "../src/data/contextes";
import type { Niveau } from "../src/core/types";

const gen = (num: number, graine: string) => {
  const p = semaineProg(num);
  return genererSemaine({
    numero: num, titre: p.titre, graine, contextes: contextesPour(p.theme),
    schemas: p.schemas.map(schemaParId), principal: p.principal ? schemaParId(p.principal) : undefined,
  });
};

describe("semaine", () => {
  for (let num = 1; num <= 36; num++) {
    for (let g = 0; g < 6; g++) {
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
          // évaluation : question finale seule, même au niveau ★
          expect(ns.evaluation.guidees).toHaveLength(0);
          if (n === 1) ns.jour1.forEach((p) => expect(p.guidees.length).toBe(p.etapes.filter((e) => !e.situation.startsWith("Lecture")).length));
        }
      });
    }
  }
  it("contextes imposés et exclus", () => {
    const p = semaineProg(5);
    const s = genererSemaine({
      numero: 5, titre: p.titre, graine: "X", contextes: contextesPour(p.theme), schemas: p.schemas.map(schemaParId),
      imposes: ["zoo"], exclus: ["cantine"],
    });
    expect(s.contextes[0]).toBe("zoo");
    expect([...s.contextes, s.contexteEval]).not.toContain("cantine");
  });
});
