# I-Intern Development Setup Guide

Complete guide to set up the I-Intern application for local development after cloning from GitHub.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Common Issues & Solutions](#common-issues--solutions)
- [Environment Variables Reference](#environment-variables-reference)

---

## 🔧 Prerequisites

Before starting, ensure you have the following installed:

### Required Software
1. **Python 3.11+**
   - Download: https://www.python.org/downloads/
   - Verify: `python --version`

2. **Node.js 18+ and npm**
   - Download: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

3. **Git**
   - Download: https://git-scm.com/
   - Verify: `git --version`

4. **PostgreSQL** (or Neon Database account)
   - Local: https://www.postgresql.org/download/
   - Cloud (Neon): https://neon.tech/ (Recommended for development)

### Required Accounts (Free Tier Available)
1. **Neon Database** - https://neon.tech/
2. **Brevo (Email Service)** - https://www.brevo.com/

---

## 📥 Initial Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Internmain07/i-intern-development.git
cd i-intern-development
```

### 2. Verify Project Structure
```
i-intern-development/
├── backend/              # FastAPI backend
│   ├── app/
│   ├── requirements.txt
│   └── .env.example
├── frontend/             # React + Vite frontend
│   ├── src/
│   ├── package.json
│   └── .env.development
└── README.md
```

---

## 🔙 Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Create Python Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv venv
venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
python -m venv venv
venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` prefix in your terminal.

### Step 3: Install Python Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Note:** This may take 5-10 minutes. The installation includes:
- FastAPI & Uvicorn (API framework)
- SQLAlchemy & Alembic (Database ORM)
- Pydantic (Data validation)
- Python-Jose (JWT tokens)
- Passlib & Bcrypt (Password hashing)
- WeasyPrint (PDF generation)
- And more...

### Step 4: Create Environment File

Create `.env` file from the example:
```bash
# Windows PowerShell
Copy-Item .env.example .env

# macOS/Linux
cp .env.example .env
```

### Step 5: Configure Environment Variables

Open `.env` and update the following **REQUIRED** variables:

```bash
# 1. SECRET_KEY - Generate a secure random key
# Run this command to generate one:
python -c "import secrets; print(secrets.token_urlsafe(32))"
# Then paste the output below:
SECRET_KEY=your-generated-secret-key-here

# 2. DATABASE_URL - Your PostgreSQL connection string
# For Neon (Recommended):
# Go to https://neon.tech/ → Create project → Copy connection string
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# 3. SMTP Configuration (Brevo)
# Go to https://app.brevo.com/settings/keys/smtp
# Login → Settings → SMTP & API → Get SMTP credentials
SMTP_SERVER=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USERNAME=your-brevo-smtp-username
SMTP_PASSWORD=your-brevo-smtp-password
FROM_EMAIL=noreply@i-intern.com
CONTACT_EMAIL=contact@i-intern.com
ADMIN_EMAIL=your-email@gmail.com

# 4. URLs (Development defaults - usually no change needed)
FRONTEND_URL=http://localhost:8081
BACKEND_URL=http://localhost:8000
ALLOWED_ORIGINS=http://localhost:8081,http://localhost:3000,http://localhost:5173

# 5. Environment
ENVIRONMENT=development

# 6. Cookie Settings (Development)
COOKIE_SAMESITE=lax
COOKIE_SECURE=false
COOKIE_HTTPONLY=true
COOKIE_MAX_AGE=604800
```

### Step 6: Initialize Database

The database tables will be created automatically when you first run the application. However, you may want to create an admin user:

```bash
python create_admin.py
```

Follow the prompts to create your admin account.

### Step 7: Test Backend
```bash
# Start the development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
```

Open browser and visit:
- API: http://localhost:8000/
- API Docs: http://localhost:8000/api/docs

**Keep this terminal running** and open a new terminal for frontend setup.

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend Directory

Open a **NEW TERMINAL** (keep backend running) and:
```bash
cd frontend
```

### Step 2: Install Node Dependencies
```bash
npm install
```

**Note:** This may take 3-5 minutes. Installing:
- React & React DOM
- TypeScript
- Vite (build tool)
- TailwindCSS
- Framer Motion
- Lucide React (icons)
- And more...

### Step 3: Verify Environment Files

Check that these files exist:

**`.env.development`** (for local development):
```bash
VITE_API_URL=http://localhost:8000
```

**`.env.production`** (for production deployment):
```bash
VITE_API_URL=https://i-intern.onrender.com
```

These should already be configured correctly. No changes needed unless your backend runs on a different port.

### Step 4: Test Frontend
```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:8080/
➜  Network: use --host to expose
➜  press h + enter to show help
```

Open browser and visit: http://localhost:8080/

---

## 🚀 Running the Application

### Full Development Workflow

1. **Start Backend** (Terminal 1):
```bash
cd backend
venv\Scripts\Activate.ps1   # Windows PowerShell
# OR
source venv/bin/activate     # macOS/Linux

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

2. **Start Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

3. **Access Application**:
   - Frontend: http://localhost:8080/
   - Backend API: http://localhost:8000/
   - API Documentation: http://localhost:8000/api/docs

### Quick Start Commands

**Backend:**
```bash
cd backend
venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🐛 Common Issues & Solutions

### Backend Issues

#### Issue: "Module not found" errors
**Solution:**
```bash
# Make sure virtual environment is activated
cd backend
venv\Scripts\Activate.ps1

# Reinstall dependencies
pip install -r requirements.txt
```

#### Issue: Database connection errors
**Solution:**
- Verify `DATABASE_URL` in `.env` is correct
- Check if database exists and is accessible
- For Neon: Ensure connection string includes `?sslmode=require`

#### Issue: Email sending fails
**Solution:**
- Verify Brevo SMTP credentials in `.env`
- Check that `SMTP_USERNAME` and `SMTP_PASSWORD` are correct
- Test with: `python test_brevo_email.py`

#### Issue: Port 8000 already in use
**Solution:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9

# Or use a different port
uvicorn app.main:app --reload --port 8001
```

### Frontend Issues

#### Issue: "Module not found" errors
**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json  # Remove existing modules
npm install  # Reinstall
```

#### Issue: Port 8080 already in use
**Solution:**
Edit `vite.config.ts` and change the port:
```typescript
export default defineConfig({
  server: {
    port: 8081,  // Change to any available port
  },
})
```

#### Issue: API calls failing (CORS errors)
**Solution:**
- Ensure backend is running on http://localhost:8000
- Check `.env.development` has `VITE_API_URL=http://localhost:8000`
- Verify backend `.env` includes `http://localhost:8080` in `ALLOWED_ORIGINS`

#### Issue: Build errors in TypeScript
**Solution:**
```bash
npm run type-check  # Check for type errors
# Fix reported errors or add @ts-ignore if needed
```

---

## 📚 Environment Variables Reference

### Backend (.env)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SECRET_KEY` | ✅ Yes | JWT secret key | `7U3y0PKRJ0AwhGRThUIpmdnu...` |
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection | `postgresql://user:pass@host/db` |
| `SMTP_SERVER` | ✅ Yes | Email SMTP server | `smtp-relay.brevo.com` |
| `SMTP_PORT` | ✅ Yes | SMTP port | `587` |
| `SMTP_USERNAME` | ✅ Yes | SMTP username | `9923fa001@smtp-brevo.com` |
| `SMTP_PASSWORD` | ✅ Yes | SMTP password | `your-password` |
| `FROM_EMAIL` | ✅ Yes | Sender email | `noreply@i-intern.com` |
| `CONTACT_EMAIL` | ✅ Yes | Contact form recipient | `contact@i-intern.com` |
| `ADMIN_EMAIL` | ✅ Yes | Admin notifications | `admin@i-intern.com` |
| `FRONTEND_URL` | ✅ Yes | Frontend URL | `http://localhost:8081` |
| `BACKEND_URL` | ✅ Yes | Backend URL | `http://localhost:8000` |
| `ALLOWED_ORIGINS` | ✅ Yes | CORS origins (comma-separated) | `http://localhost:8081,...` |
| `ENVIRONMENT` | ⚠️ Optional | Environment mode | `development` |
| `COOKIE_SAMESITE` | ⚠️ Optional | Cookie SameSite | `lax` |
| `COOKIE_SECURE` | ⚠️ Optional | Cookie Secure flag | `false` (dev), `true` (prod) |
| `COOKIE_HTTPONLY` | ⚠️ Optional | Cookie HttpOnly | `true` |
| `COOKIE_MAX_AGE` | ⚠️ Optional | Cookie lifetime (seconds) | `604800` (7 days) |

### Frontend (.env.development)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_API_URL` | ✅ Yes | Backend API URL | `http://localhost:8000` |

---

## 🔄 Daily Development Workflow

### Starting Work
```bash
# 1. Pull latest changes
git pull origin merge

# 2. Update dependencies (if needed)
cd backend
pip install -r requirements.txt

cd ../frontend
npm install

# 3. Start backend (Terminal 1)
cd backend
venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 4. Start frontend (Terminal 2)
cd frontend
npm run dev
```

### Stopping Work
```bash
# Press CTRL+C in both terminals
# Deactivate virtual environment
deactivate
```

---

## 🚢 Production Deployment

### Backend (Render.com)

1. **Update `render.yaml`** with production values
2. **Set environment variables** in Render dashboard
3. **Deploy** from GitHub repository

Key production environment variables:
```bash
ENVIRONMENT=production
FRONTEND_URL=https://i-intern-2.onrender.com
BACKEND_URL=https://i-intern.onrender.com
ALLOWED_ORIGINS=https://i-intern-2.onrender.com,https://i-intern.onrender.com
COOKIE_SECURE=true
COOKIE_DOMAIN=.onrender.com
```

### Frontend (Render.com)

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Set environment variables**:
   - `VITE_API_URL=https://i-intern.onrender.com`

---

## 📞 Support & Resources

### Documentation
- FastAPI: https://fastapi.tiangolo.com/
- React: https://react.dev/
- Vite: https://vitejs.dev/
- TailwindCSS: https://tailwindcss.com/

### Project Resources
- GitHub: https://github.com/Internmain07/i-intern-development
- Issues: Report bugs via GitHub Issues
- Frontend (Prod): https://i-intern-2.onrender.com/
- Backend (Prod): https://i-intern.onrender.com/

### Need Help?
1. Check this guide first
2. Review error messages carefully
3. Check "Common Issues & Solutions" section
4. Search existing GitHub issues
5. Create new issue with details:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Python version, Node version)

---

## ✅ Verification Checklist

Use this checklist to verify your setup:

### Backend
- [ ] Python 3.11+ installed
- [ ] Virtual environment created and activated
- [ ] All dependencies installed (`pip list`)
- [ ] `.env` file created with all required variables
- [ ] Database connection successful
- [ ] Backend starts without errors
- [ ] API docs accessible at http://localhost:8000/api/docs

### Frontend
- [ ] Node.js 18+ and npm installed
- [ ] Dependencies installed (`node_modules/` exists)
- [ ] `.env.development` file exists
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:8080/
- [ ] Can register/login (test backend connection)

### Integration
- [ ] Frontend can communicate with backend (no CORS errors)
- [ ] Can register new user account
- [ ] Receive welcome email
- [ ] Can login successfully
- [ ] Can submit contact form
- [ ] Receive contact form emails

---

**Last Updated**: October 26, 2025  
**Version**: 1.0.0  
**Maintainer**: I-Intern Development Team
