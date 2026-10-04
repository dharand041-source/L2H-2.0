'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, ArrowLeft, CheckCircle2, Award, Briefcase } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 'notif-01',
      title: 'New Matched Job: Junior Full-Stack Engineer at CloudScale',
      time: '2 hours ago',
      type: 'MATCH',
      desc: 'Role matches your verified JavaScript L3 and Node.js L3 competencies with 91% compatibility.',
      href: ROUTES.app.opportunities.jobs
    },
    {
      id: 'notif-02',
      title: 'Milestone 2 Verified: Distributed Booking Service',
      time: 'Yesterday',
      type: 'EVIDENCE',
      desc: 'Automated test suite evaluated your code with 94% rubric score. Skill evidence logged to passport.',
      href: ROUTES.app.skillProof.home
    },
    {
      id: 'notif-03',
      title: 'Weekly Curated Free Curricula Refresh',
      time: '3 days ago',
      type: 'LEARNING',
      desc: '3 new modules from MDN Web Docs and freeCodeCamp added to your personalized roadmap.',
      href: ROUTES.app.learning.roadmap
    }
  ];

  return (
    <div className="space-y-8">
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="editorial-badge bg-brand-orange text-white">System Feed</span>
          <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
            Real-Time Notifications
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Candidate Notifications
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          System updates regarding matched job feeds, evidence verifications, and roadmap milestones.
        </p>
      </div>

      <div className="space-y-4">
        {notifications.map((n) => (
          <div key={n.id} className="bg-brand-paper border-[1.5px] border-brand-ink p-5 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant={n.type === 'MATCH' ? 'yellow' : 'default'}>{n.type}</Badge>
                <span className="text-xs text-brand-ink/60">{n.time}</span>
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                {n.title}
              </h3>
              <p className="text-xs text-brand-ink/80 font-medium max-w-2xl">{n.desc}</p>
            </div>

            <Link href={n.href}>
              <Button variant="outline" size="sm">
                View Update →
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
