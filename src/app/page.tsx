import { getServerSession } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import Card from "@/components/ui/Card";
import StatusIndicator from "@/components/ui/StatusIndicator";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";

export default async function Home() {
  // Check if user is logged in to show appropriate UI elements
  const session = await getServerSession();
  const isLoggedIn = !!session;

  return (
    <div className="flex flex-col min-h-screen bg-dark-900 overflow-x-hidden">
      {/* Navbar */}
      <Navbar isLoggedIn={isLoggedIn} />
      
      {/* Hero Section */}
      <Hero 
        title="Connect Directly with Farmers & Buyers"
        subtitle="Agrikul is a B2B platform that eliminates middlemen, ensuring fair prices for farmers and quality produce for buyers."
        primaryCTA={{ text: "Join as Farmer", href: "/auth/register?type=farmer" }}
        secondaryCTA={{ text: "Join as Buyer", href: "/auth/register?type=buyer" }}
      />
      
      {/* Stats Section */}
      <section className="py-16 relative overflow-hidden bg-dark-800 bg-grid-pattern">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Platform Analytics</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="neuro-card p-6 flex flex-col items-center justify-center">
              <h3 className="text-xl text-green-500 font-bold">10</h3>
              <p className="text-gray-400">Active Farmers</p>
            </div>
            
            <div className="neuro-card p-6 flex flex-col items-center justify-center">
              <h3 className="text-xl text-blue-500 font-bold">₹25,000</h3>
              <p className="text-gray-400">Monthly Transactions</p>
            </div>
            
            <div className="neuro-card p-6 flex flex-col items-center justify-center">
              <h3 className="text-xl text-pink-500 font-bold">92%</h3>
              <p className="text-gray-400">Buyer Satisfaction</p>
            </div>
            
            <div className="neuro-card p-6 flex flex-col items-center justify-center">
              <h3 className="text-xl text-purple-500 font-bold">70%</h3>
              <p className="text-gray-400">Organic Products</p>
            </div>

            <div className="neuro-card p-6 flex flex-col items-center justify-center">
              <h3 className="text-xl text-yellow-500 font-bold">₹2,500</h3>
              <p className="text-gray-400">Average Order Value</p>
            </div>
            
            <div className="neuro-card p-6 flex flex-col items-center justify-center">
              <h3 className="text-xl text-green-500 font-bold">8</h3>
              <p className="text-gray-400">Registered Buyers</p>
            </div>
            
            <div className="neuro-card p-6 flex flex-col items-center justify-center">
              <h3 className="text-xl text-blue-500 font-bold">5</h3>
              <p className="text-gray-400">Daily Active Users</p>
            </div>
            
            <div className="neuro-card p-6 flex flex-col items-center justify-center">
              <h3 className="text-xl text-pink-500 font-bold">12%</h3>
              <p className="text-gray-400">Farmer Income Increase</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 relative overflow-hidden">
        {/* Blurred gradient orbs for background */}
        <div className="absolute top-1/3 left-1/5 w-72 h-72 rounded-full bg-cyan-glow/10 filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/5 w-80 h-80 rounded-full bg-magenta-glow/10 filter blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">Platform <span className="gradient-text">Features</span></h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">Everything you need to connect, trade, and grow in the agricultural ecosystem.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title} 
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                glowColor={index % 3 === 0 ? 'cyan' : index % 3 === 1 ? 'magenta' : 'blue'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden bg-dark-800">
        {/* Grid background pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Card className="max-w-4xl mx-auto p-8 md:p-12 overflow-hidden">
            {/* Gradient orb inside card */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-magenta-glow/10 filter blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4 gradient-text">Ready to transform your agricultural business?</h2>
              <p className="text-gray-300 mb-8 max-w-2xl">Join thousands of farmers and buyers who are already benefiting from direct trade, fair prices, and quality produce.</p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="gradient" size="lg">
                  Get Started for Free
                </Button>
                <Button variant="outline" size="lg">
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
      
      {/* Testimonials section would go here */}
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

// Features data array
const features = [
  {
    icon: '🌱',
    title: 'Direct Trading',
    description: 'Connect directly with farmers or buyers without intermediaries, ensuring fair prices and quality produce.'
  },
  {
    icon: '💬',
    title: 'Real-time Chat',
    description: 'Negotiate deals and communicate seamlessly through our secure messaging platform.'
  },
  {
    icon: '💳',
    title: 'Secure Payments',
    description: 'Integrated payment system ensures safe and timely transactions with escrow protection.'
  },
  {
    icon: '🤖',
    title: 'AI Chatbot',
    description: 'Get agriculture advice and platform guidance instantly from our intelligent assistant.'
  },
  {
    icon: '📊',
    title: 'Market Analytics',
    description: 'Stay informed with real-time market prices, trends, and predictive insights for better decisions.'
  },
  {
    icon: '🌿',
    title: 'Crop Recommendations',
    description: 'Get personalized soil-based crop recommendations for optimal yield and sustainability.'
  }
];
