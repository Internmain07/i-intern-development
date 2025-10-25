from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime

from app.api import deps
from app.models.user import User
from app.models.notification import Notification as NotificationModel
from app.schemas.notification import Notification, NotificationCreate, NotificationUpdate

router = APIRouter()


@router.get("/", response_model=List[Notification])
def get_notifications(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    unread_only: bool = Query(False),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    Get notifications for the current user
    """
    query = db.query(NotificationModel).filter(
        NotificationModel.user_id == current_user.id
    )
    
    if unread_only:
        query = query.filter(NotificationModel.is_read == False)
    
    notifications = query.order_by(
        NotificationModel.created_at.desc()
    ).offset(skip).limit(limit).all()
    
    return notifications


@router.get("/unread-count")
def get_unread_count(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    Get count of unread notifications for the current user
    """
    count = db.query(NotificationModel).filter(
        NotificationModel.user_id == current_user.id,
        NotificationModel.is_read == False
    ).count()
    
    return {"unread_count": count}


@router.put("/{notification_id}/read")
def mark_notification_as_read(
    notification_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    Mark a notification as read
    """
    notification = db.query(NotificationModel).filter(
        NotificationModel.id == notification_id,
        NotificationModel.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    notification.read_at = datetime.utcnow()
    db.commit()
    db.refresh(notification)
    
    return {"message": "Notification marked as read"}


@router.put("/mark-all-read")
def mark_all_notifications_as_read(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    Mark all notifications as read for the current user
    """
    db.query(NotificationModel).filter(
        NotificationModel.user_id == current_user.id,
        NotificationModel.is_read == False
    ).update({
        "is_read": True,
        "read_at": datetime.utcnow()
    })
    db.commit()
    
    return {"message": "All notifications marked as read"}


@router.delete("/{notification_id}")
def delete_notification(
    notification_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    Delete a notification
    """
    notification = db.query(NotificationModel).filter(
        NotificationModel.id == notification_id,
        NotificationModel.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    db.delete(notification)
    db.commit()
    
    return {"message": "Notification deleted"}


@router.delete("/")
def delete_all_notifications(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    Delete all notifications for the current user
    """
    db.query(NotificationModel).filter(
        NotificationModel.user_id == current_user.id
    ).delete()
    db.commit()
    
    return {"message": "All notifications deleted"}


# Utility function to create notifications (can be called from other modules)
def create_notification(
    db: Session,
    user_id: int,
    notification_type: str,
    title: str,
    message: str,
    recipient_type: str,
    related_id: str = None,
    related_type: str = None
) -> NotificationModel:
    """
    Create a new notification for a user
    """
    notification = NotificationModel(
        user_id=user_id,
        type=notification_type,
        title=title,
        message=message,
        recipient_type=recipient_type,
        related_id=related_id,
        related_type=related_type
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification
