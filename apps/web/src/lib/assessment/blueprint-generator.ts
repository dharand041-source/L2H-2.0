/**
 * LEARN-2-HIRE 2.0: DYNAMIC ASSESSMENT BLUEPRINT SYNTHESIZER
 * Dynamically synthesizes balanced diagnostic blueprints for ANY career role.
 */

import { DynamicAssessmentBlueprint, BlueprintSkillRequirement } from './question-types';
import { getCareerBySlug } from '../data/careers-data';

/**
 * Synthesizes a calibrated assessment blueprint for a given career role.
 * Incorporates core technical competencies, practical applied tasks, and role-adapted reasoning.
 */
export function generateAssessmentBlueprint(
  roleSlug: string,
  assessmentType: 'BASELINE' | 'TECHNICAL' | 'APTITUDE' | 'TECHNICAL_SPECIALTY' | 'COMPANY_PATTERN' = 'BASELINE',
  defaultDifficulty: string = 'MEDIUM'
): DynamicAssessmentBlueprint {
  const role = getCareerBySlug(roleSlug);
  const roleTitle = role ? role.title : 'Full-Stack Developer';

  if (assessmentType === 'APTITUDE') {
    return {
      id: `blueprint-apt-${roleSlug}`,
      careerRoleSlug: roleSlug,
      title: `${roleTitle} Cognitive & Aptitude Diagnostic`,
      totalQuestions: 10,
      durationMinutes: 20,
      passingScore: 65,
      distribution: [
        { skillName: 'Quantitative Reasoning', targetDifficulty: 'L2', count: 3, category: 'REASONING' },
        { skillName: 'Logical Reasoning', targetDifficulty: 'L2', count: 3, category: 'REASONING' },
        { skillName: 'Verbal Reasoning', targetDifficulty: 'L2', count: 2, category: 'REASONING' },
        { skillName: 'Analytical Reasoning', targetDifficulty: 'L3', count: 2, category: 'REASONING' },
      ],
    };
  }

  if (assessmentType === 'TECHNICAL' || assessmentType === 'TECHNICAL_SPECIALTY' || assessmentType === 'COMPANY_PATTERN') {
    const required = role?.requiredSkills || [];
    const topSkills = required.slice(0, 3);
    const distribution: BlueprintSkillRequirement[] = topSkills.map((s) => ({
      skillName: s.name,
      targetDifficulty: (s.level || 'L3') as BlueprintSkillRequirement['targetDifficulty'],
      count: 3,
      category: 'CORE',
    }));

    return {
      id: `blueprint-tech-${roleSlug}`,
      careerRoleSlug: roleSlug,
      title: `${roleTitle} Advanced Technical Deep-Dive`,
      totalQuestions: Math.max(distribution.reduce((acc, d) => acc + d.count, 0), 6),
      durationMinutes: 30,
      passingScore: 70,
      distribution,
    };
  }

  // Default: Universal Baseline Diagnostic (Breadth: Fundamentals -> Core -> Applied -> Reasoning)
  const skills = role?.requiredSkills || [];
  const primarySkill = skills[0]?.name || 'Core Fundamentals';
  const secondarySkill = skills[1]?.name || 'Applied Architecture';
  const tertiarySkill = skills[2]?.name || skills[0]?.name || 'Problem Solving';
  const quaternarySkill = skills[3]?.name || skills[1]?.name || 'Specialty Practice';

  const distribution: BlueprintSkillRequirement[] = [
    { skillName: primarySkill, targetDifficulty: 'L1', count: 1, category: 'BREADTH' },
    { skillName: primarySkill, targetDifficulty: 'L2', count: 1, category: 'CORE' },
    { skillName: secondarySkill, targetDifficulty: 'L2', count: 1, category: 'CORE' },
    { skillName: tertiarySkill, targetDifficulty: 'L3', count: 1, category: 'APPLIED' },
    { skillName: quaternarySkill, targetDifficulty: 'L2', count: 1, category: 'APPLIED' },
    { skillName: 'Quantitative Reasoning', targetDifficulty: 'L2', count: 1, category: 'REASONING' },
    { skillName: 'Logical Reasoning', targetDifficulty: 'L2', count: 1, category: 'REASONING' },
  ];

  return {
    id: `blueprint-base-${roleSlug}`,
    careerRoleSlug: roleSlug,
    title: `${roleTitle} Baseline Diagnostic`,
    totalQuestions: distribution.reduce((sum, d) => sum + d.count, 0),
    durationMinutes: 25,
    passingScore: 60,
    distribution,
  };
}
