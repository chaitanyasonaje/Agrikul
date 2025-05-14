import { Metadata } from "next";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ChatbotInterface from "./ChatbotInterface";
import Card from "@/components/ui/Card";
import DashboardTitle from "@/components/DashboardTitle";
import { Cpu, Sparkles, BookOpen, Lightbulb } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Farming Assistant - Agrikul",
  description: "Get expert farming advice and information from our AI assistant",
};

export default async function ChatbotPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/chatbot");
  }
  
  return (
    <div>
      <DashboardTitle 
        title="AI Farming Assistant"
        highlightPart="AI"
        icon={<Cpu className="text-cyan-glow" />}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="lg:col-span-3 order-2 lg:order-1">
          <Card 
            className="overflow-hidden p-0 h-[600px] sm:h-[650px] lg:h-[calc(100vh-9rem)]" 
            hoverEffect={false}
            glowColor="cyan"
          >
            <ChatbotInterface userType={session.user.userType} />
          </Card>
        </div>
        
        <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
          <Card className="p-4 sm:p-6 hover:shadow-glow">
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-glow to-magenta-glow flex items-center justify-center shadow-glow mr-3">
                <Sparkles size={16} className="text-white" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-white">Agricultural Expertise</h2>
            </div>
            
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
              Our AI farming assistant is trained with expert knowledge on:
            </p>
            
            <ul className="space-y-3 text-gray-300 text-sm sm:text-base">
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 rounded-full neuro-button flex-shrink-0 flex items-center justify-center mr-2 text-cyan-glow">•</span>
                <span>Crop diseases and integrated pest management</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 rounded-full neuro-button flex-shrink-0 flex items-center justify-center mr-2 text-cyan-glow">•</span>
                <span>Soil health, nutrients, and natural fertilization</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 rounded-full neuro-button flex-shrink-0 flex items-center justify-center mr-2 text-cyan-glow">•</span>
                <span>Water conservation and optimal irrigation</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 rounded-full neuro-button flex-shrink-0 flex items-center justify-center mr-2 text-cyan-glow">•</span>
                <span>Climate-adaptive farming techniques</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-5 w-5 rounded-full neuro-button flex-shrink-0 flex items-center justify-center mr-2 text-cyan-glow">•</span>
                <span>Government schemes and agricultural subsidies</span>
              </li>
            </ul>
          </Card>
          
          <Card className="p-4 sm:p-6 hover:shadow-glow-magenta">
            <div className="flex items-center mb-3 sm:mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-magenta-glow to-cyan-glow flex items-center justify-center shadow-glow mr-3">
                <BookOpen size={16} className="text-white" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-white">Learning Resources</h2>
            </div>
            
            <p className="text-gray-300 mb-2 sm:mb-3 text-sm sm:text-base">
              Beyond chatbot conversations, explore our additional resources:
            </p>
            
            <ul className="space-y-2 sm:space-y-3">
              <li className="neuro-inset p-2 sm:p-3 rounded-lg text-xs sm:text-sm text-gray-300 hover:text-white">
                <div className="flex items-center">
                  <Lightbulb size={14} className="text-yellow-400 mr-2" />
                  <span>📕 Seasonal crop planning guides for your region</span>
                </div>
              </li>
              <li className="neuro-inset p-2 sm:p-3 rounded-lg text-xs sm:text-sm text-gray-300 hover:text-white">
                <div className="flex items-center">
                  <Lightbulb size={14} className="text-yellow-400 mr-2" />
                  <span>📗 Organic farming certification handbook</span>
                </div>
              </li>
              <li className="neuro-inset p-2 sm:p-3 rounded-lg text-xs sm:text-sm text-gray-300 hover:text-white">
                <div className="flex items-center">
                  <Lightbulb size={14} className="text-yellow-400 mr-2" />
                  <span>📘 Government assistance programs directory</span>
                </div>
              </li>
              <li className="neuro-inset p-2 sm:p-3 rounded-lg text-xs sm:text-sm text-gray-300 hover:text-white">
                <div className="flex items-center">
                  <Lightbulb size={14} className="text-yellow-400 mr-2" />
                  <span>📙 Pest and disease identification visual guide</span>
                </div>
              </li>
            </ul>
          </Card>
          
          {session.user.userType === "farmer" && (
            <Card className="p-4 sm:p-6 border border-cyan-glow/40">
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 gradient-text">Premium Farmer Features</h2>
              <p className="text-gray-300 mb-3 text-sm">
                As a premium member, you have access to:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-cyan-glow text-sm">
                  <span className="inline-block h-2 w-2 rounded-full bg-cyan-glow mr-2"></span>
                  <span>Soil analysis report interpretation</span>
                </li>
                <li className="flex items-center text-cyan-glow text-sm">
                  <span className="inline-block h-2 w-2 rounded-full bg-cyan-glow mr-2"></span>
                  <span>Custom crop calendar creation</span>
                </li>
                <li className="flex items-center text-cyan-glow text-sm">
                  <span className="inline-block h-2 w-2 rounded-full bg-cyan-glow mr-2"></span>
                  <span>Live expert consultation bookings</span>
                </li>
              </ul>
            </Card>
          )}
          
          {session.user.userType === "buyer" && (
            <Card className="p-4 sm:p-6 border border-magenta-glow/40">
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 gradient-text">Premium Buyer Features</h2>
              <p className="text-gray-300 mb-3 text-sm">
                As a premium member, you have access to:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-magenta-glow text-sm">
                  <span className="inline-block h-2 w-2 rounded-full bg-magenta-glow mr-2"></span>
                  <span>Quality assessment guidelines</span>
                </li>
                <li className="flex items-center text-magenta-glow text-sm">
                  <span className="inline-block h-2 w-2 rounded-full bg-magenta-glow mr-2"></span>
                  <span>Storage best practices by crop type</span>
                </li>
                <li className="flex items-center text-magenta-glow text-sm">
                  <span className="inline-block h-2 w-2 rounded-full bg-magenta-glow mr-2"></span>
                  <span>Direct connections with certified farmers</span>
                </li>
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 