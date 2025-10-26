import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle,
  Clock,
  Mail,
  Users,
  Trash2,
  CheckCheck
} from 'lucide-react';
import { notificationService, Notification } from '@/services/notification.service';
import { Button } from '../components/ui/Button';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, [filterType]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const unreadOnly = filterType === 'unread';
      const data = await notificationService.getNotifications(0, 100, unreadOnly);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleDeleteAllNotifications = async () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      try {
        await notificationService.deleteAllNotifications();
        fetchNotifications();
      } catch (error) {
        console.error('Error deleting all notifications:', error);
      }
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.related_type === 'application' && notification.related_id) {
      navigate('/company/applicants');
    } else if (notification.related_type === 'internship' && notification.related_id) {
      navigate('/company/internships');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application_received':
        return <Users className="w-6 h-6 text-blue-600" />;
      case 'offer_response':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'offer_sent':
        return <Mail className="w-6 h-6 text-purple-600" />;
      case 'internship_posted':
        return <CheckCircle className="w-6 h-6 text-teal-600" />;
      default:
        return <Bell className="w-6 h-6 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'application_received':
        return 'bg-blue-50 border-l-4 border-blue-500';
      case 'offer_response':
        return 'bg-green-50 border-l-4 border-green-500';
      case 'offer_sent':
        return 'bg-purple-50 border-l-4 border-purple-500';
      case 'internship_posted':
        return 'bg-teal-50 border-l-4 border-teal-500';
      default:
        return 'bg-gray-50 border-l-4 border-gray-500';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFAF3] via-white to-[#E8F5F3] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#004F4D] to-[#1F7368] rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#004F4D]">Notifications</h1>
                <p className="text-sm text-[#1F7368]">
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/company/dashboard')}
              className="border-[#004F4D] text-[#004F4D] hover:bg-[#E8F5F3]"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-[#63D7C7]/20 p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'all'
                    ? 'bg-[#004F4D] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Notifications
              </button>
              <button
                onClick={() => setFilterType('unread')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === 'unread'
                    ? 'bg-[#004F4D] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="border-[#1F7368] text-[#1F7368] hover:bg-[#E8F5F3]"
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteAllNotifications}
                  className="border-red-500 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete All
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-[#63D7C7]/20 p-12 text-center">
            <Clock className="w-12 h-12 text-[#1F7368] mx-auto mb-4 animate-spin" />
            <p className="text-[#1F7368]">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-[#63D7C7]/20 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {filterType === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {filterType === 'unread'
                ? 'All caught up! Check back later for new updates.'
                : 'You\'ll receive notifications when candidates apply to your internships.'}
            </p>
            {filterType === 'unread' && (
              <Button
                onClick={() => setFilterType('all')}
                className="bg-[#004F4D] hover:bg-[#1F7368]"
              >
                View All Notifications
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-lg shadow-sm border transition-all cursor-pointer hover:shadow-md ${
                  notification.is_read
                    ? 'border-gray-200 opacity-75'
                    : 'border-[#63D7C7]/30 shadow-sm'
                } ${getNotificationColor(notification.type)}`}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3
                          className={`text-base font-semibold ${
                            notification.is_read ? 'text-gray-700' : 'text-[#004F4D]'
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <div className="w-2.5 h-2.5 bg-[#1F7368] rounded-full ml-2 mt-1.5"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimeAgo(notification.created_at)}
                        </span>
                        {notification.read_at && (
                          <span className="text-green-600">Read</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {!notification.is_read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                          className="p-2 rounded-full hover:bg-green-100 text-green-600 transition-colors"
                          title="Mark as read"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDeleteNotification(notification.id, e)}
                        className="p-2 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
