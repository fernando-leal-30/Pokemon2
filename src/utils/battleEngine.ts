import { Pokemon } from '../types/pokemon';
import { getPokemonWeaknesses } from './typeChart';

export interface BattleAnalysis {
  basePowerTotal: number;
  synergyBonus: number;
  weaknessPenalty: number;
  finalPower: number;
  logs: string[];
}

export const calculateTeamPower = (team: Pokemon[]): BattleAnalysis => {
  const logs: string[] = [];
  
  // 1. Suma de poder base individual
  const basePowerTotal = team.reduce((sum, p) => sum + p.basePower, 0);
  logs.push(`Poder base total del equipo: ${Math.round(basePowerTotal)}`);

  // 2. Bono por Cobertura (Tipos únicos)
  const uniqueTypes = new Set<string>();
  team.forEach(p => p.types.forEach(t => uniqueTypes.add(t)));
  const synergyBonus = uniqueTypes.size * 20;
  logs.push(`Bono de Sinergia: +${synergyBonus} (${uniqueTypes.size} tipos únicos cubiertos)`);

  // 3. Penalización por debilidades compartidas
  let weaknessPenalty = 0;
  const weaknessCount: Record<string, number> = {};

  team.forEach((pokemon) => {
    const weaknesses = getPokemonWeaknesses(pokemon.types);
    weaknesses.forEach((w) => {
      weaknessCount[w] = (weaknessCount[w] || 0) + 1;
    });
  });

  Object.entries(weaknessCount).forEach(([type, count]) => {
    if (count >= 3) {
      const penalty = (count - 2) * 50; // -50 si son 3, -100 si son 4...
      weaknessPenalty -= penalty;
      logs.push(`Penalización por debilidad compartida a ${type.toUpperCase()} (${count} Pokémon): ${-penalty}`);
    }
  });

  const finalPower = basePowerTotal + synergyBonus + weaknessPenalty;
  
  return {
    basePowerTotal,
    synergyBonus,
    weaknessPenalty,
    finalPower,
    logs
  };
};

export const simulateBattle = (playerTeam: Pokemon[], rivalTeam: Pokemon[]) => {
  const playerAnalysis = calculateTeamPower(playerTeam);
  const rivalAnalysis = calculateTeamPower(rivalTeam);

  const isPlayerWinner = playerAnalysis.finalPower >= rivalAnalysis.finalPower;

  return {
    playerAnalysis,
    rivalAnalysis,
    winner: isPlayerWinner ? 'player' : 'rival'
  };
};
