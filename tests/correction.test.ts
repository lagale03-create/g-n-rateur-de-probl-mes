import { describe, expect, it } from "vitest";
import { genererProbleme } from "../src/core/moteur";
import { correctionEleve } from "../src/core/correction";
import { consommationStock } from "../src/data/schemas/consommationStock";
import { zoo } from "../src/data/contextes/zoo";
import type { Niveau } from "../src/core/types";

describe("correction élève", () => {
  for (const niveau of [1, 2, 3] as Niveau[]) {
    it(`niveau ${niveau} : une ligne par étape, sans vocabulaire enseignant`, () => {
      const p = genererProbleme({ schema: consommationStock, contexte: zoo, niveau, jour: 1, graine: "C", chemin: "c" });
      const c = correctionEleve(p);
      expect(c.etapes).toHaveLength(p.etapes.length);
      c.etapes.forEach((l, i) => {
        expect(l).toContain(p.etapes[i].calcul);
        expect(l).not.toMatch(/Réitération|Partage|Union|Retrait|Groupement/);
      });
      expect(c.reponse).toBe(p.reponse);
      expect(c.parasites !== null).toBe(niveau === 3);
    });
  }
});
