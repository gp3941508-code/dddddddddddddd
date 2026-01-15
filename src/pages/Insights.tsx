import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sidebar, Header } from '@/components/google-ads';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  MousePointer, 
  Eye, 
  DollarSign,
  Calendar,
  Filter,
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react';
import { useAds } from '@/hooks/useAds';
import { format, subDays } from 'date-fns';

const Insights = () => {
  const { ads, loading } = useAds();
  const [timeRange, setTimeRange] = useState('today');

  // Calculate aggregate metrics
  const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
  const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
  const totalCost = ads.reduce((sum, ad) => sum + ad.revenue, 0);
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgCPC = totalClicks > 0 ? totalCost / totalClicks : 0;
  const interactionRate = avgCTR;

  // Generate chart data with dynamic dates based on current date
  const today = new Date();
  const chartData = [
    { date: format(subDays(today, 6), 'MMM dd'), interactions: 165000, cost: 92000, impressions: 210000, revenue: 178000 },
    { date: format(subDays(today, 5), 'MMM dd'), interactions: 172000, cost: 97000, impressions: 225000, revenue: 185000 },
    { date: format(subDays(today, 4), 'MMM dd'), interactions: 168000, cost: 95000, impressions: 220000, revenue: 181000 },
    { date: format(subDays(today, 3), 'MMM dd'), interactions: 180000, cost: 100000, impressions: 235000, revenue: 190000 },
    { date: format(subDays(today, 2), 'MMM dd'), interactions: 175000, cost: 98000, impressions: 228000, revenue: 187000 },
    { date: format(subDays(today, 1), 'MMM dd'), interactions: 188000, cost: 105000, impressions: 245000, revenue: 198000 },
    { date: format(today, 'MMM dd'), interactions: 182000, cost: 103000, impressions: 238000, revenue: 195000 },
  ];

  // Check for account issues
  const suspendedAds = ads.filter(ad => ad.status === 'paused').length;
  const endedCampaigns = ads.filter(ad => ad.status === 'ended').length;
  const activeAds = ads.filter(ad => ad.status === 'active').length;

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 p-6 flex items-center justify-center">
            <div className="text-lg">Loading insights...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <div className="flex-1 p-6 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-foreground">Insights</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Last 7 days: {format(subDays(today, 6), 'MMM dd')} - {format(today, 'MMM dd, yyyy')}
                <span className="text-xs bg-muted px-2 py-1 rounded">Compared: {format(subDays(today, 13), 'MMM dd')} - {format(subDays(today, 7), 'MMM dd, yyyy')}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="View (2 filters)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All campaigns</SelectItem>
                  <SelectItem value="active">Active campaigns</SelectItem>
                  <SelectItem value="paused">Paused campaigns</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Add filter
              </Button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex gap-4 mb-6 text-sm">
            <span className="font-medium">Filters:</span>
            <div className="flex gap-4">
              <span>Campaign status: All</span>
              <span>Ad group status: Enabled, Paused</span>
            </div>
          </div>

          {/* Alert Messages */}
          <div className="space-y-4 mb-6">
            {suspendedAds > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="flex items-center justify-between">
                  <span className="text-red-800">Account has {suspendedAds} paused ads</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Fix it</Button>
                    <Button variant="ghost" size="sm">View details</Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {endedCampaigns > 0 && (
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="flex items-center justify-between">
                  <span className="text-blue-800">Campaign has {endedCampaigns} ended ads</span>
                  <Button variant="ghost" size="sm">View details</Button>
                </AlertDescription>
              </Alert>
            )}

            {activeAds > 0 && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="flex items-center justify-between">
                  <span className="text-green-800">{activeAds} ads are running successfully</span>
                  <Button variant="ghost" size="sm">View details</Button>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Performance Metrics */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Overall performance across campaigns</CardTitle>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="last7days">Last 7 days</SelectItem>
                    <SelectItem value="last30days">Last 30 days</SelectItem>
                    <SelectItem value="alltime">All time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex mb-6 rounded-lg overflow-hidden">
                <div className="flex-1 bg-google-blue p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MousePointer className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">Interactions</span>
                  </div>
                  <div className="text-3xl font-bold text-white">+{totalClicks > 0 ? Math.round(((totalClicks - totalClicks * 0.8) / (totalClicks * 0.8)) * 100) : 0}%</div>
                  <div className="text-sm text-white/80">Total: {totalClicks.toLocaleString()}</div>
                </div>

                <div className="flex-1 bg-google-red p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">Cost</span>
                  </div>
                  <div className="text-3xl font-bold text-white">+{totalCost > 0 ? Math.round(((totalCost - totalCost * 0.8) / (totalCost * 0.8)) * 100) : 0}%</div>
                  <div className="text-sm text-white/80">Total: ₹{totalCost.toFixed(2)}</div>
                </div>

                <div className="flex-1 bg-google-yellow p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">Avg. cost</span>
                  </div>
                  <div className="text-3xl font-bold text-white">+{avgCPC > 0 ? Math.round(((avgCPC - avgCPC * 0.9) / (avgCPC * 0.9)) * 100) : 0}%</div>
                  <div className="text-sm text-white/80">Total: ₹{avgCPC.toFixed(2)}</div>
                </div>

                <div className="flex-1 bg-google-green p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">Interaction rate</span>
                  </div>
                  <div className="text-3xl font-bold text-white">+{interactionRate > 0 ? Math.round(((interactionRate - interactionRate * 0.9) / (interactionRate * 0.9)) * 100) : 0}%</div>
                  <div className="text-sm text-white/80">Total: {interactionRate.toFixed(2)}%</div>
                </div>
              </div>

              {/* Chart */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #ccc', 
                        borderRadius: '8px' 
                      }}
                    />
                    <Line 
                      type="natural" 
                      dataKey="revenue" 
                      stroke="hsl(var(--google-red))" 
                      strokeWidth={2}
                      dot={false}
                      name="Revenue"
                    />
                    <Line 
                      type="natural" 
                      dataKey="interactions" 
                      stroke="hsl(var(--google-blue))" 
                      strokeWidth={2}
                      dot={false}
                      name="Interactions"
                    />
                    <Line 
                      type="natural" 
                      dataKey="cost" 
                      stroke="hsl(var(--google-yellow))" 
                      strokeWidth={2}
                      dot={false}
                      name="Cost"
                    />
                    <Line 
                      type="natural" 
                      dataKey="impressions" 
                      stroke="hsl(var(--google-green))" 
                      strokeWidth={2}
                      dot={false}
                      name="Impressions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* View Campaign Diagnostics */}
          <div className="text-center">
            <Button variant="link" className="text-blue-600">
              View campaign diagnostics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;