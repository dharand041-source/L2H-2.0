'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LearningWeakTopicsPage() {
  const { state } = useCandidateState();

  const weakTopics = [
    {
      topic: 'Node.js Event Loop Streams & Buffers',
      skill: 'Node.js',
      severity: 'CRITICAL',
      missedIn: 'Baseline Diagnostic (Question 3)',
      recommendedDoc: 'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/',
      docTitle: 'Node.js Official Guide: Event Loop, Timers, and process.nextTick()',
    },
    {
      topic: 'React Asynchronous State Batching Closures',
      skill: 'React',
      severity: 'HIGH',
      missedIn: 'Baseline Diagnostic (Question 2)',
      recommendedDoc: 'https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state',
      docTitle: 'React Docs: Updating State Based on the Previous State',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.learning.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Learning Hub
        </Link>
        <span className="text-xs font-bold text-brand-rose uppercase">Weak Topics Remediation</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Diagnostic Weak Topic Remediation
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Identified specifically from incorrect or low-confidence responses during calibrated diagnostic assessments.
        </p>
      </div>

      <div className="space-y-4">
        {weakTopics.map((item) => (
          <div key={item.topic} className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="rose">{item.severity} GAP</Badge>
                <span className="text-xs font-bold text-brand-ink">{item.skill}</span>
              </div>
              <span className="text-xs text-brand-ink/60 font-semibold">{item.missedIn}</span>
            </div>

            <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
              {item.topic}
            </h3>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <a
                href={item.recommendedDoc}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
              >
                Read Official Specification: {item.docTitle} <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <Link href={ROUTES.app.practice.debugging}>
                <Button variant="outline" size="sm">
                  Practice Debugging Scenario →
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
