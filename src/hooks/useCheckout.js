import { useState, useCallback, useMemo } from 'react';
import { getDeliveryFee, getDeliveryMessage } from '../data/locations';
import { getPaymentBreakdown } from '../data/payment';

const initialFormState = {
  name: '',
  phone: '',
  address: '',
  city: '',
  province: '',
  paymentMethod: 'bank',
  notes: '',
};

/**
 * useCheckout — Central checkout state manager.
 * Handles cart operations, dynamic pricing, and form state.
 */
export function useCheckout() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  // ── Cart Operations ──────────────────────────────────────

  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  // ── Pricing Calculations ─────────────────────────────────

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const deliveryFee = useMemo(
    () => getDeliveryFee(formData.province, subtotal),
    [formData.province, subtotal]
  );

  const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

  const { advance, cod } = useMemo(
    () => getPaymentBreakdown(total),
    [total]
  );

  const deliveryMessage = useMemo(
    () => getDeliveryMessage(formData.province, subtotal),
    [formData.province, subtotal]
  );

  const isFreeDelivery = deliveryFee === 0 && !!formData.province;

  // ── Form Handling ────────────────────────────────────────

  const updateForm = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormState);
  }, []);

  const isFormValid = useMemo(() => {
    return (
      formData.name.trim().length >= 2 &&
      formData.phone.trim().length >= 10 &&
      formData.address.trim().length >= 5 &&
      formData.city.trim().length >= 2 &&
      formData.province !== ''
    );
  }, [formData]);

  return {
    // Cart state
    cartItems,
    isCartOpen,
    setIsCartOpen,
    cartCount,
    // Cart actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    // Pricing
    subtotal,
    deliveryFee,
    total,
    advance,
    cod,
    deliveryMessage,
    isFreeDelivery,
    // Form
    formData,
    updateForm,
    resetForm,
    isFormValid,
  };
}
