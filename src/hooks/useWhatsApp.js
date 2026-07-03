import { useCallback } from 'react';
import { WHATSAPP_NUMBER } from '../data/payment';

/**
 * useWhatsApp — WhatsApp order payload builder.
 * Formats a structured message and generates an open.whatsapp.com URL.
 */
export function useWhatsApp() {
  const buildMessage = useCallback(
    ({ formData, cartItems, subtotal, deliveryFee, total, advance, cod }) => {
      const timestamp = new Date().toLocaleString('en-PK', {
        timeZone: 'Asia/Karachi',
        dateStyle: 'medium',
        timeStyle: 'short',
      });

      const itemLines = cartItems
        .map(
          (item) =>
            `  • ${item.name} × ${item.quantity}  —  PKR ${(
              item.price * item.quantity
            ).toLocaleString()}`
        )
        .join('\n');

      const freeDelivery = deliveryFee === 0 ? ' (FREE 🎉)' : '';

      const message = `
🪵 *AL GHAZI WOOD CRAFTS — New Order*
━━━━━━━━━━━━━━━━━━━━━
📅 *Date:* ${timestamp}

👤 *Customer Details*
Name: ${formData.name}
Phone: ${formData.phone}
City: ${formData.city}, ${formData.province}
Address: ${formData.address}
${formData.notes ? `Notes: ${formData.notes}` : ''}

🛒 *Order Items*
${itemLines}

━━━━━━━━━━━━━━━━━━━━━
💰 *Payment Summary*
Subtotal:      PKR ${subtotal.toLocaleString()}
Delivery:      PKR ${deliveryFee.toLocaleString()}${freeDelivery}
*Total:        PKR ${total.toLocaleString()}*

💳 *Payment Method:* ${formData.paymentMethod.toUpperCase()}
  ✅ Advance (25%): PKR ${advance.toLocaleString()}
  🚚 COD (75%):     PKR ${cod.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━
`.trim();

      return message;
    },
    []
  );

  const openWhatsApp = useCallback(
    (orderData) => {
      const message = buildMessage(orderData);
      const encodedMessage = encodeURIComponent(message);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    [buildMessage]
  );

  return { buildMessage, openWhatsApp };
}
