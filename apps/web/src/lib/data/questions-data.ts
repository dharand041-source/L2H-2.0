export interface QuestionItem {
  id: string;
  roleSlug: string;
  skillName: string;
  topic: string;
  difficulty: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  type: 'MCQ' | 'CODING' | 'SQL' | 'DEBUGGING' | 'SCENARIO';
  prompt: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  distractorExplanations?: Record<string, string>;
  conceptTested: string;
  source: string;
}

export const QUESTION_BANK: QuestionItem[] = [
  // Full-Stack: JavaScript L3
  {
    id: 'q-js-001',
    roleSlug: 'full-stack-developer',
    skillName: 'JavaScript',
    topic: 'Closures & Scoping',
    difficulty: 'L3',
    type: 'MCQ',
    prompt: 'What will be output to the console after executing the following JavaScript code snippet?',
    codeSnippet: `function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}
const c1 = createCounter();
const c2 = createCounter();
c1();
c1();
console.log(c2());`,
    options: ['1', '2', '3', 'undefined'],
    correctAnswer: '1',
    explanation: 'Each invocation of `createCounter()` creates a new distinct lexical environment with its own independent `count` variable. Therefore, calling `c1()` twice increments `c1`\'s internal count to 2, while calling `c2()` for the first time increments its own independent count from 0 to 1.',
    distractorExplanations: {
      '2': 'Confuses `c2` with `c1`. `c1` was called twice, but `c2` is a separate closure instance.',
      '3': 'Incorrectly assumes state is shared across separate closure instances.',
      'undefined': 'The function explicitly returns the incremented number.'
    },
    conceptTested: 'Lexical Environment & Closure Independence',
    source: 'Learn-2-Hire Original'
  },

  // Full-Stack: React L2
  {
    id: 'q-react-001',
    roleSlug: 'full-stack-developer',
    skillName: 'React',
    topic: 'Hooks & Re-rendering',
    difficulty: 'L2',
    type: 'MCQ',
    prompt: 'In React, why should state updates that depend on the previous state use the functional updater syntax (e.g. `setCount(prev => prev + 1)`)?',
    options: [
      'To prevent asynchronous state batches from operating on stale snapshot values',
      'Because direct state mutation is faster in production builds',
      'It is strictly required by the TypeScript compiler',
      'To force the component to skip React reconciliation'
    ],
    correctAnswer: 'To prevent asynchronous state batches from operating on stale snapshot values',
    explanation: 'React batches state updates within event handlers. If multiple updates occur or if state relies on an asynchronous closure, reading state directly references the render snapshot rather than the latest queued value. The functional updater guarantees access to the latest committed state.',
    distractorExplanations: {
      'Because direct state mutation is faster in production builds': 'Direct state mutation is an anti-pattern that violates React immutability rules.',
      'It is strictly required by the TypeScript compiler': 'TypeScript accepts both direct values and updater functions.',
      'To force the component to skip React reconciliation': 'Updaters do not bypass reconciliation.'
    },
    conceptTested: 'React State Batching & Closures',
    source: 'Learn-2-Hire Original'
  },

  // Full-Stack: Node.js L1
  {
    id: 'q-node-001',
    roleSlug: 'full-stack-developer',
    skillName: 'Node.js',
    topic: 'Event Loop & I/O',
    difficulty: 'L1',
    type: 'MCQ',
    prompt: 'In the Node.js architecture, which component executes asynchronous, non-blocking I/O operations such as filesystem access and DNS lookups?',
    options: [
      'libuv thread pool',
      'V8 JavaScript Engine directly',
      'The client browser web worker',
      'Apache HTTP daemon'
    ],
    correctAnswer: 'libuv thread pool',
    explanation: 'While the V8 engine executes single-threaded JavaScript code, Node.js delegates asynchronous I/O operations (such as filesystem calls via `fs`, DNS lookups, and crypto) to `libuv`, which manages a background thread pool and the event loop.',
    distractorExplanations: {
      'V8 JavaScript Engine directly': 'V8 executes JavaScript syntax; it relies on libuv for asynchronous OS platform bindings.',
      'The client browser web worker': 'Node.js is a server-side runtime, not a browser environment.',
      'Apache HTTP daemon': 'Apache is a separate web server software, unrelated to Node runtime internals.'
    },
    conceptTested: 'Node.js Runtime Architecture (V8 vs libuv)',
    source: 'Learn-2-Hire Original'
  },

  // Full-Stack: SQL L2
  {
    id: 'q-sql-001',
    roleSlug: 'full-stack-developer',
    skillName: 'SQL & Relational DBs',
    topic: 'Joins & Constraints',
    difficulty: 'L2',
    type: 'SQL',
    prompt: 'Given two tables `candidates` (id, name) and `applications` (id, candidate_id, status), which query correctly returns ALL candidates regardless of whether they have submitted an application?',
    options: [
      'SELECT c.name, a.status FROM candidates c LEFT JOIN applications a ON c.id = a.candidate_id;',
      'SELECT c.name, a.status FROM candidates c INNER JOIN applications a ON c.id = a.candidate_id;',
      'SELECT c.name, a.status FROM candidates c RIGHT JOIN applications a ON c.id = a.candidate_id;',
      'SELECT c.name, a.status FROM candidates c CROSS JOIN applications a;'
    ],
    correctAnswer: 'SELECT c.name, a.status FROM candidates c LEFT JOIN applications a ON c.id = a.candidate_id;',
    explanation: 'A `LEFT JOIN` preserves all rows from the left table (`candidates`), matching corresponding rows from the right table (`applications`) where available, and filling `NULL` when no match exists.',
    distractorExplanations: {
      'INNER JOIN': 'Discards candidates who have no matching row in `applications`.',
      'RIGHT JOIN': 'Preserves all applications, which could omit candidates without applications.',
      'CROSS JOIN': 'Computes the Cartesian product of all rows, producing meaningless pairings.'
    },
    conceptTested: 'Relational SQL Joins (LEFT vs INNER)',
    source: 'Learn-2-Hire Original'
  },

  // Full-Stack: Git L3
  {
    id: 'q-git-001',
    roleSlug: 'full-stack-developer',
    skillName: 'Git & GitHub',
    topic: 'Interactive Rebase & Hygiene',
    difficulty: 'L3',
    type: 'MCQ',
    prompt: 'What is the primary difference between `git merge feature-branch` and `git rebase main` when incorporating upstream changes into a feature branch?',
    options: [
      '`rebase` replays feature commits on top of the latest main tip, creating a linear history, whereas `merge` introduces a dedicated merge commit',
      '`rebase` permanently deletes uncommitted working tree changes',
      '`merge` changes previous commit SHA-1 hashes, while `rebase` preserves them',
      'There is no functional difference; they are aliases'
    ],
    correctAnswer: '`rebase` replays feature commits on top of the latest main tip, creating a linear history, whereas `merge` introduces a dedicated merge commit',
    explanation: '`git rebase` rewrites commit history by transplanting the base of the feature branch onto the tip of `main`, generating new commit SHAs and maintaining a clean, linear git log. `git merge` preserves original commits intact and creates a three-way merge commit.',
    distractorExplanations: {
      '`rebase` permanently deletes uncommitted working tree changes': 'Git halts rebase operations if untracked changes conflict.',
      '`merge` changes previous commit SHA-1 hashes': 'Merge never rewrites existing commit SHAs.',
      'There is no functional difference': 'Merge and rebase have completely distinct topological outcomes.'
    },
    conceptTested: 'Git Version Control Topology (Merge vs Rebase)',
    source: 'Learn-2-Hire Original'
  },

  // Product Manager: Strategy L3
  {
    id: 'q-pm-001',
    roleSlug: 'technical-product-manager',
    skillName: 'Product Roadmapping & PRDs',
    topic: 'Prioritization Frameworks',
    difficulty: 'L3',
    type: 'SCENARIO',
    prompt: 'When using the RICE scoring model (Reach, Impact, Confidence, Effort) to prioritize candidate sprint features, how is the composite score computed?',
    options: [
      '(Reach × Impact × Confidence) / Effort',
      '(Reach + Impact + Confidence) - Effort',
      '(Impact × Effort) / (Reach × Confidence)',
      'Reach / (Impact + Confidence + Effort)'
    ],
    correctAnswer: '(Reach × Impact × Confidence) / Effort',
    explanation: 'The RICE formula multiplies Reach (users affected per time period), Impact (estimated uplift per user), and Confidence (percentage degree of certainty), divided by Effort (person-months or story points). Higher values reflect higher return-on-investment priority.',
    distractorExplanations: {
      '(Reach + Impact + Confidence) - Effort': 'RICE is a multiplicative numerator model, not additive.',
      '(Impact × Effort) / (Reach × Confidence)': 'Inverts Effort and Reach, penalizing high-reach low-effort features.',
      'Reach / (Impact + Confidence + Effort)': 'Incorrect formula entirely.'
    },
    conceptTested: 'RICE Prioritization Math & Trade-offs',
    source: 'Learn-2-Hire Original'
  },

  // UI/UX: Design Systems L3
  {
    id: 'q-ux-001',
    roleSlug: 'ui-ux-designer',
    skillName: 'Design Systems & Tokens',
    topic: 'Token Hierarchy',
    difficulty: 'L3',
    type: 'MCQ',
    prompt: 'In modern design token architecture, what distinguishes an "Alias/Semantic Token" from a "Global/Primitive Token"?',
    options: [
      'Semantic tokens communicate design intent (e.g. `color-action-primary`), whereas Global tokens represent raw raw values (e.g. `color-orange-500`)',
      'Semantic tokens are only used for typography, while Global tokens are for colors',
      'Global tokens change based on light/dark mode, while Semantic tokens are static',
      'Semantic tokens are written in HTML, while Global tokens are in CSS'
    ],
    correctAnswer: 'Semantic tokens communicate design intent (e.g. `color-action-primary`), whereas Global tokens represent raw raw values (e.g. `color-orange-500`)',
    explanation: 'Global/Primitive tokens represent raw palette choices (`#E43D12`, `16px`). Semantic/Alias tokens map these raw values to purposeful UI contexts (`color-button-bg-primary`, `spacing-card-padding`), enabling seamless theme swapping (like dark mode) without altering component definitions.',
    distractorExplanations: {
      'Semantic tokens are only used for typography': 'Tokens apply universally across colors, radii, spacing, and elevation.',
      'Global tokens change based on light/dark mode': 'Semantic tokens change during theme swaps; global raw values remain constant.',
      'Semantic tokens are written in HTML': 'Design tokens are platform-agnostic JSON/CSS variables.'
    },
    conceptTested: 'Design Token Hierarchies (Global vs Semantic vs Component)',
    source: 'Learn-2-Hire Original'
  }
];

export function getQuestionsForRole(roleSlug: string, count = 5): QuestionItem[] {
  const matching = QUESTION_BANK.filter((q) => q.roleSlug === roleSlug);
  if (matching.length >= count) return matching.slice(0, count);
  // Return all matching plus general questions if needed
  return QUESTION_BANK.slice(0, count);
}
