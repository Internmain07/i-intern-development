## I-Intern — Full-Stack (Frontend + Backend)

This repository contains the I-Intern platform: a FastAPI backend and a Vite + React frontend. This top-level README explains how to setup, run, and develop both parts locally and how to perform common tasks.

## Repository layout

```
backend/        # FastAPI backend
frontend/       # Vite + React frontend
├── src/apps/   # Multi-app architecture
│   ├── landing/           # Landing pages (/, /about, /pricing, /contact)
│   ├── interns-dashboard/ # Intern dashboard (/interns/*)
│   ├── company-dashboard/ # Company dashboard (/company/*)
│   ├── admin-dashboard/   # Admin dashboard (/admin/*)
│   ├── build-resume/      # Resume builder (/resume/*)
│   ├── iva/              # Virtual Interview Assistant (/iva/*)
│   ├── aura/             # AI Career Assistant (/aura/*)
│   └── faq/              # FAQ page (/faq/*)
``` 

## Prerequisites

- Python 3.11+ (match `runtime.txt` in `backend/`)
- Node.js 18+ and npm (or yarn)
- PostgreSQL (or any DB supported by SQLAlchemy) for production

Windows PowerShell notes: the examples below include PowerShell-specific activation for virtual environments.

## Backend (FastAPI)

Path: `backend/`

Key files:
- `backend/app/main.py` — FastAPI application entrypoint
- `backend/requirements.txt` — Python dependencies
- `backend/.env.example` — example environment variables (if present)

Quick setup (PowerShell)

```powershell
# from repo root
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
# copy or create .env from examples
copy .env.development .env
```

Run the server (development)

```powershell
# from backend/
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# OR (package.json script from frontend folder):
cd ../frontend; npm run backend
```

Open:
- API base: http://localhost:8000
- Swagger UI (dev only): http://localhost:8000/api/docs

Environment variables (example `.env`)

```
SECRET_KEY=your-super-secret-key
DATABASE_URL=postgresql://user:pass@localhost:5432/i_intern_db
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
ENVIRONMENT=development
```

Notes on uploads and DB:
- Uploaded files are stored under `backend/uploads/avatars/` locally.
- The project uses SQLAlchemy and currently calls `Base.metadata.create_all()` on startup. For production migrations, use Alembic (recommended).

Useful backend commands

```powershell
# install requirements
pip install -r requirements.txt

# start with uvicorn (entry at app.main)
python -m uvicorn app.main:app --reload --port 8000

# use a different port
python -m uvicorn app.main:app --reload --port 8001
```

API examples (curl)

```bash
# Health check
curl http://localhost:8000/

# Get landing stats
curl http://localhost:8000/api/v1/landing/stats

# Register (JSON)
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"intern"}'

# Login (form data)
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=password123"
```

## Frontend (Vite + React)

Path: `frontend/`

The frontend is a Vite + React app written in TypeScript with a multi-app architecture. Each app is isolated and accessible via its own route:

- **Landing** (`/`) — Marketing pages, authentication, registration
- **Interns Dashboard** (`/interns/*`) — Intern profile, applications, resume builder
- **Company Dashboard** (`/company/*`) — Company profile, job postings, applications
- **Admin Dashboard** (`/admin/*`) — Administrative functions
- **Build Resume** (`/resume/*`) — AI-powered resume builder
- **IVA** (`/iva/*`) — Virtual Interview Assistant
- **AURA** (`/aura/*`) — AI Career Guidance Assistant
- **FAQ** (`/faq/*`) — Frequently Asked Questions (standalone app, accessible via footer links only)

Quick setup (PowerShell)

```powershell
cd frontend
npm install
# or: yarn
```

Run dev server

```powershell
npm run dev
# open http://localhost:5173
```

The `frontend/package.json` also provides helper scripts:

- `npm run backend` — change into `frontend/backend` and run Uvicorn (useful for running both from one terminal)
- `npm run start-backend` — installs backend requirements then starts Uvicorn

Build for production

```powershell
npm run build
```

## Full local dev workflow (recommended)

Open two terminals.

Terminal 1 — Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Terminal 2 — Frontend

```powershell
cd frontend
npm install
npm run dev
```

Now open the frontend (usually http://localhost:5173) and it will call the backend at http://localhost:8000 (CORS is pre-configured for common local dev origins).

## Testing

Manual test examples are shown in the backend section (curl). You can also use tools such as Postman or httpie for interactive testing.

## Deployment notes

- The backend contains `Procfile`, `render.yaml`, and `runtime.txt` for common deployment platforms (Render, Heroku). The backend README contains Render instructions.
- For production, switch `ENVIRONMENT=production` and populate `ALLOWED_ORIGINS` with your frontend URL(s).
- Consider storing uploads on S3 and using Alembic for database migrations.

## Troubleshooting

- Port already in use: change the port when starting Uvicorn
- Database connection errors: verify `DATABASE_URL` and that the DB is running and accessible
- CORS errors: ensure your frontend origin is in `ALLOWED_ORIGINS`

## Contributing

1. Fork or create a feature branch
2. Run the app locally and add tests where appropriate
3. Open a pull request describing your change

## Files added/edited

- `README.md` (this file) — repository-level instructions and developer guide
- `frontend/src/apps/faq/` — New standalone FAQ app with search and accordion functionality
- `frontend/src/App.tsx` — Added FAQ routing (`/faq/*`)
- `frontend/src/apps/landing/components/Footer.tsx` — Added FAQ link to footer navigation, updated copyright to include company name, removed "We are Hiring" section, and removed "Jobs for Women" item

---

If you'd like, I can also:
- add a small `Makefile` or `powershell` script to run both frontend and backend together,
- add a `.env.example` at the repo root that combines the important environment values,
- create simple run scripts in `package.json` to orchestrate both services.

Completion summary: created top-level README with setup, run, and troubleshooting instructions for both backend and frontend. Updated to reflect multi-app architecture including new standalone FAQ app and footer updates (company name, removal of "We are Hiring" section, and removal of "Jobs for Women" item).  
