/**
 * Mode élève : l'élève choisit son niveau et son jour, et peut afficher la correction
 * de chaque problème. Par défaut, il voit la fiche préparée sur cet ordinateur ;
 * il peut aussi saisir la semaine et le code imprimé sur sa fiche.
 */
import { useEffect, useMemo, useState } from "react";
import { correctionEleve } from "../core/correction";
import { genererSemaine } from "../core/semaine";
import type { Niveau, Probleme } from "../core/types";
import { CONTEXTES } from "../data/contextes";
import { PROGRESSION } from "../data/progression";
import { schemaParId } from "../data/schemas";
import type { SemaineExport } from "../export/docx";
import { aDuContenu, versExport, type Session } from "./etat";

type JourChoisi = "jour1" | "jour2" | "evaluation";
const disponibles = PROGRESSION.filter((s) => s.schemas.length > 0);

function ProbEleve({ p, i, correction }: { p: Probleme; i: number; correction: boolean }) {
  const [vue, setVue] = useState(false);
  useEffect(() => setVue(false), [p.id, p.graine]);
  const c = correctionEleve(p);
  return (
    <div className="carte" style={{ marginBottom: 12 }}>
      <div className="enonce">
        <div className="titre">Problème {i} : {p.titreContexte}</div>
        <p>{p.enonce}</p>
        {p.guidees.length > 0 ? <ul className="guidees">{p.guidees.map((g, k) => <li key={k}><b>{String.fromCharCode(97 + k)})</b> {g}</li>)}</ul> : <p><b>{p.question}</b></p>}
      </div>
      {correction && (
        <div style={{ padding: "8px 12px" }}>
          <button className="principal" onClick={() => setVue(!vue)}>{vue ? "Cacher la correction" : "Voir la correction"}</button>
        </div>
      )}
      {correction && vue && (
        <div className="eleve-corr">
          {c.etapes.map((l, k) => <p key={k}>{l}</p>)}
          {c.parasites && <p><i>{c.parasites}</i></p>}
          <p><b>Ma phrase réponse : {c.reponse}</b></p>
        </div>
      )}
    </div>
  );
}

export function Eleve({ session }: { session: Session }) {
  const classe = aDuContenu(session);
  const [source, setSource] = useState<"classe" | "code">(classe ? "classe" : "code");
  const [num, setNum] = useState(disponibles[0].numero);
  const [code, setCode] = useState("DEMO-2026");
  const [niveau, setNiveau] = useState<Niveau>(1);
  const [jour, setJour] = useState<JourChoisi>("jour1");

  const sem: SemaineExport | string = useMemo(() => {
    if (source === "classe" && classe) return versExport(session);
    const p = disponibles.find((s) => s.numero === num)!;
    try {
      return genererSemaine({
        numero: num, titre: p.titre, graine: code, contextes: CONTEXTES,
        schemas: p.schemas.map(schemaParId), principal: p.principal ? schemaParId(p.principal) : undefined,
      });
    } catch (e) { return String(e); }
  }, [source, classe, session, num, code]);

  const ns = typeof sem === "string" ? undefined : sem.niveaux[niveau];
  const liste = !ns ? [] : jour === "evaluation" ? (ns.evaluation ? [ns.evaluation] : []) : ns[jour];

  return (
    <>
      <section className="panneau">
        <div className="ligne">
          {classe && (
            <select value={source} onChange={(e) => setSource(e.target.value as "classe" | "code")}>
              <option value="classe">La fiche de la classe</option>
              <option value="code">Une fiche avec un code</option>
            </select>
          )}
          {source === "code" && (
            <>
              <select value={num} onChange={(e) => setNum(Number(e.target.value))}>
                {disponibles.map((s) => <option key={s.numero} value={s.numero}>Semaine {s.numero}</option>)}
              </select>
              Code de la fiche <input value={code} size={12} onChange={(e) => setCode(e.target.value.trim())} />
            </>
          )}
          Niveau
          <select value={niveau} onChange={(e) => setNiveau(Number(e.target.value) as Niveau)}>
            <option value={1}>★</option><option value={2}>★★</option><option value={3}>★★★</option>
          </select>
          <select value={jour} onChange={(e) => setJour(e.target.value as JourChoisi)}>
            <option value="jour1">Jour 1</option><option value="jour2">Jour 2</option><option value="evaluation">Évaluation</option>
          </select>
        </div>
      </section>

      {typeof sem === "string" && <div className="erreur">{sem}</div>}
      {typeof sem !== "string" && (
        <>
          <h2 style={{ color: "var(--orange)" }}>
            {sem.numero > 0 ? `Semaine ${sem.numero} : ` : ""}{sem.titre} · Niveau {"★".repeat(niveau)} · {jour === "jour1" ? "Jour 1" : jour === "jour2" ? "Jour 2" : "Évaluation"}
          </h2>
          {niveau === 3 && <div className="info"><b>Attention : certaines informations ne servent à rien ! Surligne d'abord les données utiles.</b></div>}
          {jour === "evaluation" && liste.length > 0 && <div className="info">Pendant l'évaluation, la correction n'est pas disponible.</div>}
          {liste.length === 0 && <div className="info">Ces problèmes ne sont pas encore prêts.</div>}
          {liste.map((p, i) => <ProbEleve key={p.id} p={p} i={i + 1} correction={jour !== "evaluation"} />)}
        </>
      )}
    </>
  );
}
