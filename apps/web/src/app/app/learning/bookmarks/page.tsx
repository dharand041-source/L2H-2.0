'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, ArrowLeft, ExternalLink, Clock } from 'lucide-react';
import { CURATED_LEARNING_RESOURCES } from '@/lib/data/learning-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LearningBookmarksPage() {
  const bookmarks = CURATED_LEARNING_RESOURCES.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.learning.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Learning Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">Saved Items</span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Bookmarked Curricula &amp; Docs
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Pinned resources saved for review, offline reading, or reference during portfolio development.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarks.map((item) => (
          <Card key={item.id} hoverable accentBorder="yellow" className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="yellow">{item.provider}</Badge>
                <span className="text-xs font-bold text-brand-ink/60">{item.difficulty}</span>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60">
                {item.skillName} &bull; {item.topic}
              </span>
              <h3 className="font-display text-xl font-bold uppercase text-brand-ink mt-1 mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-brand-ink/80 font-medium line-clamp-3 mb-4">
                {item.description}
              </p>
            </div>

            <div className="pt-4 border-t border-brand-ink/20 flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-ink/70 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {item.durationHours} hrs
              </span>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
              >
                Access <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
