'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, subtotal } = useCart();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = () => {
    if (cartItems.length === 1) {
      router.push(`/checkout/${cartItems[0].id}`);
    } else if (cartItems.length > 1) {
      const itemsList = cartItems.map((item: any) => `- ${item.name} (x${item.quantity}) - PKR ${(item.price * item.quantity).toLocaleString()}`).join('\n');
      const message = [
        `Assalam-o-Alaikum! I'd like to place an order for multiple items from my cart.`,
        ``,
        `🛒 Cart Items:`,
        itemsList,
        ``,
        `💰 Total: PKR ${subtotal.toLocaleString()}`,
        ``,
        `Please guide me on how to proceed with the checkout and payment.`
      ].join('\n');
      
      window.open(`https://wa.me/923084382626?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      <Navbar isScrolled={true} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-32">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 font-medium text-sm transition-colors mb-8"
        >
          <ChevronLeft size={16} /> Continue Shopping
        </Link>

        <h1 className="text-4xl font-serif font-bold text-[#1C1917] mb-12">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-stone-200 shadow-sm">
            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="text-stone-300" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-[#1C1917] mb-2">Your cart is empty</h2>
            <p className="text-stone-500 mb-8">Looks like you haven't added anything yet.</p>
            <Link
              href="/"
              className="inline-flex bg-[#1C1917] text-white px-8 py-4 rounded-xl font-bold shadow-md hover:bg-[#4A3728] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-10">
            {/* ── Cart Items ────────────────────────────────────────────── */}
            <div className="lg:col-span-8 space-y-6">
              {cartItems.map((item: any) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={item.id}
                  className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center gap-6"
                >
                  <Link href={`/product/${item.id}`} className="shrink-0 group">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-stone-100 rounded-2xl overflow-hidden shadow-inner">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-serif font-bold text-lg text-[#1C1917] mb-1 hover:text-[#4A3728] transition-colors">{item.name}</h3>
                    </Link>
                    <p className="text-[#4A3728] font-bold mb-4 sm:mb-6">PKR {item.price.toLocaleString()}</p>

                    <div className="flex items-center gap-6 mt-auto w-full justify-between sm:justify-start">
                      <div className="flex items-center bg-stone-100 rounded-full p-1 border border-stone-200">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-stone-600 hover:text-stone-900 shadow-sm transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-stone-600 hover:text-stone-900 shadow-sm transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-rose-500 transition-colors p-2"
                        aria-label="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="hidden sm:block text-right">
                    <p className="text-xs text-stone-400 mb-1">Subtotal</p>
                    <p className="font-bold text-[#1C1917] whitespace-nowrap">PKR {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ── Order Summary ─────────────────────────────────────────── */}
            <div className="lg:col-span-4">
              <div className="bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm sticky top-24">
                <h3 className="font-serif font-bold text-xl text-[#1C1917] mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#1C1917]">PKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping</span>
                    <span className="text-stone-400 italic">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-6 mb-8 flex justify-between items-end">
                  <span className="font-bold text-[#1C1917]">Estimated Total</span>
                  <span className="text-2xl font-serif font-bold text-[#4A3728]">PKR {subtotal.toLocaleString()}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#1C1917] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#4A3728] transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight size={20} />
                </button>
                
                {cartItems.length > 1 && (
                  <p className="text-xs text-stone-400 text-center mt-4">
                    For multiple items, checkout is securely handled via our WhatsApp support.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
