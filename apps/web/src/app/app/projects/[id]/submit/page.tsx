'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FolderGit2, ArrowLeft, CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProjectSubmitPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { state, updateState } = useCandidateState();

  const [githubUrl, setGithubUrl] = useState('https://github.com/alexmercer/event-booking-service');
  const [liveUrl, setLiveUrl] = useState('https://event-booking-demo.vercel.app');
  const [techStack, setTechStack] = useState('Node.js, Express, PostgreSQL, Redis, Docker, Jest');
  const [notes, setNotes] = useState('Implemented ACID transaction seat reservations with Redis distributed locks.');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEvaluating(true);

    setTimeout(() => {
      setIsEvaluating(false);
      setSubmitted(true);
      // Upgrade candidate state
      updateState((prev) => ({
        ...prev,
        stage: 'PROJECT_COMPLETED',
        activeProject: {
          ...prev.activeProject,
          isCompleted: true,
          rubricScore: 94,
          githubUrl,
        },
        readinessScore: Math.min(prev.readinessScore + 12, 98),
      }));
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.projects.workspace(id)} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Workspace
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Deliverable Verification</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-4">
        <h1 className="font-display text-4xl uppercase text-brand-ink">
          Submit Project Deliverables
        </h1>
        <p className="text-base text-brand-ink/80 mt-1">
          Provide your public code repository, live edge deployment URL, and architectural explanation to trigger rubric verification and log verified skill evidence.
        </p>
      </div>

      {submitted ? (
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 shadow-editorial text-center space-y-4">
          <div className="w-14 h-14 bg-brand-orange text-white rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="font-display text-3xl font-bold uppercase text-brand-ink">
            Project Deliverables Verified &bull; Score: 94/100
          </h2>
          <p className="text-sm text-brand-ink/80 max-w-md mx-auto leading-relaxed">
            Automated test assertions passed. Repository code quality, schema migrations, and concurrency controls verified. Skill evidence logged to your competency passport.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link href={ROUTES.app.skillProof.home}>
              <Button variant="primary">View Verified Skill Proof →</Button>
            </Link>
            <Link href={ROUTES.app.interview.mock}>
              <Button variant="outline">Proceed to Mock Interview →</Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial space-y-6">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-widest text-brand-ink/70 mb-2">
              Public GitHub Repository URL
            </label>
            <input
              type="url"
              required
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full p-3 bg-brand-cream border border-brand-ink text-xs font-mono text-brand-ink focus:outline-none"
              placeholder="https://github.com/username/project-repo"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-widest text-brand-ink/70 mb-2">
              Live Deployment URL (Vercel, Render, Railway, AWS)
            </label>
            <input
              type="url"
              required
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="w-full p-3 bg-brand-cream border border-brand-ink text-xs font-mono text-brand-ink focus:outline-none"
              placeholder="https://your-project.vercel.app"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-widest text-brand-ink/70 mb-2">
              Technologies &amp; Architecture Stack
            </label>
            <input
              type="text"
              required
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full p-3 bg-brand-cream border border-brand-ink text-xs font-semibold text-brand-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-widest text-brand-ink/70 mb-2">
              Technical Description &amp; Trade-Offs
            </label>
            <textarea
              rows={4}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-brand-cream border border-brand-ink text-xs font-medium text-brand-ink focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-brand-ink/20 flex items-center justify-between">
            <span className="text-xs text-brand-ink/60 font-semibold">
              Rubric evaluation takes ~3 seconds
            </span>
            <Button variant="accent" size="lg" disabled={isEvaluating} type="submit">
              {isEvaluating ? 'Evaluating Rubric...' : 'Run Rubric Audit & Verify →'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
