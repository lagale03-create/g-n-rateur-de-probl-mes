import { describe, expect, it } from "vitest";
import { Q } from "../src/core/rational";
import { verifier, type Brouillon } from "../src/core/verificateur";
import type { Structure } from "../src/core/types";

const struct: Structure = {
  variables: { a: { grandeur: "quantite" }, n: { grandeur: "compte" }, c: { grandeur: "quantite" }, s: { grandeur: "quantite" }, r: { grandeur: "quantite" } },
  relations: [{ type: "mul", c: "c", a: "a", b: "n" }, { type: "add", c: "s", a: "c", b: "r" }],
  tirage: [],
  j1: { inconnue: "r", donnees: ["a", "n", "s"] },
  j2: [],
};
const base = (monde: Record<string, string>, over: Partial<Brouillon> = {}): Brouillon => ({
  struct, niveau: 2, donnees: ["a", "n", "s"], inconnue: "r",
  monde: Object.fromEntries(Object.entries(monde).map(([k, v]) => [k, Q.from(v)])),
  citees: new Set(["a", "n", "s"]), parasites: [], guideesManquantes: [], ...over,
});

describe("vérificateur", () => {
  it("accepte un problème correct", () => {
    expect(verifier(base({ a: "7", n: "4", c: "28", s: "40", r: "12" }))).toEqual([]);
  });
  it("refuse un résultat négatif", () => {
    expect(verifier(base({ a: "7", n: "4", c: "28", s: "20", r: "-8" })).join()).toMatch(/négatif/);
  });
  it("refuse une quantité d'objets non entière", () => {
    expect(verifier(base({ a: "8", n: "2.5", c: "20", s: "30", r: "10" })).join()).toMatch(/non entière/);
  });
  it("refuse décimal × décimal", () => {
    expect(verifier(base({ a: "1.5", n: "2.5", c: "3.75", s: "10", r: "6.25" })).join()).toMatch(/décimal × décimal/);
  });
  it("refuse une division par un décimal", () => {
    const b = base({ a: "1.5", n: "4", c: "6", s: "10", r: "4" }, { donnees: ["a", "s", "r"], inconnue: "n", citees: new Set(["a", "s", "r"]) });
    expect(verifier(b).join()).toMatch(/division par un décimal/);
  });
  it("refuse une parasite égale à une donnée utile", () => {
    expect(verifier(base({ a: "7", n: "4", c: "28", s: "40", r: "12" }, { parasites: [Q.of(7)] })).join()).toMatch(/parasite/);
  });
  it("refuse un texte qui révèle l'inconnue ou oublie une donnée", () => {
    const e = verifier(base({ a: "7", n: "4", c: "28", s: "40", r: "12" }, { citees: new Set(["a", "n", "r"]) })).join();
    expect(e).toMatch(/absente du texte : s/);
    expect(e).toMatch(/révèle r/);
  });
  it("refuse une incohérence de calcul", () => {
    expect(verifier(base({ a: "7", n: "4", c: "28", s: "40", r: "13" })).join()).toMatch(/incohérent/);
  });
});
