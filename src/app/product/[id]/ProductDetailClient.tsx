'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingCart, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useCart } from '../../../context/CartContext';

interface Product {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  image: string;
  tag: string;
  desc: string;
}

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discountedPrice,
      image: product.image,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      <Navbar isScrolled={true} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-32">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 font-medium text-sm transition-colors mb-8"
        >
          <ChevronLeft size={16} /> Back to Store
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* ── Image section with zoom ───────────────────────────────────── */}
          <div 
            className="relative rounded-[2rem] overflow-hidden bg-stone-100 aspect-[4/5] shadow-lg group cursor-zoom-in"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {product.tag && (
              <span className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-sm text-stone-900 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-sm">
                {product.tag}
              </span>
            )}
            
            <img
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                isHovered ? 'scale-150' : 'scale-100'
              }`}
            />
          </div>

          {/* ── Product details ───────────────────────────────────────────── */}
          <div className="flex flex-col">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#1C1917] mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-bold text-[#4A3728]">
                PKR {product.discountedPrice.toLocaleString()}
              </span>
              <span className="text-lg text-stone-400 line-through">
                PKR {product.originalPrice.toLocaleString()}
              </span>
              <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-1 rounded-md">
                Save {Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)}%
              </span>
            </div>

            <p className="text-lg text-stone-600 mb-10 leading-relaxed">
              {product.desc}
            </p>

            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 border-2 ${
                  isAdded 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                    : 'bg-white text-[#1C1917] border-[#1C1917] hover:bg-stone-50'
                }`}
              >
                <ShoppingCart size={20} />
                {isAdded ? 'Added to Cart ✓' : 'Add to Cart'}
              </button>

              <Link
                href={`/checkout/${product.id}`}
                className="w-full bg-[#1C1917] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#4A3728] transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                Buy Now <ArrowRight size={20} />
              </Link>
            </div>
            
            {/* Features list */}
            <div className="mt-12 space-y-4 border-t border-stone-200 pt-8">
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">✓</div>
                <span>Premium Solid Wood Construction</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">✓</div>
                <span>Nationwide Delivery across Pakistan</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">✓</div>
                <span>Cash on Delivery Available</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
