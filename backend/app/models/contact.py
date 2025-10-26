from sqlalchemy import Column, String, Text, DateTime, Integer, Enum as SQLEnum
from sqlalchemy.sql import func
from app.db.base import Base
import enum

class ContactStatus(enum.Enum):
    NEW = "new"
    READ = "read"
    REPLIED = "replied"
    CLOSED = "closed"

class ContactMessage(Base):
    """Contact form submissions from users"""
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    subject = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(SQLEnum(ContactStatus), default=ContactStatus.NEW, nullable=False)
    admin_notes = Column(Text, nullable=True)  # For admin to add internal notes
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    replied_at = Column(DateTime(timezone=True), nullable=True)  # When admin replied
