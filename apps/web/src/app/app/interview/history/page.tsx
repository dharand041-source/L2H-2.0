'use client';

import React from 'react';
import Link from 'next/link';
import { History, ArrowLeft, CheckCircle2, Award } from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function InterviewHistoryPage() {
  const { state } = useCandidateState();

  const sessions = [
    {
      id: 'int-001',
      title: 'Full-Stack Developer Comprehensive Simulation',
      date: 'Today, 4:10 PM',
      overallScore: state.interviewScore || 87,
      technicalScore: 88,
      commScore: 84,
      status: 'COMPLETED'
    },
    {
      id: 'int-002',
      title: 'PostgreSQL Architecture & Connection Pooling Deep Dive',
      date: 'Yesterday',
      overallScore: 82,
      technicalScore: 85,
      commScore: 80,
      status: 'COMPLETED'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.interview.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Interview Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Scorecard History</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Interview Simulator Scorecards
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Historical log of simulated rounds, multi-factor scores, evaluator remarks, and growth areas.
        </p>
      </div>

      <div className="space-y-4">
        {sessions.map((s) => (
          <div key={s.id} className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="yellow">{s.status}</Badge>
                <span className="text-xs text-brand-ink/60">{s.date}</span>
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                {s.title}
              </h3>
              <div className="text-xs text-brand-ink/70 mt-1">
                Technical: {s.technicalScore}% &bull; Communication: {s.commScore}% &bull; Overall: <strong className="text-brand-orange">{s.overallScore}%</strong>
              </div>
            </div>

            <Link href={ROUTES.app.interview.session(s.id)}>
              <Button variant="outline" size="sm">
                View Scorecard →
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
