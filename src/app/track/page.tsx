'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Package, Search, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { trackOrder } from '../actions/order';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  PROCESSING: 'bg-blue-100 text-blue-700 border-blue-200',
  SHIPPED: 'bg-purple-100 text-purple-700 border-purple-200',
  DELIVERED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-red-100 text-red-700 border-red-200',
};

function TrackingContent() {
  const searchParams = useSearchParams();
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (orderIdToSearch?: string) => {
    const id = orderIdToSearch || searchId;
    if (!id.trim()) return;

    setIsLoading(true);
    setError('');
    const res = await trackOrder(id);
    setIsLoading(false);

    if (res.success && res.order) {
      setResult(res.order);
      setHasSearched(true);
    } else {
      setResult(null);
      setError(res.error || 'Order not found.');
      setHasSearched(true);
    }
  };

  // Automatically search if ID is in the query params
  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      setSearchId(idParam);
      handleSearch(idParam);
    }
  }, [searchParams]);

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-[2rem] shadow-xl border border-stone-100">
      <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-6">
        <Package className="text-stone-600" />
      </div>

      <h1 className="text-2xl font-serif font-bold mb-2 text-[#1C1917]">Track Your Order</h1>
      <p className="text-sm text-stone-500 mb-6 font-light">
        Enter the Order ID (e.g., ORD-12345) provided during checkout.
      </p>

      <div className="flex gap-2 mb-8">
        <input
          id="track-input"
          type="text"
          placeholder="e.g. ORD-12345"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 p-4 rounded-xl bg-stone-50 border border-stone-200 outline-none uppercase font-mono text-sm text-[#1C1917]"
        />
        <button
          id="track-search"
          onClick={() => handleSearch()}
          disabled={isLoading}
          className="bg-[#1C1917] text-white px-6 rounded-xl hover:bg-[#4A3728] transition-colors disabled:opacity-50"
        >
          <Search size={20} />
        </button>
      </div>

      {isLoading && (
        <div className="text-center p-6 text-stone-500 text-sm">
          Searching order details...
        </div>
      )}

      {hasSearched && !isLoading && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {result ? (
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 text-left">
              <div className="mb-4">
                <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1">Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-2 ${STATUS_STYLES[result.status] || STATUS_STYLES.PENDING}`}>
                  {result.status === 'PENDING' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  )}
                  {result.status}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1 text-[#1C1917]">{result.itemName}</h3>
              <p className="text-xs text-stone-500 font-mono mb-4">ID: {result.orderNumber}</p>
              <div className="text-sm bg-white p-3 rounded-lg border border-stone-100 flex justify-between">
                <span className="text-stone-500">Total Amount</span>
                <strong className="text-[#4A3728]">PKR {result.totalAmount.toLocaleString()}</strong>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 text-red-500 text-sm bg-red-50 rounded-2xl">
              {error}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default function TrackingView() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      <Navbar isScrolled={isScrolled} />

      <div className="flex-1 flex items-center justify-center p-6">
        <Suspense fallback={<div className="text-stone-500">Loading search...</div>}>
          <TrackingContent />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
