// ─────────────────────────────────────────────────────────────────────────────
// src/utils/whatsapp.js
// Builds the pre-formatted WhatsApp message and opens the wa.me deep-link.
// Import openWhatsAppOrder() from the checkout confirmation step.
// ─────────────────────────────────────────────────────────────────────────────
import { WHATSAPP_NUMBER } from '../data/locations';

/**
 * Formats the order payload into a WhatsApp URL and navigates to it.
 *
 * @param {object} p
 * @param {string}  p.orderId       - e.g. "ORD-47291"
 * @param {string}  p.productName   - Product display name
 * @param {number}  p.total         - Full order total in PKR
 * @param {number}  p.advance       - Advance amount paid
 * @param {string}  p.customerName  - Buyer's full name
 * @param {string}  p.street        - House / street detail
 * @param {string}  p.city          - Town / city
 */
export function openWhatsAppOrder({ orderId, productName, total, advance, customerName, street, city }) {
  const lines = [
    `Hello! I have placed an order and paid the advance. Here is my screenshot.`,
    ``,
    `*Order ID:* ${orderId}`,
    `*Item:* ${productName}`,
    `*Total Value:* PKR ${total}`,
    `*Amount Paid:* PKR ${advance}`,
    `*Delivery To:* ${customerName} (${street}, ${city})`,
  ];

  const encoded = encodeURIComponent(lines.join('\n'));
  window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}
