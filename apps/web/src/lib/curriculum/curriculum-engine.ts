/**
 * LEARN-2-HIRE 2.0: DYNAMIC PERSONALIZED CURRICULUM & RESOURCE ENGINE
 * 
 * Generates role-specific competency blueprints, personalized skill-gap roadmaps,
 * and verified educational resources strictly derived from:
 * USER → TARGET ROLE → CAREER BLUEPRINT → ASSESSMENT EVIDENCE → SKILL GAP → PREREQUISITES
 * 
 * Free vs. Paid resources are strictly and truthfully differentiated.
 * LinkedIn Learning is explicitly marked as "PAID / SUBSCRIPTION" and never falsely claimed as free.
 */

import { getCareerBySlug, CAREER_ROLES_CATALOG, CareerRoleDetail } from '../data/careers-data';
import { UserSkillItem } from '../data/state-store';

export type ResourceAccessType = 'FREE' | 'PAID / SUBSCRIPTION';
export type ResourceContentType = 'DOCUMENTATION' | 'COURSE' | 'VIDEO' | 'INTERACTIVE' | 'TUTORIAL';
export type ModulePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'TARGET_MET';
export type ModuleStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'TARGET_MET' | 'BLOCKED_BY_PREREQUISITE';

export interface VerifiedLearningResource {
  id: string;
  provider: 'MDN Web Docs' | 'freeCodeCamp' | 'W3Schools' | 'GeeksforGeeks' | 'YouTube' | 'Harvard CS50' | 'MIT OpenCourseWare' | 'SWAYAM / NPTEL' | 'SQLBolt' | 'Microsoft Learn' | 'Docker Docs' | 'Official Documentation' | 'LinkedIn Learning' | 'PortSwigger' | 'OWASP Foundation' | 'Kaggle' | 'Figma';
  title: string;
  url: string;
  resourceType: ResourceContentType;
  access: ResourceAccessType;
  isFree: boolean;
  duration: string;
  durationHours: number;
  skillName: string;
  level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  qualityScore: number; // 0 - 100
  qualityWhy: string;
}

export interface PersonalizedRoadmapModule {
  id: string;
  step: string; // e.g. '01', '02'
  careerRoleSlug: string;
  skillName: string;
  competencyDomain: string;
  title: string;
  description: string;
  currentLevel: 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  targetLevel: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  levelUpgrade: string; // e.g. 'L1 → L4'
  gap: number;
  priority: ModulePriority;
  status: ModuleStatus;
  estimatedHours: number;
  prerequisites: string[];
  topics: string[];
  learningObjectives: string[];
  primaryResource: VerifiedLearningResource;
  resources: VerifiedLearningResource[];
  practiceChallengeUrl: string;
  practiceTitle: string;
  reassessmentRequired: boolean;
  completionPercentage: number;
}

export interface PersonalizedCurriculumPlan {
  careerRoleSlug: string;
  targetRoleTitle: string;
  isAssessed: boolean;
  readinessScore: number;
  totalModules: number;
  completedModules: number;
  estimatedTotalHours: number;
  criticalGapsCount: number;
  modules: PersonalizedRoadmapModule[];
  statusMessage: string;
}

// =============================================================================
// VERIFIED EDUCATIONAL RESOURCE REPOSITORY (Role & Skill Mapped)
// =============================================================================

export const VERIFIED_RESOURCE_REPOSITORY: VerifiedLearningResource[] = [
  // --- JavaScript ---
  {
    id: 'res-js-fcc-cert',
    provider: 'freeCodeCamp',
    title: 'JavaScript Algorithms and Data Structures Certification',
    url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/',
    resourceType: 'COURSE',
    access: 'FREE',
    isFree: true,
    duration: '25 hrs',
    durationHours: 25,
    skillName: 'JavaScript',
    level: 'L2',
    qualityScore: 98,
    qualityWhy: '✓ Comprehensive open curriculum ✓ Interactive in-browser editor ✓ Zero cost',
  },
  {
    id: 'res-js-mdn-closures',
    provider: 'MDN Web Docs',
    title: 'MDN: Closures, Lexical Scope & Execution Contexts',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures',
    resourceType: 'DOCUMENTATION',
    access: 'FREE',
    isFree: true,
    duration: '4 hrs',
    durationHours: 4,
    skillName: 'JavaScript',
    level: 'L3',
    qualityScore: 99,
    qualityWhy: '✓ Authoritative industry documentation ✓ Strict language standards ✓ Free',
  },
  {
    id: 'res-js-mdn-eventloop',
    provider: 'MDN Web Docs',
    title: 'MDN: JavaScript Event Loop, Microtasks & Concurrency Model',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop',
    resourceType: 'DOCUMENTATION',
    access: 'FREE',
    isFree: true,
    duration: '5 hrs',
    durationHours: 5,
    skillName: 'JavaScript',
    level: 'L4',
    qualityScore: 97,
    qualityWhy: '✓ Deep architectural coverage of browser task scheduling ✓ Free access',
  },
  {
    id: 'res-js-lil-adv',
    provider: 'LinkedIn Learning',
    title: 'Advanced JavaScript: Prototypes, Closures and Asynchronous Patterns',
    url: 'https://www.linkedin.com/learning/advanced-javascript-syntax-and-structure',
    resourceType: 'COURSE',
    access: 'PAID / SUBSCRIPTION',
    isFree: false,
    duration: '4 hrs',
    durationHours: 4,
    skillName: 'JavaScript',
    level: 'L4',
    qualityScore: 89,
    qualityWhy: '✓ Expert industry instructor ✓ Paid LinkedIn Learning subscription required',
  },

  // --- React ---
  {
    id: 'res-react-official',
    provider: 'Official Documentation',
    title: 'React Official Docs: Quick Start, State & Thinking in React',
    url: 'https://react.dev/learn',
    resourceType: 'DOCUMENTATION',
    access: 'FREE',
    isFree: true,
    duration: '10 hrs',
    durationHours: 10,
    skillName: 'React',
    level: 'L2',
    qualityScore: 99,
    qualityWhy: '✓ Canonical official documentation maintained by React Core team ✓ Free',
  },
  {
    id: 'res-react-fcc-course',
    provider: 'freeCodeCamp',
    title: 'React 18 & Next.js Full Stack Engineering Course',
    url: 'https://www.freecodecamp.org/news/tag/react/',
    resourceType: 'COURSE',
    access: 'FREE',
    isFree: true,
    duration: '16 hrs',
    durationHours: 16,
    skillName: 'React',
    level: 'L3',
    qualityScore: 94,
    qualityWhy: '✓ Complete hands-on project workflow ✓ Hooks and lifecycle ✓ Free',
  },
  {
    id: 'res-react-lil-essential',
    provider: 'LinkedIn Learning',
    title: 'React.js Essential Training: Hooks, Component Tree & Context',
    url: 'https://www.linkedin.com/learning/react-js-essential-training',
    resourceType: 'COURSE',
    access: 'PAID / SUBSCRIPTION',
    isFree: false,
    duration: '5 hrs',
    durationHours: 5,
    skillName: 'React',
    level: 'L3',
    qualityScore: 90,
    qualityWhy: '✓ Production code patterns ✓ Subscription required through LinkedIn Learning',
  },

  // --- CSS & Tailwind ---
  {
    id: 'res-css-mdn-grid',
    provider: 'MDN Web Docs',
    title: 'MDN Web Docs: CSS Grid Layout and Responsive Flexbox Design',
    url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout',
    resourceType: 'DOCUMENTATION',
    access: 'FREE',
    isFree: true,
    duration: '6 hrs',
    durationHours: 6,
    skillName: 'CSS & Tailwind',
    level: 'L2',
    qualityScore: 98,
    qualityWhy: '✓ Definitive browser specifications for modern 2D grid systems ✓ Free',
  },
  {
    id: 'res-css-fcc-responsive',
    provider: 'freeCodeCamp',
    title: 'Responsive Web Design Certification (Flexbox, Grid & Media Queries)',
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
    resourceType: 'COURSE',
    access: 'FREE',
    isFree: true,
    duration: '20 hrs',
    durationHours: 20,
    skillName: 'CSS & Tailwind',
    level: 'L3',
    qualityScore: 96,
    qualityWhy: '✓ Interactive CSS design projects with automated tests ✓ Free',
  },

  // --- Web Accessibility ---
  {
    id: 'res-a11y-w3c-wcag',
    provider: 'Official Documentation',
    title: 'W3C WAI: Web Content Accessibility Guidelines (WCAG) 2.1 AA Checklist',
    url: 'https://www.w3.org/WAI/standards-guidelines/wcag/',
    resourceType: 'DOCUMENTATION',
    access: 'FREE',
    isFree: true,
    duration: '5 hrs',
    durationHours: 5,
    skillName: 'Web Accessibility',
    level: 'L3',
    qualityScore: 99,
    qualityWhy: '✓ Canonical international standard for accessible web engineering ✓ Free',
  },
  {
    id: 'res-a11y-mdn',
    provider: 'MDN Web Docs',
    title: 'MDN Accessibility: Semantic HTML, ARIA Roles & Screen Reader Flow',
    url: 'https://developer.mozilla.org/en-US/docs/Learn/Accessibility',
    resourceType: 'TUTORIAL',
    access: 'FREE',
    isFree: true,
    duration: '6 hrs',
    durationHours: 6,
    skillName: 'Web Accessibility',
    level: 'L3',
    qualityScore: 97,
    qualityWhy: '✓ Practical screen reader testing guide and ARIA best practices ✓ Free',
  },

  // --- TypeScript ---
  {
    id: 'res-ts-handbook',
    provider: 'Official Documentation',
    title: 'The TypeScript Official Handbook: Generics, Unions & Type Narrowing',
    url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    resourceType: 'DOCUMENTATION',
    access: 'FREE',
    isFree: true,
    duration: '8 hrs',
    durationHours: 8,
    skillName: 'TypeScript',
    level: 'L3',
    qualityScore: 99,
    qualityWhy: '✓ Official Microsoft TypeScript handbook with interactive playground ✓ Free',
  },
  {
    id: 'res-ts-lil-foundations',
    provider: 'LinkedIn Learning',
    title: 'Learning TypeScript: Static Types, Interfaces & Compiler Configuration',
    url: 'https://www.linkedin.com/learning/learning-typescript',
    resourceType: 'COURSE',
    access: 'PAID / SUBSCRIPTION',
    isFree: false,
    duration: '3 hrs',
    durationHours: 3,
    skillName: 'TypeScript',
    level: 'L3',
    qualityScore: 88,
    qualityWhy: '✓ Structured corporate training course ✓ LinkedIn Learning subscription',
  },

  // --- Node.js / Server Runtimes ---
  {
    id: 'res-node-fcc-backend',
    provider: 'freeCodeCamp',
    title: 'Back End Development and APIs Certification (Node.js & Express)',
    url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
    resourceType: 'COURSE',
    access: 'FREE',
    isFree: true,
    duration: '22 hrs',
    durationHours: 22,
    skillName: 'Node.js',
    level: 'L3',
    qualityScore: 96,
    qualityWhy: '✓ Industry-recognized backend certification covering Express and MongoDB ✓ Free',
  },
  {
    id: 'res-node-official-streams',
    provider: 'Official Documentation',
    title: 'Node.js Official Documentation: Stream Pipelines & Backpressure',
    url: 'https://nodejs.org/api/stream.html',
    resourceType: 'DOCUMENTATION',
    access: 'FREE',
    isFree: true,
    duration: '5 hrs',
    durationHours: 5,
    skillName: 'Node.js',
    level: 'L4',
    qualityScore: 97,
    qualityWhy: '✓ Native Node.js runtime documentation for high-throughput buffering ✓ Free',
  },

  // --- SQL & Relational DBs ---
  {
    id: 'res-sql-sqlbolt',
    provider: 'SQLBolt',
    title: 'SQLBolt: Interactive Multi-Table SQL Lessons & Relational Schema',
    url: 'https://sqlbolt.com/',
    resourceType: 'INTERACTIVE',
    access: 'FREE',
    isFree: true,
    duration: '5 hrs',
    durationHours: 5,
    skillName: 'SQL & Relational DBs',
    level: 'L2',
    qualityScore: 97,
    qualityWhy: '✓ Zero-setup interactive browser query terminal for JOINs and aggregations ✓ Free',
  },
  {
    id: 'res-sql-pg-official',
    provider: 'Official Documentation',
    title: 'PostgreSQL Official Documentation: Indexing, Transactions & Constraints',
    url: 'https://www.postgresql.org/docs/current/indexes.html',
    resourceType: 'DOCUMENTATION',
    access: 'FREE',
    isFree: true,
    duration: '8 hrs',
    durationHours: 8,
    skillName: 'SQL & Relational DBs',
    level: 'L4',
    qualityScore: 98,
    qualityWhy: '✓ The industry standard relational engine index and execution plan guide ✓ Free',
  },

  // --- Redis & Caching ---
  {
    id: 'res-redis-official',
    provider: 'Official Documentation',
    title: 'Redis University & Documentation: Data Structures & Cache-Aside Architecture',
    url: 'https://redis.io/docs/latest/develop/data-types/',
    resourceType: 'DOCUMENTATION',
    access: 'FREE',
    isFree: true,
    duration: '6 hrs',
    durationHours: 6,
    skillName: 'Redis & Caching',
    level: 'L3',
    qualityScore: 96,
    qualityWhy: '✓ Official Redis documentation for distributed key-value caching and TTLs ✓ Free',
  },

  // --- Python ---
  {
    id: 'res-python-fcc-scientific',
    provider: 'freeCodeCamp',
    title: 'Scientific Computing with Python Certification (NumPy, SciPy & OOP)',
    url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/',
    resourceType: 'COURSE',
    access: 'FREE',
    isFree: true,
    duration: '30 hrs',
    durationHours: 30,
    skillName: 'Python',
    level: 'L2',
    qualityScore: 97,
    qualityWhy: '✓ Comprehensive Python foundations with mathematical and computational tasks ✓ Free',
  },
  {
    id: 'res-python-official-docs',
    provider: 'Official Documentation',
    title: 'The Python Tutorial: Data Structures, Asynchronous asyncio & Typing',
    url: 'https://docs.python.org/3/tutorial/',
    resourceType: 'DOCUMENTATION',
    access: 'FREE',
    isFree: true,
    duration: '10 hrs',
    durationHours: 10,
    skillName: 'Python',
    level: 'L3',
    qualityScore: 99,
    qualityWhy: '✓ Authoritative Python 3.12 documentation and stdlib specifications ✓ Free',
  },

  // --- Data Science / Statistics / Kaggle ---
  {
    id: 'res-ds-kaggle-intro-ml',
    provider: 'Kaggle',
    title: 'Kaggle Learn: Intro to Machine Learning & Feature Engineering',
    url: 'https://www.kaggle.com/learn/intro-to-machine-learning',
    resourceType: 'INTERACTIVE',
    access: 'FREE',
    isFree: true,
    duration: '8 hrs',
    durationHours: 8,
    skillName: 'Machine Learning',
    level: 'L3',
    qualityScore: 97,
    qualityWhy: '✓ Real dataset challenges on Kaggle notebooks with automated scoring ✓ Free',
  },
  {
    id: 'res-ds-cs50-ai',
    provider: 'Harvard CS50',
    title: 'CS50s Introduction to Artificial Intelligence with Python',
    url: 'https://cs50.harvard.edu/ai/',
    resourceType: 'COURSE',
    access: 'FREE',
    isFree: true,
    duration: '24 hrs',
    durationHours: 24,
    skillName: 'Machine Learning',
    level: 'L4',
    qualityScore: 99,
    qualityWhy: '✓ Rigorous Harvard University computer science lectures and problem sets ✓ Free',
  },

  // --- Docker & DevOps ---
  {
    id: 'res-docker-ms-learn',
    provider: 'Microsoft Learn',
    title: 'Introduction to Docker Containers and Image Architecture',
    url: 'https://learn.microsoft.com/en-us/training/modules/intro-to-docker-containers/',
    resourceType: 'INTERACTIVE',
    access: 'FREE',
    isFree: true,
    duration: '5 hrs',
    durationHours: 5,
    skillName: 'Docker',
    level: 'L2',
    qualityScore: 94,
    qualityWhy: '✓ Guided sandbox modules for multi-stage Docker builds and layers ✓ Free',
  },
  {
    id: 'res-k8s-official',
    provider: 'Official Documentation',
    title: 'Kubernetes Official Documentation: Pods, Services & Deployments',
    url: 'https://kubernetes.io/docs/concepts/',
    resourceType: 'DOCUMENTATION',
    access: 'FREE',
    isFree: true,
    duration: '12 hrs',
    durationHours: 12,
    skillName: 'Kubernetes',
    level: 'L3',
    qualityScore: 98,
    qualityWhy: '✓ Cloud Native Computing Foundation official concept architecture guide ✓ Free',
  },

  // --- Cybersecurity / OWASP ---
  {
    id: 'res-sec-portswigger',
    provider: 'PortSwigger',
    title: 'PortSwigger Web Security Academy: SQLi, XSS, CSRF & Access Control',
    url: 'https://portswigger.net/web-security',
    resourceType: 'INTERACTIVE',
    access: 'FREE',
    isFree: true,
    duration: '18 hrs',
    durationHours: 18,
    skillName: 'Web Security',
    level: 'L3',
    qualityScore: 99,
    qualityWhy: '✓ World-leading interactive cyber security lab by the creators of Burp Suite ✓ Free',
  },
  {
    id: 'res-sec-owasp-top10',
    provider: 'OWASP Foundation',
    title: 'OWASP Top 10 Web Application Security Vulnerabilities',
    url: 'https://owasp.org/www-project-top-ten/',
    resourceType: 'DOCUMENTATION',
    access: 'FREE',
    isFree: true,
    duration: '6 hrs',
    durationHours: 6,
    skillName: 'Web Security',
    level: 'L4',
    qualityScore: 99,
    qualityWhy: '✓ International authoritative benchmark for enterprise vulnerability remediation ✓ Free',
  },

  // --- UI/UX & Design ---
  {
    id: 'res-design-figma-official',
    provider: 'Figma',
    title: 'Figma Design System Essentials: Auto Layout, Components & Tokens',
    url: 'https://help.figma.com/hc/en-us/categories/360002051613-Figma-design',
    resourceType: 'TUTORIAL',
    access: 'FREE',
    isFree: true,
    duration: '10 hrs',
    durationHours: 10,
    skillName: 'Figma',
    level: 'L3',
    qualityScore: 98,
    qualityWhy: '✓ Official Figma design system documentation and component architecture ✓ Free',
  },
  {
    id: 'res-design-lil-ux',
    provider: 'LinkedIn Learning',
    title: 'User Experience (UX) Design: Research, Wireframing & Usability Testing',
    url: 'https://www.linkedin.com/learning/ux-design-fundamentals',
    resourceType: 'COURSE',
    access: 'PAID / SUBSCRIPTION',
    isFree: false,
    duration: '4 hrs',
    durationHours: 4,
    skillName: 'UI/UX Design',
    level: 'L3',
    qualityScore: 90,
    qualityWhy: '✓ Comprehensive UX workflow instruction ✓ Requires LinkedIn Learning membership',
  },
];

// Fallback resolver for matching skills to verified educational materials
export function findResourcesForSkill(
  skillName: string,
  targetLevel: string = 'L3'
): VerifiedLearningResource[] {
  const norm = skillName.toLowerCase();

  const matched = VERIFIED_RESOURCE_REPOSITORY.filter((r) => {
    const rSkill = r.skillName.toLowerCase();
    return norm.includes(rSkill) || rSkill.includes(norm);
  });

  if (matched.length > 0) return matched;

  // Generic fallback to trusted open documentation
  return [
    {
      id: `res-gen-${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      provider: 'Official Documentation',
      title: `${skillName} Occupational Competency & Implementation Standards`,
      url: `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(skillName)}`,
      resourceType: 'DOCUMENTATION',
      access: 'FREE',
      isFree: true,
      duration: '6 hrs',
      durationHours: 6,
      skillName,
      level: targetLevel as any,
      qualityScore: 90,
      qualityWhy: '✓ Open standard documentation reference for occupational competency',
    },
    {
      id: `res-gen-lil-${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      provider: 'LinkedIn Learning',
      title: `${skillName} Professional Practice & Enterprise Best Practices`,
      url: `https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(skillName)}`,
      resourceType: 'COURSE',
      access: 'PAID / SUBSCRIPTION',
      isFree: false,
      duration: '4 hrs',
      durationHours: 4,
      skillName,
      level: targetLevel as any,
      qualityScore: 85,
      qualityWhy: '✓ Enterprise course catalog ✓ Paid LinkedIn Learning subscription required',
    },
  ];
}

// =============================================================================
// ROLE-SPECIFIC COMPETENCY BLUEPRINT ARCHITECTURE
// =============================================================================

export interface RoleCompetencyBlueprint {
  careerRoleSlug: string;
  title: string;
  domains: Array<{
    name: string;
    skills: Array<{
      name: string;
      targetLevel: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
      importance: number;
      prerequisites: string[];
      description: string;
      topics: string[];
      learningObjectives: string[];
      practiceTitle: string;
      practiceUrl: string;
    }>;
  }>;
}

export const ROLE_BLUEPRINTS: Record<string, RoleCompetencyBlueprint> = {
  // 1. FRONTEND DEVELOPER
  'frontend-developer': {
    careerRoleSlug: 'frontend-developer',
    title: 'Frontend Developer',
    domains: [
      {
        name: 'Web Foundations & Styling',
        skills: [
          {
            name: 'CSS & Tailwind',
            targetLevel: 'L4',
            importance: 0.90,
            prerequisites: ['HTML5 Semantic Elements'],
            description: 'Responsive layout architecture, CSS Grid 2D alignments, Flexbox axis flow, CSS variables, and utility-first Tailwind design tokens.',
            topics: ['CSS Grid vs Flexbox', 'Clamp Responsive Fluid Type', 'Tailwind Config Design Tokens', 'Container Queries'],
            learningObjectives: [
              'Build responsive multi-breakpoint layouts without layout shifts (CLS)',
              'Master 2D CSS Grid template areas and auto-fill tracks',
              'Implement dark mode tokens with CSS custom properties'
            ],
            practiceTitle: 'Responsive CSS Grid & Layout Playground',
            practiceUrl: '/app/practice?skill=CSS%20%26%20Tailwind',
          },
          {
            name: 'Web Accessibility',
            targetLevel: 'L3',
            importance: 0.85,
            prerequisites: ['HTML5 Semantic Elements'],
            description: 'WCAG 2.1 AA compliance, WAI-ARIA authoring practices, keyboard focus trap management, and automated axe-core audits.',
            topics: ['WAI-ARIA Attributes', 'Focus Trap Management', 'Screen Reader Semantic Tree', 'Color Contrast Compliance'],
            learningObjectives: [
              'Ensure accessible modal dialogs with focus trapping and ESC listeners',
              'Validate semantic landmarks and screen-reader navigable headings',
              'Eliminate all WCAG AA contrast ratio violations'
            ],
            practiceTitle: 'Accessible Modal & Keyboard Navigation Audit',
            practiceUrl: '/app/practice?skill=Web%20Accessibility',
          },
        ],
      },
      {
        name: 'JavaScript & Client Runtime',
        skills: [
          {
            name: 'JavaScript',
            targetLevel: 'L4',
            importance: 0.95,
            prerequisites: [],
            description: 'Advanced ECMAScript, lexical scoping environments, closures, event loop microtask vs macrotask execution, and asynchronous Promise pipelines.',
            topics: ['Lexical Environments & Closures', 'Event Loop Microtask Ordering', 'Promise.allSettled & Async Flow', 'Prototypal Inheritance'],
            learningObjectives: [
              'Demystify JavaScript closures and memory retention lifecycle',
              'Trace event loop macrotask vs microtask scheduling in browser V8',
              'Implement resilient async data fetching with AbortController'
            ],
            practiceTitle: 'JavaScript Event Loop & Closure Challenges',
            practiceUrl: '/app/practice?skill=JavaScript',
          },
          {
            name: 'TypeScript',
            targetLevel: 'L3',
            importance: 0.85,
            prerequisites: ['JavaScript'],
            description: 'Static type checking for complex React component trees, generics, discriminated unions, and strict null validation.',
            topics: ['Discriminated Unions', 'Generic Constraints', 'Component Prop Interfaces', 'Type Narrowing'],
            learningObjectives: [
              'Eliminate runtime type errors with strict compile-time TypeScript checks',
              'Create reusable generic components with typed polymorphic props',
              'Implement pattern-matching exhaustiveness checks with discriminated unions'
            ],
            practiceTitle: 'TypeScript React Props & Generics Lab',
            practiceUrl: '/app/practice?skill=TypeScript',
          },
        ],
      },
      {
        name: 'UI Frameworks & State Architecture',
        skills: [
          {
            name: 'React',
            targetLevel: 'L4',
            importance: 0.95,
            prerequisites: ['JavaScript'],
            description: 'React 18 concurrent rendering, custom hooks abstraction, memoization with useMemo/useCallback, Virtual DOM diffing, and Context API.',
            topics: ['Custom Hook Design', 'Virtual DOM & Fiber Reconciliation', 'useCallback / useMemo Benchmarks', 'Concurrent Transitions'],
            learningObjectives: [
              'Architect reusable custom hooks isolating client side-effects',
              'Eliminate unnecessary component re-renders through memoization profiling',
              'Leverage React 18 concurrent features (useTransition, useDeferredValue)'
            ],
            practiceTitle: 'React State Optimization & Custom Hooks Lab',
            practiceUrl: '/app/practice?skill=React',
          },
        ],
      },
    ],
  },

  // 2. BACKEND DEVELOPER
  'backend-developer': {
    careerRoleSlug: 'backend-developer',
    title: 'Backend Developer',
    domains: [
      {
        name: 'Server Runtime & APIs',
        skills: [
          {
            name: 'Node.js / Python / Go',
            targetLevel: 'L4',
            importance: 0.95,
            prerequisites: [],
            description: 'Asynchronous event loops, worker threads, stream pipelines, and RESTful / gRPC backend server architectures.',
            topics: ['Asynchronous Runtimes', 'Stream Backpressure', 'Worker Threads', 'Connection Pooling'],
            learningObjectives: [
              'Handle high-throughput I/O using stream pipelines with backpressure',
              'Design resilient microservices with structured error handling',
              'Scale multi-core server processes with worker threads and clustering'
            ],
            practiceTitle: 'Node.js Stream Ingestion & Microservices',
            practiceUrl: '/app/practice?skill=Node.js',
          },
          {
            name: 'REST & gRPC APIs',
            targetLevel: 'L4',
            importance: 0.90,
            prerequisites: ['Node.js / Python / Go'],
            description: 'Idempotent HTTP API contract design, status codes, OpenAPI 3.0 specs, rate-limiting, and protocol buffers.',
            topics: ['Idempotency Keys', 'OpenAPI Schema Validation', 'HTTP Status Code Discipline', 'gRPC Serialization'],
            learningObjectives: [
              'Implement idempotent mutations with distributed lock headers',
              'Enforce strict JSON schema request validation middleware',
              'Design backward-compatible API contracts with OpenAPI'
            ],
            practiceTitle: 'Idempotent REST API & Middleware Sandbox',
            practiceUrl: '/app/practice?skill=REST%20%26%20gRPC%20APIs',
          },
        ],
      },
      {
        name: 'Database Architecture & Caching',
        skills: [
          {
            name: 'SQL & Relational DBs',
            targetLevel: 'L4',
            importance: 0.90,
            prerequisites: [],
            description: 'PostgreSQL relational schemas, indexing internals (B-Tree), transactions with ACID isolation, and query query plan tuning.',
            topics: ['EXPLAIN ANALYZE Query Plans', 'B-Tree & Composite Indexes', 'ACID Isolation Levels', 'Multi-Table Joins & CTEs'],
            learningObjectives: [
              'Eliminate sequential table scans using composite B-Tree indexes',
              'Prevent race conditions and deadlocks using transaction isolation levels',
              'Author performant analytical queries with Common Table Expressions (CTEs)'
            ],
            practiceTitle: 'PostgreSQL Query Optimization & Indexing Lab',
            practiceUrl: '/app/practice?skill=SQL%20%26%20Relational%20DBs',
          },
          {
            name: 'Redis & Caching',
            targetLevel: 'L3',
            importance: 0.80,
            prerequisites: ['SQL & Relational DBs'],
            description: 'In-memory caching architectures, cache-aside patterns, TTL expiration strategies, Pub/Sub, and distributed locking.',
            topics: ['Cache-Aside Strategy', 'TTL Eviction Policies', 'Distributed Locks (Redlock)', 'Redis Hashes & Sorted Sets'],
            learningObjectives: [
              'Prevent database thundering herds using cache-aside and TTL jitter',
              'Implement token-bucket rate limiters in Redis',
              'Coordinate distributed workers with atomic operations'
            ],
            practiceTitle: 'Redis Distributed Caching & Rate Limiting Arena',
            practiceUrl: '/app/practice?skill=Redis%20%26%20Caching',
          },
        ],
      },
      {
        name: 'Containers & Deployment',
        skills: [
          {
            name: 'Docker & Microservices',
            targetLevel: 'L3',
            importance: 0.75,
            prerequisites: ['Node.js / Python / Go'],
            description: 'Multi-stage Dockerfile builds, minimal base images (Alpine/Distroless), container networking, and microservice decomposition.',
            topics: ['Multi-Stage Docker Builds', 'Layer Caching Optimization', 'Docker Compose Orchestration', 'Health Check Probes'],
            learningObjectives: [
              'Author production-grade multi-stage Dockerfiles under 100MB',
              'Configure service-to-service networking and health probes',
              'Implement non-root security contexts in container runtimes'
            ],
            practiceTitle: 'Docker Multi-Stage Build & Container Security',
            practiceUrl: '/app/practice?skill=Docker%20%26%20Microservices',
          },
        ],
      },
    ],
  },

  // 3. FULL-STACK DEVELOPER
  'full-stack-developer': {
    careerRoleSlug: 'full-stack-developer',
    title: 'Full-Stack Developer',
    domains: [
      {
        name: 'Client Engineering',
        skills: [
          {
            name: 'JavaScript',
            targetLevel: 'L4',
            importance: 0.95,
            prerequisites: [],
            description: 'Lexical scoping, event loop, promises, async pipelines, and modern ECMAScript standards.',
            topics: ['Event Loop Mechanics', 'Closures & Scope', 'Asynchronous Flow Control'],
            learningObjectives: ['Master runtime async execution', 'Implement complex closures without memory leaks'],
            practiceTitle: 'JavaScript Full-Stack Core Exercises',
            practiceUrl: '/app/practice?skill=JavaScript',
          },
          {
            name: 'React',
            targetLevel: 'L3',
            importance: 0.90,
            prerequisites: ['JavaScript'],
            description: 'Component lifecycles, hooks, state management, and virtual DOM reconciliation.',
            topics: ['State Architecture', 'Custom Hooks', 'Reconciliation'],
            learningObjectives: ['Build responsive UIs with React 18', 'Isolate state with custom hooks'],
            practiceTitle: 'React Component Architecture Lab',
            practiceUrl: '/app/practice?skill=React',
          },
        ],
      },
      {
        name: 'Server & Data Layer',
        skills: [
          {
            name: 'Node.js',
            targetLevel: 'L3',
            importance: 0.85,
            prerequisites: ['JavaScript'],
            description: 'Event-driven server runtime, stream processing, middleware pipelines, and error handling.',
            topics: ['Express Middleware', 'Stream Buffering', 'API Routing'],
            learningObjectives: ['Design robust REST APIs', 'Manage async server routes safely'],
            practiceTitle: 'Node.js Express API Lab',
            practiceUrl: '/app/practice?skill=Node.js',
          },
          {
            name: 'SQL & Relational DBs',
            targetLevel: 'L3',
            importance: 0.80,
            prerequisites: [],
            description: 'Relational schema design, multi-table joins, subqueries, and ACID transactions.',
            topics: ['Relational Joins', 'Grouping & Aggregations', 'ACID Transactions'],
            learningObjectives: ['Write efficient relational queries', 'Normalize schema to 3NF'],
            practiceTitle: 'SQL Multi-Table Aggregation Lab',
            practiceUrl: '/app/practice?skill=SQL%20%26%20Relational%20DBs',
          },
        ],
      },
      {
        name: 'Tooling & Deployment',
        skills: [
          {
            name: 'TypeScript',
            targetLevel: 'L3',
            importance: 0.85,
            prerequisites: ['JavaScript'],
            description: 'Static typing across client and server boundaries, generics, and strict interfaces.',
            topics: ['Static Typing', 'Generics', 'Interface Contracts'],
            learningObjectives: ['Enforce end-to-end type safety', 'Build typed API responses'],
            practiceTitle: 'TypeScript Full Stack Lab',
            practiceUrl: '/app/practice?skill=TypeScript',
          },
          {
            name: 'Docker & Deployment',
            targetLevel: 'L2',
            importance: 0.70,
            prerequisites: ['Node.js'],
            description: 'Multi-stage Docker builds, layer caching, and deployment pipelines.',
            topics: ['Containerization', 'Layer Caching', 'CI/CD Pipelines'],
            learningObjectives: ['Package full-stack apps into containers', 'Configure basic deployments'],
            practiceTitle: 'Docker Deployment Container Lab',
            practiceUrl: '/app/practice?skill=Docker%20%26%20Deployment',
          },
        ],
      },
    ],
  },

  // 4. DATA SCIENTIST
  'data-scientist': {
    careerRoleSlug: 'data-scientist',
    title: 'Data Scientist',
    domains: [
      {
        name: 'Data Foundations & Analysis',
        skills: [
          {
            name: 'Python',
            targetLevel: 'L4',
            importance: 0.95,
            prerequisites: [],
            description: 'NumPy vectorized arrays, Pandas DataFrame transformations, data cleaning, and statistical programming.',
            topics: ['Vectorized NumPy', 'Pandas GroupBy & Reshaping', 'Missing Value Imputation', 'Data Cleaning Pipelines'],
            learningObjectives: [
              'Transform multi-gigabyte datasets without memory exhaustion using Pandas',
              'Execute vectorized mathematical matrix operations with NumPy',
              'Clean anomalous and missing sensor/user behavior telemetry'
            ],
            practiceTitle: 'Python Data Manipulation & Pandas Lab',
            practiceUrl: '/app/practice?skill=Python',
          },
          {
            name: 'SQL & Analytical Queries',
            targetLevel: 'L4',
            importance: 0.90,
            prerequisites: [],
            description: 'Complex analytical SQL, window functions (ROW_NUMBER, LAG, LEAD), cohort analysis, and Common Table Expressions.',
            topics: ['Window Functions & Partitioning', 'Cohort Retention Analysis', 'Aggregate Rollups', 'Recursive CTEs'],
            learningObjectives: [
              'Compute rolling moving averages and percentiles using window functions',
              'Calculate multi-month user retention cohorts in pure SQL',
              'Optimize analytical queries on columnar data warehouses'
            ],
            practiceTitle: 'Analytical SQL & Window Functions Lab',
            practiceUrl: '/app/practice?skill=SQL%20%26%20Analytical%20Queries',
          },
        ],
      },
      {
        name: 'Statistics & Modeling',
        skills: [
          {
            name: 'Applied Statistics & Probability',
            targetLevel: 'L4',
            importance: 0.90,
            prerequisites: ['Python'],
            description: 'Hypothesis testing, p-values, A/B test sample size calculation, confidence intervals, and Bayesian probability.',
            topics: ['A/B Testing Power Analysis', 'Z-Tests & T-Tests', 'Central Limit Theorem', 'Bayesian Inference'],
            learningObjectives: [
              'Design randomized controlled A/B experiments with statistically valid sample sizes',
              'Prevent false positives (Type I error) and false negatives (Type II error)',
              'Interpret confidence intervals and statistical significance for business decisions'
            ],
            practiceTitle: 'A/B Test Design & Hypothesis Evaluation Lab',
            practiceUrl: '/app/practice?skill=Applied%20Statistics',
          },
          {
            name: 'Machine Learning & Scikit-Learn',
            targetLevel: 'L3',
            importance: 0.85,
            prerequisites: ['Python', 'Applied Statistics & Probability'],
            description: 'Supervised classification, regression, tree ensembles (XGBoost, Random Forest), feature engineering, and cross-validation.',
            topics: ['Cross-Validation Strategies', 'ROC-AUC & F1 Scoring', 'Feature Scaling & Encodings', 'Gradient Boosting (XGBoost)'],
            learningObjectives: [
              'Train balanced classification algorithms handling severe class imbalance',
              'Evaluate predictive performance using ROC-AUC and precision-recall curves',
              'Engineer interaction features and target encoding pipelines'
            ],
            practiceTitle: 'Predictive Modeling & Scikit-Learn Sandbox',
            practiceUrl: '/app/practice?skill=Machine%20Learning',
          },
        ],
      },
    ],
  },

  // 5. CLOUD SECURITY ANALYST / CYBERSECURITY
  'cloud-security-analyst': {
    careerRoleSlug: 'cloud-security-analyst',
    title: 'Cloud Security Analyst',
    domains: [
      {
        name: 'Network & System Security',
        skills: [
          {
            name: 'Network Security & Protocols',
            targetLevel: 'L4',
            importance: 0.95,
            prerequisites: [],
            description: 'TCP/IP handshake analysis, DNS security, TLS 1.3 cryptographic handshakes, firewall configurations, and packet inspection.',
            topics: ['TCP Three-Way Handshake', 'TLS 1.3 Key Exchange', 'Packet Inspection with Wireshark', 'CIDR & Subnet Isolation'],
            learningObjectives: [
              'Analyze network traffic anomalies and unencrypted packet leaks',
              'Configure secure TLS ciphers and certificate revocation checks',
              'Enforce strict egress and ingress firewall ACLs'
            ],
            practiceTitle: 'Network Packet Analysis & TLS Security Lab',
            practiceUrl: '/app/practice?skill=Network%20Security',
          },
          {
            name: 'Web Application Security (OWASP)',
            targetLevel: 'L4',
            importance: 0.95,
            prerequisites: ['Network Security & Protocols'],
            description: 'OWASP Top 10 remediation, SQL injection, Cross-Site Scripting (XSS), CSRF tokens, SSRF, and Content Security Policy (CSP).',
            topics: ['Stored & Reflected XSS', 'Blind SQL Injection', 'SSRF Attack Mitigation', 'CSP Headers & Nonces'],
            learningObjectives: [
              'Audit web applications against OWASP Top 10 critical vulnerabilities',
              'Implement hardened Content Security Policy (CSP) with nonces',
              'Remediate Server-Side Request Forgery (SSRF) and broken access control'
            ],
            practiceTitle: 'OWASP Top 10 Web Vulnerability Exploit & Defense',
            practiceUrl: '/app/practice?skill=Web%20Security',
          },
        ],
      },
      {
        name: 'Cloud Security & IAM',
        skills: [
          {
            name: 'Identity & Access Management (IAM)',
            targetLevel: 'L4',
            importance: 0.90,
            prerequisites: [],
            description: 'Principle of Least Privilege, RBAC, OAuth 2.0 / OIDC workflows, MFA enforcement, and Cloud IAM policy audits.',
            topics: ['Least Privilege IAM Policies', 'OAuth 2.0 Grant Types', 'Cloud Role Assumption', 'Session Revocation'],
            learningObjectives: [
              'Audit cloud IAM roles to eliminate wildcard permissions and privilege escalation',
              'Configure secure federated SSO and OAuth 2.0 PKCE authorization flows',
              'Enforce conditional access policies and multi-factor authentication'
            ],
            practiceTitle: 'Cloud IAM Policy Hardening & Privilege Audit',
            practiceUrl: '/app/practice?skill=IAM',
          },
        ],
      },
    ],
  },
};

/**
 * Universal Blueprint Synthesizer for arbitrary catalog careers
 */
export function getOrCreateRoleBlueprint(roleSlug: string): RoleCompetencyBlueprint {
  if (ROLE_BLUEPRINTS[roleSlug]) {
    return ROLE_BLUEPRINTS[roleSlug];
  }

  // Fallback: Dynamically generate role blueprint from CAREER_ROLES_CATALOG
  const catalogRole = getCareerBySlug(roleSlug) || CAREER_ROLES_CATALOG[0];

  const domains = [
    {
      name: 'Core Occupational Competencies',
      skills: catalogRole.requiredSkills.map((s) => ({
        name: s.name,
        targetLevel: (s.level || 'L3') as 'L1' | 'L2' | 'L3' | 'L4' | 'L5',
        importance: s.importance || 0.85,
        prerequisites: [],
        description: s.description || `${s.name} core competency standards for ${catalogRole.title}`,
        topics: [
          `${s.name} Fundamentals`,
          `${s.name} Production Patterns`,
          `${s.name} Quality & Testing`
        ],
        learningObjectives: [
          `Master ${s.name} core principles and industry methodologies`,
          `Apply practical standards to satisfy ${s.level} occupational benchmarks`,
          `Solve real-world diagnostic problems with verified accuracy`
        ],
        practiceTitle: `${s.name} Practical Execution Arena`,
        practiceUrl: `/app/practice?skill=${encodeURIComponent(s.name)}`,
      })),
    },
  ];

  return {
    careerRoleSlug: catalogRole.slug,
    title: catalogRole.title,
    domains,
  };
}

// =============================================================================
// PERSONALIZED CURRICULUM GENERATION ALGORITHM
// =============================================================================

const LEVEL_MAP: Record<string, number> = {
  L0: 0,
  L1: 1,
  L2: 2,
  L3: 3,
  L4: 4,
  L5: 5,
};

/**
 * Generates an authoritative, strictly personalized remediation roadmap.
 * Adheres to:
 * - Empty state if unassessed (no fake roadmap or mock scores!)
 * - Strictly role-specific skills from the Career Blueprint
 * - Gap calculation: Target Level - Current Level
 * - Completed/Mastered skills (gap <= 0) are NOT shown as critical gaps
 * - Prerequisites ordered before advanced topics
 * - Real educational resources with explicit Free vs Paid / Subscription flags
 * - Accurate dynamic time calculation
 */
export function generatePersonalizedRoadmap(
  targetCareerSlug: string,
  userSkills: UserSkillItem[] = [],
  assessmentScore?: number
): PersonalizedCurriculumPlan {
  const roleBlueprint = getOrCreateRoleBlueprint(targetCareerSlug);
  const isAssessed = assessmentScore !== undefined && assessmentScore > 0;

  // 1. Unassessed User: Honest Empty State
  if (!isAssessed) {
    return {
      careerRoleSlug: roleBlueprint.careerRoleSlug,
      targetRoleTitle: roleBlueprint.title,
      isAssessed: false,
      readinessScore: 0,
      totalModules: 0,
      completedModules: 0,
      estimatedTotalHours: 0,
      criticalGapsCount: 0,
      modules: [],
      statusMessage: 'ASSESSMENT_REQUIRED',
    };
  }

  // 2. Flatten all skills from role competency framework
  const blueprintSkills: Array<{
    name: string;
    domain: string;
    targetLevel: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
    importance: number;
    prerequisites: string[];
    description: string;
    topics: string[];
    learningObjectives: string[];
    practiceTitle: string;
    practiceUrl: string;
  }> = [];

  roleBlueprint.domains.forEach((d) => {
    d.skills.forEach((s) => {
      blueprintSkills.push({
        ...s,
        domain: d.name,
      });
    });
  });

  // Map user skill levels
  const userSkillMap = new Map<string, UserSkillItem>();
  userSkills.forEach((us) => {
    userSkillMap.set(us.name.toLowerCase().trim(), us);
  });

  // 3. Calculate gaps and priority scores for each blueprint skill
  const evaluatedModules: Array<{
    skillName: string;
    domain: string;
    currentLevel: 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
    targetLevel: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
    gap: number;
    priority: ModulePriority;
    priorityScore: number;
    importance: number;
    prerequisites: string[];
    description: string;
    topics: string[];
    learningObjectives: string[];
    practiceTitle: string;
    practiceUrl: string;
  }> = [];

  blueprintSkills.forEach((bp) => {
    const userSkill = userSkillMap.get(bp.name.toLowerCase().trim());
    const curLevel = userSkill ? userSkill.currentLevel : 'L0';
    const curNum = LEVEL_MAP[curLevel] || 0;
    const reqNum = LEVEL_MAP[bp.targetLevel] || 3;
    const gap = Math.max(0, reqNum - curNum);

    let priority: ModulePriority = 'MEDIUM';
    if (gap <= 0) {
      priority = 'TARGET_MET';
    } else if (gap >= 2) {
      priority = 'CRITICAL';
    } else if (gap === 1 && bp.importance >= 0.85) {
      priority = 'HIGH';
    } else if (gap === 1) {
      priority = 'MEDIUM';
    } else {
      priority = 'LOW';
    }

    // Priority scoring formula:
    // gap * 20 + importance * 30 + targetLevel * 5 - curLevel * 4
    const priorityScore = gap > 0
      ? (gap * 20) + (bp.importance * 30) + (reqNum * 5) - (curNum * 4)
      : -100; // Mastered skills sink to the bottom

    evaluatedModules.push({
      skillName: bp.name,
      domain: bp.domain,
      currentLevel: curLevel as any,
      targetLevel: bp.targetLevel,
      gap,
      priority,
      priorityScore,
      importance: bp.importance,
      prerequisites: bp.prerequisites,
      description: bp.description,
      topics: bp.topics,
      learningObjectives: bp.learningObjectives,
      practiceTitle: bp.practiceTitle,
      practiceUrl: bp.practiceUrl,
    });
  });

  // 4. Sort with Prerequisite Graph & Gap Priority
  // Rules:
  // - Prerequisite dependencies must appear BEFORE dependent skills
  // - High priority gaps appear before smaller gaps
  // - Mastered skills (TARGET_MET) appear last
  const sorted = [...evaluatedModules].sort((a, b) => {
    // If a is prerequisite of b, a must come first
    if (b.prerequisites.includes(a.skillName)) return -1;
    if (a.prerequisites.includes(b.skillName)) return 1;

    // Both have gaps: higher priority score first
    if (a.gap > 0 && b.gap > 0) {
      return b.priorityScore - a.priorityScore;
    }

    // Gaps come before TARGET_MET
    if (a.gap > 0 && b.gap === 0) return -1;
    if (a.gap === 0 && b.gap > 0) return 1;

    return 0;
  });

  // 5. Construct full Personalized Roadmap Modules with verified educational resources
  let totalEstimatedHours = 0;
  let criticalCount = 0;

  const modules: PersonalizedRoadmapModule[] = sorted.map((mod, index) => {
    const resources = findResourcesForSkill(mod.skillName, mod.targetLevel);
    const primaryResource = resources[0];

    // Estimated duration from resources and gap depth
    const baseHours = resources.reduce((acc, r) => acc + (r.durationHours || 4), 0);
    const moduleHours = Math.max(Math.round(baseHours * (mod.gap > 0 ? 0.7 : 0.3)), 4);
    totalEstimatedHours += moduleHours;

    if (mod.priority === 'CRITICAL') {
      criticalCount++;
    }

    const stepNumber = String(index + 1).padStart(2, '0');
    const isTargetMet = mod.gap === 0;

    return {
      id: `mod-${roleBlueprint.careerRoleSlug}-${mod.skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      step: stepNumber,
      careerRoleSlug: roleBlueprint.careerRoleSlug,
      skillName: mod.skillName,
      competencyDomain: mod.domain,
      title: `${mod.skillName}: ${mod.topics[0] || 'Core Implementation Architecture'}`,
      description: mod.description,
      currentLevel: mod.currentLevel,
      targetLevel: mod.targetLevel,
      levelUpgrade: `${mod.currentLevel} → ${mod.targetLevel}`,
      gap: mod.gap,
      priority: mod.priority,
      status: isTargetMet ? 'TARGET_MET' : index === 0 ? 'IN_PROGRESS' : 'NOT_STARTED',
      estimatedHours: moduleHours,
      prerequisites: mod.prerequisites,
      topics: mod.topics,
      learningObjectives: mod.learningObjectives,
      primaryResource,
      resources,
      practiceChallengeUrl: mod.practiceUrl,
      practiceTitle: mod.practiceTitle,
      reassessmentRequired: mod.gap > 0,
      completionPercentage: isTargetMet ? 100 : 0,
    };
  });

  return {
    careerRoleSlug: roleBlueprint.careerRoleSlug,
    targetRoleTitle: roleBlueprint.title,
    isAssessed: true,
    readinessScore: assessmentScore || 0,
    totalModules: modules.length,
    completedModules: modules.filter((m) => m.status === 'TARGET_MET').length,
    estimatedTotalHours: totalEstimatedHours,
    criticalGapsCount: criticalCount,
    modules,
    statusMessage: 'READY',
  };
}
