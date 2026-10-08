/**
 * LEARN-2-HIRE 2.0: ATS COMPATIBILITY ENGINE
 * Transparent, multi-dimensional compatibility scorer calculated directly
 * against parsed job descriptions. Never claims fake proprietary employer scores.
 * Uses configurable weights (30/10/15/10/10/10/5/5/5).
 */

import {
  ParsedResumeData,
  JobDescriptionSpec,
  ATSAnalysisResult,
  ATSDimensionScore,
  ResumeImprovementItem,
} from './resume-types';
import { evaluateEligibility } from './eligibility-engine';

export const SCORING_MODEL_VERSION = 'ATS-L2H-2026.1';

/**
 * Parses a raw job description string into structured requirements
 */
export function parseJobDescription(text: string): JobDescriptionSpec {
  const trimmed = text || '';
  const lines = trimmed.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

  // Title & company heuristic
  let title = 'Software Engineer';
  let company = 'Target Employer';

  if (lines.length > 0) {
    const firstLine = lines[0];
    if (firstLine.includes(' at ')) {
      const parts = firstLine.split(' at ');
      title = parts[0].trim();
      company = parts[1].trim();
    } else {
      title = firstLine.slice(0, 50);
    }
  }

  // Experience extraction e.g. "2+ years", "3-5 years"
  let experienceYearsRequired = 0;
  const expMatch = trimmed.match(/(\d+)(?:\+|\s*-\s*\d+)?\s*(?:years|yrs)/i);
  if (expMatch) {
    experienceYearsRequired = parseInt(expMatch[1], 10) || 0;
  }

  // Skills extraction via common tech tokens
  const lower = ` ${trimmed.toLowerCase()} `;
  const coreSkills = [
    'react', 'next.js', 'vue', 'angular', 'javascript', 'typescript', 'node.js', 'python',
    'sql', 'postgresql', 'mongodb', 'docker', 'kubernetes', 'aws', 'git', 'ci/cd',
    'rest api', 'graphql', 'html', 'css', 'tailwind css', 'playwright', 'jest',
    'machine learning', 'pandas', 'numpy', 'figma', 'seo', 'sourcing'
  ];

  const matched = coreSkills.filter((s) => lower.includes(` ${s} `) || lower.includes(` ${s},`) || lower.includes(` ${s}.`));

  // Partition into required vs preferred:
  // If text mentions "preferred" or "nice to have" or "bonus", skills appearing after that are preferred
  const preferredSectionMatch = trimmed.match(/(?:preferred|nice to have|plus|bonus)[\s\S]*/i);
  const preferredText = preferredSectionMatch ? preferredSectionMatch[0].toLowerCase() : '';

  const requiredSkills: string[] = [];
  const preferredSkills: string[] = [];

  matched.forEach((s) => {
    const formatted = s
      .split(' ')
      .map((w) => (w === 'css' || w === 'sql' || w === 'html' || w === 'api' || w === 'aws' ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
      .join(' ');

    if (preferredText.includes(s) && !trimmed.slice(0, 300).toLowerCase().includes(s)) {
      preferredSkills.push(formatted);
    } else {
      requiredSkills.push(formatted);
    }
  });

  // Guarantee at least some required skills for evaluation
  if (requiredSkills.length === 0 && preferredSkills.length > 0) {
    requiredSkills.push(...preferredSkills.splice(0, preferredSkills.length));
  }

  return {
    title,
    company,
    location: /remote/i.test(trimmed) ? 'Remote' : 'On-Site / Hybrid',
    experienceYearsRequired,
    requiredSkills,
    preferredSkills,
    responsibilities: [],
    technologies: matched,
    educationRequirement: /bachelor|b\.tech|degree|master/i.test(trimmed) ? 'Bachelor in Computer Science or equivalent' : undefined,
    isRemote: /remote/i.test(trimmed),
    rawText: trimmed,
  };
}

/**
 * Calculates ATS analysis across 9 dimensions
 */
export function calculateATSAnalysis(
  resumeVersionId: string,
  resume: ParsedResumeData,
  job: JobDescriptionSpec,
  activeRoleSlug?: string
): ATSAnalysisResult {
  const candidateSkillsLower = new Set(resume.extractedSkills.map((s) => s.toLowerCase()));

  // 1. Required Skills (Weight: 30%)
  const matchedRequired: string[] = [];
  const missingRequired: string[] = [];

  job.requiredSkills.forEach((req) => {
    if (candidateSkillsLower.has(req.toLowerCase())) {
      matchedRequired.push(req);
    } else {
      missingRequired.push(req);
    }
  });

  const reqScore =
    job.requiredSkills.length > 0
      ? Math.round((matchedRequired.length / job.requiredSkills.length) * 100)
      : 100;

  const reqDim: ATSDimensionScore = {
    dimension: 'Required Skills Match',
    weightPercent: 30,
    score: reqScore,
    weightedContribution: Math.round((reqScore * 30) / 100),
    evidence: `${matchedRequired.length} of ${job.requiredSkills.length} required skills matched`,
  };

  // 2. Preferred Skills (Weight: 10%)
  const matchedPreferred: string[] = [];
  const missingPreferred: string[] = [];

  job.preferredSkills.forEach((pref) => {
    if (candidateSkillsLower.has(pref.toLowerCase())) {
      matchedPreferred.push(pref);
    } else {
      missingPreferred.push(pref);
    }
  });

  const prefScore =
    job.preferredSkills.length > 0
      ? Math.round((matchedPreferred.length / job.preferredSkills.length) * 100)
      : 80;

  const prefDim: ATSDimensionScore = {
    dimension: 'Preferred Skills Match',
    weightPercent: 10,
    score: prefScore,
    weightedContribution: Math.round((prefScore * 10) / 100),
    evidence: `${matchedPreferred.length} of ${job.preferredSkills.length} preferred skills matched`,
  };

  // 3. Experience Alignment (Weight: 15%)
  let expScore = 100;
  if (job.experienceYearsRequired > 0) {
    expScore = Math.min(
      100,
      Math.round((resume.totalYearsExperience / job.experienceYearsRequired) * 100)
    );
  } else {
    expScore = resume.totalYearsExperience > 0 ? 100 : 85;
  }

  const expDim: ATSDimensionScore = {
    dimension: 'Experience Alignment',
    weightPercent: 15,
    score: expScore,
    weightedContribution: Math.round((expScore * 15) / 100),
    evidence: `${resume.totalYearsExperience} yrs demonstrated vs ${job.experienceYearsRequired} yrs requested`,
  };

  // 4. Role Alignment (Weight: 10%)
  const titleWords = job.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const summaryLower = (resume.summary || '').toLowerCase();
  const titleMatches = titleWords.filter((w) => summaryLower.includes(w)).length;
  const roleScore = titleWords.length > 0 ? Math.min(100, Math.round((titleMatches / titleWords.length) * 100) + 40) : 75;

  const roleDim: ATSDimensionScore = {
    dimension: 'Role Alignment',
    weightPercent: 10,
    score: roleScore,
    weightedContribution: Math.round((roleScore * 10) / 100),
    evidence: `Target title alignment in summary and headers`,
  };

  // 5. Responsibility Alignment (Weight: 10%)
  const respScore = resume.experience.length > 0 ? 85 : resume.projects.length > 0 ? 70 : 40;
  const respDim: ATSDimensionScore = {
    dimension: 'Responsibility Context',
    weightPercent: 10,
    score: respScore,
    weightedContribution: Math.round((respScore * 10) / 100),
    evidence: `${resume.experience.length} work items, ${resume.projects.length} project items parsed`,
  };

  // 6. Technical Stack Alignment (Weight: 10%)
  const stackScore = Math.round((reqScore * 0.7 + prefScore * 0.3));
  const stackDim: ATSDimensionScore = {
    dimension: 'Technical Stack Depth',
    weightPercent: 10,
    score: stackScore,
    weightedContribution: Math.round((stackScore * 10) / 100),
    evidence: `${resume.extractedSkills.length} total technical competencies parsed`,
  };

  // 7. Project Evidence (Weight: 5%)
  const metricProjects = resume.projects.filter((p) => p.hasAuditableMetrics).length;
  const projScore = resume.projects.length >= 2 ? (metricProjects > 0 ? 100 : 80) : resume.projects.length === 1 ? 60 : 30;
  const projDim: ATSDimensionScore = {
    dimension: 'Project Evidence & Metrics',
    weightPercent: 5,
    score: projScore,
    weightedContribution: Math.round((projScore * 5) / 100),
    evidence: `${resume.projects.length} projects parsed, ${metricProjects} with quantified metrics`,
  };

  // 8. Parseability (Weight: 5%)
  let parseScore = 100;
  if (resume.isScannedOrImagePdf) parseScore = 15;
  else if (!resume.sectionDetection.hasSkills) parseScore -= 20;
  else if (!resume.sectionDetection.hasExperience && !resume.sectionDetection.hasProjects) parseScore -= 20;

  const parseDim: ATSDimensionScore = {
    dimension: 'Parseability & Standard Structure',
    weightPercent: 5,
    score: parseScore,
    weightedContribution: Math.round((parseScore * 5) / 100),
    evidence: resume.isScannedOrImagePdf
      ? 'Low character extraction: Image-only or scanned document detected'
      : 'Standard single-column structure parsed cleanly',
  };

  // 9. Education & Certification (Weight: 5%)
  const eduScore = resume.education.length > 0 ? 95 : 50;
  const eduDim: ATSDimensionScore = {
    dimension: 'Education & Credentials',
    weightPercent: 5,
    score: eduScore,
    weightedContribution: Math.round((eduScore * 5) / 100),
    evidence: `${resume.education.length} degree credentials detected`,
  };

  // Total Compatibility Score
  const compatibilityScore = Math.min(
    100,
    Math.round(
      reqDim.weightedContribution +
      prefDim.weightedContribution +
      expDim.weightedContribution +
      roleDim.weightedContribution +
      respDim.weightedContribution +
      stackDim.weightedContribution +
      projDim.weightedContribution +
      parseDim.weightedContribution +
      eduDim.weightedContribution
    )
  );

  // Eligibility Evaluation
  const eligibility = evaluateEligibility(resume, job);

  // Recommendations Generation
  const recommendations: ResumeImprovementItem[] = [];

  if (missingRequired.length > 0) {
    recommendations.push({
      id: 'rec-req-skills',
      priority: 'CRITICAL',
      category: 'REQUIRED_SKILL',
      what: `Incorporate explicit evidence for missing required skills: ${missingRequired.slice(0, 3).join(', ')}`,
      why: 'These are explicit non-negotiable requirements stated in the job posting.',
      how: 'If truthful, detail hands-on usage in project deliverables or work history. Never fabricate claims.',
      impactScoreBoostEstimated: Math.min(15, missingRequired.length * 5),
    });
  }

  if (metricProjects === 0 && resume.projects.length > 0) {
    recommendations.push({
      id: 'rec-quantify',
      priority: 'HIGH',
      category: 'QUANTIFY_METRICS',
      what: 'Quantify real project impact with auditable metrics (%, latency ms, users, test coverage).',
      why: 'ATS semantic filters and engineering hiring managers look for evidence of measurable impact.',
      how: 'E.g., "Reduced bundle size by 24%", "Engineered test suite achieving 92% branch coverage".',
      impactScoreBoostEstimated: 6,
    });
  }

  if (missingPreferred.length > 0) {
    recommendations.push({
      id: 'rec-pref-skills',
      priority: 'MEDIUM',
      category: 'REQUIRED_SKILL',
      what: `Add preferred skills where truthful: ${missingPreferred.slice(0, 2).join(', ')}`,
      why: 'Preferred competencies provide a differentiator against other applicants.',
      how: 'Highlight side-projects or learning coursework where you applied these tools.',
      impactScoreBoostEstimated: 4,
    });
  }

  if (resume.isScannedOrImagePdf) {
    recommendations.push({
      id: 'rec-scanned-pdf',
      priority: 'CRITICAL',
      category: 'STRUCTURE',
      what: 'Upload a text-based PDF or paste plain text instead of an image scan.',
      why: 'Applicant Tracking Systems cannot reliably OCR raster images without text layers.',
      how: 'Export your resume directly from Google Docs, Word, or Markdown into standard PDF.',
      impactScoreBoostEstimated: 25,
    });
  }

  // Strengths and Gaps
  const strengths: string[] = [];
  if (matchedRequired.length > 0) strengths.push(`Demonstrates ${matchedRequired.length} core required competencies (${matchedRequired.slice(0, 4).join(', ')})`);
  if (resume.projects.length >= 2) strengths.push(`Strong project portfolio with ${resume.projects.length} distinct deliverables`);
  if (parseScore >= 90) strengths.push('Clean parseable format with standard section headers');

  const gaps: string[] = [];
  if (missingRequired.length > 0) gaps.push(`Missing ${missingRequired.length} required skills: ${missingRequired.join(', ')}`);
  if (!eligibility.isExperienceSatisfied) gaps.push(eligibility.reason);
  if (missingPreferred.length > 0) gaps.push(`Missing preferred skills: ${missingPreferred.join(', ')}`);

  return {
    id: `analysis-${Date.now()}`,
    resumeVersionId,
    jobTitle: job.title,
    companyName: job.company,
    scoringModelVersion: SCORING_MODEL_VERSION,
    compatibilityScore,
    eligibilityStatus: eligibility.status,
    eligibilityReason: eligibility.reason,
    isFresherModeActive: eligibility.isFresherConsidered,
    dimensions: {
      requiredSkills: reqDim,
      preferredSkills: prefDim,
      experienceAlignment: expDim,
      roleAlignment: roleDim,
      responsibilityAlignment: respDim,
      technicalStack: stackDim,
      projectEvidence: projDim,
      parseability: parseDim,
      educationCertification: eduDim,
    },
    matchedRequiredSkills: matchedRequired,
    missingRequiredSkills: missingRequired,
    matchedPreferredSkills: matchedPreferred,
    missingPreferredSkills: missingPreferred,
    strengths,
    gaps,
    recommendations,
    analyzedAt: new Date().toISOString(),
  };
}
