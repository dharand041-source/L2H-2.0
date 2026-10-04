'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CompanyPracticePage() {
  const companySets = [
    {
      company: 'Tata Consultancy Services (TCS)',
      type: 'Digital & Prime Patterns',
      topics: 'Advanced Coding, Cryptarithmetic, SQL Joins',
      difficulty: 'HARD',
      pattern: 'Reported 2024 Examination Structure',
    },
    {
      company: 'Zoho Corporation',
      type: 'Level 2 & Level 3 Rounds',
      topics: 'Array Matrix Manipulations, Recursion, Object Modeling',
      difficulty: 'VERY HARD',
      pattern: 'Hands-on Pure Algorithmic Coding',
    },
    {
      company: 'Amazon Web Services',
      type: 'Online Assessment (OA)',
      topics: 'Sliding Window, Priority Queues, Dynamic Programming',
      difficulty: 'HARD',
      pattern: 'Leadership Principles & Code Efficiency',
    },
    {
      company: 'Infosys Limited',
      type: 'Specialist Programmer (SP)',
      topics: 'Graph Traversals, Bit Manipulation, String DP',
      difficulty: 'HARD',
      pattern: 'InfyTQ Advanced Assessment Format',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.practice.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Practice Arena
        </Link>
        <span className="text-xs font-bold text-brand-rose uppercase">Company Patterns</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Company Pattern Problem Sets
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Calibrated to reported problem styles and formats from premier technical employers (TCS, Zoho, Amazon, Infosys).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {companySets.map((c) => (
          <Card key={c.company} hoverable accentBorder="rose" className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="rose">{c.difficulty}</Badge>
                <span className="text-xs font-bold text-brand-ink/60">{c.pattern}</span>
              </div>
              <h3 className="font-display text-2xl font-bold uppercase text-brand-ink mb-1">
                {c.company}
              </h3>
              <div className="text-xs font-bold text-brand-orange mb-2">{c.type}</div>
              <p className="text-xs text-brand-ink/80 font-medium">
                Focus Areas: {c.topics}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-ink/20">
              <Link href={ROUTES.app.practice.coding}>
                <Button variant="primary" size="sm" fullWidth>
                  Launch Company Pattern Simulator →
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
