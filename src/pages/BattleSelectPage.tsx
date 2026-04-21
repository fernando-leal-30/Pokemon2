import React, { useEffect } from 'react';
import { useTeamStore } from '../store/teamStore';
import { useBattleStore } from '../store/battleStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pokemon } from '../types/pokemon';

export const BattleSelectPage: React.FC = () => {
  const { team } = useTeamStore();
  const { rivalTeams, setSelectedRival } = useBattleStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (team.length !== 6 || rivalTeams.length !== 4) {
      navigate('/');
    }
  }, [team, rivalTeams, navigate]);

  const handleSelectRival = (rivalTeam: Pokemon[]) => {
    setSelectedRival(rivalTeam);
    navigate('/battle-result');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center py-12 px-4">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-bold text-pokemon-yellow text-center mb-4 drop-shadow-lg">
          Selecciona a tu Oponente
        </h1>
        <p className="text-slate-300 text-center mb-12 text-lg">
          Se han generado 4 equipos rivales respetando el límite de 1000 monedas.
          <br />Analiza sus composiciones visualmente y elige contra quién quieres luchar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rivalTeams.map((rivalTeam, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleSelectRival(rivalTeam)}
              className="bg-pokemon-darkBlue/50 border-2 border-white/10 hover:border-pokemon-red rounded-2xl p-6 cursor-pointer transition-colors shadow-xl group"
            >
              <h3 className="text-xl font-bold text-pokemon-lightGray mb-4 group-hover:text-pokemon-red transition-colors">
                Rival Misterioso #{index + 1}
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                {rivalTeam.map((pokemon, i) => (
                  <div key={i} className="bg-black/30 rounded-lg p-2 flex items-center justify-center">
                    <img 
                      src={pokemon.sprite} 
                      alt="Pokemon Oculto" 
                      className="w-16 h-16 object-contain drop-shadow-md"
                      title="???"
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center text-sm font-bold text-slate-400 group-hover:text-pokemon-yellow transition-colors">
                CLICK PARA ENFRENTAR
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
