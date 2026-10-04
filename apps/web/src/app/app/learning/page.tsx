'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  MapPin,
  ExternalLink,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Bookmark,
  TrendingUp,
  Terminal,
  Layers
} from 'lucide-react';
import { CURATED_LEARNING_RESOURCES } from '@/lib/data/learning-data';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LearningHubPage() {
  const { state } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  const learningNavTabs = [
    { label: 'My Roadmap', href: ROUTES.app.learning.roadmap, active: true },
    { label: 'Courses Directory', href: ROUTES.app.learning.courses, active: false },
    { label: 'Lessons Player', href: ROUTES.app.learning.lessons, active: false },
    { label: 'Open Resources', href: ROUTES.app.learning.resources, active: false },
    { label: 'Practice Bridge', href: ROUTES.app.learning.practice, active: false },
    { label: 'Progress Telemetry', href: ROUTES.app.learning.progress, active: false },
    { label: 'Bookmarks', href: ROUTES.app.learning.bookmarks, active: false },
    { label: 'Weak Topics', href: ROUTES.app.learning.weakTopics, active: false },
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-badge bg-brand-pink text-brand-ink">
                Zero Paywalls
              </span>
              <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
                Open Curricula Ecosystem
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              Learning Hub &amp; Curricula
            </h1>
            <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
              Curated open learning pathways from freeCodeCamp, MDN Web Docs, Harvard CS50, and MIT OCW—strictly structured around your diagnostic skill gaps.
            </p>
          </div>

          <Link href={ROUTES.app.learning.roadmap}>
            <Button variant="primary" size="md">
              Open Personalized Roadmap <ArrowRight className="ml-2 w-4 h-4 inline" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Secondary Navigation Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-brand-ink/20">
        {learningNavTabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap bg-brand-paper border border-brand-ink hover:bg-brand-orange hover:text-white transition-all shadow-editorial-sm"
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Active Roadmap Hero Card */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <Badge variant="yellow">Personalized Remediation Plan</Badge>
            <h2 className="font-display text-3xl font-bold uppercase text-brand-ink">
              {currentRole?.title || 'Full-Stack'} Competency Roadmap
            </h2>
            <p className="text-sm text-brand-ink/85 max-w-2xl leading-relaxed">
              Synthesized from your baseline assessment. 6 directed open modules queued to advance your verified capabilities from L1/L2 to target benchmark levels.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-brand-ink/70 pt-1">
              <span>Priority: <strong>Node.js &amp; Async Streams</strong></span>
              <span>&bull;</span>
              <span>Next: <strong>React Hooks &amp; State Reconciliation</strong></span>
            </div>
          </div>

          <div className="shrink-0 flex gap-3">
            <Link href={ROUTES.app.learning.roadmap}>
              <Button variant="primary" size="lg">
                View Roadmap (6 Modules) →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Free Learning Modules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink">
            Curated Open Resources
          </h2>
          <Link href={ROUTES.app.learning.resources} className="text-xs font-bold uppercase text-brand-orange hover:underline">
            View All ({CURATED_LEARNING_RESOURCES.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CURATED_LEARNING_RESOURCES.slice(0, 6).map((res) => (
            <Card key={res.id} hoverable accentBorder="orange" className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="yellow">{res.provider}</Badge>
                  <span className="text-xs font-bold text-brand-ink/60">{res.difficulty}</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60">
                  {res.skillName} &bull; {res.topic}
                </span>
                <h3 className="font-display text-xl font-bold uppercase text-brand-ink mt-1 mb-2">
                  {res.title}
                </h3>
                <p className="text-xs text-brand-ink/80 font-medium line-clamp-3 mb-4 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="pt-4 border-t border-brand-ink/20 flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-ink/70 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {res.durationHours} hrs
                </span>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
                >
                  Direct Resource <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
