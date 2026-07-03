import { createContext, useContext } from 'react';
import { useCheckout } from '../hooks/useCheckout';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const checkout = useCheckout();
  return (
    <CartContext.Provider value={checkout}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
