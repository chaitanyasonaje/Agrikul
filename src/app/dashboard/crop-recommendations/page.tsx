import { Metadata } from "next";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import CropRecommendationForm from "./CropRecommendationForm";
import MLRecommendationForm from "./MLRecommendationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardTitle from "@/components/DashboardTitle";
import Card from "@/components/ui/Card";
import { Leaf, Calendar, Database } from "lucide-react";

export const metadata: Metadata = {
  title: "Crop Recommendations - Agrikul",
  description: "Get personalized crop recommendations based on soil and climate conditions",
};

export default async function CropRecommendationsPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/crop-recommendations");
  }
  
  // Only farmers can access this page
  if (session.user.userType !== "farmer") {
    redirect("/dashboard");
  }
  
  await dbConnect();
  
  // Sample crop recommendations data - in a real app this would come from an ML model or database
  const cropRecommendations = [
    {
      soil_type: "clay",
      crops: [
        { name: "Wheat", suitability: "high", notes: "Performs well in moisture-retentive clay soils" },
        { name: "Rice", suitability: "high", notes: "Ideal for water-retaining clay soils" },
        { name: "Beans", suitability: "medium", notes: "Can tolerate clay soils with good drainage" },
      ]
    },
    {
      soil_type: "sandy",
      crops: [
        { name: "Carrots", suitability: "high", notes: "Root vegetables thrive in loose sandy soil" },
        { name: "Potatoes", suitability: "high", notes: "Sandy soil allows for proper tuber development" },
        { name: "Melons", suitability: "medium", notes: "Good drainage but may need supplemental irrigation" },
      ]
    },
    {
      soil_type: "loamy",
      crops: [
        { name: "Corn", suitability: "high", notes: "Balanced nutrition and moisture retention" },
        { name: "Tomatoes", suitability: "high", notes: "Excellent drainage and nutrient availability" },
        { name: "Leafy Greens", suitability: "high", notes: "Ideal growing conditions for most vegetables" },
      ]
    },
    {
      soil_type: "silty",
      crops: [
        { name: "Berries", suitability: "high", notes: "Good moisture retention with enough drainage" },
        { name: "Fruits", suitability: "high", notes: "Fruit trees often perform well in silty soil" },
        { name: "Legumes", suitability: "medium", notes: "Can thrive with proper management" },
      ]
    }
  ];
  
  return (
    <div className="animate-fadeIn">
      <DashboardTitle 
        title="Crop Recommendations" 
        subtitle="Get personalized crop recommendations for your farm" 
        highlightPart="Crop"
        icon={<Leaf className="text-cyan-glow" />}
      />
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-gray-700 bg-dark-900 shadow-neuro-inset">
            <div className="flex items-center">
              <Database size={18} className="text-cyan-glow mr-2" />
              <h2 className="font-semibold text-white">
                <span className="gradient-text">Get Personalized Recommendations</span>
              </h2>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-gray-400 mb-6">
              Enter your soil characteristics and location information to receive customized crop recommendations
              for optimal yield. Our system analyzes soil type, climate conditions, and market trends to suggest
              the best crops for your farm.
            </p>
            
            <Tabs defaultValue="ml-model" className="neuro-tabs">
              <TabsList className="mb-6 neuro-tablist">
                <TabsTrigger value="ml-model" className="neuro-tab">AI Model Recommendation</TabsTrigger>
                <TabsTrigger value="soil-based" className="neuro-tab">Soil-Based Recommendation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ml-model">
                <div className="py-2">
                  <MLRecommendationForm />
                </div>
              </TabsContent>
              
              <TabsContent value="soil-based">
                <div className="py-2">
                  <CropRecommendationForm recommendations={cropRecommendations} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
        
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-gray-700 bg-dark-900 shadow-neuro-inset">
            <div className="flex items-center">
              <Calendar size={18} className="text-cyan-glow mr-2" />
              <h2 className="font-semibold text-white">
                <span className="gradient-text">Seasonal Crop Calendar</span>
              </h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-dark-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Crop</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Planting Season</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Harvest Season</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody className="neuro-table-body divide-y divide-gray-700">
                  <tr className="hover:bg-dark-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Wheat</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">October-November</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">April-May</td>
                    <td className="px-6 py-4 text-sm text-gray-400">Winter crop, requires moderate rainfall</td>
                  </tr>
                  <tr className="hover:bg-dark-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Rice</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">June-July</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">October-November</td>
                    <td className="px-6 py-4 text-sm text-gray-400">Requires standing water, high humidity</td>
                  </tr>
                  <tr className="hover:bg-dark-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Corn</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">March-May</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">August-October</td>
                    <td className="px-6 py-4 text-sm text-gray-400">Warm temperatures, moderate water needs</td>
                  </tr>
                  <tr className="hover:bg-dark-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Potatoes</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">January-March</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">April-June</td>
                    <td className="px-6 py-4 text-sm text-gray-400">Cool seasons, well-drained soil</td>
                  </tr>
                  <tr className="hover:bg-dark-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">Tomatoes</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">February-April</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">June-September</td>
                    <td className="px-6 py-4 text-sm text-gray-400">Warm climate, regular watering</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>
        
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-gray-700 bg-dark-900 shadow-neuro-inset">
            <div className="flex items-center">
              <Database size={18} className="text-cyan-glow mr-2" />
              <h2 className="font-semibold text-white">
                <span className="gradient-text">About Our AI Model</span>
              </h2>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-gray-400 mb-4">
              Our crop recommendation system uses a machine learning model trained on thousands of soil samples and 
              agricultural experiments. The model considers multiple factors including soil nutrients (N, P, K), 
              environmental conditions (temperature, humidity, rainfall), and pH levels to predict the most suitable crop.
            </p>
            <p className="text-gray-400">
              The predictions are based on patterns learned from historical agricultural data, and the confidence 
              score indicates how certain the model is about its recommendation. For best results, ensure your 
              input parameters are accurate measurements from your farm.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
} 