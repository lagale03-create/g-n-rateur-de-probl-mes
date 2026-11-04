/** Tableau ou graphique d'un énoncé, à l'écran. */
import type { Visuel as V } from "../core/types";
import { svgDuVisuel } from "../export/graphiques";

export function Visuel({ v }: { v: V }) {
  if (v.type === "tableau") {
    return (
      <table className="visuel-tableau">
        <caption>{v.titre}</caption>
        <thead><tr>{v.colonnes.map((c, i) => <th key={i} scope="col">{c}</th>)}</tr></thead>
        <tbody>{v.lignes.map((l, i) => (
          <tr key={i}><th scope="row">{l.label}</th>{l.valeurs.map((x, k) => <td key={k}>{x.texte}</td>)}</tr>
        ))}</tbody>
      </table>
    );
  }
  return <div className="visuel-graphique" role="img" aria-label={v.titre} dangerouslySetInnerHTML={{ __html: svgDuVisuel(v) }} />;
}
