import { Pokemon } from '../types/pokemon';

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

// IDs de Pokémon Legendarios y Míticos de Gen 1
const EXCLUDED_IDS = new Set([144, 145, 146, 150, 151]); 
// 144: Articuno, 145: Zapdos, 146: Moltres, 150: Mewtwo, 151: Mew

export const fetchGen1Pokemon = async (): Promise<Pokemon[]> => {
  // Primero obtenemos la lista base de los primeros 151
  const response = await fetch(`${POKEAPI_BASE}/pokemon?limit=151`);
  const data = await response.json();
  
  const pokemonList = data.results;
  
  // Como PokeAPI no devuelve los stats en la lista base,
  // necesitamos hacer fetch de cada uno, pero excluyendo los legendarios antes
  // para ahorrar peticiones.
  const validPokemonUrls = pokemonList
    .map((p: any, index: number) => ({ url: p.url, id: index + 1 }))
    .filter((p: any) => !EXCLUDED_IDS.has(p.id));

  // Hacemos fetch en paralelo de los detalles
  const detailedPromises = validPokemonUrls.map(async (p: any) => {
    const res = await fetch(p.url);
    const details = await res.json();
    return normalizePokemonInfo(details);
  });

  const detailedPokemon = await Promise.all(detailedPromises);
  return detailedPokemon;
};

// Transforma la respuesta cruda de PokeAPI a nuestro modelo
const normalizePokemonInfo = (data: any): Pokemon => {
  const stats = {
    hp: getStat(data.stats, 'hp'),
    attack: getStat(data.stats, 'attack'),
    defense: getStat(data.stats, 'defense'),
    specialAttack: getStat(data.stats, 'special-attack'),
    specialDefense: getStat(data.stats, 'special-defense'),
    speed: getStat(data.stats, 'speed'),
  };

  const bst = stats.hp + stats.attack + stats.defense + stats.specialAttack + stats.specialDefense + stats.speed;
  const basePower = bst + (stats.speed * 0.5);
  const cost = Math.round(basePower / 2.5); // Escala para que quepan 6 Pokémon en 1000 monedas

  return {
    id: data.id,
    name: data.name,
    types: data.types.map((t: any) => t.type.name),
    sprite: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
    stats,
    basePower,
    cost
  };
};

const getStat = (statsArray: any[], statName: string): number => {
  const statObj = statsArray.find((s) => s.stat.name === statName);
  return statObj ? statObj.base_stat : 0;
};
