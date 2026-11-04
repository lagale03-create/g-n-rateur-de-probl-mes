/**
 * Export ZIP d'une période (ou de l'année) : un fichier .docx par semaine.
 * Les semaines dont les schémas ne sont pas encore écrits sont listées dans LISEZMOI.txt.
 */
import JSZip from "jszip";
import { genererSemaine } from "../core/semaine";
import type { Contexte, Schema } from "../core/types";
import type { SemaineProg } from "../data/progression";
import { nomFichier, semaineEnBuffer, semaineEnBlob, type SemaineExport } from "./docx";

export interface OptionsZip {
  semaines: SemaineProg[];
  graine: string;
  schemaParId: (id: string) => Schema;
  contextes: Contexte[];
  /** Semaines déjà préparées dans l'interface (avec verrous et modifications) : elles remplacent la génération. */
  preparees?: Record<number, SemaineExport>;
}

export async function construireZip(o: OptionsZip, binaire: (s: SemaineExport) => Promise<Blob | Buffer>): Promise<JSZip> {
  const zip = new JSZip();
  const absentes: string[] = [];
  for (const s of o.semaines) {
    let sem: SemaineExport | undefined = o.preparees?.[s.numero];
    if (!sem) {
      if (s.schemas.length === 0) {
        absentes.push(`S${s.numero} : ${s.titre}`);
        continue;
      }
      sem = genererSemaine({
        numero: s.numero, titre: s.titre, graine: o.graine, contextes: o.contextes,
        schemas: s.schemas.map(o.schemaParId), principal: s.principal ? o.schemaParId(s.principal) : undefined,
        imposes: s.contextes,
      });
    }
    zip.file(nomFichier(s.numero, s.titre), await binaire(sem));
  }
  const lignes = [`Graine : ${o.graine}`, "", `${o.semaines.length - absentes.length} semaine(s) exportée(s).`];
  if (absentes.length) lignes.push("", "Semaines pas encore disponibles (schémas à venir) :", ...absentes.map((a) => `  - ${a}`));
  zip.file("LISEZMOI.txt", lignes.join("\r\n"));
  return zip;
}

export async function zipEnBlob(o: OptionsZip): Promise<Blob> {
  return (await construireZip(o, (s) => semaineEnBlob(s))).generateAsync({ type: "blob" });
}

export async function zipEnBuffer(o: OptionsZip): Promise<Buffer> {
  return (await construireZip(o, (s) => semaineEnBuffer(s))).generateAsync({ type: "nodebuffer" });
}

export const nomZip = (libelle: string) => `${libelle.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "_")}.zip`;
