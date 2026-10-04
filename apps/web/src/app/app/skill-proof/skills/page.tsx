'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SkillProofSkillsPage() {
  const { state } = useCandidateState();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.skillProof.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Proof Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Skills Ledger</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Verified Skills Ledger
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Detailed skill verifications calibrated against diagnostic items and milestone rubric scorecards.
        </p>
      </div>

      <div className="space-y-3">
        {state.skills.map((s) => (
          <div key={s.name} className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-base text-brand-ink">{s.name}</span>
                <Badge variant="yellow">{s.currentLevel}</Badge>
              </div>
              <div className="text-xs text-brand-ink/70">
                Confidence: {Math.round(s.confidence * 100)}% &bull; Required Benchmark: {s.requiredLevel}
              </div>
            </div>
            <span className="text-xs font-bold text-brand-orange flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Verified Evidence Recorded
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
