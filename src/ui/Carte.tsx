/** Carte d'un problème : énoncé, corrigé, et outils (verrouiller, régénérer, modifier le texte). */
import { useState } from "react";
import type { Probleme } from "../core/types";
import type { ChampsTexte } from "./etat";
import { Visuel } from "./Visuel";

export interface PropsCarte {
  p: Probleme;
  numero: number;
  verrou?: boolean;
  modifie?: boolean;
  obsolete?: boolean;
  /** Pour le Jour 2 : rappel de l'inconnue du Jour 1. */
  rappel?: string;
  onVerrou?: () => void;
  onRegenerer?: () => void;
  onModifier?: (c: ChampsTexte) => void;
  onRetablir?: () => void;
}

const lettre = (k: number) => String.fromCharCode(97 + k);
const cherche = (p: Probleme) => p.etapes.at(-1)?.libelle ?? p.inconnue;

export function Carte(pr: PropsCarte) {
  const { p } = pr;
  const [edition, setEdition] = useState(false);
  const [brouillon, setBrouillon] = useState<Required<ChampsTexte>>({ enonce: "", question: "", guidees: [], reponse: "" });

  const ouvrir = () => {
    setBrouillon({ enonce: p.enonce, question: p.question, guidees: [...p.guidees], reponse: p.reponse });
    setEdition(true);
  };
  const enregistrer = () => {
    pr.onModifier?.(brouillon);
    setEdition(false);
  };

  return (
    <div className={`carte${pr.verrou ? " verrou" : ""}`}>
      <div className="enonce">
        <div className="titre">Problème {pr.numero} : {p.titreContexte}</div>
        <div className="badges">
          {pr.verrou && <span className="badge or">Verrouillé</span>}
          {pr.modifie && <span className="badge modif">Texte modifié</span>}
          {pr.obsolete && <span className="badge alerte">Le Jour 1 a changé : refaites évoluer</span>}
          {p.situations.map((s) => <span key={s} className="badge">{s}</span>)}
        </div>
        {edition ? null : (
          <>
            <p>{p.enonce}</p>
            {p.visuel && <Visuel v={p.visuel} />}
            {p.guidees.length > 0
              ? <ul className="guidees">{p.guidees.map((g, k) => <li key={k}><b>{String.fromCharCode(97 + k)})</b> {g}</li>)}</ul>
              : <p><b>{p.question}</b></p>}
          </>
        )}
      </div>

      {edition ? (
        <div className="edition">
          <label className="champ"><span className="titre">Énoncé</span>
            <textarea rows={5} value={brouillon.enonce} onChange={(e) => setBrouillon({ ...brouillon, enonce: e.target.value })} />
          </label>
          {brouillon.guidees.length > 0
            ? brouillon.guidees.map((g, k) => (
              <label key={k} className="champ"><span className="titre">Question {lettre(k)})</span>
                <textarea rows={2} value={g} onChange={(e) => {
                  const guidees = [...brouillon.guidees];
                  guidees[k] = e.target.value;
                  setBrouillon({ ...brouillon, guidees, question: k === guidees.length - 1 ? e.target.value : brouillon.question });
                }} />
              </label>))
            : (
              <label className="champ"><span className="titre">Question</span>
                <textarea rows={2} value={brouillon.question} onChange={(e) => setBrouillon({ ...brouillon, question: e.target.value })} />
              </label>)}
          <label className="champ"><span className="titre">Phrase réponse (corrigé)</span>
            <textarea rows={2} value={brouillon.reponse} onChange={(e) => setBrouillon({ ...brouillon, reponse: e.target.value })} />
          </label>
          <div className="avert">
            Le corrigé n'est pas recalculé : si vous changez un nombre, régénérez plutôt le problème.
          </div>
          <div className="ligne">
            <button className="principal petit" onClick={enregistrer}>Enregistrer</button>
            <button className="petit" onClick={() => setEdition(false)}>Annuler</button>
          </div>
        </div>
      ) : (
        <div className="corrige">
          <div className="par">On cherche : {cherche(p)}{pr.rappel ? ` (Jour 1 : ${pr.rappel})` : ""}</div>
          <ul>{p.etapes.map((e, k) => <li key={k}><b>{e.situation} :</b> {e.calcul} ({e.libelle})</li>)}</ul>
          {p.parasites.length > 0 && <div className="par">Données parasites : {p.parasites.join(" ")}</div>}
          <div className="rep">Réponse : {p.reponse}</div>
        </div>
      )}

      {(pr.onVerrou || pr.onRegenerer || pr.onModifier) && !edition && (
        <div className="outils">
          {pr.onVerrou && <button className="petit" onClick={pr.onVerrou}>{pr.verrou ? "Déverrouiller" : "Verrouiller"}</button>}
          {pr.onRegenerer && <button className="petit" onClick={pr.onRegenerer} disabled={pr.verrou}
            title={pr.verrou ? "Déverrouillez d'abord ce problème" : "Nouvelles données, même contexte"}>Régénérer</button>}
          {pr.onModifier && <button className="petit" onClick={ouvrir}>Modifier le texte</button>}
          {pr.modifie && pr.onRetablir && <button className="petit" onClick={pr.onRetablir}>Rétablir le texte généré</button>}
        </div>
      )}
    </div>
  );
}

export { cherche };
