'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (res?.error) {
      setError('Invalid email or password.');
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-6 selection:bg-emerald-500/30">
      <div className="w-full max-w-md bg-stone-950 border border-stone-800 rounded-[2rem] p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-stone-900 border border-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="text-amber-500" size={24} />
          </div>
          <h1 className="text-2xl font-mono font-bold text-white tracking-tighter">ADMIN SECURE ACCESS</h1>
          <p className="text-xs text-stone-500 mt-2 font-mono">AUTHORIZED PERSONNEL ONLY</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 font-mono mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl bg-stone-900 border border-stone-800 focus:border-stone-600 outline-none text-white text-sm font-mono placeholder-stone-700"
              placeholder="e.g. owner@alghazi.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 font-mono mb-2">
              Secure Key (Password)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl bg-stone-900 border border-stone-800 focus:border-stone-600 outline-none text-white text-sm font-mono placeholder-stone-750"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-center p-3 text-red-400 text-xs bg-red-950/30 border border-red-900 rounded-xl font-mono">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black py-4 rounded-xl font-bold font-mono text-sm hover:bg-stone-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
          >
            {isLoading ? 'AUTHENTICATING...' : 'ACCESS SYSTEM'} <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center mt-8">
          <Link href="/" className="text-xs text-stone-600 hover:text-stone-400 transition-colors font-mono">
            Exit System
          </Link>
        </div>
      </div>
    </div>
  );
}
