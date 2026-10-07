'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Award,
  FolderGit2,
  Cpu,
  ArrowRight,
  FileCheck
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SkillProofHubPage() {
  const { state } = useCandidateState();

  const proofTabs = [
    { label: 'Verified Skills Ledger', href: ROUTES.app.skillProof.skills },
    { label: 'Artifact Evidence', href: ROUTES.app.skillProof.evidence },
    { label: 'Rubric Projects', href: ROUTES.app.skillProof.projects },
    { label: 'Open Certifications', href: ROUTES.app.skillProof.certificates },
    { label: 'Achievements', href: ROUTES.app.skillProof.achievements },
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-badge bg-brand-yellow text-brand-ink">
                Auditable Competency Passport
              </span>
              <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
                Cryptographically Verifiable Evidence
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              Verified Skill Proof
            </h1>
            <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
              Replace subjective resume claims with tamper-evident code artifacts, diagnostic test timestamps, and rubric evaluations.
            </p>
          </div>

          <Link href={ROUTES.app.interview.mock}>
            <Button variant="primary" size="md">
              Proceed to Interview Sim →
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-brand-ink/20">
        {proofTabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap bg-brand-paper border border-brand-ink hover:bg-brand-orange hover:text-white transition-all shadow-editorial-sm"
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Verified Evidence Passport Hero */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60 block">
              Passport Holder: {state.user.name || 'Candidate'}
            </span>
            <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
              Auditable Competency Ledger
            </h2>
          </div>
          <Badge variant={state.skills.filter((s) => s.currentLevel !== 'L0').length > 0 ? 'yellow' : 'rose'}>
            {state.skills.filter((s) => s.currentLevel !== 'L0').length} Verified Skills
          </Badge>
        </div>

        <div className="space-y-3">
          {state.skills.map((skill) => {
            const isVerified = skill.currentLevel !== 'L0' && (skill.evidenceCount > 0 || (state.assessmentScore !== undefined && state.assessmentScore > 0));

            return (
              <div
                key={skill.name}
                className="p-4 bg-brand-cream border border-brand-ink/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-brand-ink">{skill.name}</span>
                    <Badge variant={isVerified ? 'yellow' : 'default'}>{skill.currentLevel}</Badge>
                  </div>
                  <div className="text-xs text-brand-ink/70 mt-1">
                    {isVerified ? (
                      <>Evidence: {skill.evidenceCount || 1} verified assessment artifact &bull; Confidence: {Math.round((skill.confidence || 0.8) * 100)}%</>
                    ) : (
                      <>Evidence: Pending baseline diagnostic assessment &bull; Benchmark: {skill.requiredLevel}</>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isVerified ? (
                    <span className="text-xs font-bold text-green-700 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-green-700" /> Assessment Verified
                    </span>
                  ) : (
                    <Link href={ROUTES.app.assessments.baseline}>
                      <Button variant="outline" size="sm" className="text-xs">
                        Benchmark Skill &rarr;
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
