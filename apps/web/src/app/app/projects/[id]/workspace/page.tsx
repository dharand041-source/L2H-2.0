'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  FolderGit2,
  CheckCircle2,
  Circle,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Award,
  Terminal,
  Upload
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProjectWorkspacePage() {
  const params = useParams();
  const id = params?.id as string;
  const { state } = useCandidateState();

  const [githubUrl, setGithubUrl] = useState(state.activeProject?.githubUrl || 'https://github.com/alexmercer/event-booking-service');
  const [liveUrl, setLiveUrl] = useState('https://event-booking-demo.vercel.app');

  const milestones = [
    {
      num: 1,
      title: 'PostgreSQL Relational Schema & Migration Suite',
      status: 'VERIFIED',
      desc: 'Define normalized tables (users, events, seats, bookings) with foreign keys and unique reservation constraints.',
    },
    {
      num: 2,
      title: 'Node.js Express REST API & Seat Locking Transaction',
      status: 'IN_PROGRESS',
      desc: 'Implement concurrency handling with Redis key expiration or PostgreSQL SELECT ... FOR UPDATE transactions.',
    },
    {
      num: 3,
      title: 'Stripe Webhook Event Processing & Idempotency',
      status: 'QUEUED',
      desc: 'Process payment events asynchronously with signature verification and idempotency keys to prevent duplicate booking.',
    },
    {
      num: 4,
      title: 'Docker Containerization & CI/CD Edge Deployment',
      status: 'QUEUED',
      desc: 'Write multi-stage Dockerfile, configure GitHub Actions workflow, and deploy API to public URL.',
    }
  ];

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.projects.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Projects Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Active Workspace: {id}</span>
      </div>

      {/* Hero Workspace Header */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <Badge variant="yellow">Milestone-Driven Development</Badge>
            <h1 className="font-display text-3xl sm:text-4xl uppercase text-brand-ink mt-2">
              {state.activeProject?.title || 'Distributed Event Booking Service'}
            </h1>
            <p className="text-xs text-brand-ink/80 font-medium max-w-2xl mt-1 leading-relaxed">
              Targeting Node.js L3 &amp; PostgreSQL L3 competencies. Complete milestones sequentially, attach GitHub PRs, and run automated rubric audits.
            </p>
          </div>

          <div className="shrink-0 flex gap-2">
            <Link href={ROUTES.app.projects.submit(id)}>
              <Button variant="primary" size="md">
                Submit Deliverables →
              </Button>
            </Link>
          </div>
        </div>

        {/* Artifacts Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-brand-ink/10 text-xs">
          <div className="p-3 bg-brand-cream border border-brand-ink/20 flex items-center justify-between">
            <span className="text-brand-ink/70 font-semibold">GitHub Repo:</span>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-orange hover:underline flex items-center gap-1">
              {githubUrl.replace('https://github.com/', '')} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="p-3 bg-brand-cream border border-brand-ink/20 flex items-center justify-between">
            <span className="text-brand-ink/70 font-semibold">Live Edge URL:</span>
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-orange hover:underline flex items-center gap-1">
              {liveUrl.replace('https://', '')} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Milestones Sequencer */}
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink">
          Project Milestones
        </h2>

        <div className="space-y-4">
          {milestones.map((m) => (
            <div
              key={m.num}
              className={`bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                m.status === 'VERIFIED' ? 'bg-brand-cream/70' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full border border-brand-ink flex items-center justify-center font-display text-base font-bold shrink-0 bg-brand-paper">
                  {m.num}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={m.status === 'VERIFIED' ? 'yellow' : m.status === 'IN_PROGRESS' ? 'default' : 'rose'}>
                      {m.status}
                    </Badge>
                    <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                      {m.title}
                    </h3>
                  </div>
                  <p className="text-xs text-brand-ink/80 font-medium leading-relaxed max-w-2xl">
                    {m.desc}
                  </p>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {m.status === 'VERIFIED' ? (
                  <span className="text-xs font-bold text-brand-orange flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Evidence Logged
                  </span>
                ) : (
                  <Link href={ROUTES.app.projects.submit(id)}>
                    <Button variant="outline" size="sm">
                      Audit Milestone →
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
