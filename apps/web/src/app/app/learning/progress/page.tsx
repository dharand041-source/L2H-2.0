'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowLeft, Clock, CheckCircle2, Award } from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';

export default function LearningProgressPage() {
  const { state } = useCandidateState();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.learning.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Learning Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Telemetry</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Learning Progress &amp; Telemetry
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Detailed metrics tracking completion across open curricula modules, active study hours, and competency level advancement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card accentBorder="orange" className="p-6">
          <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">Study Hours</span>
          <div className="font-display text-4xl font-bold text-brand-ink mt-1">28.5 hrs</div>
          <div className="text-xs text-brand-ink/70 mt-1">Tracked across FCC, MDN &amp; SQLBolt</div>
        </Card>

        <Card accentBorder="yellow" className="p-6">
          <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">Roadmap Completion</span>
          <div className="font-display text-4xl font-bold text-brand-orange mt-1">42%</div>
          <div className="text-xs text-brand-ink/70 mt-1">2 of 6 modules completed</div>
        </Card>

        <Card accentBorder="rose" className="p-6">
          <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">Readiness Impact</span>
          <div className="font-display text-4xl font-bold text-brand-rose mt-1">+14%</div>
          <div className="text-xs text-brand-ink/70 mt-1">Gained from baseline diagnostic</div>
        </Card>
      </div>
    </div>
  );
}
