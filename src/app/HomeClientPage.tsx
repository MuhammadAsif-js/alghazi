'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Truck, Banknote, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

interface Product {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  image: string;
  tag: string;
  desc: string;
}

interface HomeClientPageProps {
  initialProducts: Product[];
  initialOrdersCount: number;
}

const LiveTicker = ({ count, blip }: { count: number; blip: boolean }) => (
  <div
    className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border mb-6 transition-all duration-700 backdrop-blur-md
      ${blip
        ? 'bg-emerald-50 border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
        : 'bg-white/60 border-stone-200'
      }`}
  >
    <span className="relative flex h-2.5 w-2.5">
      <span className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${blip ? 'animate-ping' : ''}`} />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
    </span>
    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-700">
      {count + 111} Orders Dispatched
    </span>
  </div>
);

export default function HomeClientPage({ initialProducts, initialOrdersCount }: HomeClientPageProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [tickerBlip, setTickerBlip] = useState(false);
  const [liveCount, setLiveCount] = useState(initialOrdersCount);
  const esRef = useRef<EventSource | null>(null);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 250]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── SSE real-time order counter ──────────────────────────────────────
    esRef.current = new EventSource('/api/orders/count');
    esRef.current.onmessage = (e) => {
      try {
        const { count } = JSON.parse(e.data);
        if (count !== liveCount) {
          setLiveCount(count);
          setTickerBlip(true);
          setTimeout(() => setTickerBlip(false), 1200);
        }
      } catch {}
    };

    // Periodic blip animation even when count doesn't change
    const blipInterval = setInterval(() => {
      setTickerBlip(true);
      setTimeout(() => setTickerBlip(false), 1000);
    }, 8000);

    return () => {
      window.removeEventListener('scroll', onScroll);
      esRef.current?.close();
      clearInterval(blipInterval);
    };
  }, []);

  const scrollToCollection = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navbar isScrolled={isScrolled} />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[95vh] flex items-center pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 w-full items-center">
          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="lg:col-span-5 z-10"
          >
            <LiveTicker count={liveCount} blip={tickerBlip} />

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight leading-[1.05] mb-6 text-[#1C1917]">
              Handcrafted.<br />
              <span className="text-[#8c7462] italic font-light">Pure Wood. Pure Craft.</span>
            </h1>
            <p className="text-lg text-stone-500 mb-8 max-w-md font-light leading-relaxed">
              From Quran stands to kitchen essentials — every piece is handcrafted from solid wood in our workshop. No shortcuts, no middlemen.
            </p>
            <button
              id="hero-shop-btn"
              onClick={scrollToCollection}
              className="bg-[#1C1917] text-white px-8 py-4 rounded-full font-medium shadow-xl hover:bg-[#4A3728] transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
            >
              Shop Collection <ArrowRight size={18} />
            </button>
          </motion.div>

          {/* Hero image with parallax */}
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="lg:col-span-7 relative h-[50vh] lg:h-[80vh] w-full"
          >
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-2xl border border-white/60">
              <img
                src="https://images.pexels.com/photos/5998041/pexels-photo-5998041.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Premium wood craft setup"
                className="w-full h-full object-cover scale-[1.05]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-stone-200 py-8 relative z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-stone-100">
          <TrustPill icon={<Truck className="text-stone-700" />} title="Nationwide Delivery" sub="Free in Punjab (Orders > 2500)" />
          <TrustPill icon={<Banknote className="text-stone-700" />} title="Cash on Delivery" sub="Secure 25% Advance system" />
          <TrustPill icon={<ShieldCheck className="text-stone-700" />} title="100% Solid Wood" sub="Premium Artisan Craftsmanship" />
        </div>
      </section>

      {/* ── COLLECTION GRID ───────────────────────────────────────────────── */}
      <section id="collection" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center mb-16">
          <h2 className="text-[10px] font-bold text-[#4A3728] uppercase tracking-[0.3em] mb-4">The Collection</h2>
          <p className="text-4xl sm:text-5xl font-serif font-bold text-[#1C1917]">Functional Art</p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {initialProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </section>

      {/* ── FOUNDERS ──────────────────────────────────────────────────────── */}
      <section id="founders" className="py-24 bg-[#1C1917] text-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden">
              <img
                src="https://images.pexels.com/photos/1750059/pexels-photo-1750059.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Founders at work"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-transparent to-transparent" />
            </div>
            <div>
              <h2 className="text-[10px] font-bold text-[#b59f8c] uppercase tracking-[0.3em] mb-4">Our Craft</h2>
              <h3 className="text-4xl sm:text-5xl font-serif font-bold mb-8">A Brotherhood of Craftsmanship.</h3>
              <p className="text-stone-400 text-lg leading-relaxed mb-6">
                AL GHAZI WOOD CRAFTS was born from a singular vision: to bridge the gap between raw, natural beauty and modern utility. Founded by two brothers, we manage every step of the journey.
              </p>
              <p className="text-stone-400 text-lg leading-relaxed mb-8">
                From hand-selecting the finest timber at the local yards to the final sanding and oiling in our workshop, there are no middlemen. This direct-to-consumer approach allows us to deliver uncompromising luxury at honest prices.
              </p>
              <div className="flex gap-8">
                <Stat value="100%" label="Solid Wood" />
                <Stat value="0" label="Middlemen" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

const TrustPill = ({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) => (
  <div className="flex items-center justify-center gap-4 pt-4 md:pt-0">
    <div className="bg-stone-50 p-3 rounded-full">{icon}</div>
    <div>
      <p className="font-bold text-sm">{title}</p>
      <p className="text-xs text-stone-500">{sub}</p>
    </div>
  </div>
);

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div>
    <span className="block text-3xl font-serif font-bold text-white mb-1">{value}</span>
    <span className="text-xs text-stone-500 uppercase tracking-widest">{label}</span>
  </div>
);
