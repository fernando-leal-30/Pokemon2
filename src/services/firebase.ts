import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { BattleAnalysis } from "../utils/battleEngine";
import { Pokemon } from "../types/pokemon";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializar Firebase (solo si hay config, para no romper la app si faltan las variables)
const app = firebaseConfig.apiKey ? initializeApp(firebaseConfig) : null;
const db = app ? getFirestore(app) : null;

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
    await addDoc(collection(db, "matches"), {
      playerTeam: playerTeam.map(p => ({ id: p.id, name: p.name })),
      rivalTeam: rivalTeam.map(p => ({ id: p.id, name: p.name })),
      playerScore: playerAnalysis.finalPower,
      rivalScore: rivalAnalysis.finalPower,
      winner,
      createdAt: serverTimestamp(),
    });
    console.log("Partida guardada exitosamente en Firebase");
  } catch (e) {
    console.error("Error guardando el documento en Firebase: ", e);
  }
};
