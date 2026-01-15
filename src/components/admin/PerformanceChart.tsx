import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Ad } from '@/hooks/useAds';

interface PerformanceChartProps {
  ads: Ad[];
}

const PerformanceChart = ({ ads }: PerformanceChartProps) => {
  // Generate mock daily data for the last 7 days
  const generateDailyData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        impressions: Math.floor(Math.random() * 10000) + 5000,
        clicks: Math.floor(Math.random() * 500) + 200,
        revenue: Math.floor(Math.random() * 2000) + 1000,
      });
    }
    return data;
  };

  const dailyData = generateDailyData();

  const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
  const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
  const totalRevenue = ads.reduce((sum, ad) => sum + ad.revenue, 0);
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalImpressions.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Impressions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalClicks.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Clicks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">₹{totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{avgCTR.toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">Average CTR</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="clicks" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Impressions Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Impressions</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="impressions" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceChart;