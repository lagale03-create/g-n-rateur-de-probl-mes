import { describe, expect, it } from "vitest";
import { Q } from "../src/core/rational";
import { pluriel } from "../src/langue/grammaire";
import { rendre, type EnvRendu } from "../src/langue/rendu";

describe("grammaire", () => {
  it("pluriels", () => {
    expect(pluriel({ s: "pot de confiture" })).toBe("pots de confiture");
    expect(pluriel({ s: "cheval" })).toBe("chevaux");
    expect(pluriel({ s: "bocal de compote" })).toBe("bocaux de compote");
    expect(pluriel({ s: "gâteau" })).toBe("gâteaux");
    expect(pluriel({ s: "lynx" })).toBe("lynx");
  });
  it("gabarits : accords, élisions, majuscules", () => {
    const env: EnvRendu = {
      valeurs: { n: Q.of(3), u: Q.of(1), r: Q.from("2.5") },
      grandeurs: { n: "compte", u: "compte", r: "quantite" },
      unites: { quantite: "L" },
      mots: { A: { s: "adulte", voy: true }, e: { s: "eau", g: "f", voy: true }, t: { s: "tarte", g: "f" }, a: { s: "arbre", voy: true } },
      lettres: new Set(),
    };
    expect(rendre("il y a {n} [A:n] et {u} [A:u]. chaque [A] boit {r} [de:e] ?", env))
      .toBe("Il y a 3 adultes et 1 adulte. Chaque adulte boit 2,5 L d'eau ?");
    expect(rendre("[le:t] [t], [le:a] [a], [un:t] [t]", env)).toBe("La tarte, l'arbre, une tarte");
    expect(rendre("{n} [A:n]", { ...env, lettres: new Set(["n"]) })).toBe("Trois adultes");
  });
});
