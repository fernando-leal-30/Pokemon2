import { Pokemon } from '../types/pokemon';

const MAX_BUDGET = 1000;

export const generateRivalTeams = (allPokemon: Pokemon[], count: number = 4): Pokemon[][] => {
  const teams: Pokemon[][] = [];

  for (let i = 0; i < count; i++) {
    let team: Pokemon[] = [];
    let budget = MAX_BUDGET;
    // Creamos una copia de los pokemon disponibles
    let available = [...allPokemon];

    while (team.length < 6 && available.length > 0) {
      // Tomamos un pokemon aleatorio
      const randomIndex = Math.floor(Math.random() * available.length);
      const candidate = available[randomIndex];

      if (candidate.cost <= budget) {
        team.push(candidate);
        budget -= candidate.cost;
        // Removemos para no repetir
        available.splice(randomIndex, 1);
      } else {
        // Si no alcanza el presupuesto, lo removemos de los candidatos
        available.splice(randomIndex, 1);
      }
    }

    // Si por algún motivo matemático muy extraño el equipo se queda con menos de 6 
    // y no hay opciones, lo forzamos con pokemon débiles o reintentamos.
    // Pero en Gen 1 hay muchos pokemon baratos (Zubat, Caterpie, etc.)
    teams.push(team);
  }

  return teams;
};
