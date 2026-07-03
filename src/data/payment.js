// ============================================================
// AL GHAZI WOOD CRAFTS — Payment Details
// ============================================================

export const WHATSAPP_NUMBER = '923001234567'; // Replace with real number

export const PAYMENT_METHODS = [
  {
    id: 'bank',
    label: 'Bank Transfer',
    icon: '🏦',
    details: {
      bankName: 'Meezan Bank',
      accountTitle: 'AL GHAZI WOOD CRAFTS',
      accountNumber: '0123-0123456789',
      IBAN: 'PK36MEZN0001230123456789',
    },
  },
  {
    id: 'jazzcash',
    label: 'JazzCash',
    icon: '📱',
    details: {
      accountTitle: 'AL GHAZI WOOD CRAFTS',
      mobileNumber: '0300-1234567',
      note: 'Send to Mobile Account',
    },
  },
  {
    id: 'easypaisa',
    label: 'EasyPaisa',
    icon: '💚',
    details: {
      accountTitle: 'AL GHAZI WOOD CRAFTS',
      mobileNumber: '0300-1234567',
      note: 'Send to Mobile Account',
    },
  },
];

// Advance payment ratio
export const ADVANCE_RATIO = 0.25;  // 25% advance
export const COD_RATIO = 0.75;      // 75% on delivery

/**
 * Returns advance and COD breakdown from total.
 * @param {number} total - Full order total
 * @returns {{ advance: number, cod: number }}
 */
export function getPaymentBreakdown(total) {
  const advance = Math.ceil(total * ADVANCE_RATIO);
  const cod = total - advance;
  return { advance, cod };
}
