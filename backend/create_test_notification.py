"""
Create test notifications for testing the notification system
"""
from app.db.session import SessionLocal
from app.models import Notification, User
from datetime import datetime

def create_test_notifications():
    db = SessionLocal()
    try:
        # Find an intern user
        intern_user = db.query(User).filter(User.role == 'intern').first()
        
        if not intern_user:
            print("❌ No intern users found in database")
            return
        
        print(f"✅ Found intern user: {intern_user.email}")
        
        # Create test notifications
        test_notifications = [
            {
                "user_id": intern_user.id,
                "recipient_type": "intern",
                "type": "application_received",
                "title": "Application Received",
                "message": "Your application for Software Engineer Intern at Tech Corp has been received and is under review.",
                "related_id": "1",
                "related_type": "application",
                "is_read": False
            },
            {
                "user_id": intern_user.id,
                "recipient_type": "intern",
                "type": "offer_sent",
                "title": "New Offer! 🎉",
                "message": "Congratulations! You have received an offer for the Data Analyst Intern position at Analytics Inc.",
                "related_id": "2",
                "related_type": "application",
                "is_read": False
            },
            {
                "user_id": intern_user.id,
                "recipient_type": "intern",
                "type": "internship_posted",
                "title": "New Matching Internship",
                "message": "A new internship matching your profile has been posted: Full Stack Developer Intern at StartupXYZ.",
                "related_id": "3",
                "related_type": "internship",
                "is_read": False
            }
        ]
        
        for notif_data in test_notifications:
            notification = Notification(**notif_data)
            db.add(notification)
        
        db.commit()
        print(f"✅ Created {len(test_notifications)} test notifications for {intern_user.email}")
        
        # Verify notifications were created
        count = db.query(Notification).filter(Notification.user_id == intern_user.id).count()
        print(f"✅ Total notifications for user: {count}")
        
    except Exception as e:
        print(f"❌ Error creating test notifications: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_notifications()
