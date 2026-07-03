'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

const WHATSAPP_NUMBER = '923084382626';

interface NavbarProps {
  isScrolled: boolean;
}

export default function Navbar({ isScrolled }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop / main bar ─────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full px-4 pt-4 lg:pt-6 pointer-events-none">
        <nav
          className={`w-full max-w-6xl transition-all duration-500 pointer-events-auto rounded-[2rem]
            ${isScrolled
              ? 'bg-white/80 backdrop-blur-xl shadow-lg border border-white/50 py-3 px-6'
              : 'bg-transparent py-4 px-4'
            }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 group text-left"
            >
              <div className="w-10 h-10 bg-[#1C1917] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-[#FDFBF7] font-serif font-bold text-lg">AG</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-bold tracking-widest uppercase leading-none text-[#1C1917]">
                  AL GHAZI
                </span>
                <span className="text-[8px] tracking-[0.2em] text-[#8c7462] font-semibold mt-1 uppercase">
                  Wood Crafts & Interior
                </span>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-sm font-medium text-stone-600 hover:text-[#1C1917] transition-colors"
              >
                Store
              </Link>
              <Link
                href="/track"
                className="text-sm font-medium text-stone-600 hover:text-[#1C1917] transition-colors"
              >
                Track Order
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1C1917] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-[#4A3728] transition-colors"
              >
                Contact Us
              </a>
            </div>

            {/* Hamburger */}
            <button
              className="md:hidden p-2 text-[#1C1917]"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* ── Mobile menu ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-24 z-40 bg-white/95 backdrop-blur-xl border border-stone-200 rounded-[2rem] shadow-2xl p-6 flex flex-col gap-4"
          >
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="text-left text-lg font-bold p-2 border-b border-stone-100"
            >
              Storefront
            </Link>
            <Link
              href="/track"
              onClick={() => setMobileOpen(false)}
              className="text-left text-lg font-bold p-2 border-b border-stone-100"
            >
              Track Order
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="text-left text-lg font-bold p-2 text-[#25D366]"
            >
              WhatsApp Support
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
