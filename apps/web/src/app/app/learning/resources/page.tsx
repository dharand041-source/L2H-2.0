'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, ExternalLink, Search, Clock, ArrowLeft } from 'lucide-react';
import { CURATED_LEARNING_RESOURCES } from '@/lib/data/learning-data';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LearningResourcesCatalogPage() {
  const [query, setQuery] = useState('');
  const [providerFilter, setProviderFilter] = useState('ALL');

  const filtered = CURATED_LEARNING_RESOURCES.filter((r) => {
    const matchesQuery =
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.skillName.toLowerCase().includes(query.toLowerCase()) ||
      r.topic.toLowerCase().includes(query.toLowerCase());
    const matchesProv = providerFilter === 'ALL' || r.provider === providerFilter;
    return matchesQuery && matchesProv;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
        <Link href={ROUTES.app.learning.home} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Learning Hub
        </Link>
        <span className="text-xs font-bold text-brand-orange uppercase">
          Open Resources Index
        </span>
      </div>

      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
          Verified Open Educational Resources
        </h1>
        <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
          Catalog of verified free learning materials from freeCodeCamp, MDN Web Docs, Harvard CS50, MIT OCW, SWAYAM, and SQLBolt.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-4 shadow-editorial flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-brand-ink/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by topic, skill, or keywords..."
            className="w-full pl-9 pr-4 py-2 bg-brand-cream border border-brand-ink text-xs font-semibold text-brand-ink focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['ALL', 'freeCodeCamp', 'MDN Web Docs', 'SQLBolt', 'Harvard CS50'].map((prov) => (
            <button
              key={prov}
              onClick={() => setProviderFilter(prov)}
              className={`px-3 py-1.5 text-xs font-bold uppercase border whitespace-nowrap ${
                providerFilter === prov
                  ? 'bg-brand-ink text-white border-brand-ink'
                  : 'bg-brand-cream text-brand-ink border-brand-ink/40 hover:bg-brand-paper'
              }`}
            >
              {prov}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
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
              <p className="text-xs text-brand-ink/80 font-medium line-clamp-3 mb-4 leading-relaxed">
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
                Direct Link <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
