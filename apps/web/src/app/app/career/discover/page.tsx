'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Compass,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  BarChart3,
  Briefcase,
  CheckCircle2
} from 'lucide-react';
import { CAREER_ROLES_CATALOG, CareerRoleDetail } from '@/lib/data/careers-data';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CareerDiscoveryPage() {
  const router = useRouter();
  const { state, setTargetRole } = useCandidateState();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<'ALL' | 'TECHNICAL' | 'NON_TECHNICAL' | 'HYBRID'>('ALL');

  const filteredRoles = CAREER_ROLES_CATALOG.filter((role) => {
    const matchesSearch =
      role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.requiredSkills.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTrack = selectedTrack === 'ALL' || role.track === selectedTrack;
    return matchesSearch && matchesTrack;
  });

  const handleStartCareerJourney = (slug: string) => {
    setTargetRole(slug);
    router.push(ROUTES.app.assessments.baseline);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b-[1.5px] border-brand-ink pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="editorial-badge bg-brand-orange text-white">
                Occupational Atlas
              </span>
              <span className="text-xs font-mono text-brand-ink/70 font-bold uppercase tracking-wider">
                ESCO &amp; O*NET Standard Taxonomy
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              Career Discovery
            </h1>
            <p className="text-base text-brand-ink/80 max-w-2xl mt-1">
              Select your target occupation to calibrate your baseline diagnostic, bridge exact skill gaps with open curricula, and unlock matched employment.
            </p>
          </div>

          <Link href={ROUTES.app.career.goals}>
            <Button variant="outline" size="sm">
              My Active Career Goal →
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-4 shadow-editorial flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-brand-ink/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles, skills, or domains..."
            className="w-full pl-9 pr-4 py-2 bg-brand-cream border border-brand-ink text-xs font-semibold text-brand-ink placeholder:text-brand-ink/50 focus:outline-none focus:ring-1 focus:ring-brand-ink"
          />
        </div>

        {/* Track Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          {(['ALL', 'TECHNICAL', 'NON_TECHNICAL', 'HYBRID'] as const).map((track) => (
            <button
              key={track}
              onClick={() => setSelectedTrack(track)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all ${
                selectedTrack === track
                  ? 'bg-brand-ink text-white border-brand-ink'
                  : 'bg-brand-cream text-brand-ink border-brand-ink/40 hover:bg-brand-paper'
              }`}
            >
              {track.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => {
          const isCurrentTarget = state.targetCareerSlug === role.slug;

          return (
            <Card
              key={role.slug}
              hoverable
              accentBorder={
                role.track === 'TECHNICAL'
                  ? 'orange'
                  : role.track === 'NON_TECHNICAL'
                  ? 'rose'
                  : 'yellow'
              }
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    variant={
                      role.track === 'TECHNICAL'
                        ? 'default'
                        : role.track === 'NON_TECHNICAL'
                        ? 'rose'
                        : 'yellow'
                    }
                  >
                    {role.track.replace(/_/g, ' ')}
                  </Badge>
                  {isCurrentTarget && (
                    <span className="editorial-badge bg-brand-yellow text-brand-ink text-[10px]">
                      Active Target
                    </span>
                  )}
                </div>

                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60">
                  {role.category}
                </span>
                <h3 className="font-display text-2xl font-bold uppercase text-brand-ink mt-0.5 mb-2">
                  {role.title}
                </h3>
                <p className="text-xs text-brand-ink/80 font-medium line-clamp-2 mb-4 leading-relaxed">
                  {role.shortDesc}
                </p>

                <div className="text-xs font-semibold text-brand-ink/70 mb-3 space-y-1">
                  <div>
                    Benchmark Compensation: <strong className="text-brand-ink">{role.averageSalary}</strong>
                  </div>
                  <div>
                    Complexity: <strong className="text-brand-ink">{role.complexity}</strong> · Reliance: <strong className="text-brand-ink">{role.reliance}</strong>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-brand-ink/10">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60 block">
                    Core Competencies:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {role.requiredSkills.slice(0, 4).map((s) => (
                      <span
                        key={s.name}
                        className="text-[10px] font-bold px-1.5 py-0.5 bg-brand-cream border border-brand-ink/30 text-brand-ink"
                      >
                        {s.name} ({s.level})
                      </span>
                    ))}
                    {role.requiredSkills.length > 4 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-brand-cream text-brand-ink/70">
                        +{role.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-ink/20 space-y-2">
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => handleStartCareerJourney(role.slug)}
                >
                  Start Career Journey <ArrowRight className="ml-1.5 w-3.5 h-3.5 inline" />
                </Button>

                <Link href={ROUTES.app.career.detail(role.slug)} className="block w-full">
                  <Button variant="outline" size="sm" fullWidth>
                    Explore Blueprint &amp; Skills
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
