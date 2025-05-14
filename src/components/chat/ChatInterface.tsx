"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import useChat, { ChatMessage as RealTimeChatMessage } from "@/lib/useChat";

// Mock data for chat
interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
  };
  createdAt: string;
  readBy: string[];
}

interface ChatContact {
  id: string;
  name: string;
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
  isOnline: boolean;
  avatar?: string;
}

export default function ChatInterface() {
  const { data: session } = useSession();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [mockDataLoaded, setMockDataLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize real-time chat if user is authenticated
  const {
    connected,
    messages: realTimeMessages,
    sendMessage: sendRealTimeMessage,
    typingUsers,
    startTyping,
    stopTyping,
    joinChat,
    leaveChat,
    error: chatError
  } = useChat(
    session?.user?.id || "anonymous",
    session?.user?.name || "Anonymous User"
  );

  // Track typing state
  const [isTyping, setIsTyping] = useState(false);
  
  // Mock data initialization
  useEffect(() => {
    if (mockDataLoaded) return;
    
    // In a real app, this would be fetched from an API
    const mockContacts: ChatContact[] = [
      {
        id: "1",
        name: "John Smith",
        lastMessage: {
          content: "Do you have any organic tomatoes available?",
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        },
        unreadCount: 2,
        isOnline: true,
      },
      {
        id: "2",
        name: "Farm Fresh Buyers",
        lastMessage: {
          content: "We're interested in your wheat shipment",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        unreadCount: 0,
        isOnline: false,
      },
      {
        id: "3",
        name: "Sarah Johnson",
        lastMessage: {
          content: "The order has been shipped and should arrive tomorrow.",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
        unreadCount: 0,
        isOnline: true,
      },
    ];
    
    setContacts(mockContacts);
    setMockDataLoaded(true);
    
    // Set default active chat
    if (!activeChat && mockContacts.length > 0) {
      setActiveChat(mockContacts[0].id);
      loadMessages(mockContacts[0].id);
    }
  }, [activeChat, mockDataLoaded]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, realTimeMessages]);

  // Join the active chat room when it changes
  useEffect(() => {
    if (activeChat && connected) {
      joinChat(activeChat);
      
      // Load mock messages initially, but then real-time messages will take over
      loadMessages(activeChat);
    }
    
    return () => {
      if (activeChat && connected) {
        leaveChat(activeChat);
      }
    };
  }, [activeChat, connected, joinChat, leaveChat]);

  // Sync real-time messages with our local state
  useEffect(() => {
    if (connected && realTimeMessages.length > 0) {
      // Convert real-time messages to our local format
      const formattedMessages: ChatMessage[] = realTimeMessages.map(rtm => ({
        id: rtm.id,
        content: rtm.content,
        sender: {
          id: rtm.sender.id,
          name: rtm.sender.name,
        },
        createdAt: rtm.createdAt,
        readBy: rtm.readBy,
      }));
      
      setMessages(formattedMessages);
    }
  }, [connected, realTimeMessages]);

  // Update contacts when typing status changes
  useEffect(() => {
    if (!activeChat || !connected) return;
    
    const updatedContacts = contacts.map(contact => {
      if (contact.id === activeChat) {
        return {
          ...contact,
          isTyping: !!typingUsers[contact.id]
        };
      }
      return contact;
    });
    
    setContacts(updatedContacts);
  }, [activeChat, connected, contacts, typingUsers]);
  
  // Load messages for a chat
  const loadMessages = (chatId: string) => {
    // In a real app, this would fetch messages from an API
    // Only load mock messages if real-time is not connected
    if (connected) return;
    
    // Mock messages
    const mockMessages: ChatMessage[] = [];
    
    // Generate between 5-15 mock messages
    const count = 5 + Math.floor(Math.random() * 10);
    const contact = contacts.find((c) => c.id === chatId);
    
    if (!contact || !session?.user) return;
    
    for (let i = 0; i < count; i++) {
      const isMe = i % 2 === 0;
      const timeOffset = (count - i) * (Math.random() * 10000 + 60000); // Random minutes ago
      
      mockMessages.push({
        id: `msg-${chatId}-${i}`,
        content: isMe
          ? generateRandomMessage("seller")
          : generateRandomMessage("buyer"),
        sender: {
          id: isMe ? session.user.id : contact.id,
          name: isMe ? session.user.name : contact.name,
        },
        createdAt: new Date(Date.now() - timeOffset).toISOString(),
        readBy: isMe ? [session.user.id, contact.id] : [contact.id],
      });
    }
    
    // Sort by createdAt
    mockMessages.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    setMessages(mockMessages);
    
    // Mark contact as read
    setContacts((prev) =>
      prev.map((c) =>
        c.id === chatId ? { ...c, unreadCount: 0 } : c
      )
    );
  };
  
  // Helper to generate random messages
  const generateRandomMessage = (role: "buyer" | "seller") => {
    const buyerMessages = [
      "Hello, do you have any inventory available?",
      "What's the price for your products?",
      "Can you deliver to my location?",
      "Do you offer any discounts for bulk orders?",
      "Is your produce organic?",
      "When will the next harvest be ready?",
      "Can I visit your farm?",
      "Do you have any specialty items?",
      "I'm interested in your recent listing.",
      "What payment methods do you accept?",
    ];
    
    const sellerMessages = [
      "Yes, we have multiple items in stock.",
      "Our prices are competitive and based on current market rates.",
      "We can arrange delivery to your location.",
      "We do offer discounts for orders above certain quantities.",
      "Yes, all our produce is certified organic.",
      "The next harvest will be ready in about 2 weeks.",
      "You're welcome to visit our farm, just let me know when.",
      "We have several specialty items available right now.",
      "Thank you for your interest! What quantity are you looking for?",
      "We accept bank transfers, cash, and mobile payments.",
    ];
    
    const messages = role === "buyer" ? buyerMessages : sellerMessages;
    return messages[Math.floor(Math.random() * messages.length)];
  };
  
  // Handle changing active chat
  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
    loadMessages(chatId);
  };
  
  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !activeChat || !session?.user) return;
    
    if (connected) {
      // Send through real-time system
      sendRealTimeMessage(message, activeChat);
    } else {
      // Send through mock system
      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        content: message,
        sender: {
          id: session.user.id,
          name: session.user.name,
        },
        createdAt: new Date().toISOString(),
        readBy: [session.user.id],
      };
      
      setMessages((prev) => [...prev, newMessage]);
      
      // Update last message in contacts
      setContacts((prev) =>
        prev.map((c) =>
          c.id === activeChat
            ? {
                ...c,
                lastMessage: {
                  content: message,
                  createdAt: new Date().toISOString(),
                },
              }
            : c
        )
      );
    }
    
    setMessage("");
  };

  // Handle typing events
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    if (connected && activeChat) {
      if (value && !isTyping) {
        setIsTyping(true);
        startTyping(activeChat);
      } else if (!value && isTyping) {
        setIsTyping(false);
        stopTyping(activeChat);
      }
    }
  };
  
  // Format time for display
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  
  // Format date for chat list
  const formatLastMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (diffDays === 0) {
      return formatMessageTime(dateString);
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
    }
  };

  // Get any active typers in the current chat
  const getActiveTypers = () => {
    if (!activeChat || !connected) return [];
    
    return Object.entries(typingUsers)
      .filter(([userId, isTyping]) => isTyping && userId !== session?.user?.id)
      .map(([userId]) => {
        const contact = contacts.find(c => c.id === userId);
        return contact ? contact.name : 'Someone';
      });
  };
  
  const activeTypers = getActiveTypers();
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-[calc(100vh-12rem)]">
      <div className="flex h-full">
        {/* Contacts sidebar */}
        <div className="w-1/3 border-r border-gray-200 bg-gray-50">
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg">Messages</h2>
            {connected && (
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs text-gray-500">Connected</span>
              </div>
            )}
          </div>
          
          <div className="overflow-y-auto h-[calc(100%-60px)]">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
                  activeChat === contact.id ? "bg-gray-100" : ""
                }`}
                onClick={() => handleChatSelect(contact.id)}
              >
                <div className="flex items-start">
                  <div className="relative">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-lg font-semibold text-green-700">
                      {contact.name.charAt(0)}
                    </div>
                    {contact.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-baseline">
                      <p className="font-medium">{contact.name}</p>
                      {contact.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatLastMessageDate(contact.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      {typingUsers[contact.id] ? (
                        <p className="text-sm text-gray-600 font-italic">
                          Typing...
                        </p>
                      ) : contact.lastMessage ? (
                        <p className="text-sm text-gray-600 truncate max-w-[180px]">
                          {contact.lastMessage.content}
                        </p>
                      ) : null}
                      
                      {contact.unreadCount > 0 && (
                        <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {contact.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat area */}
        <div className="w-2/3 flex flex-col">
          {activeChat ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center">
                  <div className="mr-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg font-semibold text-green-700">
                      {contacts.find((c) => c.id === activeChat)?.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {contacts.find((c) => c.id === activeChat)?.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {contacts.find((c) => c.id === activeChat)?.isOnline
                        ? "Online"
                        : "Offline"}
                    </p>
                  </div>
                </div>
                
                <div>
                  <Link
                    href="#"
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isMe = msg.sender.id === session?.user?.id;
                    
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            isMe
                              ? "bg-green-600 text-white"
                              : "bg-white border border-gray-200"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p
                            className={`text-xs mt-1 text-right ${
                              isMe ? "text-green-100" : "text-gray-500"
                            }`}
                          >
                            {formatMessageTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Typing indicator */}
              {activeTypers.length > 0 && (
                <div className="px-4 py-1 text-xs text-gray-500">
                  {activeTypers.length === 1 
                    ? `${activeTypers[0]} is typing...` 
                    : `${activeTypers.join(', ')} are typing...`}
                </div>
              )}
              
              {/* Connection status */}
              {chatError && (
                <div className="px-4 py-1 text-xs text-red-500">
                  {chatError}
                </div>
              )}
              
              {/* Message input */}
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex">
                  <input
                    type="text"
                    value={message}
                    onChange={handleMessageChange}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-l-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-2">Select a conversation to start chatting</p>
                <p className="text-sm text-gray-400">
                  Or{" "}
                  <Link href="/marketplace" className="text-green-600 hover:underline">
                    browse products
                  </Link>{" "}
                  to find new contacts
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 