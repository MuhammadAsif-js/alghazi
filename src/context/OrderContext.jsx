// ─────────────────────────────────────────────────────────────────────────────
// src/context/OrderContext.jsx
//
// Owns ALL Firebase state: auth handshake + live Firestore orders listener.
// Any component can call useOrders() to access:
//   - firebaseUser  → the authenticated user object (or null)
//   - globalOrders  → sorted real-time order array
//
// How it works:
//   1. App.jsx wraps the whole tree in <OrderProvider>.
//   2. Child components call useOrders() — no prop drilling needed.
// ─────────────────────────────────────────────────────────────────────────────
import { createContext, useContext, useEffect, useState } from 'react';
import {
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db, appId } from '../config/firebase';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [firebaseUser, setFirebaseUser]   = useState(null);
  const [globalOrders, setGlobalOrders]   = useState([]);

  // ── Auth handshake ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!auth) return;

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error('[OrderContext] Auth error:', err.message);
      }
    };

    initAuth();
    const unsub = onAuthStateChanged(auth, setFirebaseUser);
    return () => unsub();
  }, []);

  // ── Live orders listener ────────────────────────────────────────────────────
  useEffect(() => {
    if (!firebaseUser || !db || !appId) return;

    const ref  = collection(db, 'artifacts', appId, 'public', 'data', 'orders');
    const unsub = onSnapshot(ref, (snap) => {
      const list = [];
      snap.forEach((d) => list.push({ dbId: d.id, ...d.data() }));
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setGlobalOrders(list);
    });

    return () => unsub();
  }, [firebaseUser]);

  return (
    <OrderContext.Provider value={{ firebaseUser, globalOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

/** Call this hook inside any component to access orders state. */
export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used inside <OrderProvider>');
  return ctx;
}
