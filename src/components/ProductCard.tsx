'use client';

import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const cardVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 20 } },
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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      variants={cardVariant}
      className="group flex flex-col relative h-full"
    >
      {/* ── Product image ──────────────────────────────────────────────────── */}
      <div className="relative aspect-[4/5] bg-stone-200 rounded-[2rem] overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-700">
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-500 z-10" />

        {/* Tag badge */}
        {product.tag && (
          <span className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm text-stone-900 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            {product.tag}
          </span>
        )}

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
        />
      </div>

      {/* ── Product info ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col px-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif font-bold text-xl text-[#1C1917] pr-4">
            {product.name}
          </h3>
          <div className="flex flex-col items-end text-right shrink-0">
            <span className="text-[10px] text-stone-400 line-through mb-0.5">
              PKR {product.originalPrice.toLocaleString()}
            </span>
            <span className="font-bold text-lg text-[#4A3728]">
              PKR {product.discountedPrice.toLocaleString()}
            </span>
          </div>
        </div>

        <p className="text-sm text-stone-500 mb-6">{product.desc}</p>

        <Link
          id={`buy-now-${product.id}`}
          href={`/checkout/${product.id}`}
          className="mt-auto w-full bg-white border border-stone-200 text-[#1C1917] py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#1C1917] hover:border-[#1C1917] hover:text-white transition-all shadow-sm"
        >
          Buy Now <ArrowRight size={16} />
        </Link>
      </div>
    </motion.div>
  );
}
