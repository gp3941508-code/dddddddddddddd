import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sidebar, Header } from '@/components/google-ads';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Plus, 
  Users, 
  DollarSign, 
  MousePointer, 
  Eye,
  TrendingUp,
  Activity,
  Shield,
  Settings,
  FileText,
  CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Ads",
      value: "1,247",
      change: "+12.5%",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Ads",
      value: "892",
      change: "+8.2%",
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Revenue",
      value: "₹2,45,680",
      change: "+18.7%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Clicks",
      value: "89,543",
      change: "+15.3%",
      icon: MousePointer,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const recentActivity = [
    { id: 1, action: "New ad created", user: "John Doe", time: "2 mins ago", status: "success" },
    { id: 2, action: "Ad budget updated", user: "Jane Smith", time: "5 mins ago", status: "info" },
    { id: 3, action: "Ad paused", user: "Mike Johnson", time: "10 mins ago", status: "warning" },
    { id: 4, action: "User assigned to campaign", user: "Sarah Wilson", time: "15 mins ago", status: "success" },
  ];

  const topPerformingAds = [
    { id: 1, name: "Holiday Sale Banner", impressions: 25600, clicks: 1280, revenue: "₹12,560", ctr: "5.0%" },
    { id: 2, name: "Product Launch Ad", impressions: 18400, clicks: 920, revenue: "₹9,840", ctr: "5.0%" },
    { id: 3, name: "Brand Awareness", impressions: 15200, clicks: 608, revenue: "₹7,320", ctr: "4.0%" },
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
          {/* Admin Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">Admin Dashboard</h1>
              <p className="text-white/80">Manage all your ads and campaigns</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/90 border-0 transform hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-green-600">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions - Main Admin Features */}
          <Card className="mb-6 backdrop-blur-sm bg-white/95 border-0 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                <Button 
                  onClick={() => navigate('/admin/ads/create')} 
                  className="h-24 flex-col gap-2 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-xs font-medium">Create Ad</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/admin/ads')} 
                  className="h-24 flex-col gap-2 bg-white/80 hover:bg-white border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                  <span className="text-xs font-medium">Manage Ads</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/admin/metrics')} 
                  className="h-24 flex-col gap-2 bg-white/80 hover:bg-white border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <span className="text-xs font-medium">Campaign Metrics</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/admin/billing')} 
                  className="h-24 flex-col gap-2 bg-white/80 hover:bg-white border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <span className="text-xs font-medium">Billing</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/admin/sessions')} 
                  className="h-24 flex-col gap-2 bg-white/80 hover:bg-white border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Shield className="w-6 h-6 text-purple-600" />
                  <span className="text-xs font-medium">Login Sessions</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/admin/analytics')} 
                  className="h-24 flex-col gap-2 bg-white/80 hover:bg-white border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <FileText className="w-6 h-6 text-indigo-600" />
                  <span className="text-xs font-medium">Analytics</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/admin/settings')} 
                  className="h-24 flex-col gap-2 bg-white/80 hover:bg-white border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Settings className="w-6 h-6 text-gray-600" />
                  <span className="text-xs font-medium">Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent Activity */}
            <Card className="backdrop-blur-sm bg-white/90 border-0 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">by {activity.user}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={activity.status === 'success' ? 'default' : activity.status === 'warning' ? 'secondary' : 'outline'}
                          className="mb-1"
                        >
                          {activity.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/admin/activity')}>
                  View All Activity
                </Button>
              </CardContent>
            </Card>

            {/* Top Performing Ads */}
            <Card className="backdrop-blur-sm bg-white/90 border-0 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Top Performing Ads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformingAds.map((ad) => (
                    <div key={ad.id} className="p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{ad.name}</h4>
                        <Badge variant="outline">{ad.ctr} CTR</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {ad.impressions.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="flex items-center gap-1">
                            <MousePointer className="w-3 h-3" />
                            {ad.clicks.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {ad.revenue}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/admin/ads')}>
                  Manage All Ads
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;