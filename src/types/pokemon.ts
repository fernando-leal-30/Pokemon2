export interface PokemonStat {
  name: string;
  value: number;
}

export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  basePower: number; // BST + Speed * 0.5
  cost: number; // basePower / 2.5
}

// Representa a un Pokémon seleccionado para el equipo del jugador o rival
export interface TeamMember extends Pokemon {
  // Aquí podríamos agregar cosas como el apodo, si aplicara en el futuro
}

// El equipo entero
export interface Team {
  id?: string;
  name: string;
  members: TeamMember[];
  powerScore: number;
  synergyBonus: number;
  weaknessPenalty: number;
}
