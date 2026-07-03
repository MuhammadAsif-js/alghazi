// ─────────────────────────────────────────────────────────────────────────────
// src/utils/pricing.js
// All business-logic math lives here — pure functions, zero side-effects.
// Unit-testable in isolation. Import individual functions wherever needed.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculates the shipping cost for an order.
 *
 * Rules:
 *  - Punjab + full-payment + subtotal ≥ 2500  → PKR 0 (free)
 *  - Everything else                           → PKR 300
 *
 * @param {string}  province     - Selected province (e.g. "Punjab")
 * @param {string}  paymentMode  - "advance" | "full"
 * @param {number}  subtotal     - Product discounted price in PKR
 * @returns {number}
 */
export function calcShipping(province, paymentMode, subtotal) {
  const isFreeEligible =
    province === 'Punjab' &&
    paymentMode === 'full' &&
    subtotal >= 2500;

  return isFreeEligible ? 0 : 300;
}

/**
 * Returns the full payment breakdown for an order.
 *
 * @param {number} subtotal     - Product price
 * @param {number} shipping     - Shipping fee (use calcShipping)
 * @param {string} paymentMode  - "advance" | "full"
 * @returns {{ total: number, advance: number, cod: number }}
 */
export function calcBreakdown(subtotal, shipping, paymentMode) {
  const total   = subtotal + shipping;
  const advance = paymentMode === 'full' ? total : Math.round(total * 0.25);
  const cod     = total - advance;
  return { total, advance, cod };
}

/**
 * Generates a random human-readable order ID.
 * @returns {string} e.g. "ORD-47291"
 */
export function generateOrderId() {
  return `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
}
