# Internship History & Experience Tracking System

## Overview
This feature tracks student internship experiences through I-Intern, preventing students from accepting multiple concurrent internships and displaying experience badges to companies.

## Key Features

### 1. **Concurrent Internship Prevention**
- Students with an active internship **cannot accept new offers** until completing their current internship
- System checks for active internships when student responds to offers
- Clear error messages guide students

### 2. **Internship History Tracking**
- Tracks all accepted internships (ongoing and completed)
- Records start date, end date, duration, company, and position
- Stores performance ratings, feedback, and skills gained
- Calculates total experience in days and months

### 3. **Experience Badges**
Companies see badges on student profiles:
- **"HIRED" Badge**: Shows student is currently doing an internship
  - Displays company name, position, days remaining
  - Click to see full internship details
- **"EXPERIENCED" Badge**: Shows completed internships count
  - Displays total experience months
  - Click to view full history

### 4. **History View**
- Students can view their complete internship history
- Companies can see student's I-Intern experience when reviewing applications
- Shows timeline of internships with details

---

## Database Schema

### New Table: `internship_history`

```sql
CREATE TABLE internship_history (
    id INTEGER PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES users(id),
    application_id VARCHAR REFERENCES applications(id),
    internship_id VARCHAR REFERENCES internships(id),
    company_profile_id INTEGER REFERENCES employer_profiles(id),
    
    -- Internship Details (Snapshot)
    internship_title VARCHAR NOT NULL,
    company_name VARCHAR NOT NULL,
    position VARCHAR,
    location VARCHAR,
    stipend INTEGER,
    internship_type VARCHAR,
    
    -- Duration Tracking
    start_date DATE NOT NULL,
    expected_end_date DATE NOT NULL,
    actual_end_date DATE,
    duration_months INTEGER,
    
    -- Status
    status VARCHAR NOT NULL DEFAULT 'ongoing', -- ongoing, completed, terminated
    is_currently_active BOOLEAN DEFAULT TRUE,
    
    -- Completion Details
    completion_certificate_url VARCHAR,
    performance_rating INTEGER, -- 1-5
    feedback TEXT,
    skills_gained TEXT,
    work_description TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);
```

### Updated Table: `applications`

New fields added:
```sql
ALTER TABLE applications ADD COLUMN internship_start_date TIMESTAMP;
ALTER TABLE applications ADD COLUMN internship_end_date TIMESTAMP;
ALTER TABLE applications ADD COLUMN internship_completed_date TIMESTAMP;
ALTER TABLE applications ADD COLUMN is_currently_active BOOLEAN DEFAULT FALSE;
```

---

## API Endpoints

### Student Endpoints

#### 1. Start Internship
```http
POST /api/v1/internship-history/start-internship/{application_id}
```

**Request Body:**
```json
{
  "start_date": "2025-11-01",
  "expected_end_date": "2026-04-30"
}
```

**Response:**
```json
{
  "message": "Internship started successfully",
  "history": {
    "id": 1,
    "title": "Backend Developer Intern",
    "company": "Tech Corp",
    "days_remaining": 186
  }
}
```

**Error (if already active):**
```json
{
  "detail": "You already have an active internship: Backend Developer at Tech Corp"
}
```

#### 2. Complete Internship
```http
PATCH /api/v1/internship-history/complete-internship/{history_id}
```

**Request Body:**
```json
{
  "actual_end_date": "2026-04-15",
  "skills_gained": "Python, FastAPI, PostgreSQL, Docker",
  "work_description": "Developed REST APIs and worked on database optimization",
  "performance_rating": 5,
  "feedback": "Excellent performance"
}
```

#### 3. Get Current Internship
```http
GET /api/v1/internship-history/my-current-internship
```

**Response:**
```json
{
  "has_active_internship": true,
  "current_internship": {
    "id": 1,
    "title": "Backend Developer Intern",
    "company": "Tech Corp",
    "position": "Backend Developer Intern",
    "location": "Remote",
    "stipend": 15000,
    "type": "Remote",
    "start_date": "2025-11-01",
    "expected_end_date": "2026-04-30",
    "duration_months": 6,
    "days_remaining": 186,
    "days_completed": 25,
    "status": "ongoing"
  }
}
```

#### 4. Get My History
```http
GET /api/v1/internship-history/my-history
```

**Response:** Array of all internships (ongoing and completed)

#### 5. Get Experience Summary
```http
GET /api/v1/internship-history/my-experience-summary
```

**Response:**
```json
{
  "student_id": 123,
  "student_name": "John Doe",
  "total_internships_completed": 2,
  "total_internships_ongoing": 1,
  "total_experience_days": 365,
  "total_experience_months": 12.2,
  "has_active_internship": true,
  "current_internship": {...},
  "completed_internships": [...]
}
```

#### 6. Check Can Accept Offer
```http
POST /api/v1/internship-history/check-can-accept-offer
```

**Response:**
```json
{
  "can_accept": false,
  "reason": "You currently have an active internship: Backend Developer at Tech Corp",
  "active_internship": {
    "title": "Backend Developer Intern",
    "company": "Tech Corp",
    "days_remaining": 186
  }
}
```

### Company Endpoints

#### 7. Get Student Experience
```http
GET /api/v1/internship-history/student/{student_id}/experience
```

**Response:**
```json
{
  "student_id": 123,
  "student_name": "John Doe",
  "total_internships_completed": 2,
  "total_internships_ongoing": 1,
  "total_experience_days": 365,
  "total_experience_months": 12.2,
  "has_active_internship": true,
  "current_internship_badge": {
    "status": "HIRED",
    "title": "Backend Developer Intern",
    "company": "Tech Corp",
    "days_remaining": 186
  },
  "completed_internships_count": 2,
  "total_internships": 3
}
```

### Modified Endpoints

#### Accept/Decline Offer (Updated)
```http
PATCH /api/v1/applications/{application_id}/respond
```

Now includes check for active internships. Returns error if student tries to accept while having active internship.

#### Get All Applicants (Updated)
```http
GET /api/v1/applications/company/all-applicants
```

Now includes `experience_badge` field in response:
```json
{
  "applicants": [
    {
      "applicant_id": 123,
      "name": "John Doe",
      "experience_badge": {
        "status": "HIRED",
        "type": "active",
        "title": "Backend Developer Intern",
        "company": "Another Corp",
        "days_remaining": 45
      },
      ...
    }
  ]
}
```

Or for experienced students:
```json
{
  "experience_badge": {
    "status": "EXPERIENCED",
    "type": "completed",
    "completed_count": 2,
    "total_experience_months": 8.5,
    "total_experience_days": 255
  }
}
```

---

## Workflow

### Student Journey

1. **Apply for Internship**
   ```
   POST /api/v1/applications/
   ```

2. **Company Sends Offer**
   ```
   PATCH /api/v1/applications/{id}/status
   Body: { "status": "offered" }
   ```

3. **Student Accepts Offer**
   ```
   PATCH /api/v1/applications/{id}/respond
   Body: { "response": "accepted" }
   ```
   - System checks for active internships
   - If active, returns error
   - If not active, accepts offer

4. **Student Starts Internship**
   ```
   POST /api/v1/internship-history/start-internship/{application_id}
   Body: {
     "start_date": "2025-11-01",
     "expected_end_date": "2026-04-30"
   }
   ```
   - Creates history entry
   - Marks application as currently active
   - Student cannot accept other offers now

5. **During Internship**
   - Student sees "HIRED" badge on profile
   - Companies viewing profile see active internship
   - Days remaining is calculated automatically

6. **Complete Internship**
   ```
   PATCH /api/v1/internship-history/complete-internship/{history_id}
   Body: {
     "actual_end_date": "2026-04-15",
     "skills_gained": "...",
     "work_description": "..."
   }
   ```
   - Marks internship as completed
   - Badge changes to "EXPERIENCED"
   - Student can now accept new offers

### Company View

When reviewing applicants:
```javascript
// Applicant with active internship
{
  name: "John Doe",
  experience_badge: {
    status: "HIRED",
    type: "active",
    title: "Backend Developer",
    company: "Another Corp",
    days_remaining: 45
  }
}

// Applicant with completed internships
{
  name: "Jane Smith",
  experience_badge: {
    status: "EXPERIENCED",
    type: "completed",
    completed_count: 2,
    total_experience_months: 8.5
  }
}

// Applicant with no I-Intern experience
{
  name: "Bob Wilson",
  experience_badge: null
}
```

---

## Migration

Run the migration script to update your database:

```bash
cd backend
python migrate_internship_history.py
```

This will:
1. Create the `internship_history` table
2. Add new columns to `applications` table
3. Set up indexes

---

## Frontend Integration

### Student Components

#### 1. Offer Response Dialog
```typescript
// Before accepting offer, check if allowed
const checkCanAccept = async () => {
  const response = await fetch('/api/v1/internship-history/check-can-accept-offer', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  
  if (!data.can_accept) {
    alert(data.reason);
    return false;
  }
  return true;
};
```

#### 2. Start Internship Modal
```tsx
<StartInternshipModal 
  applicationId={acceptedApplication.id}
  onStart={() => {
    // Internship started
    refreshCurrentInternship();
  }}
/>
```

#### 3. Current Internship Badge
```tsx
<CurrentInternshipBadge
  internship={currentInternship}
  onComplete={() => {
    // Show completion form
  }}
/>
```

Display:
```
🎯 HIRED
Backend Developer at Tech Corp
⏱️ 45 days remaining
```

#### 4. History Page
```tsx
<InternshipHistory
  history={internshipHistory}
  experienceSummary={experienceSummary}
/>
```

Shows:
- Current internship (if any)
- Timeline of completed internships
- Total experience stats
- Skills gained from each

### Company Components

#### 1. Applicant Card Badge
```tsx
{applicant.experience_badge && (
  <Badge type={applicant.experience_badge.status}>
    {applicant.experience_badge.status === 'HIRED' ? (
      <>
        🎯 Currently Interning
        <span>at {applicant.experience_badge.company}</span>
        <span>{applicant.experience_badge.days_remaining} days left</span>
      </>
    ) : (
      <>
        ⭐ Experienced
        <span>{applicant.experience_badge.completed_count} internships</span>
        <span>{applicant.experience_badge.total_experience_months} months</span>
      </>
    )}
  </Badge>
)}
```

#### 2. Applicant Profile Modal
```tsx
<ApplicantProfile applicant={applicant}>
  {applicant.experience_badge && (
    <ExperienceBadge badge={applicant.experience_badge} />
  )}
  
  <button onClick={() => viewFullHistory(applicant.id)}>
    View Full I-Intern History
  </button>
</ApplicantProfile>
```

---

## Testing

### Test Scenario 1: Prevent Multiple Internships
1. Student accepts offer A
2. Student starts internship A
3. Student receives offer B
4. Student tries to accept offer B
5. **Expected**: Error message, cannot accept

### Test Scenario 2: Complete and Accept New
1. Student completes internship A
2. Student receives offer B
3. Student accepts offer B
4. **Expected**: Success, offer accepted

### Test Scenario 3: Badge Display
1. Company views applicant list
2. Applicant A has active internship
3. **Expected**: "HIRED" badge with days remaining
4. Applicant B has 2 completed internships
5. **Expected**: "EXPERIENCED" badge with total experience

---

## Security Notes

- Only students can start/complete their own internships
- Companies can only view experience, not modify
- Authentication required for all endpoints
- Input validation on dates (start < end, not in past)

---

## Future Enhancements

1. **Automatic Completion**: Auto-complete internships when end date passes
2. **Certificates**: Upload and store completion certificates
3. **Company Ratings**: Allow companies to rate students
4. **Student Ratings**: Allow students to rate companies
5. **Analytics**: Dashboard showing internship trends
6. **Notifications**: Remind students when internship is ending
7. **Extension Requests**: Allow extending internship duration

---

## Support

For issues or questions:
1. Check API response error messages
2. Verify database migration completed
3. Ensure all models are imported correctly
4. Check authentication tokens

## API Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/internship-history/start-internship/{id}` | POST | Start an internship |
| `/internship-history/complete-internship/{id}` | PATCH | Complete an internship |
| `/internship-history/my-current-internship` | GET | Get current active internship |
| `/internship-history/my-history` | GET | Get all internships |
| `/internship-history/my-experience-summary` | GET | Get experience summary |
| `/internship-history/check-can-accept-offer` | POST | Check if can accept new offer |
| `/internship-history/student/{id}/experience` | GET | Get student experience (company) |
