import { useEffect, useState, useCallback } from 'react';
import { ChatService, Message, TypingStatus } from '@/services/ChatService';

interface UseChatProps {
  chatId: string;
  currentUserId: string;
  enabled?: boolean;
}

export const useChat = ({ chatId, currentUserId, enabled = true }: UseChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial messages
  const loadMessages = useCallback(async () => {
    if (!enabled || !chatId) return;
    
    try {
      setLoading(true);
      setError(null);
      const chatMessages = await ChatService.getChatMessages(chatId, 50, 0);
      setMessages(chatMessages);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [chatId, enabled]);

  // Send a message
  const sendMessage = useCallback(async (message: string, messageType: 'text' | 'order_update' | 'system' = 'text') => {
    if (!message.trim() || !enabled || !chatId || !currentUserId) return null;

    try {
      const userType = await getUserType(); // You'll need to implement this
      const sentMessage = await ChatService.sendMessage(
        chatId,
        currentUserId,
        userType,
        message.trim(),
        messageType
      );
      
      return sentMessage;
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      return null;
    }
  }, [chatId, currentUserId, enabled]);

  // Send typing indicator
  const sendTypingIndicator = useCallback(async (typing: boolean) => {
    if (!enabled || !chatId || !currentUserId) return;

    try {
      await ChatService.sendTypingIndicator(chatId, currentUserId, typing);
    } catch (err) {
      console.error('Error sending typing indicator:', err);
    }
  }, [chatId, currentUserId, enabled]);

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (!enabled || !chatId || !currentUserId) return;

    try {
      await ChatService.markMessagesAsRead(chatId, currentUserId);
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  }, [chatId, currentUserId, enabled]);

  // Setup polling-based subscription
  useEffect(() => {
    if (!enabled || !chatId) return;

    let lastMessageCount = 0;

    const unsubscribe = ChatService.subscribeToChat(
      chatId,
      (newMessage: Message) => {
        setMessages(prev => {
          // Avoid duplicates
          const exists = prev.some(msg => msg.id === newMessage.id);
          if (exists) return prev;
          
          const updated = [...prev, newMessage];
          lastMessageCount = updated.length;
          return updated;
        });
      },
      (updatedMessage: Message) => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === updatedMessage.id ? updatedMessage : msg
          )
        );
      },
      (typingStatus: TypingStatus) => {
        if (typingStatus.userId !== currentUserId) {
          setIsTyping(typingStatus.isTyping);
          
          // Auto-clear typing after 5 seconds
          if (typingStatus.isTyping) {
            setTimeout(() => setIsTyping(false), 5000);
          }
        }
      }
    );

    return unsubscribe;
  }, [chatId, currentUserId, enabled]);

  // Load initial messages
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Mark messages as read when viewing
  useEffect(() => {
    if (messages.length > 0) {
      markAsRead();
    }
  }, [messages.length, markAsRead]);

  // Helper function to get user type - you'll need to implement this
  const getUserType = async (): Promise<'customer' | 'chef'> => {
    // This should get the user type from your storage/context
    // For now, return a default
    return 'customer';
  };

  return {
    messages,
    isTyping,
    loading,
    error,
    sendMessage,
    sendTypingIndicator,
    markAsRead,
    loadMessages,
  };
};
