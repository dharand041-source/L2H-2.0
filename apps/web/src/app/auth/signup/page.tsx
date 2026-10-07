'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams?.get('error');
  const urlMessage = searchParams?.get('message');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const isBusy = isEmailSubmitting || isGoogleSubmitting;
  const [error, setError] = useState<string | null>(urlError || null);
  const [message, setMessage] = useState<string | null>(urlMessage || null);

  React.useEffect(() => {
    let isMounted = true;
    async function checkExistingAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (isMounted && user) {
          router.replace(ROUTES.app.dashboard);
        }
      } catch {}
    }
    checkExistingAuth();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Validation
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Please provide your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your confirm password.');
      return;
    }

    setIsEmailSubmitting(true);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?mode=signup&next=/onboarding`,
        },
      });

      if (authError) {
        setError(authError.message);
        setIsEmailSubmitting(false);
        return;
      }

      if (data.session) {
        router.push(ROUTES.onboarding);
      } else if (data.user && !data.session) {
        setMessage('Registration successful! Please check your email to confirm your account before logging in.');
        setIsEmailSubmitting(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected registration error occurred.';
      setError(msg);
      setIsEmailSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const callbackUrl = new URL('/auth/callback', window.location.origin);
      callbackUrl.searchParams.set('mode', 'signup');
      callbackUrl.searchParams.set('next', '/onboarding');

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl.toString(),
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setIsGoogleSubmitting(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during Google registration.';
      setError(msg);
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 shadow-editorial space-y-6">
      <div className="space-y-1">
        <span className="editorial-badge bg-brand-yellow text-brand-ink text-[10px]">
          CANDIDATE REGISTRATION
        </span>
        <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-brand-ink">
          CREATE YOUR ACCOUNT
        </h1>
        <p className="text-xs text-brand-ink/70 font-medium">
          Build your career profile, measure your skills, and start your journey.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-brand-rose text-brand-rose text-xs font-semibold flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-600 text-emerald-800 text-xs font-semibold flex items-start gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={isBusy}
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
        <span>{isGoogleSubmitting ? 'CONTINUING WITH GOOGLE...' : 'CONTINUE WITH GOOGLE'}</span>
      </button>

      <div className="flex items-center gap-3 my-2">
        <div className="h-[1px] bg-brand-ink/20 flex-1" />
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/50">
          Or Use Email
        </span>
        <div className="h-[1px] bg-brand-ink/20 flex-1" />
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-ink/70 mb-1">
            FULL NAME
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Mercer"
            className="w-full p-2.5 bg-brand-cream border border-brand-ink text-xs font-semibold text-brand-ink focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-ink/70 mb-1">
            EMAIL ADDRESS
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex.mercer@example.com"
            className="w-full p-2.5 bg-brand-cream border border-brand-ink text-xs font-semibold text-brand-ink focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-ink/70 mb-1">
            PASSWORD
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full p-2.5 bg-brand-cream border border-brand-ink text-xs font-mono text-brand-ink focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-ink/70 mb-1">
            CONFIRM PASSWORD
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full p-2.5 bg-brand-cream border border-brand-ink text-xs font-mono text-brand-ink focus:outline-none"
          />
        </div>

        <Button variant="primary" size="md" fullWidth disabled={isBusy} type="submit">
          {isEmailSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT →'}
        </Button>
      </form>

      <div className="pt-4 border-t border-brand-ink/10 text-center text-xs text-brand-ink/70">
        Already have an account?{' '}
        <Link href={ROUTES.auth.login} className="font-bold text-brand-orange hover:underline">
          SIGN IN
        </Link>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink flex flex-col justify-between p-4 sm:p-6 lg:p-8 bg-grid-subtle">
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
          <SignUpForm />
        </Suspense>
      </div>

      <footer className="text-center text-[11px] text-brand-ink/60 font-semibold py-4">
        Zero Paywalls &bull; ESCO &amp; O*NET Standard Taxonomy &bull; Production Supabase Auth
      </footer>
    </div>
  );
}
