# Learn-2-Hire 2.0: Question Intelligence & Anti-Repetition Engine

## 1. Universal Question Bank Architecture
The assessment and practice question bank is organized as a unified, data-driven catalog supporting all 12 canonical career roles alongside universal cognitive reasoning tracks.

### Question Schema
Each question record contains extensive provenance, pedagogical, and security metadata:
```typescript
export interface AssessmentQuestion {
  id: string;
  careerRoleSlug: string;
  skillName: string;
  competency: string;
  section: AssessmentSection;
  topic: string;
  subtopic?: string;
  difficulty: AssessmentDifficulty; // 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5'
  targetLevel?: 'BEGINNER' | 'AMATEUR' | 'PROFESSIONAL';
  questionType: QuestionType; // MCQ | MULTI_SELECT | CODING | SQL | CASE_STUDY | SCENARIO | APTITUDE | LOGICAL_REASONING | VERBAL_REASONING
  questionFamily: string;
  questionVariant: string;
  variantGroupId: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  conceptTested: string;
  expectedTimeSeconds: number;
  points: number;
  normalizedHash: string; // SHA-256 hash of normalized prompt + sorted options
  sourceType: SourceType; // W3SCHOOLS_REFERENCE | MDN_REFERENCE | CS50_REFERENCE | FREECODECAMP_REFERENCE | ORIGINAL_L2H | PATTERN_INSPIRED
  sourceName: string;
  sourceUrl?: string;
  sourceConfidence: 'HIGH' | 'VERIFIED' | 'MEDIUM';
  originalityStatus: 'ORIGINAL_L2H' | 'CONCEPT_ALIGNED';
}
```

---

## 2. Educational Sourcing & Copyright Integrity Policy

### 2.1 The Concept-Aligned Sourcing Principle
Learn-2-Hire enforces strict copyright ethics:
- **Zero Bulk Scraping:** Proprietary or copyrighted question banks (e.g., GeeksforGeeks question text, LeetCode proprietary descriptions) are **NEVER** bulk scraped or reproduced.
- **Concept Alignment:** Open educational resources (W3Schools, MDN Web Docs, CS50, freeCodeCamp, official documentation) are utilized as **reference learning objectives**.
- **100% Original Drafting:** All question text, distractors, code snippets, and explanations are original items composed to evaluate the target learning objective.
- **Transparent Attribution:** When inspired by educational concepts, source URLs and references are credited transparently.
- **Truth in Provenance:** Company interview tags (e.g., "Google 2024") are never fabricated unless verified through verified public reporting.

---

## 3. Anti-Repetition SHA-256 Firewall & Cooldown Management

### 3.1 Normalized Hash Generation
To prevent candidates from encountering cosmetically modified duplicate questions, prompts and options undergo canonical normalization before hashing:
1. Strip all leading/trailing whitespace and collapse consecutive spaces.
2. Convert all text to lowercase.
3. Remove punctuation and formatting artifacts.
4. Normalize variable and identifier casing.
5. Sort options lexicographically.
6. Compute cryptographic SHA-256 digest.

```typescript
export function computeNormalizedHash(prompt: string, options: string[]): string {
  const normPrompt = normalizeText(prompt);
  const normOptions = options.map(normalizeText).sort().join('|');
  return crypto.createHash('sha256').update(`${normPrompt}::${normOptions}`).digest('hex');
}
```

### 3.2 Repetition Cooldown Rules
- **Exact Question Collision:** A candidate can **never** receive the same question in diagnostic assessment mode.
- **Question Family Cooldown:** Questions sharing the same `questionFamily` or `variantGroupId` (e.g., sliding window variants, SQL cohort joins) enforce a 3-question cooldown window.
- **Topic Saturation Limit:** No more than 2 consecutive questions are presented from the exact same subtopic, ensuring cross-competency breadth.

---

## 4. Sandboxed Code Execution Architecture

For coding-focused tracks (Full-Stack, Frontend, Backend, AI/ML, Data Science, DevOps, Cybersecurity), practical coding challenges are executed inside an isolated, multi-layered sandbox:

```
[Candidate Code Submission]
          ↓
[Static AST Safety Analyzer]  ──(Hostile pattern detected: fs, child_process, process.env)──> [SECURITY_VIOLATION Rejection]
          ↓
[Node VM Context Jail] (Zero filesystem, zero network, isolated global object)
          ↓
[Timeout Guard] (Max 2000ms wall-time bound; SIGINT on infinite loop)
          ↓
[Assertion Verification Engine] (Runs public and hidden invariant tests)
          ↓
[Score & Evidence Calculation] ──> [Skill Passport Calibration]
```

### Security Invariants
- Arbitrary operating system commands (`exec`, `spawn`, `fs.unlinkSync`) are intercepted statically and dynamically.
- Timeouts abort infinite loops safely without crashing the API server or memory limits.
- Sensitive environment variables (`DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) are unreachable from within the sandbox context.
