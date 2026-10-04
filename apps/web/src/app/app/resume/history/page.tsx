'use client';

import React from 'react';
import Link from 'next/link';
import { History, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ResumeHistoryPage() {
  const scans = [
    { title: 'Apex Media Junior Full Stack Job Spec Scan', date: 'Today, 5:10 PM', score: 92, keywordsMatched: 8, keywordsMissing: 2 },
    { title: 'CloudScale Infrastructure Spec Scan', date: 'Yesterday', score: 88, keywordsMatched: 7, keywordsMissing: 3 },
    { title: 'TCS Digital Software Engineer Spec Scan', date: '3 days ago', score: 84, keywordsMatched: 6, keywordsMissing: 4 }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.resume.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Resume Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Audit Log</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          ATS Scan History &amp; Audit Trail
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Historical record of compatibility scans, token evaluations, and keyword match scores.
        </p>
      </div>

      <div className="space-y-3">
        {scans.map((s) => (
          <div key={s.title} className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-brand-ink/60 font-semibold">{s.date}</span>
                <Badge variant="yellow">{s.score}% Compatibility</Badge>
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                {s.title}
              </h3>
              <div className="text-xs text-brand-ink/70 mt-1">
                Matched: {s.keywordsMatched} keywords &bull; Missing: {s.keywordsMissing} keywords
              </div>
            </div>

            <Link href={ROUTES.app.resume.analyzer}>
              <Button variant="outline" size="sm">
                View Detailed Scan →
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
