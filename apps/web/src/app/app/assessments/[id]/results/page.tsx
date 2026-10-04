'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Award,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  BarChart3,
  RefreshCw,
  Target
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';

export default function AssessmentResultsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { state } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);
  const score = state.assessmentScore || 78;

  const skillScores = [
    { skill: 'JavaScript', level: 'Intermediate (L3)', score: 85, verdict: 'STRONG', badge: 'yellow' },
    { skill: 'React', level: 'Beginner (L2)', score: 65, verdict: 'GROWTH NEEDED', badge: 'rose' },
    { skill: 'Node.js', level: 'Beginner (L1)', score: 40, verdict: 'CRITICAL GAP', badge: 'rose' },
    { skill: 'SQL & DBs', level: 'Intermediate (L2)', score: 75, verdict: 'SOLID BASIS', badge: 'yellow' },
    { skill: 'Git & GitHub', level: 'Advanced (L4)', score: 92, verdict: 'VERIFIED MASTERY', badge: 'default' },
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="editorial-badge bg-brand-yellow text-brand-ink">
            Diagnostic Verdict
          </span>
          <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
            Calibrated Competency Report
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Assessment Results &amp; Calibration
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Diagnostics for {currentRole?.title || 'Target Role'} have evaluated your foundational logic, asynchronous control flow, and architectural syntax.
        </p>
      </div>

      {/* Hero Scorecard Banner */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="editorial-badge bg-brand-orange text-white text-xs">
                Diagnostic Complete
              </span>
              <span className="text-xs font-bold text-brand-ink/70">
                Calibrated against ESCO Benchmark
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase text-brand-ink">
              Overall Performance: <span className="text-brand-orange">{score}%</span>
            </h2>
            <p className="text-sm text-brand-ink/85 font-medium leading-relaxed max-w-2xl">
              You demonstrate strong foundational problem solving and version control fluency. However, asynchronous backend streams (Node.js) and component state reconciliation (React) represent immediate step gaps.
            </p>

            <div className="pt-2">
              <Link href={ROUTES.app.skills.analysis}>
                <Button variant="primary" size="lg" className="text-base">
                  View My Skill Gaps <ArrowRight className="ml-2 w-5 h-5 inline" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-brand-cream border border-brand-ink/30">
            <ProgressRing progress={score} size={110} strokeWidth={9} color="#E43D12" />
            <span className="font-display text-3xl font-bold text-brand-ink mt-3">
              {score}/100
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-ink/70 mt-1">
              Calibrated Capability
            </span>
          </div>
        </div>
      </div>

      {/* Granular Skill Scores Matrix */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-6">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink pb-3 border-b border-brand-ink/20">
          Competency Breakdown by Skill
        </h2>

        <div className="space-y-3">
          {skillScores.map((item) => (
            <div
              key={item.skill}
              className="p-4 bg-brand-cream border border-brand-ink/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-brand-ink">{item.skill}</span>
                  <Badge variant={item.badge as any}>{item.verdict}</Badge>
                </div>
                <div className="text-xs text-brand-ink/70 font-medium mt-1">
                  Calibrated Level: <strong className="text-brand-ink">{item.level}</strong>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="font-display text-2xl font-bold text-brand-ink">
                    {item.score}%
                  </span>
                  <span className="text-[10px] block text-brand-ink/60 uppercase font-bold">Accuracy</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-brand-ink/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-semibold text-brand-ink/70">
            All question records saved to attempt history. Anti-repetition engine active.
          </span>
          <Link href={ROUTES.app.skills.analysis}>
            <Button variant="accent" size="md">
              Proceed to Weighted Skill Analyzer →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
