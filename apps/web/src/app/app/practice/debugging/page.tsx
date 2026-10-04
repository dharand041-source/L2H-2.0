'use client';

import React from 'react';
import Link from 'next/link';
import { Bug, ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DebuggingPracticePage() {
  const scenarios = [
    {
      id: 'bug-01',
      title: 'Memory Leak in React useEffect Event Listener',
      severity: 'HIGH',
      description: 'Window resize listener attached inside useEffect without returned cleanup handler causing detached DOM nodes.',
      snippet: `useEffect(() => {
  window.addEventListener('resize', handleResize);
  // MISSING: return () => window.removeEventListener('resize', handleResize);
}, []);`
    },
    {
      id: 'bug-02',
      title: 'PostgreSQL Unreleased Pool Connection in Exception Handler',
      severity: 'CRITICAL',
      description: 'DB client acquired from pool but client.release() is bypassed when an unhandled query rejection occurs.',
      snippet: `const client = await pool.connect();
try {
  await client.query('BEGIN');
  // ... fails here
} finally {
  client.release(); // REQUIRED
}`
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.practice.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Practice Arena
        </Link>
        <span className="text-xs font-bold text-brand-rose uppercase">Bug Hunt Scenarios</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Code Debugging &amp; Bug Hunts
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Inspect production-like snippets containing race conditions, memory leaks, and unhandled exception paths.
        </p>
      </div>

      <div className="space-y-6">
        {scenarios.map((sc) => (
          <div key={sc.id} className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="rose">{sc.severity}</Badge>
                <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                  {sc.title}
                </h3>
              </div>
            </div>
            <p className="text-xs text-brand-ink/80 font-medium">
              {sc.description}
            </p>
            <div className="p-3 bg-brand-ink text-brand-paper font-mono text-xs overflow-x-auto">
              <pre>{sc.snippet}</pre>
            </div>
            <div className="flex justify-end">
              <Link href={ROUTES.app.practice.coding}>
                <Button variant="primary" size="sm">
                  Fix &amp; Verify Solution →
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
