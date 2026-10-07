'use client';

import React from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  Target,
  FileCheck2
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AnalyticsCockpitPage() {
  const { state, nextAction } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);
  const isAssessed = state.assessmentScore !== undefined && state.assessmentScore > 0;

  // Real evidence analytics
  const verifiedSkills = state.skills.filter((s) => (s.evidenceCount || 0) > 0);
  const jobReadySkills = state.skills.filter((s) => s.gap === 0);
  const weakSkills = state.skills.filter((s) => s.gap > 0);

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-badge bg-brand-yellow text-brand-ink">
                Longitudinal Telemetry
              </span>
              <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
                Target Role: {currentRole?.title || 'Full-Stack Developer'}
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              Candidate Analytics Cockpit
            </h1>
            <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
              Objective growth curves tracking diagnostic evaluations, study hours, code execution accuracy, and application conversion.
            </p>
          </div>

          <Link href={nextAction.ctaUrl}>
            <Button variant="accent" size="md">
              {nextAction.ctaText} →
            </Button>
          </Link>
        </div>
      </div>

      {/* Real Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card accentBorder="orange" className="p-6">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60 block">
            Role Readiness
          </span>
          <div className="font-display text-4xl font-bold text-brand-orange mt-1">
            {isAssessed ? `${state.readinessScore}%` : 'NOT ASSESSED'}
          </div>
          <div className="text-xs text-brand-ink/70 mt-1 font-semibold">
            {isAssessed ? 'Calibrated baseline evidence' : 'Diagnostic assessment pending'}
          </div>
        </Card>

        <Card accentBorder="yellow" className="p-6">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60 block">
            Job-Ready Skills
          </span>
          <div className="font-display text-4xl font-bold text-brand-ink mt-1">
            {jobReadySkills.length} / {state.skills.length}
          </div>
          <div className="text-xs text-brand-ink/70 mt-1 font-semibold">
            Target benchmark met (L0 to L5)
          </div>
        </Card>

        <Card accentBorder="rose" className="p-6">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60 block">
            Interview Rating
          </span>
          <div className="font-display text-4xl font-bold text-brand-rose mt-1">
            {state.interviewScore && state.interviewScore > 0 ? `${state.interviewScore}%` : 'NOT SIMULATED'}
          </div>
          <div className="text-xs text-brand-ink/70 mt-1 font-semibold">
            {state.interviewScore ? 'Multi-dimensional evaluation' : 'Simulated mock round ready'}
          </div>
        </Card>

        <Card accentBorder="pink" className="p-6">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60 block">
            Tracked Applications
          </span>
          <div className="font-display text-4xl font-bold text-brand-ink mt-1">
            {state.applications.length} Active
          </div>
          <div className="text-xs text-brand-ink/70 mt-1 font-semibold">
            Direct employer submissions
          </div>
        </Card>
      </div>

      {/* Next Best Action Banner */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="editorial-badge bg-brand-orange text-white text-[10px]">
              NEXT BEST ACTION
            </span>
            <span className="text-xs font-mono font-bold text-brand-ink/70 uppercase">
              {nextAction.stageLabel}
            </span>
          </div>
          <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
            {nextAction.title}
          </h3>
          <p className="text-xs text-brand-ink/80 font-medium max-w-2xl leading-relaxed">
            {nextAction.description}
          </p>
        </div>

        <Link href={nextAction.ctaUrl} className="shrink-0">
          <Button variant="primary" size="md">
            {nextAction.ctaText} →
          </Button>
        </Link>
      </div>

      {/* Real Longitudinal Skill Progression Matrix */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60 block">
              Continuous Evidence Log
            </span>
            <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
              Verified Competency Velocity
            </h2>
          </div>
          <span className="text-xs font-semibold text-brand-ink/70">
            {verifiedSkills.length} of {state.skills.length} skills with verified evidence
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-brand-ink/20 bg-brand-cream/60 text-brand-ink font-bold uppercase tracking-wider">
                <th className="p-3">Competency</th>
                <th className="p-3">Current Level</th>
                <th className="p-3">Target Level</th>
                <th className="p-3">Gap Status</th>
                <th className="p-3">Evidence Records</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-ink/10 font-medium">
              {state.skills.map((s) => {
                const isTargetMet = s.gap === 0;

                return (
                  <tr key={s.name} className="hover:bg-brand-cream/30 transition-colors">
                    <td className="p-3 font-bold text-brand-ink flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-orange shrink-0" />
                      {s.name}
                    </td>
                    <td className="p-3">
                      <Badge level={s.currentLevel as any}>
                        {isAssessed ? s.currentLevel : 'NOT ASSESSED'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge level={s.requiredLevel as any}>{s.requiredLevel}</Badge>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 border ${
                          isTargetMet
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-500'
                            : s.priority === 'CRITICAL'
                            ? 'bg-rose-50 text-rose-800 border-rose-500'
                            : 'bg-amber-50 text-amber-800 border-amber-500'
                        }`}
                      >
                        {isTargetMet ? '✓ TARGET MET' : `${s.gap} LEVEL GAP (⚠ ${s.priority})`}
                      </span>
                    </td>
                    <td className="p-3 text-brand-ink/80 font-mono">
                      {s.evidenceCount || 0} submissions
                    </td>
                    <td className="p-3 text-right">
                      {isTargetMet ? (
                        <span className="text-[11px] font-bold text-emerald-700">Calibrated</span>
                      ) : (
                        <Link href={`/app/practice/coding?skill=${encodeURIComponent(s.name)}`}>
                          <span className="text-xs font-bold text-brand-orange hover:underline">
                            Practice Lab →
                          </span>
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
