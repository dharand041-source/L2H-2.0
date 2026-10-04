'use client';

import React from 'react';
import Link from 'next/link';
import {
  Mic,
  Code2,
  Users,
  Brain,
  MessageSquare,
  Building2,
  History,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function InterviewHubPage() {
  const { state } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  const interviewTracks = [
    {
      id: 'mock',
      title: 'Full Mock Interview Simulation',
      desc: 'Complete end-to-end interview round with AI audio prompts, technical deep-dives, and multi-factor evaluation scorecard.',
      badge: 'RECOMMENDED',
      variant: 'orange' as const,
      href: ROUTES.app.interview.mock,
    },
    {
      id: 'technical',
      title: 'Technical & Architecture Round',
      desc: 'System design, database transactions, concurrency, and RESTful API trade-offs.',
      badge: 'L3 &ndash; L4 BENCHMARK',
      variant: 'rose' as const,
      href: ROUTES.app.interview.technical,
    },
    {
      id: 'behavioral',
      title: 'Behavioral & Leadership Principles',
      desc: 'STAR method scenarios, handling conflicting requirements, and post-mortem accountability.',
      badge: 'CULTURE FIT',
      variant: 'yellow' as const,
      href: ROUTES.app.interview.behavioral,
    },
    {
      id: 'company',
      title: 'Company Pattern Simulated Rounds',
      desc: 'Calibrated to interview question styles reported from TCS, Zoho, Infosys, and Amazon.',
      badge: 'REPORTED PATTERNS',
      variant: 'pink' as const,
      href: ROUTES.app.interview.company,
    },
    {
      id: 'hr',
      title: 'HR & Executive Screening',
      desc: 'Salary expectations, notice period, team dynamics, and career trajectory.',
      badge: 'SCREENING',
      variant: 'yellow' as const,
      href: ROUTES.app.interview.hr,
    },
    {
      id: 'communication',
      title: 'Communication & Articulation',
      desc: 'Clarity of explanation, trade-off reasoning, and structured technical delivery.',
      badge: 'SOFT SKILLS',
      variant: 'rose' as const,
      href: ROUTES.app.interview.communication,
    }
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-badge bg-brand-rose text-white">
                Simulated Rounds
              </span>
              <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
                Multi-Factor Evaluation &bull; STAR Scoring
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              Interview Simulator
            </h1>
            <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
              Simulate high-stakes technical, behavioral, and company-specific interview rounds calibrated to {currentRole?.title || 'Target Role'}. Receive immediate rubric feedback.
            </p>
          </div>

          <div className="flex gap-2">
            <Link href={ROUTES.app.interview.history}>
              <Button variant="outline" size="sm">
                <History className="w-4 h-4 mr-1.5 inline" /> Scorecards History
              </Button>
            </Link>
            <Link href={ROUTES.app.interview.mock}>
              <Button variant="primary" size="sm">
                Launch Full Mock Interview →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Quick Start */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="yellow">Role-Calibrated Simulator</Badge>
              <span className="text-xs font-bold text-brand-ink/60 uppercase">
                {currentRole?.title} &bull; Intermediate &ndash; Advanced
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold uppercase text-brand-ink">
              {currentRole?.title} Comprehensive Mock Interview
            </h2>
            <p className="text-sm text-brand-ink/85 max-w-2xl leading-relaxed">
              5 progressive questions covering event-driven concurrency, database isolation levels, microservices vs monolith trade-offs, and behavioral conflict management.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-brand-ink/70 pt-1">
              <span>Duration: <strong>20 Minutes</strong></span>
              <span>&bull;</span>
              <span>Scoring: <strong>Technical (40%) &bull; Communication (30%) &bull; Reasoning (30%)</strong></span>
            </div>
          </div>

          <div className="shrink-0">
            <Link href={ROUTES.app.interview.mock}>
              <Button variant="accent" size="lg">
                Start Mock Interview <ArrowRight className="w-4 h-4 ml-1.5 inline" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviewTracks.map((tr) => (
          <Card key={tr.id} hoverable accentBorder={tr.variant} className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant={tr.variant === 'orange' ? 'default' : tr.variant === 'yellow' ? 'yellow' : 'rose'}>
                  {tr.badge}
                </Badge>
              </div>

              <h3 className="font-display text-2xl font-bold uppercase text-brand-ink mb-2">
                {tr.title}
              </h3>
              <p className="text-xs text-brand-ink/80 font-medium leading-relaxed mb-4">
                {tr.desc}
              </p>
            </div>

            <div className="pt-4 border-t border-brand-ink/20">
              <Link href={tr.href}>
                <Button variant={tr.id === 'mock' ? 'primary' : 'outline'} size="sm" fullWidth>
                  Enter Round →
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
