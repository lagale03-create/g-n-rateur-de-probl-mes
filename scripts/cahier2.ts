/** npm exec tsx scripts/cahier2.ts -- <semaine> <graine> <dossierSortie> [schémas] [titre]
 * Deux problèmes par jour pour le cahier journal. Problème 1 : objectif du jour. Problème 2, plus complexe, pour ceux qui ont fini :
 * lundi et jeudi = même histoire, autre inconnue (état initial, transformation ou état final) ;
 * mardi et vendredi = même histoire au niveau au-dessus (une étape de plus, valeurs plus grandes ; ★★★ : autre inconnue).
 * Vendredi, le problème 1 est l'évaluation.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { genererSemaine, type Semaine } from "../src/core/semaine";
import { semaineProg } from "../src/data/progression";
import { schemaParId } from "../src/data/schemas";
import { contextesPour } from "../src/data/contextes";
import { semaineEnBuffer } from "../src/export/docx";

const num = Number(process.argv[2]); const graine = process.argv[3]; const out = process.argv[4];
mkdirSync(out, { recursive: true });
const prog0 = semaineProg(num);
const prog = process.argv[5] ? { ...prog0, schemas: process.argv[5].split(","), principal: undefined, titre: process.argv[6] ?? prog0.titre, theme: undefined } : prog0;
const sem = genererSemaine({
  numero: num, titre: prog.titre, graine, nbProblemes: 4, contextes: contextesPour(prog.theme),
  schemas: prog.schemas.map(schemaParId), principal: prog.principal ? schemaParId(prog.principal) : undefined,
});
const N: any = sem.niveaux;
const plus = (n: number, i: number) => (n < 3 ? N[n + 1].jour1[i] : N[n].jour2[i]);
const choix: Record<string, (n: number) => [any, any, string]> = {
  Lundi: (n) => [N[n].jour1[0], N[n].jour2[0], "autre inconnue"],
  Mardi: (n) => [N[n].jour1[1], plus(n, 1), n < 3 ? "une étape de plus" : "autre inconnue"],
  Jeudi: (n) => [N[n].jour1[2], N[n].jour2[2], "autre inconnue"],
  Vendredi: (n) => [N[n].evaluation, plus(n, 3), n < 3 ? "une étape de plus" : "autre inconnue"],
};
const resume: Record<string, unknown> = { numero: num, titre: prog.titre, graine };
for (const [jour, f] of Object.entries(choix)) {
  const niveaux: any = {}; const r: any = {};
  for (const n of [1, 2, 3]) {
    const [p1, p2, type] = f(n);
    niveaux[n] = { jour1: [p1, p2], jour2: [], evaluation: undefined };
    r[n] = [p1, p2].map((p: any, i: number) => ({ rang: i + 1, type: i ? type : "objectif du jour", contexte: p.titreContexte, enonce: p.enonce, question: p.question,
      situations: p.situations, etapes: p.etapes.map((e: any) => e.texte), reponse: p.reponse, parasites: p.parasites }));
  }
  const s: Semaine = { ...sem, niveaux };
  writeFileSync(`${out}/${jour}.docx`, await semaineEnBuffer(s, { corrige: false }));
  resume[jour] = r;
}
writeFileSync(`${out}/resume.json`, JSON.stringify(resume, null, 1));
console.log("ok", prog.titre);
