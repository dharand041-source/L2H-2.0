/**
 * LEARN-2-HIRE 2.0: PLATFORM SETTINGS STORE
 * Manages verified employer disclosures, career preferences, assessment parameters,
 * and security configurations.
 */

export interface PlatformSettings {
  // Privacy
  allowEmployerSkillReceipts: boolean;
  allowEmployerProjectScorecards: boolean;
  allowEmployerResumeInspection: boolean;
  allowEmployerInterviewReadiness: boolean;

  // Career & Opportunity Matching
  workModePreference: 'REMOTE' | 'HYBRID' | 'ONSITE' | 'ANY';
  preferredLocations: string[];
  employmentTypePreference: 'FULL_TIME' | 'INTERNSHIP' | 'STARTUP' | 'ANY';
  matchThresholdPercent: number; // e.g. 70, 80, 90

  // Assessment & Learning
  antiRepetitionActive: boolean;
  adaptiveDifficultyActive: boolean;
  showAnswerExplanations: boolean;
  dailyLearningGoalMinutes: number; // e.g. 15, 30, 45, 60

  // Interview & Voice
  interviewMode: 'VOICE' | 'TEXT' | 'BOTH';
  interviewLanguage: 'ENGLISH' | 'TAMIL' | 'MIXED';
  voicePrivacyStoreTranscriptOnly: boolean;

  // Notifications
  notifyJobMatches: boolean;
  notifyAssessmentReminders: boolean;
  notifyRoadmapMilestones: boolean;
  notifyApplicationUpdates: boolean;
}

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  allowEmployerSkillReceipts: true,
  allowEmployerProjectScorecards: true,
  allowEmployerResumeInspection: true,
  allowEmployerInterviewReadiness: true,
  workModePreference: 'ANY',
  preferredLocations: ['Chennai', 'Coimbatore', 'Remote (India)'],
  employmentTypePreference: 'ANY',
  matchThresholdPercent: 80,
  antiRepetitionActive: true,
  adaptiveDifficultyActive: true,
  showAnswerExplanations: true,
  dailyLearningGoalMinutes: 30,
  interviewMode: 'BOTH',
  interviewLanguage: 'ENGLISH',
  voicePrivacyStoreTranscriptOnly: true,
  notifyJobMatches: true,
  notifyAssessmentReminders: true,
  notifyRoadmapMilestones: true,
  notifyApplicationUpdates: true,
};

const SETTINGS_STORAGE_KEY = 'l2h_platform_settings_v1';

export class SettingsStore {
  public static getSettings(): PlatformSettings {
    if (typeof window === 'undefined') return DEFAULT_PLATFORM_SETTINGS;
    try {
      const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (data) {
        return { ...DEFAULT_PLATFORM_SETTINGS, ...JSON.parse(data) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PLATFORM_SETTINGS;
  }

  public static saveSettings(settings: Partial<PlatformSettings>): PlatformSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to persist settings:', e);
      }
    }
    return updated;
  }
}
