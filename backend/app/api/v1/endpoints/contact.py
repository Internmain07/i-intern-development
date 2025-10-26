from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.api.deps import get_db, get_current_user
from app.models.contact import ContactMessage, ContactStatus
from app.models.user import User
from app.utils.email import send_email
from app.core.config import settings

router = APIRouter()

# ============= Pydantic Schemas =============

class ContactSubmission(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class ContactResponse(BaseModel):
    id: int
    name: str
    email: str
    subject: str
    message: str
    status: str
    created_at: datetime
    replied_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ContactReply(BaseModel):
    reply_message: str

class ContactUpdateStatus(BaseModel):
    status: str
    admin_notes: Optional[str] = None

# ============= Public Endpoints =============

@router.post("/submit", status_code=status.HTTP_201_CREATED)
async def submit_contact_form(
    contact_data: ContactSubmission,
    db: Session = Depends(get_db)
):
    """
    Public endpoint - Submit a contact form (no authentication required)
    """
    try:
        # Create contact message in database
        new_contact = ContactMessage(
            name=contact_data.name,
            email=contact_data.email,
            subject=contact_data.subject,
            message=contact_data.message,
            status=ContactStatus.NEW
        )
        
        db.add(new_contact)
        db.commit()
        db.refresh(new_contact)
        
        # Send notification email to contact email (not admin)
        contact_email = getattr(settings, 'CONTACT_EMAIL', 'contact@i-intern.com')
        
        admin_text_body = f"""
New Contact Form Submission - I-Intern Platform

From: {contact_data.name} ({contact_data.email})
Subject: {contact_data.subject}
Submission ID: #{new_contact.id}
Submitted At: {new_contact.created_at.strftime('%B %d, %Y at %I:%M %p')}

Message:
{contact_data.message}

---
Reply to this email to respond directly to the user.
"""
        
        admin_html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }}
        .content {{
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .header {{
            background: linear-gradient(135deg, #1F7368 0%, #63D7C7 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }}
        .info-box {{
            background-color: #f0f8ff;
            border-left: 4px solid #1F7368;
            padding: 15px;
            margin: 15px 0;
        }}
        .message-box {{
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }}
        .label {{
            font-weight: bold;
            color: #1F7368;
            display: block;
            margin-bottom: 5px;
        }}
        .value {{
            color: #333;
            margin-bottom: 15px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <div class="header">
                <h2 style="margin: 0;">📬 New Contact Form Submission</h2>
                <p style="margin: 5px 0 0 0; font-size: 14px;">I-Intern Platform</p>
            </div>
            
            <div class="info-box">
                <p style="margin: 0;"><strong>🔔 You have received a new message from a user.</strong></p>
            </div>
            
            <div style="margin: 20px 0;">
                <span class="label">From:</span>
                <span class="value">{contact_data.name} ({contact_data.email})</span>
            </div>
            
            <div style="margin: 20px 0;">
                <span class="label">Subject:</span>
                <span class="value">{contact_data.subject}</span>
            </div>
            
            <div style="margin: 20px 0;">
                <span class="label">Message:</span>
                <div class="message-box">
                    {contact_data.message.replace(chr(10), '<br>')}
                </div>
            </div>
            
            <div style="margin: 20px 0;">
                <span class="label">Submission ID:</span>
                <span class="value">#{new_contact.id}</span>
            </div>
            
            <div style="margin: 20px 0;">
                <span class="label">Submitted At:</span>
                <span class="value">{new_contact.created_at.strftime('%B %d, %Y at %I:%M %p')}</span>
            </div>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <p style="margin: 0;"><strong>💡 Tip:</strong> Reply to this email to respond directly to the user at {contact_data.email}</p>
            </div>
        </div>
    </div>
</body>
</html>
        """
        
        # Send contact notification (don't fail if email fails)
        try:
            send_email(
                to_email=contact_email,
                subject=f"New Contact Form: {contact_data.subject}",
                body=admin_text_body,
                html_body=admin_html_body
            )
        except Exception as email_error:
            print(f"Failed to send contact notification email: {email_error}")
        
        # Send confirmation email to user
        user_text_body = f"""
Hello {contact_data.name},

Thank you for contacting I-Intern! We have received your message and our team will review it shortly.

Your Message Summary:
- Subject: {contact_data.subject}
- Reference ID: #{new_contact.id}

We typically respond within 24-48 hours during business hours (Monday-Friday, 9:00 AM - 6:00 PM IST).

If your inquiry is urgent, please feel free to reach out to us directly at contact@i-intern.com.

Best regards,
The I-Intern Team
        """
        
        user_html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }}
        .content {{
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .header {{
            background: linear-gradient(135deg, #1F7368 0%, #63D7C7 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        }}
        .checkmark {{
            font-size: 48px;
            margin-bottom: 10px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <div class="header">
                <div class="checkmark">✅</div>
                <h2 style="margin: 0;">Message Received!</h2>
            </div>
            
            <p>Hello {contact_data.name},</p>
            
            <p>Thank you for contacting I-Intern! We have received your message and our team will review it shortly.</p>
            
            <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0;"><strong>Your Message Summary:</strong></p>
                <p style="margin: 5px 0;"><strong>Subject:</strong> {contact_data.subject}</p>
                <p style="margin: 5px 0;"><strong>Reference ID:</strong> #{new_contact.id}</p>
            </div>
            
            <p>We typically respond within 24-48 hours during business hours (Monday-Friday, 9:00 AM - 6:00 PM IST).</p>
            
            <p>If your inquiry is urgent, please feel free to reach out to us directly at <a href="mailto:contact@i-intern.com">contact@i-intern.com</a>.</p>
            
            <p style="margin-top: 30px;">Best regards,<br>The I-Intern Team</p>
        </div>
    </div>
</body>
</html>
        """
        
        # Send confirmation to user (don't fail if email fails)
        try:
            send_email(
                to_email=contact_data.email,
                subject="Thank you for contacting I-Intern",
                body=user_text_body,
                html_body=user_html_body
            )
        except Exception as email_error:
            print(f"Failed to send confirmation email to user: {email_error}")
        
        return {
            "message": "Your message has been sent successfully! We'll get back to you soon.",
            "contact_id": new_contact.id
        }
        
    except Exception as e:
        db.rollback()
        print(f"Error submitting contact form: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit contact form. Please try again later."
        )

# ============= Admin Endpoints =============

@router.get("/messages", response_model=List[ContactResponse])
async def get_all_contact_messages(
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Admin endpoint - Get all contact messages with optional status filter
    """
    # Check if user is admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view contact messages"
        )
    
    query = db.query(ContactMessage)
    
    # Apply status filter if provided
    if status_filter:
        try:
            status_enum = ContactStatus(status_filter.lower())
            query = query.filter(ContactMessage.status == status_enum)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid status. Must be one of: {', '.join([s.value for s in ContactStatus])}"
            )
    
    messages = query.order_by(ContactMessage.created_at.desc()).all()
    
    return messages

@router.get("/messages/{message_id}", response_model=ContactResponse)
async def get_contact_message(
    message_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Admin endpoint - Get a specific contact message by ID
    """
    # Check if user is admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can view contact messages"
        )
    
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact message not found"
        )
    
    # Mark as read if it's new
    if message.status == ContactStatus.NEW:
        message.status = ContactStatus.READ
        db.commit()
        db.refresh(message)
    
    return message

@router.post("/messages/{message_id}/reply")
async def reply_to_contact_message(
    message_id: int,
    reply_data: ContactReply,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Admin endpoint - Reply to a contact message via email
    """
    # Check if user is admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can reply to contact messages"
        )
    
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact message not found"
        )
    
    # Send reply email
    reply_text = f"""
Hello {message.name},

Thank you for reaching out to us. Here's our response to your inquiry:

{reply_data.reply_message}

---
Your Original Message:
Subject: {message.subject}
{message.message}

---
If you have any further questions, please don't hesitate to contact us.

Best regards,
The I-Intern Support Team
    """
    
    reply_html = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }}
        .container {{
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }}
        .content {{
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .header {{
            background: linear-gradient(135deg, #1F7368 0%, #63D7C7 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }}
        .original-message {{
            background-color: #f9f9f9;
            border-left: 4px solid #ddd;
            padding: 15px;
            margin: 20px 0;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <div class="header">
                <h2 style="margin: 0;">I-Intern Support Response</h2>
            </div>
            
            <p>Hello {message.name},</p>
            
            <p>Thank you for reaching out to us. Here's our response to your inquiry:</p>
            
            <div style="background-color: #f0f8ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
                {reply_data.reply_message.replace(chr(10), '<br>')}
            </div>
            
            <div class="original-message">
                <p style="margin: 0 0 10px 0; font-size: 12px; color: #666;"><strong>Your Original Message:</strong></p>
                <p style="margin: 5px 0;"><strong>Subject:</strong> {message.subject}</p>
                <p style="margin: 5px 0;">{message.message}</p>
            </div>
            
            <p>If you have any further questions, please don't hesitate to contact us.</p>
            
            <p style="margin-top: 30px;">Best regards,<br>The I-Intern Support Team</p>
        </div>
    </div>
</body>
</html>
    """
    
    try:
        send_email(
            to_email=message.email,
            subject=f"Re: {message.subject}",
            body=reply_text,
            html_body=reply_html
        )
        
        # Update message status
        message.status = ContactStatus.REPLIED
        message.replied_at = datetime.utcnow()
        db.commit()
        
        return {"message": "Reply sent successfully"}
        
    except Exception as e:
        print(f"Failed to send reply email: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to send reply email"
        )

@router.patch("/messages/{message_id}/status")
async def update_contact_message_status(
    message_id: int,
    update_data: ContactUpdateStatus,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Admin endpoint - Update contact message status and add notes
    """
    # Check if user is admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update contact messages"
        )
    
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact message not found"
        )
    
    # Validate and update status
    try:
        status_enum = ContactStatus(update_data.status.lower())
        message.status = status_enum
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join([s.value for s in ContactStatus])}"
        )
    
    # Update admin notes if provided
    if update_data.admin_notes:
        message.admin_notes = update_data.admin_notes
    
    db.commit()
    db.refresh(message)
    
    return {"message": "Contact message updated successfully", "contact": message}

@router.delete("/messages/{message_id}")
async def delete_contact_message(
    message_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Admin endpoint - Delete a contact message
    """
    # Check if user is admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete contact messages"
        )
    
    message = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact message not found"
        )
    
    db.delete(message)
    db.commit()
    
    return {"message": "Contact message deleted successfully"}
