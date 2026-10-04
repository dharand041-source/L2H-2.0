'use client';

import { useState, useEffect } from 'react';
import { CAREER_ROLES_CATALOG, getCareerBySlug } from './careers-data';
import { ROUTES } from '../routes';
import { supabase } from '../supabase';

export type JourneyStage =
  | 'UNAUTHENTICATED'
  | 'AUTHENTICATED'
  | 'CAREER_SELECTED'
  | 'BASELINE_ASSESSMENT'
  | 'SKILL_ANALYZED'
  | 'ROADMAP_CREATED'
  | 'LEARNING_ACTIVE'
  | 'PRACTICE_ACTIVE'
  | 'REASSESSMENT_READY'
  | 'PROJECT_ACTIVE'
  | 'PROJECT_COMPLETED'
  | 'INTERVIEW_READY'
  | 'RESUME_READY'
  | 'OPPORTUNITY_READY'
  | 'ELIGIBILITY_CHECKED'
  | 'MATCHED'
  | 'APPLIED'
  | 'OUTCOME_RECORDED'
  | 'RETRAINING';

export interface UserSkillItem {
  name: string;
  currentLevel: 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  requiredLevel: 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  gap: number; // e.g. L3 - L1 = 2
  confidence: number;
  evidenceCount: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'SATISFIED';
}

export interface CandidateState {
  isLoggedIn: boolean;
  user: {
    id?: string;
    name: string;
    email: string;
    headline: string;
    avatarUrl?: string;
  };
  stage: JourneyStage;
  targetCareerSlug: string;
  readinessScore: number; // 0 - 100
  skills: UserSkillItem[];
  seenQuestionIds: string[];
  assessmentScore?: number;
  activeProject: {
    title: string;
    milestoneTotal: number;
    milestoneCurrent: number;
    githubUrl?: string;
    isCompleted: boolean;
    rubricScore?: number;
  };
  interviewScore?: number;
  resume: {
    title: string;
    status: 'NOT_READY' | 'NEEDS_IMPROVEMENT' | 'READY';
    compatibilityScore: number;
    matchedKeywords: string[];
    missingKeywords: string[];
  };
  applications: Array<{
    id: string;
    opportunityId: string;
    company: string;
    title: string;
    status: 'SAVED' | 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'REJECTED';
    appliedDate: string;
    outcomeReason?: string;
  }>;
}

const DEFAULT_STATE: CandidateState = {
  isLoggedIn: false,
  user: {
    name: '',
    email: '',
    headline: '',
  },
  stage: 'CAREER_SELECTED',
  targetCareerSlug: 'full-stack-developer',
  readinessScore: 68,
  skills: [
    { name: 'JavaScript', currentLevel: 'L3', requiredLevel: 'L4', gap: 1, confidence: 0.85, evidenceCount: 3, priority: 'HIGH' },
    { name: 'React', currentLevel: 'L2', requiredLevel: 'L3', gap: 1, confidence: 0.75, evidenceCount: 2, priority: 'HIGH' },
    { name: 'Node.js', currentLevel: 'L1', requiredLevel: 'L3', gap: 2, confidence: 0.60, evidenceCount: 1, priority: 'CRITICAL' },
    { name: 'SQL & Relational DBs', currentLevel: 'L2', requiredLevel: 'L3', gap: 1, confidence: 0.80, evidenceCount: 2, priority: 'MEDIUM' },
    { name: 'Git & GitHub', currentLevel: 'L4', requiredLevel: 'L4', gap: 0, confidence: 0.95, evidenceCount: 4, priority: 'SATISFIED' },
  ],
  seenQuestionIds: ['q-js-001', 'q-react-001', 'q-node-001', 'q-sql-001'],
  assessmentScore: 78,
  activeProject: {
    title: 'Distributed Event Booking Service',
    milestoneTotal: 4,
    milestoneCurrent: 2,
    githubUrl: '',
    isCompleted: false,
    rubricScore: 92,
  },
  interviewScore: 84,
  resume: {
    title: 'Full-Stack Developer (General)',
    status: 'READY',
    compatibilityScore: 88,
    matchedKeywords: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Git'],
    missingKeywords: ['Docker Containerization', 'Kubernetes'],
  },
  applications: [
    {
      id: 'app-001',
      opportunityId: 'opp-001',
      company: 'CloudScale Infrastructure Labs',
      title: 'Junior Full-Stack Engineer (React / Node.js)',
      status: 'APPLIED',
      appliedDate: 'Yesterday',
    },
    {
      id: 'app-002',
      opportunityId: 'opp-003',
      company: 'Tata Consultancy Services',
      title: 'Graduate Systems Engineer (Digital / Ninja)',
      status: 'SCREENING',
      appliedDate: '3 days ago',
    }
  ]
};

const STORAGE_KEY = 'l2h_candidate_state_v3';

export function getStoredState(): CandidateState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveStoredState(state: CandidateState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to persist candidate state', err);
  }
}

/**
 * NextActionService: Core product intelligence engine.
 * Computes the candidate's exact next best step across the 12-stage connected loop.
 */
export function getNextBestAction(state: CandidateState) {
  if (!state.targetCareerSlug) {
    return {
      title: 'Select Target Career Goal',
      description: 'Explore the 22+ technical and non-technical career blueprints in the Career Atlas.',
      ctaText: 'Choose Career',
      ctaUrl: ROUTES.app.career.discover,
      stageLabel: 'Step 1: Career Discovery',
    };
  }

  const role = getCareerBySlug(state.targetCareerSlug);
  const roleTitle = role ? role.title : 'Target Role';

  if (!state.assessmentScore || state.stage === 'CAREER_SELECTED') {
    return {
      title: `Complete ${roleTitle} Baseline Assessment`,
      description: 'Take the calibrated diagnostic assessment to benchmark your true competence from L0 to L5.',
      ctaText: 'Start Assessment',
      ctaUrl: ROUTES.app.assessments.baseline,
      stageLabel: 'Step 2: Calibrated Assessment',
    };
  }

  const criticalGaps = state.skills.filter((s) => s.priority === 'CRITICAL' || s.priority === 'HIGH');
  if (criticalGaps.length > 0 && state.stage !== 'PROJECT_ACTIVE' && state.stage !== 'INTERVIEW_READY') {
    const topGap = criticalGaps[0];
    return {
      title: `Bridge Skill Gap: ${topGap.name} (${topGap.currentLevel} → ${topGap.requiredLevel})`,
      description: `Targeted modules on freeCodeCamp, MDN, and SQLBolt are ready on your personalized roadmap.`,
      ctaText: 'Start Roadmap Lesson',
      ctaUrl: ROUTES.app.learning.roadmap,
      stageLabel: 'Step 3: Personalized Learning',
    };
  }

  if (state.activeProject && !state.activeProject.isCompleted) {
    return {
      title: `Complete Project Milestone: ${state.activeProject.title}`,
      description: `Milestone ${state.activeProject.milestoneCurrent} of ${state.activeProject.milestoneTotal} is in progress. Build your verified portfolio proof.`,
      ctaText: 'Open Project Workspace',
      ctaUrl: ROUTES.app.projects.workspace('proj-001'),
      stageLabel: 'Step 4: Real-World Project',
    };
  }

  if (!state.interviewScore || state.stage === 'PROJECT_COMPLETED') {
    return {
      title: `Simulate ${roleTitle} Technical Interview`,
      description: 'Practice high-frequency interview questions calibrated to top employer patterns (TCS, Zoho, Amazon).',
      ctaText: 'Start Mock Interview',
      ctaUrl: ROUTES.app.interview.mock,
      stageLabel: 'Step 5: Interview Preparation',
    };
  }

  if (state.resume.status !== 'READY') {
    return {
      title: 'Review and Polish Role-Targeted Resume',
      description: 'Ensure your verified project evidence and skills are mapped to satisfy ATS compatibility benchmarks.',
      ctaText: 'Optimize Resume',
      ctaUrl: ROUTES.app.resume.builder,
      stageLabel: 'Step 6: Resume Preparation',
    };
  }

  return {
    title: `Apply to Matched Opportunities for ${roleTitle}`,
    description: 'New verified job listings match your verified competency passport. Review explainable eligibility.',
    ctaText: 'Explore Matched Jobs',
    ctaUrl: ROUTES.app.opportunities.jobs,
    stageLabel: 'Step 7: Direct Application',
  };
}

/**
 * Hook for consuming and modifying Candidate State with Supabase Auth synchronization.
 */
export function useCandidateState() {
  const [state, setState] = useState<CandidateState>(DEFAULT_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // 1. Initial hydration from local storage if available
    const stored = getStoredState();
    setState(stored);
    setIsHydrated(true);

    // 2. Sync with real Supabase Auth session
    const syncWithSupabase = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Fetch user profile from Supabase
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          setState((prev) => {
            const next: CandidateState = {
              ...prev,
              isLoggedIn: true,
              user: {
                id: user.id,
                name: profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Candidate',
                email: user.email || '',
                headline: profile?.headline || prev.user.headline || 'Candidate',
                avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture,
              },
            };
            saveStoredState(next);
            return next;
          });
        } else {
          // Not logged in in Supabase
          setState((prev) => {
            const next: CandidateState = {
              ...prev,
              isLoggedIn: false,
              user: {
                id: undefined,
                name: '',
                email: '',
                headline: '',
                avatarUrl: undefined,
              },
            };
            saveStoredState(next);
            return next;
          });
        }
      } catch (err) {
        console.error('Failed to sync state with Supabase session:', err);
      }
    };

    syncWithSupabase();

    // 3. Listen to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = session.user;
        setState((prev) => {
          const next: CandidateState = {
            ...prev,
            isLoggedIn: true,
            user: {
              id: user.id,
              name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Candidate',
              email: user.email || '',
              headline: prev.user.headline || 'Candidate',
              avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture,
            },
          };
          saveStoredState(next);
          return next;
        });
      } else if (event === 'SIGNED_OUT') {
        setState((prev) => {
          const next: CandidateState = {
            ...prev,
            isLoggedIn: false,
            user: {
              id: undefined,
              name: '',
              email: '',
              headline: '',
              avatarUrl: undefined,
            },
          };
          saveStoredState(next);
          return next;
        });
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const updateState = (updater: Partial<CandidateState> | ((prev: CandidateState) => CandidateState)) => {
    setState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      saveStoredState(next);
      return next;
    });
  };

  const setTargetRole = (slug: string) => {
    const role = getCareerBySlug(slug);
    if (!role) return;
    updateState({
      targetCareerSlug: slug,
      stage: 'CAREER_SELECTED',
      skills: role.requiredSkills.map((s, idx) => ({
        name: s.name,
        currentLevel: idx === 0 ? 'L3' : 'L1',
        requiredLevel: s.level,
        gap: idx === 0 ? 1 : 2,
        confidence: 0.7,
        evidenceCount: 1,
        priority: idx === 0 ? 'HIGH' : 'CRITICAL',
      })),
      readinessScore: 54,
    });
  };

  const recordAssessmentCompletion = (score: number) => {
    updateState((prev) => ({
      ...prev,
      assessmentScore: score,
      stage: 'SKILL_ANALYZED',
      readinessScore: Math.min(Math.round(score * 0.9), 95),
      skills: prev.skills.map((s) =>
        s.priority === 'CRITICAL' ? { ...s, currentLevel: 'L2', gap: 1, priority: 'HIGH' } : s
      ),
    }));
  };

  const resetToDefault = () => {
    setState(DEFAULT_STATE);
    saveStoredState(DEFAULT_STATE);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    resetToDefault();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = ROUTES.auth.login;
    }
  };

  return {
    state,
    isHydrated,
    updateState,
    setTargetRole,
    recordAssessmentCompletion,
    resetToDefault,
    signOut,
    nextAction: getNextBestAction(state),
  };
}
