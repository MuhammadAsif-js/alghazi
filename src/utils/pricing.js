// ─────────────────────────────────────────────────────────────────────────────
// src/utils/pricing.js
// All business-logic math lives here — pure functions, zero side-effects.
// ─────────────────────────────────────────────────────────────────────────────

/** COD handling fee in PKR */
export const COD_FEE = 250;

/** Advance discount rate: 7% */
export const ADVANCE_DISCOUNT_RATE = 0.07;

/**
 * Returns the PKR discount for advance payment orders.
 * @param {number} subtotal - Product price (before shipping)
 * @returns {number}
 */
export function calcAdvanceDiscount(subtotal) {
  return Math.round(subtotal * ADVANCE_DISCOUNT_RATE);
}

/**
 * Calculates the shipping cost for an order.
 *
 * Rules:
 *  - Punjab + advance payment + subtotal ≥ 2500  → PKR 0 (free)
 *  - Everything else                              → PKR 300
 *
 * @param {string} province
 * @param {string} paymentMode  - "advance" | "cod"
 * @param {number} subtotal     - Product discounted price in PKR
 * @returns {number}
 */
export function calcShipping(province, paymentMode, subtotal) {
  const isFreeEligible =
    province === 'Punjab' &&
    paymentMode === 'advance' &&
    subtotal >= 2500;

  return isFreeEligible ? 0 : 300;
}

/**
 * Returns the full payment breakdown for an order.
 *
 * For ADVANCE: apply 7% discount to subtotal, then add shipping.
 * For COD:     add standard shipping + PKR 250 COD fee.
 *
 * @param {number} subtotal     - Product price (discountedPrice from DB)
 * @param {number} shipping     - Shipping fee from calcShipping()
 * @param {string} paymentMode  - "advance" | "cod"
 * @returns {{ discountApplied: number, total: number, advance: number, cod: number }}
 */
export function calcBreakdown(subtotal, shipping, paymentMode) {
  if (paymentMode === 'advance') {
    const discountApplied = calcAdvanceDiscount(subtotal);
    const discountedSubtotal = subtotal - discountApplied;
    const total = discountedSubtotal + shipping;
    return { discountApplied, total, advance: total, cod: 0 };
  }

  // COD
  const codFee = COD_FEE;
  const total = subtotal + shipping + codFee;
  return { discountApplied: 0, total, advance: 0, cod: total };
}

/**
 * Generates a random human-readable order ID.
 * @returns {string} e.g. "ORD-47291"
 */
export function generateOrderId() {
  return `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
}
