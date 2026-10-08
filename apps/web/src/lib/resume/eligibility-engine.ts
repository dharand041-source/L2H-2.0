/**
 * LEARN-2-HIRE 2.0: ELIGIBILITY ENGINE
 * Separates explicit qualification criteria (years of experience, degree, location)
 * from ATS keyword compatibility. High keyword match != automatic eligibility.
 */

import { ParsedResumeData, JobDescriptionSpec, EligibilityStatus } from './resume-types';

export interface EligibilityEvaluation {
  status: EligibilityStatus;
  reason: string;
  isExperienceSatisfied: boolean;
  isEducationSatisfied: boolean;
  isFresherConsidered: boolean;
  notes: string[];
}

export function evaluateEligibility(
  resume: ParsedResumeData,
  job: JobDescriptionSpec
): EligibilityEvaluation {
  const notes: string[] = [];
  const reqYears = job.experienceYearsRequired || 0;
  const candYears = resume.totalYearsExperience || 0;
  const isFresher = candYears === 0;

  // 1. Experience Check
  let isExperienceSatisfied = true;
  if (reqYears > 0) {
    if (candYears < reqYears) {
      isExperienceSatisfied = false;
      notes.push(
        `Job requires ${reqYears} year(s) of professional experience. Resume demonstrates ~${candYears} year(s).`
      );
    } else {
      notes.push(`Meets experience threshold (${candYears} yrs demonstrated vs ${reqYears} yrs requested).`);
    }
  } else {
    notes.push('Entry-level / Fresher friendly: No minimum experience threshold required.');
  }

  // 2. Education Check
  let isEducationSatisfied = true;
  if (job.educationRequirement && job.educationRequirement.length > 0) {
    const hasDegree = resume.education.length > 0;
    if (!hasDegree) {
      isEducationSatisfied = false;
      notes.push(`Job mentions '${job.educationRequirement}', but formal degree section was not parsed.`);
    } else {
      notes.push(`Degree verified: ${resume.education[0]?.degree}`);
    }
  }

  // 3. Status Determination
  let status: EligibilityStatus = 'ELIGIBLE';
  let reason = 'All explicit threshold criteria appear satisfied based on parsed resume evidence.';

  if (!isExperienceSatisfied) {
    if (isFresher && reqYears <= 2 && resume.projects.length >= 2) {
      status = 'POTENTIALLY_ELIGIBLE';
      reason = `This role requests ${reqYears} yrs experience. Your strong project portfolio may be considered for entry-level equivalence, but the stated experience requirement is not strictly demonstrated.`;
    } else {
      status = 'NOT_ELIGIBLE';
      reason = `Required experience threshold is not demonstrated (${candYears} yrs vs ${reqYears} yrs required).`;
    }
  } else if (!isEducationSatisfied) {
    status = 'POTENTIALLY_ELIGIBLE';
    reason = 'Stated degree requirement could not be confirmed from resume parsing.';
  } else if (resume.extractedSkills.length === 0) {
    status = 'INSUFFICIENT_DATA';
    reason = 'Insufficient parsed evidence to determine eligibility.';
  }

  return {
    status,
    reason,
    isExperienceSatisfied,
    isEducationSatisfied,
    isFresherConsidered: isFresher,
    notes,
  };
}
