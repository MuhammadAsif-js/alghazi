'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[App Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="text-red-400" size={28} />
      </div>
      <h1 className="text-3xl font-serif font-bold text-[#1C1917] mb-3">Something went wrong</h1>
      <p className="text-stone-500 mb-8 max-w-sm text-sm">
        We encountered an unexpected error. Please try again or contact us on WhatsApp.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-[#1C1917] text-white px-6 py-3 rounded-full font-medium hover:bg-[#4A3728] transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="border border-stone-300 text-stone-600 px-6 py-3 rounded-full font-medium hover:bg-stone-100 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
