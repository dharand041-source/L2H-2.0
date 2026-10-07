'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Search, ArrowRight, Cpu, Layers, Sparkles } from 'lucide-react';
import { CAREER_ROLES_CATALOG } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { EditorialNav } from '@/components/layout/editorial-nav';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

export default function PublicCareersAtlasPage() {
  const [query, setQuery] = useState('');
  const [track, setTrack] = useState<'ALL' | 'TECHNICAL' | 'NON_TECHNICAL' | 'HYBRID'>('ALL');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  React.useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (isMounted) {
          setIsAuthenticated(Boolean(user));
        }
      } catch {}
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const journeyHref = isAuthenticated ? ROUTES.app.dashboard : ROUTES.auth.login;

  const filtered = CAREER_ROLES_CATALOG.filter((r) => {
    const matchesQuery =
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.category.toLowerCase().includes(query.toLowerCase()) ||
      r.requiredSkills.some(s => s.name.toLowerCase().includes(query.toLowerCase()));
    const matchesTrack = track === 'ALL' || r.track === track;
    return matchesQuery && matchesTrack;
  });

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink flex flex-col bg-grid-subtle">
      <EditorialNav />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="border-b-[1.5px] border-brand-ink pb-8 space-y-3">
            <span className="editorial-badge bg-brand-yellow text-brand-ink text-xs">
              ESCO &amp; O*NET Standard Taxonomy
            </span>
            <h1 className="font-display-hero text-brand-ink tracking-tight">
              CAREER ATLAS. <br />
              <span className="text-brand-orange">22+ VERIFIED ROLES.</span>
            </h1>
            <p className="text-lg text-brand-ink/80 max-w-2xl font-medium">
              Explore comprehensive career blueprints across software engineering, data science, cybersecurity, product management, and growth marketing.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-brand-paper border-[1.5px] border-brand-ink p-4 shadow-editorial flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-brand-ink/60 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search occupations or skills..."
                className="w-full pl-9 pr-4 py-2 bg-brand-cream border border-brand-ink text-xs font-semibold text-brand-ink focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
              {(['ALL', 'TECHNICAL', 'NON_TECHNICAL', 'HYBRID'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTrack(t)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase border whitespace-nowrap ${
                    track === t
                      ? 'bg-brand-ink text-white border-brand-ink'
                      : 'bg-brand-cream text-brand-ink border-brand-ink/40 hover:bg-brand-paper'
                  }`}
                >
                  {t.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Careers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((role) => (
              <Card
                key={role.slug}
                hoverable
                accentBorder={
                  role.track === 'TECHNICAL' ? 'orange' : role.track === 'NON_TECHNICAL' ? 'rose' : 'yellow'
                }
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={role.track === 'TECHNICAL' ? 'default' : 'yellow'}>
                      {role.track.replace(/_/g, ' ')}
                    </Badge>
                    <span className="text-xs font-bold text-brand-ink/60">{role.growthRate}</span>
                  </div>

                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60">
                    {role.category}
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase text-brand-ink mt-0.5 mb-2">
                    {role.title}
                  </h3>
                  <p className="text-xs text-brand-ink/80 font-medium line-clamp-3 mb-4 leading-relaxed">
                    {role.shortDesc}
                  </p>

                  <div className="text-xs font-semibold text-brand-ink/70 mb-3">
                    Benchmark Salary: <strong className="text-brand-ink">{role.averageSalary}</strong>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-3 border-t border-brand-ink/10">
                    {role.requiredSkills.slice(0, 4).map((s) => (
                      <span key={s.name} className="text-[10px] font-semibold px-2 py-0.5 bg-brand-cream border border-brand-ink/20 text-brand-ink">
                        {s.name} ({s.level})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-ink/20 flex gap-2">
                  <Link href={ROUTES.public.careerDetail(role.slug)} className="w-full">
                    <Button variant="outline" size="sm" fullWidth>
                      View Blueprint
                    </Button>
                  </Link>
                  <Link href={journeyHref} className="w-full">
                    <Button variant="primary" size="sm" fullWidth>
                      {isAuthenticated ? 'Dashboard →' : 'Start Journey →'}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-brand-cream border-t-[1.5px] border-brand-ink py-8 px-4 text-center text-xs font-semibold text-brand-ink/70">
        Learn-2-Hire 2.0 &bull; Career Atlas
      </footer>
    </div>
  );
}
