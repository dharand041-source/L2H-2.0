'use client';

import React from 'react';
import Link from 'next/link';
import { Brain, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AptitudePracticePage() {
  const problems = [
    { id: 'apt-01', title: 'Time, Speed & Relative Distance in Network Packets', topic: 'Rates & Proportions', difficulty: 'MEDIUM' },
    { id: 'apt-02', title: 'Probability Distributions & Combinatorics in Hash Buckets', topic: 'Probability', difficulty: 'HARD' },
    { id: 'apt-03', title: 'Compound Interest & Amortization Calculations', topic: 'Financial Math', difficulty: 'EASY' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.practice.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Practice Arena
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Quantitative Aptitude</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Quantitative Problem Sets
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Numerical reasoning problem sets frequently featured in technical screening examinations and cognitive assessments.
        </p>
      </div>

      <div className="space-y-3">
        {problems.map((p) => (
          <div key={p.id} className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="yellow">{p.difficulty}</Badge>
                <span className="text-xs font-bold text-brand-ink/60">{p.topic}</span>
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                {p.title}
              </h3>
            </div>
            <Link href={ROUTES.app.assessments.baseline}>
              <Button variant="outline" size="sm">
                Start Problem →
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
