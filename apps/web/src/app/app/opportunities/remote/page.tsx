'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, ChevronRight } from 'lucide-react';
import { OPPORTUNITIES_CATALOG } from '@/lib/data/opportunities-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function OpportunitiesRemotePage() {
  const remote = OPPORTUNITIES_CATALOG.filter((o) => o.isRemote);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.opportunities.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Opportunity Engine
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Remote Opportunities</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Distributed &amp; Remote Roles
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Positions allowing worldwide or asynchronous work with verified remote compensation packages.
        </p>
      </div>

      <div className="space-y-4">
        {remote.map((job) => (
          <div key={job.id} className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="editorial-badge bg-brand-cream text-brand-ink text-[10px]">{job.companyName}</span>
                <Badge variant="rose">100% REMOTE</Badge>
                <span className="text-xs font-semibold text-brand-ink/60">{job.salary}</span>
              </div>
              <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">{job.title}</h3>
              <p className="text-xs text-brand-ink/80 font-medium max-w-2xl leading-relaxed">{job.description}</p>
            </div>
            <Link href={ROUTES.app.opportunities.detail(job.id)}>
              <Button variant="primary" size="sm">
                Check Eligibility &amp; Apply <ChevronRight className="w-3.5 h-3.5 ml-1 inline" />
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
