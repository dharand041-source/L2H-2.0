'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Target,
  BookOpen,
  Terminal,
  FolderGit2,
  Mic,
  FileText,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { getCareerBySlug, CAREER_ROLES_CATALOG } from '@/lib/data/careers-data';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CareerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const role = getCareerBySlug(slug);
  const { state, setTargetRole } = useCandidateState();

  if (!role) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 bg-brand-rose text-white rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="font-display text-3xl uppercase text-brand-ink">
          Career Blueprint Not Found
        </h1>
        <p className="text-sm text-brand-ink/70 max-w-md mx-auto">
          The requested career blueprint &quot;{slug}&quot; does not exist in our standard occupational atlas.
        </p>
        <Link href={ROUTES.app.career.discover}>
          <Button variant="primary">Return to Career Discovery</Button>
        </Link>
      </div>
    );
  }

  const handleStartCareerJourney = () => {
    setTargetRole(role.slug);
    router.push(ROUTES.app.assessments.baseline);
  };

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-brand-ink/20">
        <Link
          href={ROUTES.app.career.discover}
          className="text-xs font-bold uppercase tracking-wider text-brand-ink hover:text-brand-orange flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Career Atlas
        </Link>
        <Badge variant={role.track === 'TECHNICAL' ? 'default' : 'rose'}>
          {role.track.replace(/_/g, ' ')}
        </Badge>
      </div>

      {/* Hero Banner */}
      <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 sm:p-8 shadow-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-ink/60">
              {role.category} · ESCO Occupational Standard
            </span>
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-tight text-brand-ink">
              {role.title}
            </h1>
            <p className="text-base text-brand-ink/90 font-medium leading-relaxed max-w-3xl">
              {role.description}
            </p>

            <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-brand-ink/80">
              <div>
                Salary Benchmark: <strong className="text-brand-ink">{role.averageSalary}</strong>
              </div>
              <div>
                Growth: <strong className="text-brand-orange">{role.growthRate}</strong>
              </div>
              <div>
                Complexity: <strong className="text-brand-ink">{role.complexity}</strong>
              </div>
              <div>
                Reliance: <strong className="text-brand-ink">{role.reliance}</strong>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleStartCareerJourney}
              className="text-base"
            >
              Start Career Journey <ArrowRight className="ml-2 w-5 h-5 inline" />
            </Button>
            <p className="text-[11px] text-center text-brand-ink/60 font-semibold">
              Sets target role &amp; launches calibrated baseline diagnostic test.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Responsibilities & Required Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Responsibilities and Tasks */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink mb-4 pb-2 border-b border-brand-ink/20">
              Core Responsibilities &amp; Tasks
            </h2>
            <div className="space-y-3">
              {role.responsibilities.map((resp, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs font-medium text-brand-ink/90 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </div>
              ))}
            </div>

            <h3 className="font-display text-lg font-bold uppercase text-brand-ink mt-6 mb-3">
              Standard Daily Workflow
            </h3>
            <div className="space-y-2">
              {role.tasks.map((task, i) => (
                <div key={i} className="p-2.5 bg-brand-cream border border-brand-ink/20 text-xs font-semibold text-brand-ink">
                  &bull; {task}
                </div>
              ))}
            </div>
          </div>

          {/* Interview Topics */}
          <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial">
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-brand-ink mb-3 pb-2 border-b border-brand-ink/20">
              Interview Patterns &amp; Topics
            </h2>
            <div className="space-y-2">
              {role.interviewTopics.map((topic, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-brand-cream border border-brand-ink/20 text-xs font-semibold">
                  <span>{topic}</span>
                  <Link href={ROUTES.app.interview.home} className="text-brand-orange hover:underline text-[11px]">
                    Simulate →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Required Competency Matrix & Learning Path */}
        <div className="lg:col-span-6 space-y-6">
          {/* Required Skills Matrix */}
          <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial">
            <div className="flex items-center justify-between pb-2 border-b border-brand-ink/20 mb-4">
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink">
                Required Competencies
              </h2>
              <span className="text-xs font-bold text-brand-orange">
                Target Benchmark: L1 &ndash; L5
              </span>
            </div>

            <div className="space-y-3">
              {role.requiredSkills.map((skill) => (
                <div key={skill.name} className="p-3 bg-brand-cream border border-brand-ink/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-brand-ink">{skill.name}</span>
                    <Badge variant="yellow">{skill.level}</Badge>
                  </div>
                  <p className="text-xs text-brand-ink/75 font-medium leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Three-Stage Learning Path */}
          <div className="bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial">
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-brand-ink mb-4 pb-2 border-b border-brand-ink/20">
              Structured Learning Roadmap
            </h2>

            <div className="space-y-4">
              <div>
                <span className="editorial-badge bg-brand-cream text-brand-ink text-[10px] mb-2">
                  Stage 1 &bull; Foundations
                </span>
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  {role.beginnerPath.map((item) => (
                    <div key={item} className="p-2 bg-brand-cream border border-brand-ink/20 text-[11px] font-semibold">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="editorial-badge bg-brand-yellow text-brand-ink text-[10px] mb-2">
                  Stage 2 &bull; Core Proficiency
                </span>
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  {role.intermediatePath.map((item) => (
                    <div key={item} className="p-2 bg-brand-cream border border-brand-ink/20 text-[11px] font-semibold">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="editorial-badge bg-brand-orange text-white text-[10px] mb-2">
                  Stage 3 &bull; Advanced Mastery
                </span>
                <div className="grid grid-cols-2 gap-1.5 mt-1">
                  {role.advancedPath.map((item) => (
                    <div key={item} className="p-2 bg-brand-cream border border-brand-ink/20 text-[11px] font-semibold">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
