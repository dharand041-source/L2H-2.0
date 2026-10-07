'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Terminal,
  Code2,
  Database,
  Bug,
  Brain,
  Layers,
  Sparkles,
  Building2,
  History,
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function PracticeHubInner() {
  const searchParams = useSearchParams();
  const skillParam = searchParams.get('skill');
  const { state } = useCandidateState();

  const activeWeakSkill = skillParam || state.skills.find((s) => s.gap > 0)?.name;

  const practiceCategories = [
    {
      id: 'coding',
      title: 'Backend & Web Coding',
      icon: Code2,
      desc: 'API endpoints, rate limiters, token buckets, and event emitter patterns.',
      count: '42 Challenges',
      accent: 'orange' as const,
      href: ROUTES.app.practice.coding,
    },
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      icon: Terminal,
      desc: 'Arrays, hash maps, two pointers, sliding window, trees, and graphs.',
      count: '68 Challenges',
      accent: 'rose' as const,
      href: ROUTES.app.practice.dsa,
    },
    {
      id: 'sql',
      title: 'SQL & Database Queries',
      icon: Database,
      desc: 'Relational joins, grouping, window functions, and indexing optimization.',
      count: '35 Challenges',
      accent: 'yellow' as const,
      href: ROUTES.app.practice.sql,
    },
    {
      id: 'debugging',
      title: 'Code Debugging & Bug Hunts',
      icon: Bug,
      desc: 'Isolate race conditions, memory leaks, off-by-one errors, and async bugs.',
      count: '24 Scenarios',
      accent: 'pink' as const,
      href: ROUTES.app.practice.debugging,
    },
    {
      id: 'aptitude',
      title: 'Quantitative Aptitude',
      icon: Brain,
      desc: 'Percentages, ratios, time-speed-distance, and probability challenges.',
      count: '50 Problems',
      accent: 'orange' as const,
      href: ROUTES.app.practice.aptitude,
    },
    {
      id: 'logical',
      title: 'Logical Reasoning',
      icon: Layers,
      desc: 'Syllogisms, seating arrangements, coding-decoding, and pattern logic.',
      count: '40 Problems',
      accent: 'yellow' as const,
      href: ROUTES.app.practice.logical,
    },
    {
      id: 'verbal',
      title: 'Verbal & Professional English',
      icon: Sparkles,
      desc: 'Reading comprehension, sentence correction, and workplace communication.',
      count: '30 Exercises',
      accent: 'rose' as const,
      href: ROUTES.app.practice.verbal,
    },
    {
      id: 'company',
      title: 'Company Pattern Problem Sets',
      icon: Building2,
      desc: 'Calibrated to reported problem patterns from TCS, Zoho, Infosys, and Amazon.',
      count: '28 Sets',
      accent: 'pink' as const,
      href: ROUTES.app.practice.company,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-badge bg-brand-yellow text-brand-ink">
                Active Execution
              </span>
              <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
                Multi-Category Skill Sandbox
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              Practice Arena
            </h1>
            <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
              Test your logic in real-time execution environments. Master backend code patterns, algorithmic paradigms, SQL aggregations, and company placement tests.
            </p>
          </div>

          <Link href={ROUTES.app.practice.history}>
            <Button variant="outline" size="sm">
              <History className="w-4 h-4 mr-1.5 inline" /> Practice History
            </Button>
          </Link>
        </div>
      </div>

      {/* Dynamic Skill Gap Recommendation Banner */}
      {activeWeakSkill && (
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="rose">RECOMMENDED FOR YOUR SKILL GAP</Badge>
              <span className="text-xs font-bold text-brand-orange uppercase">{activeWeakSkill}</span>
            </div>
            <p className="text-xs text-brand-ink/80 font-medium">
              Solve hands-on challenges in <strong>{activeWeakSkill}</strong> to log validated competency evidence and update your readiness score.
            </p>
          </div>

          <Link href={`/app/practice/coding?skill=${encodeURIComponent(activeWeakSkill)}`}>
            <Button variant="accent" size="sm" className="whitespace-nowrap">
              Launch {activeWeakSkill} Lab →
            </Button>
          </Link>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {practiceCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Card
              key={cat.id}
              hoverable
              accentBorder={cat.accent}
              className="flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 bg-brand-cream border border-brand-ink flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-brand-orange" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60">
                  {cat.count}
                </span>
                <h3 className="font-display text-2xl font-bold uppercase text-brand-ink mt-0.5 mb-2">
                  {cat.title}
                </h3>
                <p className="text-xs text-brand-ink/80 font-medium leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-ink/20">
                <Link href={cat.href}>
                  <Button variant="primary" size="sm" fullWidth>
                    Enter Arena <ArrowRight className="w-3.5 h-3.5 ml-1.5 inline" />
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function PracticeHubPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-display text-xl uppercase">Loading Practice Arena...</div>}>
      <PracticeHubInner />
    </Suspense>
  );
}
