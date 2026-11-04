/**
 * Interface provisoire (étape 2) : génère une semaine et l'affiche avec son corrigé.
 * L'interface complète (édition, verrouillage, exports) arrive à l'étape 4.
 */
import { useMemo, useState } from "react";
import { genererSemaine, type Semaine } from "../core/semaine";
import { nouvelleGraine } from "../core/rng";
import { PROGRESSION } from "../data/progression";
import { schemaParId } from "../data/schemas";
import { CONTEXTES } from "../data/contextes";
import type { Niveau, Probleme } from "../core/types";

const disponibles = PROGRESSION.filter((s) => s.schemas.length > 0);

function Prob({ p, i }: { p: Probleme; i: number }) {
  return (
    <div style={{ border: "1px solid #2e75b6", background: "#eaf2fb", padding: 12, margin: "8px 0", borderRadius: 4 }}>
      <b>Problème {i} : {p.titreContexte}</b>
      <p>{p.enonce}</p>
      {p.niveau === 1
        ? <ol type="a">{p.guidees.map((g, k) => <li key={k}>{g}</li>)}</ol>
        : <p><b>{p.question}</b></p>}
      <details>
        <summary>Corrigé</summary>
        <ul>{p.etapes.map((e, k) => <li key={k}>{e.texte}</li>)}</ul>
        {p.parasites.length > 0 && <p><i>Données parasites :</i> {p.parasites.join(" ")}</p>}
        <p><b>{p.reponse}</b></p>
      </details>
    </div>
  );
}

export function App() {
  const [num, setNum] = useState(disponibles[0].numero);
  const [graine, setGraine] = useState("DEMO-2026");
  const sem: Semaine | string = useMemo(() => {
    const p = disponibles.find((s) => s.numero === num)!;
    try {
      return genererSemaine({
        numero: num, titre: p.titre, graine, contextes: CONTEXTES,
        schemas: p.schemas.map(schemaParId), principal: p.principal ? schemaParId(p.principal) : undefined,
      });
    } catch (e) { return String(e); }
  }, [num, graine]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1 style={{ color: "#1f3864" }}>Problèmes à étapes CM1-CM2</h1>
      <p>
        Semaine{" "}
        <select value={num} onChange={(e) => setNum(Number(e.target.value))}>
          {disponibles.map((s) => <option key={s.numero} value={s.numero}>S{s.numero} : {s.titre}</option>)}
        </select>{" "}
        Graine <input value={graine} onChange={(e) => setGraine(e.target.value)} />{" "}
        <button onClick={() => setGraine(nouvelleGraine())}>Nouvelle graine</button>
      </p>
      {typeof sem === "string" ? <p style={{ color: "red" }}>{sem}</p> : ([1, 2, 3] as Niveau[]).map((n) => {
        const ns = sem.niveaux[n]!;
        return (
          <section key={n}>
            {([["Jour 1", ns.jour1], ["Jour 2", ns.jour2], ["Évaluation", [ns.evaluation]]] as const).map(([nom, l]) => (
              <div key={nom}>
                <h2 style={{ color: "#c55a11" }}>Niveau {"★".repeat(n)} · {nom}</h2>
                {l.map((p, i) => <Prob key={p.id} p={p} i={i + 1} />)}
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
