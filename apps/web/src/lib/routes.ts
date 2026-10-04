/**
 * LEARN-2-HIRE CANONICAL ROUTE REGISTRY
 * Single source of truth for all public, authentication, and application route paths.
 * Prevents typos and guarantees zero-404 navigation consistency across the entire platform.
 */

export const ROUTES = {
  // Public Marketing Routes
  public: {
    home: '/',
    howItWorks: '/how-it-works',
    careers: '/careers',
    careerDetail: (slug: string) => `/careers/${slug}`,
    resources: '/resources',
    about: '/about',
    ethics: '/ethics',
    contact: '/contact',
  },

  // Authentication Flow
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },

  // Progressive Onboarding Wizard
  onboarding: '/onboarding',

  // Authenticated Candidate Platform (/app/*)
  app: {
    dashboard: '/app/dashboard',

    // Career Discovery & Atlas
    career: {
      discover: '/app/career/discover',
      atlas: '/app/career/atlas',
      recommended: '/app/career/recommended',
      goals: '/app/career/goals',
      saved: '/app/career/saved',
      compare: '/app/career/compare',
      detail: (slug: string) => `/app/career/${slug}`,
    },

    // Skill Intelligence Analyzer
    skills: {
      analysis: '/app/skill-analysis',
    },

    // Assessment Engine
    assessments: {
      home: '/app/assessments',
      baseline: '/app/assessments/baseline',
      technical: '/app/assessments/technical',
      aptitude: '/app/assessments/aptitude',
      logical: '/app/assessments/logical',
      role: '/app/assessments/role',
      advanced: '/app/assessments/advanced',
      company: '/app/assessments/company',
      history: '/app/assessments/history',
      take: (id: string) => `/app/assessments/${id}`,
      results: (id: string) => `/app/assessments/${id}/results`,
    },

    // Learning Hub & Free Curricula
    learning: {
      home: '/app/learning',
      roadmap: '/app/learning/roadmap',
      courses: '/app/learning/courses',
      lessons: '/app/learning/lessons',
      resources: '/app/learning/resources',
      practice: '/app/learning/practice',
      progress: '/app/learning/progress',
      bookmarks: '/app/learning/bookmarks',
      weakTopics: '/app/learning/weak-topics',
    },

    // Practice Arena
    practice: {
      home: '/app/practice',
      coding: '/app/practice/coding',
      dsa: '/app/practice/dsa',
      sql: '/app/practice/sql',
      debugging: '/app/practice/debugging',
      aptitude: '/app/practice/aptitude',
      logical: '/app/practice/logical',
      verbal: '/app/practice/verbal',
      role: '/app/practice/role',
      company: '/app/practice/company',
      history: '/app/practice/history',
    },

    // Real-World Projects & Milestones
    projects: {
      home: '/app/projects',
      recommended: '/app/projects/recommended',
      myProjects: '/app/projects/my-projects',
      detail: (id: string) => `/app/projects/${id}`,
      workspace: (id: string) => `/app/projects/${id}/workspace`,
      submit: (id: string) => `/app/projects/${id}/submit`,
      evaluation: (id: string) => `/app/projects/${id}/evaluation`,
    },

    // Verifiable Skill Proof
    skillProof: {
      home: '/app/skill-proof',
      skills: '/app/skill-proof/skills',
      evidence: '/app/skill-proof/evidence',
      projects: '/app/skill-proof/projects',
      certificates: '/app/skill-proof/certificates',
      achievements: '/app/skill-proof/achievements',
      public: '/app/skill-proof/public',
    },

    // Interview Simulator
    interview: {
      home: '/app/interview',
      technical: '/app/interview/technical',
      hr: '/app/interview/hr',
      behavioral: '/app/interview/behavioral',
      communication: '/app/interview/communication',
      role: '/app/interview/role',
      company: '/app/interview/company',
      mock: '/app/interview/mock',
      history: '/app/interview/history',
      session: (id: string) => `/app/interview/${id}`,
      results: (id: string) => `/app/interview/${id}/results`,
    },

    // Resume System & ATS Analyzer
    resume: {
      home: '/app/resume',
      builder: '/app/resume/builder',
      versions: '/app/resume/versions',
      analyzer: '/app/resume/analyzer',
      jobMatch: '/app/resume/job-match',
      history: '/app/resume/history',
    },

    // Opportunity Engine & Job Matching
    opportunities: {
      home: '/app/opportunities',
      jobs: '/app/opportunities/jobs',
      internships: '/app/opportunities/internships',
      startups: '/app/opportunities/startups',
      remote: '/app/opportunities/remote',
      recommended: '/app/opportunities/recommended',
      saved: '/app/opportunities/saved',
      eligibility: (id: string) => `/app/opportunities/eligibility/${id}`,
      detail: (id: string) => `/app/opportunities/${id}`,
    },

    // Application Tracker
    applications: {
      home: '/app/applications',
      kanban: '/app/applications/kanban',
      timeline: '/app/applications/timeline',
      detail: (id: string) => `/app/applications/${id}`,
    },

    // Closed-Loop Improvement & Retraining
    improve: {
      home: '/app/improve',
      skillGaps: '/app/improve/skill-gaps',
      retraining: '/app/improve/retraining',
      reassessment: '/app/improve/reassessment',
    },

    // Longitudinal Analytics
    analytics: {
      home: '/app/analytics',
      skills: '/app/analytics/skills',
      assessments: '/app/analytics/assessments',
      learning: '/app/analytics/learning',
      practice: '/app/analytics/practice',
      projects: '/app/analytics/projects',
      interviews: '/app/analytics/interviews',
      applications: '/app/analytics/applications',
    },

    // System Administration & Profile
    notifications: '/app/notifications',
    profile: '/app/profile',
    settings: '/app/settings',
  },
} as const;
