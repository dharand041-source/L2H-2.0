/**
 * LEARN-2-HIRE 2.0: RESUME VERSION & STORAGE STORE
 * Client & local state manager for multiple resume versions (V1, V2, V3...),
 * analysis history, and duplicate detection. Never overwrites historical versions.
 */

import { ResumeVersion, ATSAnalysisResult, ParsedResumeData } from './resume-types';
import { parseResumeContent, computeNormalizedTextHash } from './resume-parser';

const RESUME_VERSIONS_KEY = 'l2h_resume_versions_v1';
const RESUME_ANALYSES_KEY = 'l2h_resume_analyses_v1';
const ACTIVE_RESUME_ID_KEY = 'l2h_active_resume_id_v1';

export class ResumeStore {
  /**
   * Retrieves all saved resume versions for the user
   */
  public static getVersions(): ResumeVersion[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(RESUME_VERSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Gets the active primary resume version
   */
  public static getActiveVersion(): ResumeVersion | null {
    const versions = this.getVersions();
    if (versions.length === 0) return null;

    if (typeof window !== 'undefined') {
      const activeId = localStorage.getItem(ACTIVE_RESUME_ID_KEY);
      if (activeId) {
        const found = versions.find((v) => v.id === activeId);
        if (found) return found;
      }
    }

    return versions[versions.length - 1]; // Latest uploaded by default
  }

  /**
   * Saves a new resume version without overwriting prior versions
   */
  public static saveVersion(
    title: string,
    rawText: string,
    fileType: 'PDF' | 'DOCX' | 'TXT',
    fileName: string,
    targetCareerSlug: string,
    parsedDataOverride?: ParsedResumeData
  ): { version: ResumeVersion; isDuplicate: boolean } {
    const existing = this.getVersions();
    const checksum = computeNormalizedTextHash(rawText);

    // Duplicate detection
    const duplicate = existing.find((v) => v.checksum === checksum);
    if (duplicate) {
      return { version: duplicate, isDuplicate: true };
    }

    const versionNumber = existing.length + 1;
    const parsedData = parsedDataOverride || parseResumeContent(rawText);

    const newVersion: ResumeVersion = {
      id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: 'usr-current',
      versionNumber,
      title: title || `Resume Version ${versionNumber}`,
      targetCareerSlug,
      fileName,
      fileType,
      fileSize: rawText.length,
      checksum,
      rawText,
      parsedData,
      createdAt: new Date().toISOString(),
    };

    const updated = [...existing, newVersion];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(RESUME_VERSIONS_KEY, JSON.stringify(updated));
        localStorage.setItem(ACTIVE_RESUME_ID_KEY, newVersion.id);
      } catch (err) {
        console.error('Failed to save resume version to localStorage:', err);
      }
    }

    return { version: newVersion, isDuplicate: false };
  }

  /**
   * Sets active resume version
   */
  public static setActiveVersion(versionId: string): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ACTIVE_RESUME_ID_KEY, versionId);
      } catch {}
    }
  }

  /**
   * Retrieves all ATS analysis records
   */
  public static getAnalyses(): ATSAnalysisResult[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(RESUME_ANALYSES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Saves an ATS analysis result
   */
  public static saveAnalysis(result: ATSAnalysisResult): void {
    const existing = this.getAnalyses();
    const updated = [result, ...existing];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(RESUME_ANALYSES_KEY, JSON.stringify(updated));
      } catch {}
    }
  }

  /**
   * Clears all resume versions (for reset / testing)
   */
  public static clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(RESUME_VERSIONS_KEY);
      localStorage.removeItem(RESUME_ANALYSES_KEY);
      localStorage.removeItem(ACTIVE_RESUME_ID_KEY);
    }
  }
}
