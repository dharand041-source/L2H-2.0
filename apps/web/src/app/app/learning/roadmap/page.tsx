'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { CURATED_LEARNING_RESOURCES } from '@/lib/data/learning-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LearningRoadmapPage() {
  const { state } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  const roadmapModules = [
    {
      step: '01',
      skill: 'Node.js',
      title: 'Node.js & Express Asynchronous Microservices',
      provider: 'freeCodeCamp',
      duration: '14 hrs',
      levelUpgrade: 'L1 → L2',
      status: 'IN_PROGRESS',
      priority: 'CRITICAL',
      url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
      description: 'Event-driven server runtime, stream processing, middleware pipelines, and error handling.',
      topics: ['Event Loop & Worker Threads', 'Stream Buffering', 'Express Routing Architecture'],
    },
    {
      step: '02',
      skill: 'JavaScript',
      title: 'Advanced ECMAScript: Closures, Event Loop & Promises',
      provider: 'MDN Web Docs',
      duration: '6 hrs',
      levelUpgrade: 'L3 → L4',
      status: 'UP_NEXT',
      priority: 'HIGH',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures',
      description: 'Lexical scoping, prototype inheritance, macro vs microtask scheduling, and async pipelines.',
      topics: ['Lexical Environments', 'Memory Lifecycle & GC', 'Microtask Queue Ordering'],
    },
    {
      step: '03',
      skill: 'React',
      title: 'React 18 & Next.js: Hooks, Virtual DOM & State Architecture',
      provider: 'freeCodeCamp',
      duration: '18 hrs',
      levelUpgrade: 'L2 → L3',
      status: 'QUEUED',
      priority: 'HIGH',
      url: 'https://www.freecodecamp.org/news/tag/react/',
      description: 'Component lifecycles, custom hook abstraction, useCallback/useMemo optimization, and Next.js App Router.',
      topics: ['Concurrent Features', 'Context API vs Redux', 'Server Components vs Client Components'],
    },
    {
      step: '04',
      skill: 'SQL & Relational DBs',
      title: 'Relational Database Design & Multi-Table Aggregations',
      provider: 'SQLBolt',
      duration: '5 hrs',
      levelUpgrade: 'L2 → L3',
      status: 'QUEUED',
      priority: 'MEDIUM',
      url: 'https://sqlbolt.com/',
      description: 'Interactive query playground mastering multi-table INNER/LEFT/FULL OUTER JOINs, grouping, and subqueries.',
      topics: ['Multi-Table JOIN Strategies', 'HAVING vs WHERE', 'ACID Transactions & Isolation'],
    },
    {
      step: '05',
      skill: 'Web Security & Auth',
      title: 'Web Security Hygiene, OAuth 2.0 & Session Architecture',
      provider: 'MDN Web Docs',
      duration: '8 hrs',
      levelUpgrade: 'L2 → L3',
      status: 'QUEUED',
      priority: 'MEDIUM',
      url: 'https://developer.mozilla.org/en-US/docs/Web/Security',
      description: 'CORS policies, Content Security Policy (CSP), JWT vs HTTP-only cookie trade-offs, and OWASP Top 10.',
      topics: ['XSS & CSRF Prevention', 'Secure Cookie Attributes', 'Rate Limiting Implementation'],
    },
    {
      step: '06',
      skill: 'System Deployment',
      title: 'Docker Containerization & CI/CD Pipeline Automation',
      provider: 'Microsoft Learn',
      duration: '10 hrs',
      levelUpgrade: 'L1 → L2',
      status: 'QUEUED',
      priority: 'LOW',
      url: 'https://learn.microsoft.com/en-us/training/modules/intro-to-docker-containers/',
      description: 'Multi-stage Dockerfiles, image optimization, GitHub Actions CI workflows, and edge deployment.',
      topics: ['Multi-Stage Docker Builds', 'Layer Caching', 'Automated GitHub Workflows'],
    }
  ];

  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const toggleComplete = (step: string) => {
    setCompletedSteps((prev) =>
      prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]
    );
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-badge bg-brand-orange text-white">
                Personalized Curriculum
              </span>
              <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
                Target Role: {currentRole?.title || 'Full-Stack Developer'}
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              Competency Remediation Roadmap
            </h1>
            <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
              Curated open learning modules ordered strictly by diagnostic skill gaps and priority weightings. Work through each milestone and practice code execution.
            </p>
          </div>

          <Link href={ROUTES.app.practice.home}>
            <Button variant="accent" size="md">
              Practice Challenges →
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress Telemetry Banner */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-4 shadow-editorial flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge variant="yellow">{completedSteps.length} of {roadmapModules.length} Modules Completed</Badge>
          <span className="text-xs font-semibold text-brand-ink/70">
            Estimated Curriculum Time: 61 Hours Total
          </span>
        </div>

        <Link href={ROUTES.app.improve.reassessment}>
          <span className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1">
            Ready for Reassessment? Test Now →
          </span>
        </Link>
      </div>

      {/* Structured Sequential Roadmap */}
      <div className="space-y-6">
        {roadmapModules.map((mod) => {
          const isDone = completedSteps.includes(mod.step);

          return (
            <div
              key={mod.step}
              className={`bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial transition-all ${
                isDone ? 'opacity-70 bg-brand-cream/60' : ''
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Step Index & Checkbox */}
                <div className="lg:col-span-1 flex lg:flex-col items-center gap-2">
                  <span className="font-display text-3xl font-bold text-brand-orange">
                    {mod.step}
                  </span>
                  <button
                    onClick={() => toggleComplete(mod.step)}
                    className="p-1 border border-brand-ink bg-brand-cream hover:bg-brand-yellow/30"
                    title={isDone ? 'Mark Incomplete' : 'Mark Complete'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-brand-orange" />
                    ) : (
                      <Circle className="w-5 h-5 text-brand-ink/40" />
                    )}
                  </button>
                </div>

                {/* Module Details */}
                <div className="lg:col-span-8 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={mod.priority === 'CRITICAL' ? 'rose' : 'yellow'}>
                      {mod.priority} GAP
                    </Badge>
                    <span className="editorial-badge bg-brand-cream text-brand-ink text-[10px]">
                      {mod.provider}
                    </span>
                    <span className="text-xs font-bold text-brand-orange">
                      Target Upgrade: {mod.levelUpgrade}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
                    {mod.title}
                  </h3>

                  <p className="text-xs text-brand-ink/80 font-medium leading-relaxed">
                    {mod.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {mod.topics.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-semibold px-2 py-0.5 bg-brand-cream border border-brand-ink/20 text-brand-ink"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="lg:col-span-3 flex flex-col gap-2 items-start lg:items-end justify-between h-full pt-1">
                  <span className="text-xs font-semibold text-brand-ink/70 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {mod.duration}
                  </span>

                  <a
                    href={mod.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full lg:w-auto"
                  >
                    <Button variant="primary" size="sm" fullWidth className="text-xs">
                      Open Free Curriculum <ExternalLink className="ml-1 w-3.5 h-3.5 inline" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
