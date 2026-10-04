'use client';

import React from 'react';
import Link from 'next/link';
import { FolderGit2, ArrowLeft, ArrowRight, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function MyProjectsPage() {
  const { state } = useCandidateState();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.projects.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Projects Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">My Active Projects</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Candidate Portfolio Workspaces
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Active code repositories, deployed live URLs, and verification scorecards.
        </p>
      </div>

      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="yellow">IN PROGRESS</Badge>
              <span className="text-xs font-bold text-brand-ink/60">
                Milestone {state.activeProject?.milestoneCurrent || 2} of {state.activeProject?.milestoneTotal || 4}
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold uppercase text-brand-ink">
              {state.activeProject?.title || 'Distributed Event Booking Service'}
            </h2>
            <div className="text-xs text-brand-ink/70 mt-1">
              GitHub: <a href={state.activeProject?.githubUrl || '#'} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-orange hover:underline">{state.activeProject?.githubUrl || 'alexmercer/booking-service'}</a>
            </div>
          </div>

          <div className="flex gap-2">
            <Link href={ROUTES.app.projects.workspace('proj-001')}>
              <Button variant="primary" size="sm">
                Open Workspace →
              </Button>
            </Link>
            <Link href={ROUTES.app.projects.submit('proj-001')}>
              <Button variant="outline" size="sm">
                Submit Milestone →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
