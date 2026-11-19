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
// CM2 (★★★) : chaque semaine, fraction d'une quantité, pourcentage, proportionnalité (problème 3 du jour)
const cm2 = (id: string, g: string) => (genererSemaine({ numero: num, titre: prog.titre, graine: `${graine}-cm2-${g}`, nbProblemes: 1,
  contextes: contextesPour(undefined), schemas: [schemaParId(id)] }).niveaux as any)[3].jour1[0];
const CM2: Record<string, [any, string]> = {
  Lundi: [cm2("fraction-quantite", "L"), "CM2 : fraction d'une quantité"],
  Mardi: [cm2("pourcentage", "M"), "CM2 : pourcentage"],
  Jeudi: [cm2("linearite-mult", "J"), "CM2 : proportionnalité (linéarité)"],
  Vendredi: [cm2(num % 2 ? "achat-unite" : "linearite-add", "V"), "CM2 : proportionnalité (passage à l'unité ou linéarité additive)"],
};
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
    const liste = n === 3 ? [p1, p2, CM2[jour][0]] : [p1, p2];
    const types = ["objectif du jour", type, CM2[jour][1]];
    niveaux[n] = jour === "Jeudi" ? { jour1: [], jour2: liste, evaluation: undefined } // jeudi : étiquette « Jour 2 » sur la fiche
      : jour === "Vendredi" ? { jour1: [], jour2: [], evaluation: liste[0], apres: liste.slice(1) } // vendredi : évaluation, puis « Pour aller plus loin »
      : { jour1: liste, jour2: [], evaluation: undefined };
    r[n] = liste.map((p: any, i: number) => ({ rang: i + 1, type: types[i], contexte: p.titreContexte, enonce: p.enonce, question: p.question,
      situations: p.situations, etapes: p.etapes.map((e: any) => e.texte), reponse: p.reponse, parasites: p.parasites }));
  }
  const s: Semaine = { ...sem, niveaux };
  writeFileSync(`${out}/${jour}.docx`, await semaineEnBuffer(s, { corrige: false }));
  resume[jour] = r;
}
writeFileSync(`${out}/resume.json`, JSON.stringify(resume, null, 1));
console.log("ok", prog.titre);
