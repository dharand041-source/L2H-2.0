'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ApplicationsTimelinePage() {
  const { state } = useCandidateState();

  const events = [
    { title: 'Application Submitted: CloudScale Infrastructure Labs', date: 'Yesterday, 3:30 PM', type: 'APPLIED', desc: 'Direct application registered via official Google Careers portal link.' },
    { title: 'Screening Passed: Tata Consultancy Services', date: '3 days ago', type: 'SCREENING', desc: 'Candidate credentials calibrated for Graduate Systems Engineer track.' },
    { title: 'Saved Opportunity: Zoho Corporation', date: '4 days ago', type: 'SAVED', desc: 'Frontend Developer design systems spec added to saved list.' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.applications.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Applications Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Audit Chronology</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Application Timeline
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Chronological record of submissions, employer status updates, interview schedules, and outcome communications.
        </p>
      </div>

      <div className="space-y-4">
        {events.map((ev) => (
          <div key={ev.title} className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="yellow">{ev.type}</Badge>
                <span className="text-xs text-brand-ink/60">{ev.date}</span>
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                {ev.title}
              </h3>
              <p className="text-xs text-brand-ink/80 font-medium mt-1 leading-relaxed">
                {ev.desc}
              </p>
            </div>

            <Link href={ROUTES.app.applications.kanban}>
              <Button variant="outline" size="sm">
                Kanban View →
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
