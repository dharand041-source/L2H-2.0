'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  ExternalLink,
  Layers,
  History
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';

export default function ResumeHubPage() {
  const { state } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  const resumeNavTabs = [
    { label: 'Resume Builder', href: ROUTES.app.resume.builder },
    { label: 'Role Versions', href: ROUTES.app.resume.versions },
    { label: 'ATS & Compatibility Analyzer', href: ROUTES.app.resume.analyzer },
    { label: 'Job Description Matcher', href: ROUTES.app.resume.jobMatch },
    { label: 'Optimization History', href: ROUTES.app.resume.history },
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-badge bg-brand-yellow text-brand-ink">
                Evidence-Backed Documents
              </span>
              <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
                Learn-2-Hire Compatibility Estimate
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              Resume System &amp; ATS Optimizer
            </h1>
            <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
              Construct role-aligned resumes directly generated from verified skill proofs, milestone projects, and diagnostic ratings—without fabricated claims.
            </p>
          </div>

          <div className="flex gap-2">
            <Link href={ROUTES.app.resume.analyzer}>
              <Button variant="outline" size="sm">
                Paste Job Spec &amp; Analyze
              </Button>
            </Link>
            <Link href={ROUTES.app.resume.builder}>
              <Button variant="primary" size="sm">
                Open Resume Builder →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary Nav Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-brand-ink/20">
        {resumeNavTabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap bg-brand-paper border border-brand-ink hover:bg-brand-orange hover:text-white transition-all shadow-editorial-sm"
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Resume Approval Gate Banner */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="editorial-badge bg-brand-orange text-white text-[10px]">
                Resume Approval Gate
              </span>
              <Badge variant={state.resume.status === 'READY' ? 'yellow' : 'rose'}>
                {state.resume.status.replace(/_/g, ' ')}
              </Badge>
            </div>

            <h2 className="font-display text-3xl font-bold uppercase text-brand-ink">
              Readiness Status: <span className="text-brand-orange">{state.resume.status.replace(/_/g, ' ')}</span>
            </h2>

            <p className="text-sm text-brand-ink/85 font-medium leading-relaxed max-w-2xl">
              {state.resume.status === 'READY'
                ? 'Your primary resume has satisfied core keyword coverage, auditable project deliverables, and ATS compatibility benchmarks. Direct job applications are now unlocked.'
                : 'Direct employer applications require a verified resume. Optimize your missing keywords and verified evidence to unlock one-click applications.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link href={ROUTES.app.resume.builder}>
                <Button variant="primary" size="md">
                  Edit Verified Resume →
                </Button>
              </Link>
              <Link href={ROUTES.app.opportunities.jobs}>
                <Button variant="outline" size="md">
                  Browse Matched Opportunities →
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-brand-cream border border-brand-ink/30">
            <ProgressRing progress={state.resume.compatibilityScore} size={110} strokeWidth={9} color="#FFA2B6" />
            <span className="font-display text-3xl font-bold text-brand-ink mt-3">
              {state.resume.compatibilityScore}%
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-ink/70 text-center mt-1">
              Learn-2-Hire Compatibility Estimate
            </span>
            <span className="text-[9px] text-brand-ink/50 text-center">
              (Not an official third-party ATS guarantee)
            </span>
          </div>
        </div>
      </div>

      {/* Keywords Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-brand-orange" />
            <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
              Matched Keywords in Active Resume ({state.resume.matchedKeywords.length})
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-2">
            {state.resume.matchedKeywords.map((kw) => (
              <span key={kw} className="text-xs font-bold px-2.5 py-1 bg-brand-cream border border-brand-ink/30 text-brand-ink">
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-brand-rose" />
            <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
              Missing High-Frequency Keywords ({state.resume.missingKeywords.length})
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-2">
            {state.resume.missingKeywords.map((kw) => (
              <span key={kw} className="text-xs font-bold px-2.5 py-1 bg-brand-cream border border-brand-rose text-brand-rose">
                + {kw}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-brand-ink/60 font-medium pt-2">
            Incorporate verified experience in these areas through targeted practice or capstone project milestones.
          </p>
        </div>
      </div>
    </div>
  );
}
