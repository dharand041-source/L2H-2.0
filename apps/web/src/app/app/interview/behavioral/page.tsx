'use client';

import React from 'react';
import Link from 'next/link';
import { Brain, ArrowLeft, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function BehavioralInterviewPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.interview.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Interview Hub
        </Link>
        <span className="text-xs font-bold text-brand-rose uppercase">Behavioral &amp; STAR Method</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Behavioral &amp; Leadership Principles
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Master the STAR framework (Situation, Task, Action, Result) across real-world team conflicts and engineering trade-offs.
        </p>
      </div>

      <div className="space-y-4">
        {[
          'Describe a scenario where you strongly disagreed with a senior engineer on a technical decision. How did you handle the discussion and what was the outcome?',
          'Tell me about a high-severity production outage you caused or diagnosed. What actions did you take during the incident and what was learned?',
          'Give an example of delivering a critical milestone under tight constraints where you had to compromise on technical debt.'
        ].map((q, i) => (
          <div key={i} className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
              {q}
            </h3>
            <Link href={ROUTES.app.interview.mock}>
              <Button variant="primary" size="sm">
                Practice Response →
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
