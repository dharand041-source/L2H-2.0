export interface CareerRoleDetail {
  slug: string;
  title: string;
  category: string;
  track: 'TECHNICAL' | 'NON_TECHNICAL' | 'HYBRID';
  complexity: 'Low' | 'Medium' | 'High' | 'Very High';
  reliance: 'Heavy Code/Automation' | 'Moderate Code' | 'Systems/Config' | 'Strategy/Creative';
  shortDesc: string;
  description: string;
  averageSalary: string;
  growthRate: string;
  marketDemand: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'SPECIALIZED';
  openRolesCount: number;
  responsibilities: string[];
  tasks: string[];
  requiredSkills: Array<{
    name: string;
    level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
    importance: number;
    description: string;
  }>;
  beginnerPath: string[];
  intermediatePath: string[];
  advancedPath: string[];
  interviewTopics: string[];
  resumeKeywords: string[];
}

export const CAREER_ROLES_CATALOG: CareerRoleDetail[] = [
  // 1. Full-Stack Developer
  {
    slug: 'full-stack-developer',
    title: 'Full-Stack Developer',
    category: 'Software Engineering',
    track: 'TECHNICAL',
    complexity: 'High',
    reliance: 'Heavy Code/Automation',
    shortDesc: 'End-to-end web engineering with React, Node.js, relational databases, and modern cloud deployment pipelines.',
    description: 'Full-Stack Developers design, build, test, and maintain complete web systems. They bridge responsive, accessible user interfaces with resilient backend APIs, transactional relational databases, and cloud infrastructure.',
    averageSalary: '$105,000 / yr',
    growthRate: '+24% YoY',
    marketDemand: 'VERY_HIGH',
    openRolesCount: 4280,
    responsibilities: [
      'Design and build responsive web applications using React, Next.js, and TypeScript',
      'Architect resilient REST and GraphQL APIs with Node.js, Express, or FastAPI',
      'Design normalized relational database schemas with PostgreSQL and optimize SQL queries',
      'Configure CI/CD pipelines, containerize applications with Docker, and manage edge deployments',
      'Implement strict authentication (OAuth, JWT, session cookies) and web security hygiene'
    ],
    tasks: [
      'Implement server-side rendering and static page generation for performance',
      'Author unit, integration, and end-to-end tests using Vitest and Playwright',
      'Build asynchronous background queue handlers and connection pooling',
      'Conduct code reviews and enforce semantic design tokens across UI components'
    ],
    requiredSkills: [
      { name: 'JavaScript', level: 'L4', importance: 0.95, description: 'Lexical scoping, closures, event loop, async/await, and modern ES6+' },
      { name: 'React', level: 'L3', importance: 0.90, description: 'Component lifecycle, hooks, state management, and virtual DOM reconciliation' },
      { name: 'Node.js', level: 'L3', importance: 0.85, description: 'Event-driven server runtime, stream processing, and REST API middleware' },
      { name: 'SQL & Relational DBs', level: 'L3', importance: 0.80, description: 'Multi-table JOINs, indexing strategies, constraints, and ACID transactions' },
      { name: 'TypeScript', level: 'L3', importance: 0.85, description: 'Static typing, generics, interfaces, union types, and utility types' },
      { name: 'Git & GitHub', level: 'L4', importance: 0.75, description: 'Branching strategies, interactive rebase, pull requests, and merge conflict resolution' },
      { name: 'Docker & Deployment', level: 'L2', importance: 0.70, description: 'Multi-stage Dockerfiles, container isolation, and cloud hosting' }
    ],
    beginnerPath: ['Web Foundations (HTML5/CSS3)', 'JavaScript Syntax & DOM', 'Git Version Control', 'Basic React Components'],
    intermediatePath: ['TypeScript Rigor', 'Next.js App Router', 'Node.js/Express APIs', 'PostgreSQL Schema Design & Joins'],
    advancedPath: ['Distributed Microservices', 'Redis Caching & Rate Limiting', 'Docker Container Orchestration', 'Full Stack Security Audits'],
    interviewTopics: ['Event Loop & Microtask Queue', 'React Reconciliation & Hooks', 'SQL Query Optimization', 'REST vs GraphQL Trade-offs', 'Authentication Flow Security'],
    resumeKeywords: ['TypeScript', 'React.js', 'Next.js', 'Node.js', 'PostgreSQL', 'RESTful APIs', 'Docker', 'Git', 'Tailwind CSS', 'CI/CD']
  },

  // 2. Frontend Developer
  {
    slug: 'frontend-developer',
    title: 'Frontend Developer',
    category: 'Software Engineering',
    track: 'TECHNICAL',
    complexity: 'Medium',
    reliance: 'Heavy Code/Automation',
    shortDesc: 'Craft high-performance, responsive, accessible web interfaces and stateful client applications.',
    description: 'Frontend Developers specialize in crafting delightful, pixel-perfect user experiences. They master browser rendering engines, client-side state management, responsive layouts, web accessibility (WCAG AA), and performance optimization.',
    averageSalary: '$98,000 / yr',
    growthRate: '+18% YoY',
    marketDemand: 'VERY_HIGH',
    openRolesCount: 3150,
    responsibilities: [
      'Translate design specs and wireframes into clean, accessible, semantic HTML/CSS/React',
      'Optimize web performance (Core Web Vitals, bundle size, memoization, lazy loading)',
      'Manage complex client state and asynchronous API data fetching with TanStack Query',
      'Enforce cross-browser compatibility and responsive layout fidelity across device breakpoints'
    ],
    tasks: [
      'Profile memory leaks and eliminate layout thrashing in Chromium DevTools',
      'Implement accessible dialogs, dropdowns, and keyboard navigation following WAI-ARIA',
      'Author micro-animations using Framer Motion and GSAP without sacrificing frame rate'
    ],
    requiredSkills: [
      { name: 'JavaScript', level: 'L4', importance: 0.95, description: 'Advanced ECMAScript, closures, prototypes, asynchronous control flow' },
      { name: 'React', level: 'L4', importance: 0.95, description: 'Custom hooks, Context API, performance profiling, component composition' },
      { name: 'CSS & Tailwind', level: 'L4', importance: 0.90, description: 'Flexbox, CSS Grid, custom properties, responsive clamp scales' },
      { name: 'TypeScript', level: 'L3', importance: 0.85, description: 'Typed props, event handlers, and strict null checks' },
      { name: 'Web Accessibility', level: 'L3', importance: 0.80, description: 'WCAG 2.1 AA standards, semantic markup, and screen reader testing' }
    ],
    beginnerPath: ['HTML5 Semantic Elements', 'CSS Grid & Flexbox', 'JavaScript Fundamentals', 'React Functional Components'],
    intermediatePath: ['TypeScript with React', 'Next.js App Router', 'Tailwind CSS Systems', 'Client-side State & Data Fetching'],
    advancedPath: ['Performance Budgeting & Web Workers', 'Micro-Frontend Architectures', 'Design System Library Publishing', 'Complex Canvas/WebGL Visuals'],
    interviewTopics: ['Browser Critical Rendering Path', 'Virtual DOM Diffing', 'Accessibility Heuristics', 'CSS Specificity & Stacking Context', 'State Management Trade-offs'],
    resumeKeywords: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux / Zustand', 'WAI-ARIA', 'Webpack / Vite', 'Lighthouse']
  },

  // 3. Backend Developer
  {
    slug: 'backend-developer',
    title: 'Backend Developer',
    category: 'Software Engineering',
    track: 'TECHNICAL',
    complexity: 'High',
    reliance: 'Heavy Code/Automation',
    shortDesc: 'Engineer scalable microservices, relational schemas, caching layers, and high-load APIs.',
    description: 'Backend Developers engineer server architectures, background task pipelines, database models, and service interfaces that power digital applications. They focus on scalability, fault-tolerance, data integrity, and low-latency throughput.',
    averageSalary: '$110,000 / yr',
    growthRate: '+22% YoY',
    marketDemand: 'VERY_HIGH',
    openRolesCount: 3820,
    responsibilities: [
      'Develop scalable, secure, and documented REST and gRPC service APIs',
      'Design relational schemas, execute database migrations, and fine-tune SQL queries',
      'Implement distributed caching strategies with Redis to minimize database contention',
      'Manage background asynchronous worker pools for CPU-heavy tasks'
    ],
    tasks: [
      'Monitor API p99 latency SLAs and eliminate query bottlenecks with EXPLAIN ANALYZE',
      'Implement RBAC authorization and secure JWT refresh token rotations',
      'Containerize services with Docker and write integration tests with testcontainers'
    ],
    requiredSkills: [
      { name: 'Node.js / Python / Go', level: 'L4', importance: 0.95, description: 'Asynchronous event loops, concurrency primitives, and server frameworks' },
      { name: 'SQL & Relational DBs', level: 'L4', importance: 0.90, description: 'PostgreSQL, indexing, transactions, locking, and query tuning' },
      { name: 'REST & gRPC APIs', level: 'L4', importance: 0.90, description: 'API contract design, status codes, OpenAPI specs, and serialization' },
      { name: 'Redis & Caching', level: 'L3', importance: 0.80, description: 'Cache-aside patterns, TTL expiration, Pub/Sub, and distributed locks' },
      { name: 'Docker & Microservices', level: 'L3', importance: 0.75, description: 'Service decomposition, Docker orchestration, and networking' }
    ],
    beginnerPath: ['Language Fundamentals (Python/Node)', 'HTTP Protocol & Status Codes', 'Basic SQL SELECT & CRUD', 'REST API Routing'],
    intermediatePath: ['Database Normalization & Indexes', 'JWT Auth & Middleware', 'Redis Caching', 'Unit & Contract Testing'],
    advancedPath: ['Distributed Message Queues (Kafka/RabbitMQ)', 'Database Sharding & Replication', 'Event-Driven Architectures', 'Zero-Downtime Migration Patterns'],
    interviewTopics: ['ACID Properties & Isolation Levels', 'Connection Pooling & Deadlocks', 'Horizontal vs Vertical Scaling', 'Idempotent API Design', 'Database Index Internals (B-Tree)'],
    resumeKeywords: ['Python / FastAPI', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'RESTful APIs', 'Microservices', 'System Design']
  },

  // 4. AI / Agentic AI Engineer
  {
    slug: 'ai-agentic-ai-engineer',
    title: 'AI / Agentic AI Engineer',
    category: 'Artificial Intelligence & Machine Learning',
    track: 'TECHNICAL',
    complexity: 'Very High',
    reliance: 'Heavy Code/Automation',
    shortDesc: 'Build automated AI workflows, multi-agent systems, tool-calling pipelines, and LLM applications.',
    description: 'Agentic AI Engineers architect autonomous multi-agent systems, Retrieval-Augmented Generation (RAG) vector pipelines, and deterministic tool-calling workflows. They bridge frontier foundational models with real-world enterprise databases and APIs.',
    averageSalary: '$135,000 / yr',
    growthRate: '+45% YoY',
    marketDemand: 'VERY_HIGH',
    openRolesCount: 2940,
    responsibilities: [
      'Design autonomous agent loops using LangGraph, CrewAI, or Autogen architectures',
      'Implement enterprise RAG pipelines using pgvector, semantic embeddings, and hybrid search',
      'Author structured tool-calling interfaces with deterministic JSON Schema validation',
      'Evaluate agent task completion rates, hallucination benchmarks, and token cost economics'
    ],
    tasks: [
      'Build self-correcting agent chains with retry mechanisms and state checkpointing',
      'Fine-tune contextual prompts and evaluate prompt resilience against injection attacks',
      'Integrate vector embeddings into relational databases using PostgreSQL pgvector'
    ],
    requiredSkills: [
      { name: 'Python', level: 'L4', importance: 0.95, description: 'Asynchronous Python, Pydantic data validation, and modern typing' },
      { name: 'LLMs & Prompt Engineering', level: 'L4', importance: 0.95, description: 'Chain-of-thought, few-shot prompting, system instructions, and token budgets' },
      { name: 'Vector DBs & pgvector', level: 'L3', importance: 0.90, description: 'Cosine distance, semantic similarity, HNSW indexing, and chunking strategies' },
      { name: 'Agent Frameworks', level: 'L3', importance: 0.90, description: 'State graphs, memory persistence, human-in-the-loop, and subagent delegation' },
      { name: 'Tool Calling & APIs', level: 'L4', importance: 0.85, description: 'Schema extraction, parameter validation, and third-party API orchestration' }
    ],
    beginnerPath: ['Python Programming Essentials', 'OpenAI / Gemini API Fundamentals', 'Prompt Engineering Patterns', 'JSON Schema Validation'],
    intermediatePath: ['RAG Pipeline Construction', 'pgvector & Embeddings in PostgreSQL', 'LangChain / LlamaIndex Baselines', 'Deterministic Error Recovery'],
    advancedPath: ['Multi-Agent Collaboration Frameworks', 'Autonomous Plan Execution & Replanning', 'Local Model Quantization & Serving', 'Automated Evals & Guardrails'],
    interviewTopics: ['RAG Chunking & Retrieval Evaluation (RAGAS)', 'Agent Infinite Loop Mitigation', 'Function Calling JSON Parsing Errors', 'Latency vs Reasoning Trade-offs in LLMs', 'Context Window Management'],
    resumeKeywords: ['Agentic AI', 'Python', 'LLMs', 'LangGraph', 'RAG', 'pgvector', 'Vector Search', 'Prompt Engineering', 'Pydantic']
  },

  // 5. Machine Learning Engineer
  {
    slug: 'machine-learning-engineer',
    title: 'Machine Learning Engineer',
    category: 'Artificial Intelligence & Machine Learning',
    track: 'TECHNICAL',
    complexity: 'Very High',
    reliance: 'Heavy Code/Automation',
    shortDesc: 'Design, train, evaluate, and deploy predictive ML models and deep learning pipelines.',
    description: 'Machine Learning Engineers build and operationalize predictive statistical models. They implement end-to-end data training pipelines, feature engineering, hyperparameter tuning, model evaluation, and low-latency production inference.',
    averageSalary: '$130,000 / yr',
    growthRate: '+32% YoY',
    marketDemand: 'VERY_HIGH',
    openRolesCount: 3100,
    responsibilities: [
      'Clean, transform, and engineer features from complex structured and unstructured datasets',
      'Train, validate, and tune supervised and unsupervised statistical models',
      'Deploy production inference services with FastAPI and ONNX runtime',
      'Monitor model drift, accuracy degradation, and data distribution shifts in production'
    ],
    tasks: [
      'Author reproducible training pipelines with MLflow and DVC',
      'Optimize model latency with quantization and tensor optimization',
      'Implement cross-validation, confusion matrices, and ROC-AUC evaluation curves'
    ],
    requiredSkills: [
      { name: 'Python', level: 'L4', importance: 0.95, description: 'NumPy, Pandas, SciPy, and vectorized computational programming' },
      { name: 'Scikit-Learn & PyTorch', level: 'L4', importance: 0.90, description: 'Model training, backpropagation, loss functions, and neural network layers' },
      { name: 'Mathematics & Statistics', level: 'L3', importance: 0.85, description: 'Linear algebra, calculus, probability distributions, and hypothesis testing' },
      { name: 'MLOps & Deployment', level: 'L3', importance: 0.80, description: 'Model registries, artifact versioning, CI/CD for models, and monitoring' }
    ],
    beginnerPath: ['Python Data Stack (Pandas/NumPy)', 'Descriptive & Inferential Statistics', 'Linear & Logistic Regression', 'Scikit-Learn Workflows'],
    intermediatePath: ['Tree Ensembles (XGBoost/LightGBM)', 'Deep Learning Fundamentals (PyTorch)', 'Feature Store Integration', 'FastAPI Inference Serving'],
    advancedPath: ['Distributed Training (Ray/Horovod)', 'Model Quantization (TensorRT)', 'Drift Detection Pipelines', 'End-to-End MLOps Automation'],
    interviewTopics: ['Bias-Variance Trade-off', 'Regularization Techniques (L1/L2/Dropout)', 'Gradient Descent Variations', 'Handling Class Imbalance', 'Inference Latency Optimization'],
    resumeKeywords: ['Machine Learning', 'PyTorch', 'Scikit-Learn', 'Python', 'MLflow', 'Deep Learning', 'Statistics', 'Model Deployment']
  },

  // 6. Data Scientist
  {
    slug: 'data-scientist',
    title: 'Data Scientist',
    category: 'Data & Analytics',
    track: 'TECHNICAL',
    complexity: 'High',
    reliance: 'Heavy Code/Automation',
    shortDesc: 'Extract predictive insights and business value from large datasets using statistical modeling.',
    description: 'Data Scientists transform raw data into actionable strategic intelligence. They formulate statistical hypotheses, execute A/B experiment designs, build predictive regression and classification models, and present data-backed narratives.',
    averageSalary: '$115,000 / yr',
    growthRate: '+20% YoY',
    marketDemand: 'HIGH',
    openRolesCount: 2800,
    responsibilities: [
      'Formulate analytical hypotheses to solve high-stakes business and product problems',
      'Design and evaluate rigorous randomized controlled trials (A/B testing)',
      'Construct statistical models and predictive algorithms to forecast customer behavior',
      'Communicate complex statistical findings to executive stakeholders through visualizations'
    ],
    tasks: [
      'Write complex analytical SQL queries with window functions and CTEs',
      'Author interactive dashboards and notebooks combining storytelling with reproducible data',
      'Validate statistical significance and statistical power of product experiments'
    ],
    requiredSkills: [
      { name: 'Python & R', level: 'L4', importance: 0.95, description: 'Statistical programming, EDA, Pandas, and data visualization' },
      { name: 'SQL & Analytics DBs', level: 'L4', importance: 0.90, description: 'Window functions, cohort aggregation, CTEs, and data warehouse queries' },
      { name: 'A/B Testing & Statistics', level: 'L4', importance: 0.90, description: 'p-values, confidence intervals, sample sizing, and causal inference' },
      { name: 'Predictive Modeling', level: 'L3', importance: 0.85, description: 'Classification, clustering, time-series forecasting, and regression' }
    ],
    beginnerPath: ['SQL Querying & Aggregations', 'Python for Data Analysis', 'Exploratory Data Analysis (EDA)', 'Statistical Foundations'],
    intermediatePath: ['Hypothesis Testing & A/B Testing', 'Predictive Scikit-Learn Pipelines', 'Feature Engineering', 'Data Visualization (Seaborn/Plotly)'],
    advancedPath: ['Causal Inference & Quasi-experiments', 'Bayesian Statistics', 'Time Series Forecasting (Prophet/ARIMA)', 'Production Scoring Pipelines'],
    interviewTopics: ['Hypothesis Testing p-Value Interpretation', 'A/B Test Minimum Detectable Effect', 'Handling Missing Data & Outliers', 'SQL Window Functions (RANK, LEAD, LAG)', 'Model Interpretability (SHAP values)'],
    resumeKeywords: ['Data Science', 'Python', 'SQL', 'A/B Testing', 'Predictive Modeling', 'Pandas', 'Statistics', 'Tableau']
  },

  // 7. DevOps / Platform Engineer
  {
    slug: 'devops-platform-engineer',
    title: 'DevOps / Platform Engineer',
    category: 'Cloud & Infrastructure',
    track: 'TECHNICAL',
    complexity: 'High',
    reliance: 'Systems/Config',
    shortDesc: 'Automate deployment pipelines, cloud infrastructure, container orchestration, and environments.',
    description: 'DevOps Engineers design internal developer platforms and automated delivery pipelines. They implement Infrastructure as Code (Terraform), Kubernetes cluster orchestration, continuous deployment, and security compliance.',
    averageSalary: '$120,000 / yr',
    growthRate: '+26% YoY',
    marketDemand: 'VERY_HIGH',
    openRolesCount: 3400,
    responsibilities: [
      'Author and maintain Infrastructure as Code using Terraform and AWS CloudFormation',
      'Build robust, secure CI/CD pipelines with GitHub Actions, GitLab CI, or ArgoCD',
      'Manage container workloads across Kubernetes clusters with high availability',
      'Enforce security best practices, vulnerability scanning, and secrets management'
    ],
    tasks: [
      'Automate ephemeral preview environments for engineering pull requests',
      'Implement blue-green and canary deployment strategies to achieve zero downtime',
      'Manage cloud IAM least-privilege policies and audit trail logs'
    ],
    requiredSkills: [
      { name: 'Docker & Containers', level: 'L4', importance: 0.95, description: 'Image optimization, security scanning, multi-stage builds, and compose' },
      { name: 'Kubernetes', level: 'L3', importance: 0.90, description: 'Pods, deployments, services, ingresses, ConfigMaps, and Helm charts' },
      { name: 'CI/CD Pipelines', level: 'L4', importance: 0.90, description: 'Automated test runners, build caching, release tagging, and deployments' },
      { name: 'Terraform & IaC', level: 'L3', importance: 0.85, description: 'State management, modular infrastructure, providers, and plan execution' },
      { name: 'Linux & Bash', level: 'L4', importance: 0.85, description: 'Shell scripting, process management, permissions, and network debugging' }
    ],
    beginnerPath: ['Linux System Administration', 'Bash Shell Scripting', 'Git Version Control', 'Docker Basics & Containers'],
    intermediatePath: ['CI/CD Pipeline Automation', 'Terraform Cloud Provisioning', 'Kubernetes Architecture', 'Cloud Fundamentals (AWS/GCP)'],
    advancedPath: ['GitOps with ArgoCD', 'Service Mesh (Istio)', 'Zero-Trust IAM Architectures', 'Disaster Recovery Automation'],
    interviewTopics: ['Blue-Green vs Canary Deployments', 'Kubernetes Pod Lifecycle & Probes', 'Terraform State Locking & Drift', 'Docker Layer Caching', 'Linux Troubleshooting Commands'],
    resumeKeywords: ['DevOps', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'AWS', 'Linux', 'GitHub Actions', 'IaC']
  },

  // 8. Cybersecurity Architect
  {
    slug: 'cybersecurity-architect',
    title: 'Cybersecurity Architect',
    category: 'Cybersecurity',
    track: 'TECHNICAL',
    complexity: 'Very High',
    reliance: 'Systems/Config',
    shortDesc: 'Design zero-trust enterprise security architectures, threat models, and identity boundaries.',
    description: 'Cybersecurity Architects design defenses for complex enterprise digital estates. They establish zero-trust identity frameworks, evaluate cloud security posture, architect network isolation, conduct threat modeling, and ensure compliance.',
    averageSalary: '$145,000 / yr',
    growthRate: '+30% YoY',
    marketDemand: 'VERY_HIGH',
    openRolesCount: 1950,
    responsibilities: [
      'Design comprehensive enterprise Zero Trust security architectures across cloud and hybrid environments',
      'Execute STRIDE threat modeling sessions across product architecture designs',
      'Architect robust Identity and Access Management (IAM), SSO, and MFA policies',
      'Guide compliance adherence across SOC2, ISO 27001, GDPR, and HIPAA frameworks'
    ],
    tasks: [
      'Audit API endpoints against OWASP Top 10 vulnerabilities and enforce rate limits',
      'Design cryptographic key management hierarchies using KMS and Hardware Security Modules',
      'Formulate incident response runbooks and coordinate red-team penetration test remediations'
    ],
    requiredSkills: [
      { name: 'Zero Trust & IAM', level: 'L4', importance: 0.95, description: 'Least privilege, SAML/OIDC, role-based access, and conditional access' },
      { name: 'Network Security', level: 'L4', importance: 0.90, description: 'VPC design, firewalls, TLS 1.3, mutual TLS, and intrusion prevention' },
      { name: 'Threat Modeling (STRIDE)', level: 'L4', importance: 0.90, description: 'Attack surface analysis, risk scoring (CVSS), and mitigation' },
      { name: 'Cloud Security (AWS/Azure)', level: 'L3', importance: 0.85, description: 'Security groups, guardrails, policy-as-code, and audit logging' }
    ],
    beginnerPath: ['Networking Foundations (TCP/IP, DNS, TLS)', 'Linux & OS Security', 'OWASP Top 10 Web Vulnerabilities', 'Identity & Access Basics'],
    intermediatePath: ['STRIDE Threat Modeling', 'Cloud Security Posture Management', 'Cryptography & Key Management', 'SOC2 / Compliance Principles'],
    advancedPath: ['Enterprise Zero Trust Architecture', 'Micro-segmentation & mTLS', 'Automated Security Posture Monitoring', 'Board-Level Risk Governance'],
    interviewTopics: ['Zero Trust Architecture Tenets', 'OWASP API Top 10 Defenses', 'Threat Modeling a Microservices Architecture', 'Symmetric vs Asymmetric Encryption', 'Incident Response Containment'],
    resumeKeywords: ['Cybersecurity', 'Zero Trust', 'Threat Modeling', 'IAM', 'Network Security', 'OWASP', 'Cloud Security', 'SOC2']
  },

  // 9. Technical Product Manager
  {
    slug: 'technical-product-manager',
    title: 'Technical Product Manager',
    category: 'Management & Strategy',
    track: 'HYBRID',
    complexity: 'High',
    reliance: 'Strategy/Creative',
    shortDesc: 'Manage technical product roadmaps, API specifications, sprint priorities, and KPI delivery.',
    description: 'Technical Product Managers bridge engineering teams with business outcomes. They understand system architectures, write clear technical PRDs, prioritize backlogs using RICE/MoSCoW, conduct user research, and measure telemetry metrics.',
    averageSalary: '$122,000 / yr',
    growthRate: '+21% YoY',
    marketDemand: 'HIGH',
    openRolesCount: 2600,
    responsibilities: [
      'Author comprehensive Product Requirement Documents (PRDs) with technical acceptance criteria',
      'Define quarterly roadmaps aligned to company OKRs and user feedback loops',
      'Collaborate directly with lead engineers on architectural trade-offs and technical debt',
      'Analyze funnel telemetry, user activation metrics, and retention cohorts'
    ],
    tasks: [
      'Facilitate sprint planning, backlog grooming, and user story mapping',
      'Conduct user interviews to synthesize qualitative pain points into feature specs',
      'Design metric dashboards tracking product adoption and feature engagement'
    ],
    requiredSkills: [
      { name: 'Product Roadmapping & PRDs', level: 'L4', importance: 0.95, description: 'Prioritization frameworks (RICE), user story authoring, and spec clarity' },
      { name: 'Technical Literacy & APIs', level: 'L3', importance: 0.90, description: 'Understanding REST architectures, database queries, and tech constraints' },
      { name: 'Data & Telemetry Analytics', level: 'L3', importance: 0.85, description: 'Funnel analytics, cohort retention, SQL basics, and metric tracking' },
      { name: 'Agile & Scrum Delivery', level: 'L4', importance: 0.85, description: 'Sprint facilitation, stakeholder alignment, and release management' }
    ],
    beginnerPath: ['Product Management Foundations', 'Agile & Scrum Methodology', 'Basic SQL & Data Interpretation', 'User Story Writing'],
    intermediatePath: ['Technical Architecture Comprehension', 'RICE Prioritization Modeling', 'Product Telemetry & Funnel Analysis', 'API Product Design'],
    advancedPath: ['Platform Product Strategy', 'Enterprise GTM Execution', 'AI/ML Product Lifecycle Management', 'Executive Stakeholder Negotiation'],
    interviewTopics: ['Prioritizing Feature vs Tech Debt', 'Designing a Technical API Product', 'Handling Engineering Disagreements', 'Measuring Feature Success Metrics', 'Root Cause Analysis of Metric Drops'],
    resumeKeywords: ['Product Management', 'Technical PRD', 'Roadmapping', 'Agile / Scrum', 'RICE Prioritization', 'SQL', 'APIs', 'User Research']
  },

  // 10. UI/UX Designer
  {
    slug: 'ui-ux-designer',
    title: 'UI/UX Designer',
    category: 'Design',
    track: 'HYBRID',
    complexity: 'Medium',
    reliance: 'Strategy/Creative',
    shortDesc: 'Research user behavior, architect design systems, and build high-fidelity interactive prototypes.',
    description: 'UI/UX Designers craft intuitive, accessible, and aesthetically stunning digital product interfaces. They conduct generative user research, architect comprehensive Figma design systems with tokens, and prototype fluid user journeys.',
    averageSalary: '$89,000 / yr',
    growthRate: '+19% YoY',
    marketDemand: 'HIGH',
    openRolesCount: 2200,
    responsibilities: [
      'Conduct generative and evaluative user research sessions and usability testing',
      'Create wireframes, user flow diagrams, and high-fidelity interactive Figma prototypes',
      'Maintain unified design systems with semantic design tokens and accessibility guidelines',
      'Collaborate closely with frontend engineers to ensure design implementation fidelity'
    ],
    tasks: [
      'Audit digital interfaces against Nielsen Norman usability heuristics and WCAG AA',
      'Create responsive auto-layout components and design token specifications',
      'Synthesize user feedback into journey maps and actionable UX recommendations'
    ],
    requiredSkills: [
      { name: 'Figma & Prototyping', level: 'L4', importance: 0.95, description: 'Auto-layout, component variants, variables, interactive prototyping' },
      { name: 'Design Systems & Tokens', level: 'L4', importance: 0.90, description: 'Atomic design, token hierarchies, typography scales, spacing units' },
      { name: 'UX Research & Usability', level: 'L3', importance: 0.85, description: 'User interviews, card sorting, heuristic evaluation, usability testing' },
      { name: 'Accessibility (WCAG)', level: 'L3', importance: 0.85, description: 'Color contrast, touch targets, screen reader considerations, and focus states' }
    ],
    beginnerPath: ['Design Principles & Visual Hierarchy', 'Figma Basics & Vector Tools', 'Typography & Color Theory', 'Wireframing & User Flows'],
    intermediatePath: ['Component Systems & Auto-Layout', 'Design Tokens & Variables', 'Usability Testing & User Research', 'Responsive Layout Strategies'],
    advancedPath: ['Enterprise Multi-Brand Design Systems', 'Complex Micro-Interaction Prototyping', 'Design-to-Code Tokens Sync', 'UX Heuristic Auditing'],
    interviewTopics: ['Walking through a Portfolio Case Study', 'Design System Token Architecture', 'Balancing Aesthetics with Accessibility', 'Handling Feedback from Engineers & Product', 'Designing for High-Density Information'],
    resumeKeywords: ['UI/UX Design', 'Figma', 'Design Systems', 'Design Tokens', 'User Research', 'Prototyping', 'Wireframing', 'WCAG']
  },

  // 11. Digital Marketing Specialist
  {
    slug: 'digital-marketing-specialist',
    title: 'Digital Marketing Specialist',
    category: 'Marketing & Growth',
    track: 'NON_TECHNICAL',
    complexity: 'Medium',
    reliance: 'Strategy/Creative',
    shortDesc: 'Develop multi-channel organic growth, SEO strategies, paid acquisition, and conversion funnels.',
    description: 'Digital Marketing Specialists execute end-to-end customer acquisition and engagement campaigns. They optimize search visibility (SEO), craft persuasive copy, manage performance advertising channels, and analyze conversion funnels.',
    averageSalary: '$68,000 / yr',
    growthRate: '+16% YoY',
    marketDemand: 'HIGH',
    openRolesCount: 2450,
    responsibilities: [
      'Conduct keyword research and execute on-page and technical SEO strategies',
      'Analyze conversion funnels, landing page bounce rates, and organic traffic attribution',
      'Manage multi-channel campaigns across Google Ads, LinkedIn, email, and social',
      'Write persuasive, brand-aligned marketing copy and coordinate content calendars'
    ],
    tasks: [
      'Optimize landing page conversion rates through systematic A/B headline tests',
      'Track organic ranking shifts in Google Search Console and resolve indexing issues',
      'Produce monthly ROI reporting across acquisition channels and customer CAC'
    ],
    requiredSkills: [
      { name: 'SEO & Search Intent', level: 'L4', importance: 0.95, description: 'Keyword research, on-page optimization, content clusters, technical SEO' },
      { name: 'Analytics & Attribution', level: 'L3', importance: 0.90, description: 'Google Analytics 4, Search Console, conversion funnels, UTM tracking' },
      { name: 'Copywriting & Content', level: 'L3', importance: 0.85, description: 'Value proposition messaging, editorial planning, email sequences' },
      { name: 'Conversion Rate Opt (CRO)', level: 'L3', importance: 0.80, description: 'A/B testing, CTA placement, landing page UX, form optimization' }
    ],
    beginnerPath: ['Digital Marketing Fundamentals', 'Keyword Research Basics', 'Content Planning & Copywriting', 'Google Analytics 4 Overview'],
    intermediatePath: ['Technical SEO & Core Web Vitals Impact', 'Paid Search & Meta Ads Strategy', 'CRO & A/B Landing Page Testing', 'Email Automation Workflows'],
    advancedPath: ['Multi-Touch Attribution Modeling', 'Programmatic SEO Architectures', 'Omnichannel Growth Engineering', 'CAC/LTV Optimization'],
    interviewTopics: ['Optimizing a Page with Dropping Traffic', 'Keyword Intent Mapping', 'CAC vs LTV Trade-offs', 'A/B Test Design for Landing Pages', 'Measuring Multi-Channel Attribution'],
    resumeKeywords: ['Digital Marketing', 'SEO', 'Google Analytics', 'Content Strategy', 'CRO', 'Conversion Optimization', 'Copywriting', 'A/B Testing']
  },

  // 12. Talent Acquisition Partner
  {
    slug: 'talent-acquisition-partner',
    title: 'Talent Acquisition Partner',
    category: 'Operations & HR',
    track: 'NON_TECHNICAL',
    complexity: 'Medium',
    reliance: 'Strategy/Creative',
    shortDesc: 'Source elite talent, conduct structured interviews, manage candidate pipelines, and close offers.',
    description: 'Talent Acquisition Partners drive full-lifecycle recruitment for technical and non-technical organizations. They identify candidate personas, execute Boolean search sourcing, conduct structured competency interviews, and negotiate offers.',
    averageSalary: '$74,000 / yr',
    growthRate: '+14% YoY',
    marketDemand: 'MODERATE',
    openRolesCount: 1600,
    responsibilities: [
      'Manage full-lifecycle recruitment across diverse engineering and business departments',
      'Execute proactive Boolean search and talent mapping across LinkedIn Recruiter and GitHub',
      'Conduct structured screening interviews evaluating competency and cultural alignment',
      'Partner closely with hiring managers to define role benchmarks and calibrate rubrics'
    ],
    tasks: [
      'Manage pipeline health in modern Applicant Tracking Systems (Greenhouse, Lever)',
      'Prepare competitive compensation packages and negotiate candidate offers',
      'Report on recruitment metrics: Time-to-Hire, Offer Acceptance Rate, and Diversity'
    ],
    requiredSkills: [
      { name: 'Talent Sourcing & Boolean Search', level: 'L4', importance: 0.95, description: 'Advanced search syntax, passive candidate outreach, talent mapping' },
      { name: 'Structured Interviewing', level: 'L4', importance: 0.90, description: 'Competency rubrics, behavioral assessment, mitigating unconscious bias' },
      { name: 'ATS & Pipeline Management', level: 'L3', importance: 0.85, description: 'Greenhouse/Lever workflow stages, candidate communications, SLAs' },
      { name: 'Offer Negotiation & Closing', level: 'L3', importance: 0.85, description: 'Compensation modeling, equity explanations, candidate objection handling' }
    ],
    beginnerPath: ['Recruitment Fundamentals', 'Boolean Search Basics', 'Candidate Screening Techniques', 'ATS Navigation & Hygiene'],
    intermediatePath: ['Technical Sourcing (GitHub/StackOverflow)', 'Structured Competency Rubrics', 'Offer Negotiation Strategies', 'Diversity Sourcing Frameworks'],
    advancedPath: ['Executive Search Strategy', 'Workforce Planning & Capacity Modeling', 'Employer Branding Campaigns', 'Recruitment Analytics & Funnel SLAs'],
    interviewTopics: ['Sourcing Passive Candidates in Competitive Niches', 'Designing an Unbiased Interview Rubric', 'Closing a Candidate with Multiple Counteroffers', 'Managing Misaligned Hiring Managers', 'Reducing Time-to-Hire without Lowering Standards'],
    resumeKeywords: ['Talent Acquisition', 'Technical Recruiting', 'Boolean Search', 'Structured Interviewing', 'ATS / Greenhouse', 'Sourcing', 'Offer Negotiation']
  }
];

export function getCareerBySlug(slug: string): CareerRoleDetail | undefined {
  return CAREER_ROLES_CATALOG.find((c) => c.slug === slug);
}
