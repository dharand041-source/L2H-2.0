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

  const getRoleChallenges = (slug: string) => {
    if (slug === 'frontend-developer') {
      return [
        {
          id: 'prac-fe-001',
          badge: 'Frontend Performance & DOM',
          title: 'High-Performance React Virtualized List & Microtask Batching',
          desc: 'Build a 60fps virtualized list rendering 100,000 items with zero layout thrashing, resize observers, and synthetic event delegation.',
          route: ROUTES.app.practice.coding,
        },
        {
          id: 'prac-fe-002',
          badge: 'Accessibility & Design Tokens',
          title: 'WCAG 2.1 AA Keyboard Navigation & Focus Trap Architecture',
          desc: 'Implement accessible modal dialogs, roving tabindex for nested menus, and ARIA announcement polite regions.',
          route: ROUTES.app.practice.debugging,
        },
      ];
    }

    if (slug === 'cybersecurity-architect') {
      return [
        {
          id: 'prac-sec-001',
          badge: 'Security Architecture & IAM',
          title: 'Zero Trust Identity Federation & Contextual Policy Engine',
          desc: 'Design policy decision points (PDP) evaluating device health, IP reputation, and OAuth token claims before granting service bus access.',
          route: ROUTES.app.practice.coding,
        },
        {
          id: 'prac-sec-002',
          badge: 'Threat Modeling & Cloud',
          title: 'STRIDE Threat Modeling & Defense-in-Depth Cloud Hardening',
          desc: 'Analyze a distributed financial gateway topology to uncover elevation of privilege vectors, token spoofing, and mitigation blueprints.',
          route: ROUTES.app.practice.role,
        },
      ];
    }

    if (slug === 'data-scientist') {
      return [
        {
          id: 'prac-ds-001',
          badge: 'Feature Engineering & EDA',
          title: 'Automated Missing Value Imputation & Outlier Detection',
          desc: 'Implement robust median-IQR outlier filters and multivariable KNN imputers on streaming credit risk tabular datasets.',
          route: ROUTES.app.practice.coding,
        },
        {
          id: 'prac-ds-002',
          badge: 'Relational & Analytical SQL',
          title: 'Complex Cohort Retention Window Functions & Churn Analysis',
          desc: 'Formulate advanced SQL queries using dense rank, lead/lag, and cumulative distribution window functions across transaction tables.',
          route: ROUTES.app.practice.sql,
        },
      ];
    }

    if (slug === 'ui-ux-designer') {
      return [
        {
          id: 'prac-ux-001',
          badge: 'Design System & Typography',
          title: 'Multi-Density Design Token Architecture & Contrast Validation',
          desc: 'Architect HSL design tokens supporting high-contrast accessibility themes and responsive modular typographic scales.',
          route: ROUTES.app.practice.debugging,
        },
        {
          id: 'prac-ux-002',
          badge: 'Usability Testing & Wireframing',
          title: 'Checkout Friction Analysis & Micro-Interaction Flow Design',
          desc: 'Redesign a 4-step mobile checkout funnel to reduce cart abandonment by eliminating cognitive overload and ambiguous affordances.',
          route: ROUTES.app.practice.role,
        },
      ];
    }

    return [
      {
        id: 'prac-fs-001',
        badge: 'Full Stack Architecture',
        title: 'JWT Session Token Rotation with Refresh Cookies',
        desc: 'Implement secure OAuth state storage, CSRF double-submit cookies, and token blacklisting in Node.js.',
        route: ROUTES.app.practice.coding,
      },
      {
        id: 'prac-fs-002',
        badge: 'Database Schema Design',
        title: 'Multi-Tenant Relational Indexing Strategy',
        desc: 'Optimize slow queries on multi-million row tables using composite B-Tree and partial indexes.',
        route: ROUTES.app.practice.sql,
      },
    ];
  };

  const challenges = getRoleChallenges(state.targetCareerSlug || 'full-stack-developer');

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
        {challenges.map((ch, idx) => (
          <Card key={ch.id} accentBorder={idx === 0 ? 'orange' : 'yellow'} hoverable className="space-y-3">
            <Badge variant={idx === 0 ? 'default' : 'yellow'}>{ch.badge}</Badge>
            <h3 className="font-display text-2xl font-bold uppercase text-brand-ink">
              {ch.title}
            </h3>
            <p className="text-xs text-brand-ink/80 font-medium leading-relaxed">
              {ch.desc}
            </p>
            <Link href={ch.route}>
              <Button variant={idx === 0 ? 'primary' : 'accent'} size="sm">
                Open Challenge →
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
