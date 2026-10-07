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
  BookOpen,
  Code2,
  FolderGit2,
  RotateCcw
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
  const isAssessed = state.assessmentScore !== undefined && state.assessmentScore > 0;

  const gaps = state.skills.filter((s) => s.gap > 0);

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-badge bg-brand-rose text-white">
                Skill Gap Engine
              </span>
              <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
                ESCO Benchmark Calibration
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              Skill Analysis &amp; Gap Matrix
            </h1>
            <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
              Differential evaluation comparing current calibrated capabilities against occupational standards for {currentRole?.title || 'Target Role'}.
            </p>
          </div>

          <Link href={isAssessed ? ROUTES.app.learning.roadmap : ROUTES.app.assessments.baseline}>
            <Button variant="primary" size="md">
              {isAssessed ? 'Personalized Roadmap →' : 'Take Baseline Assessment →'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Readiness Overview */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="yellow">Target Role</Badge>
              <span className="font-display text-xl font-bold uppercase text-brand-ink">
                {currentRole?.title || 'Full-Stack Developer'}
              </span>
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-ink/60 block">
                Overall Role Readiness
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-brand-ink mt-1">
                {isAssessed ? (
                  <span className="text-brand-orange">{state.readinessScore}%</span>
                ) : (
                  <span className="text-brand-rose">NOT ASSESSED</span>
                )}
              </h2>
            </div>

            <p className="text-sm text-brand-ink/85 font-medium leading-relaxed max-w-2xl">
              {!isAssessed
                ? 'You have not completed your calibrated baseline assessment yet. Benchmark your true current skill levels (L0 to L5) against enterprise hiring requirements to unlock your personalized remediation roadmap.'
                : `Based on your calibrated assessment and verified skill levels, your current role readiness is ${state.readinessScore}%. Close identified skill gaps below to reach full qualification.`}
            </p>

            <div className="pt-2">
              <Link href={isAssessed ? ROUTES.app.learning.roadmap : ROUTES.app.assessments.baseline}>
                <Button variant="accent" size="lg">
                  {!isAssessed ? 'Complete Your Baseline Assessment →' : 'Start Closing Skill Gaps →'}
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-brand-cream border border-brand-ink/30 shadow-editorial-sm">
            {isAssessed ? (
              <ProgressRing
                progress={state.readinessScore}
                size={130}
                strokeWidth={10}
                color="#E43D12"
                label="Readiness"
              />
            ) : (
              <div className="text-center space-y-2 py-4">
                <AlertCircle className="w-12 h-12 text-brand-rose mx-auto" />
                <span className="font-display text-lg uppercase font-bold text-brand-ink block">
                  Awaiting Assessment
                </span>
                <span className="text-xs text-brand-ink/70 font-semibold block">
                  0 of {state.skills.length} skills benchmarked
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Competency Step Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-brand-ink/20">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink">
              Competency Breakdown
            </h2>
            <span className="text-xs font-semibold text-brand-ink/60">
              Evaluated against ESCO &amp; O*NET occupational standards
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-brand-ink/60 uppercase">
            {state.skills.length} Core Competencies
          </span>
        </div>

        <div className="space-y-3">
          {state.skills.map((skill) => {
            const hasGap = skill.gap > 0;

            return (
              <div
                key={skill.name}
                className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Skill Name & Priority */}
                <div className="space-y-1.5 md:w-1/3">
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
                  <div className="text-xs font-semibold text-brand-ink/60">
                    Confidence: {Math.round((skill.confidence || 0.8) * 100)}% &bull; {skill.evidenceCount || 0} evidence artifacts
                  </div>
                </div>

                {/* Level Comparison */}
                <div className="flex items-center gap-6 md:w-1/3 text-xs font-semibold">
                  <div className="space-y-0.5">
                    <span className="text-brand-ink/60 uppercase text-[10px] block">Current Level</span>
                    <span className="font-display text-lg font-bold text-brand-orange">
                      {skill.currentLevel}
                    </span>
                  </div>
                  <div className="text-brand-ink/40 font-bold">&rarr;</div>
                  <div className="space-y-0.5">
                    <span className="text-brand-ink/60 uppercase text-[10px] block">Target Level</span>
                    <span className="font-display text-lg font-bold text-brand-ink">
                      {skill.requiredLevel}
                    </span>
                  </div>
                  <div className="space-y-0.5 pl-4 border-l border-brand-ink/20">
                    <span className="text-brand-ink/60 uppercase text-[10px] block">Gap</span>
                    <span className={`font-display text-lg font-bold ${hasGap ? 'text-brand-rose' : 'text-green-700'}`}>
                      {hasGap ? `${skill.gap} Steps` : 'Met'}
                    </span>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="md:w-1/3 flex justify-end">
                  {hasGap ? (
                    <Link href={ROUTES.app.learning.roadmap}>
                      <Button variant="primary" size="sm" className="text-xs">
                        Close Gap &rarr;
                      </Button>
                    </Link>
                  ) : (
                    <span className="text-xs font-bold text-green-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Benchmark Satisfied
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actionable Skill Gap Pathway Cards (5-Step Loop) */}
      {gaps.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="border-b border-brand-ink/20 pb-3">
            <span className="editorial-badge bg-brand-orange text-white text-[10px] mb-1">
              Actionable Gap Paths
            </span>
            <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-brand-ink">
              Structured Gap Remediation Pathways
            </h2>
            <p className="text-xs sm:text-sm text-brand-ink/75 font-medium mt-1">
              Each identified gap is mapped into a closed 5-step learning, practice, project, proof, and reassessment loop.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {gaps.map((gap) => (
              <div
                key={gap.name}
                className="bg-brand-cream border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-ink/20">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
                        {gap.name}
                      </h3>
                      <Badge variant={gap.priority === 'CRITICAL' ? 'rose' : 'default'}>
                        {gap.priority} GAP
                      </Badge>
                    </div>
                    <div className="text-xs font-semibold text-brand-ink/70 mt-1">
                      Current: <strong className="text-brand-orange">{gap.currentLevel}</strong> &bull; Target: <strong className="text-brand-ink">{gap.requiredLevel}</strong> &bull; Differential: <strong className="text-brand-rose">{gap.gap} Levels</strong>
                    </div>
                  </div>

                  <Link href={ROUTES.app.learning.roadmap}>
                    <Button variant="accent" size="sm" className="whitespace-nowrap">
                      START CLOSING THIS GAP &rarr;
                    </Button>
                  </Link>
                </div>

                {/* 5-Step Path */}
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-ink/70 block mb-3">
                    YOUR VERIFIED PATH
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <div className="bg-brand-paper border border-brand-ink/30 p-3 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-brand-orange block">01 LEARN</span>
                      <h4 className="text-xs font-bold text-brand-ink">Targeted Theory</h4>
                      <p className="text-[11px] text-brand-ink/70 leading-relaxed">
                        Curated freeCodeCamp and MDN modules tailored to {gap.name}.
                      </p>
                    </div>

                    <div className="bg-brand-paper border border-brand-ink/30 p-3 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-brand-orange block">02 PRACTICE</span>
                      <h4 className="text-xs font-bold text-brand-ink">Coding Drills</h4>
                      <p className="text-[11px] text-brand-ink/70 leading-relaxed">
                        Interactive unit test exercises and debugging challenges.
                      </p>
                    </div>

                    <div className="bg-brand-paper border border-brand-ink/30 p-3 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-brand-orange block">03 BUILD</span>
                      <h4 className="text-xs font-bold text-brand-ink">Capstone Milestone</h4>
                      <p className="text-[11px] text-brand-ink/70 leading-relaxed">
                        Implement real production features in your active portfolio project.
                      </p>
                    </div>

                    <div className="bg-brand-paper border border-brand-ink/30 p-3 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-brand-orange block">04 PROVE</span>
                      <h4 className="text-xs font-bold text-brand-ink">Auditable Evidence</h4>
                      <p className="text-[11px] text-brand-ink/70 leading-relaxed">
                        GitHub commit and live deployment verification linked to passport.
                      </p>
                    </div>

                    <div className="bg-brand-paper border border-brand-ink/30 p-3 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-brand-orange block">05 REASSESS</span>
                      <h4 className="text-xs font-bold text-brand-ink">Diagnostic Benchmark</h4>
                      <p className="text-[11px] text-brand-ink/70 leading-relaxed">
                        Retake diagnostic to advance verified level from {gap.currentLevel} to {gap.requiredLevel}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
