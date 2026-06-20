import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALA9g9WrxVzT9LjdhR9xxC6D2i_fcFM5o",
  authDomain: "gen-lang-client-0409138784.firebaseapp.com",
  projectId: "gen-lang-client-0409138784",
  storageBucket: "gen-lang-client-0409138784.firebasestorage.app",
  messagingSenderId: "697740946719",
  appId: "1:697740946719:web:c56ca9273ead402432942a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use custom firestore databaseId from app config
export const db = getFirestore(app, "ai-studio-5e75e72b-28ca-4e73-8e94-3fb9b0ad7c1c");

export default app;
