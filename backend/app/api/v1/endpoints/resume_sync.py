from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, date
import PyPDF2
import io
import re

from app.api import deps
from app.models.user import User
from app.models.profile import StudentProfile
from app.api.v1.endpoints.resume import ResumeData

router = APIRouter()


@router.post("/sync-to-profile")
async def sync_resume_to_profile(
    resume_data: ResumeData,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    Sync resume builder data to user profile.
    Automatically called when generating resume or can be called manually.
    """
    try:
        # Only for students/interns
        if current_user.role not in ['student', 'intern']:
            raise HTTPException(
                status_code=403, 
                detail="Only students can sync resume data to profile"
            )
        
        # Get or create student profile
        student_profile = db.query(StudentProfile).filter(
            StudentProfile.user_id == current_user.id
        ).first()
        
        if not student_profile:
            student_profile = StudentProfile(user_id=current_user.id)
            db.add(student_profile)
        
        # Sync Personal Info
        personal_info = resume_data.personalInfo
        if personal_info.fullName:
            current_user.full_name = personal_info.fullName
        if personal_info.phone:
            current_user.phone = personal_info.phone
        if personal_info.email and personal_info.email != current_user.email:
            # Note: Be careful with email updates, might need verification
            pass  # Skip email update for security
        
        # Sync URLs
        if personal_info.githubLink:
            student_profile.github_url = personal_info.githubLink
        if personal_info.linkedinProfile:
            student_profile.linkedin_url = personal_info.linkedinProfile
        
        # Sync Education (use first entry as primary education)
        if resume_data.education and len(resume_data.education) > 0:
            primary_edu = resume_data.education[0]
            student_profile.university = primary_edu.college
            student_profile.major = primary_edu.degree
            
            # Try to extract graduation year from endDate
            if primary_edu.endDate:
                try:
                    # Handle various date formats
                    if '-' in primary_edu.endDate:
                        year = primary_edu.endDate.split('-')[0]
                    elif '/' in primary_edu.endDate:
                        year = primary_edu.endDate.split('/')[-1]
                    else:
                        year = primary_edu.endDate[:4]
                    student_profile.graduation_year = year
                except:
                    pass
            
            # Sync CGPA
            if primary_edu.cgpa:
                student_profile.grading_type = "CGPA"
                student_profile.grading_score = primary_edu.cgpa
        
        # Sync Objective as Bio
        if resume_data.objective:
            student_profile.bio = resume_data.objective
        
        # Sync Skills
        if resume_data.skills and len(resume_data.skills) > 0:
            # Convert list to JSON array
            student_profile.skills = resume_data.skills
        
        # Sync Certifications
        if resume_data.certifications and len(resume_data.certifications) > 0:
            # Store certifications as JSON array
            cert_list = [
                {
                    "name": cert.name,
                    "institution": cert.institution,
                    "year": cert.year
                }
                for cert in resume_data.certifications
            ]
            student_profile.certifications = cert_list
        
        # Update timestamp
        student_profile.updated_at = datetime.utcnow()
        
        # Commit changes
        db.commit()
        db.refresh(current_user)
        db.refresh(student_profile)
        
        return {
            "success": True,
            "message": "Resume data synced to profile successfully",
            "profile_updated": True
        }
        
    except Exception as e:
        db.rollback()
        print(f"Error syncing resume to profile: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to sync resume data: {str(e)}"
        )


@router.post("/extract-from-pdf")
async def extract_resume_from_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    Extract data from uploaded PDF resume and populate profile.
    Uses basic text extraction - can be enhanced with AI/ML parsing.
    """
    try:
        # Validate file type
        if not file.filename.endswith('.pdf'):
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are supported"
            )
        
        # Read PDF content
        pdf_content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_content))
        
        # Extract text from all pages
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        # Parse extracted text for common patterns
        extracted_data = {
            "email": None,
            "phone": None,
            "github": None,
            "linkedin": None,
            "skills": [],
        }
        
        # Email pattern
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        if emails:
            extracted_data["email"] = emails[0]
        
        # Phone pattern (various formats)
        phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        phones = re.findall(phone_pattern, text)
        if phones:
            extracted_data["phone"] = phones[0] if isinstance(phones[0], str) else ''.join(phones[0])
        
        # GitHub URL pattern
        github_pattern = r'github\.com/[\w-]+'
        github_matches = re.findall(github_pattern, text, re.IGNORECASE)
        if github_matches:
            extracted_data["github"] = f"https://{github_matches[0]}"
        
        # LinkedIn URL pattern
        linkedin_pattern = r'linkedin\.com/in/[\w-]+'
        linkedin_matches = re.findall(linkedin_pattern, text, re.IGNORECASE)
        if linkedin_matches:
            extracted_data["linkedin"] = f"https://{linkedin_matches[0]}"
        
        # Common skill keywords (can be expanded)
        common_skills = [
            'Python', 'Java', 'JavaScript', 'TypeScript', 'C++', 'C#', 'Ruby', 'Go', 'Rust',
            'React', 'Angular', 'Vue', 'Node.js', 'Django', 'Flask', 'FastAPI', 'Spring',
            'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
            'AWS', 'Azure', 'GCP', 'Git', 'Linux', 'Machine Learning', 'AI', 'Data Science',
            'HTML', 'CSS', 'REST API', 'GraphQL', 'Microservices', 'Agile', 'Scrum'
        ]
        
        for skill in common_skills:
            if re.search(r'\b' + re.escape(skill) + r'\b', text, re.IGNORECASE):
                extracted_data["skills"].append(skill)
        
        # Get or create student profile
        student_profile = db.query(StudentProfile).filter(
            StudentProfile.user_id == current_user.id
        ).first()
        
        if not student_profile:
            student_profile = StudentProfile(user_id=current_user.id)
            db.add(student_profile)
        
        # Update profile with extracted data
        updated_fields = []
        
        if extracted_data["phone"] and not current_user.phone:
            current_user.phone = extracted_data["phone"]
            updated_fields.append("phone")
        
        if extracted_data["github"] and not student_profile.github_url:
            student_profile.github_url = extracted_data["github"]
            updated_fields.append("github")
        
        if extracted_data["linkedin"] and not student_profile.linkedin_url:
            student_profile.linkedin_url = extracted_data["linkedin"]
            updated_fields.append("linkedin")
        
        if extracted_data["skills"] and not student_profile.skills:
            student_profile.skills = extracted_data["skills"]
            updated_fields.append("skills")
        
        # Update timestamp
        student_profile.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(current_user)
        db.refresh(student_profile)
        
        return {
            "success": True,
            "message": f"Extracted data from PDF. Updated fields: {', '.join(updated_fields) if updated_fields else 'none (no empty fields found)'}",
            "extracted_data": extracted_data,
            "updated_fields": updated_fields,
            "raw_text_preview": text[:500] + "..." if len(text) > 500 else text
        }
        
    except Exception as e:
        db.rollback()
        print(f"Error extracting resume from PDF: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract resume data: {str(e)}"
        )


@router.get("/profile-completeness")
async def get_profile_completeness(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    Calculate profile completeness percentage based on filled fields.
    """
    try:
        student_profile = db.query(StudentProfile).filter(
            StudentProfile.user_id == current_user.id
        ).first()
        
        total_fields = 0
        filled_fields = 0
        
        # User fields
        user_fields = {
            "Full Name": current_user.full_name,
            "Email": current_user.email,
            "Phone": current_user.phone,
        }
        
        for field, value in user_fields.items():
            total_fields += 1
            if value:
                filled_fields += 1
        
        # Student profile fields
        if student_profile:
            profile_fields = {
                "Location": student_profile.location,
                "Date of Birth": student_profile.date_of_birth,
                "Bio": student_profile.bio,
                "University": student_profile.university,
                "Major": student_profile.major,
                "Graduation Year": student_profile.graduation_year,
                "CGPA/GPA": student_profile.grading_score,
                "LinkedIn": student_profile.linkedin_url,
                "GitHub": student_profile.github_url,
                "Portfolio": student_profile.portfolio_url,
                "Skills": student_profile.skills,
                "Certifications": student_profile.certifications,
            }
            
            for field, value in profile_fields.items():
                total_fields += 1
                if value:
                    if isinstance(value, list):
                        if len(value) > 0:
                            filled_fields += 1
                    else:
                        filled_fields += 1
        else:
            total_fields += 12  # Count all student profile fields as empty
        
        completeness = int((filled_fields / total_fields) * 100)
        
        return {
            "completeness_percentage": completeness,
            "filled_fields": filled_fields,
            "total_fields": total_fields,
            "missing_fields": total_fields - filled_fields
        }
        
    except Exception as e:
        print(f"Error calculating profile completeness: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to calculate profile completeness: {str(e)}"
        )
