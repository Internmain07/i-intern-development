# 🎓 I-Intern Platform

**A comprehensive internship management platform connecting students with companies.**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/)
[![Node](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

---

## 🌟 Features

### For Students/Interns
- 📝 **Profile Management** - Create and manage professional profiles
- 🔍 **Internship Search** - Browse and apply for internships
- 📄 **Resume Builder** - Built-in resume builder with templates
- 📊 **Application Tracking** - Track application status
- 🔔 **Notifications** - Real-time updates on applications
- 📚 **Internship History** - Track past and current internships

### For Companies
- 📢 **Post Internships** - Create and manage internship listings
- 👥 **Candidate Management** - Review and manage applications
- 💼 **Company Profile** - Showcase company information
- 📈 **Analytics** - Track posting performance
- ✉️ **Direct Communication** - Message applicants

### For Administrators
- 🎛️ **Dashboard** - Comprehensive admin panel
- 👤 **User Management** - Manage users and accounts
- 📋 **Content Moderation** - Review and approve content
- 📊 **Analytics** - Platform-wide analytics
- 💬 **Contact Management** - Handle contact form submissions

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL or Neon account
- Brevo account (for emails)

### Setup

```bash
# Clone repository
git clone https://github.com/Internmain07/i-intern-development.git
cd i-intern-development

# Follow detailed setup guide
# See QUICK_START.md for rapid setup
# See DEVELOPMENT_SETUP.md for complete guide
```

### Quick Commands

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\Activate.ps1          # Windows
source venv/bin/activate           # Mac/Linux
pip install -r requirements.txt
# Configure .env file
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📚 Documentation

### Getting Started
- **[Quick Start Guide](QUICK_START.md)** - Get running in 10 minutes ⚡
- **[Development Setup](DEVELOPMENT_SETUP.md)** - Complete setup guide 📖
- **[Production Deployment](PRODUCTION_DEPLOYMENT.md)** - Deploy to production 🚀

### Feature Documentation
- **[Internship History](INTERNSHIP_HISTORY_IMPLEMENTATION.md)** - Internship tracking feature
- **[Sharing Feature](INTERNSHIP_SHARING_FEATURE.md)** - Share internships
- **[Notification System](NOTIFICATION_SYSTEM_IMPLEMENTATION.md)** - Real-time notifications
- **[Resume Builder](backend/RESUME_BUILDER_INTEGRATION.md)** - Resume builder integration

### Technical Documentation
- **[API Documentation](http://localhost:8000/api/docs)** - Interactive API docs (dev only)
- **[CORS Configuration](backend/CORS_README.md)** - CORS setup guide
- **[Database Management](backend/CLEANUP_README.md)** - Database utilities
- **[Refactoring Guide](backend/REFACTORING_GUIDE.md)** - Code organization

---

## 🏗️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL (via Neon)
- **ORM**: SQLAlchemy
- **Authentication**: JWT (python-jose)
- **Email**: Brevo SMTP
- **PDF Generation**: WeasyPrint
- **Validation**: Pydantic

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Fetch API

### Deployment
- **Hosting**: Render.com
- **Database**: Neon (Serverless Postgres)
- **Email**: Brevo
- **Version Control**: GitHub

---

## 📁 Project Structure

```
i-intern-development/
├── backend/                     # FastAPI backend
│   ├── app/
│   │   ├── api/                # API endpoints
│   │   │   └── v1/
│   │   │       └── endpoints/  # Route handlers
│   │   ├── core/               # Core configuration
│   │   │   ├── config.py       # Settings
│   │   │   └── security.py     # Auth utilities
│   │   ├── db/                 # Database setup
│   │   │   ├── base.py
│   │   │   └── session.py
│   │   ├── models/             # SQLAlchemy models
│   │   ├── schemas/            # Pydantic schemas
│   │   └── utils/              # Utility functions
│   ├── uploads/                # User uploads
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example           # Environment template
│   └── verify_setup.py        # Setup verification
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── apps/              # Application modules
│   │   │   ├── landing/       # Landing pages
│   │   │   ├── auth/          # Authentication
│   │   │   ├── intern/        # Intern dashboard
│   │   │   ├── company/       # Company dashboard
│   │   │   └── admin/         # Admin dashboard
│   │   ├── shared/            # Shared components
│   │   ├── services/          # API services
│   │   └── api.ts            # API client
│   ├── package.json           # Node dependencies
│   └── .env.development       # Dev environment
│
├── DEVELOPMENT_SETUP.md       # Complete setup guide
├── QUICK_START.md             # Quick reference
├── PRODUCTION_DEPLOYMENT.md   # Deployment guide
└── README.md                  # This file
```

---

## 🌐 Live Deployment

### Production URLs
- **Frontend**: https://i-intern-2.onrender.com
- **Backend**: https://i-intern.onrender.com

### Development URLs
- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/api/docs

---

## 🛠️ Development Workflow

### Daily Development

```bash
# Pull latest changes
git pull origin merge

# Start backend (Terminal 1)
cd backend
venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Start frontend (Terminal 2)
cd frontend
npm run dev
```

### Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm run test

# Type checking
npm run type-check
```

### Code Quality

```bash
# Python linting
cd backend
pylint app/

# Frontend linting
cd frontend
npm run lint
```

---

## 📝 Environment Variables

### Backend Required Variables

```bash
SECRET_KEY=<generate-random>        # JWT secret
DATABASE_URL=postgresql://...       # Database connection
SMTP_USERNAME=<brevo-username>      # Email username
SMTP_PASSWORD=<brevo-password>      # Email password
FRONTEND_URL=http://localhost:8081  # Frontend URL
BACKEND_URL=http://localhost:8000   # Backend URL
ALLOWED_ORIGINS=http://...          # CORS origins
```

See `.env.example` for complete list.

### Frontend Required Variables

```bash
VITE_API_URL=http://localhost:8000  # Backend API URL
```

---

## 🔧 Useful Commands

### Backend

```bash
# Create admin user
python create_admin.py

# Test email
python test_brevo_email.py

# Database management
python fix_database.py
python check_tables.py

# Verify setup
python verify_setup.py
```

### Frontend

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Type check
npm run type-check
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines
- Follow existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation
- Ensure all tests pass

---

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**I-Intern Development Team**
- Backend Development
- Frontend Development
- UI/UX Design
- Project Management

---

## 📞 Support

### Documentation
- [Quick Start Guide](QUICK_START.md)
- [Development Setup](DEVELOPMENT_SETUP.md)
- [Production Deployment](PRODUCTION_DEPLOYMENT.md)

### Resources
- **GitHub**: https://github.com/Internmain07/i-intern-development
- **Issues**: Report bugs via GitHub Issues
- **Email**: i.intern.technologies@gmail.com

### Status Pages
- **Render**: https://status.render.com/
- **Neon**: https://neonstatus.com/

---

## 🎯 Roadmap

### Version 1.0 (Current)
- ✅ User authentication & authorization
- ✅ Internship posting & application
- ✅ Resume builder
- ✅ Notification system
- ✅ Admin dashboard
- ✅ Contact management

### Version 1.1 (Planned)
- 🔄 Real-time chat
- 🔄 Video interviews
- 🔄 Advanced search filters
- 🔄 Analytics dashboard
- 🔄 Mobile app

### Future Features
- AI-powered resume optimization
- Skill assessment tests
- Company verification system
- Referral program
- Multi-language support

---

## 🙏 Acknowledgments

- **FastAPI** - Amazing Python web framework
- **React** - Powerful UI library
- **Render** - Excellent hosting platform
- **Neon** - Serverless PostgreSQL
- **Brevo** - Reliable email service
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library

---

## 📊 Statistics

![GitHub Stars](https://img.shields.io/github/stars/Internmain07/i-intern-development?style=social)
![GitHub Forks](https://img.shields.io/github/forks/Internmain07/i-intern-development?style=social)
![GitHub Issues](https://img.shields.io/github/issues/Internmain07/i-intern-development)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Internmain07/i-intern-development)

---

**Made with ❤️ by the I-Intern Team**

---

**Last Updated**: October 26, 2025  
**Version**: 1.0.0
