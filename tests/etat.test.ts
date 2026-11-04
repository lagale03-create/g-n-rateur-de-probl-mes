import { describe, expect, it } from "vitest";
import {
  basculerVerrou, CONFIG_DEFAUT, creerEvaluation, evoluerJour2, genererJour1, jour2Obsolete, modifierTexte,
  regenerer, retablirOriginal, sessionVide, versExport,
} from "../src/ui/etat";

const base = () => genererJour1(sessionVide({ ...CONFIG_DEFAUT, graine: "ETAT" }));

describe("séance de préparation", () => {
  it("Jour 1, Jour 2 puis évaluation", () => {
    const s = creerEvaluation(evoluerJour2(base()));
    for (const n of [1, 2, 3] as const) {
      const ns = s.niveaux[n]!;
      expect(ns.jour1).toHaveLength(4);
      ns.jour2.forEach((e, i) => {
        expect(e!.p.contexteId).toBe(ns.jour1[i].p.contexteId);
        expect(e!.p.inconnue).not.toBe(ns.jour1[i].p.inconnue);
      });
      expect(ns.jour1.map((e) => e.p.contexteId)).not.toContain(ns.evaluation!.p.contexteId);
    }
  });

  it("les mêmes réglages donnent la même semaine que la génération directe", () => {
    const a = creerEvaluation(evoluerJour2(base()));
    const b = creerEvaluation(evoluerJour2(base()));
    expect(versExport(a)).toEqual(versExport(b));
  });

  it("régénérer un problème ne touche pas aux autres", () => {
    const s = base();
    const r = regenerer(s, 2, "jour1", 1);
    expect(r.niveaux[2]!.jour1[1].p.enonce).not.toBe(s.niveaux[2]!.jour1[1].p.enonce);
    expect(r.niveaux[2]!.jour1[1].p.contexteId).toBe(s.niveaux[2]!.jour1[1].p.contexteId);
    for (const i of [0, 2, 3]) expect(r.niveaux[2]!.jour1[i]).toEqual(s.niveaux[2]!.jour1[i]);
    expect(r.niveaux[1]).toEqual(s.niveaux[1]);
  });

  it("un problème verrouillé survit à une nouvelle génération, même avec une autre graine", () => {
    let s = basculerVerrou(base(), 3, "jour1", 2);
    const garde = s.niveaux[3]!.jour1[2].p;
    expect(regenerer(s, 3, "jour1", 2)).toEqual(s);
    s = genererJour1({ ...s, config: { ...s.config, graine: "AUTRE" } });
    expect(s.niveaux[3]!.jour1[2].p).toEqual(garde);
    // son contexte est imposé aux autres niveaux, et n'est pas réutilisé ailleurs
    expect(s.niveaux[1]!.jour1[2].p.contexteId).toBe(garde.contexteId);
    expect(new Set(s.niveaux[1]!.jour1.map((e) => e.p.contexteId)).size).toBe(4);
  });

  it("le Jour 2 signale un Jour 1 régénéré", () => {
    let s = evoluerJour2(base());
    expect(jour2Obsolete(s, 1, 0)).toBe(false);
    s = regenerer(s, 1, "jour1", 0);
    expect(jour2Obsolete(s, 1, 0)).toBe(true);
    s = evoluerJour2(s);
    expect(jour2Obsolete(s, 1, 0)).toBe(false);
  });

  it("les textes modifiés passent dans l'export et peuvent être rétablis", () => {
    let s = modifierTexte(base(), 2, "jour1", 0, { enonce: "Texte de l'enseignant." });
    expect(versExport(s).niveaux[2]!.jour1[0].enonce).toBe("Texte de l'enseignant.");
    s = retablirOriginal(s, 2, "jour1", 0);
    expect(versExport(s).niveaux[2]!.jour1[0].enonce).toBe(base().niveaux[2]!.jour1[0].p.enonce);
  });

  it("niveaux, nombre de problèmes, contextes imposés et exclus", () => {
    const s = genererJour1(sessionVide({ ...CONFIG_DEFAUT, niveaux: [2], nbProblemes: 3, imposes: [null, "zoo"], exclus: ["cantine"] }));
    expect(Object.keys(s.niveaux)).toEqual(["2"]);
    expect(s.niveaux[2]!.jour1).toHaveLength(3);
    expect(s.niveaux[2]!.jour1[1].p.contexteId).toBe("zoo");
    expect(s.niveaux[2]!.jour1.map((e) => e.p.contexteId)).not.toContain("cantine");
  });

  it("notion libre", () => {
    const s = genererJour1(sessionVide({ ...CONFIG_DEFAUT, source: "libre", titreLibre: "Révisions", schemasLibres: ["achat-unite"] }));
    expect(versExport(s).titre).toBe("Révisions");
    expect(s.niveaux[1]!.jour1.every((e) => e.p.schemaId === "achat-unite")).toBe(true);
  });

  it("toutes les semaines de la progression ont des schémas", () => {
    for (let n = 1; n <= 36; n++) expect(() => genererJour1(sessionVide({ ...CONFIG_DEFAUT, numero: n }))).not.toThrow();
  });
});
