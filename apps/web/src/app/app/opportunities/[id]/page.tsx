'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Briefcase,
  Building2,
  MapPin,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Bookmark,
  ShieldCheck,
  TrendingUp,
  Award,
  Layers
} from 'lucide-react';
import { OPPORTUNITIES_CATALOG, OpportunityItem } from '@/lib/data/opportunities-data';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { state, updateState } = useCandidateState();

  const job = OPPORTUNITIES_CATALOG.find((o) => o.id === id) || OPPORTUNITIES_CATALOG[0];
  const [isSaved, setIsSaved] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  // Resume Approval Gate check:
  const isResumeReady = state.resume.status === 'READY';

  const handleApplyClick = () => {
    if (!isResumeReady) {
      alert('Resume Approval Gate: Your resume must be marked READY before submitting direct employer applications. Please complete your resume optimization.');
      router.push(ROUTES.app.resume.builder);
      return;
    }
    setApplyModalOpen(true);
  };

  const handleConfirmDirectApply = () => {
    // Add to applications state
    updateState((prev) => ({
      ...prev,
      stage: 'APPLIED',
      applications: [
        {
          id: `app-${Date.now()}`,
          opportunityId: job.id,
          company: job.companyName,
          title: job.title,
          status: 'APPLIED',
          appliedDate: 'Just now',
        },
        ...prev.applications,
      ],
    }));

    setApplyModalOpen(false);
    // Open real external employer URL in new tab as strictly specified
    window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.opportunities.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Opportunity Engine
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant={job.employmentType === 'FULL_TIME' ? 'default' : 'yellow'}>
            {job.employmentType.replace(/_/g, ' ')}
          </Badge>
          <span className="text-xs font-semibold text-brand-ink/60">ID: {job.id}</span>
        </div>
      </div>

      {/* Hero Opportunity Overview */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="editorial-badge bg-brand-cream text-brand-ink text-xs font-bold">
                {job.companyName}
              </span>
              <span className="text-xs font-semibold text-brand-ink/70 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {job.location}
              </span>
              {job.isRemote && <Badge variant="rose">REMOTE</Badge>}
            </div>

            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              {job.title}
            </h1>

            <p className="text-base text-brand-ink/90 font-medium leading-relaxed max-w-2xl">
              {job.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-brand-ink/80 border-t border-brand-ink/10">
              <div>Compensation: <strong className="text-brand-ink">{job.salary}</strong></div>
              <div>&bull;</div>
              <div>Experience: <strong className="text-brand-ink">{job.experienceLevelRequired}</strong></div>
              <div>&bull;</div>
              <div>Source: <strong className="text-brand-orange">{job.source}</strong></div>
              <div>&bull;</div>
              <div>Verified: <strong>{job.lastVerifiedAt}</strong></div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleApplyClick}
              className="text-base"
            >
              Direct Apply <ExternalLink className="w-4 h-4 ml-2 inline" />
            </Button>

            <Link href={ROUTES.app.opportunities.eligibility(job.id)} className="w-full">
              <Button variant="outline" size="md" fullWidth>
                Check Rule-Based Eligibility →
              </Button>
            </Link>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setIsSaved(!isSaved)}
              >
                <Bookmark className="w-4 h-4 mr-1.5 inline" />
                {isSaved ? 'Saved in Bookmarks' : 'Save Listing'}
              </Button>

              <Link href={ROUTES.app.skills.analysis} className="w-full">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  View Skill Gaps
                </Button>
              </Link>
            </div>

            <p className="text-[10px] text-center text-brand-ink/60 font-medium">
              Direct Apply opens verified employer destination. Applications are tracked in your Kanban pipeline.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Explainable Match & Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Requirements & Job Spec */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-4">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink pb-2 border-b border-brand-ink/20">
              Role Requirements &amp; Tech Stack
            </h2>

            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-ink/70 block">
                Required Technical Competencies:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {job.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-bold px-3 py-1 bg-brand-cream border border-brand-ink/30 text-brand-ink"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-brand-ink/10 space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-ink/70 block">
                Key Responsibilities:
              </span>
              <ul className="text-xs space-y-1.5 text-brand-ink/85 list-disc pl-4 leading-relaxed font-medium">
                <li>Develop reliable backend services and REST APIs adhering to high test coverage standards</li>
                <li>Design normalized relational database schemas with PostgreSQL and write performant queries</li>
                <li>Participate in agile sprint ceremonies, code reviews, and architectural RFC discussions</li>
                <li>Collaborate with product designers and frontend engineers to ship performant interfaces</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Explainable Match Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
              <div>
                <span className="editorial-badge bg-brand-yellow text-brand-ink text-[10px] mb-1">
                  Explainable Match
                </span>
                <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
                  Compatibility Verdict
                </h3>
              </div>
              <Badge variant="yellow">ELIGIBLE</Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-brand-cream border border-brand-ink/20 flex justify-between items-center">
                <span className="font-semibold text-brand-ink/70">Role Alignment:</span>
                <strong className="text-brand-orange">Strong (Full-Stack Engineer)</strong>
              </div>
              <div className="p-3 bg-brand-cream border border-brand-ink/20 flex justify-between items-center">
                <span className="font-semibold text-brand-ink/70">Core Competencies:</span>
                <strong className="text-brand-ink">5 / 6 Matched (83%)</strong>
              </div>
              <div className="p-3 bg-brand-cream border border-brand-ink/20 flex justify-between items-center">
                <span className="font-semibold text-brand-ink/70">Experience Level:</span>
                <strong className="text-brand-ink">Matches (0-2 Years)</strong>
              </div>
              <div className="p-3 bg-brand-cream border border-brand-ink/20 flex justify-between items-center">
                <span className="font-semibold text-brand-ink/70">Location / Work Type:</span>
                <strong className="text-brand-ink">Matches (Remote Permitted)</strong>
              </div>
            </div>

            <div className="p-4 bg-brand-cream border border-brand-ink/20 space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-rose block">
                Missing Requirements:
              </span>
              <div className="text-xs text-brand-ink font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-brand-rose" /> Docker Containerization
              </div>
              <p className="text-[11px] text-brand-ink/70 font-medium">
                Bridge this requirement in your Personalized Roadmap to maximize interview conversion.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Direct Application */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-cream border-[1.5px] border-brand-ink max-w-lg w-full p-6 sm:p-8 shadow-editorial space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-orange border border-brand-ink flex items-center justify-center font-display text-white text-xl">
                L2H
              </div>
              <div>
                <h3 className="font-display text-2xl uppercase font-bold text-brand-ink">
                  Direct Employer Application
                </h3>
                <span className="text-xs text-brand-ink/70 font-semibold">{job.companyName} &bull; {job.title}</span>
              </div>
            </div>

            <div className="p-4 bg-brand-paper border border-brand-ink/20 space-y-2 text-xs">
              <div className="font-bold text-brand-ink">Zero-Scraping / Direct Apply Notice:</div>
              <p className="text-brand-ink/80 leading-relaxed">
                Clicking confirm will register this application in your Learn-2-Hire Kanban tracker and open the verified official employer application page ({job.source}) in a new browser tab.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setApplyModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirmDirectApply}>
                Confirm &amp; Open Official Portal <ExternalLink className="w-3.5 h-3.5 ml-1 inline" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
