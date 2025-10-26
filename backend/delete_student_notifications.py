"""
Script to delete all notifications for student/intern users
"""
from app.db.session import SessionLocal
from app.models.notification import Notification
from app.models.user import User

def main():
    db = SessionLocal()
    
    try:
        # Get all student users
        students = db.query(User).filter(User.role == 'intern').all()
        student_ids = [s.id for s in students]
        
        print(f"📊 Found {len(students)} student users")
        
        # Get all notifications for these students
        student_notifications = db.query(Notification).filter(
            Notification.user_id.in_(student_ids)
        ).all()
        
        print(f"📊 Found {len(student_notifications)} notifications for students")
        
        if len(student_notifications) == 0:
            print("✅ No student notifications to delete")
            return
        
        # Show what will be deleted
        print("\n🗑️  Notifications to be deleted:")
        for notif in student_notifications:
            print(f"   • ID={notif.id}, user_id={notif.user_id}, type={notif.type}, title={notif.title}")
        
        # Confirm deletion
        confirm = input("\n⚠️  Are you sure you want to delete all these notifications? (yes/no): ")
        
        if confirm.lower() != 'yes':
            print("❌ Deletion cancelled")
            return
        
        # Delete notifications
        deleted_count = db.query(Notification).filter(
            Notification.user_id.in_(student_ids)
        ).delete(synchronize_session=False)
        
        db.commit()
        
        print(f"\n✅ Successfully deleted {deleted_count} student notifications")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    main()
