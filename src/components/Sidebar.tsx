import React from 'react';
import { useTeamStore } from '../store/teamStore';
import { useBattleStore } from '../store/battleStore';
import { Coins, Trash2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { generateRivalTeams } from '../utils/rivalGenerator';
import { useQueryClient } from '@tanstack/react-query';
import { Pokemon } from '../types/pokemon';

export const Sidebar: React.FC = () => {
  const { team, budget, maxBudget, removePokemon, clearTeam } = useTeamStore();
  const { setRivalTeams } = useBattleStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const totalPower = team.reduce((acc, p) => acc + p.basePower, 0);

  const handleSearchRivals = () => {
    // Obtenemos los pokemons cacheados del query client
    const allPokemon = queryClient.getQueryData<Pokemon[]>(['gen1Pokemon']);
    if (allPokemon) {
      const rivals = generateRivalTeams(allPokemon, 4);
      setRivalTeams(rivals);
      navigate('/select-rival');
    }
  };

  return (
    <div className="w-full lg:w-80 bg-pokemon-darkBlue p-6 flex flex-col h-full border-l border-white/10 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <img src="/logo.jpg" alt="Logo" className="w-10 h-10 object-contain rounded-full shadow-md" />
        <h2 className="text-2xl font-bold text-pokemon-lightGray flex-1">
          Tu Equipo
        </h2>
        <span className="text-sm font-normal bg-white/10 px-2 py-1 rounded-full text-pokemon-lightGray">
          {team.length} / 6
        </span>
      </div>

      {/* Panel de Presupuesto */}
      <div className="bg-black/20 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-slate-400 text-sm">Presupuesto Restante</span>
          <span className={`font-bold flex items-center gap-1 ${budget < 100 ? 'text-pokemon-red' : 'text-pokemon-yellow'}`}>
            <Coins size={16} /> {budget}
          </span>
        </div>
        <div className="w-full bg-black/40 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${budget < 100 ? 'bg-pokemon-red' : 'bg-pokemon-yellow'}`}
            style={{ width: `${(budget / maxBudget) * 100}%` }}
          />
        </div>
      </div>

      {/* Lista del equipo */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        <AnimatePresence>
          {team.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center text-slate-500 mt-10"
            >
              <div className="w-20 h-20 border-4 border-dashed border-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                ?
              </div>
              <p>Tu equipo está vacío</p>
              <p className="text-sm">Selecciona Pokémon de la lista</p>
            </motion.div>
          ) : (
            team.map((pokemon) => (
              <motion.div
                key={pokemon.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-black/20 p-3 rounded-lg flex items-center gap-3 relative group"
              >
                <img src={pokemon.sprite} alt={pokemon.name} className="w-12 h-12 object-contain" />
                <div className="flex-1">
                  <h4 className="capitalize font-bold text-pokemon-lightGray leading-tight">{pokemon.name}</h4>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-pokemon-teal">Poder: {Math.round(pokemon.basePower)}</span>
                    <span className="text-pokemon-yellow flex items-center gap-1"><Coins size={10}/> {pokemon.cost}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removePokemon(pokemon.id)}
                  className="text-slate-500 hover:text-pokemon-red transition-colors p-2"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Acciones */}
      <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">Poder Base Total:</span>
          <span className="font-bold text-pokemon-teal text-lg">{Math.round(totalPower)}</span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={clearTeam}
            disabled={team.length === 0}
            className="flex-1 py-3 px-4 rounded-lg font-bold bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Limpiar
          </button>
          <button 
            disabled={team.length !== 6}
            onClick={handleSearchRivals}
            className="flex-[2] py-3 px-4 rounded-lg font-bold bg-pokemon-red hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-red-900/50"
          >
            Buscar Rivales
          </button>
        </div>
        {team.length > 0 && team.length < 6 && (
          <p className="text-xs text-center text-slate-400 flex items-center justify-center gap-1">
            <ShieldAlert size={12} /> Selecciona {6 - team.length} Pokémon más
          </p>
        )}
      </div>
    </div>
  );
};
