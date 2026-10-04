'use client';

import React from 'react';
import Link from 'next/link';
import { Target, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RoleInterviewPage() {
  const { state } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.interview.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Interview Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Role-Specific Round</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          {currentRole?.title || 'Target Role'} Technical Interview
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Specialized questions matching the exact technology stack and responsibilities of {currentRole?.title}.
        </p>
      </div>

      <div className="space-y-4">
        {currentRole?.interviewTopics.map((topic, i) => (
          <div key={i} className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase text-brand-ink/60">Topic #{i + 1}</span>
              <h3 className="font-display text-xl font-bold uppercase text-brand-ink mt-0.5">
                {topic}
              </h3>
            </div>
            <Link href={ROUTES.app.interview.mock}>
              <Button variant="primary" size="sm">
                Launch Question Simulation →
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
