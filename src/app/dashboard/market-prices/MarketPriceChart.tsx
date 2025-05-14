"use client";

import { useEffect, useRef, useState } from "react";

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

export default function MarketPriceChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData>({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: []
  });
  
  useEffect(() => {
    async function fetchTopProducts() {
      try {
        const response = await fetch('/api/market-prices');
        if (!response.ok) {
          throw new Error('Failed to fetch market prices');
        }
        
        const data = await response.json();
        
        // Process data to get top trending products
        const allProducts = data.flatMap((category: any) => 
          category.products.map((product: any) => ({
            name: product.name,
            trend: product.trend,
            changePercent: product.changePercent,
            priceHistory: product.priceHistory || [],
            color: getRandomColor(product.name)
          }))
        );
        
        // Sort by absolute change percentage
        allProducts.sort((a: any, b: any) => 
          Math.abs(b.changePercent) - Math.abs(a.changePercent)
        );
        
        // Take top 3 products
        const topProducts = allProducts.slice(0, 3);
        
        // Format for chart
        const newChartData = {
          labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Today"],
          datasets: topProducts.map((product: any) => ({
            label: product.name,
            data: product.priceHistory.length ? product.priceHistory : generateMockPriceData(product.trend),
            borderColor: product.color,
            backgroundColor: `${product.color}20`,
          }))
        };
        
        setChartData(newChartData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        // Fallback to mock data
        const mockChartData = {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Rice",
              data: [38.20, 39.50, 40.10, 41.30, 42.50, 42.20, 42.50],
              borderColor: "#10B981",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
            },
            {
              label: "Wheat",
              data: [30.10, 29.60, 29.20, 29.00, 28.75, 28.30, 28.75],
              borderColor: "#EF4444",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
            },
            {
              label: "Tomatoes",
              data: [29.50, 30.20, 32.40, 33.80, 35.00, 34.70, 35.00],
              borderColor: "#8B5CF6",
              backgroundColor: "rgba(139, 92, 246, 0.1)",
            },
          ],
        };
        
        setChartData(mockChartData);
        setLoading(false);
      }
    }
    
    fetchTopProducts();
  }, []);
  
  useEffect(() => {
    if (!loading && chartRef.current) {
      renderChart();
    }
  }, [loading, chartData]);
  
  const renderChart = () => {
    if (!chartRef.current) return;
    
    const chartContainer = chartRef.current;
    chartContainer.innerHTML = "";
    
    // Create chart header with legend
    const chartHeader = document.createElement("div");
    chartHeader.className = "flex items-center justify-end mb-4";
    
    chartData.datasets.forEach(dataset => {
      const legendItem = document.createElement("div");
      legendItem.className = "flex items-center ml-4";
      
      const colorDot = document.createElement("div");
      colorDot.className = "w-3 h-3 rounded-full mr-1";
      colorDot.style.backgroundColor = dataset.borderColor;
      
      const label = document.createElement("span");
      label.className = "text-xs text-gray-400";
      label.textContent = dataset.label;
      
      legendItem.appendChild(colorDot);
      legendItem.appendChild(label);
      chartHeader.appendChild(legendItem);
    });
    
    chartContainer.appendChild(chartHeader);
    
    // Create simple chart visualization
    const chartVisualization = document.createElement("div");
    chartVisualization.className = "h-40 flex items-end justify-between";
    
    // Calculate max value for scaling
    const allValues = chartData.datasets.flatMap(dataset => dataset.data.filter(val => val !== undefined));
    const maxValue = Math.max(...allValues);
    const minValue = Math.min(...allValues);
    const range = maxValue - minValue;
    
    // Create bars for each data point
    chartData.labels.forEach((label, index) => {
      const dayColumn = document.createElement("div");
      dayColumn.className = "flex flex-col items-center";
      
      const barsContainer = document.createElement("div");
      barsContainer.className = "flex space-x-1";
      
      // Add bars for each dataset
      chartData.datasets.forEach(dataset => {
        const value = dataset.data[index];
        
        // Skip if value is undefined
        if (value === undefined) return;
        
        // Normalize the value to scale properly
        const heightPercentage = ((value - minValue) / (range || 1)) * 80 + 20; // Minimum 20% height
        
        const bar = document.createElement("div");
        bar.className = "w-2 rounded-t transition-all duration-300 hover:opacity-80";
        bar.style.height = `${heightPercentage}%`;
        bar.style.backgroundColor = dataset.borderColor;
        bar.title = `${dataset.label}: ₹${value.toFixed(2)}`;
        
        barsContainer.appendChild(bar);
      });
      
      const labelElement = document.createElement("div");
      labelElement.className = "text-xs text-gray-500 mt-1";
      labelElement.textContent = label;
      
      dayColumn.appendChild(barsContainer);
      dayColumn.appendChild(labelElement);
      chartVisualization.appendChild(dayColumn);
    });
    
    chartContainer.appendChild(chartVisualization);
  };
  
  // Helper function to generate a deterministic color based on string
  const getRandomColor = (str: string) => {
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convert to color
    const colors = [
      '#10B981', // green
      '#3B82F6', // blue
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#F59E0B', // amber
      '#EF4444', // red
      '#06B6D4', // cyan
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };
  
  // Generate mock price data if no history available
  const generateMockPriceData = (trend: string) => {
    const data = [];
    const basePrice = 30 + Math.random() * 50;
    
    for (let i = 0; i < 7; i++) {
      let change = 0;
      if (trend === 'up') {
        change = (i / 10) * basePrice;
      } else if (trend === 'down') {
        change = -((i / 10) * basePrice);
      } else {
        change = (Math.random() - 0.5) * 5;
      }
      
      data.push(Number((basePrice + change).toFixed(2)));
    }
    
    return data;
  };
  
  if (loading) {
    return (
      <div className="w-full h-40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-glow"></div>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <div ref={chartRef} className="w-full p-2 bg-dark-900/70 rounded border border-gray-700/50 shadow-inner"></div>
      <div className="text-center text-xs text-gray-500 mt-2">
        Price trends for top commodities over the last 7 days
      </div>
    </div>
  );
} 