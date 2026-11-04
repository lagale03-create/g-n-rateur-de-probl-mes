/** Génère une semaine complète, l'exporte en .docx et vérifie la structure du document. */
import { describe, expect, it } from "vitest";
import JSZip from "jszip";
import { genererSemaine } from "../src/core/semaine";
import { semaineProg } from "../src/data/progression";
import { schemaParId } from "../src/data/schemas";
import { CONTEXTES } from "../src/data/contextes";
import { CONSIGNE_3, nomFichier, semaineEnBuffer } from "../src/export/docx";

const compte = (s: string, motif: string | RegExp) =>
  (s.match(typeof motif === "string" ? new RegExp(motif.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g") : motif) ?? []).length;

async function exporter(graine: string) {
  const p = semaineProg(5);
  const sem = genererSemaine({
    numero: 5, titre: p.titre, graine, contextes: CONTEXTES,
    schemas: p.schemas.map(schemaParId), principal: p.principal ? schemaParId(p.principal) : undefined,
  });
  const zip = await JSZip.loadAsync(await semaineEnBuffer(sem));
  const fichiers = Object.keys(zip.files);
  const lire = (f: string) => zip.file(f)!.async("string");
  const doc = await lire("word/document.xml");
  const footers = await Promise.all(fichiers.filter((f) => /word\/footer\d*\.xml/.test(f)).map(lire));
  // texte brut (le contenu des balises <w:t>), pour compter les titres
  const texte = [...doc.matchAll(/<w:t(?: [^>]*)?>([^<]*)<\/w:t>/g)].map((m) => m[1]).join("¶")
    .replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  return { sem, doc, texte, styles: await lire("word/styles.xml"), footers };
}

describe("export Word", () => {
  it("nom de fichier", () => {
    expect(nomFichier(8, "Décimaux et monnaie")).toBe("S08_Decimaux_et_monnaie.docx");
    expect(nomFichier(19, "Passage à l'unité et linéarité additive")).toBe("S19_Passage_a_l_unite_et_linearite_additive.docx");
  });

  it("structure de la semaine", async () => {
    const { sem, doc, texte, styles, footers } = await exporter("DOCX-1");
    // A4, marges de 2 cm
    expect(doc).toContain('w:w="11906"');
    expect(doc).toContain('w:h="16838"');
    expect(doc).toMatch(/w:top="1134"[^>]*w:right="1134"[^>]*w:bottom="1134"[^>]*w:left="1134"/);
    expect(styles).toContain("Arial");
    // 3 niveaux × 3 jours = 9 sections élèves + 1 corrigé, chacune sur une nouvelle page
    expect(compte(doc, "<w:sectPr")).toBe(10);
    for (const n of ["★", "★★", "★★★"]) {
      for (const j of ["Jour 1", "Jour 2", "Évaluation"]) expect(texte).toContain(`Niveau ${n} · ${j}`);
    }
    expect(compte(texte, "Prénom : ")).toBe(9);
    // pied de page « Semaine 5 · page N »
    expect(footers.join()).toContain("Semaine 5 · page ");
    expect(footers.join()).toMatch(/PAGE/);
    // énoncés : 9 problèmes par niveau, puis les mêmes dans le corrigé
    expect(compte(texte, /Problème \d : /g)).toBe(2 * 3 * 9);
    // cadre de recherche : ★★ et ★★★ (9 chacun) + évaluation ★
    expect(compte(texte, "Je cherche, je calcule :")).toBe(19);
    expect(compte(texte, "Ma phrase réponse :")).toBe(19);
    // consigne ★★★ en tête de chaque fiche ★★★
    expect(compte(texte, CONSIGNE_3)).toBe(3);
    // questions guidées du niveau ★ (Jours 1 et 2)
    const nbGuidees = [...sem.niveaux[1]!.jour1, ...sem.niveaux[1]!.jour2].reduce((s, p) => s + p.guidees.length, 0);
    expect(compte(texte, /¶[a-f]\) ¶/g)).toBe(nbGuidees);
    // corrigé à la fin
    expect(compte(texte, "NE PAS DISTRIBUER")).toBe(1);
    expect(texte.lastIndexOf("Je cherche, je calcule :")).toBeLessThan(texte.indexOf("NE PAS DISTRIBUER"));
    const p1 = sem.niveaux[2]!.jour1[0];
    expect(texte).toContain(p1.etapes[0].calcul);
    expect(texte).toContain(`Réponse : ${p1.reponse}`);
  });

  it("chaque problème et chaque énoncé figurent dans le document", async () => {
    const { sem, texte } = await exporter("DOCX-2");
    for (const ns of Object.values(sem.niveaux)) {
      for (const p of [...ns!.jour1, ...ns!.jour2, ns!.evaluation]) {
        expect(texte).toContain(p.enonce);
        if (p.guidees.length === 0) expect(texte).toContain(p.question);
        p.guidees.forEach((g) => expect(texte).toContain(g));
      }
    }
  });
});
