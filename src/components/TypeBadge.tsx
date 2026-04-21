import React from 'react';

const typeColors: Record<string, string> = {
  normal: 'bg-gray-400',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400 text-black',
  grass: 'bg-green-500',
  ice: 'bg-blue-300 text-black',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-300 text-black',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500 text-black',
  rock: 'bg-yellow-700',
  ghost: 'bg-indigo-700',
  dragon: 'bg-indigo-600',
  dark: 'bg-gray-800',
  steel: 'bg-gray-500',
  fairy: 'bg-pink-300 text-black',
};

interface Props {
  type: string;
}

export const TypeBadge: React.FC<Props> = ({ type }) => {
  const colorClass = typeColors[type.toLowerCase()] || 'bg-gray-400';
  
  return (
    <span className={`px-2 py-1 text-xs font-bold rounded-full text-white uppercase ${colorClass}`}>
      {type}
    </span>
  );
};
