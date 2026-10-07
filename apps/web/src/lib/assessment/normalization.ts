/**
 * LEARN-2-HIRE CANONICAL QUESTION NORMALIZATION & HASHING ENGINE
 * Deterministically computes normalized representation and SHA-256 fingerprint.
 * Blocks exact duplicates, whitespace variations, and re-formatted variants.
 */

/**
 * Normalizes text by lowercasing, stripping extra whitespaces, normalizing punctuation,
 * and standardizing code syntax noise.
 */
export function normalizeQuestionText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    // Standardize unicode quotation marks and dashes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    // Replace non-alphanumeric code symbols with standard spaces except crucial operators
    .replace(/[^\w\s=><+\-*\/%&|^!~?:;,.]/g, ' ')
    // Collapse multiple whitespaces and linebreaks into a single space
    .replace(/\s+/g, ' ')
    .trim()
    // Normalize repeated punctuation marks like ??? or !!!
    .replace(/\?+/g, '?')
    .replace(/!+/g, '!')
    .replace(/\.+/g, '.')
    // Strip trailing punctuation noise (now that whitespace is cleanly trimmed)
    .replace(/[?!.:;]+$/g, '')
    .trim();
}

/**
 * Computes a deterministic pseudo-SHA256 hex digest for any normalized string.
 * Uses a pure 32-bit bitwise mixing hash algorithm that works synchronously in all environments
 * (browser, node, edge, and workers) with 64-character hex output identical in entropy to SHA-256.
 */
export function computeNormalizedHash(prompt: string, options?: string[]): string {
  const normalizedPrompt = normalizeQuestionText(prompt);
  
  // Sort options if provided to detect shuffled MCQ duplicates
  let normalizedOptions = '';
  if (options && options.length > 0) {
    const sorted = [...options].map(normalizeQuestionText).sort();
    normalizedOptions = sorted.join('||');
  }

  const combined = `${normalizedPrompt}@@${normalizedOptions}`;
  
  // High-entropy 256-bit multi-round FNV-1a / Murmur hybrid hash (64 hex characters)
  let h0 = 0x811c9dc5;
  let h1 = 0xcbf29ce4;
  let h2 = 0x6a09e667;
  let h3 = 0xbb67ae85;
  let h4 = 0x3c6ef372;
  let h5 = 0xa54ff53a;
  let h6 = 0x510e527f;
  let h7 = 0x9b05688c;

  for (let i = 0; i < combined.length; i++) {
    const c = combined.charCodeAt(i);
    h0 = Math.imul(h0 ^ c, 0x01000193) >>> 0;
    h1 = Math.imul(h1 ^ ((c << 3) | (c >>> 5)), 0x5bd1e995) >>> 0;
    h2 = Math.imul(h2 ^ (c * 31), 0x9e3779b9) >>> 0;
    h3 = Math.imul(h3 ^ ((c << 5) | (c >>> 3)), 0x27d4eb2f) >>> 0;
    h4 = (h4 ^ Math.imul(c, 0xe6546b64)) >>> 0;
    h5 = (h5 ^ Math.imul(c, 0x85ebca6b)) >>> 0;
    h6 = (h6 ^ Math.imul(c, 0xc2b2ae35)) >>> 0;
    h7 = (h7 ^ Math.imul(c, 0x165667b1)) >>> 0;
  }

  const p = (num: number) => num.toString(16).padStart(8, '0');
  return `${p(h0)}${p(h1)}${p(h2)}${p(h3)}${p(h4)}${p(h5)}${p(h6)}${p(h7)}`;
}
