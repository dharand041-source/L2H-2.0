'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/reset-password`
        : undefined;

      await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });
    } catch (err) {
      // Do not expose whether an arbitrary email exists
      console.warn('Password reset request error:', err);
    } finally {
      setIsSubmitting(false);
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink flex flex-col justify-between p-4 sm:p-6 lg:p-8 bg-grid-subtle">
      <div className="max-w-md w-full mx-auto">
        <Link href={ROUTES.auth.login} className="flex items-center gap-1.5 text-xs font-bold uppercase text-brand-ink hover:text-brand-orange mb-8 inline-flex">
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>

        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 shadow-editorial space-y-6">
          <div className="space-y-1">
            <span className="editorial-badge bg-brand-yellow text-brand-ink text-[10px]">
              Credential Recovery
            </span>
            <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-brand-ink">
              Reset Your Password
            </h1>
            <p className="text-xs text-brand-ink/70 font-medium">
              Enter your registered candidate email address to receive password recovery instructions.
            </p>
          </div>

          {sent ? (
            <div className="p-4 bg-brand-cream border border-brand-orange text-xs text-brand-ink font-medium space-y-2">
              <div className="flex items-center gap-2 font-bold text-brand-orange uppercase">
                <CheckCircle2 className="w-4 h-4" /> PASSWORD RESET EMAIL SENT
              </div>
              <p>Check your email for instructions.</p>
              <Link href={ROUTES.auth.login}>
                <Button variant="outline" size="sm" fullWidth className="mt-2">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-ink/70 mb-1">
                  Email Address
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

              <Button variant="primary" size="md" fullWidth disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Sending Instructions...' : 'Send Reset Link →'}
              </Button>
            </form>
          )}
        </div>
      </div>

      <footer className="text-center text-[11px] text-brand-ink/60 font-semibold py-4">
        Learn-2-Hire Security
      </footer>
    </div>
  );
}
