import { ResumeData } from '@/shared/types/resume';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface SyncResponse {
  success: boolean;
  message: string;
  profile_updated: boolean;
}

export interface ExtractResponse {
  success: boolean;
  message: string;
  extracted_data: {
    email: string | null;
    phone: string | null;
    github: string | null;
    linkedin: string | null;
    skills: string[];
  };
  updated_fields: string[];
  raw_text_preview: string;
}

export interface CompletenessResponse {
  completeness_percentage: number;
  filled_fields: number;
  total_fields: number;
  missing_fields: number;
}

/**
 * Sync resume builder data to user profile
 */
export const syncResumeToProfile = async (resumeData: ResumeData): Promise<SyncResponse> => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/api/v1/resume/sync-to-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
      body: JSON.stringify(resumeData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to sync resume data to profile');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error syncing resume to profile:', error);
    throw new Error(error.message || 'Failed to sync resume data to profile');
  }
};

/**
 * Extract data from uploaded PDF resume and populate profile
 */
export const extractResumeFromPDF = async (file: File): Promise<ExtractResponse> => {
  try {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/api/v1/resume/extract-from-pdf`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to extract resume data from PDF');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error extracting resume from PDF:', error);
    throw new Error(error.message || 'Failed to extract resume data from PDF');
  }
};

/**
 * Get profile completeness percentage
 */
export const getProfileCompleteness = async (): Promise<CompletenessResponse> => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/api/v1/resume/profile-completeness`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get profile completeness');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error getting profile completeness:', error);
    throw new Error(error.message || 'Failed to get profile completeness');
  }
};
