import { create } from 'zustand';
import { Pokemon } from '../types/pokemon';

interface BattleState {
  rivalTeams: Pokemon[][];
  selectedRival: Pokemon[] | null;
  setRivalTeams: (teams: Pokemon[][]) => void;
  setSelectedRival: (team: Pokemon[]) => void;
  clearBattle: () => void;
}

export const useBattleStore = create<BattleState>((set) => ({
  rivalTeams: [],
  selectedRival: null,
  setRivalTeams: (teams) => set({ rivalTeams: teams }),
  setSelectedRival: (team) => set({ selectedRival: team }),
  clearBattle: () => set({ rivalTeams: [], selectedRival: null }),
}));
