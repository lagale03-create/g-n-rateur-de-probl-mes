/** npm exec tsx scripts/cahier.ts -- <semaine> <graine> <dossierSortie>
 * Découpe une semaine du générateur en fichiers par jour pour le cahier journal :
 * lundi = Jour 1 problème 1, mardi = Jour 1 problème 2, jeudi = Jour 2 (problèmes 1 et 2), vendredi = évaluation.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { genererSemaine, type Semaine } from "../src/core/semaine";
import { semaineProg } from "../src/data/progression";
import { schemaParId } from "../src/data/schemas";
import { contextesPour } from "../src/data/contextes";
import { semaineEnBuffer } from "../src/export/docx";

const num = Number(process.argv[2]);
const graine = process.argv[3];
const out = process.argv[4];
mkdirSync(out, { recursive: true });
// notion libre : 5e argument = schémas séparés par des virgules, 6e = titre
const prog0 = semaineProg(num);
const prog = process.argv[5] ? { ...prog0, schemas: process.argv[5].split(","), principal: undefined, titre: process.argv[6] ?? prog0.titre, theme: undefined } : prog0;
const sem = genererSemaine({
  numero: num, titre: prog.titre, graine, nbProblemes: 2, contextes: contextesPour(prog.theme),
  schemas: prog.schemas.map(schemaParId), principal: prog.principal ? schemaParId(prog.principal) : undefined,
});
const filtre = (f: (ns: any) => any): Semaine => ({
  ...sem, niveaux: Object.fromEntries(Object.entries(sem.niveaux).map(([k, ns]) => [k, f(ns)])) as Semaine["niveaux"],
});
const jours: [string, Semaine][] = [
  ["Lundi", filtre((ns) => ({ jour1: [ns.jour1[0]], jour2: [], evaluation: undefined }))],
  ["Mardi", filtre((ns) => ({ jour1: [ns.jour1[1]], jour2: [], evaluation: undefined }))],
  ["Jeudi", filtre((ns) => ({ jour1: [], jour2: ns.jour2, evaluation: undefined }))],
  ["Vendredi", filtre((ns) => ({ jour1: [], jour2: [], evaluation: ns.evaluation }))],
];
const resume: Record<string, unknown> = { numero: num, titre: prog.titre, graine };
for (const [jour, s] of jours) {
  writeFileSync(`${out}/${jour}.docx`, await semaineEnBuffer(s, { corrige: false }));
  resume[jour] = Object.fromEntries(Object.entries(s.niveaux).map(([n, ns]: [string, any]) => [n,
    [...ns.jour1, ...ns.jour2, ...(ns.evaluation ? [ns.evaluation] : [])].map((p: any) => ({
      contexte: p.titreContexte, enonce: p.enonce, question: p.question, guidees: p.guidees, situations: p.situations,
      etapes: p.etapes.map((e: any) => e.texte), reponse: p.reponse, parasites: p.parasites,
    }))]));
}
writeFileSync(`${out}/resume.json`, JSON.stringify(resume, null, 1));
console.log("ok", prog.titre);
