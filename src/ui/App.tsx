/**
 * Application : trois espaces.
 *  - Préparer la semaine (enseignant) ;
 *  - Problème isolé (enseignant) ;
 *  - Mode élève (adresse se terminant par #eleve), avec la correction à la demande.
 * La préparation est enregistrée dans ce navigateur uniquement (rien n'est envoyé sur Internet).
 */
import { useEffect, useState } from "react";
import "./styles.css";
import { chargerSession, sauverSession, sessionVide, type Session } from "./etat";
import { Preparation } from "./Preparation";
import { Isole } from "./Isole";
import { Eleve } from "./Eleve";

type Espace = "semaine" | "isole" | "eleve";
const depuisAdresse = (): Espace => (location.hash === "#eleve" ? "eleve" : location.hash === "#isole" ? "isole" : "semaine");

export function App() {
  const [espace, setEspace] = useState<Espace>(depuisAdresse);
  const [session, setSession] = useState<Session>(chargerSession);

  useEffect(() => { sauverSession(session); }, [session]);
  useEffect(() => {
    const f = () => setEspace(depuisAdresse());
    addEventListener("hashchange", f);
    return () => removeEventListener("hashchange", f);
  }, []);
  const aller = (e: Espace) => { location.hash = e === "semaine" ? "" : e; setEspace(e); };

  return (
    <>
      <header className="entete">
        <h1>Problèmes à étapes CM1-CM2{espace === "eleve" ? " · Élève" : ""}</h1>
        <nav className="onglets">
          <button className={espace === "semaine" ? "actif" : ""} onClick={() => aller("semaine")}>Préparer la semaine</button>
          <button className={espace === "isole" ? "actif" : ""} onClick={() => aller("isole")}>Problème isolé</button>
          <button className={espace === "eleve" ? "actif" : ""} onClick={() => aller("eleve")}>Mode élève</button>
          {espace === "semaine" && (
            <button onClick={() => { if (confirm("Effacer toute la préparation (verrous et modifications compris) ?")) setSession(sessionVide()); }}>
              Tout effacer
            </button>
          )}
        </nav>
      </header>
      <main>
        {espace === "semaine" && <Preparation session={session} setSession={setSession} />}
        {espace === "isole" && <Isole />}
        {espace === "eleve" && <Eleve session={session} />}
      </main>
    </>
  );
}
