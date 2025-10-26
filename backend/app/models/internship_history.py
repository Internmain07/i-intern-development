"""
Internship History Model - Tracks student internship experiences through I-Intern
"""
from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime


class InternshipHistory(Base):
    """
    Tracks completed and ongoing internships for students.
    Created when a student accepts an offer and updated when internship is completed.
    """
    __tablename__ = "internship_history"

    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Keys
    student_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    application_id = Column(String, ForeignKey("applications.id", ondelete="SET NULL"), nullable=True, index=True)
    internship_id = Column(String, ForeignKey("internships.id", ondelete="SET NULL"), nullable=True, index=True)
    company_profile_id = Column(Integer, ForeignKey("employer_profiles.id", ondelete="SET NULL"), nullable=True)
    
    # Internship Details (Snapshot at time of acceptance)
    internship_title = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    position = Column(String, nullable=True)
    location = Column(String, nullable=True)
    stipend = Column(Integer, nullable=True)
    internship_type = Column(String, nullable=True)  # Remote, Hybrid, In-office
    
    # Duration Tracking
    start_date = Column(Date, nullable=False)  # When internship actually started
    expected_end_date = Column(Date, nullable=False)  # Expected completion date
    actual_end_date = Column(Date, nullable=True)  # Actual completion date
    duration_months = Column(Integer, nullable=True)  # Duration in months
    
    # Status Tracking
    status = Column(String, nullable=False, default="ongoing")  # ongoing, completed, terminated
    is_currently_active = Column(Boolean, default=True, index=True)  # Quick lookup for active internships
    
    # Completion Details
    completion_certificate_url = Column(String, nullable=True)  # URL to certificate if uploaded
    performance_rating = Column(Integer, nullable=True)  # 1-5 rating from company (optional)
    feedback = Column(Text, nullable=True)  # Company feedback
    
    # Skills & Experience
    skills_gained = Column(Text, nullable=True)  # Comma-separated skills learned
    work_description = Column(Text, nullable=True)  # Brief description of work done
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)  # When marked as completed
    
    # Relationships
    student = relationship("User", back_populates="internship_history")
    application = relationship("Application")
    internship = relationship("Internship")
    
    def __repr__(self):
        return f"<InternshipHistory(id={self.id}, student_id={self.student_id}, title={self.internship_title}, status={self.status})>"
    
    @property
    def days_remaining(self):
        """Calculate days remaining until expected end date"""
        if self.status != "ongoing" or not self.expected_end_date:
            return 0
        from datetime import date
        today = date.today()
        if self.expected_end_date > today:
            return (self.expected_end_date - today).days
        return 0
    
    @property
    def days_completed(self):
        """Calculate days completed since start"""
        from datetime import date
        if not self.start_date:
            return 0
        today = date.today()
        end_date = self.actual_end_date if self.actual_end_date else today
        return (end_date - self.start_date).days
    
    @property
    def total_experience_days(self):
        """Total days of experience from this internship"""
        if not self.start_date:
            return 0
        end_date = self.actual_end_date if self.actual_end_date else self.expected_end_date
        if end_date:
            return (end_date - self.start_date).days
        return 0
