# 🚀 I-Intern Quick Start Guide

**One-page reference for setting up and running I-Intern after cloning from GitHub.**

---

## 📦 Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL or Neon account
- Brevo account (for emails)

---

## 🔧 First Time Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Internmain07/i-intern-development.git
cd i-intern-development
```

### 2️⃣ Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\Activate.ps1          # Windows PowerShell
# OR
venv\Scripts\activate.bat          # Windows CMD
# OR
source venv/bin/activate           # macOS/Linux

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create .env file
Copy-Item .env.example .env        # Windows
# OR
cp .env.example .env               # macOS/Linux

# Edit .env and set these REQUIRED variables:
# - SECRET_KEY (generate with: python -c "import secrets; print(secrets.token_urlsafe(32))")
# - DATABASE_URL (from Neon or local PostgreSQL)
# - SMTP credentials (from Brevo)
# - Email addresses (FROM_EMAIL, CONTACT_EMAIL, ADMIN_EMAIL)
```

### 3️⃣ Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Verify .env.development exists with:
# VITE_API_URL=http://localhost:8000
```

---

## 🏃 Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
venv\Scripts\Activate.ps1          # Windows PowerShell
# OR
source venv/bin/activate           # macOS/Linux

# Run backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will run on:** http://localhost:8000  
**API Docs:** http://localhost:8000/api/docs

### Start Frontend (Terminal 2)
```bash
cd frontend

# Run frontend
npm run dev
```

**Frontend will run on:** http://localhost:8080

---

## 📝 Required Environment Variables

### Backend `.env` (Minimum Required)
```bash
# Generate with: python -c "import secrets; print(secrets.token_urlsafe(32))"
SECRET_KEY=your-generated-key

# Get from https://neon.tech/
DATABASE_URL=postgresql://user:pass@host:port/database?sslmode=require

# Get from https://app.brevo.com/settings/keys/smtp
SMTP_SERVER=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USERNAME=your-brevo-username
SMTP_PASSWORD=your-brevo-password

# Email configuration
FROM_EMAIL=noreply@i-intern.com
CONTACT_EMAIL=contact@i-intern.com
ADMIN_EMAIL=your-email@gmail.com

# URLs (usually no change needed for dev)
FRONTEND_URL=http://localhost:8081
BACKEND_URL=http://localhost:8000
ALLOWED_ORIGINS=http://localhost:8081,http://localhost:8080,http://localhost:3000,http://localhost:5173

# Environment
ENVIRONMENT=development

# Cookie settings (for dev)
COOKIE_SECURE=false
COOKIE_SAMESITE=lax
```

### Frontend `.env.development`
```bash
VITE_API_URL=http://localhost:8000
```

---

## 🔄 Daily Workflow

### Pull Latest Changes
```bash
git pull origin merge
```

### Start Development
```bash
# Terminal 1 - Backend
cd backend
venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Stop Development
```bash
# Press CTRL+C in both terminals
```

---

## 🐛 Quick Fixes

### Backend Issues

**"Module not found"**
```bash
cd backend
venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Database errors**
- Check `DATABASE_URL` in `.env`
- Ensure database exists and is accessible

**Email not sending**
- Verify Brevo credentials in `.env`
- Test: `python test_brevo_email.py`

**Port 8000 in use**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

### Frontend Issues

**"Module not found"**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**API/CORS errors**
- Ensure backend is running
- Check `.env.development` has correct `VITE_API_URL`
- Verify backend `.env` includes frontend URL in `ALLOWED_ORIGINS`

**Port 8080 in use**
- Edit `vite.config.ts` and change port number

---

## 📊 Useful Commands

### Backend
```bash
# Create admin user
python create_admin.py

# Test email
python test_brevo_email.py

# Check database tables
python check_tables.py

# Database operations
python fix_database.py

# Run specific script
python <script-name>.py
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint
npm run lint
```

---

## 🌐 Access Points

### Local Development
- **Frontend**: http://localhost:8080/
- **Backend API**: http://localhost:8000/
- **API Docs**: http://localhost:8000/api/docs
- **Redoc**: http://localhost:8000/api/redoc

### Production
- **Frontend**: https://i-intern-2.onrender.com/
- **Backend**: https://i-intern.onrender.com/

---

## 📦 Important Directories

```
i-intern-development/
├── backend/
│   ├── app/                    # Main application code
│   │   ├── api/               # API endpoints
│   │   ├── core/              # Config, security
│   │   ├── db/                # Database setup
│   │   ├── models/            # Database models
│   │   ├── schemas/           # Pydantic schemas
│   │   └── utils/             # Utility functions
│   ├── uploads/               # User uploaded files
│   ├── requirements.txt       # Python dependencies
│   ├── .env                   # Environment variables (CREATE THIS)
│   └── .env.example          # Environment template
│
├── frontend/
│   ├── src/
│   │   ├── apps/             # Application modules
│   │   │   ├── landing/      # Landing pages
│   │   │   ├── auth/         # Authentication
│   │   │   ├── intern/       # Intern dashboard
│   │   │   ├── company/      # Company dashboard
│   │   │   └── admin/        # Admin dashboard
│   │   ├── shared/           # Shared components
│   │   ├── services/         # API services
│   │   └── api.ts           # API client
│   ├── package.json          # Node dependencies
│   ├── .env.development      # Dev environment
│   └── .env.production       # Prod environment
│
└── DEVELOPMENT_SETUP.md      # Detailed setup guide (THIS FILE)
```

---

## ✅ Verification Checklist

- [ ] Python 3.11+ installed (`python --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Backend virtual environment created
- [ ] Backend dependencies installed
- [ ] Backend `.env` configured
- [ ] Frontend dependencies installed
- [ ] Backend runs without errors
- [ ] Frontend runs without errors
- [ ] Can access both URLs
- [ ] Can register/login

---

## 📚 Full Documentation

For detailed information, see: **DEVELOPMENT_SETUP.md**

---

**Last Updated**: October 26, 2025  
**Version**: 1.0.0
