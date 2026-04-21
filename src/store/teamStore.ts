import { create } from 'zustand';
import { Pokemon } from '../types/pokemon';

interface TeamState {
  team: Pokemon[];
  budget: number;
  maxBudget: number;
  addPokemon: (pokemon: Pokemon) => void;
  removePokemon: (pokemonId: number) => void;
  clearTeam: () => void;
  isTeamFull: () => boolean;
}

export const useTeamStore = create<TeamState>((set, get) => ({
  team: [],
  maxBudget: 1000,
  budget: 1000,

  addPokemon: (pokemon) => {
    const state = get();
    if (state.team.length >= 6) return;
    if (state.team.find(p => p.id === pokemon.id)) return; // Evitar duplicados
    if (state.budget < pokemon.cost) return; // Validación de presupuesto

    set((state) => ({
      team: [...state.team, pokemon],
      budget: state.budget - pokemon.cost,
    }));
  },

  removePokemon: (pokemonId) => {
    set((state) => {
      const pokemonToRemove = state.team.find(p => p.id === pokemonId);
      if (!pokemonToRemove) return state;

      return {
        team: state.team.filter(p => p.id !== pokemonId),
        budget: state.budget + pokemonToRemove.cost,
      };
    });
  },

  clearTeam: () => set({ team: [], budget: 1000 }),

  isTeamFull: () => get().team.length >= 6,
}));
