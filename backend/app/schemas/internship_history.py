"""
Pydantic schemas for Internship History
"""
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class InternshipHistoryBase(BaseModel):
    internship_title: str
    company_name: str
    position: Optional[str] = None
    location: Optional[str] = None
    stipend: Optional[int] = None
    internship_type: Optional[str] = None
    start_date: date
    expected_end_date: date
    status: str = "ongoing"
    skills_gained: Optional[str] = None
    work_description: Optional[str] = None


class InternshipHistoryCreate(InternshipHistoryBase):
    student_id: int
    application_id: Optional[str] = None
    internship_id: Optional[str] = None
    company_profile_id: Optional[int] = None


class InternshipHistoryUpdate(BaseModel):
    actual_end_date: Optional[date] = None
    status: Optional[str] = None
    is_currently_active: Optional[bool] = None
    completion_certificate_url: Optional[str] = None
    performance_rating: Optional[int] = None
    feedback: Optional[str] = None
    skills_gained: Optional[str] = None
    work_description: Optional[str] = None


class InternshipHistory(InternshipHistoryBase):
    id: int
    student_id: int
    application_id: Optional[str] = None
    internship_id: Optional[str] = None
    company_profile_id: Optional[int] = None
    actual_end_date: Optional[date] = None
    duration_months: Optional[int] = None
    is_currently_active: bool
    completion_certificate_url: Optional[str] = None
    performance_rating: Optional[int] = None
    feedback: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
    
    # Computed fields
    days_remaining: Optional[int] = None
    days_completed: Optional[int] = None
    total_experience_days: Optional[int] = None

    class Config:
        from_attributes = True


class StudentExperienceSummary(BaseModel):
    """Summary of student's total internship experience through I-Intern"""
    student_id: int
    student_name: str
    total_internships_completed: int
    total_internships_ongoing: int
    total_experience_days: int
    total_experience_months: float
    current_internship: Optional[InternshipHistory] = None
    completed_internships: list[InternshipHistory] = []
    
    class Config:
        from_attributes = True
