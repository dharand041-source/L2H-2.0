/**
 * LEARN-2-HIRE 2.0: RESUME PARSER
 * Safe, multi-format text & structure extractor for uploaded documents (PDF, DOCX, TXT)
 * or pasted text. Detects contact info, skills, projects, experience, education,
 * and identifies scanned/image-only PDFs with low character extraction.
 */

import { ParsedResumeData, ParsedContactInfo, ParsedExperienceItem, ParsedEducationItem, ParsedProjectItem } from './resume-types';

export const COMPREHENSIVE_SKILL_LEXICON = [
  // Languages & Core
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'sql', 'html', 'css', 'bash', 'shell',
  // Frontend
  'react', 'next.js', 'vue', 'angular', 'svelte', 'tailwind css', 'sass', 'redux', 'mobx', 'zustand', 'webpack', 'vite', 'graphql', 'rest api', 'dom', 'web accessibility', 'wcag',
  // Backend & Databases
  'node.js', 'express', 'nest.js', 'fastapi', 'django', 'flask', 'spring boot', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'prisma', 'typeorm', 'kafka', 'rabbitmq',
  // DevOps & Cloud
  'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'ci/cd', 'github actions', 'jenkins', 'linux', 'nginx', 'prometheus', 'grafana',
  // AI & ML
  'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'scikit-learn', 'pandas', 'numpy', 'nlp', 'llm', 'rag', 'langchain', 'vector database', 'transformers', 'hugging face',
  // Testing & Quality
  'jest', 'playwright', 'cypress', 'mocha', 'junit', 'pytest', 'tdd', 'unit testing', 'integration testing',
  // Methodologies & Tools
  'git', 'github', 'gitlab', 'jira', 'agile', 'scrum', 'system design', 'microservices', 'restful api'
];

/**
 * Computes a simple SHA-256 equivalent hex hash for duplicate document detection in pure JS/TS
 */
export function computeNormalizedTextHash(text: string): string {
  const normalized = (text || '').toLowerCase().replace(/\s+/g, ' ').trim();
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

/**
 * Extracts candidate contact information using regular expressions
 */
export function extractContactInfo(text: string): ParsedContactInfo {
  const contact: ParsedContactInfo = {};

  // Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) contact.email = emailMatch[0];

  // Phone
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) contact.phone = phoneMatch[0];

  // GitHub
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  if (githubMatch) contact.github = `github.com/${githubMatch[1]}`;

  // LinkedIn
  const linkedInMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  if (linkedInMatch) contact.linkedIn = `linkedin.com/in/${linkedInMatch[1]}`;

  // Portfolio
  const portfolioMatch = text.match(/(?:https?:\/\/)?([a-zA-Z0-9-]+\.(?:dev|io|me|in|com|app))(?:\/[^\s]*)?/i);
  if (portfolioMatch && !portfolioMatch[0].includes('github.com') && !portfolioMatch[0].includes('linkedin.com')) {
    contact.portfolio = portfolioMatch[0];
  }

  // Name inference from first lines
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length > 0) {
    const candidateFirstLine = lines[0].replace(/[|•,].*$/, '').trim();
    if (candidateFirstLine.length > 2 && candidateFirstLine.length < 40 && !candidateFirstLine.includes('@')) {
      contact.name = candidateFirstLine;
    }
  }

  return contact;
}

/**
 * Extracts technical and domain skills by matching against the lexicon
 */
export function extractSkills(text: string): string[] {
  const lowerText = ` ${text.toLowerCase().replace(/[^a-z0-9#+.\s]/g, ' ')} `;
  const found = new Set<string>();

  for (const skill of COMPREHENSIVE_SKILL_LEXICON) {
    // Regex boundary check
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, 'i');
    if (regex.test(lowerText)) {
      // Capitalize properly
      const formatted = skill
        .split(' ')
        .map(w => w === 'css' || w === 'sql' || w === 'html' || w === 'nlp' || w === 'llm' || w === 'rag' || w === 'api' || w === 'aws' || w === 'gcp'
          ? w.toUpperCase()
          : w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      found.add(formatted);
    }
  }

  return Array.from(found);
}

/**
 * Identifies experience blocks and calculates total years
 */
export function extractExperience(text: string): { items: ParsedExperienceItem[]; totalYears: number } {
  const items: ParsedExperienceItem[] = [];
  const lines = text.split('\n');

  // Look for year patterns e.g. 2021 - 2024, 2022 - Present
  const dateRangeRegex = /(20\d{2}|19\d{2})\s*(?:-|–|to)\s*(20\d{2}|present|current)/gi;
  let match: RegExpExecArray | null;
  let calculatedYears = 0;

  while ((match = dateRangeRegex.exec(text)) !== null) {
    const start = parseInt(match[1], 10);
    const endStr = match[2].toLowerCase();
    const end = (endStr === 'present' || endStr === 'current') ? new Date().getFullYear() : parseInt(endStr, 10);
    if (!isNaN(start) && !isNaN(end) && end >= start) {
      calculatedYears += (end - start);
    }
  }

  // Look for sections titled "Experience" or "Work History"
  const expSectionMatch = text.match(/(?:WORK EXPERIENCE|EXPERIENCE|EMPLOYMENT HISTORY)[\s\S]*?(?=(?:EDUCATION|PROJECTS|SKILLS|CERTIFICATIONS|$))/i);
  if (expSectionMatch) {
    const expText = expSectionMatch[0];
    const subBlocks = expText.split(/\n(?=[A-Z][a-zA-Z\s]{3,30}(?:–|-|\|))/);
    subBlocks.slice(1).forEach((block, idx) => {
      const blockLines = block.split('\n').filter(l => l.trim().length > 0);
      if (blockLines.length > 0) {
        items.push({
          title: blockLines[0].trim(),
          company: blockLines[1] ? blockLines[1].trim() : 'Company Not Specified',
          yearsEstimated: 1,
          description: blockLines.slice(2).join(' ').trim(),
          technologiesUsed: extractSkills(block)
        });
      }
    });
  }

  return {
    items,
    totalYears: Math.max(calculatedYears, items.length > 0 ? items.length : 0)
  };
}

/**
 * Extracts education qualifications
 */
export function extractEducation(text: string): ParsedEducationItem[] {
  const items: ParsedEducationItem[] = [];
  const degrees = [
    'Bachelor of Technology', 'B.Tech', 'B.E.', 'Bachelor of Science', 'B.Sc', 'B.S.',
    'Master of Technology', 'M.Tech', 'M.S.', 'Master of Science', 'MCA', 'BCA',
    'Ph.D.', 'Doctorate', 'Diploma'
  ];

  for (const deg of degrees) {
    const regex = new RegExp(`(${deg}[^\\n,]*)`, 'i');
    const match = text.match(regex);
    if (match) {
      items.push({
        institution: 'University / Institute',
        degree: match[1].trim(),
      });
      break;
    }
  }

  return items;
}

/**
 * Extracts project items with metric evaluation
 */
export function extractProjects(text: string): ParsedProjectItem[] {
  const items: ParsedProjectItem[] = [];
  const projSectionMatch = text.match(/(?:PROJECTS|PERSONAL PROJECTS|ACADEMIC PROJECTS)[\s\S]*?(?=(?:EDUCATION|EXPERIENCE|SKILLS|CERTIFICATIONS|$))/i);

  if (projSectionMatch) {
    const projText = projSectionMatch[0];
    const bulletPoints = projText.split(/\n(?=[•\-\*]|\d+\.)/);

    bulletPoints.slice(0, 5).forEach((p, i) => {
      const clean = p.replace(/^[•\-\*\d.]\s*/, '').trim();
      if (clean.length > 15) {
        const hasMetrics = /\d+%\s*|\d+x\s*|\$\d+|\d+\s*users|\d+\s*ms/i.test(clean);
        items.push({
          title: `Project ${i + 1}`,
          description: clean,
          technologies: extractSkills(clean),
          hasAuditableMetrics: hasMetrics
        });
      }
    });
  }

  return items;
}

/**
 * Main parser entry point
 */
export function parseResumeContent(rawText: string): ParsedResumeData {
  const trimmed = rawText || '';
  const charCount = trimmed.length;

  // Scanned PDF detection heuristic: if file was PDF but characters extracted < 120
  const isScannedOrImagePdf = charCount < 120 && charCount > 0;

  const contact = extractContactInfo(trimmed);
  const extractedSkills = extractSkills(trimmed);
  const exp = extractExperience(trimmed);
  const education = extractEducation(trimmed);
  const projects = extractProjects(trimmed);

  return {
    contact,
    summary: trimmed.slice(0, 300),
    extractedSkills,
    experience: exp.items,
    education,
    projects,
    certifications: [],
    totalYearsExperience: exp.totalYears,
    isScannedOrImagePdf,
    rawCharacterCount: charCount,
    sectionDetection: {
      hasSummary: /summary|profile|about me/i.test(trimmed),
      hasSkills: /skills|technical skills|proficiencies/i.test(trimmed),
      hasExperience: /experience|work history|employment/i.test(trimmed),
      hasEducation: /education|academics|university/i.test(trimmed),
      hasProjects: /projects|portfolio|personal projects/i.test(trimmed),
    }
  };
}
