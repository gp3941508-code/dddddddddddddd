import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Sidebar, Header } from '@/components/google-ads';
import { ChevronDown, ChevronRight, Calendar, FileText, Plus, MoreHorizontal } from 'lucide-react';
import { useBillingData } from '@/hooks/useBillingData';
import { toast } from '@/hooks/use-toast';

const Billing = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [dateRange, setDateRange] = useState('Oct 30, 2024 – Jul 26, 2025');
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);
  
  const { billingData, monthlyBilling, loading, error, updateBillingData, updateMonthlyBilling } = useBillingData();

  const toggleMonthExpansion = (monthId: string) => {
    setExpandedMonths(prev => 
      prev.includes(monthId) 
        ? prev.filter(id => id !== monthId)
        : [...prev, monthId]
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <div className="flex-1 p-6 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Summary</h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-muted-foreground">All time</span>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Oct 30, 2024 – Jul 26, 2025">Oct 30, 2024 – Jul 26, 2025</SelectItem>
                    <SelectItem value="Last 30 days">Last 30 days</SelectItem>
                    <SelectItem value="Last 90 days">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="link" className="text-blue-600 p-0 h-auto">
                  Show last 30 days
                </Button>
              </div>
            </div>
          </div>

          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Available Funds */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-normal">Available funds</CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-normal">₹{billingData?.available_funds?.toFixed(2) || '0.00'}</div>
                    <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">
                      See how this is calculated
                    </Button>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add funds
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Last Payment */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-normal">Last payment</CardTitle>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {billingData?.last_payment_amount ? 
                    `Last payment: ₹${billingData.last_payment_amount} on ${billingData.last_payment_date}` : 
                    "You haven't made any payments yet"
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Month Summary */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <span className="font-medium">{monthlyBilling.find(m => m.month === 7) ? new Date(2024, 6).toLocaleString('default', { month: 'long' }) : 'July'} (current month)</span>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Net cost ⓘ</div>
                    <div className="font-medium">₹{monthlyBilling.find(m => m.month === 7)?.net_cost.toFixed(2) || '0.00'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Payments ⓘ</div>
                    <div className="font-medium">₹{monthlyBilling.find(m => m.month === 7)?.payments.toFixed(2) || '0.00'}</div>
                    <ChevronDown className="w-4 h-4 inline ml-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Year and Documents */}
          <div className="flex items-center justify-between mb-4">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-blue-600 text-white hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              View documents
            </Button>
          </div>

          {/* Monthly Breakdown */}
          <Card>
            <CardContent className="p-0">
              {monthlyBilling.filter(m => m.month !== 7).map((monthData, index) => (
                <div key={monthData.id}>
                  <div 
                    className="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleMonthExpansion(monthData.id)}
                  >
                    <div className="flex items-center gap-2">
                      {expandedMonths.includes(monthData.id) ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                      }
                      <span className="font-medium">{new Date(2024, monthData.month - 1).toLocaleString('default', { month: 'long' })}</span>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Net cost</div>
                        <div className="font-medium">₹{monthData.net_cost.toFixed(2)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Payments</div>
                        <div className="font-medium">₹{monthData.payments.toFixed(2)}</div>
                        <ChevronDown className="w-4 h-4 inline ml-2" />
                      </div>
                    </div>
                  </div>
                  {expandedMonths.includes(monthData.id) && (
                    <div className="px-8 pb-4 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">⏷ Expand all sections</span>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm">Funds from previous month</span>
                          <span className="font-mono">₹{monthData.funds_from_previous.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm">Payments</span>
                          <span className="font-mono">₹{monthData.payments.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm">Campaigns</span>
                          <span className="font-mono">₹{monthData.campaigns.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm flex items-center gap-1">
                            Adjustments 
                            <span className="w-3 h-3 rounded-full border border-muted-foreground text-xs flex items-center justify-center">ⓘ</span>
                          </span>
                          <span className="font-mono">₹{monthData.adjustments.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm">Taxes and fees</span>
                          <span className="font-mono">₹{monthData.taxes_and_fees.toFixed(2)}</span>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex justify-between items-center py-2 font-medium">
                          <span className="text-sm">Net cost</span>
                          <span className="font-mono">₹{monthData.net_cost.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 bg-muted/50 px-3 rounded">
                          <span className="text-sm font-medium">Ending balance</span>
                          <span className="font-mono font-medium">₹{monthData.ending_balance.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {index < monthlyBilling.length - 2 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Billing;