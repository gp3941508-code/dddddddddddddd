import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useDateRange } from '@/contexts/DateRangeContext';

const DataChart = () => {
  const { dateRange } = useDateRange();

  // Generate dynamic dates based on selected date range
  const generatePerformanceData = () => {
    const data = [];
    const endDate = new Date();
    
    // Always show last 30 days for better visualization
    const daysToShow = 30;
    
    for (let i = daysToShow; i >= 0; i--) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);
      
      // Generate realistic performance data with smooth trends
      const dayIndex = daysToShow - i;
      const baseClicks = 15000 + dayIndex * 500;
      const baseImpressions = 350000 + dayIndex * 15000;
      const baseCost = 5000 + dayIndex * 200;
      const baseConversions = 800 + dayIndex * 20;
      
      // Add smooth fluctuations
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const weekendFactor = isWeekend ? 0.7 : 1;
      
      // Smooth sine wave for natural variation
      const smoothVariation = 0.85 + Math.sin(dayIndex / 5) * 0.15;
      const trendFactor = 1 + (dayIndex / daysToShow) * 0.5;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        clicks: Math.floor(baseClicks * weekendFactor * smoothVariation * trendFactor),
        impressions: Math.floor(baseImpressions * weekendFactor * smoothVariation * trendFactor),
        cost: Math.floor(baseCost * weekendFactor * smoothVariation * trendFactor),
        conversions: Math.floor(baseConversions * weekendFactor * smoothVariation * trendFactor)
      });
    }
    
    return data;
  };

  const performanceData = useMemo(() => generatePerformanceData(), [dateRange]);

  return (
    <div className="space-y-6">
      {/* Performance Line Chart */}
      <Card className="border-gray-200 bg-white">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  fontSize={11}
                  tick={{ fill: '#9ca3af' }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  fontSize={11}
                  tick={{ fill: '#9ca3af' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="impressions" 
                  stroke="hsl(var(--google-red))" 
                  strokeWidth={2.5}
                  dot={false}
                  name="Impressions"
                />
                <Line 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="hsl(var(--google-blue))" 
                  strokeWidth={2.5}
                  dot={false}
                  name="Clicks"
                />
                <Line 
                  type="monotone" 
                  dataKey="cost" 
                  stroke="hsl(var(--google-green))" 
                  strokeWidth={2.5}
                  dot={false}
                  name="Cost"
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="hsl(var(--google-yellow))" 
                  strokeWidth={2.5}
                  dot={false}
                  name="Conversions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataChart;
