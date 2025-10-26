"""
Migration script to add contact_messages table
Run this script to create the contact_messages table in your database
"""
from sqlalchemy import create_engine
from app.core.config import settings
from app.models.contact import ContactMessage, ContactStatus
from app.db.base import Base

def create_contact_table():
    """Create the contact_messages table"""
    try:
        # Create database engine
        engine = create_engine(settings.DATABASE_URL)
        
        print("Creating contact_messages table...")
        
        # Create the table
        ContactMessage.__table__.create(engine, checkfirst=True)
        
        print("✅ contact_messages table created successfully!")
        print(f"Table: {ContactMessage.__tablename__}")
        print(f"Columns: {', '.join([col.name for col in ContactMessage.__table__.columns])}")
        
    except Exception as e:
        print(f"❌ Error creating table: {str(e)}")
        raise

if __name__ == "__main__":
    create_contact_table()
