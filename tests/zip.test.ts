import { describe, expect, it } from "vitest";
import JSZip from "jszip";
import { zipEnBuffer } from "../src/export/zip";
import { PROGRESSION } from "../src/data/progression";
import { schemaParId } from "../src/data/schemas";
import { CONTEXTES } from "../src/data/contextes";

describe("export ZIP", () => {
  it("période 1 : un .docx par semaine", async () => {
    const zip = await JSZip.loadAsync(await zipEnBuffer({
      semaines: PROGRESSION.filter((s) => s.periode === 1), graine: "Z", schemaParId, contextes: CONTEXTES,
    }));
    const f = Object.keys(zip.files).filter((x) => x.endsWith(".docx")).sort();
    expect(f).toHaveLength(7);
    expect(f[0]).toBe("S01_Structures_additives.docx");
  });
  it("les semaines pas encore disponibles sont listées dans LISEZMOI", async () => {
    const zip = await JSZip.loadAsync(await zipEnBuffer({
      semaines: PROGRESSION.filter((s) => s.periode === 2), graine: "Z", schemaParId, contextes: CONTEXTES,
    }));
    expect(await zip.file("LISEZMOI.txt")!.async("string")).toMatch(/S9 : Longueurs/);
  });
  it("année : toutes les semaines disponibles", async () => {
    const zip = await JSZip.loadAsync(await zipEnBuffer({ semaines: PROGRESSION, graine: "Z", schemaParId, contextes: CONTEXTES }));
    expect(Object.keys(zip.files).filter((f) => f.endsWith(".docx"))).toHaveLength(PROGRESSION.filter((s) => s.schemas.length).length);
  });
});
