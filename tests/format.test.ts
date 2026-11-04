import { describe, expect, it } from "vitest";
import { Q } from "../src/core/rational";
import { formatDuree, formatEuros, formatFraction, formatHeure, formatMesure, formatNombre } from "../src/langue/format";

const F = " ", N = " ";

describe("nombres exacts", () => {
  it("0,1 + 0,2 = 0,3 exactement", () => expect(Q.from("0.1").add(Q.from("0.2")).eq(Q.from("0.3"))).toBe(true));
  it("décimales", () => {
    expect(Q.from("47.5").decimales).toBe(1);
    expect(Q.of(1, 3).decimales).toBe(Infinity);
    expect(Q.of(3, 4).decimales).toBe(2);
  });
});

describe("formatage à la française", () => {
  it("espace fine pour les milliers", () => {
    expect(formatNombre(1200)).toBe(`1${F}200`);
    expect(formatNombre(999)).toBe("999");
    expect(formatNombre(1234567)).toBe(`1${F}234${F}567`);
  });
  it("virgule décimale", () => {
    expect(formatNombre(Q.from("2.5"))).toBe("2,5");
    expect(formatNombre(Q.from("1250.75"))).toBe(`1${F}250,75`);
  });
  it("euros", () => {
    expect(formatEuros(Q.from("47.5"))).toBe(`47,50${N}€`);
    expect(formatEuros(12)).toBe(`12${N}€`);
    expect(formatEuros(Q.from("0.05"))).toBe(`0,05${N}€`);
  });
  it("mesures", () => expect(formatMesure(36, "kg")).toBe(`36${N}kg`));
  it("durées et heures", () => {
    expect(formatDuree(112)).toBe(`1${N}h${N}52`);
    expect(formatDuree(45)).toBe(`45${N}min`);
    expect(formatDuree(120)).toBe(`2${N}h`);
    expect(formatDuree(65)).toBe(`1${N}h${N}05`);
    expect(formatHeure(510)).toBe(`8${N}h${N}30`);
  });
  it("fractions", () => {
    expect(formatFraction(Q.of(3, 4))).toBe("3⁄4");
    expect(formatNombre(Q.of(2, 3))).toBe("2⁄3");
  });
});
