import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sidebar, Header } from '@/components/google-ads';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Download,
  MoreHorizontal,
  Calendar,
  LogOut,
  BarChart3,
  Receipt
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAds } from '@/hooks/useAds';
import { useAuthState } from '@/hooks/useAuth';
import AdminLogin from '@/components/AdminLogin';
import InlineEdit from '@/components/admin/InlineEdit';
import PerformanceChart from '@/components/admin/PerformanceChart';
import BillingReceipt from '@/components/admin/BillingReceipt';
import BillingDataEditor from '@/components/admin/BillingDataEditor';
import CampaignMetricsEditor from '@/components/admin/CampaignMetricsEditor';
import { toast } from '@/hooks/use-toast';
import { useAppSettings } from '@/hooks/useAppSettings';

const AdminAds = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAds, setSelectedAds] = useState<string[]>([]);
  const { isAuthenticated, login, logout, user } = useAuthState();
  const { ads, loading, error, toggleAdStatus: toggleStatus, deleteAd: deleteAdFromDB, updateAd } = useAds();
  const { settings } = useAppSettings();
  const symbol = settings.currencySymbol;


  const handleToggleAdStatus = async (adId: string) => {
    try {
      await toggleStatus(adId);
      toast({
        title: "Success",
        description: "Ad status updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ad status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAd = async (adId: string) => {
    try {
      await deleteAdFromDB(adId);
      toast({
        title: "Success",
        description: "Ad deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete ad",
        variant: "destructive",
      });
    }
  };

  const handleInlineEdit = async (adId: string, field: string, value: string | number) => {
    try {
      await updateAd(adId, { [field]: value });
      toast({
        title: "Success",
        description: `${field} updated successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update ${field}`,
        variant: "destructive",
      });
    }
  };

  const bulkAction = (action: string) => {
    console.log(`Performing ${action} on ads:`, selectedAds);
  };

  const exportToCSV = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    const timeStr = now.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    
    // Google Ads style report header
    const reportHeader = [
      ['Campaign performance report'],
      [''],
      ['Report type:', 'Campaign'],
      ['Date range:', 'All time'],
      ['Download date:', `${dateStr} ${timeStr}`],
      ['Currency:', settings.currency],
      [''],
    ];
    
    // Calculate totals
    const totalImpressions = filteredAds.reduce((sum, ad) => sum + ad.impressions, 0);
    const totalClicks = filteredAds.reduce((sum, ad) => sum + ad.clicks, 0);
    const totalCost = filteredAds.reduce((sum, ad) => sum + ad.revenue, 0);
    const totalConversions = filteredAds.reduce((sum, ad) => sum + (ad.conversions || 0), 0);
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100) : 0;
    const avgCPC = totalClicks > 0 ? (totalCost / totalClicks) : 0;
    
    // Headers matching Google Ads format
    const headers = [
      'Campaign',
      'Campaign ID',
      'Campaign state',
      'Budget',
      'Impressions',
      'Clicks',
      'CTR',
      'Avg. CPC',
      'Cost',
      'Conversions',
      'Cost / conv.',
      'Conv. rate',
      'Assigned to',
      'Campaign start date',
      'Campaign end date'
    ];
    
    // Data rows
    const csvData = filteredAds.map(ad => {
      const cpc = ad.clicks > 0 ? (ad.revenue / ad.clicks) : 0;
      const conversions = ad.conversions || 0;
      const convRate = ad.clicks > 0 ? ((conversions / ad.clicks) * 100) : 0;
      const costPerConv = conversions > 0 ? (ad.revenue / conversions) : 0;
      
      // Format dates with time
      const formatDateTime = (dateStr: string | null | undefined) => {
        if (!dateStr) return '--';
        const date = new Date(dateStr);
        return date.toLocaleString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
      };
      
      return [
        ad.name,
        ad.id.substring(0, 13), // Shortened ID like Google Ads
        ad.status === 'active' ? 'Enabled' : ad.status === 'paused' ? 'Paused' : 'Removed',
        ad.budget_amount.toFixed(2),
        ad.impressions,
        ad.clicks,
        (ad.ctr / 100).toFixed(4), // Decimal format like Google (0.0532 for 5.32%)
        cpc.toFixed(2),
        ad.revenue.toFixed(2),
        conversions,
        conversions > 0 ? costPerConv.toFixed(2) : '--',
        convRate > 0 ? (convRate / 100).toFixed(4) : '0.0000', // Decimal format
        ad.assigned_user_name || '--',
        formatDateTime(ad.created_at),
        ad.status === 'ended' && ad.updated_at ? formatDateTime(ad.updated_at) : '--'
      ];
    });

    // Total row (Google Ads style)
    const totalRow = [
      'Total',
      '',
      '',
      '',
      totalImpressions,
      totalClicks,
      (avgCTR / 100).toFixed(4),
      avgCPC.toFixed(2),
      totalCost.toFixed(2),
      totalConversions,
      totalConversions > 0 ? (totalCost / totalConversions).toFixed(2) : '--',
      totalClicks > 0 ? ((totalConversions / totalClicks) * 100 / 100).toFixed(4) : '0.0000',
      '',
      '',
      ''
    ];

    // Build CSV content
    const csvContent = [
      ...reportHeader.map(row => row.join(',')),
      headers.join(','),
      ...csvData.map(row => row.map(cell => {
        // Escape cells with commas or quotes
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')),
      totalRow.map(cell => {
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    ].join('\n');

    // Create filename with timestamp (Google Ads format)
    const timestamp = now.toISOString().replace(/[:.]/g, '-').split('.')[0];
    const fileName = `Campaign_${timestamp}.csv`;

    // Download
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: `${filteredAds.length} campaigns exported successfully`,
    });
  };

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (ad.assigned_user_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ad.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getActiveAdsCount = () => ads.filter(ad => ad.status === 'active').length;
  const getPausedAdsCount = () => ads.filter(ad => ad.status === 'paused').length;
  const getEndedAdsCount = () => ads.filter(ad => ad.status === 'ended').length;

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
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">Admin Panel</h1>
              <p className="text-white/80">Welcome back, {user?.username}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => navigate('/admin/ads/create')} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create New Ad
              </Button>
              <Button variant="outline" onClick={logout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="backdrop-blur-sm bg-white/90 border-0 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{ads.length}</div>
                <div className="text-sm text-muted-foreground">Total Ads</div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-sm bg-white/90 border-0 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{getActiveAdsCount()}</div>
                <div className="text-sm text-muted-foreground">Active</div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-sm bg-white/90 border-0 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-600">{getPausedAdsCount()}</div>
                <div className="text-sm text-muted-foreground">Paused</div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-sm bg-white/90 border-0 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">{getEndedAdsCount()}</div>
                <div className="text-sm text-muted-foreground">Ended</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="ads" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="ads">Ad Management</TabsTrigger>
              <TabsTrigger value="campaign-metrics">Campaign Metrics</TabsTrigger>
              <TabsTrigger value="billing-data">Billing Data</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="ads" className="space-y-6">
              {/* Filters and Search */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search ads by name or assigned user..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="ended">Ended</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      Date Range
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportToCSV}>
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Bulk Actions */}
              {selectedAds.length > 0 && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {selectedAds.length} ad{selectedAds.length > 1 ? 's' : ''} selected
                      </span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => bulkAction('activate')}>
                          Activate
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => bulkAction('pause')}>
                          Pause
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => bulkAction('delete')}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Table with Inline Editing */}
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-8">
                          <input 
                            type="checkbox" 
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAds(filteredAds.map(ad => ad.id));
                              } else {
                                setSelectedAds([]);
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Ad Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>CPC</TableHead>
                        <TableHead>Impressions</TableHead>
                        <TableHead>Clicks</TableHead>
                        <TableHead>CTR</TableHead>
                        <TableHead>Total Spent</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAds.map((ad) => (
                        <TableRow key={ad.id}>
                          <TableCell>
                            <input 
                              type="checkbox"
                              checked={selectedAds.includes(ad.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAds([...selectedAds, ad.id]);
                                } else {
                                  setSelectedAds(selectedAds.filter(id => id !== ad.id));
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <InlineEdit 
                              value={ad.name}
                              onSave={(value) => handleInlineEdit(ad.id, 'name', value)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch 
                                checked={ad.status === 'active'}
                                onCheckedChange={() => handleToggleAdStatus(ad.id)}
                                disabled={ad.status === 'ended'}
                              />
                              <Badge 
                                variant={
                                  ad.status === 'active' ? 'default' : 
                                  ad.status === 'paused' ? 'secondary' : 
                                  'destructive'
                                }
                              >
                                {ad.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <InlineEdit 
                              value={ad.budget_amount}
                              onSave={(value) => handleInlineEdit(ad.id, 'budget_amount', value)}
                              type="number"
                              prefix={symbol}
                              suffix={`/${ad.budget_period}`}
                            />
                          </TableCell>
                          <TableCell>
                            <InlineEdit 
                              value={(ad.revenue / ad.clicks || 0).toFixed(2)}
                              onSave={(value) => handleInlineEdit(ad.id, 'cpc', value)}
                              type="number"
                              prefix={symbol}
                            />
                          </TableCell>
                          <TableCell>
                            <InlineEdit 
                              value={ad.impressions}
                              onSave={(value) => handleInlineEdit(ad.id, 'impressions', value)}
                              type="number"
                            />
                          </TableCell>
                          <TableCell>
                            <InlineEdit 
                              value={ad.clicks}
                              onSave={(value) => handleInlineEdit(ad.id, 'clicks', value)}
                              type="number"
                            />
                          </TableCell>
                          <TableCell>
                            <InlineEdit 
                              value={ad.ctr.toFixed(1)}
                              onSave={(value) => handleInlineEdit(ad.id, 'ctr', value)}
                              type="number"
                              suffix="%"
                            />
                          </TableCell>
                          <TableCell>
                            <InlineEdit 
                              value={ad.revenue}
                              onSave={(value) => handleInlineEdit(ad.id, 'revenue', value)}
                              type="number"
                              prefix={symbol}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/ads/${ad.id}`)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteAd(ad.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {/* Table Footer */}
                  <div className="border-t p-4">
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div>Showing {filteredAds.length} of {ads.length} ads</div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm" disabled>Next</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="campaign-metrics">
              <CampaignMetricsEditor ads={ads} onUpdate={() => window.location.reload()} />
            </TabsContent>
            
            <TabsContent value="performance">
              <PerformanceChart ads={ads} />
            </TabsContent>
            
            <TabsContent value="billing-data">
              <BillingDataEditor />
            </TabsContent>
            <TabsContent value="billing">
              <BillingReceipt ads={ads} />
            </TabsContent>
            
            <TabsContent value="analytics">
              <div className="grid gap-6">
                <PerformanceChart ads={ads} />
                <BillingReceipt ads={ads} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminAds;