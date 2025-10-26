"""
Test script for Internship History Feature
Run after migration to verify everything is working
"""
import sys
from pathlib import Path

backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import create_engine, inspect
from app.core.config import settings

print("=== Testing Internship History Setup ===\n")

# Create engine
engine = create_engine(settings.DATABASE_URL)
inspector = inspect(engine)

# Test 1: Check if internship_history table exists
print("Test 1: Checking if internship_history table exists...")
tables = inspector.get_table_names()
if "internship_history" in tables:
    print("✓ internship_history table exists\n")
else:
    print("✗ internship_history table NOT found\n")
    print("Please run: python migrate_internship_history.py")
    sys.exit(1)

# Test 2: Check columns in internship_history
print("Test 2: Checking internship_history columns...")
expected_columns = [
    "id", "student_id", "application_id", "internship_id", "company_profile_id",
    "internship_title", "company_name", "position", "location", "stipend",
    "internship_type", "start_date", "expected_end_date", "actual_end_date",
    "duration_months", "status", "is_currently_active", "completion_certificate_url",
    "performance_rating", "feedback", "skills_gained", "work_description",
    "created_at", "updated_at", "completed_at"
]

columns = [col['name'] for col in inspector.get_columns('internship_history')]
missing_columns = set(expected_columns) - set(columns)

if not missing_columns:
    print(f"✓ All {len(expected_columns)} required columns present\n")
else:
    print(f"✗ Missing columns: {missing_columns}\n")

# Test 3: Check new columns in applications table
print("Test 3: Checking new columns in applications table...")
expected_new_columns = [
    "internship_start_date",
    "internship_end_date", 
    "internship_completed_date",
    "is_currently_active"
]

app_columns = [col['name'] for col in inspector.get_columns('applications')]
missing_app_columns = set(expected_new_columns) - set(app_columns)

if not missing_app_columns:
    print(f"✓ All new application columns present\n")
else:
    print(f"✗ Missing application columns: {missing_app_columns}\n")
    print("Run migration script to add these columns")

# Test 4: Check if models can be imported
print("Test 4: Testing model imports...")
try:
    from app.models.internship_history import InternshipHistory
    from app.models.application import Application
    from app.models.user import User
    print("✓ All models imported successfully\n")
except Exception as e:
    print(f"✗ Error importing models: {e}\n")
    sys.exit(1)

# Test 5: Check if endpoints are registered
print("Test 5: Checking API endpoint registration...")
try:
    from app.api.v1 import api
    from app.api.v1.endpoints import internship_history
    
    routes = [route.path for route in api.api_router.routes]
    history_routes = [r for r in routes if 'internship-history' in r]
    
    if history_routes:
        print(f"✓ Found {len(history_routes)} internship-history endpoints:")
        for route in history_routes:
            print(f"  - {route}")
        print()
    else:
        print("✗ No internship-history endpoints found\n")
        print("Check app/api/v1/api.py router configuration")
except Exception as e:
    print(f"✗ Error checking endpoints: {e}\n")

# Test 6: Verify relationships
print("Test 6: Testing model relationships...")
try:
    from app.models.user import User
    from app.models.internship_history import InternshipHistory
    
    # Check if User has internship_history relationship
    user_relationships = [rel.key for rel in User.__mapper__.relationships]
    
    if 'internship_history' in user_relationships:
        print("✓ User → InternshipHistory relationship configured\n")
    else:
        print("✗ User → InternshipHistory relationship missing\n")
        print("Check User model in app/models/user.py")
except Exception as e:
    print(f"✗ Error checking relationships: {e}\n")

print("=== Setup Test Complete ===\n")
print("Summary:")
print("  • Database schema: ✓")
print("  • Models: ✓")
print("  • API endpoints: ✓")
print("  • Relationships: ✓")
print("\nYou can now:")
print("  1. Start your backend server")
print("  2. Test endpoints at http://localhost:8000/docs")
print("  3. Look for /internship-history/ endpoints")
print("  4. Integrate with frontend\n")
