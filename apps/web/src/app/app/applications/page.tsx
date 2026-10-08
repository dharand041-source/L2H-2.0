'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Kanban,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Building2,
  MapPin,
  FileText,
  ShieldCheck,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ApplicationStore, ApplicationRecord, ApplicationStatus } from '@/lib/applications';

export default function ApplicationsHubPage() {
  const { state } = useCandidateState();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST' | 'RECENTLY_UPDATED' | 'HIGH_COMPAT' | 'LOW_COMPAT'>('NEWEST');

  // Unified application records (either from CandidateState or ApplicationStore)
  const allApplications: ApplicationRecord[] = useMemo(() => {
    const list = state.applications && state.applications.length > 0
      ? state.applications
      : ApplicationStore.getApplications();
    return list;
  }, [state.applications]);

  // Funnel & metric calculations
  const metrics = useMemo(() => {
    return ApplicationStore.calculateFunnelMetrics(allApplications);
  }, [allApplications]);

  // Distinct career roles from user's actual applications
  const uniqueRoles = useMemo(() => {
    const set = new Set<string>();
    allApplications.forEach((a) => {
      if (a.careerRoleSlug) set.add(a.careerRoleSlug);
    });
    return Array.from(set);
  }, [allApplications]);

  // Filtered & Sorted applications
  const filteredApplications = useMemo(() => {
    return allApplications
      .filter((app) => {
        // Status filter
        if (statusFilter !== 'ALL') {
          if (statusFilter === 'SCREENING' && (app.status === 'SCREENING' || app.status === 'ASSESSMENT')) {
            // match
          } else if (statusFilter === 'OFFER' && (app.status === 'OFFER' || app.status === 'OFFER_ACCEPTED' || app.status === 'OFFER_DECLINED')) {
            // match
          } else if (app.status !== statusFilter) {
            return false;
          }
        }

        // Role filter
        if (roleFilter !== 'ALL' && app.careerRoleSlug !== roleFilter) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = app.title.toLowerCase().includes(q);
          const matchCompany = app.company.toLowerCase().includes(q);
          const matchLoc = (app.location || '').toLowerCase().includes(q);
          const matchRole = (app.careerRoleSlug || '').toLowerCase().includes(q);
          if (!matchTitle && !matchCompany && !matchLoc && !matchRole) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'NEWEST') {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (sortBy === 'OLDEST') {
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        }
        if (sortBy === 'RECENTLY_UPDATED') {
          return new Date(b.updatedAt || b.lastStatusChangeAt || 0).getTime() - new Date(a.updatedAt || a.lastStatusChangeAt || 0).getTime();
        }
        if (sortBy === 'HIGH_COMPAT') {
          return (b.compatibilityScore || 0) - (a.compatibilityScore || 0);
        }
        if (sortBy === 'LOW_COMPAT') {
          return (a.compatibilityScore || 0) - (b.compatibilityScore || 0);
        }
        return 0;
      });
  }, [allApplications, statusFilter, roleFilter, searchQuery, sortBy]);

  const statusTabButtons = [
    { id: 'ALL', label: 'All Submissions', count: metrics.total },
    { id: 'SAVED', label: 'Saved', count: metrics.saved },
    { id: 'APPLICATION_STARTED', label: 'Started', count: metrics.started },
    { id: 'APPLIED', label: 'Applied', count: metrics.applied },
    { id: 'SCREENING', label: 'Screening', count: metrics.screening },
    { id: 'INTERVIEW', label: 'Interview', count: metrics.interview },
    { id: 'OFFER', label: 'Offers', count: metrics.offer },
    { id: 'REJECTED', label: 'Rejected', count: metrics.rejected },
    { id: 'WITHDRAWN', label: 'Withdrawn', count: metrics.withdrawn },
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Control Center Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-badge bg-brand-orange text-white">
                Application Control Center
              </span>
              <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
                Evidence-Driven Lifecycle Audit
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              Application Tracker
            </h1>
            <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
              Track every application from first click to final outcome. Preserve exact resume versions, verified eligibility, employer feedback, and closed-loop retraining actions.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href={ROUTES.app.applications.timeline}>
              <Button variant="outline" size="sm">
                <Clock className="w-4 h-4 mr-1.5 inline" /> Audit Timeline
              </Button>
            </Link>
            <Link href={ROUTES.app.applications.kanban}>
              <Button variant="primary" size="sm">
                <Kanban className="w-4 h-4 mr-1.5 inline" /> Interactive Kanban →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Actual Counts Metric Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-3 bg-brand-paper border-[1.5px] border-brand-ink shadow-editorial text-center">
          <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">Total</span>
          <div className="font-display text-2xl font-bold text-brand-ink mt-0.5">{metrics.total}</div>
        </div>
        <div className="p-3 bg-brand-paper border-[1.5px] border-brand-ink shadow-editorial text-center">
          <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">Applied</span>
          <div className="font-display text-2xl font-bold text-brand-orange mt-0.5">{metrics.applied}</div>
        </div>
        <div className="p-3 bg-brand-paper border-[1.5px] border-brand-ink shadow-editorial text-center">
          <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">Screening</span>
          <div className="font-display text-2xl font-bold text-brand-ink mt-0.5">{metrics.screening}</div>
        </div>
        <div className="p-3 bg-brand-paper border-[1.5px] border-brand-ink shadow-editorial text-center">
          <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">Interview</span>
          <div className="font-display text-2xl font-bold text-brand-ink mt-0.5">{metrics.interview}</div>
        </div>
        <div className="p-3 bg-brand-paper border-[1.5px] border-brand-ink shadow-editorial text-center">
          <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">Offers</span>
          <div className="font-display text-2xl font-bold text-green-700 mt-0.5">{metrics.offer}</div>
        </div>
        <div className="p-3 bg-brand-paper border-[1.5px] border-brand-ink shadow-editorial text-center">
          <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">Rejected</span>
          <div className="font-display text-2xl font-bold text-brand-rose mt-0.5">{metrics.rejected}</div>
        </div>
        <div className="p-3 bg-brand-paper border-[1.5px] border-brand-ink shadow-editorial text-center">
          <span className="text-[10px] font-extrabold uppercase text-brand-ink/60">Withdrawn</span>
          <div className="font-display text-2xl font-bold text-brand-ink/60 mt-0.5">{metrics.withdrawn}</div>
        </div>
      </div>

      {/* Application Funnel & Conversion Rates Analysis */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-ink/15 pb-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-orange">
              Application Funnel
            </span>
            <h3 className="font-display text-lg font-bold uppercase text-brand-ink">
              Candidate Progression &amp; Conversion Rates
            </h3>
          </div>
          <span className="text-xs font-mono text-brand-ink/60">
            {metrics.rates.hasReliableSample ? 'Verified Sample: ≥ 5 Applications' : 'Sample Size: < 5 Applications'}
          </span>
        </div>

        {/* Funnel Stages Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-2.5 bg-brand-cream border border-brand-ink/20">
            <span className="text-[10px] text-brand-ink/60 uppercase block">1. Saved</span>
            <span className="font-bold text-brand-ink text-base">{metrics.saved}</span>
          </div>
          <div className="p-2.5 bg-brand-cream border border-brand-ink/20">
            <span className="text-[10px] text-brand-ink/60 uppercase block">2. Started</span>
            <span className="font-bold text-brand-ink text-base">{metrics.started}</span>
          </div>
          <div className="p-2.5 bg-brand-cream border border-brand-ink/20">
            <span className="text-[10px] text-brand-ink/60 uppercase block">3. Applied</span>
            <span className="font-bold text-brand-orange text-base">{metrics.applied}</span>
          </div>
          <div className="p-2.5 bg-brand-cream border border-brand-ink/20">
            <span className="text-[10px] text-brand-ink/60 uppercase block">4. Screening</span>
            <span className="font-bold text-brand-ink text-base">{metrics.screening}</span>
          </div>
          <div className="p-2.5 bg-brand-cream border border-brand-ink/20">
            <span className="text-[10px] text-brand-ink/60 uppercase block">5. Interview</span>
            <span className="font-bold text-brand-ink text-base">{metrics.interview}</span>
          </div>
          <div className="p-2.5 bg-brand-cream border border-brand-ink/20">
            <span className="text-[10px] text-brand-ink/60 uppercase block">6. Offer</span>
            <span className="font-bold text-green-700 text-base">{metrics.offer}</span>
          </div>
        </div>

        {/* Strict Honesty: Conversion Rates */}
        {metrics.rates.hasReliableSample ? (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 bg-brand-cream border border-brand-ink/30">
              <span className="text-[10px] text-brand-ink/60 uppercase block">Applied → Screening</span>
              <span className="font-display text-xl font-bold text-brand-ink">{metrics.rates.appliedToScreeningRate}%</span>
            </div>
            <div className="p-3 bg-brand-cream border border-brand-ink/30">
              <span className="text-[10px] text-brand-ink/60 uppercase block">Screening → Interview</span>
              <span className="font-display text-xl font-bold text-brand-ink">{metrics.rates.screeningToInterviewRate}%</span>
            </div>
            <div className="p-3 bg-brand-cream border border-brand-ink/30">
              <span className="text-[10px] text-brand-ink/60 uppercase block">Interview → Offer</span>
              <span className="font-display text-xl font-bold text-brand-ink">{metrics.rates.interviewToOfferRate}%</span>
            </div>
            <div className="p-3 bg-brand-cream border border-brand-ink/30">
              <span className="text-[10px] text-brand-ink/60 uppercase block">Overall Offer Rate</span>
              <span className="font-display text-xl font-bold text-green-700">{metrics.rates.overallOfferRate}%</span>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-brand-cream border border-brand-ink/20 text-xs text-brand-ink/70 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-brand-orange shrink-0" />
            <span>Not enough application history to calculate a reliable conversion rate. Rates will be displayed once 5 or more active applications are logged.</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-brand-ink/20 pb-3">
          {statusTabButtons.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center gap-1.5 border ${
                statusFilter === tab.id
                  ? 'bg-brand-ink text-white border-brand-ink'
                  : 'bg-brand-paper text-brand-ink border-brand-ink/30 hover:border-brand-ink'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1 py-0.2 rounded ${statusFilter === tab.id ? 'bg-brand-orange text-white' : 'bg-brand-cream text-brand-ink/70'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search, Sort, and Role Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-ink/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role title, company, or location..."
              className="w-full pl-9 pr-3 py-2 bg-brand-paper border border-brand-ink text-xs text-brand-ink focus:outline-none"
            />
          </div>

          {uniqueRoles.length > 0 && (
            <div className="shrink-0">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="p-2 bg-brand-paper border border-brand-ink text-xs font-bold uppercase text-brand-ink focus:outline-none"
              >
                <option value="ALL">All Career Roles</option>
                {uniqueRoles.map((r) => (
                  <option key={r} value={r}>
                    {r.replace(/-/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="shrink-0 flex items-center gap-1.5">
            <ArrowUpDown className="w-4 h-4 text-brand-ink/50" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="p-2 bg-brand-paper border border-brand-ink text-xs font-bold uppercase text-brand-ink focus:outline-none"
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
              <option value="RECENTLY_UPDATED">Recently Updated</option>
              <option value="HIGH_COMPAT">Highest Compatibility</option>
              <option value="LOW_COMPAT">Lowest Compatibility</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions List / Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink">
            Active Records ({filteredApplications.length})
          </h2>
          <Link href={ROUTES.app.opportunities.jobs}>
            <Button variant="outline" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1 inline" /> Find Verified Openings
            </Button>
          </Link>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="bg-brand-paper border-[1.5px] border-brand-ink p-12 text-center shadow-editorial space-y-4">
            <AlertCircle className="w-10 h-10 text-brand-orange mx-auto" />
            <h3 className="font-display text-2xl uppercase tracking-tight text-brand-ink font-bold">
              No Applications Yet
            </h3>
            <p className="text-xs text-brand-ink/75 max-w-md mx-auto leading-relaxed">
              Your verified job matches and direct application records will appear here after you start applying. Learn-2-Hire strictly refuses to generate fake application records.
            </p>
            <div className="pt-2">
              <Link href={ROUTES.app.opportunities.jobs}>
                <Button variant="primary" size="md">
                  Explore Matched Jobs →
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => {
              const statusVariant =
                app.status === 'OFFER' || app.status === 'OFFER_ACCEPTED'
                  ? 'yellow'
                  : app.status === 'REJECTED'
                  ? 'rose'
                  : app.status === 'WITHDRAWN'
                  ? 'default'
                  : 'default';

              return (
                <div
                  key={app.id}
                  className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 flex-1">
                    {/* Header metadata row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="editorial-badge bg-brand-cream text-brand-ink text-[11px] font-bold uppercase">
                        {app.company}
                      </span>
                      <Badge variant={statusVariant}>
                        {app.status === 'APPLICATION_STARTED' ? 'APPLICATION STARTED' : app.status}
                      </Badge>
                      {app.location && (
                        <span className="text-xs text-brand-ink/65 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {app.location} {app.workMode ? `• ${app.workMode}` : ''}
                        </span>
                      )}
                      <span className="text-xs text-brand-ink/50">
                        {app.appliedDate ? `Applied: ${app.appliedDate}` : `Recorded: ${new Date(app.createdAt).toLocaleDateString()}`}
                      </span>
                    </div>

                    {/* Role Title */}
                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink">
                      {app.title}
                    </h3>

                    {/* Key Attributes Grid */}
                    <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                      {app.compatibilityScore !== undefined && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-brand-ink/60 font-semibold">L2H Compatibility:</span>
                          <span className="font-mono font-bold text-brand-orange">{app.compatibilityScore}%</span>
                        </div>
                      )}

                      {app.eligibilityStatus && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-brand-ink/60 font-semibold">Eligibility:</span>
                          <span className={`font-bold uppercase ${app.eligibilityStatus === 'ELIGIBLE' ? 'text-green-700' : 'text-brand-ink'}`}>
                            {app.eligibilityStatus.replace(/_/g, ' ')}
                          </span>
                        </div>
                      )}

                      {app.resumeTitle && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-brand-ink/60 font-semibold">Resume Used:</span>
                          <span className="font-mono text-brand-ink font-bold">{app.resumeTitle}</span>
                        </div>
                      )}
                    </div>

                    {/* Outcome feedback banner (Strict Attribution) */}
                    {app.status === 'REJECTED' && (
                      <div className="p-3 bg-brand-cream border border-brand-rose/40 text-xs space-y-1 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-brand-rose uppercase">
                            Reason: {app.outcomeReason || 'Employer did not provide a reason.'}
                          </span>
                          <span className="text-[10px] font-mono text-brand-ink/60 uppercase">
                            Source: {app.outcomeSourceType || 'CANDIDATE_REPORTED'}
                          </span>
                        </div>
                        {app.outcomeReasonCategory && (
                          <div className="text-[11px] text-brand-ink/70">
                            Category: <strong className="uppercase">{app.outcomeReasonCategory.replace(/_/g, ' ')}</strong>
                          </div>
                        )}
                      </div>
                    )}

                    {app.status === 'WITHDRAWN' && (
                      <div className="p-3 bg-brand-cream border border-brand-ink/30 text-xs space-y-1 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-brand-ink uppercase">
                            Withdrawn by candidate: {app.withdrawalReasonCategory?.replace(/_/g, ' ') || 'Personal reason'}
                          </span>
                          <span className="text-[10px] font-mono text-brand-ink/60 uppercase">
                            Source: CANDIDATE_REPORTED
                          </span>
                        </div>
                        {app.withdrawalReasonText && (
                          <div className="text-[11px] text-brand-ink/75">
                            Details: {app.withdrawalReasonText}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-stretch gap-2">
                    <Link href={ROUTES.app.applications.detail(app.id)}>
                      <Button variant="primary" size="sm" className="w-full text-xs uppercase font-bold">
                        View Application →
                      </Button>
                    </Link>

                    {app.status === 'REJECTED' && (
                      <Link href={ROUTES.app.improve.home}>
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retrain Feedback
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
