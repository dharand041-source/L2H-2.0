'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  Layers, 
  ShieldCheck, 
  Briefcase, 
  Sparkles, 
  RefreshCw, 
  Cpu, 
  BarChart3, 
  Users, 
  Megaphone,
  Terminal,
  BookOpen,
  Award,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { EditorialNav } from '../components/layout/editorial-nav';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Metric } from '../components/ui/metric';
import { ProgressRing } from '../components/ui/progress-ring';

interface LoopStage {
  step: string;
  title: string;
  tag: string;
  accentColor: string;
  bgTag: string;
  lead: string;
  exampleData: any;
  nextAction: string;
}

export default function HomePage() {
  const [activeLoopIndex, setActiveLoopIndex] = useState(0);

  const loopStages: LoopStage[] = [
    {
      step: '01',
      title: 'DISCOVER',
      tag: 'Career Goal & Taxonomy',
      accentColor: 'border-t-brand-orange',
      bgTag: 'bg-brand-paper',
      lead: 'Target your exact occupation backed by ESCO & O*NET standards.',
      exampleData: {
        targetRole: 'Full Stack Developer',
        track: 'Technical Track',
        averageSalary: '$105,000 / year',
        requiredCompetencies: ['JavaScript (L4)', 'React (L3)', 'Node.js (L3)', 'SQL (L3)', 'Docker (L2)'],
      },
      nextAction: 'Calibrate baseline capabilities without guesswork.'
    },
    {
      step: '02',
      title: 'ASSESS',
      tag: 'Adaptive Diagnostics',
      accentColor: 'border-t-brand-rose',
      bgTag: 'bg-brand-rose text-white',
      lead: 'Non-repetitive calibrated diagnostic tests evaluate true capability from L0 to L5.',
      exampleData: {
        assessmentTaken: 'Full Stack Baseline Diagnostic',
        questionsCount: '15 Questions (Coding, SQL, Multi-Select)',
        calibratedLevels: 'JavaScript: L3 · React: L2 · Node.js: L1 · SQL: L2',
        diagnosticVerdict: 'Strong foundational logic. Asynchronous backend gaps identified.'
      },
      nextAction: 'Pass diagnostic data to the Weighted Skill Analyzer.'
    },
    {
      step: '03',
      title: 'ANALYZE',
      tag: 'Weighted Gap Engine',
      accentColor: 'border-t-brand-rose',
      bgTag: 'bg-brand-rose text-white',
      lead: 'Calculates exact step differentials (Required vs. Current) with confidence scoring.',
      exampleData: {
        priorityGaps: [
          { skill: 'Node.js', current: 'L1', target: 'L3', gap: '2 Levels (Critical)' },
          { skill: 'React', current: 'L2', target: 'L3', gap: '1 Level (High)' },
          { skill: 'SQL & DBs', current: 'L2', target: 'L3', gap: '1 Level (Medium)' }
        ],
        readinessScore: 68
      },
      nextAction: 'Synthesize remedial curriculum DAG.'
    },
    {
      step: '04',
      title: 'LEARN',
      tag: 'Open Curricula Hub',
      accentColor: 'border-t-brand-pink',
      bgTag: 'bg-brand-pink text-brand-ink',
      lead: 'Directed open learning resources from freeCodeCamp, MDN, CS50, and SQLBolt.',
      exampleData: {
        activeModules: [
          { provider: 'freeCodeCamp', course: 'Node.js & Express Microservices', duration: '14 hrs' },
          { provider: 'MDN Web Docs', course: 'Deep Dive: Event Loop & Async Streams', duration: '2 hrs' },
          { provider: 'SQLBolt', course: 'Relational Aggregations & Joins', duration: '3 hrs' }
        ]
      },
      nextAction: 'Reinforce learned concepts in live challenge runner.'
    },
    {
      step: '05',
      title: 'PRACTICE',
      tag: 'Interactive Arena',
      accentColor: 'border-t-brand-yellow',
      bgTag: 'bg-brand-yellow text-brand-ink',
      lead: 'In-browser code execution, SQL query tester, and company-pattern problem sets.',
      exampleData: {
        activeChallenge: 'REST API Rate-Limiter Middleware',
        category: 'Backend Architecture',
        passRate: '12 / 12 Test Cases Passed',
        efficiencyScore: '42ms Execution (Top 10%)'
      },
      nextAction: 'Transition into verified milestone-based portfolio project.'
    },
    {
      step: '06',
      title: 'BUILD & PROVE',
      tag: 'Verified Skill Proof',
      accentColor: 'border-t-brand-orange',
      bgTag: 'bg-brand-orange text-white',
      lead: 'Develop real-world software with GitHub commits, live URL deployment, and rubric scoring.',
      exampleData: {
        projectTitle: 'Distributed Event Booking Service',
        verifiedArtifacts: 'GitHub Repository + Vercel Deployment',
        rubricEvaluation: '94 / 100 (Architecture, Security, Test Coverage)',
        skillEvidenceCreated: 'Node.js Level upgraded from L1 to L3 · Verified Proof'
      },
      nextAction: 'Simulate high-stakes enterprise interview rounds.'
    },
    {
      step: '07',
      title: 'PREPARE & MATCH',
      tag: 'Company Patterns & Opportunities',
      accentColor: 'border-t-brand-ink',
      bgTag: 'bg-brand-ink text-brand-paper',
      lead: 'Mock interview simulator calibrated to reported patterns (TCS, Zoho, Amazon) + Direct apply.',
      exampleData: {
        interviewScorecard: '88% Communication · 92% Technical Accuracy',
        matchedOpportunity: 'Apex Media & Cloud Labs · Junior Full Stack Dev',
        eligibilityVerdict: '91% Match Score · All Core Requirements Satisfied',
        applicationMethod: 'Direct External Application with Audit Trail'
      },
      nextAction: 'Track in Kanban and automatically remediate any feedback.'
    }
  ];

  const featuredOccupations = [
    { 
      role: 'Full Stack Developer', 
      category: 'Software Engineering', 
      track: 'TECHNICAL', 
      icon: Cpu, 
      salary: '$105k', 
      skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
      demand: 'Very High' 
    },
    { 
      role: 'Data Scientist', 
      category: 'Data & AI', 
      track: 'TECHNICAL', 
      icon: BarChart3, 
      salary: '$118k', 
      skills: ['Python', 'SQL', 'Machine Learning', 'Pandas'],
      demand: 'Very High' 
    },
    { 
      role: 'Associate Product Manager', 
      category: 'Product & Design', 
      track: 'HYBRID', 
      icon: Layers, 
      salary: '$92k', 
      skills: ['PRD Writing', 'Roadmapping', 'User Research', 'Figma'],
      demand: 'High' 
    },
    { 
      role: 'Digital Marketing Specialist', 
      category: 'Marketing & Growth', 
      track: 'NON_TECHNICAL', 
      icon: Megaphone, 
      salary: '$68k', 
      skills: ['SEO Strategy', 'Content Analytics', 'Conversion Rate', 'Copywriting'],
      demand: 'High' 
    },
    { 
      role: 'Talent Acquisition Partner', 
      category: 'Operations & HR', 
      track: 'NON_TECHNICAL', 
      icon: Users, 
      salary: '$74k', 
      skills: ['Boolean Sourcing', 'Structured Interviewing', 'ATS Systems', 'Offer Negotiation'],
      demand: 'Steady' 
    },
    { 
      role: 'UI/UX Product Designer', 
      category: 'Product & Design', 
      track: 'HYBRID', 
      icon: Sparkles, 
      salary: '$89k', 
      skills: ['Design Systems', 'Design Tokens', 'User Heuristics', 'Prototyping'],
      demand: 'High' 
    },
  ];

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink flex flex-col bg-grid-subtle">
      <EditorialNav />

      <main className="flex-1">
        {/* ====================================================================
            HERO SECTION: SWISS EDITORIAL COMPOSITION
        ==================================================================== */}
        <section className="relative border-b-[1.5px] border-brand-ink py-8 sm:py-14 lg:py-20 px-3 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Top metadata tags */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <span className="editorial-badge bg-brand-yellow text-brand-ink text-[10px] sm:text-xs">
                Enterprise Product Architecture
              </span>
              <span className="editorial-badge bg-brand-paper text-brand-ink text-[10px] sm:text-xs">
                Technical & Non-Technical Careers
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-ink/70 hidden sm:inline">
                Verified Skills · Open Curricula · Real Opportunities
              </span>
            </div>

            {/* Massive Display Statement */}
            <div className="border-b-[1.5px] border-brand-ink pb-6 sm:pb-10">
              <h1 className="font-display-hero text-brand-ink tracking-tight">
                LEARN. PROVE. <br />
                <span className="text-brand-orange inline-block hover:scale-[1.01] transition-transform">
                  GET HIRED.
                </span>
              </h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pt-4 sm:pt-6 items-end">
                <div className="lg:col-span-8">
                  <p className="text-base sm:text-xl lg:text-2xl text-brand-ink/90 font-normal leading-relaxed max-w-3xl">
                    The end-to-end career operating system. Measure your verified baseline, bridge precise skill gaps with open curricula, build auditable portfolio evidence, and match with legitimate job opportunities.
                  </p>
                </div>
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                  <Link href="/auth/signup" className="w-full">
                    <Button variant="primary" size="lg" fullWidth className="text-base">
                      Start Your Journey <ArrowRight className="ml-2 w-5 h-5 inline" />
                    </Button>
                  </Link>
                  <Link href="/careers" className="w-full">
                    <Button variant="outline" size="lg" fullWidth className="text-base">
                      Explore Careers Atlas
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Key Metrics Banner with Swiss 4-column Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
              <div className="border-r border-brand-ink/20 pr-4">
                <Metric label="Career Taxonomy" value="500+" subtext="ESCO & O*NET Aligned" />
              </div>
              <div className="border-r border-brand-ink/20 pr-4">
                <Metric label="Open Curricula" value="100%" subtext="FCC, MDN, CS50, SWAYAM" />
              </div>
              <div className="border-r border-brand-ink/20 pr-4">
                <Metric label="Evidence Engine" value="L0→L5" subtext="Multi-factor Calibration" />
              </div>
              <div>
                <Metric label="Reputed Companies" value="25+" subtext="Reported Interview Patterns" />
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            INTERACTIVE CLOSED-LOOP ARCHITECTURE DEMONSTRATOR
        ==================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-b-[1.5px] border-brand-ink bg-brand-paper">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="editorial-badge bg-brand-rose text-white mb-3">
                  System Architecture
                </span>
                <h2 className="font-display-h1 text-brand-ink">
                  ONE CONNECTED SYSTEM. <br />
                  <span className="text-brand-rose">NOT ISOLATED TABS.</span>
                </h2>
              </div>
              <p className="max-w-md text-sm text-brand-ink/80 mt-4 md:mt-0 font-medium">
                Click through each phase of the connected candidate loop below to inspect how real data flows seamlessly from career goal to verified employment.
              </p>
            </div>

            {/* Step Navigation Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-8">
              {loopStages.map((stage, idx) => {
                const isActive = activeLoopIndex === idx;
                return (
                  <button
                    key={stage.title}
                    onClick={() => setActiveLoopIndex(idx)}
                    className={`text-left p-3.5 border-[1.5px] transition-all duration-150 ${
                      isActive
                        ? 'bg-brand-ink text-brand-paper border-brand-ink shadow-editorial-sm -translate-y-1'
                        : 'bg-brand-cream text-brand-ink border-brand-ink hover:bg-brand-paper'
                    }`}
                  >
                    <span className="block text-[10px] font-bold uppercase tracking-widest opacity-60">
                      Phase {stage.step}
                    </span>
                    <span className="block font-display text-lg tracking-tight mt-0.5">
                      {stage.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Stage Live Walkthrough Console */}
            <div className="border-[1.5px] border-brand-ink bg-brand-cream p-6 lg:p-10 shadow-editorial">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Overview */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-4xl font-bold text-brand-orange">
                      {loopStages[activeLoopIndex].step}
                    </span>
                    <span className="editorial-badge bg-brand-paper text-brand-ink">
                      {loopStages[activeLoopIndex].tag}
                    </span>
                  </div>
                  <h3 className="font-display text-4xl font-bold uppercase tracking-tight text-brand-ink">
                    {loopStages[activeLoopIndex].title}
                  </h3>
                  <p className="text-base text-brand-ink/85 font-medium leading-relaxed">
                    {loopStages[activeLoopIndex].lead}
                  </p>
                  <div className="pt-4 border-t border-brand-ink/20">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-ink/60 block mb-1">
                      Downstream Data Flow
                    </span>
                    <p className="text-sm font-semibold text-brand-orange flex items-center gap-1.5">
                      <ChevronRight className="w-4 h-4 inline" /> {loopStages[activeLoopIndex].nextAction}
                    </p>
                  </div>
                </div>

                {/* Right Data Telemetry Mockup */}
                <div className="lg:col-span-7 bg-brand-paper border-[1.5px] border-brand-ink p-6 shadow-editorial-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-brand-ink/20 mb-4">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-brand-ink flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-brand-orange" /> Real System Output Simulator
                    </span>
                    <Badge variant="yellow">Verified Data</Badge>
                  </div>

                  {/* Dynamic Render based on active phase */}
                  {activeLoopIndex === 0 && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-brand-ink/70">Target Role:</span>
                        <span className="font-bold text-brand-ink">{loopStages[0].exampleData.targetRole}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-brand-ink/70">Industry Standard:</span>
                        <span className="text-brand-rose font-bold">ESCO #2512.1</span>
                      </div>
                      <div className="pt-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-ink/70 block mb-2">
                          Extracted Competency Matrix:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {loopStages[0].exampleData.requiredCompetencies.map((comp: string) => (
                            <span key={comp} className="editorial-badge bg-brand-cream text-brand-ink text-xs">
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeLoopIndex === 1 && (
                    <div className="space-y-3">
                      <div className="text-sm font-semibold text-brand-ink">
                        Diagnostic Blueprint: <span className="font-bold text-brand-orange">15 Calibrated Items</span>
                      </div>
                      <div className="p-3 bg-brand-cream border border-brand-ink/30 text-xs font-mono space-y-1">
                        <div>&gt; JavaScript Lexical Closures: CORRECT (+1.0 L3)</div>
                        <div>&gt; React Reconciliation &amp; Hooks: CORRECT (+1.0 L2)</div>
                        <div>&gt; Node.js Event Loop Streams: INCORRECT (L1 Confirmed)</div>
                        <div>&gt; PostgreSQL Multi-Join: CORRECT (+1.0 L2)</div>
                      </div>
                      <div className="text-xs text-brand-ink/80 font-medium">
                        Anti-Repetition Engine: Question IDs recorded in attempt history. Will not be repeated for candidate.
                      </div>
                    </div>
                  )}

                  {activeLoopIndex === 2 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold uppercase">Role Readiness:</span>
                        <span className="font-display text-2xl text-brand-orange">68%</span>
                      </div>
                      <div className="space-y-2">
                        {loopStages[2].exampleData.priorityGaps.map((gap: any) => (
                          <div key={gap.skill} className="flex items-center justify-between p-2.5 bg-brand-cream border border-brand-ink/30 text-xs font-medium">
                            <span className="font-bold">{gap.skill}</span>
                            <span className="text-brand-ink/70">Current: {gap.current} → Target: {gap.target}</span>
                            <span className="editorial-badge bg-brand-rose text-white text-[10px]">{gap.gap}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeLoopIndex === 3 && (
                    <div className="space-y-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-ink/70 block">
                        Synthesized Learning Curriculum:
                      </span>
                      {loopStages[3].exampleData.activeModules.map((mod: any) => (
                        <div key={mod.course} className="flex items-center justify-between p-2.5 bg-brand-cream border border-brand-ink/30 text-xs">
                          <div>
                            <span className="editorial-badge bg-brand-paper text-brand-ink mr-2 text-[10px]">{mod.provider}</span>
                            <span className="font-bold">{mod.course}</span>
                          </div>
                          <span className="text-brand-ink/70 font-semibold">{mod.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeLoopIndex === 4 && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span>Challenge:</span>
                        <span className="font-bold">{loopStages[4].exampleData.activeChallenge}</span>
                      </div>
                      <div className="p-3 bg-brand-ink text-brand-yellow font-mono text-xs rounded-sm">
                        <div>PASS: test_rate_limit_token_bucket (4ms)</div>
                        <div>PASS: test_concurrent_ip_sliding_window (18ms)</div>
                        <div>PASS: test_redis_ttl_expiry (20ms)</div>
                        <div className="text-white mt-1">Status: ALL 12 VERIFIED (100% Pass Rate)</div>
                      </div>
                    </div>
                  )}

                  {activeLoopIndex === 5 && (
                    <div className="space-y-3">
                      <div className="text-sm font-semibold">
                        Milestone Deliverable: <span className="font-bold text-brand-orange">{loopStages[5].exampleData.projectTitle}</span>
                      </div>
                      <div className="p-3 bg-brand-cream border border-brand-ink/30 text-xs space-y-1.5">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-brand-orange" />
                          <span>GitHub Artifact Validated (PR #4 Merged)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-brand-orange" />
                          <span>Vercel Edge Deployment Verified</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-brand-orange" />
                          <span>Rubric Score: 94% (Skill Evidence Logged to Database)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeLoopIndex === 6 && (
                    <div className="space-y-3">
                      <div className="p-3 bg-brand-cream border border-brand-ink/30 text-xs space-y-1.5">
                        <div className="font-bold text-brand-ink text-sm">Matched: Apex Media &amp; Cloud Labs</div>
                        <div className="text-brand-ink/80">Role: Junior Full Stack Developer · Remote / Hybrid</div>
                        <div className="text-brand-orange font-bold">Eligibility Verdict: 91% Match Score (All Core Requirements Satisfied)</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="primary" size="sm" className="w-full">
                          View External Job Spec <ExternalLink className="w-3.5 h-3.5 ml-1 inline" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            CAREER SPECTRUM: TECHNICAL & NON-TECHNICAL
        ==================================================================== */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-b-[1.5px] border-brand-ink bg-brand-cream">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="editorial-badge bg-brand-yellow text-brand-ink mb-3">
                  Comprehensive Spectrum
                </span>
                <h2 className="font-display-h1 text-brand-ink">
                  BUILT FOR EVERY CAREER. <br />
                  <span className="text-brand-orange">NOT JUST CODING.</span>
                </h2>
              </div>
              <Link href="/careers">
                <Button variant="outline" size="md">
                  View Full Career Atlas →
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredOccupations.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.role} hoverable accentBorder="orange" className="flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-brand-cream border border-brand-ink flex items-center justify-center">
                          <Icon className="w-5 h-5 text-brand-orange" />
                        </div>
                        <Badge
                          variant={
                            item.track === 'TECHNICAL'
                              ? 'default'
                              : item.track === 'NON_TECHNICAL'
                              ? 'rose'
                              : 'yellow'
                          }
                        >
                          {item.track}
                        </Badge>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-ink/70">
                        {item.category}
                      </span>
                      <h4 className="font-display text-2xl font-bold uppercase mt-1 mb-2 text-brand-ink">
                        {item.role}
                      </h4>
                      <div className="text-xs font-semibold text-brand-ink/80 mb-4">
                        Average Benchmark: <span className="font-bold text-brand-ink">{item.salary}</span> · Demand: <span className="text-brand-orange font-bold">{item.demand}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.skills.map((s) => (
                          <span
                            key={s}
                            className="text-[11px] font-semibold px-2 py-0.5 bg-brand-cream border border-brand-ink/30 text-brand-ink"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-brand-ink/10 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                        Verified Roadmap Available
                      </span>
                      <ArrowRight className="w-4 h-4 text-brand-ink" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ====================================================================
            OPEN RESOURCE PARTNER ECOSYSTEM
        ==================================================================== */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-b-[1.5px] border-brand-ink bg-brand-paper">
          <div className="max-w-7xl mx-auto text-center">
            <span className="editorial-badge bg-brand-pink text-brand-ink mb-3">
              Zero Paywalls
            </span>
            <h3 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-brand-ink mb-4">
              POWERED BY THE WORLD&apos;S BEST OPEN CURRICULA
            </h3>
            <p className="text-sm font-medium text-brand-ink/70 max-w-2xl mx-auto mb-8">
              Learn-2-Hire never paywalls educational material. We organize free, high-quality open learning resources into a cohesive competency-building roadmap.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-display text-lg text-brand-ink/80">
              <span className="px-4 py-2 bg-brand-cream border border-brand-ink shadow-editorial-sm">freeCodeCamp</span>
              <span className="px-4 py-2 bg-brand-cream border border-brand-ink shadow-editorial-sm">MDN Web Docs</span>
              <span className="px-4 py-2 bg-brand-cream border border-brand-ink shadow-editorial-sm">Harvard CS50</span>
              <span className="px-4 py-2 bg-brand-cream border border-brand-ink shadow-editorial-sm">MIT OpenCourseWare</span>
              <span className="px-4 py-2 bg-brand-cream border border-brand-ink shadow-editorial-sm">NPTEL / SWAYAM</span>
              <span className="px-4 py-2 bg-brand-cream border border-brand-ink shadow-editorial-sm">SQLBolt</span>
            </div>
          </div>
        </section>

        {/* ====================================================================
            CALL TO ACTION
        ==================================================================== */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-ink text-brand-paper">
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            <span className="editorial-badge bg-brand-orange text-white mb-4">
              Join Learn-2-Hire 2.0
            </span>
            <h2 className="font-display text-5xl sm:text-7xl font-bold uppercase tracking-tight text-white mb-6">
              YOUR CAREER IS AN <br />
              <span className="text-brand-yellow">ENGINEERED SYSTEM.</span>
            </h2>
            <p className="text-lg sm:text-xl text-brand-paper/85 max-w-2xl mb-10 font-normal leading-relaxed">
              Stop submitting blind resumes to ATS black holes. Measure your competency gaps today, build tangible verified proofs, and unlock direct matched employment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
              <Link href="/auth/signup" className="w-full">
                <Button variant="primary" size="lg" fullWidth>
                  Create Free Account
                </Button>
              </Link>
              <Link href="/how-it-works" className="w-full">
                <Button variant="outline" size="lg" fullWidth className="bg-transparent text-white border-white hover:bg-white/10 hover:text-white">
                  Read Architecture Blueprint
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-brand-cream border-t-[1.5px] border-brand-ink py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-orange border border-brand-ink flex items-center justify-center font-display text-white text-lg">
              L2H
            </div>
            <span className="font-display text-xl tracking-tight text-brand-ink">
              LEARN-2-HIRE 2.0
            </span>
          </div>
          <div className="text-xs text-brand-ink/70 font-medium text-center md:text-right">
            Editorial Career Architecture · Open Resource Ecosystem · Zero Scraping Integrity
          </div>
        </div>
      </footer>
    </div>
  );
}
