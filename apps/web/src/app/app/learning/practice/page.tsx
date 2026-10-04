'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LearningPracticeBridgePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.learning.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Learning Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Practice Bridge</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Interactive Practice Bridge
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Bridge theoretical open curricula concepts directly into live code execution, SQL queries, and algorithmic problem sets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card accentBorder="orange" hoverable className="space-y-4">
          <Badge variant="default">Backend Code Runner</Badge>
          <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
            Node.js &amp; Express Challenge Set
          </h3>
          <p className="text-xs text-brand-ink/80 font-medium">
            Implement an express rate limiter middleware with sliding window algorithms.
          </p>
          <Link href={ROUTES.app.practice.coding}>
            <Button variant="primary" size="sm">
              Launch Coding Sandbox <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
            </Button>
          </Link>
        </Card>

        <Card accentBorder="yellow" hoverable className="space-y-4">
          <Badge variant="yellow">Relational Queries</Badge>
          <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
            SQL Aggregations &amp; Multi-Table JOINs
          </h3>
          <p className="text-xs text-brand-ink/80 font-medium">
            Write complex SELECT queries with HAVING clauses and indexed lookups.
          </p>
          <Link href={ROUTES.app.practice.sql}>
            <Button variant="accent" size="sm">
              Launch SQL Sandbox <ArrowRight className="w-3.5 h-3.5 ml-1 inline" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
