'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ImproveRetrainingPage() {
  const modules = [
    {
      skill: 'Node.js',
      title: 'Deep Dive: Event Loop, Asynchronous Streams & Worker Threads',
      provider: 'freeCodeCamp / Node.js Official Docs',
      duration: '4 hours',
      url: 'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/',
      desc: 'Remediates baseline assessment question 3 and Docker microservices requirements.'
    },
    {
      skill: 'React',
      title: 'State Reconciliation, Fiber Architecture & Custom Hooks',
      provider: 'MDN Web Docs',
      duration: '3 hours',
      url: 'https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started',
      desc: 'Remediates stale closure bugs and unnecessary re-renderings.'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.improve.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Improvement Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Active Retraining</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Targeted Retraining Modules
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Bespoke remediation curricula tailored to the exact failure concepts identified in diagnostics and interview rounds.
        </p>
      </div>

      <div className="space-y-4">
        {modules.map((m) => (
          <div key={m.title} className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="rose">GAP REMEDIATION: {m.skill}</Badge>
                <span className="editorial-badge bg-brand-cream text-brand-ink text-[10px]">{m.provider}</span>
                <span className="text-xs text-brand-ink/60">{m.duration}</span>
              </div>
              <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">{m.title}</h3>
              <p className="text-xs text-brand-ink/80 font-medium max-w-2xl">{m.desc}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <a href={m.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  Open Free Material <ExternalLink className="w-3.5 h-3.5 ml-1 inline" />
                </Button>
              </a>
              <Link href={ROUTES.app.improve.reassessment}>
                <Button variant="primary" size="sm">
                  Test Capability →
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
