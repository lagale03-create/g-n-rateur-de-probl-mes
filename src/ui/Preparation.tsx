/** Écran principal de l'enseignant : réglages, génération Jour 1 / Jour 2 / évaluation, aperçu et exports. */
import { useState } from "react";
import { nouvelleGraine } from "../core/rng";
import type { Niveau } from "../core/types";
import { contextesPour } from "../data/contextes";
import { PROGRESSION } from "../data/progression";
import { SCHEMAS, schemaParId } from "../data/schemas";
import { nomFichier, semaineEnBlob } from "../export/docx";
import { nomZip, zipEnBlob } from "../export/zip";
import { Carte, cherche } from "./Carte";
import {
  aDuContenu, basculerVerrou, creerEvaluation, evoluerJour2, genererJour1, jour2Obsolete, modifierTexte,
  periodeDe, regenerer, retablirOriginal, titreSession, versExport, type Config, type JourEtat, type Session,
} from "./etat";
import { telechargerBlob } from "./telecharger";

const etoiles = (n: Niveau) => "★".repeat(n);

export function Preparation({ session, setSession }: { session: Session; setSession: (s: Session) => void }) {
  const [erreur, setErreur] = useState<string | null>(null);
  const [niveauVu, setNiveauVu] = useState<Niveau>(session.config.niveaux[0] ?? 1);
  const [exportPeriode, setExportPeriode] = useState<string>(String(periodeDe(session.config.numero)));
  const [travail, setTravail] = useState(false);
  const c = session.config;

  const agir = (f: (s: Session) => Session) => {
    try {
      setSession(f(session));
      setErreur(null);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : String(e));
    }
  };

  /** Changer de semaine ou de notion efface la préparation en cours (après confirmation s'il y a des verrous). */
  const changerConfig = (maj: Partial<Config>, efface: boolean) => {
    const verrous = Object.values(session.niveaux).some((ns) =>
      [...ns!.jour1, ...ns!.jour2, ns!.evaluation].some((e) => e?.verrou));
    if (efface && aDuContenu(session) && verrous && !confirm("Changer de semaine efface les problèmes préparés, y compris ceux qui sont verrouillés. Continuer ?")) return;
    setSession({ config: { ...c, ...maj }, niveaux: efface ? {} : session.niveaux });
    setErreur(null);
  };

  const exporterSemaine = async () => {
    setTravail(true);
    try {
      const sem = versExport(session);
      telechargerBlob(await semaineEnBlob(sem), nomFichier(sem.numero, sem.titre));
    } catch (e) { setErreur(String(e)); } finally { setTravail(false); }
  };

  const exporterZip = async () => {
    setTravail(true);
    try {
      const annee = exportPeriode === "annee";
      const semaines = annee ? PROGRESSION : PROGRESSION.filter((s) => String(s.periode) === exportPeriode);
      const preparees = c.source === "semaine" && aDuContenu(session) ? { [c.numero]: versExport(session) } : undefined;
      const blob = await zipEnBlob({ semaines, graine: c.graine, schemaParId, contextes: contextesPour, preparees });
      telechargerBlob(blob, nomZip(annee ? "Annee_complete" : `Periode_${exportPeriode}`));
    } catch (e) { setErreur(String(e)); } finally { setTravail(false); }
  };

  const nb = c.nbProblemes;
  const theme = c.source === "semaine" ? PROGRESSION.find((x) => x.numero === c.numero)?.theme : undefined;
  const CONTEXTES = contextesPour(theme);
  const { titre } = (() => { try { return titreSession(c); } catch { return { titre: "" }; } })();
  const niveauxGeneres = c.niveaux.filter((n) => session.niveaux[n]);
  const vu = niveauxGeneres.includes(niveauVu) ? niveauVu : niveauxGeneres[0];
  const ns = vu ? session.niveaux[vu] : undefined;
  const aJ1 = aDuContenu(session);
  const outils = (n: Niveau, jour: JourEtat, i: number) => ({
    onVerrou: () => agir((s) => basculerVerrou(s, n, jour, i)),
    onRegenerer: () => agir((s) => regenerer(s, n, jour, i)),
    onModifier: (ch: Parameters<typeof modifierTexte>[4]) => agir((s) => modifierTexte(s, n, jour, i, ch)),
    onRetablir: () => agir((s) => retablirOriginal(s, n, jour, i)),
  });

  return (
    <>
      <section className="panneau">
        <h2>Réglages</h2>
        <div className="grille-reglages">
          <div className="champ">
            <span className="titre">Semaine ou notion</span>
            <label><input type="radio" checked={c.source === "semaine"} onChange={() => changerConfig({ source: "semaine" }, true)} /> Semaine de la progression</label>
            <select value={c.numero} disabled={c.source !== "semaine"} onChange={(e) => changerConfig({ numero: Number(e.target.value) }, true)}>
              {[1, 2, 3, 4, 5].map((per) => (
                <optgroup key={per} label={`Période ${per}`}>
                  {PROGRESSION.filter((s) => s.periode === per).map((s) => (
                    <option key={s.numero} value={s.numero}>S{s.numero} : {s.titre}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <label><input type="radio" checked={c.source === "libre"} onChange={() => changerConfig({ source: "libre" }, true)} /> Notion libre</label>
            {c.source === "libre" && (
              <>
                <input value={c.titreLibre} onChange={(e) => changerConfig({ titreLibre: e.target.value }, false)} placeholder="Titre de la fiche" />
                {SCHEMAS.map((s) => (
                  <label key={s.id}>
                    <input type="checkbox" checked={c.schemasLibres.includes(s.id)} onChange={(e) => changerConfig({
                      schemasLibres: e.target.checked ? [...c.schemasLibres, s.id] : c.schemasLibres.filter((x) => x !== s.id),
                    }, true)} /> {s.titre}
                  </label>
                ))}
                <span className="aide">Le premier schéma coché sert pour l'évaluation.</span>
              </>
            )}
          </div>

          <div className="champ">
            <span className="titre">Niveaux à générer</span>
            <div className="ligne">
              {([1, 2, 3] as Niveau[]).map((n) => (
                <label key={n}>
                  <input type="checkbox" checked={c.niveaux.includes(n)} onChange={(e) => changerConfig({
                    niveaux: (e.target.checked ? [...c.niveaux, n] : c.niveaux.filter((x) => x !== n)).sort() as Niveau[],
                  }, false)} /> {etoiles(n)}
                </label>
              ))}
            </div>
            <span className="titre">Nombre de problèmes par jour</span>
            <select value={nb} onChange={(e) => changerConfig({ nbProblemes: Number(e.target.value) }, false)}>
              {[1, 2, 3, 4, 5].map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
            <span className="titre">Graine</span>
            <div className="ligne">
              <input value={c.graine} size={14} onChange={(e) => changerConfig({ graine: e.target.value.trim() || "A" }, false)} />
              <button className="petit" onClick={() => changerConfig({ graine: nouvelleGraine() }, false)}>Nouvelle graine</button>
            </div>
            <span className="aide">Même graine et mêmes réglages : mêmes problèmes. Cliquez ensuite sur « Générer le Jour 1 ».</span>
          </div>

          <div className="champ">
            <span className="titre">Contextes</span>
            <table className="table-ctx">
              <tbody>
                {CONTEXTES.map((ctx) => (
                  <tr key={ctx.id}>
                    <td>{ctx.titre}</td>
                    <td><label><input type="checkbox" checked={c.exclus.includes(ctx.id)} onChange={(e) => changerConfig({
                      exclus: e.target.checked ? [...c.exclus, ctx.id] : c.exclus.filter((x) => x !== ctx.id),
                    }, false)} /> exclure</label></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {Array.from({ length: nb }, (_, i) => (
              <label key={i} className="ligne">
                Problème {i + 1} :
                <select value={c.imposes[i] ?? ""} onChange={(e) => {
                  const imposes = [...c.imposes];
                  imposes[i] = e.target.value || null;
                  changerConfig({ imposes }, false);
                }}>
                  <option value="">au choix</option>
                  {CONTEXTES.filter((x) => !c.exclus.includes(x.id)).map((x) => <option key={x.id} value={x.id}>{x.titre}</option>)}
                </select>
              </label>
            ))}
          </div>
        </div>
      </section>

      <div className="actions">
        <button className="principal" onClick={() => agir(genererJour1)}>Générer le Jour 1</button>
        <button className="principal" onClick={() => agir(evoluerJour2)} disabled={!aJ1}>Faire évoluer (Jour 2)</button>
        <button className="principal" onClick={() => agir(creerEvaluation)} disabled={!aJ1}>Créer l'évaluation</button>
        <span className="sep" />
        <button className="export" onClick={exporterSemaine} disabled={!aJ1 || travail}>Exporter la semaine (.docx)</button>
        <select value={exportPeriode} onChange={(e) => setExportPeriode(e.target.value)} aria-label="Période à exporter">
          {[1, 2, 3, 4, 5].map((p) => <option key={p} value={p}>Période {p}</option>)}
          <option value="annee">Année complète</option>
        </select>
        <button className="export" onClick={exporterZip} disabled={travail}>
          {exportPeriode === "annee" ? "Exporter l'année (.zip)" : "Exporter la période (.zip)"}
        </button>
      </div>

      {erreur && <div className="erreur">{erreur}</div>}
      {travail && <div className="info">Préparation du fichier…</div>}
      {!aJ1 && !erreur && <div className="info">Réglez la semaine, puis cliquez sur « Générer le Jour 1 ».</div>}

      {ns && vu && (
        <>
          <h2 style={{ color: "var(--bleu-fonce)", margin: "4px 0 10px" }}>{c.source === "semaine" ? `Semaine ${c.numero} : ` : ""}{titre}</h2>
          <div className="niveaux">
            {niveauxGeneres.map((n) => (
              <button key={n} className={n === vu ? "actif" : ""} onClick={() => setNiveauVu(n)}>Niveau {etoiles(n)}</button>
            ))}
          </div>

          <div className="paires">
            <div className="tete">Jour 1</div>
            <div className="tete">Jour 2 (à l'envers)</div>
            {ns.jour1.map((e1, i) => {
              const e2 = ns.jour2[i];
              return [
                <Carte key={`a${i}`} p={e1.p} numero={i + 1} verrou={e1.verrou} modifie={!!e1.original} {...outils(vu, "jour1", i)} />,
                e2
                  ? <Carte key={`b${i}`} p={e2.p} numero={i + 1} verrou={e2.verrou} modifie={!!e2.original}
                    obsolete={jour2Obsolete(session, vu, i)} rappel={cherche(e1.p)} {...outils(vu, "jour2", i)} />
                  : <div key={`b${i}`} className="carte vide">Jour 2 pas encore créé.<br />Cliquez sur « Faire évoluer (Jour 2) ».</div>,
              ];
            })}
          </div>

          <h3 className="jour">Évaluation</h3>
          <div className="paires">
            {ns.evaluation
              ? <Carte p={ns.evaluation.p} numero={1} verrou={ns.evaluation.verrou} modifie={!!ns.evaluation.original} {...outils(vu, "evaluation", 0)} />
              : <div className="carte vide">Évaluation pas encore créée.<br />Cliquez sur « Créer l'évaluation ».</div>}
          </div>
        </>
      )}
    </>
  );
}
