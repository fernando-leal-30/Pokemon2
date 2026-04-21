import React, { useMemo, useEffect, useState } from 'react';
import { useTeamStore } from '../store/teamStore';
import { useBattleStore } from '../store/battleStore';
import { useNavigate } from 'react-router-dom';
import { simulateBattle } from '../utils/battleEngine';
import { saveMatchResult } from '../services/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowLeft, Swords, Zap } from 'lucide-react';
import { Pokemon } from '../types/pokemon';

export const BattleResultPage: React.FC = () => {
  const { team } = useTeamStore();
  const { selectedRival, clearBattle } = useBattleStore();
  const navigate = useNavigate();
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (team.length !== 6 || !selectedRival) {
      navigate('/');
    }
  }, [team, selectedRival, navigate]);

  const result = useMemo(() => {
    if (team.length === 6 && selectedRival) {
      return simulateBattle(team, selectedRival);
    }
    return null;
  }, [team, selectedRival]);

  useEffect(() => {
    if (result && showResult) {
      saveMatchResult(
        team,
        selectedRival!,
        result.playerAnalysis,
        result.rivalAnalysis,
        result.winner
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, showResult]);

  useEffect(() => {
    // Animación inicial de combate dura 3.5 segundos
    const timer = setTimeout(() => {
      setShowResult(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  if (!result) return null;

  const handlePlayAgain = () => {
    clearBattle();
    navigate('/');
  };

  const isWin = result.winner === 'player';

  const TeamSummary = ({ title, pokemons, analysis, isWinner }: { title: string, pokemons: Pokemon[], analysis: any, isWinner: boolean }) => (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', bounce: 0.4 }}
      className={`relative p-6 rounded-2xl border-4 overflow-hidden shadow-2xl ${isWinner ? 'border-pokemon-yellow bg-pokemon-darkBlue' : 'border-slate-700 bg-slate-800'}`}
    >
      {isWinner && (
        <div className="absolute inset-0 bg-pokemon-yellow/5 animate-pulse"></div>
      )}
      
      <h2 className="text-2xl font-bold text-center mb-6 flex justify-center items-center gap-2 relative z-10">
        {isWinner && <Trophy className="text-pokemon-yellow" />}
        {title}
      </h2>
      
      <div className="grid grid-cols-3 gap-2 mb-6 relative z-10">
        {pokemons.map((p, i) => (
          <img key={i} src={p.sprite} alt={p.name} className="w-16 h-16 object-contain bg-black/40 rounded-lg p-1 hover:scale-110 transition-transform" />
        ))}
      </div>

      <div className="space-y-3 font-mono text-sm bg-black/50 p-4 rounded-lg h-48 overflow-y-auto relative z-10 border border-white/5">
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span>Poder Base:</span>
          <span className="text-pokemon-teal">{Math.round(analysis.basePowerTotal)}</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span>Bono Sinergia:</span>
          <span className="text-green-400">+{analysis.synergyBonus}</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span>Penalización Debilidades:</span>
          <span className="text-pokemon-red">{analysis.weaknessPenalty}</span>
        </div>
        <div className="flex justify-between font-bold text-lg pt-2 items-center">
          <span>Poder Total:</span>
          <span className={`text-2xl ${isWinner ? 'text-pokemon-yellow drop-shadow-[0_0_8px_rgba(241,196,15,0.8)]' : 'text-slate-300'}`}>
            {Math.round(analysis.finalPower)}
          </span>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-slate-400 max-h-24 overflow-y-auto scrollbar-hide space-y-1 relative z-10">
        {analysis.logs.map((log: string, i: number) => (
          <div key={i}>• {log}</div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 text-pokemon-lightGray flex flex-col items-center overflow-hidden">
      <AnimatePresence mode="wait">
        {!showResult ? (
          // PANTALLA DE ANIMACIÓN DE COMBATE (CLASH)
          <motion.div 
            key="clash-screen"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 overflow-hidden"
            exit={{ opacity: 0, scale: 1.2, transition: { duration: 0.5 } }}
          >
            {/* Jugador entra desde la izquierda */}
            <motion.div 
              initial={{ x: '-100vw', skewX: 20 }}
              animate={{ x: '-5%', skewX: 0 }}
              transition={{ type: 'spring', damping: 15, delay: 0.2 }}
              className="absolute left-0 w-1/2 h-full bg-pokemon-darkBlue flex items-center justify-end pr-10 md:pr-20 clip-path-slant-right border-r-8 border-pokemon-teal"
              style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0% 100%)' }}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 opacity-80">
                {team.map((p, i) => (
                  <img key={`p-${i}`} src={p.sprite} className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-[0_0_10px_rgba(127,188,189,0.8)]" />
                ))}
              </div>
            </motion.div>

            {/* Rival entra desde la derecha */}
            <motion.div 
              initial={{ x: '100vw', skewX: -20 }}
              animate={{ x: '5%', skewX: 0 }}
              transition={{ type: 'spring', damping: 15, delay: 0.2 }}
              className="absolute right-0 w-1/2 h-full bg-pokemon-red flex items-center justify-start pl-10 md:pl-20 clip-path-slant-left border-l-8 border-pokemon-yellow"
              style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 opacity-80">
                {selectedRival!.map((p, i) => (
                  <img key={`r-${i}`} src={p.sprite} className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-[0_0_10px_rgba(241,196,15,0.8)]" />
                ))}
              </div>
            </motion.div>

            {/* Rayo central */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1], rotate: [0, 15, -15, 0] }}
              transition={{ delay: 1, duration: 0.8, times: [0, 0.4, 0.7, 1] }}
              className="absolute z-10 flex flex-col items-center justify-center bg-black/50 p-8 rounded-full backdrop-blur-sm border-4 border-pokemon-yellow shadow-[0_0_50px_rgba(241,196,15,0.5)]"
            >
              <Zap size={80} className="text-pokemon-yellow animate-pulse" />
              <h1 className="text-6xl font-black italic text-white drop-shadow-md">VS</h1>
            </motion.div>
            
            {/* Efecto de impacto (Flash blanco) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ delay: 1.2, duration: 0.3 }}
              className="absolute inset-0 bg-white z-20 pointer-events-none"
            />
          </motion.div>
        ) : (
          // PANTALLA DE RESULTADOS
          <motion.div 
            key="results-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-6xl relative z-10"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <img src="/logo.jpg" alt="Logo" className="w-24 h-24 object-contain rounded-full mx-auto mb-4 border-4 border-pokemon-yellow shadow-[0_0_20px_rgba(241,196,15,0.5)]" />
              </motion.div>
              <h1 className={`text-6xl font-black uppercase tracking-widest drop-shadow-lg ${isWin ? 'text-pokemon-yellow' : 'text-slate-500'}`}>
                {isWin ? '¡Victoria!' : 'Derrota'}
              </h1>
              <p className="text-xl mt-4 text-slate-400">
                {isWin ? 'Tu estrategia fue superior.' : 'El equipo rival tenía mejor sinergia.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-center">
              <TeamSummary 
                title="Tu Equipo" 
                pokemons={team} 
                analysis={result.playerAnalysis} 
                isWinner={isWin} 
              />
              
              <div className="hidden lg:flex flex-col items-center justify-center p-4">
                <Swords size={64} className="text-pokemon-red mb-4 animate-bounce" />
                <span className="text-4xl font-black italic text-white/20">VS</span>
              </div>

              <TeamSummary 
                title="Equipo Rival" 
                pokemons={selectedRival!} 
                analysis={result.rivalAnalysis} 
                isWinner={!isWin} 
              />
            </div>

            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex justify-center"
            >
              <button 
                onClick={handlePlayAgain}
                className="flex items-center gap-2 bg-pokemon-teal hover:bg-teal-600 text-pokemon-darkBlue font-bold py-4 px-8 rounded-full shadow-[0_0_15px_rgba(127,188,189,0.5)] transition-transform hover:scale-105"
              >
                <ArrowLeft />
                Armar un nuevo equipo
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
