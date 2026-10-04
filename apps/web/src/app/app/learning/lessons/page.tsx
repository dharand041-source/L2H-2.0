'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowLeft, ExternalLink, Play, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LearningLessonsPage() {
  const currentLessons = [
    {
      id: 'les-01',
      title: 'Understanding Asynchronous Event Loops in V8',
      provider: 'MDN Web Docs',
      skill: 'JavaScript',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop',
      duration: '45 mins',
      status: 'READY'
    },
    {
      id: 'les-02',
      title: 'Building REST API Middleware in Express',
      provider: 'freeCodeCamp',
      skill: 'Node.js',
      url: 'https://www.freecodecamp.org/news/how-to-write-middleware-in-express-js/',
      duration: '60 mins',
      status: 'READY'
    },
    {
      id: 'les-03',
      title: 'SQL Relational Aggregations & Joins Playground',
      provider: 'SQLBolt',
      skill: 'SQL & DBs',
      url: 'https://sqlbolt.com/',
      duration: '35 mins',
      status: 'READY'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.learning.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Learning Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Active Lessons</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Directed Lesson Reader
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Bite-sized, modular conceptual explanations targeting immediate diagnostic misconceptions.
        </p>
      </div>

      <div className="space-y-4">
        {currentLessons.map((les) => (
          <div key={les.id} className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="yellow">{les.provider}</Badge>
                <span className="text-xs font-bold text-brand-ink/60">{les.skill}</span>
              </div>
              <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
                {les.title}
              </h3>
              <div className="text-xs text-brand-ink/70">
                Duration: {les.duration}
              </div>
            </div>

            <a href={les.url} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="sm">
                Open Lesson Content <ExternalLink className="w-3.5 h-3.5 ml-1.5 inline" />
              </Button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
