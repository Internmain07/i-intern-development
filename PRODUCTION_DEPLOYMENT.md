# 🚀 I-Intern Production Deployment Guide

Complete guide for deploying I-Intern to Render.com

---

## 📋 Overview

**Production URLs:**
- Frontend: https://i-intern-2.onrender.com
- Backend: https://i-intern.onrender.com

**Hosting Platform:** Render.com (Free Tier)

---

## 🔐 Prerequisites

### 1. Required Accounts
- [x] **GitHub Account** - Repository access
- [x] **Render Account** - https://render.com/ (free tier)
- [x] **Neon Database** - https://neon.tech/ (free tier)
- [x] **Brevo Email** - https://brevo.com/ (free tier - 300 emails/day)

### 2. Prepare Credentials

Collect these before deployment:

| Service | Credential | Where to Get |
|---------|-----------|--------------|
| Database | `DATABASE_URL` | Neon Dashboard → Connection String |
| JWT | `SECRET_KEY` | Generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"` |
| Email | `SMTP_USERNAME` | Brevo → Settings → SMTP & API |
| Email | `SMTP_PASSWORD` | Brevo → Settings → SMTP & API |

---

## 🔙 Backend Deployment (Render)

### Step 1: Create Web Service

1. **Login to Render** - https://dashboard.render.com/
2. **Click "New +"** → **"Web Service"**
3. **Connect GitHub Repository**
   - Select: `i-intern-development`
   - Or connect repository if first time

### Step 2: Configure Service

**Basic Settings:**
```
Name:              i-intern-backend
Region:            Singapore (or closest to users)
Branch:            merge (or main)
Root Directory:    backend
Runtime:           Python 3
Build Command:     pip install -r requirements.txt
Start Command:     uvicorn app.main:app --host 0.0.0.0 --port $PORT
Instance Type:     Free
```

### Step 3: Set Environment Variables

Click **"Environment"** tab and add these variables:

#### ⚠️ CRITICAL - Required Variables

```bash
# 1. SECRET KEY (GENERATE NEW ONE - DO NOT USE EXAMPLE)
SECRET_KEY=<generate-with-python-secrets-module>

# 2. DATABASE (Get from Neon)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# 3. ENVIRONMENT
ENVIRONMENT=production

# 4. URLs
FRONTEND_URL=https://i-intern-2.onrender.com
BACKEND_URL=https://i-intern.onrender.com
ALLOWED_ORIGINS=https://i-intern-2.onrender.com,https://i-intern.onrender.com

# 5. EMAIL (Get from Brevo)
SMTP_SERVER=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USERNAME=your-brevo-smtp-username
SMTP_PASSWORD=your-brevo-smtp-password
FROM_EMAIL=noreply@i-intern.com
CONTACT_EMAIL=contact@i-intern.com
ADMIN_EMAIL=i.intern.technologies@gmail.com

# 6. COOKIE SETTINGS (IMPORTANT FOR PRODUCTION)
COOKIE_SAMESITE=lax
COOKIE_SECURE=true
COOKIE_DOMAIN=.onrender.com
COOKIE_HTTPONLY=true
COOKIE_MAX_AGE=604800
```

### Step 4: Deploy

1. **Click "Create Web Service"**
2. **Wait for deployment** (5-10 minutes first time)
3. **Check logs** for any errors
4. **Verify deployment**:
   - Visit: https://i-intern.onrender.com/
   - Should see: `{"message": "Welcome to the i-Intern API"}`
   - API Docs (disabled in production for security)

### Step 5: Post-Deployment

**Create Admin User:**
```bash
# On Render dashboard → Shell
python create_admin.py
```

Follow prompts to create admin account.

---

## 🎨 Frontend Deployment (Render)

### Step 1: Create Static Site

1. **Login to Render** - https://dashboard.render.com/
2. **Click "New +"** → **"Static Site"**
3. **Connect same GitHub Repository**
   - Select: `i-intern-development`

### Step 2: Configure Static Site

**Basic Settings:**
```
Name:              i-intern-frontend
Branch:            merge (or main)
Root Directory:    frontend
Build Command:     npm install && npm run build
Publish Directory: dist
```

### Step 3: Set Environment Variables

Click **"Environment"** tab:

```bash
# Backend API URL
VITE_API_URL=https://i-intern.onrender.com
```

### Step 4: Advanced Settings

**Auto-Deploy:** Yes (deploy on git push)

**Pull Request Previews:** Optional (useful for testing)

### Step 5: Deploy

1. **Click "Create Static Site"**
2. **Wait for build** (3-5 minutes)
3. **Verify deployment**:
   - Visit: https://i-intern-2.onrender.com/
   - Should load homepage
   - Test registration/login

---

## 🔍 Verification & Testing

### Backend Health Check

```bash
# 1. API Root
curl https://i-intern.onrender.com/

# Expected: {"message": "Welcome to the i-Intern API"}

# 2. CORS Check (from browser console)
fetch('https://i-intern.onrender.com/')
  .then(r => r.json())
  .then(console.log)

# Expected: No CORS errors
```

### Frontend Verification

1. **Homepage loads** ✅
2. **Navigation works** ✅
3. **Registration works** ✅
4. **Email received** ✅
5. **Login works** ✅
6. **Dashboard accessible** ✅
7. **Contact form works** ✅
8. **No console errors** ✅

---

## 🔄 Update & Redeploy

### Automatic Deployment (Recommended)

Both services auto-deploy when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Your update message"
git push origin merge

# Render automatically detects and deploys
# Check deployment status in Render dashboard
```

### Manual Deployment

**If auto-deploy is disabled:**

1. Go to Render Dashboard
2. Select service (backend or frontend)
3. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🐛 Troubleshooting

### Backend Issues

#### Issue: Build Failed
**Check:**
- `requirements.txt` is in `backend/` directory
- All dependencies are compatible
- Python version is 3.11+

**Solution:**
```bash
# In Render logs, look for specific error
# Common: WeasyPrint dependencies
# Render usually installs these automatically
```

#### Issue: Database Connection Failed
**Check:**
- `DATABASE_URL` is correct
- Includes `?sslmode=require` for Neon
- Database exists and is accessible

**Solution:**
- Copy connection string again from Neon
- Ensure pooler connection string (not direct)

#### Issue: CORS Errors
**Check:**
- `ALLOWED_ORIGINS` includes frontend URL
- Both URLs are HTTPS
- No trailing slashes in URLs

**Solution:**
```bash
ALLOWED_ORIGINS=https://i-intern-2.onrender.com,https://i-intern.onrender.com
```

#### Issue: Email Not Sending
**Check:**
- SMTP credentials are correct
- Brevo account is active
- Not exceeding free tier limits (300/day)

**Solution:**
- Test credentials manually
- Check Brevo dashboard for errors
- Verify FROM_EMAIL is authorized in Brevo

### Frontend Issues

#### Issue: Build Failed
**Check:**
- `package.json` exists in `frontend/`
- Node version compatibility
- TypeScript errors

**Solution:**
```bash
# Check build logs for specific errors
# Common: Type errors or missing dependencies
```

#### Issue: White Screen / Not Loading
**Check:**
- Build completed successfully
- `dist/` directory created
- `index.html` exists in `dist/`

**Solution:**
- Check browser console for errors
- Verify API URL is correct
- Check network tab for failed requests

#### Issue: API Calls Failing
**Check:**
- `VITE_API_URL` is set correctly
- Backend is running
- No CORS errors (see backend troubleshooting)

**Solution:**
```bash
# Frontend environment variable
VITE_API_URL=https://i-intern.onrender.com

# Backend environment variable
ALLOWED_ORIGINS=https://i-intern-2.onrender.com
```

---

## 📊 Monitoring & Logs

### Render Dashboard

**Access Logs:**
1. Go to service (backend/frontend)
2. Click **"Logs"** tab
3. View real-time logs

**Monitor Performance:**
- Response times
- Error rates
- Resource usage

### Email Monitoring

**Brevo Dashboard:**
- Monitor sent emails
- Check delivery rates
- View bounce/spam reports

### Database Monitoring

**Neon Dashboard:**
- Monitor connections
- Check query performance
- View storage usage

---

## 🔐 Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` to git
- ✅ Use different secrets for prod/dev
- ✅ Rotate secrets regularly
- ✅ Use strong, random SECRET_KEY

### 2. CORS Configuration
- ✅ Only allow specific origins (no `*`)
- ✅ Use HTTPS in production
- ✅ Set proper cookie settings

### 3. Database Security
- ✅ Use connection pooling
- ✅ Enable SSL mode
- ✅ Restrict access by IP (if possible)
- ✅ Regular backups

### 4. API Security
- ✅ Rate limiting (implemented)
- ✅ JWT token expiration
- ✅ HTTPS only
- ✅ Disable API docs in production

---

## 📈 Performance Optimization

### Backend

1. **Database Queries**
   - Use connection pooling
   - Index frequently queried columns
   - Limit query results

2. **Caching**
   - Cache static responses
   - Use Redis for session storage (future)

3. **Compression**
   - Enable gzip compression (Render does this)

### Frontend

1. **Build Optimization**
   - Already using Vite (fast builds)
   - Code splitting enabled
   - Lazy loading routes

2. **Asset Optimization**
   - Compress images
   - Use WebP format
   - Lazy load images

3. **Caching**
   - Browser caching enabled
   - CDN for static assets (future)

---

## 🔄 Backup Strategy

### Database Backups

**Neon (Automatic):**
- Point-in-time recovery
- Automated daily backups
- 7-day retention (free tier)

**Manual Backup:**
```bash
# From local machine with pg_dump
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# From Render shell
pg_dump $DATABASE_URL > backup.sql
```

### Code Backups

**GitHub (Automatic):**
- All code versioned in git
- Multiple branches for safety
- Can revert anytime

---

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] All code tested locally
- [ ] Database migrations prepared
- [ ] Environment variables documented
- [ ] Secrets generated and secured
- [ ] Dependencies updated
- [ ] Tests passing

### Backend Deployment
- [ ] Web service created on Render
- [ ] Repository connected
- [ ] Build/start commands configured
- [ ] Environment variables set
- [ ] Database connected
- [ ] Email configured
- [ ] Service deployed successfully
- [ ] Health check passes
- [ ] Admin user created

### Frontend Deployment
- [ ] Static site created on Render
- [ ] Repository connected
- [ ] Build command configured
- [ ] Environment variable set (VITE_API_URL)
- [ ] Build successful
- [ ] Site loads correctly
- [ ] API calls working
- [ ] No console errors

### Post-Deployment
- [ ] Full user flow tested
- [ ] Email delivery verified
- [ ] CORS working correctly
- [ ] Authentication working
- [ ] File uploads working
- [ ] Contact form working
- [ ] Performance acceptable
- [ ] Monitoring setup
- [ ] Team notified

---

## 🆘 Emergency Procedures

### Rollback Deployment

**If deployment breaks production:**

1. **In Render Dashboard:**
   - Go to service
   - Click **"Manual Deploy"**
   - Select **previous working commit**
   - Click **"Deploy"**

2. **Fix issues locally:**
   - Create hotfix branch
   - Test thoroughly
   - Deploy again

### Database Emergency

**If database corruption:**

1. Stop backend service
2. Restore from Neon backup
3. Verify data integrity
4. Restart backend service

### Complete Outage

**Priority order:**
1. Check Render status page
2. Check Neon status page
3. Review recent changes
4. Check error logs
5. Rollback if needed
6. Contact support if platform issue

---

## 📞 Support Resources

### Platform Documentation
- **Render**: https://render.com/docs
- **Neon**: https://neon.tech/docs
- **Brevo**: https://developers.brevo.com/

### Status Pages
- **Render**: https://status.render.com/
- **Neon**: https://neonstatus.com/

### Community
- Render Community: https://community.render.com/
- GitHub Issues: Repository issues tab

---

## 🎯 Production URLs Reference

```
Frontend (Public):     https://i-intern-2.onrender.com
Backend API:           https://i-intern.onrender.com
Backend Health:        https://i-intern.onrender.com/
API Docs:              Disabled in production (security)

Environment Variables:
  Backend:             FRONTEND_URL, BACKEND_URL, ALLOWED_ORIGINS
  Frontend:            VITE_API_URL
```

---

**Last Updated**: October 26, 2025  
**Version**: 1.0.0  
**Maintainer**: I-Intern Development Team
