# Resume to Profile Sync Feature

## Overview
This feature automatically extracts data from resumes (built using the resume builder or uploaded as PDF) and syncs it to the user's profile page. This eliminates duplicate data entry and ensures profile information is always up-to-date.

## Features

### 1. Automatic Profile Sync on Resume Generation
When a user builds a resume using the resume builder, the data is automatically synced to their profile upon PDF generation.

**Synced Data:**
- **Personal Info**: Full name, phone number
- **Professional Links**: GitHub URL, LinkedIn URL
- **Education**: University, major/degree, graduation year, CGPA
- **Bio**: Career objective becomes the bio
- **Skills**: Technical skills array
- **Certifications**: All certifications with institution and year

### 2. PDF Resume Upload & Extraction
Users can upload existing PDF resumes to automatically extract information and populate their profile.

**Extracted Data:**
- Email addresses
- Phone numbers (various formats)
- GitHub profile URLs
- LinkedIn profile URLs
- Common technical skills (Python, React, Java, etc.)

### 3. Profile Completeness Tracking
Visual indicator showing percentage of completed profile fields to encourage users to complete their profiles.

**Tracked Fields:**
- User fields (name, email, phone)
- Student profile fields (location, DOB, bio, university, major, graduation year, CGPA, social links, skills, certifications)

## Backend Implementation

### New Endpoints

#### 1. `/api/v1/resume/sync-to-profile` (POST)
Manually sync resume builder data to profile.

**Request Body:**
```json
{
  "personalInfo": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "githubLink": "https://github.com/johndoe",
    "linkedinProfile": "https://linkedin.com/in/johndoe"
  },
  "objective": "Software engineer seeking internship...",
  "education": [{
    "degree": "B.Tech Computer Science",
    "college": "MIT",
    "cgpa": "9.2",
    "startDate": "2020",
    "endDate": "2024"
  }],
  "skills": ["Python", "React", "Node.js"],
  "certifications": [{
    "id": "1",
    "name": "AWS Certified",
    "institution": "Amazon",
    "year": "2023"
  }],
  "projects": [...],
  "experience": [...]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Resume data synced to profile successfully",
  "profile_updated": true
}
```

#### 2. `/api/v1/resume/extract-from-pdf` (POST)
Extract data from uploaded PDF resume.

**Request:** Multipart form data with file upload

**Response:**
```json
{
  "success": true,
  "message": "Extracted data from PDF. Updated fields: github, linkedin, skills",
  "extracted_data": {
    "email": "john@example.com",
    "phone": "+1234567890",
    "github": "https://github.com/johndoe",
    "linkedin": "https://linkedin.com/in/johndoe",
    "skills": ["Python", "JavaScript", "React"]
  },
  "updated_fields": ["github", "linkedin", "skills"],
  "raw_text_preview": "First 500 chars of extracted text..."
}
```

#### 3. `/api/v1/resume/profile-completeness` (GET)
Get profile completeness percentage.

**Response:**
```json
{
  "completeness_percentage": 75,
  "filled_fields": 12,
  "total_fields": 16,
  "missing_fields": 4
}
```

### Modified Endpoints

#### `/api/v1/resume/generate` (POST)
Now automatically syncs resume data to profile before generating PDF.

**Changes:**
- Added authentication (requires logged-in user)
- Automatically calls profile sync logic
- If sync fails, continues with PDF generation (non-blocking)

## Frontend Implementation

### New Services

**File:** `frontend/src/services/resumeSync.ts`

**Functions:**
- `syncResumeToProfile(resumeData)` - Manually sync resume data
- `extractResumeFromPDF(file)` - Upload and extract PDF resume
- `getProfileCompleteness()` - Get profile completion percentage

### Updated Components

#### ProfilePage
**File:** `frontend/src/apps/interns-dashboard/pages/ProfilePage.tsx`

**New Features:**
- Profile completeness progress bar
- PDF resume upload with drag-and-drop zone
- Success/error notifications for uploads
- Link to resume builder
- Auto-refresh completeness after upload

#### BuildResumeApp
**File:** `frontend/src/apps/build-resume/BuildResumeApp.tsx`

**Changes:**
- Imported `syncResumeToProfile` service
- Added comment noting auto-sync happens in backend
- Can optionally call explicit sync for confirmation

## Database Schema

### StudentProfile Model
Updated fields used for syncing:
```python
class StudentProfile(Base):
    __tablename__ = "student_profiles"
    
    # Personal
    date_of_birth = Column(Date)
    location = Column(String)
    bio = Column(Text)
    
    # Education
    university = Column(String)
    major = Column(String)
    graduation_year = Column(String)
    grading_type = Column(String)
    grading_score = Column(String)
    
    # Links
    linkedin_url = Column(String)
    github_url = Column(String)
    portfolio_url = Column(String)
    
    # JSON fields
    skills = Column(JSON)  # Array of strings
    certifications = Column(JSON)  # Array of objects
```

## Usage Flow

### Building Resume → Profile Sync
1. User navigates to `/build-resume`
2. User fills out resume builder steps
3. User clicks "Generate Resume"
4. Backend generates PDF
5. **Backend automatically syncs data to profile**
6. PDF downloads to user's device
7. Profile is updated with resume data

### Uploading PDF → Profile Sync
1. User navigates to `/interns/profile`
2. User clicks upload area or drags PDF file
3. Frontend uploads file to backend
4. Backend extracts text from PDF using PyPDF2
5. Backend parses text for patterns (email, phone, URLs, skills)
6. Backend updates empty profile fields
7. Frontend shows success message with updated fields
8. Completeness percentage updates

## Dependencies

### Backend
```txt
PyPDF2==3.0.1  # PDF text extraction
weasyprint==60.2  # PDF generation
jinja2==3.1.2  # HTML templating
```

### Frontend
No new dependencies required (uses fetch API)

## Security Considerations

1. **Email Verification**: Email from resume is NOT synced to avoid security issues
2. **Authentication Required**: All endpoints require valid JWT token
3. **File Type Validation**: Only PDF files accepted for upload
4. **Non-Destructive Updates**: Only fills empty fields, doesn't overwrite existing data
5. **Error Handling**: Sync failures don't block PDF generation

## Testing

### Backend Tests
```bash
cd backend

# Test profile sync
curl -X POST http://localhost:8000/api/v1/resume/sync-to-profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @sample_resume_data.json

# Test PDF extraction
curl -X POST http://localhost:8000/api/v1/resume/extract-from-pdf \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@sample_resume.pdf"

# Test completeness
curl -X GET http://localhost:8000/api/v1/resume/profile-completeness \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Frontend Tests
1. Build a resume and verify profile updates
2. Upload a PDF resume and check extracted fields
3. Verify completeness percentage updates correctly
4. Test error handling for invalid files

## Future Enhancements

1. **AI-Powered Extraction**: Use GPT/Claude API for better PDF parsing
2. **OCR Support**: Handle scanned/image-based PDFs
3. **Resume Templates**: Save and load multiple resumes
4. **Version History**: Track profile changes over time
5. **Smart Recommendations**: Suggest profile improvements
6. **LinkedIn Import**: Direct LinkedIn profile import
7. **Real-time Sync**: Auto-save resume builder progress to profile
8. **Conflict Resolution**: UI to resolve data conflicts when uploading

## Troubleshooting

### Profile Not Syncing
- Check backend logs for sync errors
- Verify user role is 'student' or 'intern'
- Ensure resume data is valid and complete

### PDF Extraction Failing
- Verify PDF is text-based (not scanned image)
- Check PyPDF2 compatibility with PDF version
- Review extracted text preview in response

### Completeness Not Updating
- Verify profile fields are properly saved to database
- Check JSON field serialization for skills/certifications
- Refresh page or re-login if stale data

## Code Files Modified/Created

### Backend
- ✅ Created: `backend/app/api/v1/endpoints/resume_sync.py`
- ✅ Modified: `backend/app/api/v1/endpoints/resume.py`
- ✅ Modified: `backend/app/api/v1/api.py`
- ✅ Modified: `backend/requirements.txt`

### Frontend
- ✅ Created: `frontend/src/services/resumeSync.ts`
- ✅ Modified: `frontend/src/apps/build-resume/BuildResumeApp.tsx`
- ✅ Modified: `frontend/src/apps/interns-dashboard/pages/ProfilePage.tsx`

### Documentation
- ✅ Created: `RESUME_TO_PROFILE_SYNC.md`

## Installation

### Backend
```bash
cd backend
pip install PyPDF2==3.0.1
# Or install all requirements
pip install -r requirements.txt
```

### Frontend
No installation needed (uses built-in fetch API)

## Environment Variables
No new environment variables required. Uses existing:
- `VITE_API_URL` - API base URL (frontend)
- Database connection settings (backend)

---

**Status**: ✅ Implemented and Ready for Testing
**Version**: 1.0.0
**Last Updated**: October 25, 2025
