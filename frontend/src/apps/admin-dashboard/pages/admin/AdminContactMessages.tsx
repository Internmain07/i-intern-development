import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Eye, Reply, Trash2, CheckCircle, Clock, XCircle, Filter } from 'lucide-react';
import { contactService, type ContactMessage } from '@/services/contact.service';

const AdminContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAllMessages(statusFilter || undefined);
      setMessages(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching contact messages:', err);
      setError(err.response?.data?.detail || 'Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  // Handle view message
  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setReplyText('');
  };

  // Handle send reply
  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    try {
      setSendingReply(true);
      await contactService.replyToMessage(selectedMessage.id, { reply_message: replyText });
      setSuccessMessage('Reply sent successfully!');
      setReplyText('');
      setSelectedMessage(null);
      
      // Refresh messages
      await fetchMessages();
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error sending reply:', err);
      setError(err.response?.data?.detail || 'Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  // Handle update status
  const handleUpdateStatus = async (messageId: number, status: string) => {
    try {
      await contactService.updateMessageStatus(messageId, { status });
      setSuccessMessage('Status updated successfully!');
      await fetchMessages();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.detail || 'Failed to update status');
    }
  };

  // Handle delete message
  const handleDeleteMessage = async (messageId: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await contactService.deleteMessage(messageId);
      setSuccessMessage('Message deleted successfully!');
      setSelectedMessage(null);
      await fetchMessages();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Error deleting message:', err);
      setError(err.response?.data?.detail || 'Failed to delete message');
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
      new: { color: 'bg-blue-100 text-blue-800', icon: <Mail className="w-4 h-4" />, label: 'New' },
      read: { color: 'bg-yellow-100 text-yellow-800', icon: <Eye className="w-4 h-4" />, label: 'Read' },
      replied: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" />, label: 'Replied' },
      closed: { color: 'bg-gray-100 text-gray-800', icon: <XCircle className="w-4 h-4" />, label: 'Closed' },
    };

    const config = statusConfig[status] || statusConfig.new;
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.icon}
        <span>{config.label}</span>
      </span>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-600 mt-2">Manage and respond to user inquiries</p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
          >
            {successMessage}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {/* Filter */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Messages</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="closed">Closed</option>
            </select>
            <span className="text-gray-600">
              {messages.length} {messages.length === 1 ? 'message' : 'messages'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-teal-600 text-white">
              <h2 className="text-lg font-semibold">Messages</h2>
            </div>
            <div className="overflow-y-auto max-h-[600px]">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No messages found</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => handleViewMessage(message)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-teal-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{message.name}</h3>
                      {getStatusBadge(message.status)}
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-1">{message.subject}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(message.created_at)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            {selectedMessage ? (
              <div className="h-full flex flex-col">
                {/* Message Header */}
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedMessage.subject}</h2>
                      <p className="text-gray-600 mt-1">From: {selectedMessage.name} ({selectedMessage.email})</p>
                      <p className="text-sm text-gray-500 mt-1">{formatDate(selectedMessage.created_at)}</p>
                    </div>
                    {getStatusBadge(selectedMessage.status)}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <select
                      value={selectedMessage.status}
                      onChange={(e) => handleUpdateStatus(selectedMessage.id, e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Message Content */}
                <div className="p-6 flex-1 overflow-y-auto">
                  <h3 className="text-lg font-semibold mb-3">Message:</h3>
                  <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Reply Section */}
                <div className="p-6 border-t bg-gray-50">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Reply className="w-5 h-5 mr-2" />
                    Reply to {selectedMessage.name}
                  </h3>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || sendingReply}
                      className={`px-6 py-2 rounded-lg text-white font-semibold transition-colors flex items-center space-x-2 ${
                        !replyText.trim() || sendingReply
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-teal-600 hover:bg-teal-700'
                      }`}
                    >
                      {sendingReply ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Reply className="w-4 h-4" />
                          <span>Send Reply</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-12 text-center">
                <div>
                  <Mail className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl text-gray-500">Select a message to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContactMessages;
