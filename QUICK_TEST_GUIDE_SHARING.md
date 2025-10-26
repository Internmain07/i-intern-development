# Quick Test Guide - Internship Sharing Feature

## Prerequisites
- Frontend server running on `http://localhost:5173` (or your configured port)
- Backend server running
- At least one internship posted in the system

## Test Scenarios

### 🧪 Test 1: Share Link Generation
1. Login as a student or company
2. Navigate to internships page
3. Click on any internship to open details modal
4. Click the "Share" button
5. Select "Copy Link"
6. **Expected**: Link should be copied in format: `http://localhost:5173/internship/{id}`
7. Paste the link and verify the format

### 🧪 Test 2: Public Internship Page
1. Copy a share link from Test 1
2. Open in a new incognito/private window (to simulate logged-out user)
3. Navigate to the copied link
4. **Expected**: 
   - See public internship preview page
   - Limited information displayed (title, company, location, salary, duration)
   - "Login to View Details & Apply" button visible
   - Call-to-action section with "Sign Up" and "Login" buttons

### 🧪 Test 3: Existing User Login Flow
1. From the public internship page (Test 2)
2. Click "Login to View Details & Apply" button
3. Enter your existing student credentials
4. Click "Sign In"
5. **Expected**: 
   - After successful login, automatically redirected to `/interns/internship/{id}`
   - Full internship details page shown in intern dashboard
   - Can view complete information and apply

### 🧪 Test 4: New User Registration Flow
1. From the public internship page (Test 2)
2. Click "Sign Up as Student" button
3. Complete the registration form
4. Submit registration
5. Enter the OTP sent to your email
6. **Expected**: 
   - After OTP verification, profile building modal appears
   - After skipping/completing profile, automatically redirected to `/interns/internship/{id}`
   - Full internship details page shown
   - Can view complete information and apply

### 🧪 Test 5: Multiple Share Methods
1. Login as company
2. Navigate to your posted internships
3. Open internship details modal
4. Test each share option:
   - **Copy Link**: Should copy URL to clipboard
   - **WhatsApp**: Should open WhatsApp with pre-filled message
   - **Email**: Should open email client with subject and body
   - **LinkedIn**: Should open LinkedIn share dialog
   - **Twitter**: Should open Twitter with pre-filled tweet
   - **Facebook**: Should open Facebook share dialog

### 🧪 Test 6: URL Encoding Test
1. Create/find an internship with special characters in title
2. Generate share link
3. Copy link and navigate to it
4. Click login/signup
5. **Expected**: 
   - URL should be properly encoded
   - No errors in browser console
   - Successfully redirected after authentication

### 🧪 Test 7: Bookmark from Public Page
1. Open a public internship page (logged out)
2. Click the bookmark icon
3. **Expected**: 
   - Redirected to `/register/student?returnUrl=/interns/internship/{id}`
   - After registration and login, redirected to internship page

## Quick Manual Tests

### ✅ Test Checklist

- [ ] Share link generates correctly from intern dashboard
- [ ] Share link generates correctly from company dashboard
- [ ] Public page loads without authentication
- [ ] Public page shows limited information
- [ ] "Login to View Details" button works
- [ ] Login redirects to correct internship page
- [ ] Registration redirects to correct internship page
- [ ] Email verification passes returnUrl correctly
- [ ] Profile modal redirects correctly
- [ ] WhatsApp share opens with correct link
- [ ] Email share opens with correct link
- [ ] LinkedIn share opens with correct link
- [ ] Twitter share opens with correct link
- [ ] Facebook share opens with correct link
- [ ] Bookmark button redirects to signup with returnUrl
- [ ] URL encoding works for special characters
- [ ] No console errors during the flow

## Expected URLs at Each Step

### Public Access
```
http://localhost:5173/internship/abc123
```

### Login with Return URL
```
http://localhost:5173/login?returnUrl=%2Finterns%2Finternship%2Fabc123
```

### Registration with Return URL
```
http://localhost:5173/register/student?returnUrl=%2Finterns%2Finternship%2Fabc123
```

### Final Destination (After Auth)
```
http://localhost:5173/interns/internship/abc123
```

## Browser Console Checks

Open browser console and verify:
1. No error messages during navigation
2. Console logs show correct redirect URLs
3. Authentication tokens are set correctly
4. returnUrl is properly decoded

## Common Issues to Check

### Issue: Redirect not working after login
- **Check**: Browser console for errors
- **Verify**: returnUrl parameter is in URL
- **Solution**: Clear localStorage and try again

### Issue: Public page shows 404
- **Check**: Internship ID is valid
- **Verify**: Route `/internship/:id` exists in LandingPage.tsx
- **Solution**: Restart frontend server

### Issue: Authentication fails
- **Check**: Backend is running
- **Verify**: Credentials are correct
- **Solution**: Check backend logs for errors

### Issue: returnUrl not preserved
- **Check**: URL encoding is correct
- **Verify**: Navigation state is passed correctly
- **Solution**: Check component props chain

## Performance Checks

- [ ] Public page loads in < 2 seconds
- [ ] Navigation transitions are smooth
- [ ] No layout shifts during loading
- [ ] Images load properly
- [ ] Responsive design works on mobile

## Security Checks

- [ ] Public page doesn't expose sensitive information
- [ ] Authentication is required for full details
- [ ] JWT tokens are validated
- [ ] returnUrl only accepts internal routes
- [ ] XSS protection is in place

## Mobile Testing

Test on mobile devices:
- [ ] Native share API works (iOS/Android)
- [ ] Touch interactions work smoothly
- [ ] Responsive layout adapts correctly
- [ ] All buttons are tap-friendly
- [ ] Forms are easy to fill on mobile

## Share on Social Media Test

1. Share an internship on LinkedIn
2. **Check**: Preview shows correct title and description
3. Share on Twitter
4. **Check**: Tweet contains internship info and link
5. Share on Facebook
6. **Check**: Post shows internship details

## Edge Cases to Test

1. **Expired internship**: Does public page show appropriate message?
2. **Invalid internship ID**: Does it show 404 or error page?
3. **Already logged in**: What happens when clicking share link while logged in?
4. **Multiple tabs**: Does authentication work across tabs?
5. **Back button**: Does navigation work correctly with back button?

---

## Automated Testing Commands

### Run Frontend Tests
```bash
cd frontend
npm test
```

### Run End-to-End Tests (if configured)
```bash
npm run e2e
```

### Check Build
```bash
npm run build
```

## Report Issues

If you find any issues during testing:
1. Note the exact steps to reproduce
2. Check browser console for errors
3. Check network tab for failed requests
4. Screenshot the issue
5. Create a detailed bug report

---

**Happy Testing! 🚀**
