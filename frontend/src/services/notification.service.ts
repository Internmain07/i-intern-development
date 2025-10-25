import { apiClient } from '@/api';

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  related_id?: string;
  related_type?: string;
  recipient_type: string;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

export interface NotificationResponse {
  unread_count: number;
}

export const notificationService = {
  /**
   * Get all notifications for the current user
   */
  async getNotifications(skip: number = 0, limit: number = 50, unreadOnly: boolean = false): Promise<Notification[]> {
    const response = await apiClient.get(
      `/api/v1/notifications?skip=${skip}&limit=${limit}&unread_only=${unreadOnly}`
    );
    return response;
  },

  /**
   * Get count of unread notifications
   */
  async getUnreadCount(): Promise<number> {
    const response: NotificationResponse = await apiClient.get('/api/v1/notifications/unread-count');
    return response.unread_count;
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: number): Promise<void> {
    await apiClient.put(`/api/v1/notifications/${notificationId}/read`, {});
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await apiClient.put('/api/v1/notifications/mark-all-read', {});
  },

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: number): Promise<void> {
    await apiClient.delete(`/api/v1/notifications/${notificationId}`);
  },

  /**
   * Delete all notifications
   */
  async deleteAllNotifications(): Promise<void> {
    await apiClient.delete('/api/v1/notifications/');
  },
};
