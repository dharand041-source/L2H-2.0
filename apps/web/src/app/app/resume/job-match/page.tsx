'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { OPPORTUNITIES_CATALOG } from '@/lib/data/opportunities-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ResumeJobMatchPage() {
  const matches = OPPORTUNITIES_CATALOG.slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.resume.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Resume Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Resume-Based Job Match</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Resume-Based Job Compatibility
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Automated comparison matching your verified resume skills and milestone deliverables against live employer requirements.
        </p>
      </div>

      <div className="space-y-4">
        {matches.map((job) => (
          <div key={job.id} className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase text-brand-ink/60">{job.companyName}</span>
                <Badge variant="yellow">91% Match</Badge>
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                {job.title}
              </h3>
              <div className="text-xs text-brand-ink/70 mt-1">
                Location: {job.location} &bull; Required: {job.requiredSkills.join(', ')}
              </div>
            </div>

            <Link href={ROUTES.app.opportunities.detail(job.id)}>
              <Button variant="primary" size="sm">
                View Match Breakdown →
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
