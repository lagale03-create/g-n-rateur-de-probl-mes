/**
 * Interface provisoire (étape 2).
 *  - Mode enseignant : la semaine complète, avec le corrigé détaillé.
 *  - Mode élève (adresse se terminant par #eleve) : l'élève choisit son niveau et son jour,
 *    et peut afficher la correction de chaque problème avec le bouton « Voir la correction ».
 * L'interface complète (édition, verrouillage, exports) arrive à l'étape 4.
 */
import { useEffect, useMemo, useState } from "react";
import { genererSemaine, type Semaine } from "../core/semaine";
import { nouvelleGraine } from "../core/rng";
import { correctionEleve } from "../core/correction";
import { PROGRESSION } from "../data/progression";
import { schemaParId } from "../data/schemas";
import { CONTEXTES } from "../data/contextes";
import type { Niveau, Probleme } from "../core/types";

const disponibles = PROGRESSION.filter((s) => s.schemas.length > 0);
type Mode = "enseignant" | "eleve";
type JourChoisi = "jour1" | "jour2" | "evaluation";

const cadre = { border: "1px solid #2e75b6", background: "#eaf2fb", padding: 12, margin: "8px 0", borderRadius: 4 };

function Enonce({ p, i }: { p: Probleme; i: number }) {
  return (
    <>
      <b>Problème {i} : {p.titreContexte}</b>
      <p>{p.enonce}</p>
      {p.guidees.length > 0
        ? <ol type="a">{p.guidees.map((g, k) => <li key={k}>{g}</li>)}</ol>
        : <p><b>{p.question}</b></p>}
    </>
  );
}

function ProbEnseignant({ p, i }: { p: Probleme; i: number }) {
  return (
    <div style={cadre}>
      <Enonce p={p} i={i} />
      <details>
        <summary>Corrigé enseignant</summary>
        <ul>{p.etapes.map((e, k) => <li key={k}>{e.texte}</li>)}</ul>
        {p.parasites.length > 0 && <p><i>Données parasites :</i> {p.parasites.join(" ")}</p>}
        <p><b>{p.reponse}</b></p>
      </details>
    </div>
  );
}

function ProbEleve({ p, i, correction }: { p: Probleme; i: number; correction: boolean }) {
  const [vue, setVue] = useState(false);
  useEffect(() => setVue(false), [p.id, p.graine]);
  const c = correctionEleve(p);
  return (
    <div style={cadre}>
      <Enonce p={p} i={i} />
      {correction && (
        <>
          <button onClick={() => setVue(!vue)} style={{ fontSize: 16, padding: "6px 14px" }}>
            {vue ? "Cacher la correction" : "Voir la correction"}
          </button>
          {vue && (
            <div style={{ background: "#fff", border: "1px dashed #c55a11", padding: 10, marginTop: 8 }}>
              {c.etapes.map((l, k) => <p key={k} style={{ margin: "4px 0" }}>{l}</p>)}
              {c.parasites && <p style={{ margin: "4px 0" }}><i>{c.parasites}</i></p>}
              <p style={{ margin: "8px 0 0" }}><b>Ma phrase réponse : {c.reponse}</b></p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function App() {
  const [mode, setMode] = useState<Mode>(() => (location.hash === "#eleve" ? "eleve" : "enseignant"));
  const [num, setNum] = useState(disponibles[0].numero);
  const [graine, setGraine] = useState("DEMO-2026");
  const [niveau, setNiveau] = useState<Niveau>(1);
  const [jour, setJour] = useState<JourChoisi>("jour1");

  useEffect(() => {
    const f = () => setMode(location.hash === "#eleve" ? "eleve" : "enseignant");
    addEventListener("hashchange", f);
    return () => removeEventListener("hashchange", f);
  }, []);

  const sem: Semaine | string = useMemo(() => {
    const p = disponibles.find((s) => s.numero === num)!;
    try {
      return genererSemaine({
        numero: num, titre: p.titre, graine, contextes: CONTEXTES,
        schemas: p.schemas.map(schemaParId), principal: p.principal ? schemaParId(p.principal) : undefined,
      });
    } catch (e) { return String(e); }
  }, [num, graine]);

  const choixSemaine = (
    <>
      Semaine{" "}
      <select value={num} onChange={(e) => setNum(Number(e.target.value))}>
        {disponibles.map((s) => <option key={s.numero} value={s.numero}>S{s.numero} : {s.titre}</option>)}
      </select>{" "}
      Graine <input value={graine} onChange={(e) => setGraine(e.target.value)} size={12} />{" "}
    </>
  );

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <p style={{ textAlign: "right" }}>
        <a href={mode === "eleve" ? "#" : "#eleve"}>{mode === "eleve" ? "Mode enseignant" : "Mode élève"}</a>
      </p>
      <h1 style={{ color: "#1f3864" }}>Problèmes à étapes CM1-CM2{mode === "eleve" && " · Élève"}</h1>

      {typeof sem === "string" && <p style={{ color: "red" }}>{sem}</p>}

      {mode === "enseignant" && typeof sem !== "string" && (
        <>
          <p>{choixSemaine}<button onClick={() => setGraine(nouvelleGraine())}>Nouvelle graine</button></p>
          {([1, 2, 3] as Niveau[]).map((n) => {
            const ns = sem.niveaux[n]!;
            return (
              <section key={n}>
                {([["Jour 1", ns.jour1], ["Jour 2", ns.jour2], ["Évaluation", [ns.evaluation]]] as const).map(([nom, l]) => (
                  <div key={nom}>
                    <h2 style={{ color: "#c55a11" }}>Niveau {"★".repeat(n)} · {nom}</h2>
                    {l.map((p, i) => <ProbEnseignant key={p.id} p={p} i={i + 1} />)}
                  </div>
                ))}
              </section>
            );
          })}
        </>
      )}

      {mode === "eleve" && typeof sem !== "string" && (
        <>
          <p>
            {choixSemaine}
            Niveau{" "}
            <select value={niveau} onChange={(e) => setNiveau(Number(e.target.value) as Niveau)}>
              <option value={1}>★</option><option value={2}>★★</option><option value={3}>★★★</option>
            </select>{" "}
            <select value={jour} onChange={(e) => setJour(e.target.value as JourChoisi)}>
              <option value="jour1">Jour 1</option><option value="jour2">Jour 2</option><option value="evaluation">Évaluation</option>
            </select>
          </p>
          <h2 style={{ color: "#c55a11" }}>
            Niveau {"★".repeat(niveau)} · {jour === "jour1" ? "Jour 1" : jour === "jour2" ? "Jour 2" : "Évaluation"}
          </h2>
          {niveau === 3 && <p><b>Attention : certaines informations ne servent à rien ! Surligne d'abord les données utiles.</b></p>}
          {jour === "evaluation" && <p><i>Pendant l'évaluation, la correction n'est pas disponible.</i></p>}
          {(() => {
            const ns = sem.niveaux[niveau]!;
            const liste = jour === "evaluation" ? [ns.evaluation] : ns[jour];
            return liste.map((p, i) => <ProbEleve key={p.id} p={p} i={i + 1} correction={jour !== "evaluation"} />);
          })()}
        </>
      )}
    </div>
  );
}
