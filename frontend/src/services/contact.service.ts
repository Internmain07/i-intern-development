import { apiClient } from '@/api';

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  replied_at?: string;
  admin_notes?: string;
}

export interface ContactReply {
  reply_message: string;
}

export interface ContactUpdateStatus {
  status: string;
  admin_notes?: string;
}

class ContactService {
  /**
   * Submit a contact form (public endpoint - no authentication required)
   */
  async submitContactForm(data: ContactSubmission): Promise<{ message: string; contact_id: number }> {
    const response = await apiClient.post('/api/v1/contact/submit', data);
    return response; // apiClient already returns the parsed JSON data directly
  }

  /**
   * Get all contact messages (admin only)
   */
  async getAllMessages(statusFilter?: string): Promise<ContactMessage[]> {
    const endpoint = statusFilter ? `/api/v1/contact/messages?status_filter=${statusFilter}` : '/api/v1/contact/messages';
    const response = await apiClient.get(endpoint);
    return response; // apiClient already returns the parsed JSON data directly
  }

  /**
   * Get a specific contact message by ID (admin only)
   */
  async getMessageById(messageId: number): Promise<ContactMessage> {
    const response = await apiClient.get(`/api/v1/contact/messages/${messageId}`);
    return response; // apiClient already returns the parsed JSON data directly
  }

  /**
   * Reply to a contact message via email (admin only)
   */
  async replyToMessage(messageId: number, replyData: ContactReply): Promise<{ message: string }> {
    const response = await apiClient.post(`/api/v1/contact/messages/${messageId}/reply`, replyData);
    return response; // apiClient already returns the parsed JSON data directly
  }

  /**
   * Update contact message status (admin only)
   */
  async updateMessageStatus(messageId: number, updateData: ContactUpdateStatus): Promise<{ message: string; contact: ContactMessage }> {
    const response = await apiClient.patch(`/api/v1/contact/messages/${messageId}/status`, updateData);
    return response; // apiClient already returns the parsed JSON data directly
  }

  /**
   * Delete a contact message (admin only)
   */
  async deleteMessage(messageId: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/api/v1/contact/messages/${messageId}`);
    return response; // apiClient already returns the parsed JSON data directly
  }
}

export const contactService = new ContactService();
export default contactService;
