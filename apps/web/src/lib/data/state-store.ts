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
  targetCareerRoleId?: string;
  readinessScore: number; // 0 - 100
  skills: UserSkillItem[];
  careerHistory?: Record<
    string,
    {
      skills: UserSkillItem[];
      assessmentScore?: number;
      readinessScore: number;
      stage: JourneyStage;
      lastUpdated: string;
    }
  >;
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

export const CANONICAL_SKILL_UUIDS: Record<string, string> = {
  'javascript': '40000000-0000-0000-0000-000000000001',
  'react': '40000000-0000-0000-0000-000000000002',
  'node.js': '40000000-0000-0000-0000-000000000003',
  'node-js': '40000000-0000-0000-0000-000000000003',
  'sql': '40000000-0000-0000-0000-000000000004',
  'sql & relational dbs': '40000000-0000-0000-0000-000000000004',
  'docker': '40000000-0000-0000-0000-000000000005',
  'docker & deployment': '40000000-0000-0000-0000-000000000005',
  'docker & containerization': '40000000-0000-0000-0000-000000000005',
  'product roadmapping': '40000000-0000-0000-0000-000000000006',
  'wireframing-figma': '40000000-0000-0000-0000-000000000007',
  'figma': '40000000-0000-0000-0000-000000000007',
  'seo & organic growth': '40000000-0000-0000-0000-000000000008',
  'seo': '40000000-0000-0000-0000-000000000008',
  'talent acquisition & sourcing': '40000000-0000-0000-0000-000000000009',
  'talent acquisition': '40000000-0000-0000-0000-000000000009',
  'typescript': '40000000-0000-0000-0000-000000000010',
  'git & github': '40000000-0000-0000-0000-000000000011',
  'css & tailwind': '40000000-0000-0000-0000-000000000012',
  'web accessibility': '40000000-0000-0000-0000-000000000013',
};

export function getSkillUuid(name: string): string {
  const key = (name || '').toLowerCase().trim();
  if (CANONICAL_SKILL_UUIDS[key]) return CANONICAL_SKILL_UUIDS[key];
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(12, '0').slice(0, 12);
  return `40000000-0000-0000-0000-${hex}`;
}

export function getSkillNameFromUuid(uuid: string): string | undefined {
  for (const [name, u] of Object.entries(CANONICAL_SKILL_UUIDS)) {
    if (u === uuid) return name;
  }
  return undefined;
}

export function getOpportunityUuid(id: string): string {
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return id;
  }
  let hash = 0;
  const key = id || 'opp';
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(12, '0').slice(0, 12);
  return `80000000-0000-0000-0000-${hex}`;
}

export function getRoleUuid(slug: string): string {
  const canonicalMap: Record<string, string> = {
    'full-stack-developer': '50000000-0000-0000-0000-000000000001',
    'associate-product-manager': '50000000-0000-0000-0000-000000000002',
    'technical-product-manager': '50000000-0000-0000-0000-000000000002',
    'digital-marketing-specialist': '50000000-0000-0000-0000-000000000003',
  };
  if (canonicalMap[slug]) return canonicalMap[slug];
  let hash = 0;
  const key = slug || 'role';
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(12, '0').slice(0, 12);
  return `50000000-0000-0000-0000-${hex}`;
}

const DEFAULT_STATE: CandidateState = {
  isLoggedIn: false,
  user: {
    name: '',
    email: '',
    headline: 'Candidate',
  },
  stage: 'CAREER_SELECTED',
  targetCareerSlug: 'full-stack-developer',
  readinessScore: 0,
  skills: [
    { name: 'JavaScript', currentLevel: 'L0', requiredLevel: 'L4', gap: 4, confidence: 0, evidenceCount: 0, priority: 'CRITICAL' },
    { name: 'React', currentLevel: 'L0', requiredLevel: 'L3', gap: 3, confidence: 0, evidenceCount: 0, priority: 'CRITICAL' },
    { name: 'Node.js', currentLevel: 'L0', requiredLevel: 'L3', gap: 3, confidence: 0, evidenceCount: 0, priority: 'HIGH' },
    { name: 'SQL & Relational DBs', currentLevel: 'L0', requiredLevel: 'L3', gap: 3, confidence: 0, evidenceCount: 0, priority: 'HIGH' },
    { name: 'TypeScript', currentLevel: 'L0', requiredLevel: 'L3', gap: 3, confidence: 0, evidenceCount: 0, priority: 'HIGH' },
    { name: 'Git & GitHub', currentLevel: 'L0', requiredLevel: 'L4', gap: 4, confidence: 0, evidenceCount: 0, priority: 'HIGH' },
    { name: 'Docker & Deployment', currentLevel: 'L0', requiredLevel: 'L2', gap: 2, confidence: 0, evidenceCount: 0, priority: 'MEDIUM' },
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
    title: 'Full-Stack Developer Resume',
    status: 'NOT_READY',
    compatibilityScore: 0,
    matchedKeywords: [],
    missingKeywords: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
  },
  applications: [],
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

  const careerHistory = (state.careerHistory && typeof state.careerHistory === 'object')
    ? state.careerHistory
    : {};

  return {
    ...state,
    targetCareerRoleId: state.targetCareerRoleId || getRoleUuid(state.targetCareerSlug || 'full-stack-developer'),
    skills,
    readinessScore,
    careerHistory,
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

      if (!user) {
        if (globalCandidateState.isLoggedIn) {
          notifyListeners({
            ...DEFAULT_STATE,
            isLoggedIn: false,
          });
        }
        return;
      }

      if (user) {
        // 1. Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        // 2. Fetch persisted user_skills
        const { data: dbUserSkills } = await supabase
          .from('user_skills')
          .select('*')
          .eq('user_id', user.id);

        // 3. Fetch latest assessment attempt
        const { data: attempts } = await supabase
          .from('assessment_attempts')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
          .limit(1);

        // 4. Fetch user applications
        const { data: dbApplications } = await supabase
          .from('applications')
          .select('*')
          .eq('user_id', user.id);

        let mergedSkills = globalCandidateState.skills;
        let assessmentScore = globalCandidateState.assessmentScore;

        if (attempts && attempts.length > 0 && attempts[0].score !== undefined && attempts[0].score !== null) {
          assessmentScore = Number(attempts[0].score);
        }

        if (dbUserSkills && dbUserSkills.length > 0) {
          const dbSkillsMap = new Map<string, typeof dbUserSkills[0]>();
          dbUserSkills.forEach((item) => {
            dbSkillsMap.set(item.skill_id, item);
          });

          mergedSkills = mergedSkills.map((s) => {
            const skillUuid = getSkillUuid(s.name);
            const found = dbSkillsMap.get(skillUuid);
            if (found) {
              const reqNum = parseInt(s.requiredLevel.replace('L', ''), 10) || 3;
              const curNum = parseInt((found.current_level || 'L1').replace('L', ''), 10) || 1;
              const gap = Math.max(0, reqNum - curNum);
              return {
                ...s,
                currentLevel: found.current_level as UserSkillItem['currentLevel'],
                confidence: Number(found.confidence_score) || 0.8,
                evidenceCount: found.evidence_count || 1,
                gap,
                priority: gap === 0 ? ('SATISFIED' as const) : gap >= 2 ? ('CRITICAL' as const) : ('HIGH' as const),
              };
            }
            return s;
          });
        }

        const calculatedReadiness = calculateReadinessScore(mergedSkills, assessmentScore);

        const apps = (dbApplications && dbApplications.length > 0)
          ? dbApplications.map((a) => ({
              id: a.id,
              opportunityId: a.opportunity_id,
              company: a.notes?.split('Applied to ')?.[1]?.split(' for ')?.[0] || 'Direct Opportunity',
              title: a.notes?.split(' for ')?.[1] || 'Applied Role',
              status: (a.status || 'APPLIED') as CandidateState['applications'][0]['status'],
              appliedDate: a.applied_date ? new Date(a.applied_date).toLocaleDateString() : 'Recently',
              outcomeReason: a.outcome_reason || undefined,
            }))
          : globalCandidateState.applications;

        let targetCareerSlug = globalCandidateState.targetCareerSlug;
        if (profile?.target_role_id) {
          const matchedRole = CAREER_ROLES_CATALOG.find(
            (c) => getRoleUuid(c.slug) === profile.target_role_id
          );
          if (matchedRole) {
            targetCareerSlug = matchedRole.slug;
          }
        } else if (profile?.headline) {
          const matchedRole = CAREER_ROLES_CATALOG.find(
            (c) => c.title.toLowerCase() === profile.headline.toLowerCase()
          );
          if (matchedRole) {
            targetCareerSlug = matchedRole.slug;
          }
        }

        const next: CandidateState = {
          ...globalCandidateState,
          isLoggedIn: true,
          targetCareerSlug,
          targetCareerRoleId: getRoleUuid(targetCareerSlug),
          user: {
            id: user.id,
            name: profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Candidate',
            email: user.email || '',
            headline: profile?.headline || globalCandidateState.user.headline || 'Candidate',
            avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture,
          },
          stage: assessmentScore !== undefined ? 'SKILL_ANALYZED' : globalCandidateState.stage,
          assessmentScore,
          readinessScore: assessmentScore !== undefined ? calculatedReadiness : 0,
          skills: mergedSkills,
          applications: apps,
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
      // Run sync to pull remote database progress
      sync();
    } else if (event === 'SIGNED_OUT' || !session) {
      notifyListeners(DEFAULT_STATE);
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

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const sanitized = sanitizeState(parsed);
          globalCandidateState = sanitized;
          setState(sanitized);
        } catch {}
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorage);
    }

    return () => {
      stateListeners.delete(setState);
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorage);
      }
    };
  }, []);

  const updateState = (updater: Partial<CandidateState> | ((prev: CandidateState) => CandidateState)) => {
    const next = typeof updater === 'function' ? updater(globalCandidateState) : { ...globalCandidateState, ...updater };
    notifyListeners(next);
  };

  const setTargetRole = async (slug: string) => {
    const role = getCareerBySlug(slug);
    if (!role) return;

    const prevSlug = globalCandidateState.targetCareerSlug;
    // Snapshot current role's progress into careerHistory if it had skills/evaluations
    const currentSnapshot = {
      skills: globalCandidateState.skills,
      assessmentScore: globalCandidateState.assessmentScore,
      readinessScore: globalCandidateState.readinessScore,
      stage: globalCandidateState.stage,
      lastUpdated: new Date().toISOString(),
    };

    const updatedHistory = {
      ...(globalCandidateState.careerHistory || {}),
      [prevSlug]: currentSnapshot,
    };

    // If candidate has historical progress for this new target slug, restore it!
    const historicalForNewRole = updatedHistory[slug];

    let nextSkills: UserSkillItem[];
    let nextReadiness: number;
    let nextAssessmentScore: number | undefined;
    let nextStage: JourneyStage = 'CAREER_SELECTED';

    if (historicalForNewRole && historicalForNewRole.skills?.length > 0) {
      nextSkills = historicalForNewRole.skills;
      nextReadiness = historicalForNewRole.readinessScore || 0;
      nextAssessmentScore = historicalForNewRole.assessmentScore;
      nextStage = historicalForNewRole.stage || (nextAssessmentScore ? 'SKILL_ANALYZED' : 'CAREER_SELECTED');
    } else {
      nextSkills = role.requiredSkills.map((s) => {
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
      nextReadiness = 0;
      nextAssessmentScore = undefined;
      nextStage = 'CAREER_SELECTED';
    }

    const nextState: CandidateState = {
      ...globalCandidateState,
      targetCareerSlug: slug,
      targetCareerRoleId: getRoleUuid(slug),
      careerHistory: updatedHistory,
      stage: nextStage,
      skills: nextSkills,
      readinessScore: nextReadiness,
      assessmentScore: nextAssessmentScore,
    };

    notifyListeners(nextState);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({
            target_role_id: getRoleUuid(slug),
            headline: role.title,
            career_track: role.track,
            readiness_score: nextReadiness,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      }
    } catch (err) {
      console.warn('Failed to persist target role to profile:', err);
    }
  };

  const recordAssessmentCompletion = async (
    score: number,
    details?: {
      questions?: Array<{ id: string; prompt: string }>;
      answers?: Record<string, string>;
      calibratedSkills?: Array<{
        skillName: string;
        calibratedLevel: 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
        score: number;
        confidence?: number;
      }>;
      seenQuestions?: Array<{
        questionId: string;
        normalizedHash: string;
        questionFamily?: string;
        variantGroupId?: string;
        correct?: boolean;
        score?: number;
      }>;
    }
  ) => {
    const currentSlug = globalCandidateState.targetCareerSlug;
    const role = getCareerBySlug(currentSlug);
    const roleTitle = role ? role.title : 'Full-Stack Developer';

    const achievedLevel = score >= 85 ? 'L4' : score >= 70 ? 'L3' : score >= 50 ? 'L2' : 'L1';
    const achievedLvlNum = parseInt(achievedLevel.replace('L', ''), 10);

    const updatedSkills: UserSkillItem[] = globalCandidateState.skills.map((s) => {
      const calibrated = details?.calibratedSkills?.find(
        (cs) => cs.skillName.toLowerCase() === s.name.toLowerCase() ||
                s.name.toLowerCase().includes(cs.skillName.toLowerCase()) ||
                cs.skillName.toLowerCase().includes(s.name.toLowerCase())
      );

      const reqLvlNum = parseInt(s.requiredLevel.replace('L', ''), 10) || 3;
      const curLvl = calibrated?.calibratedLevel || (achievedLvlNum ? `L${Math.min(achievedLvlNum, reqLvlNum)}` : 'L1');
      const curLvlNum = parseInt(curLvl.replace('L', ''), 10) || 1;
      const newGap = Math.max(0, reqLvlNum - curLvlNum);
      const conf = calibrated?.confidence ?? Math.min(Math.round((score / 100) * 100) / 100, 0.95);

      return {
        ...s,
        currentLevel: curLvl as UserSkillItem['currentLevel'],
        gap: newGap,
        confidence: conf,
        evidenceCount: (s.evidenceCount || 0) + 1,
        priority: newGap === 0 ? ('SATISFIED' as const) : newGap >= 2 ? ('CRITICAL' as const) : ('HIGH' as const),
      };
    });

    const newReadiness = calculateReadinessScore(updatedSkills, score);

    // Track seen question IDs in state
    const newSeenIds = details?.seenQuestions
      ? Array.from(new Set([...(globalCandidateState.seenQuestionIds || []), ...details.seenQuestions.map(q => q.questionId)]))
      : globalCandidateState.seenQuestionIds;

    const updatedHistory = {
      ...(globalCandidateState.careerHistory || {}),
      [currentSlug]: {
        skills: updatedSkills,
        assessmentScore: score,
        readinessScore: newReadiness,
        stage: 'SKILL_ANALYZED' as JourneyStage,
        lastUpdated: new Date().toISOString(),
      },
    };

    // Update in-memory state immediately for instant feedback
    updateState({
      assessmentScore: score,
      stage: 'SKILL_ANALYZED',
      readinessScore: newReadiness,
      skills: updatedSkills,
      seenQuestionIds: newSeenIds,
      careerHistory: updatedHistory,
    });

    // Background Supabase persistence
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Record to user_question_history if seenQuestions provided
        if (details?.seenQuestions && details.seenQuestions.length > 0) {
          try {
            const historyRows = details.seenQuestions.map((sq) => ({
              user_id: user.id,
              question_id: sq.questionId.length === 36 ? sq.questionId : '00000000-0000-0000-0000-000000000001',
              normalized_hash: sq.normalizedHash,
              question_family: sq.questionFamily || 'GENERAL',
              variant_group_id: sq.variantGroupId || 'VAR_GEN',
              career_role_id: '50000000-0000-0000-0000-000000000001',
              answered_correctly: sq.correct ?? true,
              score: sq.score ?? 100,
              time_taken_seconds: 60,
              seen_at: new Date().toISOString(),
            }));
            await supabase.from('user_question_history').insert(historyRows);
          } catch (histErr) {
            console.warn('user_question_history persist note:', histErr);
          }
        }

        // 1. Record assessment attempt
        const { data: attemptRows, error: attemptErr } = await supabase
          .from('assessment_attempts')
          .insert({
            user_id: user.id,
            blueprint_id: '60000000-0000-0000-0000-000000000001',
            title: `${roleTitle} Baseline Diagnostic`,
            status: 'COMPLETED',
            score: score,
            passed: score >= 60,
            completed_at: new Date().toISOString(),
          })
          .select();

        if (attemptErr) {
          console.warn('Supabase assessment_attempt write note:', attemptErr.message);
        }

        const attemptId = attemptRows && attemptRows[0] ? attemptRows[0].id : undefined;

        // 2. Persist each calculated skill into user_skills
        for (const s of updatedSkills) {
          const skillUuid = getSkillUuid(s.name);
          const { error: skillErr } = await supabase.from('user_skills').upsert(
            {
              user_id: user.id,
              skill_id: skillUuid,
              current_level: s.currentLevel,
              confidence_score: s.confidence,
              evidence_count: s.evidenceCount,
              last_assessed_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,skill_id' }
          );

          if (skillErr) {
            console.warn(`Supabase user_skill write for ${s.name}:`, skillErr.message);
          }
        }

        // 3. Update readiness score in profiles
        await supabase
          .from('profiles')
          .update({
            readiness_score: newReadiness,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        // 4. Save improvement plan if skill gaps exist
        const criticalGaps = updatedSkills
          .filter((s) => s.priority === 'CRITICAL' || s.priority === 'HIGH')
          .map((s) => s.name);

        if (criticalGaps.length > 0) {
          await supabase.from('improvement_plans').insert({
            user_id: user.id,
            trigger_type: 'ASSESSMENT_WEAKNESS',
            identified_gaps: criticalGaps,
            status: 'ACTIVE',
          });
        }
      }
    } catch (persistErr) {
      console.warn('Background Supabase persistence error:', persistErr);
    }
  };

  const recordPracticeCompletion = async (
    skillName: string,
    score: number,
    details?: { challengeTitle: string; passedTests: number; totalTests: number }
  ) => {
    updateState((prev) => {
      const updatedSkills = prev.skills.map((s) => {
        if (
          s.name.toLowerCase() === skillName.toLowerCase() ||
          s.name.toLowerCase().includes(skillName.toLowerCase()) ||
          skillName.toLowerCase().includes(s.name.toLowerCase())
        ) {
          const nextEvCount = (s.evidenceCount || 0) + 1;
          const nextConf = Math.min((s.confidence || 0.5) + 0.15, 0.95);
          // If candidate solved with >= 90%, upgrade level if lower than target
          let nextLevel = s.currentLevel;
          if (score >= 90 && (s.currentLevel === 'L0' || s.currentLevel === 'L1')) {
            nextLevel = 'L2';
          }
          const reqNum = parseInt(s.requiredLevel.replace('L', ''), 10) || 3;
          const curNum = parseInt(nextLevel.replace('L', ''), 10) || 1;
          const nextGap = Math.max(0, reqNum - curNum);

          return {
            ...s,
            currentLevel: nextLevel,
            gap: nextGap,
            confidence: nextConf,
            evidenceCount: nextEvCount,
            priority: nextGap === 0 ? ('SATISFIED' as const) : nextGap >= 2 ? ('CRITICAL' as const) : ('HIGH' as const),
          };
        }
        return s;
      });

      return {
        ...prev,
        stage: 'PRACTICE_ACTIVE',
        skills: updatedSkills,
      };
    });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const skillUuid = getSkillUuid(skillName);
        await supabase.from('user_skills').upsert(
          {
            user_id: user.id,
            skill_id: skillUuid,
            confidence_score: 0.85,
            evidence_count: 1,
            last_assessed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,skill_id' }
        );
      }
    } catch (err) {
      console.warn('Practice evidence persist note:', err);
    }
  };

  const applyToOpportunity = async (job: {
    id: string;
    companyName: string;
    title: string;
  }) => {
    const oppUuid = getOpportunityUuid(job.id);
    const newApp: CandidateState['applications'][0] = {
      id: `app-${Date.now()}`,
      opportunityId: job.id,
      company: job.companyName,
      title: job.title,
      status: 'APPLIED',
      appliedDate: 'Just now',
    };

    updateState((prev) => ({
      ...prev,
      stage: 'APPLIED',
      applications: [newApp, ...prev.applications.filter((a) => a.opportunityId !== job.id)],
    }));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: appRow } = await supabase
          .from('applications')
          .upsert(
            {
              user_id: user.id,
              opportunity_id: oppUuid,
              status: 'APPLIED',
              applied_date: new Date().toISOString(),
              notes: `Applied to ${job.companyName} for ${job.title}`,
            },
            { onConflict: 'user_id,opportunity_id' }
          )
          .select();

        if (appRow && appRow[0]?.id) {
          await supabase.from('application_events').insert({
            application_id: appRow[0].id,
            event_type: 'APPLICATION_SUBMITTED',
            description: `Application submitted for ${job.title} at ${job.companyName}`,
          });
        }
      }
    } catch (err) {
      console.warn('Failed to persist application to Supabase:', err);
    }
  };

  const resetToDefault = () => {
    notifyListeners(DEFAULT_STATE);
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut error:', err);
    }
    resetToDefault();
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.clear();
      } catch {}
      window.location.href = ROUTES.auth.login;
    }
  };

  return {
    state,
    isHydrated,
    updateState,
    setTargetRole,
    recordAssessmentCompletion,
    recordPracticeCompletion,
    applyToOpportunity,
    resetToDefault,
    signOut,
    nextAction: getNextBestAction(state),
  };
}
