import { describe, expect, it } from "vitest";
import JSZip from "jszip";
import { pngSimple, primitives, svgDuVisuel } from "../src/export/graphiques";
import { genererSemaine } from "../src/core/semaine";
import { semaineProg } from "../src/data/progression";
import { schemaParId } from "../src/data/schemas";
import { contextesPour } from "../src/data/contextes";
import { semaineEnBuffer } from "../src/export/docx";
import type { Visuel } from "../src/core/types";

const barres: Visuel = {
  type: "barres", titre: "Visiteurs", colonnes: ["lundi", "mardi", "mercredi"], unite: "visiteurs",
  lignes: [{ label: "", valeurs: [{ texte: "40", nombre: 40 }, { texte: "?", nombre: null }, { texte: "70", nombre: 70 }] }],
};

describe("graphiques", () => {
  it("SVG : barres, inconnue « ? », étiquettes", () => {
    const svg = svgDuVisuel(barres);
    expect(svg.startsWith("<svg")).toBe(true);
    expect(svg).toContain(">?<");
    expect(svg).toContain(">mardi<");
    expect((svg.match(/<rect/g) ?? []).length).toBe(1 + 2); // fond + 2 barres
  });
  it("PNG simplifié valide", () => {
    const png = pngSimple(primitives(barres), 200, 120);
    expect([...png.slice(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  });
  it("secteurs : la somme fait 100 %", () => {
    const p = semaineProg(30);
    const sem = genererSemaine({ numero: 30, titre: p.titre, graine: "G", contextes: contextesPour(), schemas: p.schemas.map(schemaParId), niveaux: [3] });
    for (const pb of sem.niveaux[3]!.jour1) {
      expect(pb.visuel!.type).toBe("secteurs");
      expect(pb.visuel!.lignes[0].valeurs.reduce((s, v) => s + (v.nombre ?? 0), 0)).toBe(100);
    }
  });
  it("le .docx de la semaine 30 contient les images des graphiques", { timeout: 60_000 }, async () => {
    const p = semaineProg(30);
    const sem = genererSemaine({ numero: 30, titre: p.titre, graine: "G", contextes: contextesPour(), schemas: p.schemas.map(schemaParId) });
    const zip = await JSZip.loadAsync(await semaineEnBuffer(sem));
    const images = Object.keys(zip.files).filter((f) => f.startsWith("word/media/"));
    expect(images.length).toBeGreaterThanOrEqual(20); // 27 graphiques ; Word fusionne les images identiques
  });
});
