'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Loader2, AlertCircle } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError('Невірний email або пароль');
        setLoading(false);
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError('Помилка входу. Спробуйте ще раз.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="block text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]/70 font-medium mb-2">
          Email
        </span>
        <input
          type="email"
          required
          autoFocus
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@gluhoman.local"
          className="w-full px-4 py-3 bg-transparent border border-[#e6d9b8]/25 text-[#f4ecd8] placeholder:text-[#e6d9b8]/25 text-sm focus:outline-none focus:border-[#e6d9b8]/60 transition-colors"
        />
      </label>

      <label className="block">
        <span className="block text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]/70 font-medium mb-2">
          Пароль
        </span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-4 py-3 bg-transparent border border-[#e6d9b8]/25 text-[#f4ecd8] placeholder:text-[#e6d9b8]/25 text-sm focus:outline-none focus:border-[#e6d9b8]/60 transition-colors"
        />
      </label>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-[#e6d9b8]/10 border border-[#e6d9b8]/30">
          <AlertCircle className="h-4 w-4 text-[#e6d9b8] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[#f4ecd8] font-display italic">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1a3d2e] border border-[#e6d9b8]/40 text-[#f4ecd8] text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-[#0b1410] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? 'Вхід…' : 'Увійти'}
      </button>

      <p className="text-[10px] uppercase tracking-[0.22em] text-center text-[#e6d9b8]/35 font-medium pt-2">
        admin@gluhoman.local · admin123
      </p>
    </form>
  );
}
