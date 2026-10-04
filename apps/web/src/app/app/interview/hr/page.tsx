'use client';

import React from 'react';
import Link from 'next/link';
import { Users, ArrowLeft, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HRInterviewPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.interview.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Interview Hub
        </Link>
        <span className="text-xs font-bold text-brand-yellow uppercase">HR Screening</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          HR &amp; Executive Screening Round
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Prepare responses for compensation benchmarks, relocation preferences, career goals, and workplace culture fit.
        </p>
      </div>

      <div className="space-y-4">
        {[
          'Why are you targeting this role and what are your 3-year engineering goals?',
          'How do you manage expectations and communicate proactively when project delivery deadlines are at risk?',
          'What is your preferred working style between autonomous individual deep-work and collaborative pairing?'
        ].map((q, i) => (
          <div key={i} className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
              {q}
            </h3>
            <Link href={ROUTES.app.interview.mock}>
              <Button variant="primary" size="sm">
                Simulate Answer →
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
