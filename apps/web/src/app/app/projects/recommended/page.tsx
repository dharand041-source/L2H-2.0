'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, FolderGit2, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RecommendedProjectsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.projects.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Projects Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Tailored Recommendations</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Recommended Capstone Projects
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Projects algorithmically selected to bridge your specific diagnostic skill gaps and provide auditable evidence for your target career.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card accentBorder="orange" className="space-y-4">
          <Badge variant="rose">CRITICAL GAP TARGET: Node.js L3</Badge>
          <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
            Distributed Event Booking Engine
          </h3>
          <p className="text-xs text-brand-ink/80 font-medium">
            Implements event-driven architecture, connection pooling, and seat locking to satisfy Node.js L3 criteria.
          </p>
          <Link href={ROUTES.app.projects.workspace('proj-001')}>
            <Button variant="primary" size="sm">
              Open Workspace →
            </Button>
          </Link>
        </Card>

        <Card accentBorder="yellow" className="space-y-4">
          <Badge variant="yellow">HIGH GAP TARGET: React L3</Badge>
          <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
            Full-Stack Kanban &amp; Sprint Tracker
          </h3>
          <p className="text-xs text-brand-ink/80 font-medium">
            Implements drag-and-drop state reconciliation, optimistic updates, and custom context hooks.
          </p>
          <Link href={ROUTES.app.projects.workspace('proj-002')}>
            <Button variant="outline" size="sm">
              Open Workspace →
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
