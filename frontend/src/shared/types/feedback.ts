// Feedback Form Types and Interfaces

// Company-to-Intern Feedback (Supervisor evaluating intern)
export interface CompanyToInternFeedback {
  id?: string;
  internship_id: string;
  application_id: string;
  company_id: string;
  submitted_by: string; // User ID of supervisor
  
  // Performance Rating (1-5 scale)
  technical_skills: number;
  communication_skills: number;
  teamwork: number;
  reliability: number;
  problem_solving: number;
  professionalism: number;
  
  // Overall Rating
  overall_rating: number;
  
  // Detailed Comments
  strengths: string;
  areas_for_improvement: string;
  would_rehire: boolean;
  general_comments: string;
  
  // Metadata
  submitted_at?: Date;
  updated_at?: Date;
}

// Intern-to-Company Feedback (Intern evaluating company/experience)
export interface InternToCompanyFeedback {
  id?: string;
  internship_id: string;
  application_id: string;
  company_id: string;
  submitted_by: string; // User ID of intern
  
  // Experience Rating (1-5 scale)
  mentorship_quality: number;
  learning_opportunities: number;
  work_environment: number;
  work_culture: number;
  compensation_fairness: number;
  career_growth_potential: number;
  
  // Overall Rating
  overall_rating: number;
  
  // Detailed Comments
  best_aspects: string;
  improvements_needed: string;
  would_recommend: boolean;
  general_comments: string;
  
  // Metadata
  submitted_at?: Date;
  updated_at?: Date;
}

// Form State Management
export interface FeedbackFormState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  submitted: boolean;
}

// Rating Question Interface
export interface RatingQuestion {
  id: string;
  label: string;
  description?: string;
  min: number;
  max: number;
  fieldName: keyof (CompanyToInternFeedback | InternToCompanyFeedback);
}

// Text Question Interface
export interface TextQuestion {
  id: string;
  label: string;
  fieldName: keyof (CompanyToInternFeedback | InternToCompanyFeedback);
  placeholder: string;
  rows: number;
  isRequired: boolean;
}

// Checkbox Question Interface
export interface CheckboxQuestion {
  id: string;
  label: string;
  description?: string;
  fieldName: keyof (CompanyToInternFeedback | InternToCompanyFeedback);
}
