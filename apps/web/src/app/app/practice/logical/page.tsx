'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, ArrowLeft, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LogicalPracticePage() {
  const problems = [
    { id: 'log-01', title: 'Circular & Linear Arrangement Deductions', topic: 'Arrangements', difficulty: 'MEDIUM' },
    { id: 'log-02', title: 'Syllogistic Deductive Reasoning & Venn Formulations', topic: 'Syllogisms', difficulty: 'EASY' },
    { id: 'log-03', title: 'Cryptarithmetic & Number Sequence Transformations', topic: 'Pattern Logic', difficulty: 'HARD' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.practice.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Practice Arena
        </Link>
        <span className="text-xs font-bold text-brand-yellow uppercase">Logical Reasoning</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Logical Deductive Reasoning
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Cognitive pattern challenges, data sufficiency, and relational deductive frameworks.
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
                Solve Problem →
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
