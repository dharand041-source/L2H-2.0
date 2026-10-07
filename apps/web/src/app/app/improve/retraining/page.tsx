'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowLeft, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { findResourcesForSkill } from '@/lib/curriculum';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ImproveRetrainingPage() {
  const { state } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  // Derive active retraining modules dynamically from user's actual weak skills
  const modules = useMemo(() => {
    const weakSkills = (state.skills || []).filter((s) => s.gap > 0);
    const targetSkills = weakSkills.length > 0
      ? weakSkills
      : (currentRole?.requiredSkills || []).slice(0, 3).map((s) => ({
          name: s.name,
          currentLevel: 'L1' as const,
          requiredLevel: s.level,
          gap: 2,
        }));

    return targetSkills.map((s) => {
      const resources = findResourcesForSkill(s.name, s.requiredLevel);
      const topResource = resources[0];

      return {
        skill: s.name,
        title: topResource?.title || `${s.name} Core Architectural Remediation`,
        provider: topResource?.provider || 'Official Documentation',
        duration: topResource?.duration || '4 hours',
        url: topResource?.url || 'https://developer.mozilla.org',
        access: topResource?.access || 'FREE',
        isFree: topResource?.isFree ?? true,
        desc: `Remediates validated diagnostic deficit (${s.currentLevel || 'L0'} → ${s.requiredLevel}). Targeted curriculum to upgrade capabilities before interview rounds.`
      };
    });
  }, [state.skills, currentRole]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.improve.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Improvement Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">
          {currentRole?.title || 'Target Role'} Active Retraining
        </span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Targeted Retraining Modules
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Bespoke remediation curricula tailored to the exact failure concepts identified in diagnostics and interview rounds for {currentRole?.title || 'your target role'}.
        </p>
      </div>

      <div className="space-y-4">
        {modules.map((m) => (
          <div key={m.title} className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="rose">GAP REMEDIATION: {m.skill}</Badge>
                <span className="editorial-badge bg-brand-cream text-brand-ink text-[10px]">{m.provider}</span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 border ${
                    m.isFree
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-500'
                      : 'bg-amber-50 text-amber-800 border-amber-500'
                  }`}
                >
                  {m.access}
                </span>
                <span className="text-xs text-brand-ink/60">{m.duration}</span>
              </div>
              <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">{m.title}</h3>
              <p className="text-xs text-brand-ink/80 font-medium max-w-2xl leading-relaxed">{m.desc}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <a href={m.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  Open Learning Portal <ExternalLink className="w-3.5 h-3.5 ml-1 inline" />
                </Button>
              </a>
              <Link href={ROUTES.app.improve.reassessment}>
                <Button variant="primary" size="sm">
                  Test Capability →
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
