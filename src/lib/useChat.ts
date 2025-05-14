import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
  };
  chatId: string;
  createdAt: string;
  readBy: string[];
}

export interface ChatUser {
  id: string;
  name: string;
  isOnline: boolean;
}

export interface UseChat {
  connected: boolean;
  messages: ChatMessage[];
  sendMessage: (content: string, chatId: string) => void;
  typingUsers: Record<string, boolean>;
  startTyping: (chatId: string) => void;
  stopTyping: (chatId: string) => void;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  error: string | null;
}

export default function useChat(userId: string, userName: string): UseChat {
  const [connected, setConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentChatRef = useRef<string | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!userId) return;

    // First, make sure our socket.io server is running by hitting the API endpoint
    fetch('/api/socketio')
      .then(res => {
        if (!res.ok) throw new Error('Failed to initialize Socket.IO server');
        return res.json();
      })
      .then(() => {
        // Now we can connect to the Socket.IO server
        const socket = io({
          path: '/api/socketio',
          addTrailingSlash: false,
        });

        socket.on('connect', () => {
          console.log('Socket connected:', socket.id);
          setConnected(true);
          setError(null);
          
          // Register user with socket server
          socket.emit('user:login', userId);
        });

        socket.on('connect_error', (err) => {
          console.error('Socket connection error:', err);
          setConnected(false);
          setError('Failed to connect to chat server');
        });

        socket.on('disconnect', () => {
          console.log('Socket disconnected');
          setConnected(false);
        });

        socket.on('message:received', (message: ChatMessage) => {
          setMessages(prev => [...prev, message]);
        });

        socket.on('typing:update', ({ userId, isTyping }) => {
          setTypingUsers(prev => ({ ...prev, [userId]: isTyping }));
        });

        socketRef.current = socket;

        // Cleanup on unmount
        return () => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          socket.disconnect();
        };
      })
      .catch(err => {
        console.error('Failed to initialize chat:', err);
        setError('Failed to connect to chat server');
      });
  }, [userId]);

  // Function to send messages
  const sendMessage = useCallback((content: string, chatId: string) => {
    if (!socketRef.current || !connected || !content.trim()) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      sender: {
        id: userId,
        name: userName,
      },
      chatId,
      createdAt: new Date().toISOString(),
      readBy: [userId],
    };

    // Stop typing indicator when sending a message
    stopTyping(chatId);

    // Send the message to the server
    socketRef.current.emit('message:send', message);

    // Optimistically add message to state
    setMessages(prev => [...prev, message]);
  }, [connected, userId, userName]);

  // Join a chat room
  const joinChat = useCallback((chatId: string) => {
    if (!socketRef.current || !connected) return;
    
    // Leave the current chat if any
    if (currentChatRef.current && currentChatRef.current !== chatId) {
      leaveChat(currentChatRef.current);
    }
    
    console.log(`Joining chat: ${chatId}`);
    socketRef.current.emit('chat:join', chatId);
    currentChatRef.current = chatId;
    
    // Clear previous messages when joining a new chat
    setMessages([]);
    
    // Clear typing indicators
    setTypingUsers({});
  }, [connected]);

  // Leave a chat room
  const leaveChat = useCallback((chatId: string) => {
    if (!socketRef.current || !connected) return;
    
    console.log(`Leaving chat: ${chatId}`);
    socketRef.current.emit('chat:leave', chatId);
    
    if (currentChatRef.current === chatId) {
      currentChatRef.current = null;
    }
  }, [connected]);

  // Handle typing indicator start
  const startTyping = useCallback((chatId: string) => {
    if (!socketRef.current || !connected) return;
    
    socketRef.current.emit('typing:start', { chatId, userId });
    
    // Clear any existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Set a timeout to automatically stop typing after 3 seconds
    timeoutRef.current = setTimeout(() => {
      stopTyping(chatId);
    }, 3000);
  }, [connected, userId]);

  // Handle typing indicator stop
  const stopTyping = useCallback((chatId: string) => {
    if (!socketRef.current || !connected) return;
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    socketRef.current.emit('typing:stop', { chatId, userId });
  }, [connected, userId]);

  return {
    connected,
    messages,
    sendMessage,
    typingUsers,
    startTyping,
    stopTyping,
    joinChat,
    leaveChat,
    error,
  };
} 