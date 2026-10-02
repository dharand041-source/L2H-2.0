-- ==============================================================================
-- LEARN-2-HIRE 2.0 CANONICAL SEED DATA (001)
-- Real, legal, verified occupational taxonomy, open resource providers & questions
-- ==============================================================================

-- 1. RESOURCE PROVIDERS
INSERT INTO public.resource_providers (id, name, slug, base_url, license_type, allows_deep_linking) VALUES
  ('10000000-0000-0000-0000-000000000001', 'freeCodeCamp', 'freecodecamp', 'https://www.freecodecamp.org', 'OPEN_SOURCE_BSD', true),
  ('10000000-0000-0000-0000-000000000002', 'MDN Web Docs', 'mdn', 'https://developer.mozilla.org', 'CC_BY_SA', true),
  ('10000000-0000-0000-0000-000000000003', 'Harvard CS50', 'cs50', 'https://cs50.harvard.edu', 'CC_BY_NC_SA', true),
  ('10000000-0000-0000-0000-000000000004', 'MIT OpenCourseWare', 'mit-ocw', 'https://ocw.mit.edu', 'CC_BY_NC_SA', true),
  ('10000000-0000-0000-0000-000000000005', 'NPTEL / SWAYAM', 'swayam', 'https://swayam.gov.in', 'EDUCATIONAL_OPEN', true),
  ('10000000-0000-0000-0000-000000000006', 'SQLBolt', 'sqlbolt', 'https://sqlbolt.com', 'FREE_WEB_RESOURCE', true),
  ('10000000-0000-0000-0000-000000000007', 'Microsoft Learn', 'ms-learn', 'https://learn.microsoft.com', 'OPEN_DOCUMENTATION', true)
ON CONFLICT (name) DO NOTHING;

-- 2. QUESTION SOURCES
INSERT INTO public.question_sources (id, name, url, license, is_redistributable) VALUES
  ('20000000-0000-0000-0000-000000000001', 'Learn-2-Hire Original', 'https://learn2hire.com', 'PROPRIETARY_PLATFORM', true),
  ('20000000-0000-0000-0000-000000000002', 'Open Educational CS Resources', 'https://github.com', 'MIT', true),
  ('20000000-0000-0000-0000-000000000003', 'Public Interview Archive', 'https://github.com', 'CC_BY_SA', true)
ON CONFLICT (name) DO NOTHING;

-- 3. CAREER CATEGORIES
INSERT INTO public.career_categories (id, name, slug, description, track, icon, display_order) VALUES
  ('30000000-0000-0000-0000-000000000001', 'Software Engineering', 'software-engineering', 'Architecture, web, mobile, and distributed systems development.', 'TECHNICAL', 'Code', 1),
  ('30000000-0000-0000-0000-000000000002', 'Data & Artificial Intelligence', 'data-ai', 'Machine learning, data science, analytics, and business intelligence.', 'TECHNICAL', 'Database', 2),
  ('30000000-0000-0000-0000-000000000003', 'Product & Design', 'product-design', 'User experience, product management, wireframing, and user research.', 'HYBRID', 'Layout', 3),
  ('30000000-0000-0000-0000-000000000004', 'Marketing & Growth', 'marketing-growth', 'Digital marketing, SEO/SEM, copywriting, and customer acquisition.', 'NON_TECHNICAL', 'TrendingUp', 4),
  ('30000000-0000-0000-0000-000000000005', 'Operations & Human Resources', 'operations-hr', 'Talent acquisition, operations management, people ops, and recruiting.', 'NON_TECHNICAL', 'Users', 5)
ON CONFLICT (name) DO NOTHING;

-- 4. CANONICAL SKILLS
INSERT INTO public.skills (id, name, slug, category, description, is_technical) VALUES
  ('40000000-0000-0000-0000-000000000001', 'JavaScript', 'javascript', 'Frontend & Full Stack', 'Core ECMAScript language, event loop, closures, and async patterns.', true),
  ('40000000-0000-0000-0000-000000000002', 'React', 'react', 'Frontend', 'Declarative UI library, component lifecycle, hooks, and virtual DOM.', true),
  ('40000000-0000-0000-0000-000000000003', 'Node.js', 'node-js', 'Backend', 'Event-driven JavaScript runtime for server-side services.', true),
  ('40000000-0000-0000-0000-000000000004', 'SQL & Relational DBs', 'sql', 'Database', 'Relational data modeling, indexing, joins, and ACID transactions.', true),
  ('40000000-0000-0000-0000-000000000005', 'Docker & Containerization', 'docker', 'DevOps', 'Image creation, container isolation, and multi-stage builds.', true),
  ('40000000-0000-0000-0000-000000000006', 'Product Roadmapping', 'product-roadmapping', 'Product Management', 'Prioritization frameworks (RICE), outcome tracking, and release management.', false),
  ('40000000-0000-0000-0000-000000000007', 'UI/UX Wireframing & Figma', 'wireframing-figma', 'Design', 'Design systems, low/high fidelity prototyping, and usability heuristics.', false),
  ('40000000-0000-0000-0000-000000000008', 'SEO & Organic Growth', 'seo-growth', 'Marketing', 'Search intent, on-page optimization, content strategy, and search console analytics.', false),
  ('40000000-0000-0000-0000-000000000009', 'Talent Acquisition & Sourcing', 'talent-acquisition', 'Human Resources', 'Candidate evaluation, structured interviewing, Boolean search, and ATS management.', false)
ON CONFLICT (name) DO NOTHING;

-- 5. CAREER ROLES (Both Technical & Non-Technical)
INSERT INTO public.career_roles (id, category_id, name, slug, description, track, industry, average_salary_usd, market_demand, tasks, education_requirements, source) VALUES
  (
    '50000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'Full Stack Developer',
    'full-stack-developer',
    'Builds end-to-end web applications combining dynamic reactive frontends, resilient backend APIs, and performant relational databases.',
    'TECHNICAL',
    'Information Technology / Software',
    105000,
    'VERY_HIGH',
    ARRAY['Design RESTful APIs', 'Build responsive React/Next.js interfaces', 'Write SQL queries and schemas', 'Deploy cloud containers'],
    ARRAY['Bachelor in Computer Science or equivalent proven portfolio'],
    'ESCO'
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000003',
    'Associate Product Manager',
    'associate-product-manager',
    'Guides product feature lifecycle from problem definition to user research, requirements gathering, roadmap prioritization, and KPI tracking.',
    'HYBRID',
    'Technology & Product Studios',
    92000,
    'HIGH',
    ARRAY['Conduct user interviews', 'Author Product Requirement Documents (PRDs)', 'Prioritize sprint backlog', 'Analyze funnel retention'],
    ARRAY['Bachelor degree in Business, Engineering, or relevant experience'],
    'ONET'
  ),
  (
    '50000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000004',
    'Digital Marketing Specialist',
    'digital-marketing-specialist',
    'Develops and executes multi-channel organic and paid growth strategies across SEO, content, email marketing, and social channels.',
    'NON_TECHNICAL',
    'Digital Agency / E-Commerce',
    68000,
    'HIGH',
    ARRAY['Execute SEO keyword research', 'Optimize landing page conversion rates', 'Manage organic editorial calendars', 'Report on ROI metrics'],
    ARRAY['Bachelor degree in Marketing, Communications, or proven campaign results'],
    'ESCO'
  )
ON CONFLICT (name) DO NOTHING;

-- 6. CAREER ROLE SKILL REQUIREMENTS
INSERT INTO public.career_role_skills (career_role_id, skill_id, required_level, importance) VALUES
  ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'L4', 0.95), -- Full Stack -> JavaScript L4
  ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', 'L3', 0.90), -- Full Stack -> React L3
  ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000003', 'L3', 0.85), -- Full Stack -> Node.js L3
  ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000004', 'L3', 0.80), -- Full Stack -> SQL L3
  ('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000006', 'L3', 0.95), -- APM -> Product Roadmapping L3
  ('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000007', 'L2', 0.70), -- APM -> Figma L2
  ('50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000008', 'L4', 0.95)  -- Marketer -> SEO L4
ON CONFLICT (career_role_id, skill_id) DO NOTHING;

-- 7. EDUCATIONAL RESOURCES
INSERT INTO public.resources (provider_id, title, url, description, skill_id, topic, difficulty, content_type, duration_minutes, is_free) VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'JavaScript Algorithms and Data Structures',
    'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/',
    'Comprehensive free interactive curriculum covering JS fundamentals, loops, ES6+, OOP, and functional programming.',
    '40000000-0000-0000-0000-000000000001',
    'JavaScript Fundamentals & Algorithms',
    'L2',
    'COURSE',
    1800,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'MDN Guide: Closures in Depth',
    'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures',
    'Definitive technical documentation on lexical scoping, closure memory lifecycle, and practical patterns.',
    '40000000-0000-0000-0000-000000000001',
    'Closures & Scoping',
    'L3',
    'DOCUMENTATION',
    45,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000006',
    'Interactive SQL Lessons & Queries',
    'https://sqlbolt.com',
    'Self-paced interactive browser tutorials explaining SELECT queries, constraints, aggregation, and JOIN execution.',
    '40000000-0000-0000-0000-000000000004',
    'SQL Joins & Aggregations',
    'L2',
    'INTERACTIVE',
    120,
    true
  );

-- 8. ENTERPRISE REPUTED COMPANY INTERVIEW PATTERNS
INSERT INTO public.companies (id, name, slug, website_url, industry) VALUES
  ('60000000-0000-0000-0000-000000000001', 'Tata Consultancy Services (TCS)', 'tcs', 'https://www.tcs.com', 'IT Services & Consulting'),
  ('60000000-0000-0000-0000-000000000002', 'Infosys', 'infosys', 'https://www.infosys.com', 'IT Services & Consulting'),
  ('60000000-0000-0000-0000-000000000003', 'Zoho Corporation', 'zoho', 'https://www.zoho.com', 'Enterprise Cloud Software'),
  ('60000000-0000-0000-0000-000000000004', 'Amazon', 'amazon', 'https://www.amazon.jobs', 'Cloud, E-Commerce & Tech')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.company_patterns (company_id, target_role, assessment_sections, technical_topics, aptitude_topics, interview_rounds, difficulty, source) VALUES
  (
    '60000000-0000-0000-0000-000000000001',
    'Software Engineer / Associate',
    ARRAY['Numerical Ability', 'Verbal Reasoning', 'Reasoning Ability', 'Advanced Coding'],
    ARRAY['Data Structures', 'C/Java/Python Syntax', 'Pointers', 'OOP Principles'],
    ARRAY['Percentages & Profit-Loss', 'Permutations & Probability', 'Syllogisms', 'Data Sufficiency'],
    '[
      {"roundNumber": 1, "roundName": "National Qualifier Test (NQT)", "description": "Online cognitive, verbal and coding assessment", "typicalDurationMinutes": 180},
      {"roundNumber": 2, "roundName": "Technical Interview", "description": "Discussion on academic projects, core languages, and basic algorithms", "typicalDurationMinutes": 35},
      {"roundNumber": 3, "roundName": "HR / Managerial Round", "description": "Behavioral alignment, location preferences, and communication", "typicalDurationMinutes": 20}
    ]'::jsonb,
    'L2',
    'REPORTED_EXPERIENCE'
  ),
  (
    '60000000-0000-0000-0000-000000000003',
    'Software Developer',
    ARRAY['General Aptitude & C Output', 'Advanced Programming', 'Design & System Basics', 'HR Interview'],
    ARRAY['Basic C/Java Flow', 'Recursion', 'Pattern Printing', 'String Manipulation', 'Basic System Architecture'],
    ARRAY['Series Completion', 'Logical Puzzles', 'Time and Work', 'Distance and Speed'],
    '[
      {"roundNumber": 1, "roundName": "Written Aptitude & Basic C Programming", "description": "Multiple choice aptitude + C code output prediction", "typicalDurationMinutes": 90},
      {"roundNumber": 2, "roundName": "Basic Programming Round", "description": "Hands-on machine test with 5 algorithmic problems", "typicalDurationMinutes": 120},
      {"roundNumber": 3, "roundName": "Advanced Programming Round", "description": "Application development problem (e.g. Railway Reservation, Snake Game)", "typicalDurationMinutes": 180},
      {"roundNumber": 4, "roundName": "Technical HR & General HR", "description": "In-depth code walkthrough and culture fit", "typicalDurationMinutes": 45}
    ]'::jsonb,
    'L3',
    'REPORTED_EXPERIENCE'
  );
