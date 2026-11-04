import { describe, expect, it } from "vitest";
import JSZip from "jszip";
import { zipEnBuffer } from "../src/export/zip";
import { PROGRESSION } from "../src/data/progression";
import { schemaParId } from "../src/data/schemas";
import { CONTEXTES } from "../src/data/contextes";

describe("export ZIP", () => {
  it("période 1 : un .docx par semaine disponible et un LISEZMOI", async () => {
    const zip = await JSZip.loadAsync(await zipEnBuffer({
      semaines: PROGRESSION.filter((s) => s.periode === 1), graine: "Z", schemaParId, contextes: CONTEXTES,
    }));
    const f = Object.keys(zip.files).sort();
    expect(f).toEqual(["LISEZMOI.txt", "S05_Problemes_a_etapes_mixtes.docx"]);
    expect(await zip.file("LISEZMOI.txt")!.async("string")).toMatch(/S1 : Structures additives/);
  });
  it("année : toutes les semaines disponibles", async () => {
    const zip = await JSZip.loadAsync(await zipEnBuffer({ semaines: PROGRESSION, graine: "Z", schemaParId, contextes: CONTEXTES }));
    expect(Object.keys(zip.files).filter((f) => f.endsWith(".docx"))).toHaveLength(PROGRESSION.filter((s) => s.schemas.length).length);
  });
});
