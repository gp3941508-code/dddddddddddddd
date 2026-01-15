import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Trash2, Plus, Edit2, Save, X } from 'lucide-react';
import { useBillingData } from '@/hooks/useBillingData';
import { useAppSettings } from '@/hooks/useAppSettings';

const BillingDataEditor = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { billingData, monthlyBilling, loading, error, updateBillingData, updateMonthlyBilling, addMonthlyBilling, deleteMonthlyBilling } = useBillingData();
  const { settings } = useAppSettings();
  const symbol = settings.currencySymbol;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleSave = async () => {
    try {
      setIsEditing(false);
      toast({
        title: "Billing data updated",
        description: "All billing information has been saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save billing data",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const updateFunds = async (value: string) => {
    if (billingData) {
      try {
        await updateBillingData({ available_funds: parseFloat(value) || 0 });
        toast({
          title: "Success",
          description: "Available funds updated!",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update funds",
          variant: "destructive",
        });
      }
    }
  };

  const updateLastPayment = async (value: string) => {
    if (billingData) {
      try {
        await updateBillingData({ last_payment_amount: parseFloat(value) || 0 });
        toast({
          title: "Success",
          description: "Payment information updated!",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update payment",
          variant: "destructive",
        });
      }
    }
  };

  const updateMonthlyData = async (id: string, field: string, value: string) => {
    try {
      const updates = { [field]: field === 'month' ? parseInt(value) || 1 : (field === 'year' ? parseInt(value) || 2025 : parseFloat(value) || 0) };
      await updateMonthlyBilling(id, updates);
      toast({
        title: "Success",
        description: "Monthly data updated!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update monthly data",
        variant: "destructive",
      });
    }
  };

  const updateMonthDetails = async (id: string, field: string, value: string) => {
    try {
      const updates = { [field]: parseFloat(value) || 0 };
      await updateMonthlyBilling(id, updates);
      toast({
        title: "Success",
        description: "Details updated!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update details",
        variant: "destructive",
      });
    }
  };

  const addNewMonth = async () => {
    if (billingData) {
      try {
        // Find the next available month/year combination
        const currentDate = new Date();
        let suggestedMonth = currentDate.getMonth() + 1; // 1-12
        let suggestedYear = currentDate.getFullYear();
        
        // Check if this month/year already exists
        const existingRecord = monthlyBilling.find(m => m.month === suggestedMonth && m.year === suggestedYear);
        
        if (existingRecord) {
          // If current month exists, suggest next month
          suggestedMonth += 1;
          if (suggestedMonth > 12) {
            suggestedMonth = 1;
            suggestedYear += 1;
          }
          
          // Check again for the next month
          const nextExistingRecord = monthlyBilling.find(m => m.month === suggestedMonth && m.year === suggestedYear);
          if (nextExistingRecord) {
            throw new Error(`Month ${suggestedMonth}/${suggestedYear} already exists. Please delete existing record first or use a different month.`);
          }
        }

        await addMonthlyBilling({
          month: suggestedMonth,
          year: suggestedYear,
          net_cost: 0,
          payments: 0,
          funds_from_previous: 0,
          campaigns: 0,
          adjustments: 0,
          taxes_and_fees: 0,
          ending_balance: 0
        });
        
        toast({
          title: "Success",
          description: `New month added: ${new Date(2024, suggestedMonth - 1).toLocaleString('default', { month: 'long' })} ${suggestedYear}`,
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to add month - month/year combination might already exist",
          variant: "destructive",
        });
      }
    }
  };

  const deleteMonth = async (id: string) => {
    try {
      await deleteMonthlyBilling(id);
      toast({
        title: "Success",
        description: "Month deleted!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete month",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Billing Data Editor
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Billing Data
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-muted-foreground">
          Manage billing data displayed on the billing page
        </div>

        {/* Available Funds and Last Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Available Funds ({symbol})</Label>
            {isEditing ? (
              <Input
                type="number"
                step="0.01"
                value={billingData?.available_funds || 0}
                onChange={(e) => updateFunds(e.target.value)}
                placeholder="0.00"
              />
            ) : (
              <div className="p-3 bg-green-50 text-green-700 rounded-md font-mono text-lg font-semibold">
                {symbol}{billingData?.available_funds?.toFixed(2) || '0.00'}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Last Payment Amount ({symbol})</Label>
            {isEditing ? (
              <Input
                type="number"
                step="0.01"
                value={billingData?.last_payment_amount || 0}
                onChange={(e) => updateLastPayment(e.target.value)}
                placeholder="0.00"
              />
            ) : (
              <div className="p-3 bg-blue-50 text-blue-700 rounded-md font-mono">
                {symbol}{billingData?.last_payment_amount?.toFixed(2) || "0.00"}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Monthly Data */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Monthly Billing Data</h3>
            {isEditing && (
              <Button onClick={addNewMonth} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Month
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {monthlyBilling.map((month) => (
              <Card key={month.id} className="relative">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Month</Label>
                      {isEditing ? (
                        <Input
                          value={month.month.toString()}
                          onChange={(e) => updateMonthlyData(month.id, 'month', e.target.value)}
                          className="mt-1"
                          type="number"
                          min="1"
                          max="12"
                        />
                      ) : (
                        <div className="font-medium">{new Date(2024, month.month - 1).toLocaleString('default', { month: 'long' })}</div>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Year</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={month.year}
                          onChange={(e) => updateMonthlyData(month.id, 'year', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <div className="font-medium">{month.year}</div>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Net Cost ({symbol})</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={month.net_cost}
                          onChange={(e) => updateMonthlyData(month.id, 'net_cost', e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <div className="font-mono">{symbol}{month.net_cost.toFixed(2)}</div>
                      )}
                    </div>

                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Payments ({symbol})</Label>
                      {isEditing ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={month.payments}
                            onChange={(e) => updateMonthlyData(month.id, 'payments', e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <div className="font-mono">{symbol}{month.payments.toFixed(2)}</div>
                        )}
                      </div>
                      
                      {isEditing && (
                        <Button
                          onClick={() => deleteMonth(month.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium mb-3 block">Monthly Details</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Funds from Previous</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={month.funds_from_previous}
                            onChange={(e) => updateMonthDetails(month.id, 'funds_from_previous', e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                            <div className="font-mono text-sm">{symbol}{month.funds_from_previous.toFixed(2)}</div>
                        )}
                      </div>
                      
                      <div>
                        <Label className="text-xs text-muted-foreground">Campaigns</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={month.campaigns}
                            onChange={(e) => updateMonthDetails(month.id, 'campaigns', e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                            <div className="font-mono text-sm">{symbol}{month.campaigns.toFixed(2)}</div>
                        )}
                      </div>
                      
                      <div>
                        <Label className="text-xs text-muted-foreground">Adjustments</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={month.adjustments}
                            onChange={(e) => updateMonthDetails(month.id, 'adjustments', e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                            <div className="font-mono text-sm">{symbol}{month.adjustments.toFixed(2)}</div>
                        )}
                      </div>
                      
                      <div>
                        <Label className="text-xs text-muted-foreground">Taxes and Fees</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={month.taxes_and_fees}
                            onChange={(e) => updateMonthDetails(month.id, 'taxes_and_fees', e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                            <div className="font-mono text-sm">{symbol}{month.taxes_and_fees.toFixed(2)}</div>
                        )}
                      </div>
                      
                      <div>
                        <Label className="text-xs text-muted-foreground">Ending Balance</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={month.ending_balance}
                            onChange={(e) => updateMonthDetails(month.id, 'ending_balance', e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                            <div className="font-mono text-sm">{symbol}{month.ending_balance.toFixed(2)}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {month.net_cost > 0 || month.payments > 0 ? (
                    <Badge variant="outline" className="mt-3">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="mt-3">
                      No activity
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Summary */}
        <Card className="bg-muted/20">
          <CardContent className="p-4">
            <div className="text-sm">
              <div className="font-semibold mb-2">Summary:</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  Total Net Cost: <span className="font-mono">{symbol}{monthlyBilling.reduce((sum, month) => sum + month.net_cost, 0).toFixed(2)}</span>
                </div>
                <div>
                  Total Payments: <span className="font-mono">{symbol}{monthlyBilling.reduce((sum, month) => sum + month.payments, 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground bg-green-50 p-3 rounded-md">
          <strong>Note:</strong> Changes are saved immediately to the database when you make them.
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingDataEditor;