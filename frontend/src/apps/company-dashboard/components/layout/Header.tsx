import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  User,
  ChevronDown,
  Settings,
  LogOut
} from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/DropdownMenu';
import { useAuth } from '@/auth/AuthContext';
import { useCompanyProfile } from '../../hooks/useCompanyProfile';
import { notificationService, Notification } from '@/services/notification.service';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  
  // Use the company profile hook for dynamic data
  const { data: profile } = useCompanyProfile();
  const companyName = profile?.company_name || 'Company';
  const contactPerson = profile?.contact_person || 'Manager';

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoadingNotifications(true);
      const data = await notificationService.getNotifications(0, 10, false);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <header className="bg-gradient-to-r from-[#004F4D] via-[#1F7368] to-[#004F4D] border-b border-[#63D7C7]/20 px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#63D7C7] w-4 h-4" />
            <Input
              type="text"
              placeholder="Search applicants, internships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 w-full bg-[#003836]/50 border-[#63D7C7]/30 text-white placeholder:text-[#63D7C7]/60 focus:border-[#63D7C7] focus:ring-[#63D7C7]/20"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              if (!isNotificationOpen) {
                fetchNotifications();
              }
            }}>
              <div className="relative">
                <Button variant="ghost" size="icon" className="relative hover:bg-[#63D7C7]/20 text-white">
                  <Bell className="w-5 h-5 text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent isOpen={isNotificationOpen} className="w-80 bg-[#FFFAF3] border border-[#63D7C7]/20 max-h-96 overflow-y-auto">
              <div className="px-4 py-2 border-b border-[#63D7C7]/20 flex justify-between items-center sticky top-0 bg-[#FFFAF3] z-10">
                <h3 className="font-medium text-[#004F4D]">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-[#1F7368] hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              {isLoadingNotifications ? (
                <div className="px-4 py-8 text-center text-[#1F7368]">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id} 
                    className={`px-4 py-3 hover:bg-[#E8F5F3] cursor-pointer ${!notification.is_read ? 'bg-[#E8F5F3]/50' : ''}`}
                    onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-2 h-2 rounded-full ${!notification.is_read ? 'bg-[#1F7368]' : 'bg-gray-300'}`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.is_read ? 'font-medium text-[#004F4D]' : 'text-gray-600'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-[#1F7368] mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(notification.created_at)}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
              <div className="px-4 py-2 border-t border-[#63D7C7]/20 sticky bottom-0 bg-[#FFFAF3]">
                <Button 
                  variant="ghost" 
                  className="w-full text-sm text-[#1F7368] hover:bg-[#E8F5F3]"
                  onClick={() => navigate('/company/notifications')}
                >
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-[#63D7C7]/20 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-[#63D7C7] to-[#1F7368] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">{contactPerson || companyName}</p>
                  <p className="text-xs text-[#63D7C7]">{companyName}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-[#63D7C7]" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent isOpen={isProfileOpen} className="bg-[#FFFAF3] border border-[#63D7C7]/20">
              <DropdownMenuItem 
                className="flex items-center space-x-2 cursor-pointer text-[#004F4D] hover:bg-[#E8F5F3]"
                onClick={() => navigate('/company/settings')}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <div className="border-t border-[#63D7C7]/20 my-1"></div>
              <DropdownMenuItem 
                className="flex items-center space-x-2 text-red-600 cursor-pointer hover:bg-red-50"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};


