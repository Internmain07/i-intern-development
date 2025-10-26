"""
Database Migration Script for Internship History Feature

This script adds:
1. New internship_history table
2. New fields to applications table (internship dates and active status)

Run this script ONCE to update your database schema.
"""
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import create_engine, text
from app.core.config import settings
from app.db.base import Base

# Import all models to ensure they're registered
from app.models.user import User
from app.models.company import EmployerProfile
from app.models.profile import StudentProfile, WorkExperience, Project
from app.models.internship import Internship
from app.models.application import Application
from app.models.notification import Notification
from app.models.internship_history import InternshipHistory

print("=== Internship History Database Migration ===\n")

# Create engine
engine = create_engine(settings.DATABASE_URL)

print("Step 1: Creating new tables...")
try:
    # Create all tables (this will create internship_history if it doesn't exist)
    Base.metadata.create_all(bind=engine)
    print("✓ New tables created successfully\n")
except Exception as e:
    print(f"✗ Error creating tables: {e}\n")
    sys.exit(1)

print("Step 2: Adding new columns to applications table...")
migration_queries = [
    # Add new columns to applications table
    """
    ALTER TABLE applications 
    ADD COLUMN IF NOT EXISTS internship_start_date TIMESTAMP
    """,
    """
    ALTER TABLE applications 
    ADD COLUMN IF NOT EXISTS internship_end_date TIMESTAMP
    """,
    """
    ALTER TABLE applications 
    ADD COLUMN IF NOT EXISTS internship_completed_date TIMESTAMP
    """,
    """
    ALTER TABLE applications 
    ADD COLUMN IF NOT EXISTS is_currently_active BOOLEAN DEFAULT FALSE
    """
]

with engine.connect() as conn:
    for i, query in enumerate(migration_queries, 1):
        try:
            # For PostgreSQL, use ADD COLUMN IF NOT EXISTS
            # For SQLite, we need to check if column exists first
            if "sqlite" in settings.DATABASE_URL.lower():
                # SQLite doesn't support IF NOT EXISTS for ALTER TABLE
                # We'll handle this with a try-except
                try:
                    conn.execute(text(query.replace("ADD COLUMN IF NOT EXISTS", "ADD COLUMN")))
                    conn.commit()
                    print(f"✓ Migration {i}/4 completed")
                except Exception as e:
                    if "duplicate column" in str(e).lower():
                        print(f"✓ Migration {i}/4 skipped (column already exists)")
                    else:
                        raise
            else:
                # PostgreSQL supports IF NOT EXISTS
                conn.execute(text(query))
                conn.commit()
                print(f"✓ Migration {i}/4 completed")
        except Exception as e:
            print(f"✗ Migration {i}/4 failed: {e}")
            if "already exists" not in str(e).lower():
                conn.rollback()
                raise

print("\n✓ Migration completed successfully!")
print("\nNew features available:")
print("  - Internship history tracking")
print("  - Prevention of multiple concurrent internships")
print("  - Student experience badges")
print("  - History view for companies\n")
print("Next steps:")
print("  1. Restart your backend server")
print("  2. Test the new endpoints at /api/v1/internship-history/")
print("  3. Update frontend to show experience badges")
