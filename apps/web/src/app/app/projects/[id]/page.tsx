'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FolderGit2, ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.projects.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Projects Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Project Spec: {id}</span>
      </div>

      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-4">
        <Badge variant="default">Production Capstone</Badge>
        <h1 className="font-display text-4xl uppercase text-brand-ink">
          Distributed Event Booking Service
        </h1>
        <p className="text-sm text-brand-ink/80 leading-relaxed max-w-3xl">
          Architect a high-concurrency ticket reservation engine handling seat locking, ACID payments, and webhook reconciliation.
        </p>

        <div className="pt-4 flex gap-3">
          <Link href={ROUTES.app.projects.workspace(id)}>
            <Button variant="primary" size="md">
              Launch Milestone Workspace <ArrowRight className="w-4 h-4 ml-1.5 inline" />
            </Button>
          </Link>
          <Link href={ROUTES.app.projects.submit(id)}>
            <Button variant="outline" size="md">
              Submit Deliverables
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
