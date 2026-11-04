import { describe, expect, it } from "vitest";
import { genererIsole, situationsDisponibles } from "../src/core/isole";
import { SCHEMAS } from "../src/data/schemas";
import { CONTEXTES } from "../src/data/contextes";

describe("problème isolé", () => {
  it("situations disponibles", () => {
    const s = situationsDisponibles(SCHEMAS, CONTEXTES);
    for (const x of ["Union", "Réitération", "Passage à l'unité", "Groupement", "Recherche de l'état initial", "Conversion"] as const) {
      expect(s.has(x)).toBe(true);
    }
  });
  it("combine les situations demandées", () => {
    for (let g = 0; g < 30; g++) {
      const r = genererIsole({ situations: ["Union", "Groupement"], niveau: 2, graine: `I${g}` }, SCHEMAS, CONTEXTES);
      expect(r.ok).toBe(true);
      if (r.ok) expect(r.probleme.situations).toEqual(expect.arrayContaining(["Union", "Groupement"]));
    }
    const r = genererIsole({ situations: ["Passage à l'unité", "Recherche de l'état initial"], niveau: 3, graine: "X" }, SCHEMAS, CONTEXTES);
    expect(r.ok && r.probleme.schemaId).toBe("achat-unite");
  });
  it("explique quand la combinaison n'existe pas encore", () => {
    const r = genererIsole({ situations: ["Probabilité", "Volume"], niveau: 2, graine: "X" }, SCHEMAS, CONTEXTES);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.proches.length).toBeGreaterThan(0);
  });
});
