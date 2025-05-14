"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ConversationsList from "./ConversationsList";
import ChatWindow from "./ChatWindow";
import Button from "@/components/ui/Button";
import { MessageSquare, UsersRound, Store } from "lucide-react";
import Card from "@/components/ui/Card";

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

interface Conversation {
  _id: string;
  participants: Participant[];
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  unreadCount?: number;
}

interface ChatLayoutProps {
  conversations: Conversation[];
  currentUser: any;
  activeConversationId?: string;
}

export default function ChatLayout({ 
  conversations, 
  currentUser, 
  activeConversationId 
}: ChatLayoutProps) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | undefined>(activeConversationId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState<Participant | null>(null);
  
  // Find the active conversation
  const activeConversation = activeId 
    ? conversations.find(c => c._id.toString() === activeId) 
    : undefined;
  
  // Effect to fetch messages when the active conversation changes
  useEffect(() => {
    if (!activeId) return;
    
    // Set recipient
    if (activeConversation && activeConversation.participants.length > 0) {
      setRecipient(activeConversation.participants[0]);
    }
    
    const fetchMessages = async () => {
      setLoading(true);
      try {
        // In a real app, this would fetch from an API
        // const response = await fetch(`/api/conversations/${activeId}/messages`);
        // const data = await response.json();
        // setMessages(data.messages);
        
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock messages
        const mockMessages: Message[] = Array(10).fill(0).map((_, i) => ({
          _id: `msg_${i}`,
          content: `This is a sample message ${i + 1} in this conversation.`,
          createdAt: new Date(Date.now() - (10 - i) * 3600000).toISOString(),
          sender: i % 2 === 0 ? currentUser._id : activeConversation?.participants[0]._id,
        }));
        
        setMessages(mockMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [activeId, activeConversation, currentUser._id]);
  
  const handleConversationSelect = (conversationId: string) => {
    setActiveId(conversationId);
    // Update URL without full page reload
    router.push(`/dashboard/messages?conversation=${conversationId}`, { scroll: false });
  };
  
  const handleSendMessage = async (content: string) => {
    if (!activeId || !content.trim()) return;
    
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/conversations/${activeId}/messages`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content }),
      // });
      
      // Add the message locally
      const newMessage: Message = {
        _id: `temp_${Date.now()}`,
        content,
        createdAt: new Date().toISOString(),
        sender: currentUser._id,
      };
      
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  return (
    <Card className="overflow-hidden shadow-neuro hover:shadow-glow-cyan transition-shadow duration-500 h-[calc(100vh-14rem)]" hoverEffect={false}>
      <div className="flex h-full">
        {/* Conversation list sidebar */}
        <div className="w-1/3 border-r border-gray-700 overflow-y-auto bg-dark-800">
          <div className="p-4 border-b border-gray-700 bg-dark-900 shadow-neuro-inset">
            <div className="flex items-center">
              <MessageSquare size={18} className="text-cyan-glow mr-2" />
              <h2 className="font-semibold text-white">
                <span className="gradient-text">Conversations</span>
              </h2>
            </div>
          </div>
          
          <ConversationsList 
            conversations={conversations}
            activeConversationId={activeId}
            onSelectConversation={handleConversationSelect}
          />
          
          {conversations.length === 0 && (
            <div className="p-6 text-center text-gray-400">
              <div className="mb-4 flex justify-center">
                <div className="h-16 w-16 rounded-full neuro-inset flex items-center justify-center text-cyan-glow">
                  <UsersRound size={28} />
                </div>
              </div>
              <p className="mb-4">No conversations yet</p>
              <Link href="/marketplace">
                <Button variant="outline" className="w-full" icon={<Store size={16} />}>
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Chat window */}
        <div className="w-2/3 flex flex-col bg-dark-900">
          {activeId && recipient ? (
            <ChatWindow
              messages={messages}
              recipient={recipient}
              currentUser={currentUser}
              loading={loading}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-400 p-8 max-w-md animate-fadeIn">
                <div className="mb-4 flex justify-center">
                  <div className="h-20 w-20 rounded-full neuro-inset flex items-center justify-center text-cyan-glow animate-pulse">
                    <MessageSquare size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-medium gradient-text mb-2">Start Messaging</h3>
                <p className="text-gray-400 mb-6">
                  {conversations.length > 0 
                    ? "Select a conversation from the list to start chatting" 
                    : "Connect with farmers and buyers to discuss products, prices, and delivery details"}
                </p>
                {conversations.length === 0 && (
                  <Button
                    href="/marketplace"
                    variant="gradient"
                    size="lg"
                    className="shadow-glow"
                    icon={<Store size={18} />}
                  >
                    Browse Marketplace
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
} 