import { computeNormalizedHash } from './normalization';
import { AssessmentQuestion } from './question-types';

/**
 * Helper to build an AssessmentQuestion with automatic SHA-256 normalized hash calculation.
 */
function createQ(raw: Omit<AssessmentQuestion, 'normalizedHash'>): AssessmentQuestion {
  const lvl = raw.targetLevel || raw.difficulty || 'L3';
  return {
    ...raw,
    difficulty: raw.difficulty || lvl,
    targetLevel: lvl,
    questionText: raw.prompt,
    normalizedHash: computeNormalizedHash(raw.prompt, raw.options),
  };
}

export const UNIVERSAL_QUESTION_BANK: AssessmentQuestion[] = [
  // ===========================================================================
  // 1. FULL-STACK DEVELOPER (L1 -> L5)
  // ===========================================================================
  createQ({
    id: 'fs-l1-js-001',
    careerRoleSlug: 'full-stack-developer',
    skillName: 'JavaScript',
    competency: 'Core Language Fundamentals',
    topic: 'Data Types & Equality',
    difficulty: 'L1',
    questionType: 'MCQ',
    questionFamily: 'JS_EQUALITY_TYPE_COERCION',
    questionVariant: 'strict_vs_abstract_equality',
    variantGroupId: 'vg-js-eq-01',
    prompt: 'In JavaScript, what is the exact difference between the loose equality operator (`==`) and the strict equality operator (`===`)?',
    options: [
      '`===` checks both value and type without performing implicit type coercion, whereas `==` coerces types before comparing',
      '`==` checks both value and type, whereas `===` performs implicit string conversion',
      '`===` is deprecated in modern ECMAScript standard',
      'Both operators are identical in function and execution performance'
    ],
    correctAnswer: '`===` checks both value and type without performing implicit type coercion, whereas `==` coerces types before comparing',
    explanation: 'The strict equality operator (`===`) compares operands without type coercion. If operands have different types, it immediately evaluates to false. Loose equality (`==`) applies abstract equality coercion algorithms.',
    distractorExplanations: {
      '`==` checks both value and type': 'Inverts the behavior of strict and loose equality.',
      '`===` is deprecated': 'Strict equality is the recommended standard across all modern lint rules.',
      'Both operators are identical': 'They produce opposite results for expressions like `0 == false` (true) vs `0 === false` (false).'
    },
    conceptTested: 'ECMAScript Abstract vs Strict Equality Comparison',
    expectedTimeSeconds: 45,
    points: 10,
    sourceType: 'ORIGINAL_L2H',
    sourceName: 'Learn-2-Hire Core JS Taxonomy',
    sourceConfidence: 'HIGH',
    originalityStatus: 'ORIGINAL_L2H',
  }),

  createQ({
    id: 'fs-l2-react-001',
    careerRoleSlug: 'full-stack-developer',
    skillName: 'React',
    competency: 'Client State & Rendering',
    topic: 'Hooks & Dependency Array',
    difficulty: 'L2',
    questionType: 'DEBUGGING',
    questionFamily: 'REACT_USEEFFECT_STALE_CLOSURE',
    questionVariant: 'missing_interval_dependency',
    variantGroupId: 'vg-react-closure-01',
    prompt: 'A candidate writes an interval counter in React: `useEffect(() => { const timer = setInterval(() => { setCount(count + 1); }, 1000); return () => clearInterval(timer); }, []);`. Why does the counter stop incrementing past 1?',
    options: [
      'The empty dependency array captures the initial `count` value (0) in a stale closure',
      '`setInterval` is blocked by the React synthetic event system',
      'The cleanup function runs immediately on every render tick',
      '`count + 1` is not valid JSX syntax'
    ],
    correctAnswer: 'The empty dependency array captures the initial `count` value (0) in a stale closure',
    explanation: 'Because `count` is referenced inside the interval callback but not included in `useEffect` dependencies, the callback forms a stale closure over the initial state value 0. On every interval tick, it executes `setCount(0 + 1)`. The fix is either adding `count` or using the functional updater `setCount(prev => prev + 1)`.',
    distractorExplanations: {
      '`setInterval` is blocked': 'Browser intervals run independently on the window object.',
      'The cleanup function runs immediately': 'Cleanup only executes on unmount or re-render when dependencies change.',
      '`count + 1` is not valid JSX syntax': 'It is pure JavaScript expression logic, not JSX.'
    },
    conceptTested: 'React Stale Closures in Asynchronous Hooks',
    expectedTimeSeconds: 60,
    points: 15,
    sourceType: 'PATTERN_INSPIRED',
    sourceName: 'W3Schools React Exercises & MDN Docs',
    sourceCompany: 'Amazon',
    sourceYear: 2023,
    sourceConfidence: 'COMMUNITY_REPORTED',
    originalityStatus: 'PATTERN_INSPIRED',
  }),

  createQ({
    id: 'fs-l3-node-001',
    careerRoleSlug: 'full-stack-developer',
    skillName: 'Node.js',
    competency: 'Server Architecture & I/O',
    topic: 'Event Loop & Libuv Phases',
    difficulty: 'L3',
    questionType: 'CODE_OUTPUT',
    questionFamily: 'NODE_EVENT_LOOP_EXECUTION_ORDER',
    questionVariant: 'process_nexttick_vs_setimmediate',
    variantGroupId: 'vg-node-loop-01',
    prompt: 'What is the exact console output order of the following Node.js snippet?\n```javascript\nsetImmediate(() => console.log("immediate"));\nPromise.resolve().then(() => console.log("promise"));\nprocess.nextTick(() => console.log("nextTick"));\nconsole.log("sync");\n```',
    options: [
      'sync -> nextTick -> promise -> immediate',
      'sync -> promise -> nextTick -> immediate',
      'sync -> immediate -> nextTick -> promise',
      'nextTick -> sync -> promise -> immediate'
    ],
    correctAnswer: 'sync -> nextTick -> promise -> immediate',
    explanation: 'Synchronous execution occurs first ("sync"). Next, the microtask queue is drained: `process.nextTick` queue has priority over standard Promise microtasks ("nextTick", then "promise"). Finally, the event loop advances to the check phase where `setImmediate` executes ("immediate").',
    distractorExplanations: {
      'sync -> promise -> nextTick': 'In Node.js, `process.nextTick` microtasks are prioritized before Promise microtasks.',
      'sync -> immediate first': 'Macrotasks like `setImmediate` execute only after all microtasks have resolved.',
      'nextTick before sync': 'Synchronous statements on the call stack always complete before any event loop phases.'
    },
    conceptTested: 'Node.js Microtask vs Macrotask Event Loop Scheduling',
    expectedTimeSeconds: 60,
    points: 15,
    sourceType: 'ORIGINAL_L2H',
    sourceName: 'Learn-2-Hire Systems Engineering',
    sourceConfidence: 'HIGH',
    originalityStatus: 'ORIGINAL_L2H',
  }),

  createQ({
    id: 'fs-l3-sql-001',
    careerRoleSlug: 'full-stack-developer',
    skillName: 'SQL & Relational DBs',
    competency: 'Relational Schema & Query Optimization',
    topic: 'Window Functions & Aggregation',
    difficulty: 'L3',
    questionType: 'SQL',
    questionFamily: 'SQL_WINDOW_RANKING',
    questionVariant: 'dense_rank_vs_row_number',
    variantGroupId: 'vg-sql-rank-01',
    prompt: 'You have a table `candidate_scores(candidate_id, score)`. You need to find the top 3 highest scores, giving equal rank to ties without skipping subsequent ranks (e.g. 100, 100, 95 -> ranks 1, 1, 2). Which window function must be used?',
    options: [
      'DENSE_RANK() OVER (ORDER BY score DESC)',
      'ROW_NUMBER() OVER (ORDER BY score DESC)',
      'RANK() OVER (ORDER BY score DESC)',
      'NTILE(3) OVER (ORDER BY score DESC)'
    ],
    correctAnswer: 'DENSE_RANK() OVER (ORDER BY score DESC)',
    explanation: '`DENSE_RANK()` assigns consecutive integers to distinct ordering values without gaps when duplicates occur. `RANK()` creates gaps (1, 1, 3), while `ROW_NUMBER()` arbitrarily breaks ties with unique incremental numbers.',
    distractorExplanations: {
      'ROW_NUMBER()': 'Does not assign equal ranks to tied score values.',
      'RANK()': 'Skips subsequent ranks on ties (e.g. 1, 1, 3 instead of 1, 1, 2).',
      'NTILE(3)': 'Divides rows into 3 equal sized buckets rather than computing ordinal rank.'
    },
    conceptTested: 'SQL Analytic Window Functions (DENSE_RANK vs RANK)',
    expectedTimeSeconds: 50,
    points: 15,
    sourceType: 'PATTERN_INSPIRED',
    sourceName: 'GeeksforGeeks SQL Interview Experiences',
    sourceCompany: 'TCS',
    sourceYear: 2022,
    sourceConfidence: 'COMMUNITY_REPORTED',
    originalityStatus: 'PATTERN_INSPIRED',
  }),

  createQ({
    id: 'fs-l4-sys-001',
    careerRoleSlug: 'full-stack-developer',
    skillName: 'Docker & Deployment',
    competency: 'Distributed Architecture & Scale',
    topic: 'High-Concurrency Concurrency & Idempotency',
    difficulty: 'L4',
    questionType: 'SYSTEM_DESIGN',
    questionFamily: 'SYS_PAYMENT_IDEMPOTENCY',
    questionVariant: 'distributed_lock_double_charge',
    variantGroupId: 'vg-sys-idem-01',
    prompt: 'In a high-throughput booking API, multiple incoming HTTP requests with identical payloads arrive concurrently due to client network retry logic. Which architectural pattern guarantees the customer is charged exactly once?',
    options: [
      'Client-generated UUID idempotency key stored in Redis/PostgreSQL with atomic check-and-set and unique constraint',
      'Relying solely on client-side button disabling after first submission',
      'Adding a 2-second setTimeout on the backend before executing payment',
      'Truncating the payments database table before every purchase batch'
    ],
    correctAnswer: 'Client-generated UUID idempotency key stored in Redis/PostgreSQL with atomic check-and-set and unique constraint',
    explanation: 'Idempotency keys generated by clients allow the API gateway and payment processor to record the key in an atomic cache/database with a strict unique constraint. Redundant concurrent requests encounter the existing record and return the cached response without re-triggering charging.',
    distractorExplanations: {
      'Client-side button disabling': 'Fails against network disconnect retries, API scripts, and browser refreshes.',
      'Backend setTimeout': 'Increases latency without preventing race conditions between concurrent worker processes.',
      'Truncating database table': 'Destroys persistent transaction records.'
    },
    conceptTested: 'Distributed Systems Idempotent API Design',
    expectedTimeSeconds: 90,
    points: 20,
    sourceType: 'ORIGINAL_L2H',
    sourceName: 'Learn-2-Hire Architecture Blueprint',
    sourceCompany: 'Stripe',
    sourceYear: 2024,
    sourceConfidence: 'HIGH',
    originalityStatus: 'ORIGINAL_L2H',
  }),

  // ===========================================================================
  // 2. FRONTEND DEVELOPER (L1 -> L5)
  // ===========================================================================
  createQ({
    id: 'fe-l1-css-001',
    careerRoleSlug: 'frontend-developer',
    skillName: 'CSS & Layouts',
    competency: 'Web Standards & Layout Engines',
    topic: 'Box Model & Box-Sizing',
    difficulty: 'L1',
    questionType: 'MCQ',
    questionFamily: 'CSS_BOX_SIZING_MODEL',
    questionVariant: 'border_box_vs_content_box',
    variantGroupId: 'vg-css-box-01',
    prompt: 'When an element has CSS `width: 200px; padding: 20px; border: 5px solid black; box-sizing: border-box;`, what is its total rendered outer width on screen?',
    options: [
      '200px',
      '250px',
      '225px',
      '150px'
    ],
    correctAnswer: '200px',
    explanation: 'With `box-sizing: border-box`, padding and border are subtracted from the specified width, ensuring the rendered outer width matches the declared 200px. In `content-box`, padding and border are added externally (200 + 40 + 10 = 250px).',
    distractorExplanations: {
      '250px': 'This would be the width under `box-sizing: content-box`.',
      '225px': 'Incorrect padding calculation.',
      '150px': 'Confuses outer rendered width with inner content width (200 - 40 - 10 = 150px).'
    },
    conceptTested: 'CSS Box Model and border-box rendering calculations',
    expectedTimeSeconds: 45,
    points: 10,
    sourceType: 'ORIGINAL_L2H',
    sourceName: 'W3Schools CSS Box Model Standards',
    sourceConfidence: 'HIGH',
    originalityStatus: 'ORIGINAL_L2H',
  }),

  createQ({
    id: 'fe-l3-perf-001',
    careerRoleSlug: 'frontend-developer',
    skillName: 'Web Performance & Core Vitals',
    competency: 'Client Performance Optimization',
    topic: 'Core Web Vitals & Cumulative Layout Shift (CLS)',
    difficulty: 'L3',
    questionType: 'SCENARIO',
    questionFamily: 'FE_CORE_WEB_VITALS_CLS',
    questionVariant: 'image_aspect_ratio_layout_shift',
    variantGroupId: 'vg-fe-cls-01',
    prompt: 'A media publication page exhibits poor Cumulative Layout Shift (CLS) scores because high-resolution article images cause content to violently jump down once loaded. What is the standard web engineering remediation?',
    options: [
      'Define explicit `width` and `height` attributes or CSS `aspect-ratio` on `<img>` tags so the browser pre-allocates layout space',
      'Convert all images into synchronous base64 inline strings inside the HTML document',
      'Use `position: fixed` on all paragraphs below images',
      'Disable JavaScript execution until all images have finished downloading'
    ],
    correctAnswer: 'Define explicit `width` and `height` attributes or CSS `aspect-ratio` on `<img>` tags so the browser pre-allocates layout space',
    explanation: 'Modern browser rendering engines use image aspect ratios derived from width/height attributes to reserve exact layout dimensions before image bytes are downloaded, preventing sudden layout shifts.',
    distractorExplanations: {
      'Base64 inline strings': 'Bloats initial HTML payload by 33%, devastating First Contentful Paint (FCP).',
      '`position: fixed`': 'Breaks standard document scroll flow.',
      'Disable JavaScript': 'Harms Interaction to Next Paint (INP) and user interactivity.'
    },
    conceptTested: 'Cumulative Layout Shift (CLS) Mitigation & Aspect Ratio Allocation',
    expectedTimeSeconds: 60,
    points: 15,
    sourceType: 'ORIGINAL_L2H',
    sourceName: 'Google Web Vitals & MDN Standards',
    sourceCompany: 'Google',
    sourceYear: 2023,
    sourceConfidence: 'HIGH',
    originalityStatus: 'ORIGINAL_L2H',
  }),

  // ===========================================================================
  // 3. BACKEND DEVELOPER (L1 -> L5)
  // ===========================================================================
  createQ({
    id: 'be-l2-api-001',
    careerRoleSlug: 'backend-developer',
    skillName: 'RESTful API Design',
    competency: 'API Architecture & Protocols',
    topic: 'HTTP Methods & Idempotency',
    difficulty: 'L2',
    questionType: 'MCQ',
    questionFamily: 'HTTP_METHOD_IDEMPOTENCY',
    questionVariant: 'put_vs_post_semantics',
    variantGroupId: 'vg-http-idem-01',
    prompt: 'According to HTTP/1.1 RFC specifications, which statement correctly describes the idempotency of `POST` versus `PUT`?',
    options: [
      '`PUT` is idempotent (calling it multiple times produces identical server state), whereas `POST` is non-idempotent (calling it multiple times creates multiple resources)',
      '`POST` is idempotent, whereas `PUT` is non-idempotent',
      'Both `POST` and `PUT` are strictly non-idempotent',
      'Neither method has idempotency definitions in HTTP RFCs'
    ],
    correctAnswer: '`PUT` is idempotent (calling it multiple times produces identical server state), whereas `POST` is non-idempotent (calling it multiple times creates multiple resources)',
    explanation: 'By specification, `PUT` replaces the target resource entirely; executing identical PUT requests N times results in the same state. `POST` submits data to create a subordinate resource or process a command, creating duplicate entries if repeated.',
    distractorExplanations: {
      '`POST` is idempotent': 'Inverts the core semantic definitions of REST.',
      'Both are non-idempotent': '`PUT`, `GET`, `DELETE`, and `HEAD` are defined as idempotent methods.',
      'Neither has definition': 'Idempotency is explicitly defined in RFC 7231 Section 4.2.2.'
    },
    conceptTested: 'HTTP Method Idempotency and Resource Lifecycle Semantics',
    expectedTimeSeconds: 45,
    points: 10,
    sourceType: 'ORIGINAL_L2H',
    sourceName: 'IETF RFC 7231 & Mozilla Developer Network',
    sourceConfidence: 'HIGH',
    originalityStatus: 'ORIGINAL_L2H',
  }),

  createQ({
    id: 'be-l4-db-001',
    careerRoleSlug: 'backend-developer',
    skillName: 'Database Architecture',
    competency: 'Relational Database Internals',
    topic: 'Transaction Isolation & Phantom Reads',
    difficulty: 'L4',
    questionType: 'SCENARIO',
    questionFamily: 'DB_ACID_ISOLATION_LEVELS',
    questionVariant: 'phantom_read_in_repeatable_read',
    variantGroupId: 'vg-db-iso-01',
    prompt: 'In PostgreSQL, what phenomenon occurs when Transaction A executes `SELECT COUNT(*) FROM orders WHERE status = "pending"`, Transaction B inserts a new pending order and commits, and Transaction A re-runs the identical query within the same transaction?',
    options: [
      'Under `REPEATABLE READ`, Transaction A sees the exact same count snapshot from its initial query, preventing phantom reads',
      'Under `REPEATABLE READ`, Transaction A crashes with a DeadlockDetected error',
      'Under `SERIALIZABLE`, Transaction A automatically deletes Transaction B\'s committed row',
      'Under `READ COMMITTED`, Transaction A is completely blocked until Transaction B is cancelled'
    ],
    correctAnswer: 'Under `REPEATABLE READ`, Transaction A sees the exact same count snapshot from its initial query, preventing phantom reads',
    explanation: 'In PostgreSQL, the `REPEATABLE READ` isolation level uses Multi-Version Concurrency Control (MVCC) snapshots established at the first query of the transaction, which natively prevents phantom reads.',
    distractorExplanations: {
      'Crashes with Deadlock': 'MVCC snapshot reading does not hold exclusive locks that trigger deadlocks.',
      'Automatically deletes row': 'No isolation level modifies another transaction\'s committed records.',
      'Blocked until cancelled': 'Read Committed reads the new committed data immediately without blocking.'
    },
    conceptTested: 'PostgreSQL MVCC Transaction Isolation & Snapshot Semantics',
    expectedTimeSeconds: 75,
    points: 20,
    sourceType: 'ORIGINAL_L2H',
    sourceName: 'PostgreSQL Architecture Manual Chapter 13',
    sourceConfidence: 'HIGH',
    originalityStatus: 'ORIGINAL_L2H',
  }),

  // ===========================================================================
  // 4. DATA SCIENCE & AI / ML (L1 -> L5)
  // ===========================================================================
  createQ({
    id: 'ds-l2-stat-001',
    careerRoleSlug: 'data-scientist',
    skillName: 'Statistical Analysis',
    competency: 'Applied Mathematics & Statistics',
    topic: 'Hypothesis Testing & Type I / Type II Errors',
    difficulty: 'L2',
    questionType: 'MCQ',
    questionFamily: 'STAT_HYPOTHESIS_ERRORS',
    questionVariant: 'type_1_vs_type_2_error',
    variantGroupId: 'vg-stat-err-01',
    prompt: 'In statistical A/B test evaluation, what defines a Type I error (False Positive)?',
    options: [
      'Rejecting the null hypothesis when the null hypothesis is actually true',
      'Failing to reject the null hypothesis when an actual effect exists',
      'Having a sample size that is too large for the Student t-distribution',
      'Calculating a p-value strictly equal to 1.0'
    ],
    correctAnswer: 'Rejecting the null hypothesis when the null hypothesis is actually true',
    explanation: 'A Type I error ($\alpha$) is a false positive error where the researcher claims an effect exists (rejects $H_0$) when in reality there is no true difference. A Type II error ($\beta$) is a false negative.',
    distractorExplanations: {
      'Failing to reject when effect exists': 'This is the definition of a Type II error (False Negative).',
      'Sample size too large': 'Large sample sizes increase statistical power, not Type I error classification.',
      'p-value equal to 1.0': 'Represents total lack of evidence against the null hypothesis.'
    },
    conceptTested: 'Statistical Inference & Hypothesis Testing Error Classification',
    expectedTimeSeconds: 45,
    points: 10,
    sourceType: 'ORIGINAL_L2H',
    sourceName: 'Harvard CS109 & OpenIntro Statistics',
    sourceConfidence: 'HIGH',
    originalityStatus: 'ORIGINAL_L2H',
  }),

  createQ({
    id: 'ai-l3-rag-001',
    careerRoleSlug: 'ai-engineer',
    skillName: 'Retrieval Augmented Generation (RAG)',
    competency: 'LLM Systems Architecture',
    topic: 'Chunking Strategies & Semantic Density',
    difficulty: 'L3',
    questionType: 'SCENARIO',
    questionFamily: 'AI_RAG_CHUNKING_TRADE_OFF',
    questionVariant: 'chunk_size_vs_overlap',
    variantGroupId: 'vg-rag-chunk-01',
    prompt: 'When building a vector search pipeline over complex financial reports, setting chunk sizes too small (e.g. 50 tokens) leads to what specific operational failure in retrieval?',
    options: [
      'Chunks lose essential contextual meaning and relationships, causing the vector embedding to become noisy and ambiguous',
      'Vector databases refuse to store embeddings with fewer than 100 dimensions',
      'The LLM context window overflows during prompt assembly',
      'Cosine similarity distances become negative for all retrieved vectors'
    ],
    correctAnswer: 'Chunks lose essential contextual meaning and relationships, causing the vector embedding to become noisy and ambiguous',
    explanation: 'Micro-chunks (under 50 tokens) truncate surrounding context (such as table headers or descriptive qualifiers), resulting in decontextualized embeddings that match irrelevant queries.',
    distractorExplanations: {
      'Vector databases refuse to store': 'Vector dimensions are fixed by the embedding model (e.g. 1536), regardless of text token length.',
      'LLM context window overflows': 'Smaller chunks take less context window space, not more.',
      'Cosine similarity becomes negative': 'Cosine similarity is determined by vector orientation, not input token counts.'
    },
    conceptTested: 'Embedding Chunk Size Trade-offs in Vector Retrieval Pipelines',
    expectedTimeSeconds: 60,
    points: 15,
    sourceType: 'ORIGINAL_L2H',
    sourceName: 'DeepLearning.AI & LangChain Best Practices',
    sourceConfidence: 'HIGH',
    originalityStatus: 'ORIGINAL_L2H',
  }),

  // ===========================================================================
  // 5. DEVOPS & CLOUD PLATFORM (L1 -> L5)
  // ===========================================================================
  createQ({
    id: 'ops-l3-k8s-001',
    careerRoleSlug: 'devops-engineer',
    skillName: 'Kubernetes Orchestration',
    competency: 'Cloud Infrastructure & Reliability',
    topic: 'Pod Probes (Liveness vs Readiness)',
    difficulty: 'L3',
    questionType: 'MCQ',
    questionFamily: 'K8S_PROBE_DIFFERENCES',
    questionVariant: 'liveness_vs_readiness_failure',
    variantGroupId: 'vg-k8s-probe-01',
    prompt: 'In Kubernetes, what action does the kubelet take when a container fails its `ReadinessProbe` versus when it fails its `LivenessProbe`?',
    options: [
      'Failing `ReadinessProbe` removes the Pod from Service endpoints so it stops receiving traffic; failing `LivenessProbe` causes the kubelet to restart the container',
      'Failing `ReadinessProbe` restarts the Pod; failing `LivenessProbe` deletes the entire cluster Node',
      'Both probes trigger container termination and Pod eviction after 3 attempts',
      'ReadinessProbes only run at container startup; LivenessProbes only run during graceful shutdown'
    ],
    correctAnswer: 'Failing `ReadinessProbe` removes the Pod from Service endpoints so it stops receiving traffic; failing `LivenessProbe` causes the kubelet to restart the container',
    explanation: 'Readiness probes indicate when a Pod is ready to accept user network traffic. If it fails, traffic routing is paused. Liveness probes detect deadlocks; if failed, the container is restarted according to the restartPolicy.',
    distractorExplanations: {
      'Deletes cluster node': 'Probes are scoped to container lifecycle inside a Pod, never modifying worker nodes.',
      'Both trigger termination': 'Readiness never restarts a container; it only manages service load balancer ingress endpoints.',
      'Only run at startup': 'Both probes execute periodically throughout the container lifecycle unless startupProbe is explicitly configured.'
    },
    conceptTested: 'Kubernetes Pod Health Lifecycle Management (Liveness vs Readiness)',
    expectedTimeSeconds: 50,
    points: 15,
    sourceType: 'PATTERN_INSPIRED',
    sourceName: 'Official Kubernetes Documentation & GeeksforGeeks DevOps',
    sourceConfidence: 'HIGH',
    originalityStatus: 'PATTERN_INSPIRED',
  }),

  // ===========================================================================
  // 6. CYBERSECURITY ARCHITECT (L1 -> L5)
  // ===========================================================================
  createQ({
    id: 'sec-l4-crypto-001',
    careerRoleSlug: 'cybersecurity-architect',
    skillName: 'Cryptography & Threat Modeling',
    competency: 'Enterprise Security Architecture',
    topic: 'Password Hashing & Salt vs Pepper',
    difficulty: 'L4',
    questionType: 'SCENARIO',
    questionFamily: 'SEC_PASSWORD_HASHING_ALGORITHMS',
    questionVariant: 'bcrypt_argon2_vs_sha256',
    variantGroupId: 'vg-sec-hash-01',
    prompt: 'Why is standard `SHA-256` or `SHA-512` unsuitable for storing user authentication passwords, even when a unique cryptographic salt is added?',
    options: [
      'SHA family algorithms are engineered for maximum hardware hashing speed, enabling attackers to test billions of candidates per second using GPUs/ASICs; slow memory-hard functions (Argon2id, bcrypt) are required',
      'SHA-256 hashes are easily reversible using basic mathematical modular arithmetic',
      'SHA-256 hashes have known mathematical collisions in all current implementations',
      'Modern web browsers cannot transmit SHA-256 hashes over HTTPS TLS 1.3 connections'
    ],
    correctAnswer: 'SHA family algorithms are engineered for maximum hardware hashing speed, enabling attackers to test billions of candidates per second using GPUs/ASICs; slow memory-hard functions (Argon2id, bcrypt) are required',
    explanation: 'General-purpose cryptographic hashes like SHA-256 are designed for speed (e.g. verifying file integrity). In password cracking, attackers execute billions of guesses per second on consumer GPUs. Key derivation functions like Argon2id and bcrypt impose deliberate CPU and memory hardness.',
    distractorExplanations: {
      'Easily reversible': 'Cryptographic hash functions are one-way by design; reversal is computationally infeasible without brute force.',
      'Known collisions': 'SHA-256 has zero published collision attacks to date.',
      'Browser cannot transmit': 'Hash representation strings are standard text easily transported over any protocol.'
    },
    conceptTested: 'Cryptographic Work Factors & Password Storage Security Standards',
    expectedTimeSeconds: 70,
    points: 20,
    sourceType: 'ORIGINAL_L2H',
    sourceName: 'OWASP Password Storage Cheat Sheet & NIST SP 800-63B',
    sourceConfidence: 'HIGH',
    originalityStatus: 'ORIGINAL_L2H',
  }),

  // ===========================================================================
  // 7. GENERAL & ROLE-ADAPTED APTITUDE: QUANTITATIVE REASONING (L1 -> L4)
  // ===========================================================================
  createQ({
    id: 'apt-quant-001',
    careerRoleSlug: 'full-stack-developer',
    skillName: 'Quantitative Reasoning',
    competency: 'Mathematical Logic & Problem Solving',
    topic: 'Time and Work',
    difficulty: 'L2',
    questionType: 'APTITUDE',
    questionFamily: 'APT_TIME_AND_WORK',
    questionVariant: 'two_workers_combined_rate',
    variantGroupId: 'vg-apt-work-01',
    prompt: 'Worker A can complete a database migration task in 12 hours alone. Worker B can complete the identical task in 6 hours alone. If both work concurrently without interruption, how many hours will the task take to complete?',
    options: [
      '4 hours',
      '9 hours',
      '3 hours',
      '4.5 hours'
    ],
    correctAnswer: '4 hours',
    explanation: 'Rate of Worker A = 1/12 task/hr. Rate of Worker B = 1/6 (or 2/12) task/hr. Combined rate = 1/12 + 2/12 = 3/12 = 1/4 task/hr. Total time = 1 / (1/4) = 4 hours.',
    distractorExplanations: {
      '9 hours': 'Takes the arithmetic mean (12 + 6)/2 instead of harmonic rate combination.',
      '3 hours': 'Divides 6 hours in half without weighting Worker A\'s slower rate.',
      '4.5 hours': 'Incorrect fractional addition.'
    },
    conceptTested: 'Quantitative Rate Equations & Work Proportions',
    expectedTimeSeconds: 60,
    points: 10,
    sourceType: 'PATTERN_INSPIRED',
    sourceName: 'GeeksforGeeks Quantitative Aptitude Question Bank',
    sourceCompany: 'TCS',
    sourceYear: 2023,
    sourceConfidence: 'COMMUNITY_REPORTED',
    originalityStatus: 'PATTERN_INSPIRED',
  }),

  createQ({
    id: 'apt-quant-002',
    careerRoleSlug: 'digital-marketing-specialist',
    skillName: 'Quantitative Reasoning',
    competency: 'Commercial Analytics & Ratios',
    topic: 'Percentages & ROI Calculations',
    difficulty: 'L2',
    questionType: 'APTITUDE',
    questionFamily: 'APT_PERCENTAGE_ROI',
    questionVariant: 'marketing_cac_ltv_percentage',
    variantGroupId: 'vg-apt-roi-01',
    prompt: 'A campaign spent $5,000 on digital advertisements and generated $12,500 in gross revenue. What is the Return on Ad Spend (ROAS) percentage?',
    options: [
      '250%',
      '150%',
      '75%',
      '125%'
    ],
    correctAnswer: '250%',
    explanation: 'ROAS is calculated as (Gross Revenue / Ad Spend) × 100% = ($12,500 / $5,000) × 100% = 2.5 × 100% = 250%. (Net Profit ROI would be ($12,500 - $5,000)/$5,000 = 150%).',
    distractorExplanations: {
      '150%': 'Represents Net Profit ROI, not standard Gross Revenue ROAS.',
      '75%': 'Arbitrary subtraction.',
      '125%': 'Off by factor of 2 calculation.'
    },
    conceptTested: 'Commercial Percentage Ratios & ROAS Metric Formulation',
    expectedTimeSeconds: 45,
    points: 10,
    sourceType: 'ORIGINAL_L2H',
    sourceName: 'Learn-2-Hire Marketing Analytics',
    sourceConfidence: 'HIGH',
    originalityStatus: 'ORIGINAL_L2H',
  }),

  // ===========================================================================
  // 8. LOGICAL REASONING: SERIES, SYLLOGISMS & PUZZLES (L1 -> L4)
  // ===========================================================================
  createQ({
    id: 'apt-logic-001',
    careerRoleSlug: 'full-stack-developer',
    skillName: 'Logical Reasoning',
    competency: 'Pattern Recognition & Deductive Logic',
    topic: 'Number & Difference Series',
    difficulty: 'L2',
    questionType: 'LOGICAL_REASONING',
    questionFamily: 'LOGIC_SERIES_PATTERN',
    questionVariant: 'exponential_increment_series',
    variantGroupId: 'vg-logic-series-01',
    prompt: 'Identify the missing number in the sequence: 4, 7, 12, 19, 28, ?',
    options: [
      '39',
      '37',
      '40',
      '38'
    ],
    correctAnswer: '39',
    explanation: 'Calculate consecutive differences: 7 - 4 = +3; 12 - 7 = +5; 19 - 12 = +7; 28 - 19 = +9. The difference increases by consecutive odd numbers (+3, +5, +7, +9). Next step is +11: 28 + 11 = 39.',
    distractorExplanations: {
      '37': 'Adds +9 again instead of advancing the odd number progression to +11.',
      '40': 'Adds +12 instead of +11.',
      '38': 'Arithmetic mistake.'
    },
    conceptTested: 'Arithmetic Difference Pattern Recognition',
    expectedTimeSeconds: 40,
    points: 10,
    sourceType: 'PATTERN_INSPIRED',
    sourceName: 'Public Recruitment Assessment Pattern Archive',
    sourceCompany: 'Zoho',
    sourceYear: 2024,
    sourceConfidence: 'COMMUNITY_REPORTED',
    originalityStatus: 'PATTERN_INSPIRED',
  }),

  createQ({
    id: 'apt-logic-002',
    careerRoleSlug: 'technical-product-manager',
    skillName: 'Logical Reasoning',
    competency: 'Deductive Logic & Syllogisms',
    topic: 'Categorical Syllogisms',
    difficulty: 'L3',
    questionType: 'LOGICAL_REASONING',
    questionFamily: 'LOGIC_SYLLOGISM_DEDUCTION',
    questionVariant: 'quantified_subset_statements',
    variantGroupId: 'vg-logic-syl-01',
    prompt: 'Statements:\n1. All microservices are decoupled systems.\n2. Some decoupled systems use event streams.\nConclusions:\nI. All microservices use event streams.\nII. Some decoupled systems are microservices.\nWhich conclusion(s) logically follow?',
    options: [
      'Only Conclusion II follows',
      'Only Conclusion I follows',
      'Both Conclusion I and II follow',
      'Neither Conclusion I nor II follows'
    ],
    correctAnswer: 'Only Conclusion II follows',
    explanation: 'From "All A are B", the converse "Some B are A" is logically valid (Some decoupled systems are microservices). However, since only "some" B use event streams, we cannot deduce that all A use event streams (Conclusion I does not follow).',
    distractorExplanations: {
      'Only Conclusion I': 'Universal assertion I over-generalizes an existential premise.',
      'Both follow': 'Conclusion I is not supported by the premises.',
      'Neither follows': 'Conclusion II is a mathematically valid converse of Statement 1.'
    },
    conceptTested: 'Deductive Syllogism Validation & Predicate Logic',
    expectedTimeSeconds: 50,
    points: 15,
    sourceType: 'ORIGINAL_L2H',
    sourceName: 'Learn-2-Hire Cognitive Intelligence Engine',
    sourceConfidence: 'HIGH',
    originalityStatus: 'ORIGINAL_L2H',
  }),

  // ===========================================================================
  // 9. VERBAL REASONING & DATA INTERPRETATION (L1 -> L3)
  // ===========================================================================
  createQ({
    id: 'apt-verbal-001',
    careerRoleSlug: 'talent-acquisition-partner',
    skillName: 'Verbal Reasoning',
    competency: 'Critical Reading & Logical Inference',
    topic: 'Critical Reasoning & Implicit Assumptions',
    difficulty: 'L2',
    questionType: 'VERBAL_REASONING',
    questionFamily: 'VERBAL_CRITICAL_INFERENCE',
    questionVariant: 'workplace_policy_assumption',
    variantGroupId: 'vg-verbal-inf-01',
    prompt: 'Read the statement: "To reduce engineering attrition, the executive team introduced fully flexible remote schedules with asynchronous core hours." What unstated assumption is required for this argument to be valid?',
    options: [
      'Rigid in-office schedules were a contributing factor to engineering attrition',
      'Remote work eliminates all software bugs and delivery delays',
      'Every engineer prefers working past midnight',
      'The company will hire twice as many engineers next year'
    ],
    correctAnswer: 'Rigid in-office schedules were a contributing factor to engineering attrition',
    explanation: 'For introducing flexible remote schedules to successfully reduce attrition, the policy assumes that inflexible location or schedule mandates were actively driving engineers to leave.',
    distractorExplanations: {
      'Eliminates all bugs': 'Irrelevant to the relationship between schedule flexibility and retention.',
      'Prefers working past midnight': 'Extreme distractor unwarranted by the passage.',
      'Hire twice as many': 'Premise concerns retention, not hiring volume.'
    },
    conceptTested: 'Critical Reasoning & Implicit Argument Premise Identification',
    expectedTimeSeconds: 50,
    points: 10,
    sourceType: 'ORIGINAL_L2H',
    sourceName: 'Learn-2-Hire Verbal Reasoning Standard',
    sourceConfidence: 'HIGH',
    originalityStatus: 'ORIGINAL_L2H',
  }),

  // ===========================================================================
  // 10. PRODUCT MANAGEMENT, UI/UX, & NON-TECHNICAL ROLES (L1 -> L4)
  // ===========================================================================
  createQ({
    id: 'pm-l3-metrics-001',
    careerRoleSlug: 'technical-product-manager',
    skillName: 'Product Analytics & Metrics',
    competency: 'Outcome Tracking & Experimentation',
    topic: 'North Star Metrics vs Guardrail Metrics',
    difficulty: 'L3',
    questionType: 'SCENARIO',
    questionFamily: 'PM_METRICS_GUARDRAIL',
    questionVariant: 'opt_notification_spam_retention',
    variantGroupId: 'vg-pm-metric-01',
    prompt: 'A growth team launches push notifications that increase 7-day user open rates by 25%. However, app uninstalls increase by 40% and support tickets rise by 80%. As a Product Manager, what is your evaluation of the experiment?',
    options: [
      'The experiment failed because it violated vital guardrail metrics (uninstall rate, customer sentiment) despite moving a short-term proxy metric',
      'The experiment succeeded because open rate is the sole indicator of product health',
      'Double the push notification frequency to compensate for uninstalled users',
      'Ignore uninstall metrics because mobile users always reinstall apps'
    ],
    correctAnswer: 'The experiment failed because it violated vital guardrail metrics (uninstall rate, customer sentiment) despite moving a short-term proxy metric',
    explanation: 'In product experimentation, guardrail metrics protect long-term business health (churn, uninstalls, brand reputation). A local optimization that drives users away is a net-negative regression.',
    distractorExplanations: {
      'Succeeded on open rate': 'Optimizes vanity metrics at the expense of enterprise user retention.',
      'Double frequency': 'Would accelerate customer churn.',
      'Ignore uninstall metrics': 'Uninstalls represent permanent customer loss.'
    },
    conceptTested: 'Product Experimentation Guardrail Metrics & Trade-off Governance',
    expectedTimeSeconds: 60,
    points: 15,
    sourceType: 'ORIGINAL_L2H',
    sourceName: 'Reforge & Product School Frameworks',
    sourceConfidence: 'HIGH',
    originalityStatus: 'ORIGINAL_L2H',
  }),

  createQ({
    id: 'ux-l2-heuristics-001',
    careerRoleSlug: 'ui-ux-designer',
    skillName: 'UX Research & Usability',
    competency: 'Design Heuristics & Accessibility',
    topic: 'Nielsen Norman Usability Heuristics',
    difficulty: 'L2',
    questionType: 'MCQ',
    questionFamily: 'UX_NIELSEN_HEURISTICS',
    questionVariant: 'visibility_of_system_status',
    variantGroupId: 'vg-ux-heuristic-01',
    prompt: 'When a candidate submits a 50MB portfolio file, a progress bar appears with estimated seconds remaining and an uploaded percentage indicator. Which Nielsen Norman usability heuristic does this interface satisfy?',
    options: [
      'Visibility of System Status',
      'Aesthetic and Minimalist Design',
      'Error Prevention',
      'Recognition Rather than Recall'
    ],
    correctAnswer: 'Visibility of System Status',
    explanation: 'Heuristic #1 (Visibility of System Status) states that the design should always keep users informed about what is going on through appropriate feedback within a reasonable time.',
    distractorExplanations: {
      'Aesthetic and Minimalist': 'Concerns removing redundant visual elements, not status feedback.',
      'Error Prevention': 'Concerns warning users before destructive actions.',
      'Recognition Rather than Recall': 'Concerns keeping options and actions visible to minimize memory load.'
    },
    conceptTested: 'Nielsen Norman Usability Heuristic Principles',
    expectedTimeSeconds: 45,
    points: 10,
    sourceType: 'ORIGINAL_L2H',
    sourceName: 'Nielsen Norman Group UX Guidelines',
    sourceConfidence: 'HIGH',
    originalityStatus: 'ORIGINAL_L2H',
  }),

  // ===========================================================================
  // 11. TECHNICAL INTERVIEW & BEHAVIORAL QUESTIONS
  // ===========================================================================
  createQ({
    id: 'int-tech-fs-001',
    careerRoleSlug: 'full-stack-developer',
    skillName: 'System Architecture',
    competency: 'Technical Communication & Problem Defense',
    topic: 'Database Selection Trade-offs',
    difficulty: 'L3',
    questionType: 'TECHNICAL_INTERVIEW',
    questionFamily: 'INT_POSTGRES_VS_NOSQL_TRADEOFF',
    questionVariant: 'relational_financial_consistency',
    variantGroupId: 'vg-int-db-01',
    prompt: 'Why would an enterprise engineering team choose PostgreSQL over MongoDB for an e-commerce checkout and inventory allocation microservice? What specific guarantees are required?',
    options: [
      'PostgreSQL provides strict ACID transactions and relational foreign key constraints to prevent duplicate bookings or negative inventory balances',
      'PostgreSQL is completely serverless and requires zero server configuration',
      'MongoDB does not support network connections over HTTP',
      'PostgreSQL only runs on client browser computers'
    ],
    correctAnswer: 'PostgreSQL provides strict ACID transactions and relational foreign key constraints to prevent duplicate bookings or negative inventory balances',
    explanation: 'Inventory allocation requires atomic multi-row updates across orders, items, and stock balances with strict isolation levels (SERIALIZABLE or REPEATABLE READ) to prevent race conditions like selling the last item to two concurrent buyers.',
    distractorExplanations: {
      'PostgreSQL is serverless with zero config': 'PostgreSQL is a relational database server requiring operational management.',
      'MongoDB does not support network': 'MongoDB operates over TCP socket connections like any database server.',
      'Only runs on client': 'Databases run on infrastructure servers.'
    },
    conceptTested: 'Relational ACID Consistency vs Document Model Trade-offs',
    expectedTimeSeconds: 90,
    points: 20,
    sourceType: 'PATTERN_INSPIRED',
    sourceName: 'Reported Full-Stack System Design Interviews',
    sourceCompany: 'Amazon',
    sourceYear: 2024,
    sourceConfidence: 'HIGH',
    originalityStatus: 'PATTERN_INSPIRED',
  }),

  createQ({
    id: 'int-beh-all-001',
    careerRoleSlug: 'full-stack-developer',
    skillName: 'Behavioral & Leadership',
    competency: 'Interpersonal Communication & Accountability',
    topic: 'Handling Technical Disagreements',
    difficulty: 'L3',
    questionType: 'BEHAVIORAL',
    questionFamily: 'INT_STAR_CONFLICT_RESOLUTION',
    questionVariant: 'architectural_disagreement_with_peer',
    variantGroupId: 'vg-beh-star-01',
    prompt: 'Describe a situation where you had a strong technical disagreement with a teammate regarding system architecture or library choice. How did you resolve it objectively?',
    options: [
      'Framed the problem with verifiable benchmarks, built a small proof-of-concept prototype, evaluated trade-offs collaboratively, and committed once a decision was made',
      'Silently pushed code changes late at night without peer review to bypass discussion',
      'Refused to write any code until the team adopted my preferred framework',
      'Complained immediately to senior management without discussing with the teammate'
    ],
    correctAnswer: 'Framed the problem with verifiable benchmarks, built a small proof-of-concept prototype, evaluated trade-offs collaboratively, and committed once a decision was made',
    explanation: 'Professional engineering teams leverage the Amazon principle of "Have Backbone; Disagree and Commit" by anchoring discussions in auditable performance benchmarks, prototyping trade-offs, and maintaining team alignment.',
    distractorExplanations: {
      'Silently pushed code': 'Toxic behavior that violates code ownership and source control integrity.',
      'Refused to write code': 'Unprofessional conduct undermining delivery.',
      'Complained to senior management': 'Fails interpersonal problem solving.'
    },
    conceptTested: 'STAR Behavioral Conflict Resolution & Engineering Alignment',
    expectedTimeSeconds: 90,
    points: 20,
    sourceType: 'PATTERN_INSPIRED',
    sourceName: 'Amazon Leadership Principles Behavioral Question Bank',
    sourceCompany: 'Amazon',
    sourceYear: 2023,
    sourceConfidence: 'HIGH',
    originalityStatus: 'PATTERN_INSPIRED',
  }),

  // ===========================================================================
  // 12. PROJECT DEFENSE & CONTEXTUAL FOLLOW-UP QUESTIONS
  // ===========================================================================
  createQ({
    id: 'int-proj-def-001',
    careerRoleSlug: 'full-stack-developer',
    skillName: 'Project Defense',
    competency: 'Applied Engineering Justification',
    topic: 'Architectural Defense & Scaling Bottlenecks',
    difficulty: 'L4',
    questionType: 'PROJECT_DEFENSE',
    questionFamily: 'INT_PROJECT_SCALING_BOTTLENECK',
    questionVariant: 'cache_invalidation_traffic_spike',
    variantGroupId: 'vg-proj-scale-01',
    prompt: 'In your submitted capstone project, if daily active traffic increased 20x overnight, which component would bottleneck first and how would you implement Redis caching without causing stale data reads?',
    options: [
      'The database query tier would saturate connection pools; introduce Redis cache-aside with a Time-To-Live (TTL) and event-driven cache invalidation on database write mutations',
      'The React frontend CSS would crash the client browser',
      'GitHub repository commit logs would overflow',
      'DNS servers would permanently block the domain'
    ],
    correctAnswer: 'The database query tier would saturate connection pools; introduce Redis cache-aside with a Time-To-Live (TTL) and event-driven cache invalidation on database write mutations',
    explanation: 'Under sudden 20x load, un-cached relational database queries exhaust connection pools and disk I/O. A cache-aside pattern absorbs read spikes; invalidation listeners on entity mutation hooks prevent stale data.',
    distractorExplanations: {
      'React CSS crashes browser': 'CSS rules have negligible memory scaling impact relative to backend traffic.',
      'GitHub logs overflow': 'Source control has no active runtime connection to live user traffic.',
      'DNS blocks domain': 'DNS handles billions of queries without domain blocking.'
    },
    conceptTested: 'Project Defense: Cache-Aside Architecture & Read-Through Invalidation',
    expectedTimeSeconds: 90,
    points: 20,
    sourceType: 'ORIGINAL_L2H',
    sourceName: 'Learn-2-Hire Project Defense Rubric',
    sourceConfidence: 'HIGH',
    originalityStatus: 'ORIGINAL_L2H',
  }),

  // ===========================================================================
  // 13. DATA SCIENTIST & ML STATISTICAL TESTING
  // ===========================================================================
  createQ({
    id: 'ds-l3-stat-001',
    careerRoleSlug: 'data-scientist',
    skillName: 'Statistical Inference & A/B Testing',
    competency: 'Hypothesis Testing & Experimentation',
    topic: 'P-Values & Type I Error Control',
    difficulty: 'L3',
    questionType: 'SCENARIO',
    questionFamily: 'STAT_HYPOTHESIS_P_VALUE',
    questionVariant: 'significance_threshold_alpha',
    variantGroupId: 'vg-stat-pval-01',
    prompt: 'In a two-tailed conversion rate experiment with alpha = 0.05, your model calculates a p-value of 0.021. What is the mathematically sound interpretation of this outcome?',
    options: [
      'Assuming the null hypothesis is true, there is a 2.1% probability of observing a difference at least as extreme as this sample; reject the null hypothesis at the 5% significance level',
      'There is a 97.9% probability that the new variant is superior in all production markets',
      'There is a 2.1% probability that the experimental data is completely fabricated',
      'The sample size must be doubled because p-values under 0.05 indicate statistical insignificance'
    ],
    correctAnswer: 'Assuming the null hypothesis is true, there is a 2.1% probability of observing a difference at least as extreme as this sample; reject the null hypothesis at the 5% significance level',
    explanation: 'A p-value measures the probability of obtaining test results at least as extreme as the observed data, assuming the null hypothesis is correct. Since p = 0.021 < 0.05, we reject H0.',
    distractorExplanations: {
      '97.9% probability variant is superior': 'P-values do not represent posterior probabilities of the alternative hypothesis without Bayesian priors.',
      'Data is fabricated': 'P-values quantify sample variability, not data fraud.',
      'Sample size must be doubled': 'P < 0.05 already meets standard statistical significance thresholds.'
    },
    conceptTested: 'Frequentist Hypothesis Testing, P-Value Semantics, and Type I Error Control',
    expectedTimeSeconds: 60,
    points: 15,
    sourceType: 'CURATED_COMPANY_PATTERN',
    sourceName: 'Public Meta / Netflix Experimentation Framework Guidelines',
    sourceCompany: 'Netflix',
    sourceYear: 2023,
    sourceConfidence: 'HIGH',
    originalityStatus: 'CURATED_COMPANY_PATTERN',
  }),

  // ===========================================================================
  // 14. TECHNICAL PRODUCT MANAGEMENT
  // ===========================================================================
  createQ({
    id: 'pm-l3-prior-001',
    careerRoleSlug: 'technical-product-manager',
    skillName: 'Product Prioritization & Metrics',
    competency: 'Strategic Roadmapping & Trade-Offs',
    topic: 'RICE Scoring & Opportunity Sizing',
    difficulty: 'L3',
    questionType: 'CASE_STUDY',
    questionFamily: 'PM_RICE_SCORING_TRADE_OFF',
    questionVariant: 'reach_vs_effort_calculation',
    variantGroupId: 'vg-pm-rice-01',
    prompt: 'Feature A has Reach = 5,000, Impact = 3 (High), Confidence = 80%, Effort = 2 person-months. Feature B has Reach = 20,000, Impact = 1 (Low), Confidence = 50%, Effort = 1 person-month. According to the RICE framework, which feature ranks higher and why?',
    options: [
      'Feature B ranks higher (RICE score 10,000 vs Feature A score 6,000) due to 4x broader reach and lower implementation effort',
      'Feature A ranks higher because high impact (3) always overrides reach metrics',
      'Both features have identical priority because their confidence levels average to 65%',
      'Feature A ranks higher because effort is penalized quadratically in RICE'
    ],
    correctAnswer: 'Feature B ranks higher (RICE score 10,000 vs Feature A score 6,000) due to 4x broader reach and lower implementation effort',
    explanation: 'RICE score = (Reach × Impact × Confidence) / Effort. Feature A = (5000 × 3 × 0.8) / 2 = 6,000. Feature B = (20000 × 1 × 0.5) / 1 = 10,000. Therefore, Feature B ranks higher.',
    distractorExplanations: {
      'Feature A overrides reach': 'RICE provides an objective composite product formula; individual factors do not arbitrarily override others.',
      'Identical priority': 'Confidence is multiplied directly into the numerator, not averaged.',
      'Effort penalized quadratically': 'Effort divides linearly in the RICE denominator.'
    },
    conceptTested: 'RICE Quantitative Feature Prioritization Formula & Opportunity Sizing',
    expectedTimeSeconds: 60,
    points: 15,
    sourceType: 'ORIGINAL_L2H',
    sourceName: 'Intercom Product Management Guide & L2H Curriculum',
    sourceConfidence: 'HIGH',
    originalityStatus: 'ORIGINAL_L2H',
  }),

  // ===========================================================================
  // 15. UI/UX DESIGN & ACCESSIBILITY
  // ===========================================================================
  createQ({
    id: 'ux-l3-a11y-001',
    careerRoleSlug: 'ui-ux-designer',
    skillName: 'Design Systems & Accessibility',
    competency: 'User Centered Interface Design',
    topic: 'WCAG 2.1 AA Contrast Standards',
    difficulty: 'L3',
    questionType: 'MCQ',
    questionFamily: 'UX_WCAG_CONTRAST_RATIO',
    questionVariant: 'normal_text_contrast_requirement',
    variantGroupId: 'vg-ux-contrast-01',
    prompt: 'Under WCAG 2.1 Level AA conformance guidelines, what is the minimum required color contrast ratio between normal body text (under 18pt regular / 14pt bold) and its background?',
    options: [
      '4.5:1',
      '3.0:1',
      '7.0:1',
      '2.0:1'
    ],
    correctAnswer: '4.5:1',
    explanation: 'WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal text and 3.0:1 for large text (18pt+ or 14pt bold). Level AAA requires 7.0:1 for normal text.',
    distractorExplanations: {
      '3.0:1': '3:1 is the threshold for large text and graphical UI components / icons under AA, not normal body text.',
      '7.0:1': '7:1 is the stricter WCAG Level AAA requirement.',
      '2.0:1': '2:1 fails all accessibility contrast baselines.'
    },
    conceptTested: 'WCAG 2.1 AA Visual Contrast Thresholds & Accessible Typography',
    expectedTimeSeconds: 40,
    points: 10,
    sourceType: 'VERIFIED_PUBLIC_REPORT',
    sourceName: 'W3C Web Content Accessibility Guidelines (WCAG) 2.1',
    sourceUrl: 'https://www.w3.org/WAI/WCAG21/quickref/',
    sourceYear: 2023,
    sourceConfidence: 'HIGH',
    originalityStatus: 'VERIFIED_PUBLIC_REPORT',
  }),

  // ===========================================================================
  // 16. QUANTITATIVE APTITUDE: RELATIVE SPEED
  // ===========================================================================
  createQ({
    id: 'apt-num-relspeed-001',
    careerRoleSlug: 'full-stack-developer',
    skillName: 'Quantitative Reasoning',
    competency: 'Analytical Problem Solving',
    topic: 'Time, Speed and Distance (Relative Velocity)',
    difficulty: 'L2',
    questionType: 'APTITUDE',
    questionFamily: 'APT_TIME_SPEED_DISTANCE',
    questionVariant: 'train_opposite_direction_crossing',
    variantGroupId: 'vg-apt-speed-02',
    prompt: 'Two trains 140m and 160m long are running towards each other on parallel tracks at speeds of 60 km/h and 48 km/h respectively. In how many seconds will they completely cross each other from the moment they meet?',
    options: [
      '10 seconds',
      '12 seconds',
      '15 seconds',
      '8 seconds'
    ],
    correctAnswer: '10 seconds',
    explanation: 'Total distance to clear = 140m + 160m = 300m. Since running in opposite directions, relative speed = 60 + 48 = 108 km/h. Convert to m/s: 108 × (5/18) = 30 m/s. Time = Distance / Speed = 300 / 30 = 10 seconds.',
    distractorExplanations: {
      '12 seconds': 'Occurs if subtracting velocities (same direction) instead of adding opposite directions.',
      '15 seconds': 'Calculation error omitting one train length from total distance.',
      '8 seconds': 'Arithmetic rounding error.'
    },
    conceptTested: 'Relative Velocity, Distance Summation, and Unit Conversion (km/h to m/s)',
    expectedTimeSeconds: 60,
    points: 10,
    sourceType: 'CURATED_COMPANY_PATTERN',
    sourceName: 'GeeksforGeeks Quantitative Aptitude Bank & Campus Placement Tracks',
    sourceUrl: 'https://www.geeksforgeeks.org/problems-on-trains/',
    sourceYear: 2024,
    sourceConfidence: 'HIGH',
    originalityStatus: 'CURATED_COMPANY_PATTERN',
  }),

  // ===========================================================================
  // 17. LOGICAL REASONING: SEATING PUZZLE
  // ===========================================================================
  createQ({
    id: 'log-ana-seat-001',
    careerRoleSlug: 'full-stack-developer',
    skillName: 'Logical Reasoning',
    competency: 'Deductive Reasoning & Constraints',
    topic: 'Circular Seating Arrangements & Directional Orientation',
    difficulty: 'L2',
    questionType: 'LOGICAL_REASONING',
    questionFamily: 'LOG_CIRCULAR_SEATING',
    questionVariant: 'six_people_facing_center',
    variantGroupId: 'vg-log-seat-01',
    prompt: 'Six engineers (P, Q, R, S, T, U) are seated in a circle facing the center. P is sitting between T and U. Q is second to the right of U. S is sitting immediately to the right of Q. Who is sitting directly opposite to P?',
    options: [
      'S',
      'Q',
      'R',
      'T'
    ],
    correctAnswer: 'S',
    explanation: 'Placing U at position 1. P is between T and U, so P is at 2 and T is at 3. Q is second to the right of U (positions clockwise: 1->6->5, or counter-clockwise), placing Q opposite T at position 5. S is immediately right of Q (position 4). In a 6-person circle, position 2 (P) is directly opposite position 2+3 = 5 or 4 (S). Specifically, P at 12 o\'clock has S directly across at 6 o\'clock.',
    distractorExplanations: {
      'Q': 'Q is adjacent to S, not opposite P.',
      'R': 'R takes the remaining seat opposite U.',
      'T': 'T is adjacent to P.'
    },
    conceptTested: 'Circular Seating Constraint Satisfaction and Opposite Symmetry Deduction',
    expectedTimeSeconds: 60,
    points: 10,
    sourceType: 'CURATED_COMPANY_PATTERN',
    sourceName: 'GeeksforGeeks Logical Reasoning & Placement Test Series',
    sourceUrl: 'https://www.geeksforgeeks.org/seating-arrangement-reasoning/',
    sourceYear: 2024,
    sourceConfidence: 'HIGH',
    originalityStatus: 'CURATED_COMPANY_PATTERN',
  })
];

/**
 * Retrieves questions filtered for a specific career role, or universal questions.
 */
export function getUniversalQuestionsByRole(roleSlug: string): AssessmentQuestion[] {
  return UNIVERSAL_QUESTION_BANK.filter(
    (q) => q.careerRoleSlug === roleSlug || q.careerRoleSlug === 'full-stack-developer'
  );
}

/**
 * Retrieves questions by difficulty tier.
 */
export function getQuestionsByDifficulty(questions: AssessmentQuestion[], difficulty: string): AssessmentQuestion[] {
  return questions.filter((q) => q.difficulty === difficulty);
}
