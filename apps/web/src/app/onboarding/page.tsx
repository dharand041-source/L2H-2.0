'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Target,
  User,
  GraduationCap,
  Briefcase,
  Layers
} from 'lucide-react';
import { CAREER_ROLES_CATALOG } from '@/lib/data/careers-data';
import { useCandidateState } from '@/lib/data/state-store';
import { ROUTES } from '@/lib/routes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

export default function OnboardingWizardPage() {
  const router = useRouter();
  const { state, updateState, setTargetRole } = useCandidateState();

  const [step, setStep] = useState(1);

  // Form Fields
  const [candidateName, setCandidateName] = useState(state.user.name || '');
  const [education, setEducation] = useState('B.Tech / B.S. in Computer Science');
  const [experienceLevel, setExperienceLevel] = useState('0-2 Years (Junior / Entry Level)');
  const [currentSkills, setCurrentSkills] = useState('JavaScript, HTML/CSS, Git');
  const [workType, setWorkType] = useState('REMOTE_OR_HYBRID');
  const [selectedRoleSlug, setSelectedRoleSlug] = useState('full-stack-developer');

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Final Step: Target Career Selection!
      setTargetRole(selectedRoleSlug);
      updateState((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          name: candidateName.trim() || prev.user.name,
        },
        stage: 'CAREER_SELECTED',
      }));

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: roleData } = await supabase
            .from('career_roles')
            .select('id')
            .eq('slug', selectedRoleSlug)
            .maybeSingle();

          await supabase.from('profiles').update({
            full_name: candidateName.trim() || user.user_metadata?.full_name || 'Candidate',
            target_role_id: roleData?.id || null,
          }).eq('id', user.id);
        }
      } catch (err) {
        console.error('Failed to sync onboarding target role to Supabase profile:', err);
      }

      router.push(ROUTES.app.assessments.baseline);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-ink flex flex-col justify-between p-4 sm:p-6 lg:p-8 bg-grid-subtle">
      {/* Brand Header */}
      <div className="max-w-3xl w-full mx-auto">
        <div className="flex items-center justify-between gap-2 mb-6 sm:mb-8">
          <Link href={ROUTES.public.home} className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-brand-orange border-[1.5px] border-brand-ink flex items-center justify-center font-display text-white text-xl sm:text-2xl shadow-editorial shrink-0">
              L2H
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-display text-xl sm:text-2xl tracking-tight leading-none text-brand-ink whitespace-nowrap">
                LEARN-2-HIRE
              </span>
              <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest text-brand-ink/75 mt-0.5 truncate">
                Onboarding &bull; Step {step} of 3
              </span>
            </div>
          </Link>

          <span className="editorial-badge bg-brand-yellow text-brand-ink text-[10px] sm:text-xs shrink-0 whitespace-nowrap">
            Profile Setup
          </span>
        </div>

        {/* Multi-Step Wizard Card */}
        <div className="bg-brand-paper border-[1.5px] border-brand-ink p-4 sm:p-8 md:p-10 shadow-editorial space-y-6">
          {/* STEP 1: Basic Identity & Education */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="editorial-badge bg-brand-cream text-brand-ink text-[10px] mb-2">
                  Step 1 &bull; Identity &amp; Education
                </span>
                <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-brand-ink">
                  Tell Us About Yourself
                </h1>
                <p className="text-xs text-brand-ink/70 font-medium mt-1">
                  We use your education and experience to calibrate eligibility engines and question banks.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-ink/70 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Alex Mercer"
                    className="w-full p-3 bg-brand-cream border border-brand-ink text-xs font-semibold text-brand-ink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-ink/70 mb-1">
                    Education &amp; Degree Status
                  </label>
                  <select
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full p-3 bg-brand-cream border border-brand-ink text-xs font-semibold text-brand-ink focus:outline-none"
                  >
                    <option value="B.Tech / B.S. in Computer Science">B.Tech / B.S. in Computer Science</option>
                    <option value="Information Technology / Electrical Engineering">Information Technology / Electrical</option>
                    <option value="Master of Science (M.S. / M.Tech)">Master of Science (M.S. / M.Tech)</option>
                    <option value="Self-Taught / Bootcamp Graduate">Self-Taught / Bootcamp Graduate</option>
                    <option value="Non-STEM Degree">Non-STEM Degree</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-ink/70 mb-1">
                    Professional Experience Level
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full p-3 bg-brand-cream border border-brand-ink text-xs font-semibold text-brand-ink focus:outline-none"
                  >
                    <option value="0-2 Years (Junior / Entry Level)">0-2 Years (Junior / Entry Level)</option>
                    <option value="2-4 Years (Mid-Level Developer)">2-4 Years (Mid-Level Developer)</option>
                    <option value="5+ Years (Senior / Architect)">5+ Years (Senior / Architect)</option>
                    <option value="Fresher / College Senior">Fresher / College Senior</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Current Skills & Preferences */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="editorial-badge bg-brand-cream text-brand-ink text-[10px] mb-2">
                  Step 2 &bull; Skills &amp; Work Style
                </span>
                <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-brand-ink">
                  Current Skills &amp; Interests
                </h1>
                <p className="text-xs text-brand-ink/70 font-medium mt-1">
                  List your known frameworks and preferred work format.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-ink/70 mb-1">
                    Current Skills (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={currentSkills}
                    onChange={(e) => setCurrentSkills(e.target.value)}
                    placeholder="JavaScript, React, SQL, Git"
                    className="w-full p-3 bg-brand-cream border border-brand-ink text-xs font-semibold text-brand-ink focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-ink/70 mb-1">
                    Preferred Work Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'REMOTE_OR_HYBRID', label: 'Remote / Hybrid' },
                      { id: 'ON_SITE', label: 'On-Site Office' },
                      { id: 'OPEN_TO_ANY', label: 'Any Format' },
                    ].map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => setWorkType(w.id)}
                        className={`p-3 text-xs font-bold uppercase border transition-all text-center flex items-center justify-center ${
                          workType === w.id
                            ? 'bg-brand-ink text-white border-brand-ink'
                            : 'bg-brand-cream text-brand-ink border-brand-ink/30 hover:bg-brand-paper'
                        }`}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CHOOSE YOUR TARGET CAREER (MOST CRITICAL STEP) */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="editorial-badge bg-brand-orange text-white text-[10px] mb-2">
                  Step 3 &bull; Target Career Blueprint (Crucial)
                </span>
                <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-brand-ink">
                  Choose Your Target Career
                </h1>
                <p className="text-xs text-brand-ink/70 font-medium mt-1">
                  Select your exact target occupation. Your selection will instantly configure your role-specific baseline diagnostic test.
                </p>
              </div>

              {/* Roles Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
                {CAREER_ROLES_CATALOG.map((r) => {
                  const isSelected = selectedRoleSlug === r.slug;

                  return (
                    <button
                      key={r.slug}
                      type="button"
                      onClick={() => setSelectedRoleSlug(r.slug)}
                      className={`p-4 text-left border-[1.5px] transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-brand-orange text-white border-brand-ink shadow-editorial-sm -translate-y-0.5'
                          : 'bg-brand-cream text-brand-ink border-brand-ink/40 hover:bg-brand-paper'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-white/80' : 'text-brand-ink/60'}`}>
                            {r.track}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                        <h4 className="font-display text-lg font-bold uppercase leading-tight">
                          {r.title}
                        </h4>
                      </div>
                      <div className={`text-[10px] font-semibold mt-2 ${isSelected ? 'text-white/80' : 'text-brand-ink/70'}`}>
                        Avg Benchmark: {r.averageSalary}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-brand-ink/20 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {step > 1 ? (
              <Button
                variant="outline"
                size="md"
                onClick={() => setStep(step - 1)}
                className="w-full sm:w-auto justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5 inline shrink-0" /> Previous Step
              </Button>
            ) : (
              <div className="hidden sm:block" />
            )}

            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              className="w-full sm:w-auto justify-center text-center"
            >
              {step === 3 ? (
                <span className="text-xs sm:text-sm font-bold">Lock Target Role &amp; Start Diagnostic &rarr;</span>
              ) : (
                <span>Next Step <ArrowRight className="w-4 h-4 ml-1.5 inline shrink-0" /></span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <footer className="text-center text-[11px] text-brand-ink/60 font-semibold py-4">
        Automatic progression into Baseline Diagnostic on target role confirmation.
      </footer>
    </div>
  );
}
