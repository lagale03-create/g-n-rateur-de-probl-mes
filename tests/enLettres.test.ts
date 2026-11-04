import { describe, expect, it } from "vitest";
import { enLettres } from "../src/langue/enLettres";

describe("nombres en lettres", () => {
  const cas: [number, string][] = [
    [0, "zéro"], [1, "un"], [16, "seize"], [17, "dix-sept"], [21, "vingt et un"], [22, "vingt-deux"],
    [31, "trente et un"], [70, "soixante-dix"], [71, "soixante et onze"], [72, "soixante-douze"],
    [77, "soixante-dix-sept"], [80, "quatre-vingts"], [81, "quatre-vingt-un"], [87, "quatre-vingt-sept"],
    [90, "quatre-vingt-dix"], [91, "quatre-vingt-onze"], [99, "quatre-vingt-dix-neuf"], [100, "cent"],
    [101, "cent un"], [147, "cent quarante-sept"], [180, "cent quatre-vingts"], [200, "deux cents"],
    [201, "deux cent un"], [280, "deux cent quatre-vingts"], [1000, "mille"], [1001, "mille un"],
    [2000, "deux mille"], [80000, "quatre-vingt mille"], [200000, "deux cent mille"],
    [1200, "mille deux cents"], [1_000_000, "un million"], [2_500_000, "deux millions cinq cent mille"],
    [80_000_000, "quatre-vingts millions"], [3_000_000_000, "trois milliards"],
  ];
  for (const [n, s] of cas) it(`${n} → ${s}`, () => expect(enLettres(n)).toBe(s));
  it("orthographe rectifiée", () => {
    expect(enLettres(21, { rectifiee: true })).toBe("vingt-et-un");
    expect(enLettres(1247, { rectifiee: true })).toBe("mille-deux-cent-quarante-sept");
  });
});
