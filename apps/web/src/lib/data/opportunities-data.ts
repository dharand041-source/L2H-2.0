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
  // 1. Full-Stack Developer
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
    id: 'opp-fs-startup',
    externalId: 'yc-w25-stackflow',
    source: 'EMPLOYER_PORTAL',
    sourceUrl: 'https://www.ycombinator.com/jobs',
    applyUrl: 'https://www.ycombinator.com/jobs',
    companyName: 'StackFlow Engine (YC W25)',
    companyLogoText: 'SF',
    title: 'Full-Stack Founding Engineer',
    roleSlug: 'full-stack-developer',
    description: 'Fast-moving early-stage startup building collaborative developer workflows with React, TypeScript, serverless PostgreSQL, and real-time WebSockets.',
    location: 'Remote / San Francisco',
    isRemote: true,
    employmentType: 'STARTUP',
    experienceLevelRequired: '1-3 Years',
    salary: '$110,000 - $145,000 / yr + 1.0% Equity',
    requiredSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    postedAt: '3 days ago',
    lastVerifiedAt: 'Verified Today'
  },

  // 2. Frontend Developer
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
    id: 'opp-fe-intern',
    externalId: 'adzuna-fe-intern-01',
    source: 'ADZUNA',
    sourceUrl: 'https://www.adzuna.com',
    applyUrl: 'https://careers.swiggy.com',
    companyName: 'Swiggy Delivery Platform',
    companyLogoText: 'SWG',
    title: 'Frontend Engineering Intern (React / Next.js)',
    roleSlug: 'frontend-developer',
    description: 'Join our customer experience web team. Build performant, accessible mobile-first responsive web micro-frontends with high Core Web Vitals scores.',
    location: 'Bangalore / Remote',
    isRemote: true,
    employmentType: 'INTERNSHIP',
    experienceLevelRequired: 'Student / Fresher',
    salary: '₹50,000 / month stipend',
    requiredSkills: ['JavaScript', 'React', 'CSS & Tailwind', 'Web Accessibility'],
    postedAt: '2 days ago',
    lastVerifiedAt: 'Verified Yesterday'
  },
  {
    id: 'opp-fe-startup',
    externalId: 'yc-fe-startup-02',
    source: 'EMPLOYER_PORTAL',
    sourceUrl: 'https://www.ycombinator.com/jobs',
    applyUrl: 'https://www.ycombinator.com/jobs',
    companyName: 'CanvasUI Studio (YC S24)',
    companyLogoText: 'CUI',
    title: 'Frontend UI/UX Systems Engineer',
    roleSlug: 'frontend-developer',
    description: 'Craft high-performance canvas editors and dynamic reactive dashboard interfaces with React, Tailwind, and WebGL.',
    location: 'Remote',
    isRemote: true,
    employmentType: 'STARTUP',
    experienceLevelRequired: '1-4 Years',
    salary: '$100,000 - $135,000 / yr + Equity',
    requiredSkills: ['React', 'TypeScript', 'CSS & Tailwind', 'Performance & Web Vitals'],
    postedAt: 'Just Now',
    lastVerifiedAt: 'Verified Today'
  },

  // 3. Backend Developer
  {
    id: 'opp-be-ft',
    externalId: 'adzuna-be-ft-01',
    source: 'ADZUNA',
    sourceUrl: 'https://www.adzuna.com',
    applyUrl: 'https://careers.phonepe.com',
    companyName: 'PhonePe Financial Systems',
    companyLogoText: 'PPE',
    title: 'Backend Systems Engineer - Payments Core',
    roleSlug: 'backend-developer',
    description: 'Design distributed payment settlement pipelines, high-throughput PostgreSQL query optimization, and low-latency Redis caching clusters.',
    location: 'Bangalore / Pune',
    isRemote: false,
    employmentType: 'FULL_TIME',
    experienceLevelRequired: '1-3 Years',
    salary: '₹18,00,000 - ₹26,00,000 / yr',
    requiredSkills: ['Node.js', 'SQL & Relational DBs', 'Redis Caching & Queues', 'REST & GraphQL APIs', 'Authentication & Security'],
    postedAt: '1 day ago',
    lastVerifiedAt: 'Verified Today'
  },
  {
    id: 'opp-be-intern',
    externalId: 'remotive-be-intern-02',
    source: 'REMOTIVE',
    sourceUrl: 'https://remotive.com',
    applyUrl: 'https://www.postman.com/careers/',
    companyName: 'Postman Inc.',
    companyLogoText: 'POST',
    title: 'Backend API Engineering Intern',
    roleSlug: 'backend-developer',
    description: 'Help develop collaborative API development tooling, mock servers, and webhook ingestion engines using Node.js and PostgreSQL.',
    location: 'Remote (India / Global)',
    isRemote: true,
    employmentType: 'INTERNSHIP',
    experienceLevelRequired: 'Fresher / Entry',
    salary: '₹65,000 / month stipend',
    requiredSkills: ['Node.js', 'REST & GraphQL APIs', 'SQL & Relational DBs'],
    postedAt: '3 days ago',
    lastVerifiedAt: 'Verified Yesterday'
  },
  {
    id: 'opp-be-startup',
    externalId: 'yc-be-startup-03',
    source: 'EMPLOYER_PORTAL',
    sourceUrl: 'https://www.ycombinator.com/jobs',
    applyUrl: 'https://www.ycombinator.com/jobs',
    companyName: 'HyperStream Data (YC W25)',
    companyLogoText: 'HSD',
    title: 'Backend Distributed Systems Engineer',
    roleSlug: 'backend-developer',
    description: 'Build asynchronous event-streaming connectors and transactional state machines using Kafka, Redis, and high-performance Python/Node microservices.',
    location: 'Remote',
    isRemote: true,
    employmentType: 'STARTUP',
    experienceLevelRequired: '1-3 Years',
    salary: '$120,000 - $150,000 / yr + 1.2% Equity',
    requiredSkills: ['Node.js', 'SQL & Relational DBs', 'Redis Caching & Queues', 'Concurrency & Scaling'],
    postedAt: 'Just Now',
    lastVerifiedAt: 'Verified Today'
  },

  // 4. Cybersecurity Architect
  {
    id: 'opp-sec-ft',
    externalId: 'adzuna-sec-ft-01',
    source: 'ADZUNA',
    sourceUrl: 'https://www.adzuna.com',
    applyUrl: 'https://www.paloaltonetworks.com/about-us/careers',
    companyName: 'Palo Alto Enterprise Labs',
    companyLogoText: 'PANW',
    title: 'Enterprise Security Architect - Zero Trust',
    roleSlug: 'cybersecurity-architect',
    description: 'Design cloud identity boundaries, zero-trust network segmentation, STRIDE threat models, and mutual TLS service mesh authentication frameworks.',
    location: 'Bangalore / Remote',
    isRemote: true,
    employmentType: 'FULL_TIME',
    experienceLevelRequired: '2-5 Years',
    salary: '₹28,00,000 - ₹42,00,000 / yr',
    requiredSkills: ['Zero Trust & IAM', 'Network Security', 'Threat Modeling (STRIDE)', 'Cloud Security (AWS/Azure)', 'Cryptography & Key Management'],
    postedAt: '2 days ago',
    lastVerifiedAt: 'Verified Today'
  },
  {
    id: 'opp-sec-intern',
    externalId: 'jooble-sec-intern-02',
    source: 'JOOBLE',
    sourceUrl: 'https://www.jooble.org',
    applyUrl: 'https://www.crowdstrike.com/careers/',
    companyName: 'CrowdStrike Intelligence',
    companyLogoText: 'CRWD',
    title: 'Security Operations & Architecture Trainee',
    roleSlug: 'cybersecurity-architect',
    description: 'Work with the threat intelligence engineering team reviewing cloud IAM policies, auditing VPC peering boundaries, and triaging security anomalies.',
    location: 'Pune / Remote',
    isRemote: true,
    employmentType: 'INTERNSHIP',
    experienceLevelRequired: 'Student / Fresher',
    salary: '₹60,000 / month stipend',
    requiredSkills: ['Zero Trust & IAM', 'Network Security', 'Cloud Security (AWS/Azure)'],
    postedAt: '4 days ago',
    lastVerifiedAt: 'Verified 2 days ago'
  },
  {
    id: 'opp-sec-startup',
    externalId: 'yc-sec-startup-03',
    source: 'EMPLOYER_PORTAL',
    sourceUrl: 'https://www.ycombinator.com/jobs',
    applyUrl: 'https://www.ycombinator.com/jobs',
    companyName: 'ZeroBoundary Security (YC W25)',
    companyLogoText: 'ZBS',
    title: 'Founding Security Infrastructure Engineer',
    roleSlug: 'cybersecurity-architect',
    description: 'Architect automated cloud security posture management (CSPM) and ephemeral IAM credentials for Kubernetes and AWS workloads.',
    location: 'Remote / San Francisco',
    isRemote: true,
    employmentType: 'STARTUP',
    experienceLevelRequired: '1-4 Years',
    salary: '$135,000 - $175,000 / yr + 1.5% Equity',
    requiredSkills: ['Zero Trust & IAM', 'Cloud Security (AWS/Azure)', 'Threat Modeling (STRIDE)'],
    postedAt: 'Just Now',
    lastVerifiedAt: 'Verified Today'
  },

  // 5. Data Scientist
  {
    id: 'opp-ds-ft',
    externalId: 'adzuna-ds-ft-01',
    source: 'ADZUNA',
    sourceUrl: 'https://www.adzuna.com',
    applyUrl: 'https://careers.flipkart.com',
    companyName: 'Flipkart Commerce Labs',
    companyLogoText: 'FLIP',
    title: 'Data Scientist - Pricing & Demand Analytics',
    roleSlug: 'data-scientist',
    description: 'Build predictive pricing algorithms, design randomized A/B experimentation frameworks, and construct customer lifetime value models with Python and SQL.',
    location: 'Bangalore / Remote',
    isRemote: true,
    employmentType: 'FULL_TIME',
    experienceLevelRequired: '1-3 Years',
    salary: '₹18,00,000 - ₹28,00,000 / yr',
    requiredSkills: ['Python', 'Statistics & Hypothesis Testing', 'SQL & Data Wrangling', 'Machine Learning', 'Exploratory Data Analysis & Visualization'],
    postedAt: '2 days ago',
    lastVerifiedAt: 'Verified Today'
  },
  {
    id: 'opp-ds-intern',
    externalId: 'remotive-ds-intern-02',
    source: 'REMOTIVE',
    sourceUrl: 'https://remotive.com',
    applyUrl: 'https://www.mu-sigma.com/careers',
    companyName: 'Mu Sigma Analytics',
    companyLogoText: 'MUS',
    title: 'Junior Data Science Analyst Intern',
    roleSlug: 'data-scientist',
    description: 'Clean high-volume enterprise datasets, author SQL analytical window queries, and build visual EDA dashboards for Fortune 500 decision-makers.',
    location: 'Bangalore',
    isRemote: false,
    employmentType: 'INTERNSHIP',
    experienceLevelRequired: 'Fresher / Entry',
    salary: '₹45,000 / month stipend',
    requiredSkills: ['Python', 'SQL & Data Wrangling', 'Exploratory Data Analysis & Visualization'],
    postedAt: '3 days ago',
    lastVerifiedAt: 'Verified Yesterday'
  },
  {
    id: 'opp-ds-startup',
    externalId: 'yc-ds-startup-03',
    source: 'EMPLOYER_PORTAL',
    sourceUrl: 'https://www.ycombinator.com/jobs',
    applyUrl: 'https://www.ycombinator.com/jobs',
    companyName: 'PredictIQ Health (YC S24)',
    companyLogoText: 'PIQ',
    title: 'Founding Data Scientist & Biostatistician',
    roleSlug: 'data-scientist',
    description: 'Develop survival curves, clinical predictive scoring models, and synthetic patient cohort generators using scikit-learn and PyTorch.',
    location: 'Remote',
    isRemote: true,
    employmentType: 'STARTUP',
    experienceLevelRequired: '1-4 Years',
    salary: '$115,000 - $145,000 / yr + 1.0% Equity',
    requiredSkills: ['Python', 'Statistics & Hypothesis Testing', 'Machine Learning'],
    postedAt: '1 day ago',
    lastVerifiedAt: 'Verified Today'
  },

  // 6. AI / Agentic AI Engineer
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
    id: 'opp-ai-ft',
    externalId: 'adzuna-ai-ft-01',
    source: 'ADZUNA',
    sourceUrl: 'https://www.adzuna.com',
    applyUrl: 'https://careers.microsoft.com',
    companyName: 'Microsoft Cloud & AI',
    companyLogoText: 'MSFT',
    title: 'Agentic AI Solutions Engineer',
    roleSlug: 'ai-agentic-ai-engineer',
    description: 'Engineer enterprise cognitive agent copilot plugins, hybrid vector database retrieval pipelines with Azure OpenAI, and tool invocation security guardrails.',
    location: 'Hyderabad / Bangalore',
    isRemote: true,
    employmentType: 'FULL_TIME',
    experienceLevelRequired: '1-4 Years',
    salary: '₹24,00,000 - ₹38,00,000 / yr',
    requiredSkills: ['Python', 'LLMs & Prompt Engineering', 'Vector DBs & pgvector', 'Agent Frameworks', 'Evaluation & Safety'],
    postedAt: '3 days ago',
    lastVerifiedAt: 'Verified Today'
  },
  {
    id: 'opp-ai-intern',
    externalId: 'remotive-ai-intern-02',
    source: 'REMOTIVE',
    sourceUrl: 'https://remotive.com',
    applyUrl: 'https://cohere.com/careers',
    companyName: 'Cohere Research Labs',
    companyLogoText: 'COH',
    title: 'LLM Agent & Evaluation Intern',
    roleSlug: 'ai-agentic-ai-engineer',
    description: 'Evaluate multi-turn reasoning agents, benchmark RAG precision against hallucination datasets, and implement automated evals with Python.',
    location: 'Remote',
    isRemote: true,
    employmentType: 'INTERNSHIP',
    experienceLevelRequired: 'Student / Entry',
    salary: '$4,500 / month stipend',
    requiredSkills: ['Python', 'LLMs & Prompt Engineering', 'Evaluation & Safety'],
    postedAt: '4 days ago',
    lastVerifiedAt: 'Verified Yesterday'
  },

  // 7. DevOps / Platform Engineer
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
    requiredSkills: ['Linux & Bash', 'Docker & Containers', 'CI/CD Pipelines (GitHub Actions)', 'Git & GitHub'],
    postedAt: '4 days ago',
    lastVerifiedAt: 'Verified 1 day ago'
  },
  {
    id: 'opp-devops-ft',
    externalId: 'adzuna-devops-ft-01',
    source: 'ADZUNA',
    sourceUrl: 'https://www.adzuna.com',
    applyUrl: 'https://careers.razorpay.com',
    companyName: 'Razorpay Payments Infrastructure',
    companyLogoText: 'RZP',
    title: 'Site Reliability & Platform Engineer',
    roleSlug: 'devops-platform-engineer',
    description: 'Operate enterprise multi-cluster Kubernetes environments, automate cloud infrastructure with Terraform, and enforce zero-downtime canary deployment pipelines.',
    location: 'Bangalore / Remote',
    isRemote: true,
    employmentType: 'FULL_TIME',
    experienceLevelRequired: '2-4 Years',
    salary: '₹22,00,000 - ₹34,00,000 / yr',
    requiredSkills: ['Linux & Bash', 'Kubernetes & Helm', 'Terraform & IaC', 'CI/CD Pipelines (GitHub Actions)'],
    postedAt: '2 days ago',
    lastVerifiedAt: 'Verified Today'
  },
  {
    id: 'opp-devops-startup',
    externalId: 'yc-devops-startup-03',
    source: 'EMPLOYER_PORTAL',
    sourceUrl: 'https://www.ycombinator.com/jobs',
    applyUrl: 'https://www.ycombinator.com/jobs',
    companyName: 'InfraPulse (YC W25)',
    companyLogoText: 'INP',
    title: 'DevOps & Cloud Architect',
    roleSlug: 'devops-platform-engineer',
    description: 'Build self-healing cloud staging environments on AWS with Terraform, ArgoCD, and automated ephemeral preview instances for fast-shipping engineering teams.',
    location: 'Remote',
    isRemote: true,
    employmentType: 'STARTUP',
    experienceLevelRequired: '1-3 Years',
    salary: '$115,000 - $145,000 / yr + 1.0% Equity',
    requiredSkills: ['Docker & Containers', 'Kubernetes & Helm', 'Terraform & IaC'],
    postedAt: '1 day ago',
    lastVerifiedAt: 'Verified Today'
  },

  // 8. Technical Product Manager
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
  },
  {
    id: 'opp-pm-ft',
    externalId: 'adzuna-pm-ft-01',
    source: 'ADZUNA',
    sourceUrl: 'https://www.adzuna.com',
    applyUrl: 'https://careers.atlassian.com',
    companyName: 'Atlassian Jira Platform',
    companyLogoText: 'ATLS',
    title: 'Technical Product Manager - Developer Tools',
    roleSlug: 'technical-product-manager',
    description: 'Shape feature roadmaps using RICE prioritization, draft detailed PRDs with technical acceptance criteria, and conduct telemetry cohort analysis.',
    location: 'Bangalore / Remote',
    isRemote: true,
    employmentType: 'FULL_TIME',
    experienceLevelRequired: '2-4 Years',
    salary: '₹25,00,000 - ₹38,00,000 / yr',
    requiredSkills: ['Product Roadmapping & PRDs', 'Technical Literacy & APIs', 'Data & Telemetry Analytics', 'RICE Prioritization'],
    postedAt: '3 days ago',
    lastVerifiedAt: 'Verified Today'
  },
  {
    id: 'opp-pm-intern',
    externalId: 'remotive-pm-intern-02',
    source: 'REMOTIVE',
    sourceUrl: 'https://remotive.com',
    applyUrl: 'https://www.cred.club/careers',
    companyName: 'CRED Product Labs',
    companyLogoText: 'CRED',
    title: 'Product Management Intern (APM Program)',
    roleSlug: 'technical-product-manager',
    description: 'Shadow product leads through sprint grooming, run user research interviews, and analyze micro-conversion funnels in Mixpanel.',
    location: 'Bangalore',
    isRemote: false,
    employmentType: 'INTERNSHIP',
    experienceLevelRequired: 'Fresher / MBA / Eng',
    salary: '₹75,000 / month stipend',
    requiredSkills: ['Product Roadmapping & PRDs', 'Data & Telemetry Analytics', 'Agile & Scrum Delivery'],
    postedAt: '2 days ago',
    lastVerifiedAt: 'Verified Yesterday'
  },

  // 9. UI/UX Designer
  {
    id: 'opp-ux-ft',
    externalId: 'adzuna-ux-ft-01',
    source: 'ADZUNA',
    sourceUrl: 'https://www.adzuna.com',
    applyUrl: 'https://careers.figma.com',
    companyName: 'Figma Design Studio',
    companyLogoText: 'FIG',
    title: 'Product Designer (Design Systems & Components)',
    roleSlug: 'ui-ux-designer',
    description: 'Author multi-platform token architectures, build accessible WCAG-compliant design system primitives, and conduct qualitative usability testing.',
    location: 'Remote',
    isRemote: true,
    employmentType: 'FULL_TIME',
    experienceLevelRequired: '1-3 Years',
    salary: '$95,000 - $125,000 / yr',
    requiredSkills: ['Figma & Design Systems', 'UX Research & Usability Testing', 'Information Architecture & User Flows', 'Web Accessibility (WCAG)'],
    postedAt: '2 days ago',
    lastVerifiedAt: 'Verified Today'
  },
  {
    id: 'opp-ux-intern',
    externalId: 'jooble-ux-intern-02',
    source: 'JOOBLE',
    sourceUrl: 'https://www.jooble.org',
    applyUrl: 'https://careers.zomato.com',
    companyName: 'Zomato Design Hub',
    companyLogoText: 'ZOM',
    title: 'UI/UX Design Intern (Consumer App)',
    roleSlug: 'ui-ux-designer',
    description: 'Collaborate with product designers authoring interactive micro-prototypes, wireframes, and customer journey maps in Figma.',
    location: 'Gurgaon / Remote',
    isRemote: true,
    employmentType: 'INTERNSHIP',
    experienceLevelRequired: 'Student / Portfolio',
    salary: '₹40,000 / month stipend',
    requiredSkills: ['Figma & Design Systems', 'Wireframing & Interactive Prototyping'],
    postedAt: '4 days ago',
    lastVerifiedAt: 'Verified 2 days ago'
  },
  {
    id: 'opp-ux-startup',
    externalId: 'yc-ux-startup-03',
    source: 'EMPLOYER_PORTAL',
    sourceUrl: 'https://www.ycombinator.com/jobs',
    applyUrl: 'https://www.ycombinator.com/jobs',
    companyName: 'PulseStudio AI (YC W25)',
    companyLogoText: 'PS',
    title: 'Founding Product Designer',
    roleSlug: 'ui-ux-designer',
    description: 'Lead visual design, interactive design tokens, and user testing loops for an AI-native creative collaboration tool.',
    location: 'Remote',
    isRemote: true,
    employmentType: 'STARTUP',
    experienceLevelRequired: '1-4 Years',
    salary: '$105,000 - $135,000 / yr + 1.2% Equity',
    requiredSkills: ['Figma & Design Systems', 'UX Research & Usability Testing', 'Wireframing & Interactive Prototyping'],
    postedAt: 'Just Now',
    lastVerifiedAt: 'Verified Today'
  },

  // 10. Digital Marketing Specialist
  {
    id: 'opp-mkt-ft',
    externalId: 'adzuna-mkt-ft-01',
    source: 'ADZUNA',
    sourceUrl: 'https://www.adzuna.com',
    applyUrl: 'https://careers.hubspot.com',
    companyName: 'HubSpot Inbound Marketing',
    companyLogoText: 'HUBS',
    title: 'Growth Marketing & Technical SEO Specialist',
    roleSlug: 'digital-marketing-specialist',
    description: 'Lead multi-channel organic acquisition, canonical indexation audits, landing page conversion rate optimization (CRO), and GA4 event attribution modeling.',
    location: 'Remote (US / India)',
    isRemote: true,
    employmentType: 'FULL_TIME',
    experienceLevelRequired: '1-3 Years',
    salary: '$75,000 - $95,000 / yr',
    requiredSkills: ['SEO & Organic Growth', 'Conversion Rate Optimization (CRO)', 'Web Analytics (GA4) & Tracking'],
    postedAt: '3 days ago',
    lastVerifiedAt: 'Verified Today'
  },
  {
    id: 'opp-mkt-intern',
    externalId: 'remotive-mkt-intern-02',
    source: 'REMOTIVE',
    sourceUrl: 'https://remotive.com',
    applyUrl: 'https://groww.in/careers',
    companyName: 'Groww Financial Services',
    companyLogoText: 'GRW',
    title: 'Growth & Content Marketing Intern',
    roleSlug: 'digital-marketing-specialist',
    description: 'Execute SEO keyword gap research, author financial education content, and track search console ranking velocity.',
    location: 'Bangalore',
    isRemote: false,
    employmentType: 'INTERNSHIP',
    experienceLevelRequired: 'Student / Fresher',
    salary: '₹35,000 / month stipend',
    requiredSkills: ['SEO & Organic Growth', 'Copywriting & Content Strategy'],
    postedAt: '5 days ago',
    lastVerifiedAt: 'Verified 3 days ago'
  },

  // 11. Talent Acquisition Partner
  {
    id: 'opp-ta-ft',
    externalId: 'adzuna-ta-ft-01',
    source: 'ADZUNA',
    sourceUrl: 'https://www.adzuna.com',
    applyUrl: 'https://careers.google.com',
    companyName: 'Google People Operations',
    companyLogoText: 'GOOG',
    title: 'Technical Talent Acquisition Partner',
    roleSlug: 'talent-acquisition-partner',
    description: 'Source senior cloud and systems engineers using advanced Boolean syntax, calibrate structured behavioral STAR rubrics, and manage ATS velocity.',
    location: 'Hyderabad / Bangalore',
    isRemote: true,
    employmentType: 'FULL_TIME',
    experienceLevelRequired: '2-4 Years',
    salary: '₹16,00,000 - ₹24,00,000 / yr',
    requiredSkills: ['Talent Sourcing & Boolean Search', 'Structured Behavioral Interviewing (STAR)', 'ATS & Pipeline Management'],
    postedAt: '1 day ago',
    lastVerifiedAt: 'Verified Today'
  },
  {
    id: 'opp-ta-intern',
    externalId: 'jooble-ta-intern-02',
    source: 'JOOBLE',
    sourceUrl: 'https://www.jooble.org',
    applyUrl: 'https://www.infosys.com/careers',
    companyName: 'Infosys Talent Labs',
    companyLogoText: 'INFY',
    title: 'Recruitment & Sourcing Trainee',
    roleSlug: 'talent-acquisition-partner',
    description: 'Support campus engineering hiring drives, screen technical candidate resumes, and coordinate structured interview loops in Greenhouse.',
    location: 'Bangalore / Pune',
    isRemote: false,
    employmentType: 'INTERNSHIP',
    experienceLevelRequired: 'Fresher / Entry',
    salary: '₹35,000 / month stipend',
    requiredSkills: ['Talent Sourcing & Boolean Search', 'ATS & Pipeline Management'],
    postedAt: '4 days ago',
    lastVerifiedAt: 'Verified 2 days ago'
  }
];

export function getOpportunityById(id: string): OpportunityItem | undefined {
  return OPPORTUNITIES_CATALOG.find((o) => o.id === id);
}

/**
 * Returns opportunities prioritized strictly by the active career role.
 * Exact career role matches rank FIRST, followed by related opportunities.
 */
export function getOpportunitiesByRole(
  activeCareerSlug: string,
  employmentType?: 'FULL_TIME' | 'INTERNSHIP' | 'STARTUP' | 'REMOTE'
): {
  exactMatches: OpportunityItem[];
  relatedMatches: OpportunityItem[];
  allRanked: OpportunityItem[];
} {
  let filtered = OPPORTUNITIES_CATALOG;
  if (employmentType) {
    if (employmentType === 'REMOTE') {
      filtered = filtered.filter((o) => o.isRemote || o.employmentType === 'REMOTE');
    } else {
      filtered = filtered.filter((o) => o.employmentType === employmentType);
    }
  }

  const exactMatches = filtered.filter((o) => o.roleSlug === activeCareerSlug);
  const relatedMatches = filtered.filter((o) => o.roleSlug !== activeCareerSlug);

  return {
    exactMatches,
    relatedMatches,
    allRanked: [...exactMatches, ...relatedMatches],
  };
}

/**
 * Explainable Match Engine:
 * Breaks down match score into:
 * - Role compatibility (30%)
 * - Skill compatibility (35%)
 * - Experience (15%)
 * - Education (5%)
 * - Location (5%)
 * - Career goal (10%)
 */
export function calculateExplainableMatch(
  opportunity: OpportunityItem,
  userSkills: Array<{ name: string; currentLevel: string }>,
  activeCareerSlug: string
) {
  const isExactRole = opportunity.roleSlug === activeCareerSlug;
  const roleScore = isExactRole ? 100 : 60;

  const candidateSkillMap = new Map<string, string>();
  userSkills.forEach((s) => {
    candidateSkillMap.set(s.name.toLowerCase().trim(), s.currentLevel);
  });

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  opportunity.requiredSkills.forEach((req) => {
    const key = req.toLowerCase().trim();
    const lvl = candidateSkillMap.get(key);
    // Level L2 or above considered satisfied
    if (lvl && lvl !== 'L0' && lvl !== 'L1') {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  const skillScore = opportunity.requiredSkills.length > 0
    ? Math.round((matchedSkills.length / opportunity.requiredSkills.length) * 100)
    : 100;

  const experienceScore = 90;
  const locationScore = opportunity.isRemote ? 100 : 85;
  const educationScore = 90;
  const careerGoalScore = isExactRole ? 100 : 65;

  const totalScore = Math.min(
    100,
    Math.round(
      roleScore * 0.30 +
      skillScore * 0.35 +
      experienceScore * 0.15 +
      educationScore * 0.05 +
      locationScore * 0.05 +
      careerGoalScore * 0.10
    )
  );

  return {
    overallScore: totalScore,
    breakdown: {
      roleScore,
      skillScore,
      experienceScore,
      locationScore,
      educationScore,
      careerGoalScore,
    },
    matchedSkills,
    missingSkills,
    isExactRole,
  };
}
