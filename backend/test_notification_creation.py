"""
Test script to create a notification for a student and verify it works
"""
from app.db.session import SessionLocal
from app.models.notification import Notification
from app.models.user import User
from datetime import datetime

def main():
    db = SessionLocal()
    
    try:
        # Get a student user (user_id=1 is deepakumas700@gmail.com)
        student = db.query(User).filter(User.id == 1).first()
        
        if not student:
            print("❌ Student user not found!")
            return
        
        print(f"✅ Found student: {student.email} (ID: {student.id})")
        
        # Check existing notifications
        existing_notifs = db.query(Notification).filter(
            Notification.user_id == student.id
        ).all()
        
        print(f"\n📊 Existing notifications for user {student.id}: {len(existing_notifs)}")
        for notif in existing_notifs:
            print(f"   • ID={notif.id}, type={notif.type}, title={notif.title}, is_read={notif.is_read}")
        
        # Create a new test notification
        new_notification = Notification(
            user_id=student.id,
            type='test_notification',
            title='Test Notification',
            message='This is a test notification to verify the system is working',
            recipient_type='intern',
            is_read=False,
            created_at=datetime.utcnow()
        )
        
        db.add(new_notification)
        db.commit()
        db.refresh(new_notification)
        
        print(f"\n✅ Created new notification ID={new_notification.id}")
        
        # Verify it was created
        check_notif = db.query(Notification).filter(
            Notification.id == new_notification.id
        ).first()
        
        if check_notif:
            print(f"✅ Verified notification exists in DB")
            print(f"   ID: {check_notif.id}")
            print(f"   User ID: {check_notif.user_id}")
            print(f"   Type: {check_notif.type}")
            print(f"   Title: {check_notif.title}")
            print(f"   Is Read: {check_notif.is_read}")
        else:
            print("❌ Could not verify notification!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    main()
