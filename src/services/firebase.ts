import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, serverTimestamp } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import type { BattleAnalysis } from "../utils/battleEngine";
import type { Pokemon } from "../types/pokemon";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = firebaseConfig.apiKey ? initializeApp(firebaseConfig) : null;

// Initialize Analytics solo si estamos en el navegador
if (app && typeof window !== 'undefined') {
  try {
    getAnalytics(app);
  } catch (e) {
    console.error("Analytics error:", e);
  }
}

// Initialize Realtime Database
const db = app ? getDatabase(app) : null;

export const saveMatchResult = async (
  playerTeam: Pokemon[],
  rivalTeam: Pokemon[],
  playerAnalysis: BattleAnalysis,
  rivalAnalysis: BattleAnalysis,
  winner: string
) => {
  if (!db) {
    console.warn("Firebase no está configurado. El resultado no se guardará.");
    return;
  }

  try {
    // Referencia a la lista de "matches" en la Realtime Database
    const matchesRef = ref(db, 'matches');
    
    // push() crea un nuevo ID único automáticamente
    await push(matchesRef, {
      playerTeam: playerTeam.map(p => ({ id: p.id, name: p.name })),
      rivalTeam: rivalTeam.map(p => ({ id: p.id, name: p.name })),
      playerScore: playerAnalysis.finalPower,
      rivalScore: rivalAnalysis.finalPower,
      winner,
      createdAt: serverTimestamp(),
    });
    console.log("Partida guardada exitosamente en Firebase Realtime Database");
  } catch (e) {
    console.error("Error guardando el documento en Firebase: ", e);
  }
};
