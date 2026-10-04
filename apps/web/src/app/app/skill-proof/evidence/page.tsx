'use client';

import React from 'react';
import Link from 'next/link';
import { FileCheck, ArrowLeft, ExternalLink, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SkillProofEvidencePage() {
  const artifacts = [
    {
      id: 'art-01',
      title: 'GitHub Commit: Distributed Lock Middleware (PR #4)',
      type: 'CODE_COMMIT',
      timestamp: 'Today, 3:20 PM',
      skill: 'Node.js (L3 Upgrade)',
      url: 'https://github.com/alexmercer/event-booking-service/pull/4'
    },
    {
      id: 'art-02',
      title: 'Vercel Edge API Deployment Proof',
      type: 'LIVE_DEPLOYMENT',
      timestamp: 'Today, 3:25 PM',
      skill: 'Docker & Deployment (L2 Upgrade)',
      url: 'https://event-booking-demo.vercel.app'
    },
    {
      id: 'art-03',
      title: 'Baseline Diagnostic Evaluation Timestamp',
      type: 'DIAGNOSTIC_RECORD',
      timestamp: 'Yesterday',
      skill: 'JavaScript (L3 Confirmed)',
      url: '#'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.skillProof.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Proof Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Artifact Ledger</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Auditable Artifact Evidence
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Cryptographic logs of code commits, pull requests, automated test runner outputs, and edge deployments.
        </p>
      </div>

      <div className="space-y-3">
        {artifacts.map((art) => (
          <div key={art.id} className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="yellow">{art.type.replace(/_/g, ' ')}</Badge>
                <span className="text-xs text-brand-ink/60">{art.timestamp}</span>
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                {art.title}
              </h3>
              <div className="text-xs text-brand-orange font-bold mt-0.5">
                Upgrades: {art.skill}
              </div>
            </div>

            <a href={art.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1">
              Inspect Artifact <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
