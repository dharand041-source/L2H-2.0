'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  Layers,
  Sparkles,
  MapPin
} from 'lucide-react';
import { OPPORTUNITIES_CATALOG, OpportunityItem } from '@/lib/data/opportunities-data';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function OpportunitiesHubPage() {
  const { state } = useCandidateState();
  const [filterType, setFilterType] = useState<'ALL' | 'FULL_TIME' | 'INTERNSHIP' | 'STARTUP' | 'REMOTE'>('ALL');
  const [search, setSearch] = useState('');

  const oppTabs = [
    { label: 'All Feeds', href: ROUTES.app.opportunities.home, active: true },
    { label: 'Full-Time Jobs', href: ROUTES.app.opportunities.jobs, active: false },
    { label: 'Internships', href: ROUTES.app.opportunities.internships, active: false },
    { label: 'Startups', href: ROUTES.app.opportunities.startups, active: false },
    { label: 'Remote', href: ROUTES.app.opportunities.remote, active: false },
    { label: 'Recommended', href: ROUTES.app.opportunities.recommended, active: false },
    { label: 'Saved', href: ROUTES.app.opportunities.saved, active: false },
  ];

  const filtered = OPPORTUNITIES_CATALOG.filter((item) => {
    const matchesFilter = filterType === 'ALL' || item.employmentType === filterType || (filterType === 'REMOTE' && item.isRemote);
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.companyName.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-badge bg-brand-yellow text-brand-ink">
                Legitimate Feeds
              </span>
              <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
                Zero Scraping Integrity &bull; Official Career Links
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              Opportunity Engine
            </h1>
            <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
              Direct employer openings and verified API listings matched to your auditable competencies and evaluated against explicit eligibility rules.
            </p>
          </div>

          <Link href={ROUTES.app.applications.home}>
            <Button variant="outline" size="sm">
              My Applications Pipeline →
            </Button>
          </Link>
        </div>
      </div>

      {/* Secondary Tab Navigation Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-brand-ink/20">
        {oppTabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap bg-brand-paper border border-brand-ink hover:bg-brand-orange hover:text-white transition-all shadow-editorial-sm"
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-4 shadow-editorial flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-brand-ink/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, job title, or location..."
            className="w-full pl-9 pr-4 py-2 bg-brand-cream border border-brand-ink text-xs font-semibold text-brand-ink focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {(['ALL', 'FULL_TIME', 'INTERNSHIP', 'STARTUP', 'REMOTE'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 text-xs font-bold uppercase border whitespace-nowrap ${
                filterType === t
                  ? 'bg-brand-ink text-white border-brand-ink'
                  : 'bg-brand-cream text-brand-ink border-brand-ink/30 hover:bg-brand-paper'
              }`}
            >
              {t.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filtered.map((job) => (
          <div
            key={job.id}
            className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial hover:border-brand-orange transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="editorial-badge bg-brand-cream text-brand-ink text-[10px]">
                  {job.companyName}
                </span>
                <Badge variant={job.employmentType === 'FULL_TIME' ? 'default' : 'yellow'}>
                  {job.employmentType.replace(/_/g, ' ')}
                </Badge>
                {job.isRemote && (
                  <Badge variant="rose">REMOTE</Badge>
                )}
                <span className="text-xs font-semibold text-brand-ink/60">
                  {job.location} &bull; {job.salary}
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
                {job.title}
              </h3>

              <p className="text-xs text-brand-ink/80 font-medium line-clamp-2 leading-relaxed">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {job.requiredSkills.map((s) => (
                  <span key={s} className="text-[10px] font-semibold px-2 py-0.5 bg-brand-cream border border-brand-ink/20 text-brand-ink">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end justify-between gap-3 shrink-0">
              <div className="text-right">
                <span className="editorial-badge bg-brand-yellow text-brand-ink text-[10px]">
                  91% Resume Match
                </span>
                <span className="text-[10px] text-brand-ink/60 block mt-1">
                  Source: {job.source} &bull; {job.lastVerifiedAt}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <Link href={ROUTES.app.opportunities.detail(job.id)} className="w-full md:w-auto">
                  <Button variant="primary" size="sm" fullWidth className="text-xs">
                    Inspect Match &amp; Apply <ChevronRight className="w-3.5 h-3.5 ml-1 inline" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
