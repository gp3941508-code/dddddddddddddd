import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Sidebar, Header } from '@/components/google-ads';

interface MetricsData {
  dateRange: string;
  impressions: number;
  cost: number;
  conversions: number;
  cpa: number;
}

const AdminCampaignMetrics = () => {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<MetricsData[]>([
    { dateRange: 'Today', impressions: 472000, cost: 64810, conversions: 401.52, cpa: 161.41 },
    { dateRange: 'Last 7 days', impressions: 3304000, cost: 453670, conversions: 2810.64, cpa: 161.41 },
    { dateRange: 'Last 30 days', impressions: 14160000, cost: 1944300, conversions: 12045.68, cpa: 161.41 },
    { dateRange: 'All time', impressions: 28320000, cost: 3888600, conversions: 24091.36, cpa: 161.41 }
  ]);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = () => {
    const stored = localStorage.getItem('campaign_metrics');
    if (stored) {
      setMetrics(JSON.parse(stored));
    }
  };

  const handleMetricChange = (index: number, field: keyof MetricsData, value: string) => {
    const newMetrics = [...metrics];
    newMetrics[index] = {
      ...newMetrics[index],
      [field]: parseFloat(value) || 0
    };
    setMetrics(newMetrics);
  };

  const handleSave = () => {
    setLoading(true);
    try {
      localStorage.setItem('campaign_metrics', JSON.stringify(metrics));
      window.dispatchEvent(new Event('metricsUpdated'));
      
      toast({
        title: "Success",
        description: "Campaign metrics updated successfully!",
      });
    } catch (error) {
      console.error('Error saving metrics:', error);
      toast({
        title: "Error",
        description: "Failed to save metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 overflow-auto relative" 
             style={{ background: 'var(--gradient-panda)' }}>
          
          {/* Floating Elements - Saffron themed */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/15 rounded-full float-animation z-0"></div>
          <div className="absolute top-40 right-16 w-16 h-16 bg-white/10 rounded-full bounce-gentle bounce-delay-1 z-0"></div>
          <div className="absolute bottom-32 left-24 w-24 h-24 bg-white/12 rounded-full float-animation float-delay-2 z-0"></div>
          <div className="absolute top-10 left-1/4 w-4 h-4 bg-white/30 rounded-full float-animation"></div>
          <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-white/20 rounded-full bounce-gentle bounce-delay-2"></div>
          <div className="absolute bottom-1/4 right-10 w-3 h-3 bg-white/40 rounded-full float-animation float-delay-1"></div>
          
          <div className="p-6 relative z-10">
            <Card className="max-w-5xl mx-auto backdrop-blur-sm bg-white/90 shadow-2xl pulse-glow border-0 transform hover:scale-[1.01] transition-all duration-300">
              <CardHeader className="text-center border-b">
                <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 bounce-gentle transform transition-all duration-300" 
                     style={{ background: 'var(--gradient-panda)' }}>
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                  Campaign Metrics Editor
                </CardTitle>
                <p className="text-gray-600 font-medium">Edit metrics for different date ranges</p>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-6">
                  {metrics.map((metric, index) => (
                    <div key={index} className="p-6 rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                        <h3 className="text-xl font-bold text-gray-800">{metric.dateRange}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`impressions-${index}`} className="text-sm font-semibold text-gray-700">
                            Impressions
                          </Label>
                          <Input
                            id={`impressions-${index}`}
                            type="number"
                            value={metric.impressions}
                            onChange={(e) => handleMetricChange(index, 'impressions', e.target.value)}
                            className="h-11 border-2 border-gray-200 focus:border-orange-400 rounded-lg transition-all duration-300 hover:shadow-md"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`cost-${index}`} className="text-sm font-semibold text-gray-700">
                            Cost (₹)
                          </Label>
                          <Input
                            id={`cost-${index}`}
                            type="number"
                            step="0.01"
                            value={metric.cost}
                            onChange={(e) => handleMetricChange(index, 'cost', e.target.value)}
                            className="h-11 border-2 border-gray-200 focus:border-orange-400 rounded-lg transition-all duration-300 hover:shadow-md"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`conversions-${index}`} className="text-sm font-semibold text-gray-700">
                            Conversions
                          </Label>
                          <Input
                            id={`conversions-${index}`}
                            type="number"
                            step="0.01"
                            value={metric.conversions}
                            onChange={(e) => handleMetricChange(index, 'conversions', e.target.value)}
                            className="h-11 border-2 border-gray-200 focus:border-orange-400 rounded-lg transition-all duration-300 hover:shadow-md"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`cpa-${index}`} className="text-sm font-semibold text-gray-700">
                            Avg. Target CPA (₹)
                          </Label>
                          <Input
                            id={`cpa-${index}`}
                            type="number"
                            step="0.01"
                            value={metric.cpa}
                            onChange={(e) => handleMetricChange(index, 'cpa', e.target.value)}
                            className="h-11 border-2 border-gray-200 focus:border-orange-400 rounded-lg transition-all duration-300 hover:shadow-md"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full mt-8 h-12 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  style={{ background: 'var(--gradient-panda)' }}
                >
                  {loading ? "Saving..." : "Save Metrics"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCampaignMetrics;
