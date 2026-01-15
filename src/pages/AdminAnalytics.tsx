import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sidebar, Header } from '@/components/google-ads';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  MousePointer, 
  Eye, 
  DollarSign, 
  Users,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

const AdminAnalytics = () => {
  // Sample data for charts
  const performanceData = [
    { date: 'Jan 1', impressions: 15000, clicks: 750, revenue: 3750 },
    { date: 'Jan 2', impressions: 18000, clicks: 920, revenue: 4600 },
    { date: 'Jan 3', impressions: 22000, clicks: 1100, revenue: 5500 },
    { date: 'Jan 4', impressions: 19000, clicks: 950, revenue: 4750 },
    { date: 'Jan 5', impressions: 25000, clicks: 1300, revenue: 6500 },
    { date: 'Jan 6', impressions: 28000, clicks: 1450, revenue: 7250 },
    { date: 'Jan 7', impressions: 32000, clicks: 1680, revenue: 8400 },
  ];

  const revenueByCategory = [
    { name: 'Display Ads', value: 45, revenue: 125000 },
    { name: 'Video Ads', value: 30, revenue: 85000 },
    { name: 'Search Ads', value: 15, revenue: 42000 },
    { name: 'Social Ads', value: 10, revenue: 28000 },
  ];

  const topPerformingAds = [
    { name: 'Holiday Sale Banner', impressions: 125000, clicks: 6250, revenue: 31250, ctr: 5.0, change: 12.5 },
    { name: 'Product Launch Ad', impressions: 98000, clicks: 4900, revenue: 24500, ctr: 5.0, change: 8.3 },
    { name: 'Brand Campaign', impressions: 87000, clicks: 3480, revenue: 17400, ctr: 4.0, change: -2.1 },
    { name: 'Retargeting Ad', impressions: 65000, clicks: 2600, revenue: 13000, ctr: 4.0, change: 15.7 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const metrics = [
    {
      title: "Total Revenue",
      value: "₹2,80,250",
      change: "+18.7%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Impressions",
      value: "1.4M",
      change: "+12.3%",
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Clicks",
      value: "89.5K",
      change: "+15.2%",
      icon: MousePointer,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Avg. CTR",
      value: "6.39%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="flex h-screen bg-background relative overflow-hidden" 
         style={{ background: 'var(--gradient-panda)' }}>
      
      {/* Floating Elements - Saffron themed */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-white/15 rounded-full float-animation z-0 pointer-events-none"></div>
      <div className="absolute top-1/3 right-20 w-12 h-12 bg-white/10 rounded-full bounce-gentle bounce-delay-1 z-0 pointer-events-none"></div>
      <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-white/12 rounded-full float-animation float-delay-2 z-0 pointer-events-none"></div>
      <div className="absolute top-20 left-1/3 w-3 h-3 bg-white/20 rounded-full float-animation pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/3 w-5 h-5 bg-white/15 rounded-full bounce-gentle bounce-delay-2 pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-10 w-2 h-2 bg-white/30 rounded-full float-animation float-delay-1 pointer-events-none"></div>

      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10">
        <Header />

        <div className="flex-1 p-6 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">Analytics Dashboard</h1>
              <p className="text-white/80">Monitor your advertising performance</p>
            </div>
            <div className="flex gap-3">
              <Select defaultValue="7days">
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/90 border-0 transform hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                      <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {metric.change.startsWith('+') ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <p className={`text-sm ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.change}
                        </p>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${metric.bgColor}`}>
                      <metric.icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Performance Over Time */}
            <Card className="backdrop-blur-sm bg-white/90 border-0 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle>Performance Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#666' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#666' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #ccc', 
                          borderRadius: '8px' 
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="impressions" 
                        stroke="hsl(var(--google-red))" 
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--google-red))", strokeWidth: 2, r: 4 }}
                        name="Impressions"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="clicks" 
                        stroke="hsl(var(--google-blue))" 
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--google-blue))", strokeWidth: 2, r: 4 }}
                        name="Clicks"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Distribution */}
            <Card className="backdrop-blur-sm bg-white/90 border-0 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle>Revenue by Ad Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {revenueByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `₹${props.payload.revenue.toLocaleString()}`, 
                          'Revenue'
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trend */}
          <Card className="mb-8 backdrop-blur-sm bg-white/90 border-0 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#666' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#666' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #ccc', 
                        borderRadius: '8px' 
                      }}
                      formatter={(value) => [`₹${value}`, 'Revenue']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--google-green))" 
                      fill="url(#colorRevenue)" 
                      strokeWidth={3}
                    />
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--google-green))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--google-green))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Ads */}
          <Card className="backdrop-blur-sm bg-white/90 border-0 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle>Top Performing Ads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformingAds.map((ad, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex-1">
                      <h4 className="font-medium">{ad.name}</h4>
                      <div className="grid grid-cols-4 gap-4 mt-2 text-sm text-muted-foreground">
                        <div>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {ad.impressions.toLocaleString()} views
                          </span>
                        </div>
                        <div>
                          <span className="flex items-center gap-1">
                            <MousePointer className="w-3 h-3" />
                            {ad.clicks.toLocaleString()} clicks
                          </span>
                        </div>
                        <div>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            ₹{ad.revenue.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <Badge variant="outline">{ad.ctr}% CTR</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`flex items-center gap-1 ${ad.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {ad.change > 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                          {ad.change > 0 ? '+' : ''}{ad.change}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;