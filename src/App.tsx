import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BuilderPage } from './pages/BuilderPage';
import { BattleSelectPage } from './pages/BattleSelectPage';
import { BattleResultPage } from './pages/BattleResultPage';

// Cliente para manejar llamadas a API
const queryClient = new QueryClient();

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5, duration: 1 }}
              className="relative"
            >
              <motion.div 
                className="absolute inset-0 bg-pokemon-yellow blur-3xl opacity-20 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <img 
                src="/logo.jpg" 
                alt="Mariscos TCG Pokémon Logo" 
                className="w-64 h-64 md:w-80 md:h-80 object-contain rounded-full border-4 border-pokemon-yellow shadow-[0_0_50px_rgba(241,196,15,0.6)] relative z-10" 
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="app-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<BuilderPage />} />
                <Route path="/select-rival" element={<BattleSelectPage />} />
                <Route path="/battle-result" element={<BattleResultPage />} />
              </Routes>
            </BrowserRouter>
          </motion.div>
        )}
      </AnimatePresence>
    </QueryClientProvider>
  );
}

export default App;
