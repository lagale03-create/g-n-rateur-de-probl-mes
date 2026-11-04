/** npm run docx -- 5 GRAINE → écrit docs/S05_….docx */
import { writeFileSync } from "node:fs";
import { genererSemaine } from "../src/core/semaine";
import { semaineProg } from "../src/data/progression";
import { schemaParId } from "../src/data/schemas";
import { CONTEXTES } from "../src/data/contextes";
import { nomFichier, semaineEnBuffer } from "../src/export/docx";

const num = Number(process.argv[2] ?? 5);
const graine = process.argv[3] ?? "DEMO-2026";
const prog = semaineProg(num);
const sem = genererSemaine({
  numero: num, titre: prog.titre, graine, contextes: CONTEXTES,
  schemas: prog.schemas.map(schemaParId), principal: prog.principal ? schemaParId(prog.principal) : undefined,
});
const f = `docs/${nomFichier(num, prog.titre)}`;
writeFileSync(f, await semaineEnBuffer(sem));
console.log(f);
