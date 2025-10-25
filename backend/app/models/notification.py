"""
Notification Model - For system notifications to users
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    
    # Recipient information
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    recipient_type = Column(String, nullable=False)  # 'intern' or 'company'
    
    # Notification content
    type = Column(String, nullable=False)  # 'internship_posted', 'application_received', 'offer_sent', etc.
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    
    # Related entity (optional)
    related_id = Column(String, nullable=True)  # internship_id, application_id, etc.
    related_type = Column(String, nullable=True)  # 'internship', 'application', etc.
    
    # Status
    is_read = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    read_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="notifications")

    def __repr__(self):
        return f"<Notification {self.id}: {self.title} for User {self.user_id}>"
