"use client";

import { formatDistanceToNow } from "date-fns";
import { User, Briefcase, Clock } from "lucide-react";

interface Participant {
  _id: string;
  name: string;
  email: string;
  userType: string;
}

interface Conversation {
  _id: string;
  participants: Participant[];
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  unreadCount?: number;
}

interface ConversationsListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
}

export default function ConversationsList({
  conversations,
  activeConversationId,
  onSelectConversation,
}: ConversationsListProps) {
  if (conversations.length === 0) {
    return null;
  }
  
  const formatLastMessageTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "";
    }
  };
  
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };
  
  const getUserIcon = (userType: string) => {
    return userType === "farmer" ? (
      <User size={12} className="mr-1" />
    ) : (
      <Briefcase size={12} className="mr-1" />
    );
  };
  
  return (
    <div className="divide-y divide-gray-700/50">
      {conversations.map((conversation) => {
        const isActive = conversation._id.toString() === activeConversationId;
        const participant = conversation.participants[0] || {};
        
        return (
          <div
            key={conversation._id.toString()}
            className={`p-4 cursor-pointer transition-all duration-300 animate-fadeIn ${
              isActive 
                ? "bg-gradient-to-r from-cyan-glow/10 to-magenta-glow/10 border-l-4 border-cyan-glow shadow-neuro-inset" 
                : "hover:bg-dark-900/40 border-l-4 border-transparent hover:border-cyan-glow/50"
            }`}
            onClick={() => onSelectConversation(conversation._id.toString())}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className={`h-10 w-10 rounded-full ${isActive ? 'bg-gradient-to-r from-cyan-glow to-magenta-glow shadow-glow' : 'neuro-button'} flex items-center justify-center text-white font-bold transition-all duration-300`}>
                  {participant.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {participant.name || "Unknown User"}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center">
                    {getUserIcon(participant.userType)}
                    {participant.userType === "farmer" ? "Farmer" : "Buyer"}
                  </p>
                </div>
              </div>
              {conversation.lastMessage?.createdAt && (
                <span className="text-xs text-gray-400 flex items-center">
                  <Clock size={10} className="mr-1" />
                  {formatLastMessageTime(conversation.lastMessage.createdAt)}
                </span>
              )}
            </div>
            
            <div className="mt-2 pl-12">
              {conversation.lastMessage ? (
                <p className={`text-sm ${isActive ? 'text-gray-200' : 'text-gray-300'}`}>
                  {truncateText(conversation.lastMessage.content, 45)}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No messages yet
                </p>
              )}
            </div>
            
            {conversation.unreadCount && conversation.unreadCount > 0 && (
              <div className="mt-1 flex justify-end">
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-gradient-to-r from-cyan-glow to-magenta-glow rounded-full shadow-glow">
                  {conversation.unreadCount}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
} 