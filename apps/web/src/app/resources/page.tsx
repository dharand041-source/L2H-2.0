'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, BookOpen, Clock, ArrowRight } from 'lucide-react';
import { CURATED_LEARNING_RESOURCES } from '@/lib/data/learning-data';
import { ROUTES } from '@/lib/routes';
import { EditorialNav } from '@/components/layout/editorial-nav';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PublicResourcesPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink flex flex-col bg-grid-subtle">
      <EditorialNav />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="border-b-[1.5px] border-brand-ink pb-8 space-y-3">
            <span className="editorial-badge bg-brand-pink text-brand-ink text-xs">
              Open Educational Ecosystem
            </span>
            <h1 className="font-display-hero text-brand-ink tracking-tight">
              ZERO PAYWALLS. <br />
              <span className="text-brand-orange">THE WORLD&apos;S BEST CURRICULA.</span>
            </h1>
            <p className="text-lg text-brand-ink/80 max-w-2xl font-medium">
              We never charge for educational content. We organize the world&apos;s most rigorous free courses into unified competency roadmaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CURATED_LEARNING_RESOURCES.map((r) => (
              <Card key={r.id} hoverable accentBorder="yellow" className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="yellow">{r.provider}</Badge>
                    <span className="text-xs font-bold text-brand-ink/60">{r.difficulty}</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60">
                    {r.skillName} &bull; {r.topic}
                  </span>
                  <h3 className="font-display text-xl font-bold uppercase text-brand-ink mt-1 mb-2">
                    {r.title}
                  </h3>
                  <p className="text-xs text-brand-ink/80 font-medium line-clamp-3 mb-4 leading-relaxed">
                    {r.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-ink/20 flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-ink/70 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {r.durationHours} hrs
                  </span>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
                  >
                    Direct Open Link <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-brand-cream border-t-[1.5px] border-brand-ink py-8 px-4 text-center text-xs font-semibold text-brand-ink/70">
        Learn-2-Hire 2.0 &bull; Curated Open Resources
      </footer>
    </div>
  );
}
