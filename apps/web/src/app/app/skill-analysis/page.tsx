'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';

export default function SkillAnalysisPage() {
  const { state } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-badge bg-brand-rose text-white">
                Central Intelligence
              </span>
              <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
                Weighted Step Differential Engine
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              Skill Gap Analysis
            </h1>
            <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
              Differential evaluation comparing current calibrated capabilities against ESCO benchmark requirements for {currentRole?.title || 'Target Role'}.
            </p>
          </div>

          <Link href={ROUTES.app.learning.roadmap}>
            <Button variant="primary" size="md">
              Start Personalized Roadmap <ArrowRight className="ml-2 w-4 h-4 inline" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Readiness Overview */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="yellow">Target Role</Badge>
              <span className="font-display text-xl font-bold uppercase text-brand-ink">
                {currentRole?.title || 'Full-Stack Developer'}
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold uppercase text-brand-ink">
              Target Role Readiness: <span className="text-brand-orange">{state.readinessScore}%</span>
            </h2>
            <p className="text-sm text-brand-ink/85 font-medium leading-relaxed max-w-2xl">
              Based on your multi-factor diagnostic and evidence history, you have satisfied 2 of 5 core competencies. 3 critical gaps are queued for structured remediation via open curricula.
            </p>
            <div className="pt-2">
              <Link href={ROUTES.app.learning.roadmap}>
                <Button variant="accent" size="lg">
                  Launch Custom Remediation Roadmap →
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-brand-cream border border-brand-ink/30">
            <ProgressRing progress={state.readinessScore} size={110} strokeWidth={9} color="#E43D12" />
            <span className="font-display text-3xl font-bold text-brand-ink mt-3">
              {state.readinessScore}%
            </span>
            <span className="text-xs font-bold uppercase text-brand-ink/70">
              Calibrated Readout
            </span>
          </div>
        </div>
      </div>

      {/* Granular Gap Ledger */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink">
            Competency Step Matrix
          </h2>
          <span className="text-xs font-bold text-brand-ink/60 uppercase">
            Confidence: 75% - 95%
          </span>
        </div>

        <div className="space-y-4">
          {state.skills.map((skill) => {
            const hasGap = skill.gap > 0;

            return (
              <div
                key={skill.name}
                className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Skill Title & Levels */}
                <div className="space-y-2 md:w-1/3">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xl font-bold uppercase text-brand-ink">
                      {skill.name}
                    </span>
                    <Badge
                      variant={
                        skill.priority === 'CRITICAL'
                          ? 'rose'
                          : skill.priority === 'HIGH'
                          ? 'default'
                          : 'yellow'
                      }
                    >
                      {skill.priority}
                    </Badge>
                  </div>

                  <div className="text-xs font-semibold text-brand-ink/70 space-y-0.5">
                    <div>
                      Required Benchmark: <strong className="text-brand-ink">{skill.requiredLevel}</strong>
                    </div>
                    <div>
                      Current Calibrated: <strong className="text-brand-orange">{skill.currentLevel}</strong>
                    </div>
                  </div>
                </div>

                {/* Gap & Evidence */}
                <div className="space-y-1 md:w-1/3 text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-brand-ink/70 font-semibold">Differential:</span>
                    <span className="font-bold text-brand-ink">
                      {hasGap ? `${skill.gap} Level Step Gap` : 'Benchmark Satisfied'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-ink/70 font-semibold">Calibration Evidence:</span>
                    <span className="text-brand-ink">{skill.evidenceCount} verified artifacts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-ink/70 font-semibold">Statistical Confidence:</span>
                    <span className="text-brand-orange font-bold">
                      {Math.round(skill.confidence * 100)}%
                    </span>
                  </div>
                </div>

                {/* Recommendations & Action */}
                <div className="md:w-1/3 flex flex-col items-start md:items-end justify-between gap-3">
                  <div className="text-[11px] font-semibold text-brand-ink/80 text-left md:text-right">
                    {hasGap
                      ? `Remedy with: ${skill.name} Deep Dive on freeCodeCamp / MDN`
                      : 'Skill benchmark verified. Ready for interview pattern test.'}
                  </div>
                  {hasGap ? (
                    <Link href={ROUTES.app.learning.roadmap}>
                      <Button variant="primary" size="sm">
                        Remediate on Roadmap →
                      </Button>
                    </Link>
                  ) : (
                    <Link href={ROUTES.app.projects.home}>
                      <Button variant="outline" size="sm">
                        Build Evidence Project →
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
