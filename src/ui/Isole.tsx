/** Mode « problème isolé » : choisir les situations à combiner et le niveau. */
import { useMemo, useState } from "react";
import { genererIsole, situationsDisponibles, type ResultatIsole } from "../core/isole";
import { nouvelleGraine } from "../core/rng";
import type { Niveau, Situation } from "../core/types";
import { CONTEXTES } from "../data/contextes";
import { SCHEMAS } from "../data/schemas";
import { semaineEnBlob } from "../export/docx";
import { Carte } from "./Carte";
import { telechargerBlob } from "./telecharger";

const TOUTES: Situation[] = [
  "Union", "Retrait", "Différence", "Comparaison", "Recherche de l'état initial", "Réitération", "Partage",
  "Groupement", "Groupement avec reste", "Fraction d'une quantité", "Retrouver le tout", "Passage à l'unité",
  "Linéarité multiplicative", "Linéarité additive", "Pourcentage", "Conversion", "Durée", "Périmètre", "Aire",
  "Volume", "Échelle", "Vitesse", "Lecture de tableau", "Lecture de graphique", "Probabilité", "Partage inégal",
  "Essais et ajustements",
];

export function Isole() {
  const dispo = useMemo(() => situationsDisponibles(SCHEMAS, CONTEXTES), []);
  const [choix, setChoix] = useState<Situation[]>(["Union", "Groupement"]);
  const [niveau, setNiveau] = useState<Niveau>(2);
  const [graine, setGraine] = useState("ISOLE-1");
  const [variante, setVariante] = useState(0);
  const [res, setRes] = useState<ResultatIsole | null>(null);

  const generer = (v: number) => {
    setVariante(v);
    try {
      setRes(genererIsole({ situations: choix, niveau, graine, variante: v }, SCHEMAS, CONTEXTES));
    } catch (e) {
      setRes({ ok: false, message: String(e), proches: [] });
    }
  };

  const exporter = async () => {
    if (!res?.ok) return;
    const blob = await semaineEnBlob({ numero: 0, titre: "Problème isolé", graine, niveaux: { [niveau]: { jour1: [res.probleme], jour2: [] } } });
    telechargerBlob(blob, `Probleme_isole_${res.probleme.contexteId}.docx`);
  };

  return (
    <>
      <section className="panneau">
        <h2>Situations à combiner</h2>
        <div className="situations">
          {TOUTES.map((s) => (
            <label key={s} className={dispo.has(s) ? "" : "indispo"} title={dispo.has(s) ? "" : "Aucun schéma ne produit encore cette situation"}>
              <input type="checkbox" disabled={!dispo.has(s)} checked={choix.includes(s)}
                onChange={(e) => setChoix(e.target.checked ? [...choix, s] : choix.filter((x) => x !== s))} /> {s}
            </label>
          ))}
        </div>
        <p className="aide">Les situations grisées ne sont produites par aucun schéma à ce niveau de combinaison.</p>
        <div className="ligne">
          <span className="titre"><b>Niveau</b></span>
          {([1, 2, 3] as Niveau[]).map((n) => (
            <label key={n}><input type="radio" checked={niveau === n} onChange={() => setNiveau(n)} /> {"★".repeat(n)}</label>
          ))}
          <span style={{ width: 16 }} />
          <b>Graine</b> <input value={graine} size={12} onChange={(e) => setGraine(e.target.value.trim() || "A")} />
          <button className="petit" onClick={() => setGraine(nouvelleGraine())}>Nouvelle graine</button>
        </div>
      </section>

      <div className="actions">
        <button className="principal" onClick={() => generer(0)} disabled={choix.length === 0}>Générer le problème</button>
        <button onClick={() => generer(variante + 1)} disabled={!res?.ok}>Autre version</button>
        <span className="sep" />
        <button className="export" onClick={exporter} disabled={!res?.ok}>Exporter ce problème (.docx)</button>
      </div>

      {res && !res.ok && (
        <div className="erreur">
          {res.message}
          {res.proches.length > 0 && (
            <>
              <br />Combinaisons possibles les plus proches :
              <ul>{res.proches.map((p) => <li key={p.join()}>{p.join(" + ")}</li>)}</ul>
            </>
          )}
        </div>
      )}
      {res?.ok && <div className="paires"><Carte p={res.probleme} numero={1} /></div>}
    </>
  );
}
