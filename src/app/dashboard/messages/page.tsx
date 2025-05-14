import { Metadata } from "next";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Conversation from "@/models/Conversation";
import ChatLayout from "./ChatLayout";
import DashboardTitle from "@/components/DashboardTitle";
import { MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Messages - Agrikul",
  description: "Chat with farmers and buyers on the Agrikul platform",
};

// Helper function to serialize MongoDB documents
function serializeDocument(doc: any) {
  return JSON.parse(JSON.stringify(doc));
}

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/messages");
  }
  
  await dbConnect();
  
  // In Next.js 15, searchParams is a Promise that needs to be awaited
  const params = await Promise.resolve(searchParams);
  const activeConversationId = params.conversation as string | undefined;
  
  // Fetch user's conversations
  const conversationsRaw = await Conversation.find({
    participants: session.user.id,
  })
    .sort({ updatedAt: -1 })
    .populate({
      path: "participants",
      select: "name email userType",
      match: { _id: { $ne: session.user.id } }, // Exclude the current user
    })
    .populate({
      path: "lastMessage",
      select: "content createdAt",
    })
    .lean();
  
  // Serialize MongoDB documents to plain objects
  const conversations = serializeDocument(conversationsRaw);
  
  // Fetch user data for the sidebar
  const currentUserRaw = await User.findById(session.user.id)
    .select("name email userType")
    .lean();
  
  // Serialize the current user data
  const currentUser = serializeDocument(currentUserRaw);
  
  // If there's no active conversation but we have conversations, set the first one as active
  const hasActiveConversation = activeConversationId && 
    conversations.some(conv => conv._id.toString() === activeConversationId);
  
  // If no active conversation is specified but we have conversations, use the first one
  const effectiveConversationId = hasActiveConversation
    ? activeConversationId
    : conversations.length > 0
      ? conversations[0]._id.toString()
      : undefined;
  
  return (
    <div className="animate-fadeIn">
      <DashboardTitle 
        title="Messages" 
        subtitle="Connect directly with farmers and buyers"
        highlightPart="Messages"
        icon={<MessageSquare className="text-cyan-glow" />}
      />
      
      <ChatLayout 
        conversations={conversations} 
        currentUser={currentUser} 
        activeConversationId={effectiveConversationId}
      />
    </div>
  );
} 