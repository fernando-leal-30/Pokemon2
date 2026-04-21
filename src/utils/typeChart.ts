// Tabla de debilidades simplificada (Generación 1 + Fairy para compatibilidad con PokeAPI moderna)
export const TYPE_WEAKNESSES: Record<string, string[]> = {
  normal: ['fighting'],
  fire: ['water', 'ground', 'rock'],
  water: ['grass', 'electric'],
  electric: ['ground'],
  grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
  ice: ['fire', 'fighting', 'rock', 'steel'],
  fighting: ['flying', 'psychic', 'fairy'],
  poison: ['ground', 'psychic'],
  ground: ['water', 'grass', 'ice'],
  flying: ['electric', 'ice', 'rock'],
  psychic: ['bug', 'ghost', 'dark'],
  bug: ['fire', 'flying', 'rock'],
  rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
  ghost: ['ghost', 'dark'],
  dragon: ['ice', 'dragon', 'fairy'],
  steel: ['fire', 'fighting', 'ground'],
  dark: ['fighting', 'bug', 'fairy'],
  fairy: ['poison', 'steel']
};

export const getPokemonWeaknesses = (types: string[]): Set<string> => {
  const weaknesses = new Set<string>();
  
  types.forEach((type) => {
    const typeWeaknesses = TYPE_WEAKNESSES[type.toLowerCase()] || [];
    typeWeaknesses.forEach((w) => weaknesses.add(w));
  });

  // Nota: En un juego real, si un tipo es débil y el otro resiste, se anulan.
  // Para simplificar este motor de "Power Score", tomaremos todas las debilidades combinadas.
  return weaknesses;
};
