import { NextRequest, NextResponse } from 'next/server';

// API key could be added to env variables like the weather API
const AGMARKET_API_KEY = process.env.AGMARKET_API_KEY;

// We'll fetch data from a public API for agricultural commodities
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const commodity = searchParams.get('commodity');
    const category = searchParams.get('category');
    
    // Use the environment variable instead of hardcoded API key
    const response = await fetch(`https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${AGMARKET_API_KEY}&format=json&offset=0&limit=10`);
    
    if (!response.ok) {
      // If the external API fails, fall back to our mock data
      return NextResponse.json(getMockMarketData(category, commodity), 
        { headers: { 'X-Data-Source': 'mock' } });
    }
    
    const data = await response.json();
    
    // Process and format the data from the API
    const formattedData = formatExternalApiData(data, category, commodity);
    
    return NextResponse.json(formattedData, 
      { headers: { 'X-Data-Source': 'external-api' } });
  } catch (error) {
    console.error('Market Prices API error:', error);
    
    // If there's any error, return mock data
    return NextResponse.json(
      getMockMarketData(null, null),
      { 
        status: 200,
        headers: { 'X-Data-Source': 'mock-fallback' } 
      }
    );
  }
}

// Format data from the external API to match our app's structure
function formatExternalApiData(data: any, category?: string | null, commodity?: string | null) {
  try {
    if (!data.records || !Array.isArray(data.records)) {
      return getMockMarketData(category, commodity);
    }
    
    // Process and organize the data by category
    const categorizedData: any = {};
    
    data.records.forEach((record: any) => {
      const commodityName = record.commodity || '';
      const categoryName = getCategoryFromCommodity(commodityName);
      
      if (!categorizedData[categoryName]) {
        categorizedData[categoryName] = {
          category: categoryName,
          products: []
        };
      }
      
      // Calculate trend and change percent (mock values since API doesn't provide this)
      const randomTrend = Math.random() > 0.5 ? 'up' : (Math.random() > 0.5 ? 'down' : 'stable');
      const randomChange = parseFloat((Math.random() * 5).toFixed(1));
      
      // Generate mock price history
      const currentPrice = parseFloat(record.modal_price) || parseFloat((Math.random() * 100 + 20).toFixed(2));
      const priceHistory = generateMockPriceHistory(currentPrice, randomTrend);
      
      categorizedData[categoryName].products.push({
        name: commodityName,
        price: currentPrice,
        unit: 'kg',
        trend: randomTrend,
        changePercent: randomChange,
        priceHistory: priceHistory,
        market: record.market || 'National Market',
        state: record.state || 'National',
        district: record.district || '-',
        lastUpdated: record.arrival_date || new Date().toISOString().split('T')[0]
      });
    });
    
    // Convert to array format
    return Object.values(categorizedData);
  } catch (error) {
    console.error('Error formatting external data:', error);
    return getMockMarketData(category, commodity);
  }
}

// Determine category based on commodity name
function getCategoryFromCommodity(commodity: string): string {
  const lowerCommodity = commodity.toLowerCase();
  
  if (['rice', 'wheat', 'maize', 'corn', 'barley', 'jowar', 'bajra'].some(grain => lowerCommodity.includes(grain))) {
    return 'Grains';
  } else if (['tomato', 'potato', 'onion', 'cabbage', 'cauliflower', 'carrot', 'brinjal', 'capsicum', 'beans'].some(veg => lowerCommodity.includes(veg))) {
    return 'Vegetables';
  } else if (['apple', 'banana', 'orange', 'mango', 'grape', 'pineapple', 'papaya', 'guava'].some(fruit => lowerCommodity.includes(fruit))) {
    return 'Fruits';
  } else if (['milk', 'egg', 'chicken', 'butter', 'curd', 'cheese'].some(dairy => lowerCommodity.includes(dairy))) {
    return 'Dairy & Poultry';
  } else if (['mustard', 'groundnut', 'sunflower', 'soybean', 'coconut'].some(oil => lowerCommodity.includes(oil))) {
    return 'Oils & Oilseeds';
  }
  
  return 'Other Products';
}

// Generate mock price history based on current price and trend
function generateMockPriceHistory(currentPrice: number, trend: string): number[] {
  const priceHistory = [];
  let price = currentPrice;
  
  // Generate 5 previous prices
  for (let i = 0; i < 5; i++) {
    if (trend === 'up') {
      // If trend is up, previous prices were lower
      price = price * (1 - (Math.random() * 0.03));
    } else if (trend === 'down') {
      // If trend is down, previous prices were higher
      price = price * (1 + (Math.random() * 0.03));
    } else {
      // If stable, slight random variations
      price = price * (1 + (Math.random() * 0.01 - 0.005));
    }
    priceHistory.unshift(parseFloat(price.toFixed(2)));
  }
  
  // Add current price at the end
  priceHistory.push(currentPrice);
  
  return priceHistory;
}

// Mock data for when the API fails or for testing
function getMockMarketData(category?: string | null, commodity?: string | null) {
  // Sample market price data
  const marketPrices = [
    {
      category: "Grains",
      products: [
        { 
          name: "Rice", 
          price: 42.50, 
          unit: "kg", 
          trend: "up", 
          changePercent: 2.4,
          priceHistory: [38.20, 39.50, 40.10, 41.30, 42.50],
          market: "Delhi Agricultural Market",
          state: "Delhi",
          district: "New Delhi",
          lastUpdated: "2023-10-15"
        },
        { 
          name: "Wheat", 
          price: 28.75, 
          unit: "kg", 
          trend: "down", 
          changePercent: 1.2,
          priceHistory: [30.10, 29.60, 29.20, 29.00, 28.75],
          market: "Azadpur Mandi",
          state: "Delhi",
          district: "North Delhi",
          lastUpdated: "2023-10-15"
        },
        { 
          name: "Corn", 
          price: 18.90, 
          unit: "kg", 
          trend: "stable", 
          changePercent: 0.3,
          priceHistory: [19.00, 19.10, 18.95, 18.85, 18.90],
          market: "Mumbai Agricultural Market",
          state: "Maharashtra",
          district: "Mumbai",
          lastUpdated: "2023-10-14"
        },
      ]
    },
    {
      category: "Vegetables",
      products: [
        { 
          name: "Tomatoes", 
          price: 35.00, 
          unit: "kg", 
          trend: "up", 
          changePercent: 4.8,
          priceHistory: [29.50, 30.20, 32.40, 33.80, 35.00],
          market: "Chennai Wholesale Market",
          state: "Tamil Nadu",
          district: "Chennai",
          lastUpdated: "2023-10-15"
        },
        { 
          name: "Potatoes", 
          price: 22.30, 
          unit: "kg", 
          trend: "up", 
          changePercent: 1.5,
          priceHistory: [21.40, 21.60, 21.90, 22.10, 22.30],
          market: "Kolkata Market Complex",
          state: "West Bengal",
          district: "Kolkata",
          lastUpdated: "2023-10-15"
        },
        { 
          name: "Onions", 
          price: 28.15, 
          unit: "kg", 
          trend: "down", 
          changePercent: 2.8,
          priceHistory: [31.20, 30.50, 29.75, 28.80, 28.15],
          market: "Pune Agricultural Market",
          state: "Maharashtra",
          district: "Pune",
          lastUpdated: "2023-10-15"
        },
      ]
    },
    {
      category: "Fruits",
      products: [
        { 
          name: "Apples", 
          price: 75.25, 
          unit: "kg", 
          trend: "stable", 
          changePercent: 0.2,
          priceHistory: [75.10, 75.15, 75.30, 75.20, 75.25],
          market: "Shimla Market",
          state: "Himachal Pradesh",
          district: "Shimla",
          lastUpdated: "2023-10-14"
        },
        { 
          name: "Bananas", 
          price: 45.80, 
          unit: "kg", 
          trend: "up", 
          changePercent: 3.1,
          priceHistory: [41.50, 42.70, 44.10, 45.20, 45.80],
          market: "Bengaluru Agricultural Market",
          state: "Karnataka",
          district: "Bengaluru",
          lastUpdated: "2023-10-15"
        },
        { 
          name: "Oranges", 
          price: 58.90, 
          unit: "kg", 
          trend: "down", 
          changePercent: 1.7,
          priceHistory: [60.50, 60.20, 59.80, 59.20, 58.90],
          market: "Nagpur Market",
          state: "Maharashtra",
          district: "Nagpur",
          lastUpdated: "2023-10-15"
        },
      ]
    },
    {
      category: "Dairy & Poultry",
      products: [
        { 
          name: "Milk", 
          price: 52.00, 
          unit: "liter", 
          trend: "up", 
          changePercent: 1.9,
          priceHistory: [49.80, 50.40, 51.20, 51.70, 52.00],
          market: "Gujarat Dairy Market",
          state: "Gujarat",
          district: "Anand",
          lastUpdated: "2023-10-15"
        },
        { 
          name: "Eggs", 
          price: 85.50, 
          unit: "dozen", 
          trend: "up", 
          changePercent: 2.3,
          priceHistory: [82.30, 83.10, 84.20, 84.90, 85.50],
          market: "Punjab Poultry Market",
          state: "Punjab",
          district: "Ludhiana",
          lastUpdated: "2023-10-15"
        },
        { 
          name: "Chicken", 
          price: 175.25, 
          unit: "kg", 
          trend: "stable", 
          changePercent: 0.5,
          priceHistory: [174.20, 174.50, 174.80, 175.10, 175.25],
          market: "Hyderabad Poultry Complex",
          state: "Telangana",
          district: "Hyderabad",
          lastUpdated: "2023-10-15"
        },
      ]
    }
  ];
  
  // If category is specified, filter by category
  if (category) {
    const categoryData = marketPrices.find(c => c.category.toLowerCase() === category.toLowerCase());
    if (categoryData) {
      // If commodity is specified, filter by commodity
      if (commodity) {
        const filteredProducts = categoryData.products.filter(
          p => p.name.toLowerCase().includes(commodity.toLowerCase())
        );
        
        if (filteredProducts.length > 0) {
          return [{
            category: categoryData.category,
            products: filteredProducts
          }];
        }
      }
      return [categoryData];
    }
  }
  
  // If commodity is specified but category is not
  if (commodity) {
    const result = marketPrices.map(category => {
      const filteredProducts = category.products.filter(
        p => p.name.toLowerCase().includes(commodity.toLowerCase())
      );
      
      if (filteredProducts.length > 0) {
        return {
          category: category.category,
          products: filteredProducts
        };
      }
      return null;
    }).filter(Boolean);
    
    if (result.length > 0) {
      return result;
    }
  }
  
  // Return all data if no filters or no matches
  return marketPrices;
} 