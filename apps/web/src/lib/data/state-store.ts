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

export function calculateReadinessScore(skills: UserSkillItem[], assessmentScore?: number): number {
  if (!skills || skills.length === 0) return 0;

  const levelToNum = (lvl: string) => parseInt((lvl || '').replace('L', ''), 10) || 0;
  let totalRequired = 0;
  let totalAchieved = 0;

  skills.forEach((s) => {
    const req = levelToNum(s.requiredLevel) || 1;
    const cur = levelToNum(s.currentLevel);
    totalRequired += req;
    totalAchieved += Math.min(cur, req);
  });

  const skillProgress = totalRequired > 0 ? (totalAchieved / totalRequired) * 100 : 0;

  if (assessmentScore !== undefined && assessmentScore > 0) {
    return Math.min(Math.round(skillProgress * 0.6 + assessmentScore * 0.4), 100);
  }

  return Math.min(Math.round(skillProgress), 100);
}

const DEFAULT_STATE: CandidateState = {
  isLoggedIn: false,
  user: {
    name: '',
    email: '',
    headline: 'Candidate',
  },
  stage: 'CAREER_SELECTED',
  targetCareerSlug: 'frontend-developer',
  readinessScore: 0,
  skills: [
    { name: 'JavaScript', currentLevel: 'L0', requiredLevel: 'L4', gap: 4, confidence: 0, evidenceCount: 0, priority: 'CRITICAL' },
    { name: 'React', currentLevel: 'L0', requiredLevel: 'L4', gap: 4, confidence: 0, evidenceCount: 0, priority: 'CRITICAL' },
    { name: 'CSS & Tailwind', currentLevel: 'L0', requiredLevel: 'L4', gap: 4, confidence: 0, evidenceCount: 0, priority: 'HIGH' },
    { name: 'TypeScript', currentLevel: 'L0', requiredLevel: 'L3', gap: 3, confidence: 0, evidenceCount: 0, priority: 'HIGH' },
    { name: 'Web Accessibility', currentLevel: 'L0', requiredLevel: 'L3', gap: 3, confidence: 0, evidenceCount: 0, priority: 'MEDIUM' },
  ],
  seenQuestionIds: [],
  assessmentScore: undefined,
  activeProject: {
    title: 'Interactive Design System & UI',
    milestoneTotal: 4,
    milestoneCurrent: 0,
    githubUrl: '',
    isCompleted: false,
    rubricScore: 0,
  },
  interviewScore: 0,
  resume: {
    title: 'Frontend Developer (Entry)',
    status: 'NOT_READY',
    compatibilityScore: 0,
    matchedKeywords: [],
    missingKeywords: ['React', 'TypeScript', 'CSS & Tailwind', 'JavaScript'],
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
  ],
};

const STORAGE_KEY = 'l2h_candidate_state_v3';

export function sanitizeState(state: CandidateState): CandidateState {
  if (!state) return DEFAULT_STATE;

  // Deduplicate skills by unique name
  const skillsMap = new Map<string, UserSkillItem>();
  if (Array.isArray(state.skills)) {
    state.skills.forEach((s) => {
      if (s && s.name && !skillsMap.has(s.name.toLowerCase().trim())) {
        skillsMap.set(s.name.toLowerCase().trim(), s);
      }
    });
  }

  // Deduplicate applications by opportunityId or id
  const appsMap = new Map<string, CandidateState['applications'][0]>();
  if (Array.isArray(state.applications)) {
    state.applications.forEach((a) => {
      const key = a.opportunityId || a.id;
      if (key && !appsMap.has(key)) {
        appsMap.set(key, a);
      }
    });
  }

  // Deduplicate seen questions and keywords
  const seenQuestionIds = Array.isArray(state.seenQuestionIds)
    ? Array.from(new Set(state.seenQuestionIds))
    : [];

  const matchedKeywords = Array.isArray(state.resume?.matchedKeywords)
    ? Array.from(new Set(state.resume.matchedKeywords))
    : [];

  const missingKeywords = Array.isArray(state.resume?.missingKeywords)
    ? Array.from(new Set(state.resume.missingKeywords))
    : [];

  // Enforce 0% baseline for uncalibrated roles and calculate score from actual performance only
  let readinessScore = state.readinessScore;
  let skills = skillsMap.size > 0 ? Array.from(skillsMap.values()) : DEFAULT_STATE.skills;

  if (!state.assessmentScore || state.assessmentScore === 0 || readinessScore === 54 || readinessScore === 68) {
    if (state.stage === 'CAREER_SELECTED' || !state.assessmentScore) {
      readinessScore = 0;
      skills = skills.map((s) => {
        const reqNum = parseInt(s.requiredLevel.replace('L', ''), 10) || 3;
        return {
          ...s,
          currentLevel: 'L0',
          gap: reqNum,
          confidence: 0,
          evidenceCount: 0,
        };
      });
    } else {
      readinessScore = calculateReadinessScore(skills, state.assessmentScore);
    }
  }

  return {
    ...state,
    skills,
    readinessScore,
    applications: Array.from(appsMap.values()),
    seenQuestionIds,
    resume: {
      ...(state.resume || DEFAULT_STATE.resume),
      matchedKeywords,
      missingKeywords,
    },
  };
}

export function getStoredState(): CandidateState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    const sanitized = sanitizeState(parsed);
    // Write back sanitized clean state to remove stored duplicate data permanently
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    return sanitized;
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveStoredState(state: CandidateState): void {
  if (typeof window === 'undefined') return;
  try {
    const sanitized = sanitizeState(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
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

// Global singleton in-memory state and subscriber registry for zero-latency client navigation
let globalCandidateState: CandidateState = typeof window !== 'undefined' ? getStoredState() : DEFAULT_STATE;
const stateListeners = new Set<(s: CandidateState) => void>();
let isSupabaseSyncStarted = false;

function notifyListeners(next: CandidateState) {
  globalCandidateState = next;
  saveStoredState(next);
  stateListeners.forEach((listener) => {
    try {
      listener(next);
    } catch (err) {
      console.error('Error notifying state listener:', err);
    }
  });
}

function ensureSupabaseSync() {
  if (typeof window === 'undefined' || isSupabaseSyncStarted) return;
  isSupabaseSyncStarted = true;

  const sync = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        const next: CandidateState = {
          ...globalCandidateState,
          isLoggedIn: true,
          user: {
            id: user.id,
            name: profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Candidate',
            email: user.email || '',
            headline: profile?.headline || globalCandidateState.user.headline || 'Candidate',
            avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture,
          },
        };
        notifyListeners(next);
      }
    } catch (err) {
      console.warn('Background Supabase auth sync:', err);
    }
  };

  sync();

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      const user = session.user;
      const next: CandidateState = {
        ...globalCandidateState,
        isLoggedIn: true,
        user: {
          id: user.id,
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Candidate',
          email: user.email || '',
          headline: globalCandidateState.user.headline || 'Candidate',
          avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        },
      };
      notifyListeners(next);
    } else if (event === 'SIGNED_OUT') {
      const next: CandidateState = {
        ...globalCandidateState,
        isLoggedIn: false,
        user: {
          id: undefined,
          name: '',
          email: '',
          headline: '',
          avatarUrl: undefined,
        },
      };
      notifyListeners(next);
    }
  });
}

/**
 * Hook for consuming and modifying Candidate State with instant hydration and Supabase sync.
 */
export function useCandidateState() {
  const [state, setState] = useState<CandidateState>(DEFAULT_STATE);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    setIsHydrated(true);
    setState(globalCandidateState);
    stateListeners.add(setState);
    ensureSupabaseSync();

    return () => {
      stateListeners.delete(setState);
    };
  }, []);

  const updateState = (updater: Partial<CandidateState> | ((prev: CandidateState) => CandidateState)) => {
    const next = typeof updater === 'function' ? updater(globalCandidateState) : { ...globalCandidateState, ...updater };
    notifyListeners(next);
  };

  const setTargetRole = (slug: string) => {
    const role = getCareerBySlug(slug);
    if (!role) return;

    const initialSkills: UserSkillItem[] = role.requiredSkills.map((s) => {
      const reqNum = parseInt(s.level.replace('L', ''), 10) || 3;
      return {
        name: s.name,
        currentLevel: 'L0',
        requiredLevel: s.level,
        gap: reqNum,
        confidence: 0,
        evidenceCount: 0,
        priority: reqNum >= 4 ? ('CRITICAL' as const) : ('HIGH' as const),
      };
    });

    updateState({
      targetCareerSlug: slug,
      stage: 'CAREER_SELECTED',
      skills: initialSkills,
      readinessScore: 0,
      assessmentScore: undefined,
    });
  };

  const recordAssessmentCompletion = (score: number) => {
    updateState((prev) => {
      const achievedLevel = score >= 85 ? 'L4' : score >= 70 ? 'L3' : score >= 50 ? 'L2' : 'L1';
      const achievedLvlNum = parseInt(achievedLevel.replace('L', ''), 10);

      const updatedSkills: UserSkillItem[] = prev.skills.map((s) => {
        const reqLvlNum = parseInt(s.requiredLevel.replace('L', ''), 10) || 3;
        const newCurLvlNum = Math.min(achievedLvlNum, reqLvlNum);
        const newCurLevel = `L${newCurLvlNum}` as UserSkillItem['currentLevel'];
        const newGap = Math.max(0, reqLvlNum - newCurLvlNum);
        return {
          ...s,
          currentLevel: newCurLevel,
          gap: newGap,
          confidence: Math.min(Math.round((score / 100) * 100) / 100, 0.95),
          evidenceCount: s.evidenceCount + 1,
          priority: newGap === 0 ? ('SATISFIED' as const) : newGap >= 2 ? ('CRITICAL' as const) : ('HIGH' as const),
        };
      });

      const newReadiness = calculateReadinessScore(updatedSkills, score);

      return {
        ...prev,
        assessmentScore: score,
        stage: 'SKILL_ANALYZED',
        readinessScore: newReadiness,
        skills: updatedSkills,
      };
    });
  };

  const resetToDefault = () => {
    notifyListeners(DEFAULT_STATE);
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
