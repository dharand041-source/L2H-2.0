'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { getOpportunitiesByRole, calculateExplainableMatch } from '@/lib/data/opportunities-data';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function OpportunitiesStartupsPage() {
  const { state } = useCandidateState();
  const activeRoleSlug = state.targetCareerSlug || 'full-stack-developer';
  const currentRole = getCareerBySlug(activeRoleSlug);

  const { exactMatches, relatedMatches } = getOpportunitiesByRole(activeRoleSlug, 'STARTUP');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.opportunities.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Opportunity Engine
        </Link>
        <div className="flex items-center gap-2">
          <span className="editorial-badge bg-brand-rose text-white text-[10px]">
            Target: {currentRole?.title || 'Selected Role'}
          </span>
          <span className="text-xs font-bold text-brand-orange uppercase">High-Growth Startups</span>
        </div>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Venture-Backed Startup Roles
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          High-ownership founding engineering and product roles at Y Combinator and top venture-backed startups calibrated to <strong className="text-brand-ink font-bold">{currentRole?.title}</strong>.
        </p>
      </div>

      {/* SECTION 1: Exact Role Matches */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-brand-ink flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-brand-rose rounded-full inline-block" />
            Exact Startup Matches ({exactMatches.length})
          </h2>
          <span className="text-xs font-semibold text-brand-ink/60">Equity + Direct Impact</span>
        </div>

        {exactMatches.length === 0 ? (
          <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 text-center space-y-3">
            <p className="font-display text-xl uppercase font-bold text-brand-ink">
              No Direct Startup Openings for {currentRole?.title} at this instant
            </p>
            <p className="text-xs text-brand-ink/70 max-w-md mx-auto">
              Explore adjacent venture-backed team roles hiring from across our technical network below.
            </p>
          </div>
        ) : (
          exactMatches.map((job) => {
            const match = calculateExplainableMatch(job, state.skills, activeRoleSlug);
            return (
              <div
                key={job.id}
                className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="editorial-badge bg-brand-cream text-brand-ink text-[10px] font-bold">
                      {job.companyName}
                    </span>
                    <Badge variant="rose">STARTUP (VENTURE BACKED)</Badge>
                    <span className="editorial-badge bg-brand-yellow text-brand-ink text-[10px] font-bold">
                      {match.overallScore}% MATCH
                    </span>
                    <span className="text-xs font-semibold text-brand-ink/60">
                      {job.location} &bull; {job.salary}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">{job.title}</h3>
                  <p className="text-xs text-brand-ink/80 font-medium max-w-2xl leading-relaxed">{job.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-brand-ink/70 pt-1">
                    <span>Source: <strong className="text-brand-orange">{job.source}</strong></span>
                    <span>&bull;</span>
                    <span>Verified: {job.lastVerifiedAt}</span>
                    <span>&bull;</span>
                    <span className="text-green-700 font-bold">
                      {match.matchedSkills.length} of {job.requiredSkills.length} Skills Matched
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Link href={ROUTES.app.opportunities.detail(job.id)}>
                    <Button variant="primary" size="sm">
                      Check Eligibility &amp; Apply <ChevronRight className="w-3.5 h-3.5 ml-1 inline" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* SECTION 2: Related Startups */}
      {relatedMatches.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-brand-ink/20">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-brand-ink/70 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-brand-ink/40 rounded-full inline-block" />
              Related Startup Openings (Adjacent Disciplines)
            </h2>
            <span className="text-xs font-semibold text-brand-ink/50">Early-Stage Tech Teams</span>
          </div>

          <div className="space-y-3">
            {relatedMatches.slice(0, 4).map((job) => (
              <div
                key={job.id}
                className="bg-brand-cream/60 border border-brand-ink/30 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="editorial-badge bg-brand-paper text-brand-ink text-[10px]">{job.companyName}</span>
                    <span className="text-xs font-bold text-brand-ink/60 uppercase">{job.roleSlug.replace(/-/g, ' ')}</span>
                    <span className="text-xs text-brand-ink/60">{job.location} &bull; {job.salary}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold uppercase text-brand-ink">{job.title}</h3>
                  <p className="text-xs text-brand-ink/70 max-w-xl line-clamp-1">{job.description}</p>
                </div>

                <Link href={ROUTES.app.opportunities.detail(job.id)}>
                  <Button variant="outline" size="sm">
                    View Role <ChevronRight className="w-3 h-3 ml-1 inline" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
