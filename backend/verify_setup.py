"""
I-Intern Setup Verification Script
===================================
This script verifies your development environment setup.
Run this after completing DEVELOPMENT_SETUP.md steps.
"""

import sys
import os
import subprocess
from pathlib import Path

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text:^60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}\n")

def print_success(text):
    print(f"{Colors.GREEN}✓ {text}{Colors.END}")

def print_error(text):
    print(f"{Colors.RED}✗ {text}{Colors.END}")

def print_warning(text):
    print(f"{Colors.YELLOW}⚠ {text}{Colors.END}")

def print_info(text):
    print(f"{Colors.BLUE}ℹ {text}{Colors.END}")

def check_python_version():
    """Check Python version"""
    print_info("Checking Python version...")
    version = sys.version_info
    if version.major == 3 and version.minor >= 11:
        print_success(f"Python {version.major}.{version.minor}.{version.micro}")
        return True
    else:
        print_error(f"Python {version.major}.{version.minor}.{version.micro} (Need 3.11+)")
        return False

def check_virtual_env():
    """Check if virtual environment is activated"""
    print_info("Checking virtual environment...")
    if hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print_success("Virtual environment is activated")
        return True
    else:
        print_error("Virtual environment is NOT activated")
        print_warning("  Run: venv\\Scripts\\Activate.ps1 (Windows) or source venv/bin/activate (Mac/Linux)")
        return False

def check_dependencies():
    """Check if required packages are installed"""
    print_info("Checking required packages...")
    required = [
        'fastapi',
        'uvicorn',
        'sqlalchemy',
        'pydantic',
        'python-jose',
        'passlib',
        'python-multipart',
        'brevo-python'
    ]
    
    all_ok = True
    for package in required:
        try:
            __import__(package.replace('-', '_'))
            print_success(f"{package}")
        except ImportError:
            print_error(f"{package} - NOT INSTALLED")
            all_ok = False
    
    if not all_ok:
        print_warning("\n  Run: pip install -r requirements.txt")
    
    return all_ok

def check_env_file():
    """Check if .env file exists and has required variables"""
    print_info("Checking .env file...")
    
    env_path = Path('.env')
    if not env_path.exists():
        print_error(".env file not found")
        print_warning("  Run: Copy-Item .env.example .env (Windows) or cp .env.example .env (Mac/Linux)")
        return False
    
    print_success(".env file exists")
    
    # Check required variables
    required_vars = [
        'SECRET_KEY',
        'DATABASE_URL',
        'SMTP_SERVER',
        'SMTP_PORT',
        'SMTP_USERNAME',
        'SMTP_PASSWORD',
        'FROM_EMAIL',
        'CONTACT_EMAIL',
        'ADMIN_EMAIL',
        'FRONTEND_URL',
        'BACKEND_URL',
        'ALLOWED_ORIGINS',
        'ENVIRONMENT'
    ]
    
    missing = []
    with open(env_path, 'r') as f:
        content = f.read()
        for var in required_vars:
            if f"{var}=" not in content:
                missing.append(var)
            elif f"{var}=your-" in content or f"{var}=<" in content or f"{var}=postgresql://user:password" in content:
                print_warning(f"  {var} - Using example value (need to update)")
    
    if missing:
        print_error(f"Missing variables: {', '.join(missing)}")
        return False
    
    print_success("All required variables present")
    return True

def check_database_connection():
    """Check database connection"""
    print_info("Checking database connection...")
    
    try:
        from app.db.session import engine
        from sqlalchemy import text
        
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        
        print_success("Database connection successful")
        return True
    except Exception as e:
        print_error(f"Database connection failed: {str(e)}")
        print_warning("  Check DATABASE_URL in .env")
        return False

def check_email_config():
    """Check email configuration"""
    print_info("Checking email configuration...")
    
    try:
        from app.core.config import settings
        
        if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
            print_error("SMTP credentials not configured")
            return False
        
        if "your-" in settings.SMTP_USERNAME or "your-" in settings.SMTP_PASSWORD:
            print_warning("Using example SMTP credentials")
            return False
        
        print_success("Email configuration looks good")
        return True
    except Exception as e:
        print_error(f"Email configuration check failed: {str(e)}")
        return False

def check_uploads_directory():
    """Check if uploads directory exists"""
    print_info("Checking uploads directory...")
    
    uploads = Path('uploads')
    avatars = uploads / 'avatars'
    logos = uploads / 'logos'
    
    uploads.mkdir(exist_ok=True)
    avatars.mkdir(exist_ok=True)
    logos.mkdir(exist_ok=True)
    
    print_success("Uploads directory structure created")
    return True

def generate_secret_key():
    """Generate a new secret key"""
    import secrets
    return secrets.token_urlsafe(32)

def main():
    """Main verification function"""
    print_header("I-INTERN SETUP VERIFICATION")
    
    # Change to backend directory if not already there
    if Path('backend').exists():
        os.chdir('backend')
    
    checks = {
        "Python Version": check_python_version(),
        "Virtual Environment": check_virtual_env(),
        "Dependencies": check_dependencies(),
        "Environment File": check_env_file(),
        "Uploads Directory": check_uploads_directory(),
    }
    
    # Only check these if basic setup is done
    if checks["Environment File"]:
        checks["Database Connection"] = check_database_connection()
        checks["Email Configuration"] = check_email_config()
    
    # Summary
    print_header("VERIFICATION SUMMARY")
    
    passed = sum(1 for result in checks.values() if result)
    total = len(checks)
    
    for check, result in checks.items():
        if result:
            print_success(f"{check}")
        else:
            print_error(f"{check}")
    
    print(f"\n{Colors.BOLD}Result: {passed}/{total} checks passed{Colors.END}\n")
    
    if passed == total:
        print_success("✓ Setup verification complete! You're ready to start development.")
        print_info("\nNext steps:")
        print("  1. Run backend: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
        print("  2. Run frontend: cd ../frontend && npm run dev")
        print("  3. Visit: http://localhost:8080/")
    else:
        print_warning("⚠ Some checks failed. Please review the errors above.")
        print_info("\nRefer to DEVELOPMENT_SETUP.md for detailed instructions.")
    
    # Offer to generate SECRET_KEY if needed
    if not checks["Environment File"]:
        print(f"\n{Colors.BOLD}Generate SECRET_KEY?{Colors.END}")
        response = input("Generate a new SECRET_KEY? (y/n): ").strip().lower()
        if response == 'y':
            key = generate_secret_key()
            print(f"\n{Colors.GREEN}Generated SECRET_KEY:{Colors.END}")
            print(f"{Colors.BOLD}{key}{Colors.END}")
            print(f"\nAdd this to your .env file:")
            print(f"SECRET_KEY={key}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}Verification cancelled.{Colors.END}")
        sys.exit(0)
    except Exception as e:
        print(f"\n{Colors.RED}Error: {str(e)}{Colors.END}")
        sys.exit(1)
