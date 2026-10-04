'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ResumeVersionsPage() {
  const versions = [
    { title: 'Full-Stack Developer (General)', status: 'ACTIVE PRIMARY', lastUpdated: 'Today', score: 92 },
    { title: 'Backend Systems & API Specialist', status: 'DRAFT', lastUpdated: 'Yesterday', score: 86 },
    { title: 'Frontend UI & React Architect', status: 'DRAFT', lastUpdated: '3 days ago', score: 84 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.resume.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Resume Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Document Variations</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Role-Targeted Resume Versions
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Tailored variations highlighting specific backend, frontend, or systems evidence depending on employer focus.
        </p>
      </div>

      <div className="space-y-4">
        {versions.map((v) => (
          <div key={v.title} className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={v.status === 'ACTIVE PRIMARY' ? 'yellow' : 'default'}>{v.status}</Badge>
                <span className="text-xs text-brand-ink/60">Updated: {v.lastUpdated}</span>
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                {v.title}
              </h3>
              <div className="text-xs text-brand-ink/70 mt-1">
                Compatibility Benchmark: <strong className="text-brand-orange">{v.score}%</strong>
              </div>
            </div>

            <div className="flex gap-2">
              <Link href={ROUTES.app.resume.builder}>
                <Button variant="outline" size="sm">Edit Document</Button>
              </Link>
              <Link href={ROUTES.app.resume.analyzer}>
                <Button variant="primary" size="sm">Scan ATS →</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
