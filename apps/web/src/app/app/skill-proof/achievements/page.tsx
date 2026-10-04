'use client';

import React from 'react';
import Link from 'next/link';
import { Award, ArrowLeft, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SkillProofAchievementsPage() {
  const achievements = [
    { title: 'Baseline Diagnostic Master', desc: 'Completed calibrated diagnostic test with >75% accuracy', badge: 'orange' },
    { title: 'Full Stack Architecture Pioneer', desc: 'Submitted verified multi-tier capstone with Docker & PostgreSQL', badge: 'yellow' },
    { title: 'Clean Bug Hunter', desc: 'Successfully debugged memory leaks and unreleased pool connections', badge: 'rose' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.skillProof.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Proof Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Milestones &amp; Badges</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Candidate Badges &amp; Achievements
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Objective milestones unlocked throughout your end-to-end Learn-2-Hire candidate journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {achievements.map((ach) => (
          <Card key={ach.title} accentBorder={ach.badge as any} className="space-y-2">
            <Award className="w-8 h-8 text-brand-orange mb-2" />
            <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
              {ach.title}
            </h3>
            <p className="text-xs text-brand-ink/80 font-medium">
              {ach.desc}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
