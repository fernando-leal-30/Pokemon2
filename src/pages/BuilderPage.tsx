import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGen1Pokemon } from '../services/pokeapi';
import { PokemonCard } from '../components/PokemonCard';
import { Sidebar } from '../components/Sidebar';
import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ALL_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 
  'rock', 'ghost', 'dragon', 'steel', 'fairy'
];

export const BuilderPage: React.FC = () => {
  const { data: pokemonList, isLoading, error } = useQuery({
    queryKey: ['gen1Pokemon'],
    queryFn: fetchGen1Pokemon,
    staleTime: Infinity, // No necesitamos refetch porque son estáticos
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredPokemon = useMemo(() => {
    if (!pokemonList) return [];
    
    return pokemonList.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType ? p.types.includes(selectedType) : true;
      return matchesSearch && matchesType;
    });
  }, [pokemonList, searchTerm, selectedType]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-pokemon-lightGray">
        <Loader2 className="animate-spin text-pokemon-yellow mb-4" size={48} />
        <h2 className="text-xl font-bold animate-pulse">Cargando datos de PokeAPI...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-pokemon-red">
        <h2>Error al cargar los Pokémon. Intenta recargar la página.</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-900 overflow-hidden">
      
      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header / Buscador */}
        <div className="p-6 bg-slate-900/80 backdrop-blur-md border-b border-white/5 z-10 sticky top-0">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <img src="/logo.jpg" alt="Mariscos TCG Logo" className="w-16 h-16 object-contain rounded-full shadow-lg border-2 border-pokemon-yellow" />
              <h1 className="text-3xl font-bold text-pokemon-yellow drop-shadow-md">
                PokeTeam Builder
              </h1>
            </div>
            
            <div className="relative w-full md:w-72">
              <input 
                type="text" 
                placeholder="Buscar Pokémon..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-full py-2 pl-10 pr-4 text-white focus:outline-none focus:border-pokemon-teal transition-colors"
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            </div>
          </div>

          {/* Filtros de Tipos */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedType(null)}
              className={`px-3 py-1 rounded-full whitespace-nowrap text-sm font-bold transition-colors ${
                selectedType === null 
                  ? 'bg-pokemon-teal text-pokemon-darkBlue' 
                  : 'bg-white/10 text-slate-400 hover:bg-white/20'
              }`}
            >
              Todos
            </button>
            {ALL_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-full whitespace-nowrap text-sm font-bold uppercase transition-colors ${
                  selectedType === type 
                    ? 'bg-pokemon-teal text-pokemon-darkBlue' 
                    : 'bg-white/10 text-slate-400 hover:bg-white/20'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Pokémon */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 pb-20"
          >
            {filteredPokemon.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
            
            {filteredPokemon.length === 0 && (
              <div className="col-span-full text-center text-slate-500 py-20">
                <p>No se encontraron Pokémon con esos criterios.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Panel Lateral (Carrito/Equipo) */}
      <Sidebar />
      
    </div>
  );
};
