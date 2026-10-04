'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { ROUTES } from '@/lib/routes';
import { EditorialNav } from '@/components/layout/editorial-nav';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PublicCareerDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const role = getCareerBySlug(slug);

  if (!role) {
    return (
      <div className="min-h-screen bg-brand-cream text-brand-ink flex flex-col">
        <EditorialNav />
        <main className="flex-1 py-20 text-center space-y-4">
          <div className="w-12 h-12 bg-brand-rose text-white rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="font-display text-3xl uppercase text-brand-ink">Career Role Not Found</h1>
          <Link href={ROUTES.public.careers}>
            <Button variant="primary">Return to Career Atlas</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink flex flex-col bg-grid-subtle">
      <EditorialNav />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20">
            <Link href={ROUTES.public.careers} className="text-xs font-bold uppercase text-brand-ink flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Back to Career Atlas
            </Link>
            <Badge variant={role.track === 'TECHNICAL' ? 'default' : 'yellow'}>{role.track}</Badge>
          </div>

          <div className="bg-brand-paper border-[1.5px] border-brand-ink p-8 shadow-editorial space-y-4">
            <span className="editorial-badge bg-brand-yellow text-brand-ink text-xs">{role.category}</span>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              {role.title}
            </h1>
            <p className="text-base text-brand-ink/90 font-medium leading-relaxed max-w-3xl">
              {role.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-brand-ink/80 border-t border-brand-ink/10">
              <div>Salary Benchmark: <strong className="text-brand-ink">{role.averageSalary}</strong></div>
              <div>&bull;</div>
              <div>Growth Rate: <strong className="text-brand-orange">{role.growthRate}</strong></div>
              <div>&bull;</div>
              <div>Complexity: <strong>{role.complexity}</strong></div>
            </div>

            <div className="pt-4 flex gap-3">
              <Link href={ROUTES.auth.signup}>
                <Button variant="primary" size="lg">
                  Start Your Journey into {role.title} →
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-4">
              <h2 className="font-display text-2xl font-bold uppercase text-brand-ink pb-2 border-b border-brand-ink/20">
                Core Responsibilities
              </h2>
              <div className="space-y-2">
                {role.responsibilities.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs font-medium text-brand-ink leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial space-y-4">
              <h2 className="font-display text-2xl font-bold uppercase text-brand-ink pb-2 border-b border-brand-ink/20">
                Required Competencies
              </h2>
              <div className="space-y-2.5">
                {role.requiredSkills.map((s) => (
                  <div key={s.name} className="p-2.5 bg-brand-cream border border-brand-ink/20 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold">{s.name}</span>
                      <Badge variant="yellow">{s.level}</Badge>
                    </div>
                    <p className="text-[11px] text-brand-ink/75">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-brand-cream border-t-[1.5px] border-brand-ink py-8 px-4 text-center text-xs font-semibold text-brand-ink/70">
        Learn-2-Hire 2.0 &bull; Public Career Specification
      </footer>
    </div>
  );
}
