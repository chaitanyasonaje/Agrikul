"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import Button from "@/components/ui/Button";
import { Send, User, Briefcase, Info } from "lucide-react";

interface Participant {
  _id: string;
  name: string;
  email: string;
  userType: string;
}

interface Message {
  _id: string;
  content: string;
  createdAt: string;
  sender: string;
}

interface ChatWindowProps {
  messages: Message[];
  recipient: Participant;
  currentUser: any;
  loading: boolean;
  onSendMessage: (content: string) => void;
}

export default function ChatWindow({
  messages,
  recipient,
  currentUser,
  loading,
  onSendMessage,
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };
  
  const formatMessageTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "h:mm a");
    } catch (error) {
      return "";
    }
  };
  
  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };
  
  const messageGroups = groupMessagesByDate();
  
  return (
    <>
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-dark-800 shadow-neuro">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-glow to-magenta-glow shadow-glow flex items-center justify-center text-white font-bold">
            {recipient.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <p className="font-medium text-white">{recipient.name}</p>
            <p className="text-xs text-gray-400 flex items-center">
              {recipient.userType === "farmer" ? (
                <>
                  <User size={12} className="mr-1" />
                  <span>Farmer</span>
                </>
              ) : (
                <>
                  <Briefcase size={12} className="mr-1" />
                  <span>Buyer</span>
                </>
              )}
            </p>
          </div>
        </div>
        
        <button className="p-2 neuro-button rounded-full text-gray-400 hover:text-cyan-glow transition-colors">
          <Info size={18} />
        </button>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto bg-dark-900 scroll-smooth">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-glow"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
            <div className="h-16 w-16 rounded-full neuro-inset flex items-center justify-center text-cyan-glow mb-4">
              <Send size={24} />
            </div>
            <p className="text-lg gradient-text mb-2">Start the conversation</p>
            <p className="text-sm text-gray-500">Send a message to connect with {recipient.name}</p>
          </div>
        ) : (
          Object.keys(messageGroups).map(date => (
            <div key={date} className="mb-6 animate-fadeIn">
              <div className="flex justify-center mb-6">
                <span className="text-xs text-gray-400 bg-dark-800 px-3 py-1 rounded-full neuro-inset">
                  {new Date(date).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              
              {messageGroups[date].map((message, index) => {
                const isCurrentUser = message.sender === currentUser._id;
                
                return (
                  <div
                    key={message._id}
                    className={`flex mb-4 ${isCurrentUser ? "justify-end" : "justify-start"} animate-fadeIn`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {!isCurrentUser && (
                      <div className="h-8 w-8 rounded-full neuro-button flex items-center justify-center text-white mr-2 self-end">
                        {recipient.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    <div
                      className={`rounded-lg px-4 py-3 max-w-[70%] ${
                        isCurrentUser
                          ? "neuro-button text-white rounded-br-none"
                          : "neuro-inset text-gray-200 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm sm:text-base">{message.content}</p>
                      <div
                        className={`text-xs mt-1 text-right ${
                          isCurrentUser ? "text-cyan-glow" : "text-gray-400"
                        }`}
                      >
                        {formatMessageTime(message.createdAt)}
                      </div>
                    </div>
                    
                    {isCurrentUser && (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-glow to-magenta-glow flex items-center justify-center text-white ml-2 self-end shadow-glow">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t border-gray-700/50 bg-dark-800 shadow-neuro-inset">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 neuro-inset rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-glow"
          />
          <Button
            type="submit"
            variant="gradient"
            className="rounded-l-none"
            disabled={!newMessage.trim()}
            icon={<Send size={18} />}
          >
            <span className="sr-only sm:not-sr-only sm:ml-2">Send</span>
          </Button>
        </form>
      </div>
    </>
  );
} 