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
  MapPin,
  AlertCircle
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  OpportunityMatcher,
  OpportunityItem,
  VERIFIED_OPPORTUNITIES
} from '@/lib/opportunities';

export default function OpportunitiesHubPage() {
  const { state } = useCandidateState();
  const [filterType, setFilterType] = useState<'ALL' | 'JOB' | 'INTERNSHIP' | 'STARTUP'>('ALL');
  const [tamilNaduOnly, setTamilNaduOnly] = useState(false);
  const [freshersOnly, setFreshersOnly] = useState(false);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [search, setSearch] = useState('');

  const oppTabs = [
    { label: 'All Feeds', href: ROUTES.app.opportunities.home, active: true },
    { label: 'Full-Time Jobs', href: ROUTES.app.opportunities.jobs, active: false },
    { label: 'Internships', href: ROUTES.app.opportunities.internships, active: false },
    { label: 'Startups', href: ROUTES.app.opportunities.startups, active: false },
    { label: 'Remote', href: ROUTES.app.opportunities.remote, active: false },
    { label: 'Saved', href: ROUTES.app.opportunities.saved, active: false },
  ];

  const activeRoleSlug = state.targetCareerSlug || 'full-stack-developer';

  // Retrieve verified live opportunities using our OpportunityMatcher
  const verifiedList = OpportunityMatcher.getOpportunities({
    roleSlug: activeRoleSlug,
    category: filterType,
    tamilNaduOnly,
    freshersOnly,
    remoteOnly,
    searchQuery: search,
    includeHistorical: false, // Never show historical listings as live
  });

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-badge bg-brand-yellow text-brand-ink">
                Legitimate Verified Feeds
              </span>
              <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
                Live vs Historical Integrity &bull; Zero Scraping Violation
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              Opportunity Engine
            </h1>
            <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
              Direct employer openings, internships, and startup tracks matched against your verified competencies with honest eligibility rules.
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
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-4 shadow-editorial flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-brand-ink/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, job title, or skill..."
            className="w-full pl-9 pr-4 py-2 bg-brand-cream border border-brand-ink text-xs font-semibold text-brand-ink focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Category Tabs */}
          {(['ALL', 'JOB', 'INTERNSHIP', 'STARTUP'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 text-xs font-bold uppercase border whitespace-nowrap ${
                filterType === t
                  ? 'bg-brand-ink text-white border-brand-ink'
                  : 'bg-brand-cream text-brand-ink border-brand-ink/30 hover:bg-brand-paper'
              }`}
            >
              {t === 'JOB' ? 'Full-Time' : t}
            </button>
          ))}

          {/* Tamil Nadu Region Filter */}
          <button
            onClick={() => setTamilNaduOnly(!tamilNaduOnly)}
            className={`px-3 py-1.5 text-xs font-bold uppercase border flex items-center gap-1 ${
              tamilNaduOnly
                ? 'bg-brand-orange text-white border-brand-orange'
                : 'bg-brand-cream text-brand-ink border-brand-ink/30 hover:bg-brand-paper'
            }`}
          >
            <MapPin className="w-3 h-3" /> Tamil Nadu
          </button>

          {/* Freshers Filter */}
          <button
            onClick={() => setFreshersOnly(!freshersOnly)}
            className={`px-3 py-1.5 text-xs font-bold uppercase border ${
              freshersOnly
                ? 'bg-brand-orange text-white border-brand-orange'
                : 'bg-brand-cream text-brand-ink border-brand-ink/30 hover:bg-brand-paper'
            }`}
          >
            Fresher / Trainee
          </button>

          {/* Remote Filter */}
          <button
            onClick={() => setRemoteOnly(!remoteOnly)}
            className={`px-3 py-1.5 text-xs font-bold uppercase border ${
              remoteOnly
                ? 'bg-brand-orange text-white border-brand-orange'
                : 'bg-brand-cream text-brand-ink border-brand-ink/30 hover:bg-brand-paper'
            }`}
          >
            Remote
          </button>
        </div>
      </div>

      {/* PHASE 47 & 71: ZERO FAKE DATA & HONEST NO MATCH STATE */}
      {verifiedList.length === 0 ? (
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 sm:p-12 shadow-editorial text-center space-y-5">
          <AlertCircle className="w-12 h-12 text-brand-orange mx-auto" />
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="font-display text-3xl font-bold uppercase text-brand-ink">
              No Current Verified Matches
            </h2>
            <p className="text-xs text-brand-ink/80 font-medium leading-relaxed">
              We did not find active verified vacancies matching these specific filter parameters. Learn-2-Hire strictly refuses to populate simulated companies or synthetic job listings.
            </p>
          </div>

          <div className="p-4 bg-brand-cream border border-brand-ink/30 max-w-lg mx-auto text-left text-xs space-y-2">
            <span className="font-bold uppercase text-brand-ink block">Recommended Remediation:</span>
            <ul className="list-disc list-inside space-y-1 text-brand-ink/80">
              <li>Reset location or role filters to view cross-regional openings.</li>
              <li>Complete your target career milestones on the Career Roadmap.</li>
              <li>Upload an updated resume revision in the Resume Hub.</li>
            </ul>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilterType('ALL');
                setTamilNaduOnly(false);
                setFreshersOnly(false);
                setRemoteOnly(false);
                setSearch('');
              }}
            >
              Reset All Filters
            </Button>
          </div>
        </div>
      ) : (
        /* Verified Opportunities Listing */
        <div className="space-y-4">
          {verifiedList.map((job) => {
            const match = OpportunityMatcher.evaluateMatch(
              state.skills,
              activeRoleSlug,
              0, // Fresher baseline or experience
              job
            );

            return (
              <div
                key={job.id}
                className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial hover:border-brand-orange transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="editorial-badge bg-brand-cream text-brand-ink text-[10px]">
                      {job.companyName}
                    </span>
                    <Badge variant={job.category === 'JOB' ? 'default' : 'yellow'}>
                      {job.category}
                    </Badge>
                    {job.isTamilNadu && (
                      <span className="px-2 py-0.5 bg-brand-yellow/50 border border-brand-ink/30 text-[10px] font-bold text-brand-ink uppercase">
                        Tamil Nadu
                      </span>
                    )}
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
                      {match.overallMatchScore}% Match &bull; {match.eligibilityStatus}
                    </span>
                    <span className="text-[10px] text-brand-ink/60 block mt-1">
                      {job.lastVerifiedAt} &bull; Source: {job.source}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full md:w-auto"
                    >
                      <Button variant="primary" size="sm" fullWidth className="text-xs">
                        Official Career Link <ExternalLink className="w-3.5 h-3.5 ml-1 inline" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
