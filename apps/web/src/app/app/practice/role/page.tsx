'use client';

import React from 'react';
import Link from 'next/link';
import { Target, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCandidateState } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RolePracticePage() {
  const { state } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.practice.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Practice Arena
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Role-Specific Practice</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          {currentRole?.title || 'Target Role'} Practice Problems
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Specialized challenges matching the exact daily workflows and technology stack of {currentRole?.title}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card accentBorder="orange" hoverable className="space-y-3">
          <Badge variant="default">Full Stack Architecture</Badge>
          <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
            JWT Session Token Rotation with Refresh Cookies
          </h3>
          <p className="text-xs text-brand-ink/80 font-medium leading-relaxed">
            Implement secure OAuth state storage, CSRF double-submit cookies, and token blacklisting in Node.js.
          </p>
          <Link href={ROUTES.app.practice.coding}>
            <Button variant="primary" size="sm">
              Open Challenge →
            </Button>
          </Link>
        </Card>

        <Card accentBorder="yellow" hoverable className="space-y-3">
          <Badge variant="yellow">Database Schema Design</Badge>
          <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
            Multi-Tenant Relational Indexing Strategy
          </h3>
          <p className="text-xs text-brand-ink/80 font-medium leading-relaxed">
            Optimize slow queries on multi-million row tables using composite B-Tree and partial indexes.
          </p>
          <Link href={ROUTES.app.practice.sql}>
            <Button variant="accent" size="sm">
              Open Challenge →
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
