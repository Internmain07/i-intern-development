from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_, or_
from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.models.company import EmployerProfile
from app.models.profile import StudentProfile
from app.models.internship import Internship
from app.models.application import Application

router = APIRouter()


def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """Dependency to ensure the current user is an admin"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can access this resource"
        )
    return current_user


@router.get("/dashboard/stats")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get statistics for admin dashboard"""
    
    # Get total counts
    total_users = db.query(User).filter(or_(User.role == "intern", User.role == "student")).count()
    total_companies = db.query(EmployerProfile).count()
    total_internships = db.query(Internship).count()
    total_applications = db.query(Application).count()
    
    # Get counts for last month (for trend calculation)
    last_month = datetime.utcnow() - timedelta(days=30)
    
    # Get active internships
    active_internships = db.query(Internship).filter(
        Internship.status == "active"
    ).count()
    
    # Get verified companies
    verified_companies = db.query(EmployerProfile).filter(
        EmployerProfile.is_verified == True
    ).count()
    
    # Calculate growth trends (simplified - you can enhance this)
    # For now, we'll use placeholder percentages
    user_growth = 12
    company_growth = 8
    internship_growth = 15
    application_growth = 23
    
    return {
        "total_users": total_users,
        "total_companies": total_companies,
        "total_internships": total_internships,
        "total_applications": total_applications,
        "active_internships": active_internships,
        "verified_companies": verified_companies,
        "trends": {
            "users": user_growth,
            "companies": company_growth,
            "internships": internship_growth,
            "applications": application_growth
        }
    }


@router.get("/activities")
async def get_recent_activities(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get recent platform activities"""
    
    activities = []
    
    # Get recent applications
    recent_applications = db.query(Application).order_by(
        desc(Application.application_date)
    ).limit(limit).all()
    
    for app in recent_applications:
        student = db.query(User).filter(User.id == app.student_id).first()
        internship = db.query(Internship).filter(Internship.id == app.internship_id).first()
        
        if student and internship:
            # Get company info from internship's employer profile
            employer_profile = db.query(EmployerProfile).filter(
                EmployerProfile.id == internship.employer_profile_id
            ).first()
            company_name = employer_profile.company_name if employer_profile else "Unknown Company"
            
            # Get student name from full_name or email
            student_name = student.full_name or student.email
            
            activities.append({
                "id": app.id,
                "activity": f"{student_name} applied to {internship.title}",
                "timestamp": app.application_date.isoformat() if app.application_date else datetime.utcnow().isoformat(),
                "type": "application",
                "user_name": student_name,
                "company_name": company_name,
                "internship_title": internship.title
            })
    
    return activities


@router.get("/audit-logs")
async def get_audit_logs(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get audit logs for admin actions"""
    
    # For now, return sample data
    # In production, you would have an AuditLog model
    audit_logs = []
    
    # Get recent company verifications
    recent_companies = db.query(EmployerProfile).filter(
        EmployerProfile.is_verified == True
    ).order_by(desc(EmployerProfile.id)).limit(limit // 2).all()
    
    for company in recent_companies:
        # Get email from related user
        company_email = company.user.email if company.user else "N/A"
        audit_logs.append({
            "id": f"audit_{company.id}_verified",
            "admin_user": "Admin",
            "action": "COMPANY_VERIFIED",
            "targetName": company.company_name or company_email,
            "targetType": "Company",
            "timestamp": datetime.utcnow().isoformat(),
            "details": f"Verified company: {company.company_name or company_email}"
        })
    
    # Get recent internship approvals
    recent_internships = db.query(Internship).filter(
        Internship.status == "active"
    ).order_by(desc(Internship.id)).limit(limit // 2).all()
    
    for internship in recent_internships:
        audit_logs.append({
            "id": f"audit_{internship.id}_approved",
            "admin_user": "Admin",
            "action": "INTERNSHIP_APPROVED",
            "targetName": internship.title,
            "targetType": "Internship",
            "timestamp": datetime.utcnow().isoformat(),
            "details": f"Approved internship: {internship.title}"
        })
    
    return audit_logs[:limit]


@router.get("/users")
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    search: str = None,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get all intern users with filtering"""
    
    # Query users with role 'student' or 'intern' (both are student roles)
    query = db.query(User).filter(or_(User.role == "intern", User.role == "student"))
    
    if search:
        # Join with StudentProfile for searching student-specific fields
        query = query.outerjoin(StudentProfile).filter(
            or_(
                User.full_name.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%"),
                StudentProfile.university.ilike(f"%{search}%")
            )
        )
    
    total = query.count()
    users = query.offset(skip).limit(limit).all()
    
    # Get application counts for each user
    user_data = []
    for user in users:
        # Get student profile if exists
        student_profile = user.student_profile
        
        # Get application counts for each user
        application_count = db.query(Application).filter(
            Application.student_id == user.id
        ).count()
        
        # Determine user status
        if user.is_suspended:
            user_status = "Suspended"
        else:
            user_status = "Active"
        
        # Parse skills - StudentProfile.skills is JSON array
        skills = []
        if student_profile and student_profile.skills:
            if isinstance(student_profile.skills, list):
                skills = student_profile.skills
            elif isinstance(student_profile.skills, str):
                try:
                    import json
                    skills = json.loads(student_profile.skills)
                except:
                    skills = [s.strip() for s in student_profile.skills.split(",") if s.strip()]
        
        user_data.append({
            "id": user.id,
            "name": user.full_name or "N/A",
            "email": user.email,
            "university": student_profile.university if student_profile else "N/A",
            "course": student_profile.major if student_profile else "N/A",
            "year": student_profile.graduation_year if student_profile else "N/A",
            "skills": skills,
            "status": user_status,
            "is_suspended": user.is_suspended,
            "dateJoined": user.created_at.isoformat() if user.created_at else datetime.utcnow().isoformat(),
            "gpa": student_profile.grading_score if student_profile else "N/A",
            "profileCompletion": 85,  # Calculate based on filled fields
            "applications": application_count,
            "avatar": user.avatar_url or ""
        })
    
    return {
        "total": total,
        "users": user_data
    }


@router.get("/companies")
async def get_all_companies(
    skip: int = 0,
    limit: int = 100,
    search: str = None,
    status_filter: str = None,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get all companies with filtering"""
    
    query = db.query(EmployerProfile)
    
    if search:
        query = query.filter(
            or_(
                EmployerProfile.company_name.ilike(f"%{search}%"),
                EmployerProfile.industry.ilike(f"%{search}%")
            )
        )
    
    if status_filter and status_filter != "all":
        if status_filter == "verified":
            query = query.filter(EmployerProfile.is_verified == True)
        elif status_filter == "pending":
            query = query.filter(EmployerProfile.is_verified == False)
        elif status_filter == "suspended":
            # For suspended, check the related user's is_suspended field
            query = query.join(User).filter(User.is_suspended == True)
    
    total = query.count()
    companies = query.offset(skip).limit(limit).all()
    
    # Get internship counts for each company
    company_data = []
    for company in companies:
        active_postings = db.query(Internship).filter(
            and_(
                Internship.employer_profile_id == company.id,
                Internship.status == "active"
            )
        ).count()
        
        # Determine status based on user suspension and verification
        if company.user and company.user.is_suspended:
            status = "suspended"
        elif company.is_verified:
            status = "verified"
        else:
            status = "pending"
        
        company_data.append({
            "id": company.id,
            "name": company.company_name or "N/A",
            "email": company.user.email if company.user else "N/A",
            "industry": company.industry or "N/A",
            "size": "50-100",  # Add this field to EmployerProfile model if needed
            "location": f"{company.city or ''}, {company.state or ''}".strip(", "),
            "website": company.website or "",
            "status": status,
            "dateJoined": company.created_at.isoformat() if company.created_at else datetime.utcnow().isoformat(),
            "activePostings": active_postings,
            "contactPerson": company.contact_person or "N/A",
            "phone": company.contact_number or "N/A"
        })
    
    return {
        "total": total,
        "companies": company_data
    }


@router.get("/internships")
async def get_all_internships(
    skip: int = 0,
    limit: int = 100,
    search: str = None,
    status_filter: str = None,
    type_filter: str = None,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get all internships with filtering"""
    
    query = db.query(Internship)
    
    if search:
        query = query.filter(
            or_(
                Internship.title.ilike(f"%{search}%"),
                Internship.location.ilike(f"%{search}%"),
                Internship.category.ilike(f"%{search}%")
            )
        )
    
    if status_filter and status_filter != "all":
        query = query.filter(Internship.status == status_filter)
    
    if type_filter and type_filter != "all":
        query = query.filter(Internship.type == type_filter)
    
    total = query.count()
    internships = query.offset(skip).limit(limit).all()
    
    # Get company names and application counts
    internship_data = []
    for internship in internships:
        employer_profile = db.query(EmployerProfile).filter(
            EmployerProfile.id == internship.employer_profile_id
        ).first()
        
        application_count = db.query(Application).filter(
            Application.internship_id == internship.id
        ).count()
        
        # Determine internship status
        if internship.is_suspended:
            internship_status = "suspended"
        else:
            internship_status = internship.status or "active"
        
        internship_data.append({
            "id": internship.id,
            "title": internship.title,
            "company": employer_profile.company_name if employer_profile else "Unknown",
            "location": internship.location or "Remote",
            "stipend": internship.stipend or 0,
            "applications": application_count,
            "status": internship_status,
            "is_suspended": internship.is_suspended,
            "datePosted": internship.date_posted.isoformat() if internship.date_posted else datetime.utcnow().isoformat(),
            "deadline": internship.deadline.isoformat() if internship.deadline else None,
            "category": internship.category or "Technology",
            "type": internship.type or "Remote",
            "duration": internship.duration or "3 months",
            "salary": f"₹{internship.stipend:,}" if internship.stipend else "Unpaid",
            "featured": False  # Add this field to Internship model if needed
        })
    
    return {
        "total": total,
        "internships": internship_data
    }


@router.get("/analytics/user-growth")
async def get_user_growth(
    days: int = 30,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get user growth data for charts"""
    
    # Generate date range
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    
    # For now, return sample data
    # In production, you'd query actual user creation dates
    growth_data = []
    for i in range(days):
        date = start_date + timedelta(days=i)
        growth_data.append({
            "date": date.isoformat(),
            "employers": i % 5,  # Sample data
            "interns": i % 10    # Sample data
        })
    
    return growth_data


@router.get("/analytics/weekly-activity")
async def get_weekly_activity(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Get weekly activity data for charts"""
    
    # Generate last 7 days
    activity_data = []
    for i in range(7):
        date = datetime.utcnow() - timedelta(days=6-i)
        
        # Count internships posted on this day
        postings = db.query(Internship).filter(
            func.date(Internship.date_posted) == date.date()
        ).count()
        
        # Count applications on this day
        applications = db.query(Application).filter(
            func.date(Application.application_date) == date.date()
        ).count()
        
        activity_data.append({
            "date": date.isoformat(),
            "postings": postings,
            "applications": applications
        })
    
    return activity_data


@router.patch("/companies/{company_id}/verify")
async def verify_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Verify a company"""
    
    company = db.query(EmployerProfile).filter(EmployerProfile.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    company.is_verified = True
    db.commit()
    db.refresh(company)
    
    return {"message": "Company verified successfully", "company": company}


@router.patch("/companies/{company_id}/suspend")
async def suspend_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Suspend a company - affects employer_profiles table, user table, and all internships"""
    
    company = db.query(EmployerProfile).filter(EmployerProfile.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    try:
        # Suspend in employer_profiles table - not needed, use User table instead
        # company.is_active = False
        
        # Suspend in users table
        user = company.user if hasattr(company, 'user') else None
        if user:
            user.is_suspended = True
        
        # Suspend all internships
        suspended_internships = db.query(Internship).filter(
            Internship.employer_profile_id == company_id
        ).update({"is_suspended": True}, synchronize_session=False)
        
        db.commit()
        db.refresh(company)
        
        return {
            "message": "Company suspended successfully",
            "company": company,
            "details": {
                "user_suspended": user is not None,
                "internships_suspended": suspended_internships
            }
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error suspending company: {str(e)}"
        )


@router.patch("/companies/{company_id}/unsuspend")
async def unsuspend_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Unsuspend a company - restores employer_profiles table, user table, and all internships"""
    
    company = db.query(EmployerProfile).filter(EmployerProfile.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    try:
        # Unsuspend in employer_profiles table - not needed, use User table instead
        # company.is_active = True
        
        # Unsuspend in users table
        user = company.user if hasattr(company, 'user') else None
        if user:
            user.is_suspended = False
        
        # Unsuspend all internships
        unsuspended_internships = db.query(Internship).filter(
            Internship.employer_profile_id == company_id
        ).update({"is_suspended": False}, synchronize_session=False)
        
        db.commit()
        db.refresh(company)
        
        return {
            "message": "Company unsuspended successfully",
            "company": company,
            "details": {
                "user_unsuspended": user is not None,
                "internships_unsuspended": unsuspended_internships
            }
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error unsuspending company: {str(e)}"
        )


@router.delete("/companies/{company_id}")
async def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Delete a company and all associated data with full cascade"""
    
    company = db.query(EmployerProfile).filter(EmployerProfile.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    try:
        # Get all internships for this company
        internships = db.query(Internship).filter(
            Internship.employer_profile_id == company_id
        ).all()
        internship_ids = [i.id for i in internships]
        
        # Delete all applications for these internships
        deleted_apps = 0
        if internship_ids:
            deleted_apps = db.query(Application).filter(
                Application.internship_id.in_(internship_ids)
            ).delete(synchronize_session=False)
        
        # Delete all internships
        deleted_internships = db.query(Internship).filter(
            Internship.employer_profile_id == company_id
        ).delete(synchronize_session=False)
        
        # Delete the user account associated with this company
        user = company.user if hasattr(company, 'user') else None
        if user:
            db.delete(user)
        
        # Delete company profile record
        db.delete(company)
        db.commit()
        
        return {
            "message": "Company deleted successfully",
            "deleted_company_id": company_id,
            "details": {
                "internships_deleted": deleted_internships,
                "applications_deleted": deleted_apps,
                "user_account_deleted": user is not None
            }
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting company: {str(e)}"
        )


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Delete a user and all associated data with full cascade"""
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.role == "admin":
        raise HTTPException(status_code=400, detail="Cannot delete admin users")
    
    try:
        # If intern/student, delete all related data
        if user.role in ["intern", "student"]:
            # Delete all applications - Fixed: use student_id instead of intern_id
            deleted_apps = db.query(Application).filter(
                Application.student_id == user_id
            ).delete(synchronize_session=False)
            
            # Delete work experiences (if WorkExperience model exists)
            try:
                from app.models.profile import WorkExperience
                db.query(WorkExperience).filter(
                    WorkExperience.user_id == user_id
                ).delete(synchronize_session=False)
            except ImportError:
                pass
            
            # Delete projects (if Project model exists)
            try:
                from app.models.profile import Project
                db.query(Project).filter(
                    Project.user_id == user_id
                ).delete(synchronize_session=False)
            except ImportError:
                pass
        
        # If company/employer account, handle company-related data
        elif user.role in ["company", "employer"]:
            # Find the employer profile record
            employer_profile = db.query(EmployerProfile).filter(EmployerProfile.user_id == user_id).first()
            if employer_profile:
                # Delete all internships and their applications
                internships = db.query(Internship).filter(
                    Internship.employer_profile_id == employer_profile.id
                ).all()
                for internship in internships:
                    db.query(Application).filter(
                        Application.internship_id == internship.id
                    ).delete(synchronize_session=False)
                
                # Delete all internships
                db.query(Internship).filter(
                    Internship.employer_profile_id == employer_profile.id
                ).delete(synchronize_session=False)
                
                # Delete employer profile record
                db.delete(employer_profile)
        
        # Finally delete the user from users table
        db.delete(user)
        db.commit()
        
        return {
            "message": "User deleted successfully",
            "deleted_user_id": user_id,
            "details": "All associated data has been removed from the database"
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, 
            detail=f"Error deleting user: {str(e)}"
        )


@router.delete("/internships/{internship_id}")
async def delete_internship(
    internship_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Delete an internship and all associated applications with full cascade"""
    
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    try:
        # Delete all applications for this internship
        deleted_apps = db.query(Application).filter(
            Application.internship_id == internship_id
        ).delete(synchronize_session=False)
        
        # Store internship details for response
        internship_title = internship.title
        company_id = internship.company_id
        
        # Delete internship
        db.delete(internship)
        db.commit()
        
        return {
            "message": "Internship deleted successfully",
            "deleted_internship_id": internship_id,
            "internship_title": internship_title,
            "details": {
                "applications_deleted": deleted_apps
            }
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting internship: {str(e)}"
        )


@router.patch("/internships/{internship_id}/approve")
async def approve_internship(
    internship_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Approve an internship posting"""
    
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    internship.status = "active"
    db.commit()
    db.refresh(internship)
    
    return {"message": "Internship approved successfully", "internship": internship}


@router.patch("/users/{user_id}/suspend")
async def suspend_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Suspend a user account - affects both users table and related data"""
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.role == "admin":
        raise HTTPException(status_code=400, detail="Cannot suspend admin users")
    
    try:
        # Suspend in users table
        user.is_suspended = True
        
        # If company user, also suspend the employer profile and all internships
        if user.role in ["company", "employer"]:
            employer_profile = db.query(EmployerProfile).filter(
                EmployerProfile.user_id == user_id
            ).first()
            if employer_profile:
                # No is_active field in EmployerProfile - suspension is tracked via User.is_suspended
                # Suspend all company's internships
                db.query(Internship).filter(
                    Internship.employer_profile_id == employer_profile.id
                ).update(
                    {"is_suspended": True},
                    synchronize_session=False
                )
        
        db.commit()
        db.refresh(user)
        
        return {
            "message": "User suspended successfully",
            "user_id": user.id,
            "is_suspended": user.is_suspended,
            "role": user.role
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error suspending user: {str(e)}"
        )


@router.patch("/users/{user_id}/unsuspend")
async def unsuspend_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Unsuspend a user account - restores both users table and related data"""
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        # Unsuspend in users table
        user.is_suspended = False
        
        # If company user, also unsuspend the employer profile and all internships
        if user.role in ["company", "employer"]:
            employer_profile = db.query(EmployerProfile).filter(
                EmployerProfile.user_id == user_id
            ).first()
            if employer_profile:
                # No is_active field in EmployerProfile - suspension is tracked via User.is_suspended
                # Optionally unsuspend all company's internships
                db.query(Internship).filter(
                    Internship.employer_profile_id == employer_profile.id
                ).update(
                    {"is_suspended": False},
                    synchronize_session=False
                )
        
        db.commit()
        db.refresh(user)
        
        return {
            "message": "User unsuspended successfully",
            "user_id": user.id,
            "is_suspended": user.is_suspended,
            "role": user.role
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error unsuspending user: {str(e)}"
        )


@router.patch("/internships/{internship_id}/suspend")
async def suspend_internship(
    internship_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Suspend an internship posting"""
    
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    internship.is_suspended = True
    db.commit()
    db.refresh(internship)
    
    return {"message": "Internship suspended successfully", "internship_id": internship.id, "is_suspended": internship.is_suspended}


@router.patch("/internships/{internship_id}/unsuspend")
async def unsuspend_internship(
    internship_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Unsuspend an internship posting"""
    
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    internship.is_suspended = False
    db.commit()
    db.refresh(internship)
    
    return {"message": "Internship unsuspended successfully", "internship_id": internship.id, "is_suspended": internship.is_suspended}


# Enhanced Admin Database Management Endpoints

@router.patch("/users/{user_id}/update")
async def update_user(
    user_id: int,
    updates: Dict[str, Any],
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Direct database update for user fields - Admin has full power"""
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        # Update allowed fields
        for field, value in updates.items():
            if hasattr(user, field) and field not in ['id', 'hashed_password']:
                setattr(user, field, value)
        
        db.commit()
        db.refresh(user)
        
        return {
            "message": "User updated successfully",
            "user_id": user.id,
            "updated_fields": list(updates.keys())
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error updating user: {str(e)}"
        )


@router.patch("/companies/{company_id}/update")
async def update_company(
    company_id: int,
    updates: Dict[str, Any],
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Direct database update for company fields - Admin has full power"""
    
    company = db.query(EmployerProfile).filter(EmployerProfile.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    try:
        # Update allowed fields
        for field, value in updates.items():
            if hasattr(company, field) and field not in ['id']:
                setattr(company, field, value)
        
        db.commit()
        db.refresh(company)
        
        return {
            "message": "Company updated successfully",
            "company_id": company.id,
            "updated_fields": list(updates.keys())
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error updating company: {str(e)}"
        )


@router.patch("/internships/{internship_id}/update")
async def update_internship(
    internship_id: str,
    updates: Dict[str, Any],
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Direct database update for internship fields - Admin has full power"""
    
    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    try:
        # Update allowed fields
        for field, value in updates.items():
            if hasattr(internship, field) and field != 'id':
                setattr(internship, field, value)
        
        db.commit()
        db.refresh(internship)
        
        return {
            "message": "Internship updated successfully",
            "internship_id": internship.id,
            "updated_fields": list(updates.keys())
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error updating internship: {str(e)}"
        )


@router.post("/database/cleanup")
async def cleanup_orphaned_records(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Clean up orphaned records in the database"""
    
    try:
        cleanup_report = {
            "orphaned_applications": 0,
            "orphaned_internships": 0,
            "orphaned_companies": 0
        }
        
        # Find and delete applications with non-existent students
        all_user_ids = [u.id for u in db.query(User.id).all()]
        orphaned_apps = db.query(Application).filter(
            ~Application.student_id.in_(all_user_ids)
        ).delete(synchronize_session=False)
        cleanup_report["orphaned_applications"] = orphaned_apps
        
        # Find and delete internships with non-existent employer profiles
        all_company_ids = [c.id for c in db.query(EmployerProfile.id).all()]
        orphaned_internships = db.query(Internship).filter(
            ~Internship.employer_profile_id.in_(all_company_ids)
        ).delete(synchronize_session=False)
        cleanup_report["orphaned_internships"] = orphaned_internships
        
        db.commit()
        
        return {
            "message": "Database cleanup completed successfully",
            "report": cleanup_report
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error during cleanup: {str(e)}"
        )


@router.get("/database/integrity-check")
async def check_database_integrity(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user)
):
    """Check database integrity and report issues"""
    
    try:
        issues = []
        
        # Check for users without email verification
        unverified_users = db.query(User).filter(
            User.email_verified == "false"
        ).count()
        
        # Check for suspended users count
        suspended_users = db.query(User).filter(
            User.is_suspended == True
        ).count()
        
        # Check for employer profiles without user accounts
        employer_profiles = db.query(EmployerProfile).all()
        companies_without_users = 0
        for employer_profile in employer_profiles:
            if not employer_profile.user:
                companies_without_users += 1
                issues.append({
                    "type": "missing_user_account",
                    "company_id": employer_profile.id,
                    "company_name": employer_profile.company_name
                })
        
        # Check for applications referencing deleted internships
        all_internship_ids = [i.id for i in db.query(Internship.id).all()]
        orphaned_applications = db.query(Application).filter(
            ~Application.internship_id.in_(all_internship_ids) if all_internship_ids else True
        ).count()
        
        report = {
            "total_users": db.query(User).count(),
            "total_companies": db.query(EmployerProfile).count(),
            "total_internships": db.query(Internship).count(),
            "total_applications": db.query(Application).count(),
            "unverified_users": unverified_users,
            "suspended_users": suspended_users,
            "companies_without_users": companies_without_users,
            "orphaned_applications": orphaned_applications,
            "issues": issues,
            "health_status": "healthy" if len(issues) == 0 else "needs_attention"
        }
        
        return report
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error checking database integrity: {str(e)}"
        )


