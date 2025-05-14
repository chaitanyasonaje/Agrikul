"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, RefreshCw, UserCircle2, ChevronUp, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";

// Define message types
interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

// Expert responses for common farming queries
const expertResponses: Record<string, string[]> = {
  "tomato": [
    "Tomato leaf blight appears as dark brown spots with concentric rings. For treatment: 1) Remove infected leaves, 2) Apply copper-based fungicide every 7-10 days, 3) Mulch soil to prevent spore splash, 4) Water at the base rather than overhead. Prevention includes crop rotation and adequate spacing between plants.",
    "For maximizing tomato yields, ensure: 1) Full sun exposure (6-8 hours daily), 2) Well-draining soil enriched with compost, 3) Regular watering (1-2 inches weekly), 4) Support structures for indeterminate varieties, 5) Balanced fertilizer (5-10-10). Pruning suckers can also increase fruit size and quality.",
    "The best companion plants for tomatoes are basil (repels insects, improves flavor), marigolds (deter nematodes), carrots (share nutrients efficiently), and nasturtiums (trap aphids). Avoid planting near potatoes, fennel, corn, or brassicas as they can inhibit growth or share diseases."
  ],
  "rice": [
    "For northern India, the optimal time to plant rice is mid-June to early July, coinciding with monsoon arrival. Ensure nursery preparation 25-30 days before transplanting. Choose varieties like PR126 or Pusa Basmati 1509 for shorter duration or Pusa Basmati 1121 for premium quality. Monitor rainfall patterns and adjust timing accordingly.",
    "To maximize rice yields while conserving water, implement the System of Rice Intensification (SRI): 1) Transplant younger seedlings (8-12 days), 2) Space plants wider (25×25cm), 3) Apply intermittent irrigation rather than continuous flooding, 4) Use organic inputs, 5) Regular weeding with rotary weeder. This can increase yields by 20-50% while using 30% less water.",
    "Common rice diseases include blast, bacterial leaf blight, and sheath blight. For integrated management: 1) Use resistant varieties, 2) Treat seeds with Pseudomonas fluorescens, 3) Apply balanced fertilization (avoid excess nitrogen), 4) Maintain field sanitation, 5) Judicious use of fungicides like Tricyclazole for blast or Hexaconazole for sheath blight at early infection stages."
  ],
  "wheat": [
    "For wheat in clay soil, the best irrigation strategy is limited and precise watering. Use 4-5 irrigations at critical stages: crown root initiation (21-25 days), tillering (45-60 days), jointing (65-70 days), flowering (90-95 days), and milk stage (110-115 days). Border strip or raised bed irrigation works well for clay soils to prevent waterlogging. Maintain soil at field capacity without saturation.",
    "To achieve optimal wheat yields, timing your fertilizer application is crucial. Apply 50% nitrogen, full phosphorus and potassium at sowing. Apply remaining nitrogen in two splits: 25% at first irrigation (21-25 days) and 25% at second irrigation (45-50 days). For micronutrients, foliar spray of 0.5% zinc sulfate at tillering stage can significantly increase yields in deficient soils.",
    "For organic wheat cultivation, prepare soil with 10-15 tons/hectare of well-decomposed farmyard manure 3-4 weeks before sowing. Use biofertilizers like Azotobacter (5kg/ha) and PSB (5kg/ha) for seed treatment. For pest management, install yellow sticky traps and pheromone traps for monitoring. Aphids can be controlled with neem-based formulations (3-5ml/L) or releases of ladybird beetles."
  ],
  "soil": [
    "To improve soil fertility naturally: 1) Add quality compost (5-10 tons/hectare) to enhance organic matter, 2) Implement crop rotation with legumes like pulses or clover to fix nitrogen, 3) Use green manures like sunhemp or dhaincha, incorporating them 40-45 days after sowing, 4) Apply biofertilizers like Rhizobium and Azotobacter, 5) Mulch with crop residues to conserve moisture and gradually add organic matter, 6) Include cover crops during off-seasons to prevent erosion and nutrient leaching.",
    "For acidic soils (pH below 6.5), apply agricultural lime or dolomite 2-3 months before planting at 2-4 tons/hectare. For alkaline soils (pH above 7.5), incorporate gypsum at 3-5 tons/hectare or use elemental sulfur at 500-1000 kg/hectare. Follow with organic amendments to buffer pH changes. For saline soils, improve drainage and apply gypsum along with organic matter to facilitate salt leaching.",
    "A comprehensive soil testing program should include: 1) pH and electrical conductivity, 2) Organic carbon content, 3) Available NPK, 4) Secondary nutrients (Ca, Mg, S), 5) Micronutrients (Zn, Fe, Cu, Mn, B), 6) Biological indicators like microbial biomass carbon. Sample at 0-15cm depth, collecting 10-15 subsamples per hectare. Test before each growing season to track changes and adjust fertility management accordingly."
  ],
  "irrigation": [
    "Drip irrigation advantages include: 1) Water efficiency (up to a 60% reduction), 2) Precise application directly to root zones, 3) Reduced weed growth, 4) Lower disease pressure, 5) Ability to fertigate, 6) Automation potential. For installation, use 16mm laterals with 2-4 lph drippers spaced according to crop root spread. Maintain 0.5-1.5 bar pressure and clean filters weekly. Amortized costs range from ₹35,000-80,000/hectare with 80-90% government subsidy available in most states.",
    "For efficient irrigation scheduling, use the water balance approach. Monitor soil moisture using tensiometers (for loamy soils) or gypsum blocks (for clay soils), maintaining tension between 30-60 centibars for most crops. Alternatively, calculate daily evapotranspiration (ET) using weather data and apply water at 80% of ET. For flood irrigation, maintain 40-50% depletion of available soil moisture as the threshold for irrigation.",
    "To maximize water use efficiency: 1) Level fields using laser leveling (saves 20-30% water), 2) Form raised beds or furrows instead of flat planting, 3) Apply mulch (plastic or organic) to reduce evaporation by 30-40%, 4) Incorporate organic matter to improve water holding capacity, 5) Practice deficit irrigation at non-critical growth stages, 6) Install soil moisture sensors for precision scheduling, 7) Harvest rainwater in farm ponds lined with HDPE sheets for supplemental irrigation."
  ],
  "pest": [
    "For sustainable pest management in vegetable crops: 1) Use pheromone traps (5-10/ha) for monitoring and mass trapping, 2) Install yellow/blue sticky traps (100/ha) for aphids and whiteflies, 3) Release Trichogramma (1.5 lakh/ha) weekly for egg parasitization, 4) Spray Beauveria bassiana (2g/L) for soft-bodied insects, 5) Apply neem formulations (3-5ml/L) as a repellent and growth regulator, 6) Plant trap crops like marigold around main crops, 7) Introduce predators like ladybird beetles for aphid control.",
    "For managing fall armyworm in maize: 1) Early detection using pheromone traps, 2) Apply border treatment with botanical insecticides, 3) Release Telenomus remus parasitoids (100,000/ha), 4) Use Metarhizium anisopliae (5g/L) or Bacillus thuringiensis (2g/L) for young larvae, 5) Apply neem seed kernel extract (5%) for feeding deterrence, 6) Introduce predators like earwigs and lacewings, 7) Use chemical controls like Spinetoram or Emamectin benzoate only when infestation crosses 20% damaged plants.",
    "For integrated root-knot nematode management: 1) Rotate with non-host crops like marigold or mustard, 2) Incorporate neem cake (250kg/ha) two weeks before planting, 3) Apply Paecilomyces lilacinus or Pochonia chlamydosporia to soil (2.5kg/ha), 4) Use legume intercropping to promote antagonistic microorganisms, 5) Implement biofumigation with cruciferous green manures, 6) Hot water treatment for seedling roots (48°C for 15 minutes), 7) Mulch with plastic to solarize soil in summer (4-6 weeks)."
  ],
  "fertilizer": [
    "For precision nutrition in cereals, apply NPK based on targeted yield approach. For 5 tons/ha wheat yield, use 120kg N, 60kg P₂O₅, and 40kg K₂O per hectare. Apply 50% N and full P and K at sowing, 25% N at tillering, and 25% N at jointing. Include 25kg/ha sulfur through gypsum and foliar spray of 0.5% zinc sulfate at tillering if deficient. For every ton of targeted additional yield, add 20kg N, 10kg P₂O₅, and 7kg K₂O.",
    "For organic fertilization strategy, layer inputs: 1) Base application of well-decomposed FYM or compost (10-15 tons/ha), 2) Enrichment with rock phosphate (250-500kg/ha) and neem cake (500kg/ha), 3) Inoculation with biofertilizers like Azotobacter, PSB, and mycorrhizae, 4) Mulching with crop residues, 5) In-season supplementation through liquid formulations like Panchagavya (3%) or fish amino acid (3-5%), 6) Compost tea foliar sprays (10%) at critical growth stages.",
    "To correct micronutrient deficiencies: For zinc deficiency (interveinal chlorosis in younger leaves), apply zinc sulfate at 25kg/ha soil application or 0.5% foliar spray. For boron deficiency (brittle leaves, hollow stems), use borax at 10kg/ha or 0.2% foliar spray. For iron deficiency (pronounced interveinal chlorosis), apply ferrous sulfate 0.5% foliar spray with 0.1% citric acid. Ensure soil pH is optimized (6.0-7.0) for maximum micronutrient availability."
  ],
  "organic": [
    "For effective organic pest management: 1) Apply neem oil (3ml/L) weekly as preventive treatment, 2) Use Trichoderma viride (5g/L) for soil-borne diseases, 3) Spray garlic-chili extract (100g each in 1L water, diluted 1:10) for soft-bodied insects, 4) Release Chrysoperla (15,000 eggs/ha) for aphids and small caterpillars, 5) Apply Beauveria bassiana (5g/L) for beetle pests, 6) Use Metarhizium anisopliae (5g/L) for root grubs, 7) Install bird perches (20/ha) to attract insectivorous birds.",
    "To build soil health in organic systems: 1) Apply compost at 10-15 tons/ha, 2) Incorporate green manures like Sesbania or Crotalaria, 3) Practice relay cropping with legumes, 4) Use mulches to maintain soil moisture and temperature, 5) Add vermicompost (2.5-5 tons/ha) for micronutrients and growth promoters, 6) Implement minimum tillage to preserve soil structure, 7) Apply biostimulants like seaweed extract (3-5ml/L) to enhance microbial activity.",
    "For organic certification under NPOP standards: 1) Document 3-year conversion period with no prohibited inputs, 2) Maintain detailed records of all inputs, practices and harvests, 3) Establish buffer zones (minimum 25-50 feet) from conventional fields, 4) Implement crop rotation plan covering at least 3 years, 5) Use only approved materials listed in NPOP Appendix 2, 6) Prepare Organic System Plan detailing all management practices, 7) Schedule annual inspection prior to harvest season. Application costs range from ₹10,000-20,000 depending on acreage."
  ],
  "government": [
    "Under PM-KISAN scheme, eligible farmers receive ₹6,000 annually in three equal installments. To register: 1) Visit local Agriculture Office with land records, Aadhaar card, and bank details, 2) Alternatively, self-register on the PM-KISAN portal, 3) Village-level agricultural assistants (VLAs) can help with form completion, 4) Verify status online using your Aadhaar number, 5) Ensure bank account is linked with Aadhaar for DBT. Landless laborers and urban farmers are not eligible under current guidelines.",
    "The Pradhan Mantri Fasal Bima Yojana offers crop insurance with minimal premiums: 2% for kharif, 1.5% for rabi, and 5% for commercial/horticultural crops. Coverage includes prevented sowing, mid-season adversity, localized calamities, and post-harvest losses. To register: 1) Apply through nearest bank branch, Common Service Center, or insurance agent, 2) Deadline is 2 days before risk coverage period ends, 3) Premium is automatically deducted for loanee farmers, 4) Document crop loss within 72 hours of occurrence through Crop Insurance App.",
    "For farm mechanization subsidies, the government offers: 1) 50% subsidy for individual farmers (up to ₹5 lakh), 2) 80% for farmer groups/cooperatives (up to ₹10 lakh), 3) Additional 10% for SC/ST/small/marginal farmers. Apply through the Agricultural Engineering Department with land documents, bank details, and quotes for machinery. The SMAM portal allows online tracking of applications. Custom Hiring Centers receive up to ₹60 lakh subsidy for establishing rental hubs in underserved areas."
  ]
};

// Default greeting messages
const defaultMessages: Message[] = [
  {
    id: "1",
    content: "Hello! I'm your AI Farming Assistant. How can I help you today?",
    sender: "assistant",
    timestamp: new Date()
  },
  {
    id: "2",
    content: "I can provide detailed information on crop management, pest control, soil health, irrigation techniques, and government agricultural programs. What specific information are you looking for?",
    sender: "assistant",
    timestamp: new Date(Date.now() + 100)
  }
];

// Sample questions by category
const sampleQuestions = {
  crops: [
    "How do I identify and treat tomato leaf blight?",
    "What's the best irrigation method for wheat in clay soil?",
    "When is the best time to plant rice in northern India?",
    "How can I maximize yields for organic wheat farming?"
  ],
  soil: [
    "How can I improve soil fertility naturally?",
    "What's the best way to correct soil pH levels?",
    "How often should I test my soil and what parameters?",
    "How can I address micronutrient deficiencies in my soil?"
  ],
  pests: [
    "What's an effective organic approach to manage aphids?",
    "How can I control fall armyworm in maize without chemicals?",
    "What are the best practices for nematode management?",
    "How can I implement biological pest control in vegetables?"
  ],
  programs: [
    "How do I register for the PM-KISAN scheme?",
    "What insurance options are available for crop failure?",
    "Are there subsidies for purchasing farm machinery?",
    "How can I get organic certification for my farm?"
  ]
};

interface ChatbotInterfaceProps {
  userType: string;
}

export default function ChatbotInterface({ userType }: ChatbotInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Generate AI response based on user input
  const generateResponse = (userInput: string): string => {
    // In a real application, this would be an API call to an AI service
    const lowercaseInput = userInput.toLowerCase();
    
    // Check for keyword matches
    for (const [keyword, responses] of Object.entries(expertResponses)) {
      if (lowercaseInput.includes(keyword)) {
        // Return a random response for the matching keyword
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
    
    // Default responses if no keyword match
    const defaultResponses = [
      `I don't have specific information about that topic yet. Could you ask about common agricultural topics like crop management, soil health, irrigation techniques, pest control, or government programs?`,
      `I'm specialized in providing advice on crop cultivation, soil management, pest control strategies, and information about agricultural support programs. Could you rephrase your question related to one of these areas?`,
      `I don't have enough information to answer that specific query. For the best assistance, try asking about soil fertility, irrigation methods, pest management, or government schemes for farmers.`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: input,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Simulate AI thinking
    setIsTyping(true);
    
    // Generate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai_${Date.now()}`,
        content: generateResponse(input),
        sender: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };
  
  // Handle sample question clicks
  const handleSampleQuestion = (question: string) => {
    // Set the input field
    setInput(question);
    
    // Create and add user message
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      content: question,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI thinking
    setIsTyping(true);
    
    // Generate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai_${Date.now()}`,
        content: generateResponse(question),
        sender: "assistant",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      setInput("");
    }, 1500 + Math.random() * 1000);
  };
  
  // Handle refreshing the chat
  const handleRefresh = () => {
    setMessages(defaultMessages);
    setInput("");
  };
  
  // Format timestamp using native JS
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };
  
  // Toggle question category
  const toggleCategory = (category: string) => {
    if (activeCategory === category) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category);
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-dark-900">
      {/* Chat header */}
      <div className="p-4 bg-dark-800 border-b border-gray-700 flex justify-between items-center shadow-neuro">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-glow to-magenta-glow flex items-center justify-center text-white shadow-glow mr-3">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-medium text-white text-lg">Agrikul AI Assistant</h3>
            <p className="text-xs text-gray-400">Powered by agricultural expertise</p>
          </div>
        </div>
        <button 
          onClick={handleRefresh}
          className="p-2 rounded-full neuro-button text-gray-300 hover:text-cyan-glow"
          aria-label="Refresh conversation"
        >
          <RefreshCw size={18} />
        </button>
      </div>
      
      {/* Question categories */}
      <div className="bg-dark-900 border-b border-gray-700/50 px-2 py-1 flex overflow-x-auto space-x-1 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-dark-900">
        <button
          className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
            activeCategory === "crops" 
              ? "bg-gradient-to-r from-cyan-glow/20 to-cyan-glow/10 text-cyan-glow" 
              : "text-gray-300 hover:bg-dark-800"
          }`}
          onClick={() => toggleCategory("crops")}
        >
          Crop Questions {activeCategory === "crops" ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
        </button>
        
        <button
          className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
            activeCategory === "soil" 
              ? "bg-gradient-to-r from-cyan-glow/20 to-cyan-glow/10 text-cyan-glow" 
              : "text-gray-300 hover:bg-dark-800"
          }`}
          onClick={() => toggleCategory("soil")}
        >
          Soil & Fertility {activeCategory === "soil" ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
        </button>
        
        <button
          className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
            activeCategory === "pests" 
              ? "bg-gradient-to-r from-cyan-glow/20 to-cyan-glow/10 text-cyan-glow" 
              : "text-gray-300 hover:bg-dark-800"
          }`}
          onClick={() => toggleCategory("pests")}
        >
          Pest Management {activeCategory === "pests" ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
        </button>
        
        <button
          className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
            activeCategory === "programs" 
              ? "bg-gradient-to-r from-cyan-glow/20 to-cyan-glow/10 text-cyan-glow" 
              : "text-gray-300 hover:bg-dark-800"
          }`}
          onClick={() => toggleCategory("programs")}
        >
          Govt Programs {activeCategory === "programs" ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
        </button>
      </div>
      
      {/* Sample questions for active category */}
      {activeCategory && (
        <div className="bg-dark-900/70 border-b border-gray-700/50 px-3 py-3 grid grid-cols-1 md:grid-cols-2 gap-2">
          {sampleQuestions[activeCategory as keyof typeof sampleQuestions].map((question, index) => (
            <button
              key={index}
              className="text-left text-sm px-3 py-2 rounded-md bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-white transition-colors"
              onClick={() => handleSampleQuestion(question)}
            >
              {question}
            </button>
          ))}
        </div>
      )}
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.sender === "assistant" && (
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-glow to-magenta-glow flex-shrink-0 flex items-center justify-center text-white shadow-md mr-2 mt-1">
                <Bot size={16} />
              </div>
            )}
            
            <div className="max-w-[85%] md:max-w-[75%]">
              <div 
                className={`
                  rounded-xl p-3 relative
                  ${message.sender === "user" 
                    ? "neuro-button bg-gradient-to-r from-cyan-glow/30 to-indigo-500/20 text-white"
                    : "neuro-inset bg-dark-900 text-gray-200 border border-gray-700/60"
                  }
                `}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                <span className="text-xs text-gray-400 block mt-1">
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
            
            {message.sender === "user" && (
              <div className="h-8 w-8 rounded-full neuro-button flex-shrink-0 flex items-center justify-center text-white shadow-md ml-2 mt-1">
                <UserCircle2 size={16} className="text-gray-300" />
              </div>
            )}
          </div>
        ))}
        
        {/* Loading indicator */}
        {isTyping && (
          <div className="flex">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-glow to-magenta-glow flex-shrink-0 flex items-center justify-center text-white shadow-md mr-2 mt-1">
              <Bot size={16} />
            </div>
            <div className="max-w-[85%] md:max-w-[75%]">
              <div className="neuro-inset bg-dark-800 rounded-xl p-3 px-4 text-gray-300 border border-gray-700/50">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-cyan-glow rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="h-2 w-2 bg-cyan-glow rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  <div className="h-2 w-2 bg-cyan-glow rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Premium account notification */}
      {userType === "farmer" && (
        <div className="px-4 py-1.5 bg-dark-800/60 border-t border-gray-700/30 text-center">
          <p className="text-xs text-cyan-glow">
            <span className="inline-block h-2 w-2 rounded-full bg-cyan-glow mr-1"></span>
            Premium farmer account: Access to personalized crop analysis and expert consultations
          </p>
        </div>
      )}
      
      {/* Input area */}
      <div className="bg-dark-800 p-3 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about crops, soil, pests, or agricultural programs..."
            className="flex-1 bg-dark-900 text-white px-4 py-3 rounded-xl neuro-inset focus:ring-1 focus:ring-cyan-glow border-0 focus:outline-none text-sm"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isTyping}
            className={`shadow-glow-cyan rounded-xl p-3 ${!input.trim() || isTyping ? 'opacity-50' : 'hover:shadow-lg'}`}
          >
            <Send size={18} className="text-white" />
          </Button>
        </form>
      </div>
    </div>
  );
} 