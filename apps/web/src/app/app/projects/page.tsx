'use client';

import React from 'react';
import Link from 'next/link';
import { FolderGit2, CheckCircle2, ArrowRight, ExternalLink, ShieldCheck, Award } from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProjectsHubPage() {
  const { state } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  const projects = [
    {
      id: 'proj-001',
      title: 'Distributed Event Booking Service',
      category: 'Backend & Microservices',
      skills: ['Node.js', 'PostgreSQL', 'Redis', 'Docker'],
      complexity: 'Advanced (L3)',
      milestones: 4,
      currentMilestone: 2,
      status: 'IN_PROGRESS',
      description: 'Architect a high-concurrency ticket reservation engine handling seat locking, ACID payments, and webhook reconciliation.',
    },
    {
      id: 'proj-002',
      title: 'Full-Stack Job Board & Application Tracker',
      category: 'Full-Stack System',
      skills: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
      complexity: 'Intermediate (L3)',
      milestones: 4,
      currentMilestone: 0,
      status: 'AVAILABLE',
      description: 'Build an authenticated candidate job portal with dynamic resume parsing, ATS keyword scoring, and Kanban tracking.',
    },
    {
      id: 'proj-003',
      title: 'Real-Time Collaborative Analytics Dashboard',
      category: 'Data & Frontend Architecture',
      skills: ['React', 'TypeScript', 'WebSockets', 'Tailwind CSS'],
      complexity: 'Advanced (L4)',
      milestones: 5,
      currentMilestone: 0,
      status: 'AVAILABLE',
      description: 'Develop a streaming financial telemetries console with bi-directional WebSockets, data visualizers, and canvas rendering.',
    }
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-badge bg-brand-rose text-white">
                Skill Evidence Engine
              </span>
              <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
                Milestone-Driven Portfolio Proof
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              Real-World Project System
            </h1>
            <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
              Build authentic production applications backed by GitHub repository commits, live edge deployments, and rubric-scored automated evaluation.
            </p>
          </div>

          <div className="flex gap-2">
            <Link href={ROUTES.app.projects.myProjects}>
              <Button variant="outline" size="sm">
                My Projects
              </Button>
            </Link>
            <Link href={ROUTES.app.skillProof.home}>
              <Button variant="accent" size="sm">
                View Verified Proofs →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Project Banner */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="yellow">Active Project in Progress</Badge>
              <span className="text-xs font-bold text-brand-ink/60 uppercase">
                Milestone {state.activeProject?.milestoneCurrent ?? 0} of {state.activeProject?.milestoneTotal || 4}
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold uppercase text-brand-ink">
              {state.activeProject?.title || 'Distributed Event Booking Service'}
            </h2>
            <p className="text-sm text-brand-ink/85 max-w-2xl leading-relaxed">
              Targeting Node.js L3 &amp; PostgreSQL L3 competencies. Completing this project produces auditable evidence that upgrades your skill analyzer score.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-brand-ink/70 pt-1">
              <span>Rubric Score Target: <strong>90%+</strong></span>
              <span>&bull;</span>
              <span>Required: <strong>GitHub Repo + Vercel Live URL</strong></span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link href={ROUTES.app.projects.workspace('proj-001')}>
              <Button variant="primary" size="lg">
                Open Project Workspace →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Projects Catalog */}
      <div className="space-y-4">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink">
          Recommended Capstone Projects for {currentRole?.title || 'Full-Stack Developer'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <Card key={proj.id} hoverable accentBorder="orange" className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={proj.status === 'IN_PROGRESS' ? 'yellow' : 'default'}>
                    {proj.complexity}
                  </Badge>
                  <span className="text-xs font-bold text-brand-ink/60">
                    {proj.milestones} Milestones
                  </span>
                </div>

                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60">
                  {proj.category}
                </span>
                <h3 className="font-display text-2xl font-bold uppercase text-brand-ink mt-0.5 mb-2">
                  {proj.title}
                </h3>
                <p className="text-xs text-brand-ink/80 font-medium line-clamp-3 mb-4 leading-relaxed">
                  {proj.description}
                </p>

                <div className="flex flex-wrap gap-1 pt-3 border-t border-brand-ink/10">
                  {proj.skills.map((s) => (
                    <span key={s} className="text-[10px] font-bold px-1.5 py-0.5 bg-brand-cream border border-brand-ink/20 text-brand-ink">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-ink/20">
                <Link href={ROUTES.app.projects.workspace(proj.id)}>
                  <Button variant={proj.status === 'IN_PROGRESS' ? 'primary' : 'outline'} size="sm" fullWidth>
                    {proj.status === 'IN_PROGRESS' ? 'Resume Workspace →' : 'View Project Spec →'}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
