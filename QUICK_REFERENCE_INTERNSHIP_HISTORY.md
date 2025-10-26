# 🚀 Internship History Feature - Quick Reference

## What This Feature Does

✅ **Prevents students from accepting multiple concurrent internships**  
✅ **Tracks all internship history (ongoing & completed)**  
✅ **Shows experience badges to companies**  
✅ **Displays days remaining in current internship**  
✅ **Calculates total experience through I-Intern**

---

## For Students

### Can I accept a new offer?
```
Active internship? → NO, must complete current first
No active internship? → YES, can accept
```

### How to start an internship?
1. Accept offer from company
2. Click "Start Internship"
3. Enter start & end dates
4. Badge appears: 🎯 HIRED

### What badge will I see?
- **During internship**: 🎯 HIRED (with days remaining)
- **After completion**: ⭐ EXPERIENCED (with total experience)

### Where can I see my history?
- Dashboard: Current internship card
- History page: All past internships
- Profile: Experience summary

---

## For Companies

### What do I see on applicant profiles?

**Active Internship:**
```
🎯 Currently Interning
Backend Developer at Tech Corp
⏱️ 45 days remaining
```

**Completed Internships:**
```
⭐ Experienced via I-Intern
2 internships completed
8.5 months total experience
```

### Can I hire someone who's currently interning?
- You can send an offer
- They CANNOT accept until completing current internship
- Badge shows when they'll be available

### How do I see full history?
Click on the experience badge to view:
- All completed internships
- Total experience months
- Current internship status

---

## API Quick Reference

### Student Calls

```http
# Check if can accept offer
POST /api/v1/internship-history/check-can-accept-offer

# Start internship
POST /api/v1/internship-history/start-internship/{application_id}
?start_date=2025-11-01&expected_end_date=2026-04-30

# Get current internship
GET /api/v1/internship-history/my-current-internship

# Get history
GET /api/v1/internship-history/my-history

# Get summary
GET /api/v1/internship-history/my-experience-summary

# Complete internship
PATCH /api/v1/internship-history/complete-internship/{history_id}
```

### Company Calls

```http
# Get student's experience (when viewing applicant)
GET /api/v1/internship-history/student/{student_id}/experience
```

---

## Installation (One Time)

```bash
cd backend
python migrate_internship_history.py
python test_internship_history_setup.py
# Restart server
```

---

## Frontend Integration Checklist

- [ ] Add `StartInternshipModal` after accepting offer
- [ ] Show `CurrentInternshipCard` on student dashboard
- [ ] Create internship history page
- [ ] Display `ExperienceBadge` in applicant lists
- [ ] Add check before accepting offer
- [ ] Show error if already has active internship

---

## Key Business Rules

1. **One Active Internship at a Time**
   - Student can only have 1 ongoing internship
   - Must complete before accepting new offer

2. **Start After Acceptance**
   - Can only start after accepting offer
   - Must set start & end dates

3. **Badge Visibility**
   - Students see their own badge
   - Companies see badges on all applicants
   - Shows real-time days remaining

4. **Experience Tracking**
   - Tracks all I-Intern internships
   - Calculates total experience
   - Shows to future employers

---

## Files to Know

```
backend/
├── app/models/internship_history.py         # Database model
├── app/schemas/internship_history.py        # API schemas
├── app/api/v1/endpoints/internship_history.py  # Endpoints
├── migrate_internship_history.py            # Run this first!
└── test_internship_history_setup.py         # Verify setup

frontend/
└── INTERNSHIP_HISTORY_COMPONENTS.tsx        # Example components

docs/
├── INTERNSHIP_HISTORY_FEATURE.md           # Full documentation
└── INTERNSHIP_HISTORY_IMPLEMENTATION.md    # Implementation guide
```

---

## Common Issues

**Q: Student can't accept offer**  
A: Check if they have active internship via `/check-can-accept-offer`

**Q: Badge not showing**  
A: Verify internship was started via `/start-internship` endpoint

**Q: Days remaining is wrong**  
A: Calculated from expected_end_date, check date was set correctly

**Q: Company can't see experience**  
A: Must be viewing application, use `/student/{id}/experience` endpoint

---

## Testing

### Manual Test Flow:
1. Student applies to Internship A
2. Company sends offer
3. Student accepts → Status: "Accepted"
4. Student starts internship → Badge: 🎯 HIRED
5. Student receives Internship B offer
6. Student tries to accept B → **ERROR** ✅
7. Student completes internship A → Badge: ⭐ EXPERIENCED
8. Student accepts internship B → **SUCCESS** ✅

---

## Need Help?

📖 **Full Docs**: `backend/INTERNSHIP_HISTORY_FEATURE.md`  
🔧 **Setup Guide**: `INTERNSHIP_HISTORY_IMPLEMENTATION.md`  
💻 **API Docs**: `http://localhost:8000/docs` (look for "internship-history")  
🎨 **Components**: `frontend/INTERNSHIP_HISTORY_COMPONENTS.tsx`

---

## Feature Status

✅ **Backend**: Complete & tested  
✅ **Database**: Migration ready  
✅ **API**: 7 endpoints available  
✅ **Docs**: Comprehensive  
⏳ **Frontend**: Integration needed  

**Next Step**: Run migration script!
```bash
python backend/migrate_internship_history.py
```
