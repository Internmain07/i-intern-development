"""
Internship History Endpoints
- Track student internship experiences
- Prevent multiple concurrent internships
- View history and current status
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import date, datetime, timedelta
from app.api import deps
from app.models.user import User
from app.models.application import Application
from app.models.internship import Internship
from app.models.internship_history import InternshipHistory
from app.models.company import EmployerProfile
from app.schemas.internship_history import (
    InternshipHistory as InternshipHistorySchema,
    InternshipHistoryCreate,
    InternshipHistoryUpdate,
    StudentExperienceSummary
)

router = APIRouter()


def check_active_internship(db: Session, student_id: int) -> Optional[InternshipHistory]:
    """Check if student has an active (ongoing) internship"""
    active_internship = db.query(InternshipHistory).filter(
        InternshipHistory.student_id == student_id,
        InternshipHistory.is_currently_active == True,
        InternshipHistory.status == "ongoing"
    ).first()
    return active_internship


def create_history_from_application(db: Session, application: Application, start_date: date, expected_end_date: date):
    """Create internship history entry when student accepts an offer"""
    # Get internship and company details
    internship = db.query(Internship).filter(Internship.id == application.internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    company = db.query(EmployerProfile).filter(EmployerProfile.id == internship.employer_profile_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Calculate duration in months
    duration_months = round((expected_end_date - start_date).days / 30)
    
    # Create history entry
    history = InternshipHistory(
        student_id=application.student_id,
        application_id=application.id,
        internship_id=internship.id,
        company_profile_id=company.id,
        internship_title=internship.title,
        company_name=company.company_name,
        position=internship.title,
        location=internship.location,
        stipend=internship.stipend,
        internship_type=internship.type,
        start_date=start_date,
        expected_end_date=expected_end_date,
        duration_months=duration_months,
        status="ongoing",
        is_currently_active=True
    )
    
    db.add(history)
    
    # Update application to mark it as currently active
    application.is_currently_active = True
    application.internship_start_date = datetime.combine(start_date, datetime.min.time())
    application.internship_end_date = datetime.combine(expected_end_date, datetime.min.time())
    
    db.commit()
    db.refresh(history)
    
    return history


@router.post("/start-internship/{application_id}")
def start_internship(
    application_id: str,
    start_date: date,
    expected_end_date: date,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_intern),
):
    """
    Mark that a student is starting their internship.
    This creates a history entry and prevents accepting other offers.
    Can only be called by the student or by admin/company.
    """
    # Get the application
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Verify student owns this application
    if application.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Check if student already has an active internship
    active_internship = check_active_internship(db, current_user.id)
    if active_internship:
        raise HTTPException(
            status_code=400,
            detail=f"You already have an active internship: {active_internship.internship_title} at {active_internship.company_name}"
        )
    
    # Verify application is accepted
    if application.status.lower() not in ['accepted', 'hired']:
        raise HTTPException(status_code=400, detail="Application must be accepted before starting internship")
    
    # Validate dates
    if start_date > expected_end_date:
        raise HTTPException(status_code=400, detail="Start date must be before end date")
    
    if start_date < date.today():
        raise HTTPException(status_code=400, detail="Start date cannot be in the past")
    
    # Create history entry
    history = create_history_from_application(db, application, start_date, expected_end_date)
    
    return {
        "message": "Internship started successfully",
        "history": history,
        "days_remaining": history.days_remaining
    }


@router.patch("/complete-internship/{history_id}")
def complete_internship(
    history_id: int,
    completion_data: InternshipHistoryUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_intern),
):
    """Mark an internship as completed"""
    history = db.query(InternshipHistory).filter(InternshipHistory.id == history_id).first()
    if not history:
        raise HTTPException(status_code=404, detail="Internship history not found")
    
    # Verify student owns this history
    if history.student_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Update history
    if completion_data.actual_end_date:
        history.actual_end_date = completion_data.actual_end_date
    else:
        history.actual_end_date = date.today()
    
    history.status = "completed"
    history.is_currently_active = False
    history.completed_at = datetime.utcnow()
    
    if completion_data.completion_certificate_url:
        history.completion_certificate_url = completion_data.completion_certificate_url
    if completion_data.performance_rating:
        history.performance_rating = completion_data.performance_rating
    if completion_data.feedback:
        history.feedback = completion_data.feedback
    if completion_data.skills_gained:
        history.skills_gained = completion_data.skills_gained
    if completion_data.work_description:
        history.work_description = completion_data.work_description
    
    # Update application
    if history.application_id:
        application = db.query(Application).filter(Application.id == history.application_id).first()
        if application:
            application.is_currently_active = False
            application.internship_completed_date = datetime.utcnow()
    
    db.commit()
    db.refresh(history)
    
    return {
        "message": "Internship completed successfully",
        "history": history
    }


@router.get("/my-current-internship")
def get_current_internship(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_intern),
):
    """Get student's current active internship"""
    active_internship = check_active_internship(db, current_user.id)
    
    if not active_internship:
        return {
            "has_active_internship": False,
            "current_internship": None
        }
    
    return {
        "has_active_internship": True,
        "current_internship": {
            "id": active_internship.id,
            "title": active_internship.internship_title,
            "company": active_internship.company_name,
            "position": active_internship.position,
            "location": active_internship.location,
            "stipend": active_internship.stipend,
            "type": active_internship.internship_type,
            "start_date": active_internship.start_date.isoformat(),
            "expected_end_date": active_internship.expected_end_date.isoformat(),
            "duration_months": active_internship.duration_months,
            "days_remaining": active_internship.days_remaining,
            "days_completed": active_internship.days_completed,
            "status": active_internship.status,
            "application_id": active_internship.application_id,
            "internship_id": active_internship.internship_id
        }
    }


@router.get("/my-history")
def get_my_internship_history(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_intern),
):
    """Get student's complete internship history"""
    histories = db.query(InternshipHistory).filter(
        InternshipHistory.student_id == current_user.id
    ).order_by(InternshipHistory.start_date.desc()).all()
    
    history_list = []
    for history in histories:
        history_list.append({
            "id": history.id,
            "title": history.internship_title,
            "company": history.company_name,
            "position": history.position,
            "location": history.location,
            "stipend": history.stipend,
            "type": history.internship_type,
            "start_date": history.start_date.isoformat(),
            "expected_end_date": history.expected_end_date.isoformat(),
            "actual_end_date": history.actual_end_date.isoformat() if history.actual_end_date else None,
            "duration_months": history.duration_months,
            "status": history.status,
            "is_currently_active": history.is_currently_active,
            "skills_gained": history.skills_gained,
            "work_description": history.work_description,
            "performance_rating": history.performance_rating,
            "feedback": history.feedback,
            "days_completed": history.days_completed,
            "days_remaining": history.days_remaining if history.is_currently_active else 0,
            "total_experience_days": history.total_experience_days,
            "completed_at": history.completed_at.isoformat() if history.completed_at else None
        })
    
    return history_list


@router.get("/my-experience-summary")
def get_experience_summary(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_intern),
):
    """Get summary of student's total experience through I-Intern"""
    histories = db.query(InternshipHistory).filter(
        InternshipHistory.student_id == current_user.id
    ).all()
    
    total_completed = sum(1 for h in histories if h.status == "completed")
    total_ongoing = sum(1 for h in histories if h.status == "ongoing")
    total_experience_days = sum(h.total_experience_days for h in histories if h.status == "completed")
    total_experience_months = round(total_experience_days / 30, 1)
    
    current_internship = next((h for h in histories if h.is_currently_active), None)
    completed_internships = [h for h in histories if h.status == "completed"]
    
    return {
        "student_id": current_user.id,
        "student_name": current_user.full_name or current_user.email.split('@')[0],
        "total_internships_completed": total_completed,
        "total_internships_ongoing": total_ongoing,
        "total_experience_days": total_experience_days,
        "total_experience_months": total_experience_months,
        "has_active_internship": current_internship is not None,
        "current_internship": {
            "id": current_internship.id,
            "title": current_internship.internship_title,
            "company": current_internship.company_name,
            "days_remaining": current_internship.days_remaining,
            "start_date": current_internship.start_date.isoformat(),
            "expected_end_date": current_internship.expected_end_date.isoformat()
        } if current_internship else None,
        "completed_internships": [
            {
                "id": h.id,
                "title": h.internship_title,
                "company": h.company_name,
                "duration_months": h.duration_months,
                "start_date": h.start_date.isoformat(),
                "end_date": h.actual_end_date.isoformat() if h.actual_end_date else h.expected_end_date.isoformat(),
                "skills_gained": h.skills_gained
            }
            for h in sorted(completed_internships, key=lambda x: x.start_date, reverse=True)
        ]
    }


@router.get("/student/{student_id}/experience")
def get_student_experience(
    student_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_company),
):
    """
    Get a student's internship experience summary.
    Visible to companies when viewing applicant profiles.
    """
    # Verify student exists
    student = db.query(User).filter(User.id == student_id, User.role == "student").first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    histories = db.query(InternshipHistory).filter(
        InternshipHistory.student_id == student_id
    ).all()
    
    total_completed = sum(1 for h in histories if h.status == "completed")
    total_ongoing = sum(1 for h in histories if h.status == "ongoing")
    total_experience_days = sum(h.total_experience_days for h in histories if h.status == "completed")
    total_experience_months = round(total_experience_days / 30, 1)
    
    current_internship = next((h for h in histories if h.is_currently_active), None)
    
    return {
        "student_id": student.id,
        "student_name": student.full_name or student.email.split('@')[0],
        "total_internships_completed": total_completed,
        "total_internships_ongoing": total_ongoing,
        "total_experience_days": total_experience_days,
        "total_experience_months": total_experience_months,
        "has_active_internship": current_internship is not None,
        "current_internship_badge": {
            "status": "HIRED",
            "title": current_internship.internship_title,
            "company": current_internship.company_name,
            "days_remaining": current_internship.days_remaining
        } if current_internship else None,
        "completed_internships_count": total_completed,
        "total_internships": len(histories)
    }


@router.post("/check-can-accept-offer")
def check_can_accept_offer(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_intern),
):
    """
    Check if student can accept a new internship offer.
    Returns error if student already has an active internship.
    """
    active_internship = check_active_internship(db, current_user.id)
    
    if active_internship:
        return {
            "can_accept": False,
            "reason": f"You currently have an active internship: {active_internship.internship_title} at {active_internship.company_name}",
            "active_internship": {
                "id": active_internship.id,
                "title": active_internship.internship_title,
                "company": active_internship.company_name,
                "days_remaining": active_internship.days_remaining,
                "expected_end_date": active_internship.expected_end_date.isoformat()
            }
        }
    
    return {
        "can_accept": True,
        "reason": "You can accept new internship offers"
    }
