'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowLeft, ArrowRight, AlertTriangle } from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ImproveSkillGapsPage() {
  const { state } = useCandidateState();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.improve.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Improvement Hub
        </Link>
        <span className="text-xs font-bold text-brand-rose uppercase">Gap Diagnostics</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Remediation Gap Matrix
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Priority step gaps identified from missed assessment items, interview feedback, and job rejections.
        </p>
      </div>

      <div className="space-y-4">
        {state.skills.map((s) => (
          <div key={s.name} className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-base text-brand-ink">{s.name}</span>
                <Badge variant={s.gap > 0 ? 'rose' : 'yellow'}>
                  {s.gap > 0 ? `${s.gap} Level Step Gap` : 'Benchmark Satisfied'}
                </Badge>
              </div>
              <div className="text-xs text-brand-ink/70">
                Current: {s.currentLevel} &bull; Target Benchmark: {s.requiredLevel} &bull; Priority: {s.priority}
              </div>
            </div>

            <Link href={ROUTES.app.improve.retraining}>
              <Button variant="primary" size="sm">
                Queue Retraining Module →
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
