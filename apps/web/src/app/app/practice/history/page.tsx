'use client';

import React from 'react';
import Link from 'next/link';
import { History, ArrowLeft, CheckCircle2, Clock } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PracticeHistoryPage() {
  const attempts = [
    {
      id: 'att-01',
      challenge: 'REST API Sliding Window Rate Limiter',
      category: 'Coding',
      date: 'Today, 2:15 PM',
      verdict: 'PASSED',
      runtime: '42ms',
      accuracy: '100%'
    },
    {
      id: 'att-02',
      challenge: 'Top Spenders with Conditional Aggregations',
      category: 'SQL',
      date: 'Yesterday, 5:40 PM',
      verdict: 'PASSED',
      runtime: '12ms',
      accuracy: '100%'
    },
    {
      id: 'att-03',
      challenge: 'Circular & Linear Arrangement Deductions',
      category: 'Logical',
      date: '2 days ago',
      verdict: 'PASSED',
      runtime: '180s',
      accuracy: '85%'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.practice.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Practice Arena
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Submission Audit Log</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Practice Attempt History
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Historical log of code executions, test pass rates, and runtime performance benchmarks.
        </p>
      </div>

      <div className="space-y-3">
        {attempts.map((att) => (
          <div key={att.id} className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="yellow">{att.category}</Badge>
                <span className="text-xs text-brand-ink/60 font-semibold">{att.date}</span>
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                {att.challenge}
              </h3>
              <div className="text-xs text-brand-ink/70">
                Runtime: {att.runtime} &bull; Accuracy: {att.accuracy}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-orange flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {att.verdict}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
