# Learn-2-Hire 2.0: Adaptive Career Entry & Baseline Assessment Engine

## 1. Executive Summary & Core Thesis
Conventional hiring and skill platforms operate under a punitive paradigm: they ask *"How much do you already know?"* and immediately present advanced, gatekeeping technical challenges. When a fresher, high-school student, or career changer encounters these questions and fails, the platform delivers a demoralizing verdict (e.g., "Failed", "Low Aptitude", 0%).

**Learn-2-Hire 2.0** replaces this model with an **Adaptive Career Entry + Skill Baseline + Diagnostic Assessment Engine**:
1. *"Where are you starting?"* (Self-Reported Experience Calibration)
2. *"Let's measure your current level safely."* (Multi-Tier Adaptive Assessment)
3. *"Let's identify the specific competencies missing."* (Constructive Diagnostic Breakdown)
4. *"Let's guide you with curated free curricula."* (Personalized Roadmap)
5. *"Let's practice in an isolated sandbox."* (Practice Arena with AST Security)
6. *"Let's evaluate interview ability with voice recognition."* (Interview Simulation)
7. *"Let's match you to real verified opportunities."* (Explainable Match Factors)
8. *"If rejected, let's learn why and retrain."* (Closed-Loop Improvement)

---

## 2. Candidate Entry Calibration Model

### 2.1 The Three Starting Calibrations
The system introduces three candidate calibration levels:
- **`BEGINNER` (L0 - L1)**: Novice learners, freshers, or students with zero prior professional exposure.
  - Characteristics: Simple language, real-world analogies, syntax recognition, mental models, basic logic, zero penalty for unfamiliar framework mechanics.
- **`AMATEUR` (L2 - L3)**: Self-taught developers, bootcamp learners, or students who have built projects.
  - Characteristics: Medium difficulty, applied coding, practical debugging, relational queries, common architecture trade-offs.
- **`PROFESSIONAL` (L4 - L5)**: Candidates with professional engineering experience or strong mastery.
  - Characteristics: Complex system design, concurrency, database indexing, caching strategies, security, scale constraints.

> **Integrity Rule**: Self-selection is solely an initial heuristic signal. It does not inflate or fix the final demonstrated skill level. The candidate's real-time assessment performance determines the baseline score and verified passport entries.

### 2.2 First-Time Career Calibration Form
Prior to question generation, first-time users complete the *"Let's Find Your Starting Point"* calibration:
1. *Have you studied this field before?* (`none`, `basics`, `projects`, `professional`)
2. *How long have you been learning this area?* (`not_yet`, `under_3m`, `3_to_12m`, `over_1_year`, `professional`)
3. *Have you built anything related to this career?* (`true` / `false`)
4. *Have you worked professionally in this area?* (`true` / `false`)
5. *How comfortable are you with technical concepts?* (`very_new`, `beginner`, `comfortable`, `advanced`)

---

## 3. Dynamic Assessment Blueprint Generation

The assessment engine supports all 12 canonical career roles without hardcoded frontend branching:
1. Full-Stack Developer
2. Frontend Developer
3. Backend Developer
4. AI / Agentic AI Engineer
5. Machine Learning Engineer
6. Data Scientist
7. DevOps / Platform Engineer
8. Cybersecurity Architect
9. Technical Product Manager
10. UI/UX Designer
11. Digital Marketing Specialist
12. Talent Acquisition Partner

### Blueprint Structure
Each dynamic blueprint synthesizes a balanced question distribution across competencies:
- **`CAREER_FUNDAMENTALS`**: Foundational role awareness and mental models.
- **`CORE_SKILLS`**: Direct discipline skills (e.g., HTML/JS for Frontend, SQL/APIs for Backend).
- **`APPLIED_TASKS`**: Practical scenarios, debugging, or case studies.
- **`COGNITIVE_REASONING`**: Quantitative, logical, and verbal aptitude.

For non-coding roles (Product Manager, UI/UX, Marketing, TA), programming is replaced with practical role tasks, metrics interpretation (CAC/LTV, North Star, conversion rates), and structured case studies.

---

## 4. Streak-Based Micro-Adaptation Algorithm

During live assessment, the engine adjusts question difficulty dynamically:
```typescript
if (correctStreak >= 2) {
  // Promote difficulty boundedly: EASY -> MEDIUM -> HARD -> VERY_HARD
  currentDifficulty = stepUp(currentDifficulty);
} else if (incorrectStreak >= 2) {
  // Regress difficulty safely without dropping to zero abruptly
  currentDifficulty = stepDown(currentDifficulty);
}
```

### Safety Floors
- A candidate starting at `BEGINNER` who struggles with an L1 question remains at L0/L1 and is never pushed into L3/L4 questions.
- A candidate starting at `PROFESSIONAL` who answers correctly advances into high-complexity architectural trade-offs.

---

## 5. Non-Judgmental Diagnostic Scoring

The diagnostic evaluation rejects simplistic `correct / total` formulas in favor of difficulty-weighted scoring:
$$\text{Score} = \frac{\sum (\text{Correct}_i \times \text{Weight}_i)}{\sum \text{Weight}_i} \times 100$$
where weight scales progressively:
- L0 = $1.0\times$
- L1 = $1.5\times$
- L2 = $2.0\times$
- L3 = $2.5\times$
- L4 = $3.0\times$
- L5 = $3.5\times$

### Feedback Language Standards
The system prohibits humiliating labels (e.g., "Failed", "Bad", "Weak"). Instead, it presents constructive diagnostic milestones:
- *Not Yet Demonstrated*
- *Needs Practice*
- *Developing*
- *Applied Foundation*
- *Advanced Systems Mastery*
