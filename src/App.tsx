import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BuilderPage } from './pages/BuilderPage';
import { BattleSelectPage } from './pages/BattleSelectPage';
import { BattleResultPage } from './pages/BattleResultPage';

// Cliente para manejar llamadas a API
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BuilderPage />} />
          <Route path="/select-rival" element={<BattleSelectPage />} />
          <Route path="/battle-result" element={<BattleResultPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
