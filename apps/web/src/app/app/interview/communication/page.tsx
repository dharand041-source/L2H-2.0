'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowLeft, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CommunicationInterviewPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.interview.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Interview Hub
        </Link>
        <span className="text-xs font-bold text-brand-pink uppercase">Articulation &amp; Clarity</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Communication &amp; Articulation
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Learn how to articulate complex technical ideas simply to non-technical stakeholders, product managers, and executive leadership.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card accentBorder="pink" hoverable className="space-y-3">
          <Badge variant="rose">Stakeholder Alignment</Badge>
          <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
            Explaining Database Indexing to a Non-Technical Product Manager
          </h3>
          <p className="text-xs text-brand-ink/80 font-medium">
            Use real-world analogies (library catalogs, textbook index) without confusing jargon.
          </p>
          <Link href={ROUTES.app.interview.mock}>
            <Button variant="primary" size="sm">
              Practice Explanation →
            </Button>
          </Link>
        </Card>

        <Card accentBorder="yellow" hoverable className="space-y-3">
          <Badge variant="yellow">Executive Synthesis</Badge>
          <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
            Presenting an Architecture Migration Business Case
          </h3>
          <p className="text-xs text-brand-ink/80 font-medium">
            Quantify cost savings, downtime reduction, and developer velocity improvements.
          </p>
          <Link href={ROUTES.app.interview.mock}>
            <Button variant="accent" size="sm">
              Practice Explanation →
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
