import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Compass, Layers, ShieldCheck, Briefcase, Sparkles, RefreshCw, Cpu, BarChart3, Users, Megaphone } from 'lucide-react';
import { EditorialNav } from '../components/layout/editorial-nav';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Metric } from '../components/ui/metric';

export default function HomePage() {
  const loopSteps = [
    { title: 'Discover', desc: 'Map your career goal against 500+ ESCO/O*NET competencies.', color: 'bg-brand-paper', track: 'Tech & Non-Tech' },
    { title: 'Assess', desc: 'Calibrated diagnostic tests evaluate true capability from L0 to L5.', color: 'bg-brand-rose text-white', track: 'Non-Repetitive' },
    { title: 'Learn', desc: 'Personalized DAG roadmap utilizing open courses (FCC, MDN, CS50).', color: 'bg-brand-pink', track: 'Free Resources' },
    { title: 'Practice', desc: 'Live code runner, SQL playground, and role-specific case studies.', color: 'bg-brand-yellow', track: 'Interactive' },
    { title: 'Build', desc: 'Develop real-world projects with GitHub verification and rubric evaluations.', color: 'bg-brand-orange text-white', track: 'Verified Evidence' },
    { title: 'Prepare', desc: 'Simulated interviews calibrated to company patterns (TCS, Zoho, Amazon).', color: 'bg-brand-paper', track: 'Role-Specific' },
    { title: 'Match & Apply', desc: 'Direct application to real opportunities with explainable eligibility.', color: 'bg-brand-ink text-white', track: 'No Blind ATS' },
    { title: 'Improve', desc: 'Rejection or weak performance feeds back into targeted retraining.', color: 'bg-brand-yellow', track: 'Closed Loop' },
  ];

  const featuredOccupations = [
    { role: 'Full Stack Developer', category: 'Software Engineering', track: 'TECHNICAL', icon: Cpu, skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'] },
    { role: 'Data Scientist', category: 'Data & AI', track: 'TECHNICAL', icon: BarChart3, skills: ['Python', 'SQL', 'Machine Learning', 'Pandas'] },
    { role: 'Associate Product Manager', category: 'Product & Design', track: 'HYBRID', icon: Layers, skills: ['PRD Writing', 'Roadmapping', 'User Research', 'Figma'] },
    { role: 'Digital Marketing Specialist', category: 'Marketing & Growth', track: 'NON_TECHNICAL', icon: Megaphone, skills: ['SEO', 'Content Strategy', 'Funnel Analytics', 'Copywriting'] },
    { role: 'Talent Acquisition Partner', category: 'Operations & HR', track: 'NON_TECHNICAL', icon: Users, skills: ['Boolean Sourcing', 'Structured Interviewing', 'ATS', 'Offer Mgmt'] },
  ];

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink flex flex-col">
      <EditorialNav />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative border-b-[1.5px] border-brand-ink py-16 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            {/* Editorial Headline */}
            <div className="flex flex-col space-y-4">
              <div className="inline-flex items-center gap-2">
                <span className="editorial-badge bg-brand-yellow text-brand-ink">
                  Production Career Infrastructure
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-ink/70">
                  Technical & Non-Technical Tracks
                </span>
              </div>

              <h1 className="font-display-hero text-brand-ink uppercase tracking-tight">
                LEARN. PROVE. <br />
                <span className="text-brand-orange">GET HIRED.</span>
              </h1>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 items-end">
                <div className="lg:col-span-8">
                  <p className="text-xl sm:text-2xl text-brand-ink/90 font-medium leading-relaxed max-w-3xl">
                    Learn-2-Hire is the end-to-end career operating system. Measure your verified baseline, bridge precise skill gaps with open curricula, build auditable portfolio evidence, and match with legitimate job opportunities.
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
                      Explore Careers
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* KEY METRICS EDITORIAL BANNER */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t-[1.5px] border-brand-ink">
              <Metric label="Career Taxonomy" value="500+" subtext="ESCO & O*NET Aligned" />
              <Metric label="Open Curricula" value="100%" subtext="freeCodeCamp, MDN, CS50" />
              <Metric label="Evidence Engine" value="L0→L5" subtext="Multi-factor Calibration" />
              <Metric label="Reputed Companies" value="25+" subtext="Reported Interview Patterns" />
            </div>
          </div>
        </section>

        {/* SECTION 2: THE CONNECTED CLOSED-LOOP SYSTEM */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-b-[1.5px] border-brand-ink bg-brand-paper">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="editorial-badge bg-brand-rose text-white mb-3">
                  Architecture Principle
                </span>
                <h2 className="font-display-h1 text-brand-ink">
                  ONE CONNECTED SYSTEM. <br />
                  <span className="text-brand-rose">NOT ISOLATED TABS.</span>
                </h2>
              </div>
              <p className="max-w-md text-sm text-brand-ink/80 mt-4 md:mt-0 font-medium">
                Every stage in Learn-2-Hire directly feeds the next. A weakness in an interview re-trains your practice roadmap. An achieved project updates your verified job eligibility.
              </p>
            </div>

            {/* Loop Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {loopSteps.map((step, idx) => (
                <div
                  key={step.title}
                  className={`border-[1.5px] border-brand-ink p-6 shadow-editorial relative flex flex-col justify-between ${step.color}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-display text-3xl font-bold opacity-40">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border border-brand-ink bg-brand-paper text-brand-ink">
                        {step.track}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-bold uppercase mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-90">
                      {step.desc}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-brand-ink/20 flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                    Stage {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: TECHNICAL & NON-TECHNICAL SPECTRUM */}
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
                      <h4 className="font-display text-2xl font-bold uppercase mt-1 mb-3 text-brand-ink">
                        {item.role}
                      </h4>
                      <div className="flex flex-wrap gap-1.5 mt-3">
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
                        Verified Roadmap Ready
                      </span>
                      <ArrowRight className="w-4 h-4 text-brand-ink" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 4: CALL TO ACTION */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-ink text-brand-paper border-b-[1.5px] border-brand-ink">
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            <span className="editorial-badge bg-brand-orange text-white mb-4">
              Get Started Free
            </span>
            <h2 className="font-display text-5xl sm:text-7xl font-bold uppercase tracking-tight text-white mb-6">
              YOUR CAREER IS AN <br />
              <span className="text-brand-yellow">ENGINEERED SYSTEM.</span>
            </h2>
            <p className="text-lg sm:text-xl text-brand-paper/80 max-w-2xl mb-10 font-normal">
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
                  Read Master Blueprint
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
