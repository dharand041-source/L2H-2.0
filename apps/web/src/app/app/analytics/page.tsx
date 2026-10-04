'use client';

import React from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AnalyticsCockpitPage() {
  const { state } = useCandidateState();

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="editorial-badge bg-brand-yellow text-brand-ink">
            Longitudinal Telemetry
          </span>
          <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
            Diagnostic &amp; Growth Cockpit
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Candidate Analytics Cockpit
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Objective growth curves tracking diagnostic evaluations, study hours, code execution accuracy, and application conversion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card accentBorder="orange" className="p-6">
          <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">Competency Velocity</span>
          <div className="font-display text-4xl font-bold text-brand-orange mt-1">+2.4 Lvl</div>
          <div className="text-xs text-brand-ink/70 mt-1">Average upgrade per 30 days</div>
        </Card>

        <Card accentBorder="yellow" className="p-6">
          <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">Challenge Pass Rate</span>
          <div className="font-display text-4xl font-bold text-brand-ink mt-1">94%</div>
          <div className="text-xs text-brand-ink/70 mt-1">42 challenges attempted</div>
        </Card>

        <Card accentBorder="rose" className="p-6">
          <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">Interview Rating</span>
          <div className="font-display text-4xl font-bold text-brand-rose mt-1">87%</div>
          <div className="text-xs text-brand-ink/70 mt-1">Simulated score across 3 rounds</div>
        </Card>

        <Card accentBorder="pink" className="p-6">
          <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">Match Conversion</span>
          <div className="font-display text-4xl font-bold text-brand-ink mt-1">100%</div>
          <div className="text-xs text-brand-ink/70 mt-1">2 applications tracked active</div>
        </Card>
      </div>
    </div>
  );
}
