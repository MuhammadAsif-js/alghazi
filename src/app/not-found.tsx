import Link from 'next/link';
import { PackageX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-6">
        <PackageX className="text-stone-400" size={28} />
      </div>
      <h1 className="text-4xl font-serif font-bold text-[#1C1917] mb-3">Page Not Found</h1>
      <p className="text-stone-500 mb-8 max-w-sm">
        The product or page you&apos;re looking for doesn&apos;t exist or may have been removed.
      </p>
      <Link
        href="/"
        className="bg-[#1C1917] text-white px-8 py-4 rounded-full font-medium hover:bg-[#4A3728] transition-colors shadow-lg"
      >
        Back to Store
      </Link>
    </div>
  );
}
