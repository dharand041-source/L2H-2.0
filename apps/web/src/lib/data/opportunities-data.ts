export interface OpportunityItem {
  id: string;
  externalId: string;
  source: 'ADZUNA' | 'REMOTIVE' | 'JOOBLE' | 'EMPLOYER_PORTAL';
  sourceUrl: string;
  applyUrl: string;
  companyName: string;
  companyLogoText: string;
  title: string;
  roleSlug: string;
  description: string;
  location: string;
  isRemote: boolean;
  employmentType: 'FULL_TIME' | 'INTERNSHIP' | 'STARTUP' | 'REMOTE';
  experienceLevelRequired: string;
  salary: string;
  requiredSkills: string[];
  postedAt: string;
  lastVerifiedAt: string;
}

export const OPPORTUNITIES_CATALOG: OpportunityItem[] = [
  {
    id: 'opp-001',
    externalId: 'adzuna-8491024',
    source: 'ADZUNA',
    sourceUrl: 'https://www.adzuna.com',
    applyUrl: 'https://careers.google.com/jobs/results/',
    companyName: 'CloudScale Infrastructure Labs',
    companyLogoText: 'CSL',
    title: 'Junior Full-Stack Engineer (React / Node.js)',
    roleSlug: 'full-stack-developer',
    description: 'Looking for a junior engineer to join our core product team. You will build distributed cloud dashboards using Next.js, Node.js microservices, and PostgreSQL.',
    location: 'Remote / Bangalore / Hyderabad',
    isRemote: true,
    employmentType: 'FULL_TIME',
    experienceLevelRequired: '0-2 Years',
    salary: '$85,000 - $105,000 / yr',
    requiredSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL & Relational DBs', 'Git & GitHub'],
    postedAt: '2 days ago',
    lastVerifiedAt: 'Verified Today'
  },
  {
    id: 'opp-002',
    externalId: 'remotive-92140',
    source: 'REMOTIVE',
    sourceUrl: 'https://remotive.com',
    applyUrl: 'https://www.zoho.com/careers/',
    companyName: 'Zoho Corporation',
    companyLogoText: 'ZOHO',
    title: 'Frontend Developer - Design Systems',
    roleSlug: 'frontend-developer',
    description: 'Develop enterprise-grade web components, accessible UI systems, and design tokens for thousands of business applications globally.',
    location: 'Chennai / Remote',
    isRemote: true,
    employmentType: 'FULL_TIME',
    experienceLevelRequired: '1-3 Years',
    salary: '₹14,00,000 - ₹20,00,000 / yr',
    requiredSkills: ['JavaScript', 'React', 'CSS & Tailwind', 'TypeScript', 'Web Accessibility'],
    postedAt: '3 days ago',
    lastVerifiedAt: 'Verified Today'
  },
  {
    id: 'opp-003',
    externalId: 'tcs-nqt-2026',
    source: 'EMPLOYER_PORTAL',
    sourceUrl: 'https://www.tcs.com/careers',
    applyUrl: 'https://nextstep.tcs.com/campus/',
    companyName: 'Tata Consultancy Services',
    companyLogoText: 'TCS',
    title: 'Graduate Systems Engineer (Digital / Ninja)',
    roleSlug: 'full-stack-developer',
    description: 'Comprehensive graduate trainee entry track for software engineering graduates. Work across enterprise cloud migration, API development, and data architecture.',
    location: 'Pan India (Mumbai / Pune / Chennai / Bangalore)',
    isRemote: false,
    employmentType: 'INTERNSHIP',
    experienceLevelRequired: 'Fresher / 2025-2026 Batch',
    salary: '₹7,50,000 - ₹11,50,000 / yr',
    requiredSkills: ['JavaScript', 'SQL & Relational DBs', 'Node.js', 'Git & GitHub'],
    postedAt: '1 day ago',
    lastVerifiedAt: 'Verified Yesterday'
  },
  {
    id: 'opp-004',
    externalId: 'yc-startup-9921',
    source: 'EMPLOYER_PORTAL',
    sourceUrl: 'https://www.ycombinator.com/jobs',
    applyUrl: 'https://www.ycombinator.com/jobs',
    companyName: 'AgentFlow AI (YC W25)',
    companyLogoText: 'AF',
    title: 'Founding Agentic AI Engineer',
    roleSlug: 'ai-agentic-ai-engineer',
    description: 'Build autonomous enterprise workflow agents using multi-agent LLM systems, function calling, and vector memory. Equity heavy + competitive compensation.',
    location: 'San Francisco / Remote',
    isRemote: true,
    employmentType: 'STARTUP',
    experienceLevelRequired: '1-4 Years',
    salary: '$120,000 - $160,000 / yr + 1.5% Equity',
    requiredSkills: ['Python', 'LLMs & Prompt Engineering', 'Vector DBs & pgvector', 'Agent Frameworks', 'Tool Calling & APIs'],
    postedAt: 'Just Now',
    lastVerifiedAt: 'Verified 2 hours ago'
  },
  {
    id: 'opp-005',
    externalId: 'muse-81920',
    source: 'JOOBLE',
    sourceUrl: 'https://www.themuse.com',
    applyUrl: 'https://www.amazon.jobs',
    companyName: 'Amazon Web Services (AWS)',
    companyLogoText: 'AWS',
    title: 'Cloud Support Associate / Platform Intern',
    roleSlug: 'devops-platform-engineer',
    description: 'Provide technical assistance on cloud compute, container orchestration, networking, and deployment pipelines for AWS enterprise customers.',
    location: 'Hyderabad / Bangalore',
    isRemote: false,
    employmentType: 'INTERNSHIP',
    experienceLevelRequired: 'Student / Fresher',
    salary: '₹90,000 / month stipend',
    requiredSkills: ['Linux & Bash', 'Docker & Containers', 'CI/CD Pipelines', 'Git & GitHub'],
    postedAt: '4 days ago',
    lastVerifiedAt: 'Verified 1 day ago'
  },
  {
    id: 'opp-006',
    externalId: 'remote-71829',
    source: 'REMOTIVE',
    sourceUrl: 'https://remotive.com',
    applyUrl: 'https://remotive.com',
    companyName: 'Monolith Product Studio',
    companyLogoText: 'MPS',
    title: 'Associate Product Manager',
    roleSlug: 'technical-product-manager',
    description: 'Lead cross-functional agile sprints, author technical PRDs, interface with UX researchers, and track adoption telemetry for SaaS analytics platforms.',
    location: '100% Remote (Global)',
    isRemote: true,
    employmentType: 'REMOTE',
    experienceLevelRequired: '0-2 Years',
    salary: '$80,000 - $100,000 / yr',
    requiredSkills: ['Product Roadmapping & PRDs', 'Technical Literacy & APIs', 'Data & Telemetry Analytics', 'Agile & Scrum Delivery'],
    postedAt: '5 days ago',
    lastVerifiedAt: 'Verified Today'
  }
];

export function getOpportunityById(id: string): OpportunityItem | undefined {
  return OPPORTUNITIES_CATALOG.find((o) => o.id === id);
}
