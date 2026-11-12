// Ajoute la séquence d'orthographe (4 séances) prise sur le temps d'EPS :
// lundi, jeudi, vendredi 14h45-15h00 à la place des 15 min d'EPS ; mardi 13h30-13h50, l'EPS longue passe à 13h50-15h00.
function integrerOrtho(day, o) {
  const d = o[day.jour]; if (!d) return day;
  if (day.jour === 'Mardi') {
    day.seances = day.seances.flatMap(s => {
      if (s.dom !== 'EPS') return [s];
      const eps = { ...s, h: '13h50-15h00', phases: [
        ['Échauffement', '10 min', s.phases[0][2], s.phases[0][3]],
        ['Construire les règles', '12 min', s.phases[1][2], s.phases[1][3]],
        ['Rencontres arbitrées', '38 min', s.phases[2][2], s.phases[2][3]],
        ['Retour au calme', '10 min', s.phases[3][2], s.phases[3][3]]] };
      return [d.seance, eps];
    });
  } else {
    day.seances = day.seances.map(s => (s.dom === 'EPS' && s.h.startsWith('14h45') ? d.seance : s));
  }
  const i = day.fiches.findIndex(f => f.dom === d.avant);
  day.fiches.splice(i < 0 ? day.fiches.length : i, 0, ...d.fiches);
  return day;
}
module.exports = { integrerOrtho };
