import React from 'react';
import { Pokemon } from '../types/pokemon';
import { TypeBadge } from './TypeBadge';
import { useTeamStore } from '../store/teamStore';
import { Coins, Swords, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  pokemon: Pokemon;
}

export const PokemonCard: React.FC<Props> = ({ pokemon }) => {
  const { team, addPokemon, removePokemon, budget, isTeamFull } = useTeamStore();
  
  const isSelected = team.some((p) => p.id === pokemon.id);
  const canAfford = budget >= pokemon.cost;
  const isDisabled = (!isSelected && isTeamFull()) || (!isSelected && !canAfford);

  const handleToggle = () => {
    if (isSelected) {
      removePokemon(pokemon.id);
    } else {
      addPokemon(pokemon);
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: isDisabled ? 1 : 1.05 }}
      whileTap={{ scale: isDisabled ? 1 : 0.95 }}
      onClick={isDisabled ? undefined : handleToggle}
      className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-colors duration-300
        ${isSelected ? 'border-pokemon-yellow bg-pokemon-darkBlue/80' : 'border-transparent bg-pokemon-darkBlue/40'}
        ${isDisabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:border-pokemon-teal'}
      `}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 bg-pokemon-yellow text-pokemon-darkBlue text-xs font-bold px-2 py-1 rounded-full z-10">
          En Equipo
        </div>
      )}
      
      <div className="p-4 flex flex-col items-center">
        <img 
          src={pokemon.sprite} 
          alt={pokemon.name} 
          className="w-24 h-24 object-contain drop-shadow-lg"
          loading="lazy"
        />
        <h3 className="capitalize font-bold text-lg mt-2 mb-1 text-pokemon-lightGray">
          {pokemon.name}
        </h3>
        
        <div className="flex gap-1 mb-3">
          {pokemon.types.map((t) => (
            <TypeBadge key={t} type={t} />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 w-full text-xs text-slate-300 bg-black/20 p-2 rounded-lg mb-3">
          <div className="flex items-center gap-1"><Shield size={12} className="text-blue-400"/> HP: {pokemon.stats.hp}</div>
          <div className="flex items-center gap-1"><Swords size={12} className="text-red-400"/> Atk: {pokemon.stats.attack}</div>
          <div className="flex items-center gap-1"><Shield size={12} className="text-slate-400"/> Def: {pokemon.stats.defense}</div>
          <div className="flex items-center gap-1"><Zap size={12} className="text-yellow-400"/> Spd: {pokemon.stats.speed}</div>
        </div>

        <div className="flex justify-between w-full items-center font-bold">
          <span className="text-pokemon-teal text-xs">Poder: {Math.round(pokemon.basePower)}</span>
          <span className="flex items-center gap-1 text-pokemon-yellow">
            <Coins size={14} /> {pokemon.cost}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
