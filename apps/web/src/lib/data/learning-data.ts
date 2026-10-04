export interface CuratedResource {
  id: string;
  provider: 'freeCodeCamp' | 'MDN Web Docs' | 'Harvard CS50' | 'MIT OpenCourseWare' | 'NPTEL / SWAYAM' | 'SQLBolt' | 'Microsoft Learn' | 'AWS Skill Builder';
  title: string;
  url: string;
  skillName: string;
  topic: string;
  difficulty: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  contentType: 'COURSE' | 'DOCUMENTATION' | 'TUTORIAL' | 'INTERACTIVE';
  durationHours: number;
  isFree: boolean;
  hasCertificate: boolean;
  description: string;
}

export const CURATED_LEARNING_RESOURCES: CuratedResource[] = [
  // JavaScript & Frontend
  {
    id: 'res-js-001',
    provider: 'freeCodeCamp',
    title: 'JavaScript Algorithms and Data Structures (Comprehensive Certification)',
    url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/',
    skillName: 'JavaScript',
    topic: 'ES6, Functional Programming & Data Structures',
    difficulty: 'L2',
    contentType: 'COURSE',
    durationHours: 30,
    isFree: true,
    hasCertificate: true,
    description: 'Master core JavaScript programming fundamentals, array methods, recursion, and object-oriented programming with interactive coding challenges.'
  },
  {
    id: 'res-js-002',
    provider: 'MDN Web Docs',
    title: 'MDN Guide: Closures, Scope, and Execution Contexts',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures',
    skillName: 'JavaScript',
    topic: 'Closures & Scoping',
    difficulty: 'L3',
    contentType: 'DOCUMENTATION',
    durationHours: 3,
    isFree: true,
    hasCertificate: false,
    description: 'The definitive architectural documentation on JavaScript lexical scoping, closure memory lifecycle, and practical closure patterns.'
  },
  {
    id: 'res-react-001',
    provider: 'freeCodeCamp',
    title: 'React 18 & Next.js Full Course: Building Scalable Frontend Systems',
    url: 'https://www.freecodecamp.org/news/tag/react/',
    skillName: 'React',
    topic: 'Hooks, Virtual DOM & State Architecture',
    difficulty: 'L3',
    contentType: 'COURSE',
    durationHours: 18,
    isFree: true,
    hasCertificate: false,
    description: 'Component architecture, custom hooks, useEffect lifecycle synchronization, and performance optimization techniques.'
  },

  // Backend & Node.js
  {
    id: 'res-node-001',
    provider: 'freeCodeCamp',
    title: 'Back End Development and APIs Certification (Node.js & Express)',
    url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
    skillName: 'Node.js',
    topic: 'Express APIs, Middleware & Asynchronous Runtimes',
    difficulty: 'L2',
    contentType: 'COURSE',
    durationHours: 25,
    isFree: true,
    hasCertificate: true,
    description: 'Learn how to write backend services with Node.js and Express, implement routing, parse requests, and handle errors.'
  },

  // SQL & Databases
  {
    id: 'res-sql-001',
    provider: 'SQLBolt',
    title: 'SQLBolt: Interactive Relational SQL Lessons',
    url: 'https://sqlbolt.com',
    skillName: 'SQL & Relational DBs',
    topic: 'Relational Schema, Joins, Aggregation & Queries',
    difficulty: 'L2',
    contentType: 'INTERACTIVE',
    durationHours: 6,
    isFree: true,
    hasCertificate: false,
    description: 'Interactive in-browser lessons teaching SELECT queries, filtering, multi-table joins, subqueries, and table normalization.'
  },
  {
    id: 'res-cs50-001',
    provider: 'Harvard CS50',
    title: 'CS50x: Introduction to Computer Science',
    url: 'https://cs50.harvard.edu/x/',
    skillName: 'Git & GitHub',
    topic: 'Computer Science Foundations, Algorithms & Memory',
    difficulty: 'L1',
    contentType: 'COURSE',
    durationHours: 40,
    isFree: true,
    hasCertificate: true,
    description: 'Harvard University\'s renowned foundational course covering algorithms, data structures, resource management, and software engineering.'
  },

  // Cloud & DevOps
  {
    id: 'res-docker-001',
    provider: 'Microsoft Learn',
    title: 'Introduction to Containers & Docker Image Workflows',
    url: 'https://learn.microsoft.com/en-us/training/modules/intro-to-docker-containers/',
    skillName: 'Docker & Deployment',
    topic: 'Containerization, Dockerfiles & Orchestration',
    difficulty: 'L2',
    contentType: 'TUTORIAL',
    durationHours: 5,
    isFree: true,
    hasCertificate: true,
    description: 'Understand container isolation, Docker daemon architecture, multi-stage builds, and running containers in production.'
  },

  // Data & Machine Learning
  {
    id: 'res-mit-001',
    provider: 'MIT OpenCourseWare',
    title: 'MIT 6.0002: Introduction to Computational Thinking and Data Science',
    url: 'https://ocw.mit.edu/courses/6-0002-introduction-to-computational-thinking-and-data-science-fall-2016/',
    skillName: 'Python & R',
    topic: 'Stochastic Programs, Optimization & Machine Learning',
    difficulty: 'L3',
    contentType: 'COURSE',
    durationHours: 35,
    isFree: true,
    hasCertificate: false,
    description: 'Full lecture videos and problem sets from MIT covering probability models, simulations, clustering, and data analysis.'
  },

  // Indian Open Curricula (NPTEL / SWAYAM)
  {
    id: 'res-nptel-001',
    provider: 'NPTEL / SWAYAM',
    title: 'NPTEL: Database Management Systems (IIT Kharagpur)',
    url: 'https://swayam.gov.in/explorer?category=Computer%20Science%20and%20Engineering',
    skillName: 'SQL & Relational DBs',
    topic: 'ACID Properties, Normal Forms & Query Processing',
    difficulty: 'L3',
    contentType: 'COURSE',
    durationHours: 30,
    isFree: true,
    hasCertificate: true,
    description: 'Comprehensive college-accredited database course authored by IIT professors covering relational algebra, B-trees, and concurrency.'
  }
];

export function getResourcesForSkill(skillName: string): CuratedResource[] {
  return CURATED_LEARNING_RESOURCES.filter(
    (r) => r.skillName.toLowerCase().includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(r.skillName.toLowerCase())
  );
}
