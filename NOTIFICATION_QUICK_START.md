# Quick Start Guide - Notification System

## For Companies

### Viewing Notifications

1. **Bell Icon in Header**
   - Look for the bell icon (🔔) in the top-right corner
   - Red badge shows unread notification count
   - Click to see recent notifications in dropdown

2. **Notifications Dropdown**
   - Shows 10 most recent notifications
   - Unread notifications have a blue dot
   - Click "Mark all as read" to clear unread status
   - Click "View all notifications" for full page

3. **Full Notifications Page**
   - Access via: `/company/notifications` or click "View all notifications"
   - Filter: "All Notifications" or "Unread"
   - Actions:
     - Click notification to navigate to related page
     - Click ✓ icon to mark as read
     - Click trash icon to delete
     - "Mark All Read" button
     - "Delete All" button

### What Notifications You'll Get

1. **New Application** - When a student applies to your internship
   - Title: "New Application Received"
   - Message: "[Student Name] has applied for your internship [Title]"
   - Icon: 👥 (Users)
   - Color: Blue

2. **Offer Response** - When student accepts/declines your offer
   - Title: "Offer Accepted!" or "Offer Declined"
   - Message: "[Student Name] has accepted/declined your offer for [Title]"
   - Icon: ✓ (CheckCircle)
   - Color: Green or Red

## For Interns/Students

### Viewing Notifications

1. **Bell Icon in Navbar**
   - Look for the bell icon (🔔) in the top navigation
   - Red badge shows unread notification count
   - Click to see recent notifications in dropdown

2. **Notifications Dropdown**
   - Shows recent notifications
   - Unread notifications highlighted
   - Click notification to view details
   - Click "View all notifications" for full page

3. **Full Notifications Page**
   - Access via: `/student/notifications` or click "View all notifications"
   - Filter: "All Notifications" or "Unread"
   - Same management actions as company

### What Notifications You'll Get

1. **Offer Received** - When company sends you an offer
   - Title: "You received an offer!"
   - Message: "[Company Name] sent you an offer for [Position]"
   - Icon: ✉️ (Mail)
   - Color: Purple
   - You also get an email!

## How to Test

### Test Scenario 1: Application Notification
1. Login as a student
2. Apply to any internship
3. Login as the company that posted that internship
4. Check bell icon - you should see a notification badge
5. Click bell to see "New Application Received" notification
6. Click "View all notifications" to see full page

### Test Scenario 2: Offer Notification
1. Login as a company
2. Go to Applicants page
3. Change an application status to "Offered"
4. Login as that student
5. Check bell icon - you should see a notification badge
6. Click bell to see "You received an offer!" notification
7. Check your email for offer notification

### Test Scenario 3: Offer Response Notification
1. Login as a student with an offer
2. Go to Applications page
3. Accept or decline the offer
4. Login as the company
5. Check bell icon - you should see a notification
6. Click to see "Offer Accepted!" or "Offer Declined" notification

## Troubleshooting

### Not Seeing Notifications?
- Check that you're logged in with the correct account
- Make sure notifications polling is working (every 30 seconds)
- Try refreshing the page
- Check browser console for errors

### Unread Count Not Updating?
- Click the notification to mark it as read
- Or use "Mark all as read" button
- Wait for next polling cycle (30 seconds)

### Notifications Not Navigating Correctly?
- Make sure you have access to the target page
- Check that related_id and related_type are set correctly
- For companies: should navigate to /company/applicants
- For interns: should navigate to /student/applications

## API Endpoints (For Developers)

```
GET    /api/v1/notifications              # Get all notifications
GET    /api/v1/notifications/unread-count # Get unread count
PUT    /api/v1/notifications/{id}/read    # Mark as read
PUT    /api/v1/notifications/mark-all-read # Mark all as read
DELETE /api/v1/notifications/{id}         # Delete notification
DELETE /api/v1/notifications/             # Delete all
```

## Component Locations

**Company:**
- Header: `frontend/src/apps/company-dashboard/components/layout/Header.tsx`
- Full Page: `frontend/src/apps/company-dashboard/pages/NotificationsPage.tsx`
- Route: `/company/notifications`

**Intern:**
- Navbar: `frontend/src/apps/interns-dashboard/components/layout/Navbar.tsx`
- Full Page: `frontend/src/apps/interns-dashboard/pages/NotificationsPage.tsx`
- Route: `/student/notifications`

**Backend:**
- Endpoints: `backend/app/api/v1/endpoints/notifications.py`
- Application Logic: `backend/app/api/v1/endpoints/applications.py`
- Model: `backend/app/models/notification.py`
