/**
 * LEARN-2-HIRE 2.0: ROLE-SPECIFIC PRACTICE CHALLENGE CATALOG
 * Comprehensive inventory of active challenges across all 12 roles.
 * Includes executable code tests, SQL queries, and role-appropriate evaluation rubrics.
 * Zero fabricated counts: inventory is strictly calculated from this catalog.
 */

import { PracticeChallenge, PracticeDifficulty, PracticeEnvironment, PracticeEvaluationType } from './practice-types';
import { getRoleUuid } from '../data/state-store';

export const PRACTICE_CHALLENGES_CATALOG: PracticeChallenge[] = [
  // ============================================================================
  // 1. FULL-STACK DEVELOPER
  // ============================================================================
  {
    id: 'fs-fe-001',
    careerRoleSlug: 'full-stack-developer',
    careerRoleId: getRoleUuid('full-stack-developer'),
    categoryId: 'fs-frontend',
    categoryTitle: 'Frontend Engineering',
    skillName: 'React',
    title: 'Custom Hook: useDebounce Implementation',
    description: 'Implement a reusable custom hook useDebounce(value, delay) that delays updating value until the specified timer has elapsed without new changes.',
    challengeType: 'CODING',
    difficulty: 'EASY',
    targetLevel: 'L2',
    environment: 'CodeExecutionEnvironment',
    evaluationType: 'AUTOMATED_TESTS',
    questionFamily: 'react-hooks-debounce',
    variantGroupId: 'var-deb-01',
    expectedTimeMinutes: 15,
    sourceType: 'FREECODECAMP_REFERENCE',
    sourceName: 'freeCodeCamp',
    sourceUrl: 'https://www.freecodecamp.org/news/javascript-debounce-example/',
    normalizedHash: 'h_fs_fe_deb_01',
    starterCode: `function useDebounce(value, delay) {
  // Implement state and timer clean-up logic
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}`,
    solutionCode: `function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
}`,
    testCases: [
      { name: 'Initial state reflects seed value immediately', isHidden: false },
      { name: 'Mutations within delay window are debounced', isHidden: false },
      { name: 'Clears active timeout on unmount or subsequent render', isHidden: true }
    ],
    hints: ['Use React.useState to store debounced value.', 'Cancel stale timer in the useEffect cleanup return callback.'],
    status: 'ACTIVE'
  },
  {
    id: 'fs-be-001',
    careerRoleSlug: 'full-stack-developer',
    careerRoleId: getRoleUuid('full-stack-developer'),
    categoryId: 'fs-backend-api',
    categoryTitle: 'Backend API Engineering',
    skillName: 'Node.js',
    title: 'Sliding Window In-Memory Rate Limiter',
    description: 'Build an in-memory sliding window rate limiter function rateLimiter(limit, windowMs) tracking IP request timestamps and enforcing client thresholds.',
    challengeType: 'CODING',
    difficulty: 'MEDIUM',
    targetLevel: 'L3',
    environment: 'CodeExecutionEnvironment',
    evaluationType: 'AUTOMATED_TESTS',
    questionFamily: 'api-rate-limiter-sliding-window',
    variantGroupId: 'var-rl-01',
    expectedTimeMinutes: 20,
    sourceType: 'GFG_REFERENCE',
    sourceName: 'GeeksforGeeks',
    sourceUrl: 'https://www.geeksforgeeks.org/system-design-rate-limiter/',
    normalizedHash: 'h_fs_be_rl_01',
    starterCode: `function rateLimiter(limit, windowMs) {
  const requests = new Map();

  return function(ip) {
    const now = Date.now();
    const timestamps = requests.get(ip) || [];
    const valid = timestamps.filter(t => now - t < windowMs);

    if (valid.length >= limit) {
      return { allowed: false, remaining: 0 };
    }

    valid.push(now);
    requests.set(ip, valid);
    return { allowed: true, remaining: limit - valid.length };
  };
}`,
    solutionCode: `function rateLimiter(limit, windowMs) {
  const requests = new Map();
  return function(ip) {
    const now = Date.now();
    const timestamps = requests.get(ip) || [];
    const valid = timestamps.filter(t => now - t < windowMs);
    if (valid.length >= limit) {
      return { allowed: false, remaining: 0 };
    }
    valid.push(now);
    requests.set(ip, valid);
    return { allowed: true, remaining: limit - valid.length };
  };
}`,
    testCases: [
      { name: 'Allows requests under the specified limit', isHidden: false },
      { name: 'Blocks excess requests once limit reached in window', isHidden: false },
      { name: 'Resets allowance after window elapsed', isHidden: true }
    ],
    hints: ['Filter timestamps to only keep those within Date.now() - windowMs.', 'Update Map with new timestamp when allowed.'],
    status: 'ACTIVE'
  },
  {
    id: 'fs-sql-001',
    careerRoleSlug: 'full-stack-developer',
    careerRoleId: getRoleUuid('full-stack-developer'),
    categoryId: 'fs-database-sql',
    categoryTitle: 'Database & SQL',
    skillName: 'SQL & Relational DBs',
    title: 'Monthly User Signup Cohort Retention Query',
    description: 'Construct a SQL query grouping user accounts by signup month cohort and calculating unique active users across rolling periods.',
    challengeType: 'SQL',
    difficulty: 'MEDIUM',
    targetLevel: 'L3',
    environment: 'SQLExecutionEnvironment',
    evaluationType: 'SQL_RESULT',
    questionFamily: 'sql-cohort-retention-aggregation',
    variantGroupId: 'var-sql-cohort-01',
    expectedTimeMinutes: 20,
    sourceType: 'W3SCHOOLS_REFERENCE',
    sourceName: 'W3Schools',
    sourceUrl: 'https://www.w3schools.com/sql/sql_groupby.asp',
    normalizedHash: 'h_fs_sql_001',
    starterCode: `SELECT 
  date_trunc('month', created_at) AS cohort_month,
  COUNT(DISTINCT id) AS total_users
FROM users
GROUP BY date_trunc('month', created_at)
ORDER BY cohort_month ASC;`,
    solutionCode: `SELECT date_trunc('month', created_at) AS cohort_month, COUNT(DISTINCT id) AS total_users FROM users GROUP BY date_trunc('month', created_at) ORDER BY cohort_month ASC;`,
    testCases: [
      { name: 'Correctly groups timestamps to monthly boundaries', isHidden: false },
      { name: 'COUNT DISTINCT prevents duplicate row inflation', isHidden: false },
      { name: 'Ascending chronological ordering', isHidden: true }
    ],
    hints: ['Use date_trunc("month", created_at) in PostgreSQL or strftime in SQLite.', 'Group by the exact truncated expression.'],
    status: 'ACTIVE'
  },

  // ============================================================================
  // 2. FRONTEND DEVELOPER
  // ============================================================================
  {
    id: 'fe-dom-001',
    careerRoleSlug: 'frontend-developer',
    careerRoleId: getRoleUuid('frontend-developer'),
    categoryId: 'fe-html-web',
    categoryTitle: 'HTML & Web Fundamentals',
    skillName: 'JavaScript',
    title: 'Beginner: Semantic Landmark Structure & ARIA Role Assignment',
    description: 'Identify semantic HTML5 tags and ensure accessible landmark roles (<header>, <main>, <nav>, <footer>) are properly organized with zero heading level skipping.',
    challengeType: 'CODING',
    difficulty: 'BEGINNER',
    targetLevel: 'L1',
    environment: 'WebPreviewEnvironment',
    evaluationType: 'AUTOMATED_TESTS',
    questionFamily: 'fe-semantic-landmarks-intro',
    variantGroupId: 'var-fe-sem-01',
    expectedTimeMinutes: 10,
    sourceType: 'MDN_REFERENCE',
    sourceName: 'MDN Web Docs',
    sourceUrl: 'https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML',
    normalizedHash: 'h_fe_sem_001',
    starterCode: `function validateDocumentOutline(elements) {
  // Verify that an H1 exists before H2, and main landmark is present
  const hasMain = elements.includes('main');
  const h1Index = elements.indexOf('h1');
  const h2Index = elements.indexOf('h2');
  return hasMain && h1Index !== -1 && (h2Index === -1 || h1Index < h2Index);
}`,
    solutionCode: `function validateDocumentOutline(elements) {
  const hasMain = elements.includes('main');
  const h1Index = elements.indexOf('h1');
  const h2Index = elements.indexOf('h2');
  return hasMain && h1Index !== -1 && (h2Index === -1 || h1Index < h2Index);
}`,
    testCases: [
      { name: 'Confirms existence of <main> landmark', isHidden: false },
      { name: 'Enforces H1 precedes H2 in visual document flow', isHidden: false },
      { name: 'Rejects layouts lacking root primary heading', isHidden: true }
    ],
    hints: ['Check elements array for presence of "main" tag.', 'Verify index of "h1" is non-negative and precedes "h2".'],
    status: 'ACTIVE'
  },
  {
    id: 'fe-react-001',
    careerRoleSlug: 'frontend-developer',
    careerRoleId: getRoleUuid('frontend-developer'),
    categoryId: 'fe-react-engineering',
    categoryTitle: 'React Engineering',
    skillName: 'React',
    title: 'Amateur: Fix Unnecessary Re-render Storms in Filtered Lists',
    description: 'Refactor a React component where array filtering during render causes child component thrashing. Implement useMemo and stable callback references.',
    challengeType: 'CODING',
    difficulty: 'MEDIUM',
    targetLevel: 'L3',
    environment: 'WebPreviewEnvironment',
    evaluationType: 'AUTOMATED_TESTS',
    questionFamily: 'fe-react-memo-filter',
    variantGroupId: 'var-fe-memo-01',
    expectedTimeMinutes: 20,
    sourceType: 'MDN_REFERENCE',
    sourceName: 'React Documentation',
    sourceUrl: 'https://react.dev/reference/react/useMemo',
    normalizedHash: 'h_fe_memo_001',
    starterCode: `function filterLargeDataset(items, query) {
  if (!query) return items;
  const q = query.toLowerCase();
  return items.filter(item => item.name.toLowerCase().includes(q));
}`,
    solutionCode: `function filterLargeDataset(items, query) {
  if (!query) return items;
  const q = query.toLowerCase();
  return items.filter(item => item.name.toLowerCase().includes(q));
}`,
    testCases: [
      { name: 'Returns all records when query is empty', isHidden: false },
      { name: 'Performs case-insensitive substring matching', isHidden: false },
      { name: 'Maintains referential stability for identical queries', isHidden: true }
    ],
    hints: ['Convert search string to lowercase once before filtering.', 'Return original array directly when query string is empty.'],
    status: 'ACTIVE'
  },
  {
    id: 'fe-a11y-001',
    careerRoleSlug: 'frontend-developer',
    careerRoleId: getRoleUuid('frontend-developer'),
    categoryId: 'fe-accessibility',
    categoryTitle: 'Accessibility (WCAG AA)',
    skillName: 'Web Accessibility',
    title: 'Professional: Keyboard Focus Trap for Modal Dialogs',
    description: 'Implement a focus trap algorithm that intercepts Tab and Shift+Tab key events to cycle focus exclusively between first and last focusable elements inside an open modal.',
    challengeType: 'CODING',
    difficulty: 'HARD',
    targetLevel: 'L4',
    environment: 'CodeExecutionEnvironment',
    evaluationType: 'AUTOMATED_TESTS',
    questionFamily: 'fe-a11y-focus-trap',
    variantGroupId: 'var-fe-trap-01',
    expectedTimeMinutes: 25,
    sourceType: 'MDN_REFERENCE',
    sourceName: 'W3C WAI-ARIA Authoring Practices',
    sourceUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',
    normalizedHash: 'h_fe_trap_001',
    starterCode: `function handleFocusTrap(event, firstEl, lastEl, currentEl) {
  if (event.key !== 'Tab') return 'NO_OP';

  if (event.shiftKey) {
    if (currentEl === firstEl) {
      return 'FOCUS_LAST';
    }
  } else {
    if (currentEl === lastEl) {
      return 'FOCUS_FIRST';
    }
  }
  return 'ALLOW_DEFAULT';
}`,
    solutionCode: `function handleFocusTrap(event, firstEl, lastEl, currentEl) {
  if (event.key !== 'Tab') return 'NO_OP';
  if (event.shiftKey) {
    if (currentEl === firstEl) return 'FOCUS_LAST';
  } else {
    if (currentEl === lastEl) return 'FOCUS_FIRST';
  }
  return 'ALLOW_DEFAULT';
}`,
    testCases: [
      { name: 'Wraps forward Tab from last element back to first', isHidden: false },
      { name: 'Wraps Shift+Tab backwards from first element to last', isHidden: false },
      { name: 'Ignores non-Tab keydown events', isHidden: true }
    ],
    hints: ['Check event.key === "Tab".', 'If shiftKey is true and current element is firstEl, wrap focus to lastEl.'],
    status: 'ACTIVE'
  },

  // ============================================================================
  // 3. BACKEND DEVELOPER
  // ============================================================================
  {
    id: 'be-api-001',
    careerRoleSlug: 'backend-developer',
    careerRoleId: getRoleUuid('backend-developer'),
    categoryId: 'be-rest-api',
    categoryTitle: 'REST API Engineering',
    skillName: 'REST & gRPC APIs',
    title: 'Beginner: Deterministic JSON Response Envelope Contract',
    description: 'Implement a response serializer envelope function wrapApiResponse(data, metadata) ensuring consistent API status, timestamp, and payload structure across all endpoints.',
    challengeType: 'CODING',
    difficulty: 'BEGINNER',
    targetLevel: 'L1',
    environment: 'CodeExecutionEnvironment',
    evaluationType: 'AUTOMATED_TESTS',
    questionFamily: 'be-api-envelope-format',
    variantGroupId: 'var-be-env-01',
    expectedTimeMinutes: 10,
    sourceType: 'GFG_REFERENCE',
    sourceName: 'GeeksforGeeks',
    sourceUrl: 'https://www.geeksforgeeks.org/rest-api-tutorial/',
    normalizedHash: 'h_be_env_001',
    starterCode: `function wrapApiResponse(data, status = 200, message = 'OK') {
  return {
    success: status >= 200 && status < 300,
    status,
    message,
    data,
    timestamp: new Date().toISOString()
  };
}`,
    solutionCode: `function wrapApiResponse(data, status = 200, message = 'OK') {
  return {
    success: status >= 200 && status < 300,
    status,
    message,
    data,
    timestamp: new Date().toISOString()
  };
}`,
    testCases: [
      { name: 'Returns success true for 200 and 201 status codes', isHidden: false },
      { name: 'Returns success false for 4xx or 5xx status codes', isHidden: false },
      { name: 'Injects ISO timestamp and data payload', isHidden: true }
    ],
    hints: ['Check status >= 200 && status < 300 for success boolean.', 'Serialize timestamp using new Date().toISOString().'],
    status: 'ACTIVE'
  },
  {
    id: 'be-cache-001',
    careerRoleSlug: 'backend-developer',
    careerRoleId: getRoleUuid('backend-developer'),
    categoryId: 'be-caching',
    categoryTitle: 'Caching',
    skillName: 'Redis & Caching',
    title: 'Amateur: Cache-Aside Read Through with TTL Expiration',
    description: 'Implement a cache-aside helper function with simulated key lookup, cache hit return, and database fallback write-back with TTL.',
    challengeType: 'CODING',
    difficulty: 'MEDIUM',
    targetLevel: 'L3',
    environment: 'CodeExecutionEnvironment',
    evaluationType: 'AUTOMATED_TESTS',
    questionFamily: 'be-cache-aside-pattern',
    variantGroupId: 'var-be-cache-01',
    expectedTimeMinutes: 20,
    sourceType: 'GFG_REFERENCE',
    sourceName: 'GeeksforGeeks',
    sourceUrl: 'https://www.geeksforgeeks.org/caching-system-design-concept-for-interviews/',
    normalizedHash: 'h_be_cache_001',
    starterCode: `async function cacheAsideGet(cacheMap, key, fetchFromDbFn, ttlSeconds = 60) {
  const now = Date.now();
  const cached = cacheMap.get(key);

  if (cached && cached.expiresAt > now) {
    return { data: cached.val, fromCache: true };
  }

  const freshData = await fetchFromDbFn();
  cacheMap.set(key, { val: freshData, expiresAt: now + ttlSeconds * 1000 });
  return { data: freshData, fromCache: false };
}`,
    solutionCode: `async function cacheAsideGet(cacheMap, key, fetchFromDbFn, ttlSeconds = 60) {
  const now = Date.now();
  const cached = cacheMap.get(key);
  if (cached && cached.expiresAt > now) {
    return { data: cached.val, fromCache: true };
  }
  const freshData = await fetchFromDbFn();
  cacheMap.set(key, { val: freshData, expiresAt: now + ttlSeconds * 1000 });
  return { data: freshData, fromCache: false };
}`,
    testCases: [
      { name: 'Returns cached value immediately when valid and unexpired', isHidden: false },
      { name: 'Falls back to database function on cache miss or expiration', isHidden: false },
      { name: 'Updates cache with newly fetched record and updated TTL', isHidden: true }
    ],
    hints: ['Check cached.expiresAt against current epoch timestamp Date.now().', 'Store fetched result into cacheMap with future expiry.'],
    status: 'ACTIVE'
  },
  {
    id: 'be-sec-001',
    careerRoleSlug: 'backend-developer',
    careerRoleId: getRoleUuid('backend-developer'),
    categoryId: 'be-api-security',
    categoryTitle: 'API Security',
    skillName: 'REST & gRPC APIs',
    title: 'Professional: Token Bucket Distributed Rate Limiting',
    description: 'Construct a token bucket algorithm that refills tokens at a fixed rate per second and allows burst traffic up to max capacity while rejecting overflows.',
    challengeType: 'CODING',
    difficulty: 'HARD',
    targetLevel: 'L4',
    environment: 'CodeExecutionEnvironment',
    evaluationType: 'AUTOMATED_TESTS',
    questionFamily: 'be-token-bucket-limiter',
    variantGroupId: 'var-be-bucket-01',
    expectedTimeMinutes: 25,
    sourceType: 'GFG_REFERENCE',
    sourceName: 'GeeksforGeeks',
    sourceUrl: 'https://www.geeksforgeeks.org/token-bucket-algorithm/',
    normalizedHash: 'h_be_bucket_001',
    starterCode: `function createTokenBucket(capacity, refillRatePerSec) {
  let tokens = capacity;
  let lastRefill = Date.now();

  return function consume(requestedTokens = 1) {
    const now = Date.now();
    const elapsedSec = (now - lastRefill) / 1000;
    tokens = Math.min(capacity, tokens + elapsedSec * refillRatePerSec);
    lastRefill = now;

    if (tokens >= requestedTokens) {
      tokens -= requestedTokens;
      return { allowed: true, remaining: Math.floor(tokens) };
    }
    return { allowed: false, remaining: Math.floor(tokens) };
  };
}`,
    solutionCode: `function createTokenBucket(capacity, refillRatePerSec) {
  let tokens = capacity;
  let lastRefill = Date.now();
  return function consume(requestedTokens = 1) {
    const now = Date.now();
    const elapsedSec = (now - lastRefill) / 1000;
    tokens = Math.min(capacity, tokens + elapsedSec * refillRatePerSec);
    lastRefill = now;
    if (tokens >= requestedTokens) {
      tokens -= requestedTokens;
      return { allowed: true, remaining: Math.floor(tokens) };
    }
    return { allowed: false, remaining: Math.floor(tokens) };
  };
}`,
    testCases: [
      { name: 'Consumes tokens up to initial capacity allowance', isHidden: false },
      { name: 'Denies requests when tokens are depleted', isHidden: false },
      { name: 'Refills tokens proportional to elapsed time without exceeding capacity', isHidden: true }
    ],
    hints: ['Refill formula: Math.min(capacity, tokens + elapsedSec * refillRatePerSec).', 'Subtract requested tokens on allowance.'],
    status: 'ACTIVE'
  },

  // ============================================================================
  // 4. AI / AGENTIC AI ENGINEER
  // ============================================================================
  {
    id: 'ai-fnd-001',
    careerRoleSlug: 'ai-agentic-ai-engineer',
    careerRoleId: getRoleUuid('ai-agentic-ai-engineer'),
    categoryId: 'ai-fundamentals',
    categoryTitle: 'AI Fundamentals',
    skillName: 'LLMs & Prompt Engineering',
    title: 'Beginner: Context Window Token Budget Calculator',
    description: 'Calculate remaining generation tokens given model context limit, system prompt tokens, chat history tokens, and safety buffer.',
    challengeType: 'CODING',
    difficulty: 'BEGINNER',
    targetLevel: 'L1',
    environment: 'CodeExecutionEnvironment',
    evaluationType: 'AUTOMATED_TESTS',
    questionFamily: 'ai-token-budget-calc',
    variantGroupId: 'var-ai-tok-01',
    expectedTimeMinutes: 10,
    sourceType: 'LEARN_2_HIRE_ORIGINAL',
    sourceName: 'Learn-2-Hire Original',
    sourceUrl: 'https://platform.openai.com/docs/guides/text-generation',
    normalizedHash: 'h_ai_tok_001',
    starterCode: `function calculateAvailableOutputTokens(maxContext, systemTokens, historyTokens, buffer = 256) {
  const consumed = systemTokens + historyTokens + buffer;
  const remaining = maxContext - consumed;
  return remaining > 0 ? remaining : 0;
}`,
    solutionCode: `function calculateAvailableOutputTokens(maxContext, systemTokens, historyTokens, buffer = 256) {
  const consumed = systemTokens + historyTokens + buffer;
  const remaining = maxContext - consumed;
  return remaining > 0 ? remaining : 0;
}`,
    testCases: [
      { name: 'Calculates remaining tokens under normal context constraints', isHidden: false },
      { name: 'Returns 0 when input tokens exceed context window ceiling', isHidden: false },
      { name: 'Accounts for safety buffer reservation', isHidden: true }
    ],
    hints: ['Subtract systemTokens, historyTokens, and buffer from maxContext.', 'Clamp result to 0 to prevent negative values.'],
    status: 'ACTIVE'
  },
  {
    id: 'ai-tool-001',
    careerRoleSlug: 'ai-agentic-ai-engineer',
    careerRoleId: getRoleUuid('ai-agentic-ai-engineer'),
    categoryId: 'ai-tool-calling',
    categoryTitle: 'Tool Calling',
    skillName: 'Tool Calling & APIs',
    title: 'Amateur: JSON Schema Tool Argument Validator',
    description: 'Build a validator verifying LLM function call arguments against parameter schema requirements before tool execution.',
    challengeType: 'CODING',
    difficulty: 'MEDIUM',
    targetLevel: 'L3',
    environment: 'CodeExecutionEnvironment',
    evaluationType: 'AUTOMATED_TESTS',
    questionFamily: 'ai-tool-schema-validator',
    variantGroupId: 'var-ai-tool-01',
    expectedTimeMinutes: 20,
    sourceType: 'LEARN_2_HIRE_ORIGINAL',
    sourceName: 'Anthropic Claude Tool Docs',
    sourceUrl: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use',
    normalizedHash: 'h_ai_tool_001',
    starterCode: `function validateToolArguments(schema, args) {
  const required = schema.required || [];
  for (const field of required) {
    if (args[field] === undefined || args[field] === null) {
      return { isValid: false, missingField: field };
    }
  }
  return { isValid: true, missingField: null };
}`,
    solutionCode: `function validateToolArguments(schema, args) {
  const required = schema.required || [];
  for (const field of required) {
    if (args[field] === undefined || args[field] === null) {
      return { isValid: false, missingField: field };
    }
  }
  return { isValid: true, missingField: null };
}`,
    testCases: [
      { name: 'Passes when all required schema properties are provided', isHidden: false },
      { name: 'Fails with missing field identifier when required parameter omitted', isHidden: false },
      { name: 'Permits optional parameters not in required list', isHidden: true }
    ],
    hints: ['Iterate through schema.required array.', 'Verify args[field] is defined.'],
    status: 'ACTIVE'
  },
  {
    id: 'ai-rag-001',
    careerRoleSlug: 'ai-agentic-ai-engineer',
    careerRoleId: getRoleUuid('ai-agentic-ai-engineer'),
    categoryId: 'ai-rag',
    categoryTitle: 'RAG Engineering',
    skillName: 'Vector DBs & pgvector',
    title: 'Professional: Recursive Document Chunking with Overlap',
    description: 'Implement a character-based document chunker that splits long text into target chunk sizes with sliding window token overlap.',
    challengeType: 'CODING',
    difficulty: 'HARD',
    targetLevel: 'L4',
    environment: 'CodeExecutionEnvironment',
    evaluationType: 'AUTOMATED_TESTS',
    questionFamily: 'ai-rag-chunker-overlap',
    variantGroupId: 'var-ai-rag-01',
    expectedTimeMinutes: 25,
    sourceType: 'LEARN_2_HIRE_ORIGINAL',
    sourceName: 'LangChain Documentation',
    sourceUrl: 'https://python.langchain.com/docs/how_to/recursive_text_splitter/',
    normalizedHash: 'h_ai_rag_001',
    starterCode: `function chunkDocument(text, chunkSize = 200, chunkOverlap = 50) {
  const chunks = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    chunks.push(text.slice(startIndex, endIndex));
    if (endIndex === text.length) break;
    startIndex += (chunkSize - chunkOverlap);
  }
  return chunks;
}`,
    solutionCode: `function chunkDocument(text, chunkSize = 200, chunkOverlap = 50) {
  const chunks = [];
  let startIndex = 0;
  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    chunks.push(text.slice(startIndex, endIndex));
    if (endIndex === text.length) break;
    startIndex += (chunkSize - chunkOverlap);
  }
  return chunks;
}`,
    testCases: [
      { name: 'Splits text into chunks respecting max size', isHidden: false },
      { name: 'Maintains overlap between consecutive slices', isHidden: false },
      { name: 'Handles short documents under chunk size without splitting', isHidden: true }
    ],
    hints: ['Advance start index by (chunkSize - chunkOverlap).', 'Slice text from startIndex to Math.min(startIndex + chunkSize, text.length).'],
    status: 'ACTIVE'
  },

  // ============================================================================
  // 5. MACHINE LEARNING ENGINEER
  // ============================================================================
  {
    id: 'ml-beg-001',
    careerRoleSlug: 'machine-learning-engineer',
    careerRoleId: getRoleUuid('machine-learning-engineer'),
    categoryId: 'ml-python',
    categoryTitle: 'Python for Machine Learning',
    skillName: 'Python',
    title: 'Beginner: Feature Matrix and Target Label Partitioning',
    description: 'Partition tabular records into a numerical feature matrix X and ground truth label array y, separating target column from predictors.',
    challengeType: 'CODING',
    difficulty: 'BEGINNER',
    targetLevel: 'L1',
    environment: 'PythonDataEnvironment',
    evaluationType: 'AUTOMATED_TESTS',
    questionFamily: 'ml-feature-target-split',
    variantGroupId: 'var-ml-split-01',
    expectedTimeMinutes: 10,
    sourceType: 'W3SCHOOLS_REFERENCE',
    sourceName: 'W3Schools',
    sourceUrl: 'https://www.w3schools.com/python/python_ml_train_test.asp',
    normalizedHash: 'h_ml_split_001',
    starterCode: `function splitFeaturesAndTarget(rows, targetColumn) {
  const X = [];
  const y = [];

  for (const row of rows) {
    const features = { ...row };
    delete features[targetColumn];
    X.push(features);
    y.push(row[targetColumn]);
  }
  return { X, y };
}`,
    solutionCode: `function splitFeaturesAndTarget(rows, targetColumn) {
  const X = [];
  const y = [];
  for (const row of rows) {
    const features = { ...row };
    delete features[targetColumn];
    X.push(features);
    y.push(row[targetColumn]);
  }
  return { X, y };
}`,
    testCases: [
      { name: 'Removes target column from predictor matrix X', isHidden: false },
      { name: 'Preserves target label sequence in output array y', isHidden: false },
      { name: 'Maintains identical row counts between X and y', isHidden: true }
    ],
    hints: ['Clone row object, delete targetColumn, and push remaining keys to X.', 'Push target column value into y.'],
    status: 'ACTIVE'
  },
  {
    id: 'ml-eval-001',
    careerRoleSlug: 'machine-learning-engineer',
    careerRoleId: getRoleUuid('machine-learning-engineer'),
    categoryId: 'ml-evaluation',
    categoryTitle: 'Model Evaluation',
    skillName: 'Scikit-Learn & PyTorch',
    title: 'Amateur: Binary Confusion Matrix & F1-Score Computation',
    description: 'Compute True Positives (TP), False Positives (FP), False Negatives (FN), and calculate Precision, Recall, and harmonic F1-score.',
    challengeType: 'CODING',
    difficulty: 'MEDIUM',
    targetLevel: 'L3',
    environment: 'MLExecutionEnvironment',
    evaluationType: 'AUTOMATED_TESTS',
    questionFamily: 'ml-confusion-matrix-f1',
    variantGroupId: 'var-ml-f1-01',
    expectedTimeMinutes: 20,
    sourceType: 'GFG_REFERENCE',
    sourceName: 'GeeksforGeeks',
    sourceUrl: 'https://www.geeksforgeeks.org/confusion-matrix-machine-learning/',
    normalizedHash: 'h_ml_f1_001',
    starterCode: `function evaluateClassificationMetrics(yTrue, yPred) {
  let tp = 0, fp = 0, fn = 0, tn = 0;

  for (let i = 0; i < yTrue.length; i++) {
    if (yTrue[i] === 1 && yPred[i] === 1) tp++;
    else if (yTrue[i] === 0 && yPred[i] === 1) fp++;
    else if (yTrue[i] === 1 && yPred[i] === 0) fn++;
    else tn++;
  }

  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return { tp, fp, fn, tn, precision, recall, f1 };
}`,
    solutionCode: `function evaluateClassificationMetrics(yTrue, yPred) {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  for (let i = 0; i < yTrue.length; i++) {
    if (yTrue[i] === 1 && yPred[i] === 1) tp++;
    else if (yTrue[i] === 0 && yPred[i] === 1) fp++;
    else if (yTrue[i] === 1 && yPred[i] === 0) fn++;
    else tn++;
  }
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  return { tp, fp, fn, tn, precision, recall, f1 };
}`,
    testCases: [
      { name: 'Accurately computes TP, FP, FN, TN cell tallies', isHidden: false },
      { name: 'Harmonizes precision and recall into F1 harmonic mean', isHidden: false },
      { name: 'Handles zero positive predictions without divide-by-zero crash', isHidden: true }
    ],
    hints: ['Precision = TP / (TP + FP).', 'Recall = TP / (TP + FN).', 'F1 = 2 * (P * R) / (P + R).'],
    status: 'ACTIVE'
  },
  {
    id: 'ml-drift-001',
    careerRoleSlug: 'machine-learning-engineer',
    careerRoleId: getRoleUuid('machine-learning-engineer'),
    categoryId: 'ml-data-drift',
    categoryTitle: 'Data Drift',
    skillName: 'Mathematics & Statistics',
    title: 'Professional: Population Stability Index (PSI) Drift Metric',
    description: 'Calculate the Population Stability Index (PSI) across baseline training and production inference distributions to detect feature drift.',
    challengeType: 'CODING',
    difficulty: 'HARD',
    targetLevel: 'L4',
    environment: 'PythonDataEnvironment',
    evaluationType: 'AUTOMATED_TESTS',
    questionFamily: 'ml-psi-drift-detection',
    variantGroupId: 'var-ml-psi-01',
    expectedTimeMinutes: 25,
    sourceType: 'LEARN_2_HIRE_ORIGINAL',
    sourceName: 'Evidently AI Documentation',
    sourceUrl: 'https://docs.evidentlyai.com/reference/api-reference/evidently.metrics/psi',
    normalizedHash: 'h_ml_psi_001',
    starterCode: `function computePSI(baselineFreq, actualFreq) {
  let psi = 0;
  for (let i = 0; i < baselineFreq.length; i++) {
    const b = Math.max(baselineFreq[i], 0.0001);
    const a = Math.max(actualFreq[i], 0.0001);
    psi += (a - b) * Math.log(a / b);
  }
  return psi;
}`,
    solutionCode: `function computePSI(baselineFreq, actualFreq) {
  let psi = 0;
  for (let i = 0; i < baselineFreq.length; i++) {
    const b = Math.max(baselineFreq[i], 0.0001);
    const a = Math.max(actualFreq[i], 0.0001);
    psi += (a - b) * Math.log(a / b);
  }
  return psi;
}`,
    testCases: [
      { name: 'Yields 0 PSI for identical baseline and target distributions', isHidden: false },
      { name: 'Signals drift (>0.2) when feature shift occurs', isHidden: false },
      { name: 'Handles zero frequency bins safely using floor epsilon', isHidden: true }
    ],
    hints: ['PSI formula: sum((actual - baseline) * ln(actual / baseline)).', 'Apply small epsilon (0.0001) to prevent log of zero.'],
    status: 'ACTIVE'
  },

  // ============================================================================
  // 6. DATA SCIENTIST
  // ============================================================================
  {
    id: 'ds-sql-001',
    careerRoleSlug: 'data-scientist',
    careerRoleId: getRoleUuid('data-scientist'),
    categoryId: 'ds-sql',
    categoryTitle: 'SQL',
    skillName: 'SQL & Analytics DBs',
    title: 'Amateur: Rolling 7-Day Revenue Window Function',
    description: 'Construct an analytical SQL query calculating daily revenue and a 7-day trailing moving average using window functions.',
    challengeType: 'SQL',
    difficulty: 'MEDIUM',
    targetLevel: 'L3',
    environment: 'SQLExecutionEnvironment',
    evaluationType: 'SQL_RESULT',
    questionFamily: 'ds-sql-moving-average',
    variantGroupId: 'var-ds-sql-01',
    expectedTimeMinutes: 20,
    sourceType: 'W3SCHOOLS_REFERENCE',
    sourceName: 'W3Schools',
    sourceUrl: 'https://www.w3schools.com/sql/sql_window_functions.asp',
    normalizedHash: 'h_ds_sql_001',
    starterCode: `SELECT 
  sale_date,
  daily_total,
  AVG(daily_total) OVER (
    ORDER BY sale_date 
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS rolling_7day_avg
FROM daily_sales;`,
    solutionCode: `SELECT sale_date, daily_total, AVG(daily_total) OVER (ORDER BY sale_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS rolling_7day_avg FROM daily_sales;`,
    testCases: [
      { name: 'Calculates correct cumulative sum and average', isHidden: false },
      { name: 'Window restricts window frame to 6 preceding rows', isHidden: false },
      { name: 'Sorts output in chronological sequence', isHidden: true }
    ],
    hints: ['Use AVG(daily_total) OVER (...) with window specification.', 'Specify ROWS BETWEEN 6 PRECEDING AND CURRENT ROW.'],
    status: 'ACTIVE'
  },
  {
    id: 'ds-ab-001',
    careerRoleSlug: 'data-scientist',
    careerRoleId: getRoleUuid('data-scientist'),
    categoryId: 'ds-experiment-design',
    categoryTitle: 'Experiment Design (A/B Testing)',
    skillName: 'A/B Testing & Statistics',
    title: 'Professional: Sample Size and Statistical Power Determination',
    description: 'Calculate the minimum sample size required per variant to detect a Minimum Detectable Effect (MDE) with 80% power at 95% confidence level.',
    challengeType: 'CODING',
    difficulty: 'HARD',
    targetLevel: 'L4',
    environment: 'PythonDataEnvironment',
    evaluationType: 'AUTOMATED_TESTS',
    questionFamily: 'ds-ab-sample-size-calc',
    variantGroupId: 'var-ds-ab-01',
    expectedTimeMinutes: 25,
    sourceType: 'LEARN_2_HIRE_ORIGINAL',
    sourceName: 'Evan Miller A/B Formula',
    sourceUrl: 'https://www.evanmiller.org/how-not-to-run-an-ab-test.html',
    normalizedHash: 'h_ds_ab_001',
    starterCode: `function calculateSampleSizePerVariant(baseRate, mdeRelative, alpha = 0.05, power = 0.80) {
  // Standard two-sided normal z values: alpha 0.05 -> 1.96, power 0.80 -> 0.84
  const zAlpha = 1.96;
  const zBeta = 0.84;
  const p1 = baseRate;
  const p2 = baseRate * (1 + mdeRelative);
  const pAvg = (p1 + p2) / 2;
  const variance = 2 * pAvg * (1 - pAvg);
  const effect = Math.abs(p2 - p1);

  const n = (Math.pow(zAlpha + zBeta, 2) * variance) / Math.pow(effect, 2);
  return Math.ceil(n);
}`,
    solutionCode: `function calculateSampleSizePerVariant(baseRate, mdeRelative, alpha = 0.05, power = 0.80) {
  const zAlpha = 1.96;
  const zBeta = 0.84;
  const p1 = baseRate;
  const p2 = baseRate * (1 + mdeRelative);
  const pAvg = (p1 + p2) / 2;
  const variance = 2 * pAvg * (1 - pAvg);
  const effect = Math.abs(p2 - p1);
  const n = (Math.pow(zAlpha + zBeta, 2) * variance) / Math.pow(effect, 2);
  return Math.ceil(n);
}`,
    testCases: [
      { name: 'Computes sample size for standard conversion baseline (e.g. 5%)', isHidden: false },
      { name: 'Smaller MDE requires substantially larger sample sizes', isHidden: false },
      { name: 'Rounds up to integer ceiling', isHidden: true }
    ],
    hints: ['Apply standard normal critical values z_alpha=1.96 and z_beta=0.84.', 'Calculate absolute effect difference |p2 - p1|.'],
    status: 'ACTIVE'
  },

  // ============================================================================
  // 7. DEVOPS / PLATFORM ENGINEER
  // ============================================================================
  {
    id: 'do-dock-001',
    careerRoleSlug: 'devops-platform-engineer',
    careerRoleId: getRoleUuid('devops-platform-engineer'),
    categoryId: 'do-docker',
    categoryTitle: 'Docker',
    skillName: 'Docker & Containers',
    title: 'Beginner: Multi-Stage Dockerfile Layer Optimization',
    description: 'Structure a multi-stage Docker build pipeline separating dependency compilation from lean production runtime containers.',
    challengeType: 'CODING',
    difficulty: 'BEGINNER',
    targetLevel: 'L1',
    environment: 'DevOpsSimulationEnvironment',
    evaluationType: 'AUTOMATED_TESTS',
    questionFamily: 'do-docker-multistage-build',
    variantGroupId: 'var-do-doc-01',
    expectedTimeMinutes: 15,
    sourceType: 'LEARN_2_HIRE_ORIGINAL',
    sourceName: 'Docker Documentation',
    sourceUrl: 'https://docs.docker.com/build/building/multi-stage/',
    normalizedHash: 'h_do_doc_001',
    starterCode: `function validateDockerfileSafety(dockerfileText) {
  const hasMultiStage = dockerfileText.includes('AS builder') || dockerfileText.includes('as builder');
  const hasNonRootUser = dockerfileText.includes('USER ') && !dockerfileText.includes('USER root');
  const copiesFromBuilder = dockerfileText.includes('--from=builder');
  return hasMultiStage && hasNonRootUser && copiesFromBuilder;
}`,
    solutionCode: `function validateDockerfileSafety(dockerfileText) {
  const hasMultiStage = dockerfileText.includes('AS builder') || dockerfileText.includes('as builder');
  const hasNonRootUser = dockerfileText.includes('USER ') && !dockerfileText.includes('USER root');
  const copiesFromBuilder = dockerfileText.includes('--from=builder');
  return hasMultiStage && hasNonRootUser && copiesFromBuilder;
}`,
    testCases: [
      { name: 'Confirms multi-stage build stage aliases', isHidden: false },
      { name: 'Validates non-root USER execution directive', isHidden: false },
      { name: 'Verifies COPY --from=builder artifact extraction', isHidden: true }
    ],
    hints: ['Ensure "AS builder" is defined in first FROM stage.', 'Look for "USER node" or "USER nonroot".'],
    status: 'ACTIVE'
  },
  {
    id: 'do-k8s-001',
    careerRoleSlug: 'devops-platform-engineer',
    careerRoleId: getRoleUuid('devops-platform-engineer'),
    categoryId: 'do-kubernetes',
    categoryTitle: 'Kubernetes',
    skillName: 'Kubernetes',
    title: 'Amateur: Kubernetes Rolling Update Probes Configuration',
    description: 'Configure livenessProbe and readinessProbe HTTP endpoints to prevent premature traffic routing during container boot cycles.',
    challengeType: 'CODING',
    difficulty: 'MEDIUM',
    targetLevel: 'L3',
    environment: 'DevOpsSimulationEnvironment',
    evaluationType: 'AUTOMATED_TESTS',
    questionFamily: 'do-k8s-probes-config',
    variantGroupId: 'var-do-k8s-01',
    expectedTimeMinutes: 20,
    sourceType: 'LEARN_2_HIRE_ORIGINAL',
    sourceName: 'Kubernetes Documentation',
    sourceUrl: 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/',
    normalizedHash: 'h_do_k8s_001',
    starterCode: `function validateProbeConfig(spec) {
  const hasLiveness = spec.livenessProbe && spec.livenessProbe.httpGet && spec.livenessProbe.initialDelaySeconds >= 5;
  const hasReadiness = spec.readinessProbe && spec.readinessProbe.httpGet && spec.readinessProbe.periodSeconds >= 5;
  return Boolean(hasLiveness && hasReadiness);
}`,
    solutionCode: `function validateProbeConfig(spec) {
  const hasLiveness = spec.livenessProbe && spec.livenessProbe.httpGet && spec.livenessProbe.initialDelaySeconds >= 5;
  const hasReadiness = spec.readinessProbe && spec.readinessProbe.httpGet && spec.readinessProbe.periodSeconds >= 5;
  return Boolean(hasLiveness && hasReadiness);
}`,
    testCases: [
      { name: 'Verifies livenessProbe has initial delay to prevent restart loops', isHidden: false },
      { name: 'Verifies readinessProbe checks health endpoint periodically', isHidden: false },
      { name: 'Rejects specs missing health probe configurations', isHidden: true }
    ],
    hints: ['Check for spec.livenessProbe and spec.readinessProbe objects.', 'Confirm initialDelaySeconds is configured.'],
    status: 'ACTIVE'
  },

  // ============================================================================
  // 8. CYBERSECURITY ARCHITECT
  // ============================================================================
  {
    id: 'sec-iam-001',
    careerRoleSlug: 'cybersecurity-architect',
    careerRoleId: getRoleUuid('cybersecurity-architect'),
    categoryId: 'sec-iam',
    categoryTitle: 'Identity & Access Management (IAM)',
    skillName: 'Zero Trust & IAM',
    title: 'Beginner: Principle of Least Privilege IAM Policy Evaluation',
    description: 'Audit an AWS IAM policy statement to identify and eliminate wildcard Action ("*") and Resource ("*") permissions on sensitive datastores.',
    challengeType: 'CODING',
    difficulty: 'BEGINNER',
    targetLevel: 'L1',
    environment: 'SecurityLabEnvironment',
    evaluationType: 'DEFENSIVE_VERIFICATION',
    questionFamily: 'sec-iam-wildcard-audit',
    variantGroupId: 'var-sec-iam-01',
    expectedTimeMinutes: 15,
    sourceType: 'LEARN_2_HIRE_ORIGINAL',
    sourceName: 'AWS Security Best Practices',
    sourceUrl: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html',
    normalizedHash: 'h_sec_iam_001',
    starterCode: `function auditIamPolicy(statement) {
  const violations = [];
  if (statement.Effect === 'Allow') {
    if (statement.Action === '*' || (Array.isArray(statement.Action) && statement.Action.includes('*'))) {
      violations.push('WILDCARD_ACTION_VIOLATION');
    }
    if (statement.Resource === '*' || (Array.isArray(statement.Resource) && statement.Resource.includes('*'))) {
      violations.push('WILDCARD_RESOURCE_VIOLATION');
    }
  }
  return { isCompliant: violations.length === 0, violations };
}`,
    solutionCode: `function auditIamPolicy(statement) {
  const violations = [];
  if (statement.Effect === 'Allow') {
    if (statement.Action === '*' || (Array.isArray(statement.Action) && statement.Action.includes('*'))) {
      violations.push('WILDCARD_ACTION_VIOLATION');
    }
    if (statement.Resource === '*' || (Array.isArray(statement.Resource) && statement.Resource.includes('*'))) {
      violations.push('WILDCARD_RESOURCE_VIOLATION');
    }
  }
  return { isCompliant: violations.length === 0, violations };
}`,
    testCases: [
      { name: 'Flags Action: "*" as critical privilege violation', isHidden: false },
      { name: 'Flags Resource: "*" as broad exposure violation', isHidden: false },
      { name: 'Passes tightly scoped ARNs and specific action verbs', isHidden: true }
    ],
    hints: ['Check if Action or Resource equals "*" when Effect is "Allow".', 'Return violations array.'],
    status: 'ACTIVE'
  },
  {
    id: 'sec-log-001',
    careerRoleSlug: 'cybersecurity-architect',
    careerRoleId: getRoleUuid('cybersecurity-architect'),
    categoryId: 'sec-siem-logs',
    categoryTitle: 'SIEM & Log Analysis',
    skillName: 'Cloud Security (AWS/Azure)',
    title: 'Amateur: Synthetic Access Log Password Spray Detection',
    description: 'Inspect synthetic web application access logs to detect distributed credential stuffing and password spray attacks across diverse user handles.',
    challengeType: 'CODING',
    difficulty: 'MEDIUM',
    targetLevel: 'L3',
    environment: 'SecurityLabEnvironment',
    evaluationType: 'DEFENSIVE_VERIFICATION',
    questionFamily: 'sec-spray-log-detection',
    variantGroupId: 'var-sec-spray-01',
    expectedTimeMinutes: 20,
    sourceType: 'LEARN_2_HIRE_ORIGINAL',
    sourceName: 'CISA Alert Guidance',
    sourceUrl: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-008a',
    normalizedHash: 'h_sec_spray_001',
    starterCode: `function detectPasswordSpray(logEntries, thresholdAttempts = 5) {
  const ipMap = new Map();

  for (const entry of logEntries) {
    if (entry.endpoint === '/api/login' && entry.status === 401) {
      const stats = ipMap.get(entry.ip) || { attempts: 0, usernames: new Set() };
      stats.attempts++;
      stats.usernames.add(entry.username);
      ipMap.set(entry.ip, stats);
    }
  }

  const flaggedIps = [];
  for (const [ip, stats] of ipMap.entries()) {
    if (stats.attempts >= thresholdAttempts && stats.usernames.size >= 3) {
      flaggedIps.push({ ip, attempts: stats.attempts, targetUsers: stats.usernames.size });
    }
  }
  return flaggedIps;
}`,
    solutionCode: `function detectPasswordSpray(logEntries, thresholdAttempts = 5) {
  const ipMap = new Map();
  for (const entry of logEntries) {
    if (entry.endpoint === '/api/login' && entry.status === 401) {
      const stats = ipMap.get(entry.ip) || { attempts: 0, usernames: new Set() };
      stats.attempts++;
      stats.usernames.add(entry.username);
      ipMap.set(entry.ip, stats);
    }
  }
  const flaggedIps = [];
  for (const [ip, stats] of ipMap.entries()) {
    if (stats.attempts >= thresholdAttempts && stats.usernames.size >= 3) {
      flaggedIps.push({ ip, attempts: stats.attempts, targetUsers: stats.usernames.size });
    }
  }
  return flaggedIps;
}`,
    testCases: [
      { name: 'Flags IP cycling multiple distinct usernames on failed auth', isHidden: false },
      { name: 'Ignores legitimate single-user repeated password typo attempts', isHidden: false },
      { name: 'Accurately groups telemetry by client IP address', isHidden: true }
    ],
    hints: ['Count unique usernames per IP using a Set.', 'Flag when attempts >= threshold and usernames.size >= 3.'],
    status: 'ACTIVE'
  },

  // ============================================================================
  // 9. TECHNICAL PRODUCT MANAGER (Non-Coding / Scenario-Rubric Evaluator)
  // ============================================================================
  {
    id: 'pm-prio-001',
    careerRoleSlug: 'technical-product-manager',
    careerRoleId: getRoleUuid('technical-product-manager'),
    categoryId: 'pm-prioritization',
    categoryTitle: 'Prioritization Frameworks',
    skillName: 'Product Roadmapping & PRDs',
    title: 'Amateur: RICE Framework Scoring & Trade-Off Ranking',
    description: 'Calculate RICE priority scores (Reach * Impact * Confidence / Effort) across 4 competing feature proposals to establish sprint backlog order.',
    challengeType: 'SCENARIO',
    difficulty: 'MEDIUM',
    targetLevel: 'L3',
    environment: 'CaseStudyEnvironment',
    evaluationType: 'SCENARIO_ANALYSIS',
    questionFamily: 'pm-rice-scoring-matrix',
    variantGroupId: 'var-pm-rice-01',
    expectedTimeMinutes: 15,
    sourceType: 'LEARN_2_HIRE_ORIGINAL',
    sourceName: 'Intercom RICE Prioritization Guide',
    sourceUrl: 'https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/',
    normalizedHash: 'h_pm_rice_001',
    scenarioPrompt: 'You have 4 roadmap initiatives for Q3: (A) Social OAuth login, (B) Multi-tenant enterprise SSO, (C) Dark mode toggle, (D) Automated PDF export. Multi-tenant SSO has Reach=200 enterprise clients, Impact=3 (Massive), Confidence=80% (0.8), Effort=4 person-months. OAuth has Reach=5000 users, Impact=2 (High), Confidence=90% (0.9), Effort=2 person-months. Which initiative yields the higher RICE score and strategic justification?',
    scenarioOptions: [
      { id: 'opt-a', text: 'Social OAuth: RICE = (5000 * 2 * 0.9) / 2 = 4500. It delivers broad user onboarding impact with low engineering effort.', rationale: 'Correct mathematical calculation and strongest return on effort for top-of-funnel conversion.', isOptimal: true, points: 10 },
      { id: 'opt-b', text: 'Enterprise SSO: RICE = (200 * 3 * 0.8) / 4 = 120. It should be built first because enterprise contracts pay more.', rationale: 'Incorrect prioritization: RICE is 120 vs 4500 for OAuth; enterprise contracts may be negotiated separately.', isOptimal: false, points: 4 },
      { id: 'opt-c', text: 'Dark mode: RICE = (10000 * 0.5 * 0.5) / 1 = 2500. UI features should always precede backend auth.', rationale: 'Incorrect: Dark mode delivers negligible business impact compared to core authentication.', isOptimal: false, points: 2 }
    ],
    rubric: [
      { criterion: 'Formula application (R * I * C / E)', weight: 0.4 },
      { criterion: 'Strategic trade-off reasoning', weight: 0.6 }
    ],
    status: 'ACTIVE'
  },
  {
    id: 'pm-metric-001',
    careerRoleSlug: 'technical-product-manager',
    careerRoleId: getRoleUuid('technical-product-manager'),
    categoryId: 'pm-metrics',
    categoryTitle: 'Product Metrics',
    skillName: 'Data & Telemetry Analytics',
    title: 'Professional: North Star Metric & Input Metric Deconstruction',
    description: 'Deconstruct a North Star Metric for a B2B SaaS workflow automation platform into distinct leading input metrics across activation, engagement, and retention.',
    challengeType: 'SCENARIO',
    difficulty: 'HARD',
    targetLevel: 'L4',
    environment: 'CaseStudyEnvironment',
    evaluationType: 'SCENARIO_ANALYSIS',
    questionFamily: 'pm-north-star-deconstruct',
    variantGroupId: 'var-pm-ns-01',
    expectedTimeMinutes: 20,
    sourceType: 'LEARN_2_HIRE_ORIGINAL',
    sourceName: 'Amplitude North Star Playbook',
    sourceUrl: 'https://amplitude.com/north-star',
    normalizedHash: 'h_pm_ns_001',
    scenarioPrompt: 'A B2B workflow automation platform tracks "Weekly Active Workflows Run" as its North Star Metric. The VP of Product asks you to identify the 3 most critical input metrics engineering and product squads can directly influence in bi-weekly sprints.',
    scenarioOptions: [
      { id: 'opt-ns-1', text: 'Input 1: Workflow creation completion rate; Input 2: Average actions per workflow; Input 3: Weekly webhook trigger error rate (<0.1%).', rationale: 'Directly influences workflow creation velocity, complexity value, and execution reliability.', isOptimal: true, points: 10 },
      { id: 'opt-ns-2', text: 'Input 1: Monthly Recurring Revenue (MRR); Input 2: Marketing website pageviews; Input 3: Stock price.', rationale: 'These are lagging business outcomes, not operational input metrics teams can directly influence in a sprint.', isOptimal: false, points: 2 }
    ],
    rubric: [
      { criterion: 'Distinction between leading inputs vs lagging outputs', weight: 0.5 },
      { criterion: 'Actionability within engineering sprint cycles', weight: 0.5 }
    ],
    status: 'ACTIVE'
  },

  // ============================================================================
  // 10. UI/UX DESIGNER (Non-Coding / Design-Heuristic Evaluator)
  // ============================================================================
  {
    id: 'ux-heur-001',
    careerRoleSlug: 'ui-ux-designer',
    careerRoleId: getRoleUuid('ui-ux-designer'),
    categoryId: 'ux-design-critique',
    categoryTitle: 'Design Critique',
    skillName: 'UX Research & Usability',
    title: 'Amateur: Nielsen Norman Heuristic Evaluation of Checkout Errors',
    description: 'Audit an e-commerce checkout flow where form validation fails without indicating which field triggered the error. Identify violated usability heuristics and specify remediation.',
    challengeType: 'SCENARIO',
    difficulty: 'MEDIUM',
    targetLevel: 'L3',
    environment: 'DesignEvaluationEnvironment',
    evaluationType: 'HEURISTIC_RUBRIC',
    questionFamily: 'ux-nn-heuristic-critique',
    variantGroupId: 'var-ux-nn-01',
    expectedTimeMinutes: 15,
    sourceType: 'LEARN_2_HIRE_ORIGINAL',
    sourceName: 'Nielsen Norman Group 10 Heuristics',
    sourceUrl: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
    normalizedHash: 'h_ux_nn_001',
    scenarioPrompt: 'A user enters an invalid postal code on a mobile checkout screen. Upon clicking "Place Order", the screen reloads at the top with a generic banner: "Form contains errors", but no inline highlights or error messages appear next to the postal code input field. Which heuristic is primarily violated, and what is the optimal UX design fix?',
    scenarioOptions: [
      { id: 'opt-ux-1', text: 'Heuristic #9: Help Users Recognize, Diagnose, and Recover from Errors. Fix: Place inline red border + contextual message directly underneath the invalid input, scroll viewport smoothly to first error, and keep valid inputs intact.', rationale: 'Directly adheres to Nielsen Norman Heuristic #9 and eliminates user guesswork.', isOptimal: true, points: 10 },
      { id: 'opt-ux-2', text: 'Heuristic #4: Consistency and Standards. Fix: Disable the Place Order button permanently until all fields match a regex without telling the user why.', rationale: 'Disabling buttons without explanation creates dead ends and increases cognitive friction.', isOptimal: false, points: 3 },
      { id: 'opt-ux-3', text: 'Heuristic #1: Visibility of System Status. Fix: Show a full-screen modal blocking interaction until the user re-enters the entire form.', rationale: 'Full-screen blocking modal causes massive frustration and cart abandonment.', isOptimal: false, points: 1 }
    ],
    rubric: [
      { criterion: 'Accurate heuristic identification', weight: 0.5 },
      { criterion: 'Actionable inline error pattern solution', weight: 0.5 }
    ],
    status: 'ACTIVE'
  },
  {
    id: 'ux-tok-001',
    careerRoleSlug: 'ui-ux-designer',
    careerRoleId: getRoleUuid('ui-ux-designer'),
    categoryId: 'ux-color-systems',
    categoryTitle: 'Color Systems',
    skillName: 'Design Systems & Tokens',
    title: 'Professional: WCAG 2.1 AA Contrast Ratio & Semantic Tokens',
    description: 'Determine semantic token contrast compliance for interactive button text against brand background colors to guarantee 4.5:1 ratio.',
    challengeType: 'SCENARIO',
    difficulty: 'HARD',
    targetLevel: 'L4',
    environment: 'DesignEvaluationEnvironment',
    evaluationType: 'HEURISTIC_RUBRIC',
    questionFamily: 'ux-wcag-token-contrast',
    variantGroupId: 'var-ux-tok-01',
    expectedTimeMinutes: 20,
    sourceType: 'LEARN_2_HIRE_ORIGINAL',
    sourceName: 'W3C WCAG 2.1 Guidelines',
    sourceUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
    normalizedHash: 'h_ux_tok_001',
    scenarioPrompt: 'A design team proposes white text (#FFFFFF) on an orange CTA button (#FF8C00) for high visual vibrancy. The luminance contrast ratio calculates to 2.9:1. Does this meet WCAG 2.1 AA for standard 16px body copy, and how should the semantic tokens be adjusted?',
    scenarioOptions: [
      { id: 'opt-tok-1', text: 'Fails WCAG AA (requires >= 4.5:1). Remedy: Darken orange to #D45B00 (achieving 4.6:1 with white text) or switch button text token to high-contrast ink black (#1A1A1A, achieving 7.8:1).', rationale: 'Ensures strict WCAG 2.1 AA accessibility compliance while preserving brand identity.', isOptimal: true, points: 10 },
      { id: 'opt-tok-2', text: 'Passes because orange is an energetic color and users can zoom in on mobile devices.', rationale: 'False: Zooming does not waive baseline contrast requirements; 2.9:1 fails legal accessibility standards.', isOptimal: false, points: 1 }
    ],
    rubric: [
      { criterion: 'Mathematical contrast threshold understanding', weight: 0.5 },
      { criterion: 'Semantic token remediation strategy', weight: 0.5 }
    ],
    status: 'ACTIVE'
  },

  // ============================================================================
  // 11. DIGITAL MARKETING SPECIALIST (Non-Coding / Analytics & Strategy Evaluator)
  // ============================================================================
  {
    id: 'mkt-cac-001',
    careerRoleSlug: 'digital-marketing-specialist',
    careerRoleId: getRoleUuid('digital-marketing-specialist'),
    categoryId: 'mkt-cac-ltv',
    categoryTitle: 'CAC / LTV Economics',
    skillName: 'Analytics & Attribution',
    title: 'Amateur: Customer Acquisition Cost & Payback Period Modeling',
    description: 'Calculate Blended CAC, Paid CAC, and payback period from marketing spend and new paying subscriber cohorts.',
    challengeType: 'SCENARIO',
    difficulty: 'MEDIUM',
    targetLevel: 'L3',
    environment: 'MarketingSimulationEnvironment',
    evaluationType: 'SCENARIO_ANALYSIS',
    questionFamily: 'mkt-cac-payback-calc',
    variantGroupId: 'var-mkt-cac-01',
    expectedTimeMinutes: 15,
    sourceType: 'LEARN_2_HIRE_ORIGINAL',
    sourceName: 'HubSpot Marketing Economics',
    sourceUrl: 'https://blog.hubspot.com/service/customer-acquisition-cost',
    normalizedHash: 'h_mkt_cac_001',
    scenarioPrompt: 'In May, a company spent $50,000 on Google Ads and $10,000 on content marketing, acquiring 1,000 new paying customers (800 from paid ads, 200 from organic). Each customer pays $30/month with an 80% gross margin. What is the Paid CAC and the gross margin payback period for paid customers?',
    scenarioOptions: [
      { id: 'opt-mkt-1', text: 'Paid CAC = $50,000 / 800 = $62.50. Monthly Gross Profit = $30 * 0.8 = $24. Payback Period = $62.50 / $24 = 2.6 months.', rationale: 'Accurately isolates paid acquisition spend and accounts for gross profit margin rather than raw revenue.', isOptimal: true, points: 10 },
      { id: 'opt-mkt-2', text: 'Paid CAC = $60,000 / 1000 = $60. Payback = $60 / $30 = 2.0 months.', rationale: 'Confuses Blended CAC ($60) with Paid CAC ($62.50) and neglects gross margin.', isOptimal: false, points: 4 }
    ],
    rubric: [
      { criterion: 'Accurate Paid CAC isolation', weight: 0.5 },
      { criterion: 'Gross-margin adjusted payback computation', weight: 0.5 }
    ],
    status: 'ACTIVE'
  },
  {
    id: 'mkt-seo-001',
    careerRoleSlug: 'digital-marketing-specialist',
    careerRoleId: getRoleUuid('digital-marketing-specialist'),
    categoryId: 'mkt-seo',
    categoryTitle: 'Search Engine Optimization (SEO)',
    skillName: 'SEO & Search Intent',
    title: 'Professional: Search Intent Mapping & SERP Cannibalization Resolution',
    description: 'Analyze an organic search ranking drop caused by multiple subpages competing for the exact same commercial keyword intent.',
    challengeType: 'SCENARIO',
    difficulty: 'HARD',
    targetLevel: 'L4',
    environment: 'MarketingSimulationEnvironment',
    evaluationType: 'SCENARIO_ANALYSIS',
    questionFamily: 'mkt-serp-cannibalization',
    variantGroupId: 'var-mkt-seo-01',
    expectedTimeMinutes: 20,
    sourceType: 'LEARN_2_HIRE_ORIGINAL',
    sourceName: 'Ahrefs SEO Guide',
    sourceUrl: 'https://ahrefs.com/blog/keyword-cannibalization/',
    normalizedHash: 'h_mkt_seo_001',
    scenarioPrompt: 'A SaaS blog has 3 separate articles: "Best CRM for Startups", "Top 10 Startup CRMs", and "Choosing a Startup CRM". Google Search Console shows impressions fluctuating wildly between position 8 and position 24 with low CTR due to keyword cannibalization. What is the optimal SEO resolution strategy?',
    scenarioOptions: [
      { id: 'opt-seo-1', text: 'Consolidate the 3 articles into one comprehensive, authoritative pillar guide. Set 301 permanent redirects from the two retired URLs to the primary URL, and update internal backlinks.', rationale: 'Combines page authority, eliminates SERP intent confusion, and concentrates link equity.', isOptimal: true, points: 10 },
      { id: 'opt-seo-2', text: 'Add noindex tags to all 3 pages and buy Google Ads for the keyword instead.', rationale: 'Surrenders valuable organic search traffic and increases paid spend unnecessarily.', isOptimal: false, points: 2 },
      { id: 'opt-seo-3', text: 'Leave all 3 pages live and change their font size so Google crawls them faster.', rationale: 'Font size has zero impact on search intent cannibalization.', isOptimal: false, points: 1 }
    ],
    rubric: [
      { criterion: 'Root cause diagnosis of keyword cannibalization', weight: 0.5 },
      { criterion: 'Execution plan with 301 redirects and canonical consolidation', weight: 0.5 }
    ],
    status: 'ACTIVE'
  },

  // ============================================================================
  // 12. TALENT ACQUISITION PARTNER (Non-Coding / Sourcing & Screening Evaluator)
  // ============================================================================
  {
    id: 'ta-bool-001',
    careerRoleSlug: 'talent-acquisition-partner',
    careerRoleId: getRoleUuid('talent-acquisition-partner'),
    categoryId: 'ta-boolean',
    categoryTitle: 'Boolean Search',
    skillName: 'Talent Sourcing & Boolean Search',
    title: 'Beginner: Boolean Search String Syntax for Senior React Talent',
    description: 'Construct a precise Boolean search query for finding Senior Frontend Engineers proficient in React and TypeScript while excluding junior and intern profiles.',
    challengeType: 'SCENARIO',
    difficulty: 'BEGINNER',
    targetLevel: 'L1',
    environment: 'RecruitmentSimulationEnvironment',
    evaluationType: 'SCENARIO_ANALYSIS',
    questionFamily: 'ta-boolean-syntax-senior',
    variantGroupId: 'var-ta-bool-01',
    expectedTimeMinutes: 10,
    sourceType: 'LEARN_2_HIRE_ORIGINAL',
    sourceName: 'Workable Boolean Guide',
    sourceUrl: 'https://resources.workable.com/tutorial/boolean-search-strings-recruiters',
    normalizedHash: 'h_ta_bool_001',
    scenarioPrompt: 'You need to source Senior Frontend Developers with hands-on React and TypeScript experience. You want to filter out junior candidates, interns, and recruiters. Which Boolean search string conforms to standard LinkedIn Recruiter syntax?',
    scenarioOptions: [
      { id: 'opt-ta-1', text: '("Senior Frontend" OR "Staff Frontend" OR "Lead Frontend") AND (React OR ReactJS) AND TypeScript NOT (Junior OR Intern OR Recruiter)', rationale: 'Correct grouping with parentheses, capitalized operators (AND, OR, NOT), and precise exclusions.', isOptimal: true, points: 10 },
      { id: 'opt-ta-2', text: 'Senior and Frontend and React and TypeScript and no junior candidates please', rationale: 'Natural language phrases fail in standard Boolean parser engines.', isOptimal: false, points: 1 },
      { id: 'opt-ta-3', text: 'Frontend OR React NOT TypeScript', rationale: 'Excludes the required TypeScript skill and lacks senior title qualification.', isOptimal: false, points: 2 }
    ],
    rubric: [
      { criterion: 'Boolean operator casing and parenthesis grouping', weight: 0.6 },
      { criterion: 'Precision qualification and exclusion filtering', weight: 0.4 }
    ],
    status: 'ACTIVE'
  },
  {
    id: 'ta-screen-001',
    careerRoleSlug: 'talent-acquisition-partner',
    careerRoleId: getRoleUuid('talent-acquisition-partner'),
    categoryId: 'ta-structured-interviewing',
    categoryTitle: 'Structured Interviewing',
    skillName: 'Structured Interviewing',
    title: 'Amateur: Competency Scorecard Calibration & Bias Mitigation',
    description: 'Design a structured behavioral interview rubric evaluating "Resolving Technical Disagreements" with clear anchors for Unsatisfactory, Competent, and Exemplary.',
    challengeType: 'SCENARIO',
    difficulty: 'MEDIUM',
    targetLevel: 'L3',
    environment: 'RecruitmentSimulationEnvironment',
    evaluationType: 'SCENARIO_ANALYSIS',
    questionFamily: 'ta-scorecard-rubric-anchors',
    variantGroupId: 'var-ta-rub-01',
    expectedTimeMinutes: 20,
    sourceType: 'LEARN_2_HIRE_ORIGINAL',
    sourceName: 'Google re:Work Structured Interviewing',
    sourceUrl: 'https://rework.withgoogle.com/guides/hiring-use-structured-interviewing/',
    normalizedHash: 'h_ta_rub_001',
    scenarioPrompt: 'An interviewer rates a candidate 5/5 because "we went to the same university and had great conversational chemistry." As the Talent Acquisition Partner, how do you recalibrate the hiring committee to eliminate affinity bias and enforce objective evidence?',
    scenarioOptions: [
      { id: 'opt-bias-1', text: 'Reject the subjective rating. Require the interviewer to document specific behavioral evidence against the competency rubric (e.g. demonstrated communication, technical trade-off decisions) anchored by predetermined performance standards.', rationale: 'Adheres to structured interview methodology, replaces gut feeling with objective evidence, and mitigates affinity bias.', isOptimal: true, points: 10 },
      { id: 'opt-bias-2', text: 'Accept the rating because culture fit and having common college experiences guarantees strong team morale.', rationale: 'Deepens systemic affinity bias and degrades quality of hire.', isOptimal: false, points: 1 }
    ],
    rubric: [
      { criterion: 'Identification of unconscious affinity bias', weight: 0.5 },
      { criterion: 'Enforcement of evidence-based rubric standards', weight: 0.5 }
    ],
    status: 'ACTIVE'
  }
];

/**
 * Returns all active challenges for a given role slug, optionally filtered by categoryId.
 */
export function getPracticeChallengesForRole(
  roleSlug: string,
  categoryId?: string
): PracticeChallenge[] {
  const normalizedSlug = (roleSlug || 'full-stack-developer').toLowerCase().trim();
  return PRACTICE_CHALLENGES_CATALOG.filter((ch) => {
    const roleMatches = ch.careerRoleSlug === normalizedSlug;
    if (!roleMatches) return false;
    if (categoryId) return ch.categoryId === categoryId;
    return true;
  });
}

/**
 * Retrieves a single practice challenge by its unique identifier.
 */
export function getPracticeChallengeById(id: string): PracticeChallenge | undefined {
  return PRACTICE_CHALLENGES_CATALOG.find((ch) => ch.id === id);
}

/**
 * Returns the exact inventory count of active challenges in a specific category.
 * Strictly avoids fabricated numbers: returns true length of catalog matches.
 */
export function getCategoryChallengeCount(roleSlug: string, categoryId: string): number {
  return getPracticeChallengesForRole(roleSlug, categoryId).length;
}

/**
 * Computes role-level challenge statistics across categories.
 */
export function getRoleChallengeStats(roleSlug: string): {
  totalChallenges: number;
  categoryCounts: Record<string, number>;
} {
  const challenges = getPracticeChallengesForRole(roleSlug);
  const categoryCounts: Record<string, number> = {};

  for (const ch of challenges) {
    categoryCounts[ch.categoryId] = (categoryCounts[ch.categoryId] || 0) + 1;
  }

  return {
    totalChallenges: challenges.length,
    categoryCounts
  };
}
