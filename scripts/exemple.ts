/**
 * Génère une semaine et l'affiche en texte (énoncés + corrigé).
 *   npm run exemple -- 5 GRAINE
 */
import { writeFileSync } from "node:fs";
import { genererSemaine } from "../src/core/semaine";
import { semaineProg } from "../src/data/progression";
import { schemaParId } from "../src/data/schemas";
import { contextesPour } from "../src/data/contextes";
import type { Niveau, Probleme } from "../src/core/types";

const num = Number(process.argv[2] ?? 5);
const graine = process.argv[3] ?? "DEMO-2026";
const prog = semaineProg(num);
const sem = genererSemaine({
  numero: num, titre: prog.titre, graine,
  schemas: prog.schemas.map(schemaParId),
  principal: prog.principal ? schemaParId(prog.principal) : undefined,
  contextes: contextesPour(prog.theme),
});

const etoiles = (n: Niveau) => "★".repeat(n);
const L: string[] = [];
L.push(`# Semaine ${num} : ${prog.titre}`, "", `Graine : \`${graine}\``, "");

const probleme = (p: Probleme, i: number | string) => {
  L.push(`**Problème ${i} : ${p.titreContexte}**`, "");
  L.push(p.enonce, "");
  if (p.guidees.length) p.guidees.forEach((g, k) => L.push(`${String.fromCharCode(97 + k)}) ${g}`, ""));
  else L.push(`**${p.question}**`, "");
};

for (const n of [1, 2, 3] as Niveau[]) {
  const ns = sem.niveaux[n]!;
  for (const [nom, liste] of [["Jour 1", ns.jour1], ["Jour 2", ns.jour2], ["Évaluation", [ns.evaluation]]] as const) {
    L.push(`## Niveau ${etoiles(n)} · ${nom}`, "");
    if (n === 3) L.push("> *Attention : certaines informations ne servent à rien ! Surligne d'abord les données utiles.*", "");
    liste.forEach((p, i) => probleme(p, i + 1));
  }
}

L.push("---", "", "# Corrigé enseignant : ne pas distribuer", "");
for (const n of [1, 2, 3] as Niveau[]) {
  const ns = sem.niveaux[n]!;
  L.push(`## Niveau ${etoiles(n)}`, "");
  for (const [nom, liste] of [["Jour 1", ns.jour1], ["Jour 2", ns.jour2], ["Évaluation", [ns.evaluation]]] as const) {
    L.push(`### ${nom}`, "");
    liste.forEach((p, i) => {
      L.push(`**Problème ${i + 1} : ${p.titreContexte}** (situations : ${p.situations.join(", ")} ; on cherche : ${p.inconnue})`, "");
      p.etapes.forEach((e) => L.push(`- ${e.texte}`));
      if (p.parasites.length) L.push(`- *Données parasites :* ${p.parasites.join(" ")}`);
      L.push(`- **Réponse : ${p.reponse}**`, "");
    });
  }
}
const out = L.join("\n");
writeFileSync(`docs/exemple-S${String(num).padStart(2, "0")}.md`, out);
console.log(out);
