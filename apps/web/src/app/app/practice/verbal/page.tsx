'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function VerbalPracticePage() {
  const exercises = [
    { id: 'v-01', title: 'Technical Documentation Reading Comprehension', topic: 'Comprehension', difficulty: 'MEDIUM' },
    { id: 'v-02', title: 'Professional Workplace Communication & Email Tone', topic: 'Business English', difficulty: 'EASY' },
    { id: 'v-03', title: 'Grammar Syntax & Sentence Structure Correction', topic: 'Grammar', difficulty: 'EASY' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.practice.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Practice Arena
        </Link>
        <span className="text-xs font-bold text-brand-pink uppercase">Verbal &amp; Communication</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Verbal &amp; Professional Communication
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Reading comprehension, technical articulation, and professional email grammar for global team readiness.
        </p>
      </div>

      <div className="space-y-3">
        {exercises.map((e) => (
          <div key={e.id} className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="rose">{e.difficulty}</Badge>
                <span className="text-xs font-bold text-brand-ink/60">{e.topic}</span>
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                {e.title}
              </h3>
            </div>
            <Link href={ROUTES.app.assessments.baseline}>
              <Button variant="outline" size="sm">
                Start Exercise →
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
