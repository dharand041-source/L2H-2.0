'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');
  const urlMessage = searchParams.get('message');
  const next = searchParams.get('next');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(urlError);
  const [message, setMessage] = useState<string | null>(urlMessage);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message);
        setIsLoggingIn(false);
        return;
      }

      if (data.session) {
        router.push(next || ROUTES.app.dashboard);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected authentication error occurred.';
      setError(message);
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setError(null);
    setMessage(null);

    try {
      const callbackUrl = new URL('/auth/callback', window.location.origin);
      callbackUrl.searchParams.set('mode', 'signin');
      if (next) {
        callbackUrl.searchParams.set('next', next);
      }

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl.toString(),
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setIsLoggingIn(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during Google sign in.';
      setError(message);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 shadow-editorial space-y-6">
      <div className="space-y-1">
        <span className="editorial-badge bg-brand-yellow text-brand-ink text-[10px]">
          Candidate Authentication
        </span>
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-brand-ink">
          Sign In to Your Account
        </h1>
        <p className="text-xs text-brand-ink/70 font-medium">
          Access your verified skill passport, capstone workspaces, and opportunity matches.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-brand-rose text-brand-rose text-xs font-semibold flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="p-3 bg-amber-50 border border-brand-yellow text-brand-ink text-xs font-semibold flex items-start gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-brand-orange" />
          <span>{message}</span>
        </div>
      )}

      {/* Primary: Continue with Google */}
      <div>
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoggingIn}
          className="w-full p-3 bg-white border-[1.5px] border-brand-ink shadow-editorial hover:shadow-editorial-hover transition-all flex items-center justify-center gap-3 font-bold uppercase text-xs text-brand-ink disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{isLoggingIn ? 'Connecting...' : 'Continue with Google'}</span>
        </button>
      </div>

      <div className="flex items-center gap-3 my-2">
        <div className="h-[1px] bg-brand-ink/20 flex-1" />
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/50">
          Or Use Email
        </span>
        <div className="h-[1px] bg-brand-ink/20 flex-1" />
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-ink/70 mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full p-2.5 bg-brand-cream border border-brand-ink text-xs font-semibold text-brand-ink focus:outline-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-brand-ink/70">
              Password
            </label>
            <Link
              href={ROUTES.auth.forgotPassword}
              className="text-[10px] font-bold uppercase text-brand-orange hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="w-full p-2.5 bg-brand-cream border border-brand-ink text-xs font-mono text-brand-ink focus:outline-none"
          />
        </div>

        <Button variant="primary" size="md" fullWidth disabled={isLoggingIn} type="submit">
          {isLoggingIn ? 'Authenticating...' : 'Sign In with Email →'}
        </Button>
      </form>

      <div className="pt-4 border-t border-brand-ink/10 text-center text-xs text-brand-ink/70">
        Don&apos;t have an account yet?{' '}
        <Link href={ROUTES.auth.signup} className="font-bold text-brand-orange hover:underline">
          Create an Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink flex flex-col justify-between p-4 sm:p-6 lg:p-8 bg-grid-subtle">
      {/* Brand Header */}
      <div className="max-w-md w-full mx-auto">
        <Link href={ROUTES.public.home} className="flex items-center gap-3 group inline-flex mb-8">
          <div className="w-10 h-10 bg-brand-orange border-[1.5px] border-brand-ink flex items-center justify-center font-display text-white text-2xl shadow-editorial group-hover:bg-brand-rose transition-colors">
            L2H
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl tracking-tight leading-none text-brand-ink">
              LEARN-2-HIRE
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/75 mt-0.5">
              Career Operating System
            </span>
          </div>
        </Link>

        <Suspense fallback={<div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 shadow-editorial text-xs font-bold">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>

      <footer className="text-center text-[11px] text-brand-ink/60 font-semibold py-4">
        Learn-2-Hire Security &bull; Production Supabase Authentication
      </footer>
    </div>
  );
}
