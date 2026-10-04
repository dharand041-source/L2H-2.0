'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckSquare,
  Clock,
  Award,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  BarChart2,
  RefreshCw
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AssessmentsHubPage() {
  const { state } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  const assessmentTiers = [
    {
      id: 'baseline',
      title: `${currentRole ? currentRole.title : 'Full-Stack'} Baseline Diagnostic`,
      type: 'BASELINE DIAGNOSTIC',
      duration: '25 Mins',
      questionsCount: '15 Questions',
      skillsCovered: currentRole?.requiredSkills.slice(0, 4).map(s => s.name) || ['JS', 'React', 'Node', 'SQL'],
      desc: 'Calibrate your initial competency levels from L0 to L5 across fundamental, architectural, and debugging tasks.',
      status: state.assessmentScore ? 'COMPLETED' : 'PENDING',
      href: ROUTES.app.assessments.baseline,
      variant: 'orange' as const,
    },
    {
      id: 'technical-node',
      title: 'Node.js & Backend Architecture Deep Dive',
      type: 'TECHNICAL SPECIALTY',
      duration: '35 Mins',
      questionsCount: '12 Questions',
      skillsCovered: ['Node.js', 'Express', 'Async Event Loop', 'REST Security'],
      desc: 'Advanced evaluation of asynchronous control flow, worker threads, stream pipelines, and database connection pooling.',
      status: 'AVAILABLE',
      href: ROUTES.app.assessments.take('technical-node'),
      variant: 'rose' as const,
    },
    {
      id: 'company-tcs',
      title: 'TCS Digital / Prime Pattern Technical Diagnostic',
      type: 'COMPANY PATTERN',
      duration: '40 Mins',
      questionsCount: '20 Questions',
      skillsCovered: ['DSA', 'SQL Joins', 'Logical Reasoning', 'Code Debugging'],
      desc: 'Calibrated specifically to reported TCS Digital & Prime test patterns from previous examination cycles.',
      status: 'AVAILABLE',
      href: ROUTES.app.assessments.take('company-tcs'),
      variant: 'yellow' as const,
    },
    {
      id: 'company-zoho',
      title: 'Zoho Software Development Assessment Pattern',
      type: 'COMPANY PATTERN',
      duration: '45 Mins',
      questionsCount: '10 Problems',
      skillsCovered: ['Problem Solving', 'Data Structures', 'Algorithmic Efficiency'],
      desc: 'Simulates the rigorous multi-stage coding rounds of Zoho developer placement rounds.',
      status: 'AVAILABLE',
      href: ROUTES.app.assessments.take('company-zoho'),
      variant: 'pink' as const,
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
                Adaptive Diagnostics
              </span>
              <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
                Anti-Repetition &bull; Multi-Factor Scoring
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              Assessments &amp; Diagnostics
            </h1>
            <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
              Diagnostic tests identify your exact competency level from L0 to L5 with non-repeating calibrated items. Gaps flow directly into your personalized learning curriculum.
            </p>
          </div>

          {state.assessmentScore && (
            <Link href={ROUTES.app.assessments.results('baseline')}>
              <Button variant="outline" size="sm">
                View Last Results ({state.assessmentScore}%) →
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Recommended Baseline Assessment Hero Banner */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="yellow">Recommended Next Step</Badge>
              <span className="text-xs font-bold text-brand-ink/60 uppercase">
                Role: {currentRole?.title}
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold uppercase text-brand-ink">
              {currentRole?.title} Baseline Diagnostic
            </h2>
            <p className="text-sm text-brand-ink/85 max-w-2xl leading-relaxed">
              15 calibrated questions evaluating your proficiency in JavaScript, React, Node.js, SQL, and Git. Completing this test updates your skill gap analysis and builds your custom learning roadmap.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-brand-ink/70 pt-1">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-brand-orange" /> 25 Minutes</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-brand-rose" /> Anti-Repetition Active</span>
              <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-brand-yellow" /> L0 to L5 Calibration</span>
            </div>
          </div>

          <div className="shrink-0">
            <Link href={ROUTES.app.assessments.baseline}>
              <Button variant="primary" size="lg">
                {state.assessmentScore ? 'Retake Baseline Diagnostic' : 'Start Baseline Diagnostic'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Available Assessment Suites */}
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink">
          Diagnostic Assessment Catalog
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assessmentTiers.map((tier) => (
            <Card
              key={tier.id}
              accentBorder={tier.variant}
              hoverable
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={tier.status === 'COMPLETED' ? 'yellow' : 'default'}>
                    {tier.type}
                  </Badge>
                  <span className="text-xs font-bold text-brand-ink/60">
                    {tier.duration} · {tier.questionsCount}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold uppercase text-brand-ink mb-2">
                  {tier.title}
                </h3>
                <p className="text-xs text-brand-ink/80 font-medium leading-relaxed mb-4">
                  {tier.desc}
                </p>

                <div className="space-y-1 pt-3 border-t border-brand-ink/10">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60 block">
                    Competencies Evaluated:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {tier.skillsCovered.map((s) => (
                      <span key={s} className="text-[10px] font-semibold px-2 py-0.5 bg-brand-cream border border-brand-ink/30 text-brand-ink">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-ink/20 flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-brand-ink/60">
                  Status: {tier.status}
                </span>
                <Link href={tier.href}>
                  <Button variant="outline" size="sm">
                    {tier.status === 'COMPLETED' ? 'Review / Retake' : 'Launch Assessment'} →
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
