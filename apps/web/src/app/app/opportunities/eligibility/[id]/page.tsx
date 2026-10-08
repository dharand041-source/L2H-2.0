'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShieldCheck, ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { OPPORTUNITIES_CATALOG } from '@/lib/data/opportunities-data';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function OpportunityEligibilityPage() {
  const params = useParams();
  const id = params?.id as string;
  const { state } = useCandidateState();
  const job = OPPORTUNITIES_CATALOG.find((o) => o.id === id) || OPPORTUNITIES_CATALOG[0];

  const checks = [
    { requirement: 'Educational Degree Requirement', status: 'ELIGIBLE', details: 'Bachelor of Science / Computer Science or equivalent verified.' },
    { requirement: 'Total Professional Experience', status: 'ELIGIBLE', details: 'Requirement: 0-2 Years. Candidate calibrated at Junior level.' },
    { requirement: 'Core Required Competencies', status: 'POSSIBLY ELIGIBLE', details: '5 of 6 competencies verified in passport. Docker containerization queued on roadmap.' },
    { requirement: 'Location & Work Authorization', status: 'ELIGIBLE', details: 'Position supports full remote or designated regional hubs.' },
    { requirement: 'Resume Readiness Gate', status: state.resume.status === 'READY' ? 'ELIGIBLE' : 'REQUIREMENTS MISSING', details: `Resume status is currently ${state.resume.status}.` }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.opportunities.detail(id)} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Opportunity
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Deterministic Eligibility Audit</span>
      </div>

      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-ink/20">
          <div>
            <Badge variant="yellow">ELIGIBILITY VERDICT: ELIGIBLE</Badge>
            <h1 className="font-display text-3xl uppercase text-brand-ink mt-2">
              {job.title}
            </h1>
            <span className="text-xs font-bold text-brand-ink/70">{job.companyName}</span>
          </div>
          <div className="shrink-0">
            <Link href={ROUTES.app.opportunities.apply(id)}>
              <Button variant="primary" size="md">
                Proceed to Apply →
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-xs text-brand-ink/80 font-medium leading-relaxed">
          The Learn-2-Hire Eligibility Engine evaluates explicit factual requirements. This audit verifies candidate parameters against stated criteria but does not guarantee employment offers.
        </p>

        <div className="space-y-3">
          {checks.map((c) => (
            <div key={c.requirement} className="p-4 bg-brand-cream border border-brand-ink/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={c.status === 'ELIGIBLE' ? 'yellow' : c.status === 'POSSIBLY ELIGIBLE' ? 'default' : 'rose'}>
                    {c.status}
                  </Badge>
                  <span className="font-bold text-sm text-brand-ink">{c.requirement}</span>
                </div>
                <p className="text-xs text-brand-ink/70 font-medium">{c.details}</p>
              </div>

              {c.status === 'ELIGIBLE' ? (
                <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-brand-rose shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
