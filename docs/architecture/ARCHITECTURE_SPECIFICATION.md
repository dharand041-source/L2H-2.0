# LEARN-2-HIRE 2.0: MASTER ENGINEERING & ARCHITECTURE SPECIFICATION

> **Status:** APPROVED FOR PHASE 0 IMPLEMENTATION  
> **System Class:** Full-Stack Enterprise Career Development & Employment Platform  
> **Target Deployments:** Vercel (Next.js Edge/Node runtime), Render/Railway/Docker (FastAPI backend + Redis Workers), Supabase (PostgreSQL 15+ with pgvector, Auth, Storage)

---

## 1. ARCHITECTURE PLAN & MONOREPO TOPOLOGY

Learn-2-Hire is engineered as a clean, domain-driven **modular monolith** with clear package separation, strict interface boundaries, and decoupled background workers.

```
learn-2-hire/
├── apps/
│   ├── web/                     # Next.js 14/15 App Router, React, Tailwind, Framer/GSAP
│   │   ├── src/
│   │   │   ├── app/             # Route handlers & Editorial page trees
│   │   │   ├── components/      # UI components (Primitives, Layout, Domain modules)
│   │   │   ├── hooks/           # Domain & UI hooks (React Query, Audio, Sockets)
│   │   │   ├── lib/             # Client utilities, Supabase client, API adapters
│   │   │   └── styles/          # Tailwind base, tokens, fonts, animations
│   │   └── package.json
│   └── api/                     # Python 3.11+ FastAPI Service
│       ├── app/
│       │   ├── core/            # Config, security, database session, telemetry
│       │   ├── domains/         # 22 Domain service packages
│       │   ├── providers/       # Abstracted provider adapters (AI, Jobs, Career, Voice)
│       │   ├── schemas/         # Pydantic schemas (aligned with Zod contracts)
│       │   └── main.py          # FastAPI application entrypoint
│       ├── requirements.txt
│       └── pyproject.toml
├── packages/
│   ├── types/                   # Canonical TypeScript domain contracts & DTOs
│   │   └── src/index.ts
│   ├── validation/              # Canonical Zod runtime validation schemas
│   │   └── src/index.ts
│   ├── database/                # Canonical PostgreSQL schemas, DDL, migrations & seeds
│   │   ├── migrations/          # Versioned SQL migrations (001 to 022)
│   │   └── seeds/               # Baseline career, skill, questions & resource seeds
│   └── design-system/           # Tokens, color matrices, editorial typography clamp()
│       └── src/tokens.ts
├── services/
│   └── workers/                 # Redis-backed job workers (Celery/RQ/BullMQ equivalent)
│       ├── tasks/               # Job refreshes, question variations, resume ATS parsing
│       └── worker.py
├── docs/
│   └── architecture/            # Architectural blueprints & diagrams
└── tests/                       # End-to-end and cross-domain integration test suite
```

### Domain Boundaries
Each domain adheres strictly to:
1. **Schema & Model**: Pydantic / SQLAlchemy & TypeScript / Zod.
2. **Repository & Data Access**: Strict PostgreSQL queries; no raw ad-hoc mutations from UI.
3. **Service Layer**: Business logic, non-repetition calculations, skill weighting, and eligibility checks.
4. **Provider Adapter**: External provider interaction isolated behind abstract interfaces.
5. **API Routes**: Explicit REST endpoints with standardized HTTP response envelopes.

---

## 2. COMPREHENSIVE ROUTE MAP

### Public Editorial Routes
- `/` — Homepage: Editorial statement ("LEARN. PROVE. GET HIRED."), core loop interactive diagram, career spectrum showcase.
- `/how-it-works` — Deep dive into the 12-stage career loop: Discover → Assess → Analyze → Learn → Practice → Build → Prove → Prepare → Match → Apply → Track → Improve.
- `/careers` — Career Explorer: Technical and Non-technical occupation atlas.
- `/careers/[slug]` — Deep career dossier: Competency matrix, salary ranges, industry outlook, required skill benchmarks.
- `/resources` — Open learning catalog across freeCodeCamp, MDN, CS50, MIT OCW, SWAYAM, etc.
- `/about` — Platform philosophy, editorial mission, transparency in AI evaluation.
- `/contact` — Support and partnership channel.

### Authentication Routes
- `/auth/login` — Supabase Email/Password and Google OAuth.
- `/auth/signup` — Registration with role selection intent.
- `/auth/forgot-password` — Password reset request flow.
- `/auth/reset-password` — Secure callback handler for credential renewal.

### Progressive Onboarding Flow
- `/onboarding` — Multi-step stateful wizard (Steps 1–9) with persistence:
  1. Personal info
  2. Education background
  3. Experience level
  4. Career interests
  5. Tech vs. Non-tech track preference
  6. Target career selection
  7. Current self-reported skills
  8. Preferred work mode and geographic preferences
  9. Baseline assessment recommendation trigger

### Authenticated Application Routes (Portal)
- **MAIN**
  - `/dashboard` — Action headquarters: Readiness score, Next Best Action, active milestones, priority skill gaps, recent achievements.
- **CAREER**
  - `/careers/explore` — Full occupational search and filtering (ESCO/O*NET backed).
  - `/careers/categories` — Domain clusters (Engineering, Product, Marketing, Data, Operations).
  - `/careers/recommended` — Algorithmic role matches based on user skill vectors.
  - `/careers/compare` — Side-by-side gap comparison between 2 or 3 target roles.
  - `/careers/saved` — Bookmarked career profiles.
  - `/skills/analysis` — Radar graph, skill proficiency breakdown (L0 to L5), weighted evidence ledger.
- **DEVELOP**
  - `/assessments` — Assessment lobby and active diagnostics.
  - `/assessments/baseline` — Entry diagnostic for calibrated level assignment.
  - `/assessments/technical` — Skill-specific technical evaluations.
  - `/assessments/aptitude` — Quantitative and analytical evaluations.
  - `/assessments/logical` — Inductive and deductive reasoning tracks.
  - `/assessments/role/[slug]` — Holistic role readiness assessment.
  - `/assessments/company/[pattern]` — Company-pattern mock tests (TCS, Infosys, Zoho, Amazon, Google).
  - `/assessments/history` — Historical attempts, time-taken curves, and weakness trends.
  - `/assessments/results/[id]` — Detailed diagnostic report with question-by-question explanations.
  - `/learning` — Personalized curriculum hub.
  - `/learning/roadmap` — Directed acyclic graph (DAG) of prerequisite topics.
  - `/learning/courses` — Curated modules mapped to skill gaps.
  - `/learning/lessons/[id]` — Content reader, documentation deep-links, and video embeds.
  - `/learning/resources` — Curated external provider ecosystem.
  - `/learning/weak-topics` — Dynamic remedial units triggered by assessment failures.
  - `/practice` — Interactive problem-solving arena.
  - `/practice/coding` — Code editor with test case execution.
  - `/practice/dsa` — Algorithms and data structures challenges.
  - `/practice/sql` — Interactive relational database challenge runner.
  - `/practice/debugging` — Broken-code triage challenges.
  - `/practice/role-challenges` — Non-technical case studies, marketing sprints, and wireframe critiques.
  - `/practice/history` — Submission logs, runtime efficiency, and test verdicts.
- **PROVE**
  - `/projects` — Project catalog and milestone tracker.
  - `/projects/recommended` — Projects dynamically suggested to bridge active skill gaps.
  - `/projects/workspace/[id]` — Milestone task board, GitHub repo connector, and submission portal.
  - `/projects/submission/[id]` — Deliverable verification (URL, screenshots, architecture notes).
  - `/projects/evaluation/[id]` — Rubric-based evaluation report and SkillEvidence generation.
  - `/skills/proof` — Candidate skill passport: Verified skills, GitHub links, assessment certificates.
  - `/p/[username]` — Public verifiable candidate career profile.
- **PREPARE**
  - `/interviews` — Interview simulator lobby.
  - `/interviews/mock` — AI-guided voice or text interview session with role-specific questions.
  - `/interviews/technical` — Deep-dive system design or coding interview scenarios.
  - `/interviews/behavioral` — STAR-method behavioral and leadership evaluations.
  - `/interviews/company/[pattern]` — Company-pattern interview rounds.
  - `/interviews/history` — Session recordings, transcripts, and evaluation scorecards.
  - `/interviews/feedback/[id]` — Granular breakdown: Technical correctness, communication clarity, problem-solving structure.
  - `/resume` — Resume builder and optimizer.
  - `/resume/builder` — Structured profile-to-resume editor.
  - `/resume/versions` — Role-targeted resume variants.
  - `/resume/analyzer` — ATS compatibility analyzer, keyword coverage, and missing competency alerts.
- **OPPORTUNITIES**
  - `/opportunities` — Multi-provider curated job feed (Adzuna, Remotive, Jooble, Employer Career Feeds).
  - `/opportunities/jobs` — Full-time employment listings.
  - `/opportunities/internships` — Student and fresher internships.
  - `/opportunities/startups` — Early-stage high-growth roles.
  - `/opportunities/remote` — Distributed work listings.
  - `/opportunities/saved` — Bookmarked listings.
  - `/opportunities/details/[id]` — Job specification, required skills, and direct external application link.
  - `/opportunities/eligibility/[id]` — Explicit rule-based qualification checker (Skills, Education, Experience, Work Mode).
- **APPLICATIONS**
  - `/applications` — Application management center.
  - `/applications/kanban` — Drag-and-drop status board (Saved → Applied → Screening → Assessment → Interview → Offer → Rejected).
  - `/applications/timeline` — Chronological audit trail of recruiter touchpoints.
- **GROW**
  - `/improve` — Closed-loop improvement engine: Gap remediation plan generated from interview/assessment weaknesses.
  - `/analytics` — Longitudinal analytics: Skill velocity, assessment mastery curves, practice streaks, application conversion funnels.
- **SYSTEM**
  - `/notifications` — High-priority reminders (reassessments, follow-ups, new matching jobs).
  - `/profile/settings` — Account credentials, notification settings, privacy controls.
- **ADMIN**
  - `/admin/dashboard` — Platform health, active jobs, question bank statistics.
  - `/admin/questions` — Question moderation, quality scoring, variant generation review.
  - `/admin/providers` — Ingestion sync runs, provider quotas, and error rates.

---

## 3. DATABASE ER ARCHITECTURE (CANONICAL SCHEMA)

PostgreSQL with `pgvector` enabled for semantic matching of skill embeddings, question topics, and job requirement vectors.

```
                    +-------------------+
                    |    auth.users     |
                    +---------+---------+
                              | 1:1
                    +---------v---------+
                    |     profiles      |
                    +---------+---------+
                              |
       +----------------------+----------------------+
       | 1:M                  | 1:M                  | 1:M
+------v-------+      +-------v------+       +-------v--------+
|  education   |      |  experience  |       |   user_skills  |
+--------------+      +--------------+       +-------+--------+
                                                     |
                                                     | references
                                             +-------v--------+
                                             |     skills     |
                                             +-------+--------+
                                                     | M:N
                                             +-------v--------+
                                             |  career_roles  |
                                             +-------+--------+
                                                     |
       +---------------------------------------------+------------------------------------+
       |                                             |                                    |
+------v--------+                             +------v--------+                    +------v--------+
|  assessments  |                             | learning_paths|                    | opportunities |
+------+--------+                             +------+--------+                    +------+--------+
       |                                             |                                    |
+------v--------+                             +------v--------+                    +------v--------+
|   questions   |                             |   resources   |                    | applications  |
+---------------+                             +---------------+                    +---------------+
```

### Table Definitions & Relational Integrity

1. **`profiles`**: Extended profile linked to `auth.users(id)` ON DELETE CASCADE. Stores headline, bio, selected target career role (`target_role_id`), readiness score, and preferences.
2. **`education` & `experience`**: Academic history and employment records.
3. **`career_categories` & `career_roles`**: Hierarchical career taxonomy with ESCO / O*NET codes.
4. **`skills` & `competencies`**: Canonical atomic skills (e.g. "PostgreSQL", "React", "Negotiation", "Financial Modeling") and high-level competency clusters.
5. **`career_role_skills`**: Junction table specifying required skill level (L0–L5) and importance weighting (0.0 to 1.0) for every career role.
6. **`user_skills`**: Canonical record of candidate skill proficiency. Contains `current_level` (NUMERIC 0.0–5.0), `confidence_score`, `verified_status`, and last assessed timestamp.
7. **`skill_evidence`**: Proven receipts linking a `user_skill` to an `assessment_attempt`, `project_submission`, `practice_attempt`, or `interview_session`.
8. **`skill_gaps`**: Derived table calculating `target_level - current_level`, priority score, and remediation status.
9. **`assessments` & `assessment_blueprints`**: Assessment catalog and structural templates defining question distributions across skills and difficulties.
10. **`questions` & `question_variants`**: Multilingual, multi-format question repository (MCQ, SQL, Coding, Scenario) with Bloom's taxonomy tags, quality ratings, and license attribution.
11. **`question_sources`**: Reference ecosystems (iGET, Sansal, ProSculpt, BANKI, Learn-2-Hire Original) with legal licenses and original URLs.
12. **`assessment_attempts` & `assessment_answers`**: User test sessions, timing logs, item-level answers, correctness verdicts, and detailed diagnostic output.
13. **`learning_paths` & `learning_path_items`**: Personalized remedial curricula generated dynamically from active `skill_gaps`.
14. **`resources` & `resource_providers`**: External learning resources from approved open providers (freeCodeCamp, MDN, CS50, MIT OCW, SWAYAM, NPTEL, SQLBolt) with metadata, direct URLs, and verification timestamps.
15. **`learning_progress`**: Granular tracking of user interaction, milestone completion, and post-lesson practice scores.
16. **`practice_challenges` & `practice_attempts`**: Problem bank (Coding, SQL, Aptitude, Logical, Verbal, Role-based) and telemetry (code submitted, pass rate, memory/runtime metrics).
17. **`projects`, `project_milestones`, `project_submissions`, `project_evaluations`**: Real-world portfolio projects mapping directly to target role competencies, code artifact reviews, and rubric scores.
18. **`interview_templates`, `interview_sessions`, `interview_answers`, `interview_feedback`**: Role-specific mock interview sessions, audio/text transcripts, and multi-factor evaluation vectors (technical, communication, structural).
19. **`resumes`, `resume_versions`, `resume_analyses`**: Candidate resume representations, tailored variants for specific roles, and ATS compatibility reports.
20. **`companies` & `company_patterns`**: Enterprise interview patterns (TCS, Infosys, Zoho, Amazon, Google) with section blueprints and reported assessment topics.
21. **`opportunities`, `opportunity_requirements`, `job_providers`, `job_matches`**: Ingested job listings from legitimate sources (Adzuna, Remotive, Jooble, employer portals) with deduplication hashes, eligibility scorecards, and explainable match factors.
22. **`applications` & `application_events`**: Candidate application tracker, Kanban status states, recruiter touchpoints, and post-application feedback loops.
23. **`recommendations`, `notifications`, `activities`, `provider_sync_runs`, `audit_logs`**: System event stream, notification queue, and observability audit records.

---

## 4. DESIGN-TOKEN SYSTEM & EDITORIAL AESTHETICS

Learn-2-Hire abandons generic SaaS dark-mode blobs and uniform purple gradients in favor of an **editorial, Swiss-grid inspired design language**.

### Color Tokens (Mandatory 5 + 2 Foundation)
- `--color-orange: #E43D12` (Primary CTAs, major buttons, selected nav, urgent alerts)
- `--color-rose: #D6536D` (Assessment, interview, secondary states, diagnostics)
- `--color-pink: #FFA2B6` (Learning, soft accents, highlights, tags)
- `--color-yellow: #EFB11D` (Roadmaps, progress, achievements, attention states)
- `--color-cream: #EBE9E1` (Dominant page background canvas)
- `--color-ink: #171714` (Primary typography, heavy borders, deep accents)
- `--color-paper: #F7F5EF` (Elevated card surfaces, input backgrounds, modal surfaces)

### Editorial Typography Scale
- **Display Condensed**: `Anton` / `Bebas Neue`
  - Display: `clamp(3.5rem, 8vw, 9rem)` — Line height `0.95`, Letter spacing `-0.02em`
  - H1: `clamp(2.5rem, 6vw, 6.5rem)` — Line height `1.0`
  - H2: `clamp(1.75rem, 3.5vw, 3.5rem)` — Line height `1.1`
- **Modern Sans**: `Inter` / `Manrope`
  - Body Large: `18px / 1.6`
  - Body Regular: `16px / 1.6`
  - Metadata / Small: `13px / 1.4` (Uppercase, track-wider)

### Editorial Layout Principles
- **Grid**: 12-column Swiss grid with asymmetric content spanning (e.g. 5 cols editorial intro / 7 cols interactive tool).
- **Borders**: Thin, crisp 1px borders using `--color-ink` at 15% opacity or solid 1px ink borders for high-contrast cards.
- **Elevation**: Flat surfaces with subtle offset drop-shadows (`box-shadow: 4px 4px 0px #171714`) instead of blurry diffused drop shadows.

---

## 5. COMPONENT ARCHITECTURE

All components reside in a clear hierarchy:

```
src/components/
├── ui/                     # Primitives (Radix/shadcn inspired, restyled to L2H tokens)
│   ├── button.tsx          # Editorial button with crisp borders and hover shifts
│   ├── badge.tsx           # Level badges (L0-L5), domain pills, status tags
│   ├── card.tsx            # Paper-backed cards with sharp or subtly rounded corners
│   ├── input.tsx           # Crisp input fields with accessible focus rings
│   ├── tabs.tsx            # Editorial tab strip with high-contrast active borders
│   ├── dialog.tsx          # Accessible modal dialogs with cream/paper backdrops
│   ├── progress-ring.tsx   # SVG circular readiness metric with yellow/orange strokes
│   └── metric.tsx          # Large editorial number display with small caps metadata
├── layout/                 # Shell & Structural layout
│   ├── app-shell.tsx       # Main authenticated container
│   ├── editorial-nav.tsx   # Public marketing navigation header
│   ├── sidebar.tsx         # Collapsible desktop sidebar with grouped domains
│   ├── topbar.tsx          # User status, readiness pill, notifications bell
│   ├── mobile-bottom-nav.tsx # Fixed thumb-friendly mobile dock (Home, Learn, Practice, Jobs, Profile)
│   └── mobile-drawer.tsx   # "More" navigation sheet for deep domain pages
├── domain/                 # Business domain components
│   ├── career/             # CareerCard, CompetencyMatrix, RoleComparison
│   ├── assessment/         # QuestionRenderer, CodeEditor, Timer, DiagnosticScorecard
│   ├── learning/           # RoadmapDAG, ResourceCard, LessonProgressTracker
│   ├── practice/           # ChallengeRunner, TestOutputConsole, StreakWidget
│   ├── project/            # MilestoneChecklist, GitHubSubmissionForm, EvaluationRubric
│   ├── interview/          # AudioVisualizer, QuestionCard, FeedbackScorecard
│   ├── resume/             # ResumeBlockEditor, ATSScoreGauge, KeywordCoveragePill
│   ├── opportunities/      # JobListingCard, MatchScoreExplainer, EligibilityVerdict
│   └── applications/       # KanbanBoard, ApplicationDetailDrawer, StatusBadge
└── feedback/               # State indicators
    ├── loading-state.tsx   # Editorial loader with brand typography
    ├── empty-state.tsx     # Contextual actionable empty states (no fake "Coming Soon")
    └── error-state.tsx     # Structured error recovery cards
```

---

## 6. PROVIDER ARCHITECTURE (INTERFACES & ADAPTERS)

Every external third-party integration is strictly decoupled behind an abstract class/interface, ensuring zero vendor lock-in and testability.

### 1. `CareerDataProvider`
```typescript
interface CareerDataProvider {
  fetchRoleByCode(code: string): Promise<NormalizedCareerRole>;
  searchRoles(query: string, category?: string): Promise<NormalizedCareerRole[]>;
  getCompetencyTree(roleId: string): Promise<CompetencyTree>;
}
// Concrete Adapters: EscoCareerAdapter, OnetCareerAdapter, StaticSeedAdapter
```

### 2. `ResourceProvider`
```typescript
interface ResourceProvider {
  searchResources(skill: string, level: DifficultyLevel): Promise<EducationalResource[]>;
  verifyUrlStatus(url: string): Promise<boolean>;
}
// Concrete Adapters: FreeCodeCampAdapter, MdnAdapter, MITOcwAdapter, SwayamAdapter
```

### 3. `JobProvider`
```typescript
interface JobProvider {
  fetchOpportunities(filter: JobQueryFilter): Promise<NormalizedOpportunity[]>;
  verifyListingFreshness(externalId: string): Promise<FreshnessStatus>;
}
// Concrete Adapters: AdzunaJobAdapter, JoobleJobAdapter, RemotiveJobAdapter, EmployerPortalAdapter
```

### 4. `AIProvider` (Decoupled Intelligence Layer)
```typescript
interface AIProvider {
  analyzeSkillGaps(profile: UserSkillVector, targetRole: RoleCompetencyVector): Promise<SkillGapAnalysis>;
  generateQuestionVariant(blueprint: QuestionBlueprint, excludedTokens: string[]): Promise<ValidatedQuestion>;
  evaluateInterviewResponse(question: string, answer: string, rubric: Rubric): Promise<InterviewEvaluation>;
  analyzeResumeJobFit(resumeText: string, jobSpec: JobRequirementSpec): Promise<ResumeJobFitAnalysis>;
}
// Concrete Adapters: GeminiAIAdapter, OpenAIAIAdapter, AnthropicAIAdapter, MockAIAdapter (for deterministic CI)
```

### 5. `VoiceProvider`
```typescript
interface VoiceProvider {
  synthesizeSpeech(text: string): Promise<AudioBuffer | string>;
  transcribeAudio(audioStream: ReadableStream): Promise<string>;
}
// Concrete Adapters: WebSpeechVoiceAdapter (Browser native), ElevenLabsVoiceAdapter, MockVoiceAdapter
```

---

## 7. ENVIRONMENT VARIABLE SPECIFICATION

Full specification documented in [`.env.example`](file:///c:/Users/VPK/Documents/L2H%202.0/L2H-2.0/.env.example).  
Secrets are strictly kept on the server and never bundled in client builds.

---

## 8. DEPLOYMENT ARCHITECTURE

- **Frontend (`apps/web`)**: Hosted on Vercel with automatic edge routing, image optimization, and ISR for public career dossiers.
- **Backend API (`apps/api`)**: Python FastAPI container deployed on Render or Railway, utilizing Gunicorn + Uvicorn worker threads.
- **Worker Daemon (`services/workers`)**: Redis background queue process running scheduled ingestion feeds and async AI tasks.
- **Database (`Supabase PostgreSQL`)**: Managed instance with Row-Level Security (RLS) policies, PgBouncer transaction connection pooling, and automated backups.
- **Storage**: Supabase Storage buckets (`avatars`, `resumes`, `project_deliverables`, `interview_audio`).

---

## 9. IMPLEMENTATION ROADMAP (PHASES 0 TO 13)

| Phase | Title | Core Objectives | Acceptance Gate |
|---|---|---|---|
| **0** | **Architecture & Monorepo Foundation** | Monorepo layout, Design tokens, Canonical Database DDL, Shared Types, Zod & Pydantic contracts, Provider Interfaces, Build configs | `npm run build`, `pytest`, and TypeScript validation pass with zero errors |
| **1** | **Foundation & Auth Shell** | Next.js App Router, Supabase Auth integration, Editorial design system components, Responsive AppShell, Desktop & Mobile docks | Working Sign-in/Sign-up, Auth middleware protection, Editorial theme renders |
| **2** | **Career Discovery** | Career catalog (Technical & Non-technical), ESCO/O*NET ingestion, Competency mapping, Career comparison engine | Explore 50+ roles across tech & non-tech, interactive comparison view |
| **3** | **Assessment & Skill Analyzer** | Question database, non-repetition engine, adaptive difficulty (L0-L5), multi-format tests, weighted skill analyzer | Test taking, diagnostic report, non-repeat verification test |
| **4** | **Learning Hub** | Personalized DAG roadmap, curated educational resource catalog, lesson reader, progress tracker | Dynamic gap-to-course generation, resource deep links |
| **5** | **Practice Engine** | Code editor runner, SQL playground, aptitude & logical reasoning tracks, role challenges, streak tracking | Code evaluation sandbox, telemetry recording |
| **6** | **Projects & Skill Proof** | Project workspace, GitHub submission verification, rubric evaluation, public verifiable career profile | Project submission, verified skill passport generation |
| **7** | **Interview Simulator** | Mock interview engine, technical & behavioral tracks, speech synthesis/transcription abstraction, structured feedback | Voice/text interview flow with rubric scorecards |
| **8** | **Resume System** | Structured resume builder, role-targeted variants, ATS keyword analyzer, job description compatibility checker | PDF/JSON resume export, gap analysis |
| **9** | **Opportunities & Matching** | Multi-provider job ingestion, deduplication hash, explicit eligibility engine, explainable match factors | Job feeds across categories, eligibility check without scraping |
| **10** | **Application Tracker** | Drag-and-drop Kanban, timeline history, follow-up notifications, application notes | Full application lifecycle management |
| **11** | **Closed-Loop Improvement** | Retraining triggers from failed assessments or interview weaknesses, automated remedial plan | Seamless transition from rejection/failure to reassessment |
| **12** | **Analytics & Telemetry** | Longitudinal skill growth velocity, assessment mastery curves, practice streaks, funnel analytics | Interactive visual charts (Recharts) across all user activity |
| **13** | **Production Hardening** | Security audit (RLS, CSRF, Rate-limiting), WCAG AA accessibility audit, performance tuning, CI/CD pipelines | 100% test coverage for critical paths, Lighthouse score > 90 |

---

## 10. CRITICAL CLOSED-LOOP FLOWS

```
       [ Career Goal Selected ]
                  │
                  ▼
       [ Baseline Assessment ] ───► Evaluates L0 - L5
                  │
                  ▼
       [ Weighted Skill Analyzer ] ───► Calculates Gaps (e.g., Node.js L1 vs L3)
                  │
                  ▼
       [ Personalized Roadmap ] ───► freeCodeCamp, MDN, CS50 modules
                  │
                  ▼
       [ Interactive Practice ] ───► Coding, SQL, Aptitude challenges
                  │
                  ▼
       [ Real-World Project ] ───► Verified GitHub Deliverable
                  │
                  ▼
       [ Skill Evidence Created ] ───► Updates User Skill Graph to L3
                  │
                  ▼
       [ Opportunity Engine ] ───► Matches Candidate to Eligible Job
                  │
                  ▼
       [ Direct Application ] ───► Candidate Manages Pipeline in Kanban
                  │
                  ▼
       [ Interview Simulator ] ───► Role-specific Mock Preparation
                  │
                  ▼
       [ Post-Outcome Retraining ] ◄── Identified Weaknesses Re-feed Roadmap!
```
This closed loop guarantees that Learn-2-Hire is **ONE CONNECTED CAREER ECOSYSTEM**, not a collection of disconnected tabs.
