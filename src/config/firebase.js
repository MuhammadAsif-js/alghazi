// ─────────────────────────────────────────────────────────────────────────────
// src/config/firebase.js
// Firebase is initialised once here and exported. Every module that needs
// Firestore/Auth imports from this file — never re-initialises Firebase itself.
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let app, auth, db, appId;

try {
  // __firebase_config and __app_id are injected by the Canvas/hosting env.
  // Fall back to empty objects so the app doesn't hard-crash in dev.
  const firebaseConfig = JSON.parse(
    typeof __firebase_config !== 'undefined' ? __firebase_config : '{}'
  );
  app  = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db   = getFirestore(app);
  appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
} catch (e) {
  console.error('[Firebase] Initialisation failed:', e.message);
}

export { app, auth, db, appId };
