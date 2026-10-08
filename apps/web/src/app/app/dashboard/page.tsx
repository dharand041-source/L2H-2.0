'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  TrendingUp,
  CheckSquare,
  BookOpen,
  Terminal,
  FolderGit2,
  Mic,
  FileText,
  Briefcase,
  Kanban,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Target,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Award
} from 'lucide-react';
import { useCandidateState, getNextBestAction } from '@/lib/data/state-store';
import { getCareerBySlug } from '@/lib/data/careers-data';
import { OPPORTUNITIES_CATALOG, getOpportunitiesByRole, calculateExplainableMatch } from '@/lib/data/opportunities-data';
import { getRecommendedNextChallenge } from '@/lib/practice';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/ui/progress-ring';

export default function DashboardPage() {
  const { state } = useCandidateState();
  const currentRole = getCareerBySlug(state.targetCareerSlug);
  const nextAction = getNextBestAction(state);

  // Top critical skills with gaps (strictly deduplicated by skill name)
  const skillsMap = new Map();
  state.skills.forEach((s) => {
    if (s && s.name && !skillsMap.has(s.name.toLowerCase().trim())) {
      skillsMap.set(s.name.toLowerCase().trim(), s);
    }
  });
  const uniqueSkills = Array.from(skillsMap.values());
  const criticalSkills = uniqueSkills.filter(s => s.priority === 'CRITICAL' || s.priority === 'HIGH');

  // Matched Opportunities: Filter out jobs already applied to and prioritize active career role
  const appliedOpportunityIds = new Set(state.applications.map(a => a.opportunityId));
  const roleOpportunities = getOpportunitiesByRole(state.targetCareerSlug, 'FULL_TIME').allRanked
    .filter((job) => !appliedOpportunityIds.has(job.id));
  const matchedJobs = (roleOpportunities.length > 0
    ? roleOpportunities
    : OPPORTUNITIES_CATALOG.filter((job) => !appliedOpportunityIds.has(job.id))
  ).slice(0, 3);

  return (
    <div className="space-y-8" suppressHydrationWarning>
      {/* ====================================================================
          1. TOP NEXT BEST ACTION BANNER (Dynamic Intelligence Engine)
      ==================================================================== */}
      <section className="bg-brand-ink text-brand-paper border-[1.5px] border-brand-ink p-4 sm:p-6 lg:p-8 shadow-editorial relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 lg:gap-6 relative z-10">
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="editorial-badge bg-brand-orange text-white text-[10px] sm:text-xs">
                Next Best Action
              </span>
              <span className="text-xs font-mono text-brand-yellow font-bold uppercase tracking-wider">
                {nextAction.stageLabel}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-white break-words">
              {nextAction.title}
            </h1>
            <p className="text-xs sm:text-sm text-brand-paper/80 max-w-2xl font-normal leading-relaxed">
              {nextAction.description}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 w-full sm:w-auto">
            <Link href={nextAction.ctaUrl} className="w-full sm:w-auto">
              <Button variant="accent" size="lg" className="w-full sm:w-auto whitespace-nowrap">
                {nextAction.ctaText} <ArrowRight className="ml-2 w-4 h-4 inline" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. CANDIDATE TELEMETRY & HERO SNAPSHOT (Responsive 4-Card System)
      ==================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Target Career */}
        <Card accentBorder="orange" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60">
                Target Occupation
              </span>
              <Target className="w-4 h-4 text-brand-orange" />
            </div>
            <div className="font-display text-2xl font-bold uppercase text-brand-ink truncate">
              {currentRole ? currentRole.title : 'Full-Stack Developer'}
            </div>
            <div className="text-xs font-semibold text-brand-ink/70 mt-1">
              Track: <span className="font-bold text-brand-ink">{currentRole?.track || 'TECHNICAL'}</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-brand-ink/10 flex items-center justify-between">
            <Link href={ROUTES.app.career.goals} className="text-xs font-bold uppercase text-brand-orange hover:underline flex items-center gap-1">
              Manage Goal <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        {/* Card 2: Overall Role Readiness */}
        <Card accentBorder="yellow" className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60">
                Role Readiness
              </span>
              <div className="font-display text-2xl sm:text-3xl font-bold text-brand-ink mt-1">
                {state.assessmentScore !== undefined ? `${state.readinessScore}%` : 'NOT ASSESSED'}
              </div>
              <div className="text-xs font-semibold text-brand-ink/70 mt-0.5">
                {state.assessmentScore !== undefined ? 'Calibrated Competency' : 'Complete baseline assessment'}
              </div>
            </div>
            {state.assessmentScore !== undefined ? (
              <ProgressRing
                progress={state.readinessScore}
                size={64}
                strokeWidth={6}
                color="#EFB11D"
                showValue={false}
                centerIcon={<TrendingUp className="w-5 h-5 text-brand-yellow" />}
              />
            ) : (
              <div className="w-12 h-12 rounded-full border border-brand-ink/30 bg-brand-cream flex items-center justify-center">
                <Target className="w-5 h-5 text-brand-orange" />
              </div>
            )}
          </div>
          <div className="mt-4 pt-3 border-t border-brand-ink/10 flex items-center justify-between">
            <Link href={ROUTES.app.skills.analysis} className="text-xs font-bold uppercase text-brand-orange hover:underline flex items-center gap-1">
              View Skill Gaps <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        {/* Card 3: Active Project Milestone */}
        <Card accentBorder="rose" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60">
                Portfolio Proof
              </span>
              <FolderGit2 className="w-4 h-4 text-brand-rose" />
            </div>
            <div className="font-display text-xl font-bold uppercase text-brand-ink truncate">
              {state.targetCareerSlug === 'frontend-developer' && (!state.activeProject || state.activeProject.title.includes('Booking'))
                ? 'Interactive Design System & UI'
                : (state.activeProject?.title || 'Interactive Design System')}
            </div>
            <div className="text-xs font-semibold text-brand-ink/70 mt-1">
              Milestone: <strong className="text-brand-rose">{state.activeProject?.milestoneCurrent ?? 0}</strong> / {state.activeProject?.milestoneTotal || 4} Completed
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-brand-ink/10 flex items-center justify-between">
            <Link href={ROUTES.app.projects.home} className="text-xs font-bold uppercase text-brand-rose hover:underline flex items-center gap-1">
              Project Hub <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>

        {/* Card 4: Resume Readiness Gate */}
        <Card accentBorder="pink" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/60">
                Resume Gate
              </span>
              <FileText className="w-4 h-4 text-brand-pink" />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={state.resume.status === 'READY' ? 'yellow' : 'rose'}>
                {state.resume.status.replace(/_/g, ' ')}
              </Badge>
              <span className="font-display text-xl font-bold text-brand-ink">
                {state.resume.compatibilityScore}%
              </span>
            </div>
            <div className="text-xs font-semibold text-brand-ink/70 mt-1">
              ATS Compatibility Estimate
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-brand-ink/10 flex items-center justify-between">
            <Link href={ROUTES.app.resume.home} className="text-xs font-bold uppercase text-brand-orange hover:underline flex items-center gap-1">
              ATS Optimizer <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </Card>
      </div>

      {/* ====================================================================
          3. MAIN COCKPIT SECTION: SKILL GAPS & LEARNING ROADMAP
      ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Skill Differential Matrix */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border-[1.5px] border-brand-ink bg-brand-paper p-6 shadow-editorial">
            <div className="flex items-center justify-between pb-4 border-b border-brand-ink/20 mb-5">
              <div>
                <span className="editorial-badge bg-brand-rose text-white text-[10px] mb-1">
                  Diagnostic Evidence
                </span>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink">
                  Priority Skill Gaps
                </h2>
              </div>
              <Link href={ROUTES.app.skills.analysis}>
                <Button variant="outline" size="sm">
                  Deep Skill Analyzer →
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {criticalSkills.length === 0 ? (
                <div className="p-4 bg-brand-cream border border-brand-ink/20 text-center text-xs font-bold text-brand-ink/70">
                  No critical gaps identified! Take an assessment to calibrate your capabilities.
                </div>
              ) : (
                criticalSkills.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-3.5 bg-brand-cream border border-brand-ink/30 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-brand-ink">{skill.name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-brand-paper border border-brand-ink text-brand-ink">
                          Gap: {skill.gap} Level{skill.gap > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="text-xs text-brand-ink/70 mt-0.5 font-medium">
                        Current: <strong className="text-brand-ink">{skill.currentLevel}</strong> · Target: <strong className="text-brand-orange">{skill.requiredLevel}</strong> · Confidence: {Math.round(skill.confidence * 100)}%
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link href={ROUTES.app.learning.roadmap}>
                        <Button variant="primary" size="sm" className="text-[11px] py-1">
                          Bridge Gap
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-brand-ink/10 flex items-center justify-between text-xs">
              <span className="text-brand-ink/70 font-semibold">
                Baseline Assessment Score: <strong className="text-brand-ink">{state.assessmentScore !== undefined ? `${state.assessmentScore}%` : 'NOT ASSESSED'}</strong>
              </span>
              <Link href={ROUTES.app.assessments.baseline} className="font-bold text-brand-orange hover:underline">
                {state.assessmentScore !== undefined ? 'Retake Diagnostic →' : 'Take Baseline Diagnostic →'}
              </Link>
            </div>
          </div>

          {/* Next Recommended Role Practice Card (Step 43) */}
          {(() => {
            const nextPrac = getRecommendedNextChallenge(state.targetCareerSlug, state.skills);
            if (!nextPrac) return null;
            return (
              <div className="border-[1.5px] border-brand-ink bg-brand-cream p-5 shadow-editorial space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="editorial-badge bg-brand-orange text-white text-[10px]">
                      Next Recommended Practice
                    </span>
                    <span className="text-xs font-mono font-bold uppercase text-brand-ink">
                      {currentRole?.title || 'Target Role'}
                    </span>
                  </div>
                  <Badge variant="default">{nextPrac.difficulty}</Badge>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold uppercase text-brand-ink">
                    {nextPrac.title}
                  </h3>
                  <p className="text-xs text-brand-ink/80 mt-1 line-clamp-2">
                    {nextPrac.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-brand-ink/20">
                  <div className="text-xs font-mono text-brand-ink/70">
                    Skill Gap Target: <strong className="text-brand-orange">{nextPrac.skillName}</strong> ({nextPrac.targetLevel})
                  </div>
                  <Link
                    href={`/app/practice/role?challengeId=${encodeURIComponent(
                      nextPrac.id
                    )}&category=${encodeURIComponent(nextPrac.categoryId)}`}
                  >
                    <Button variant="primary" size="sm">
                      Start Practice →
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })()}

          {/* Quick Action Matrix for Connected System */}
          <div className="border-[1.5px] border-brand-ink bg-brand-paper p-6 shadow-editorial">
            <h3 className="font-display text-xl font-bold uppercase tracking-tight text-brand-ink mb-4">
              Connected Career System Hub
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Link href={ROUTES.app.career.discover} className="p-3 bg-brand-cream border border-brand-ink/30 hover:border-brand-ink hover:bg-brand-paper transition-all group">
                <Compass className="w-5 h-5 text-brand-orange mb-1 group-hover:scale-110 transition-transform" />
                <div className="font-display text-sm uppercase font-bold text-brand-ink">Careers Atlas</div>
                <div className="text-[10px] text-brand-ink/70">22+ Standard Roles</div>
              </Link>

              <Link href={ROUTES.app.assessments.home} className="p-3 bg-brand-cream border border-brand-ink/30 hover:border-brand-ink hover:bg-brand-paper transition-all group">
                <CheckSquare className="w-5 h-5 text-brand-rose mb-1 group-hover:scale-110 transition-transform" />
                <div className="font-display text-sm uppercase font-bold text-brand-ink">Assessments</div>
                <div className="text-[10px] text-brand-ink/70">Calibrated Testing</div>
              </Link>

              <Link href={ROUTES.app.learning.home} className="p-3 bg-brand-cream border border-brand-ink/30 hover:border-brand-ink hover:bg-brand-paper transition-all group">
                <BookOpen className="w-5 h-5 text-brand-pink mb-1 group-hover:scale-110 transition-transform" />
                <div className="font-display text-sm uppercase font-bold text-brand-ink">Learning Hub</div>
                <div className="text-[10px] text-brand-ink/70">Open Free Curricula</div>
              </Link>

              <Link href={ROUTES.app.practice.home} className="p-3 bg-brand-cream border border-brand-ink/30 hover:border-brand-ink hover:bg-brand-paper transition-all group">
                <Terminal className="w-5 h-5 text-brand-yellow mb-1 group-hover:scale-110 transition-transform" />
                <div className="font-display text-sm uppercase font-bold text-brand-ink">Practice Arena</div>
                <div className="text-[10px] text-brand-ink/70">Coding &amp; SQL Sandbox</div>
              </Link>

              <Link href={ROUTES.app.interview.home} className="p-3 bg-brand-cream border border-brand-ink/30 hover:border-brand-ink hover:bg-brand-paper transition-all group">
                <Mic className="w-5 h-5 text-brand-orange mb-1 group-hover:scale-110 transition-transform" />
                <div className="font-display text-sm uppercase font-bold text-brand-ink">Interview Sim</div>
                <div className="text-[10px] text-brand-ink/70">Reported Patterns</div>
              </Link>

              <Link href={ROUTES.app.improve.home} className="p-3 bg-brand-cream border border-brand-ink/30 hover:border-brand-ink hover:bg-brand-paper transition-all group">
                <RefreshCw className="w-5 h-5 text-brand-rose mb-1 group-hover:scale-110 transition-transform" />
                <div className="font-display text-sm uppercase font-bold text-brand-ink">Improvement Loop</div>
                <div className="text-[10px] text-brand-ink/70">Retrain &amp; Reassess</div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Opportunities & Application Pipeline */}
        <div className="lg:col-span-5 space-y-6">
          {/* Matched Opportunities Feed */}
          <div className="border-[1.5px] border-brand-ink bg-brand-paper p-6 shadow-editorial">
            <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20 mb-4">
              <div>
                <span className="editorial-badge bg-brand-yellow text-brand-ink text-[10px] mb-1">
                  Explainable Matching
                </span>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-brand-ink">
                  Matched Opportunities
                </h3>
              </div>
              <Link href={ROUTES.app.opportunities.jobs}>
                <Button variant="ghost" size="sm" className="text-xs">
                  View All ({OPPORTUNITIES_CATALOG.length}) →
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {matchedJobs.map((job) => {
                const matchResult = calculateExplainableMatch(job, state.skills, state.targetCareerSlug);
                const isExact = job.roleSlug === state.targetCareerSlug;
                const matchPct = state.assessmentScore !== undefined
                  ? matchResult.overallScore
                  : null;

                return (
                  <div
                    key={job.id}
                    className="p-3.5 bg-brand-cream border border-brand-ink/30 hover:border-brand-ink transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-ink/60">
                            {job.companyName}
                          </span>
                          {isExact && (
                            <Badge variant="yellow" className="text-[8px] py-0 px-1 font-bold">
                              EXACT ROLE
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-brand-ink line-clamp-1">
                          {job.title}
                        </h4>
                        <div className="text-xs text-brand-ink/70 mt-1">
                          {job.location} · {job.employmentType}
                        </div>
                      </div>
                      <Badge variant="yellow" className="shrink-0 font-bold">
                        {matchPct !== null ? `${matchPct}% Match` : 'Baseline Needed'}
                      </Badge>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-brand-ink/10 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-brand-ink/60">
                        {job.lastVerifiedAt}
                      </span>
                      <Link
                        href={ROUTES.app.opportunities.detail(job.id)}
                        className="font-bold text-brand-orange hover:underline flex items-center gap-1"
                      >
                        Check Eligibility <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Applications Pipeline Status */}
          <div className="border-[1.5px] border-brand-ink bg-brand-paper p-6 shadow-editorial">
            <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20 mb-4">
              <h3 className="font-display text-xl font-bold uppercase tracking-tight text-brand-ink">
                Application Pipeline
              </h3>
              <Link href={ROUTES.app.applications.kanban}>
                <Button variant="outline" size="sm" className="text-xs">
                  Kanban Board →
                </Button>
              </Link>
            </div>

            <div className="space-y-2.5">
              {state.applications.length === 0 ? (
                <div className="p-4 bg-brand-cream border border-brand-ink/20 text-center space-y-2">
                  <span className="text-xs font-bold text-brand-ink/70 block">No Active Applications Yet</span>
                  <p className="text-[11px] text-brand-ink/60">
                    Apply directly to verified listings to track progress in your Kanban pipeline.
                  </p>
                  <Link href={ROUTES.app.opportunities.jobs}>
                    <Button variant="primary" size="sm" className="text-xs mt-1">
                      Explore Matched Jobs &rarr;
                    </Button>
                  </Link>
                </div>
              ) : (
                state.applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-3 bg-brand-cream border border-brand-ink/30 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-brand-ink">{app.title}</div>
                      <div className="text-[10px] text-brand-ink/70">{app.company} · Applied: {app.appliedDate}</div>
                    </div>
                    <Badge variant={app.status === 'APPLIED' ? 'default' : 'yellow'}>
                      {app.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
