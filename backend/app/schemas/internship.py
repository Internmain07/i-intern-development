from pydantic import BaseModel
from typing import Optional
from datetime import date
from pydantic import validator

class InternshipBase(BaseModel):
    title: str
    description: str
    location: Optional[str] = None
    stipend: Optional[int] = None
    duration: Optional[str] = None
    type: Optional[str] = None
    level: Optional[str] = None
    category: Optional[str] = None
    skills: Optional[str] = None  # Comma-separated
    requirements: Optional[str] = None
    benefits: Optional[str] = None
    required_skills: Optional[str] = None  # Legacy field
    deadline: Optional[date] = None
    date_posted: Optional[date] = None
    status: Optional[str] = None
    about_company: Optional[str] = None

class InternshipCreate(InternshipBase):
    pass

    @validator('about_company')
    def about_company_max_length(cls, v):
        if v and len(v) > 1000:
            raise ValueError('about_company must be 1000 characters or fewer')
        return v

class InternshipUpdate(InternshipBase):
    pass

class InternshipPartialUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    stipend: Optional[int] = None
    duration: Optional[str] = None
    type: Optional[str] = None
    level: Optional[str] = None
    category: Optional[str] = None
    skills: Optional[str] = None
    requirements: Optional[str] = None
    benefits: Optional[str] = None
    required_skills: Optional[str] = None
    deadline: Optional[date] = None
    date_posted: Optional[date] = None
    status: Optional[str] = None

class Internship(InternshipBase):
    id: str  # UUID as string
    company_id: str  # UUID as string
    company_name: Optional[str] = None  # Company name for display
    applicant_count: Optional[int] = 0  # Number of applications for this internship

    class Config:
        from_attributes = True