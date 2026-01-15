import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Save, X } from 'lucide-react';
import { useAds, Ad } from '@/hooks/useAds';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CampaignMetricsEditorProps {
  ads: Ad[];
  onUpdate: () => void;
}

interface GlobalMetrics {
  totalClicks: number;
  totalImpressions: number;
  totalRevenue: number;
  totalConversions: number;
  avgCpc: number;
  avgCostPerConversion: number;
}

const CampaignMetricsEditor = ({ ads, onUpdate }: CampaignMetricsEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Calculate current metrics
  const currentMetrics: GlobalMetrics = {
    totalClicks: ads.reduce((sum, ad) => sum + ad.clicks, 0),
    totalImpressions: ads.reduce((sum, ad) => sum + ad.impressions, 0),
    totalRevenue: ads.reduce((sum, ad) => sum + ad.revenue, 0),
    totalConversions: ads.reduce((sum, ad) => sum + ad.conversions, 0),
    avgCpc: 0,
    avgCostPerConversion: 0,
  };

  currentMetrics.avgCpc = currentMetrics.totalClicks > 0 
    ? currentMetrics.totalRevenue / currentMetrics.totalClicks 
    : 0;
  
  currentMetrics.avgCostPerConversion = currentMetrics.totalConversions > 0 
    ? currentMetrics.totalRevenue / currentMetrics.totalConversions 
    : 0;

  const [newMetrics, setNewMetrics] = useState<GlobalMetrics>(currentMetrics);

  const handleSave = async () => {
    setLoading(true);
    try {
      const totalClicks = Number(newMetrics.totalClicks);
      const totalImpressions = Number(newMetrics.totalImpressions);
      const totalRevenue = Number(newMetrics.totalRevenue);
      const totalConversions = Number(newMetrics.totalConversions);

      // Calculate CTR for proportional distribution
      const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

      // Update each ad proportionally
      for (const ad of ads) {
        const impressionRatio = totalImpressions > 0 ? ad.impressions / Number(currentMetrics.totalImpressions) : 1 / ads.length;
        
        const newAdClicks = Math.round(totalClicks * impressionRatio);
        const newAdImpressions = Math.round(totalImpressions * impressionRatio);
        const newAdRevenue = totalRevenue * impressionRatio;
        const newAdConversions = Math.round(totalConversions * impressionRatio);
        const newAdCtr = newAdImpressions > 0 ? (newAdClicks / newAdImpressions) * 100 : 0;
        const newAdCostPerConv = newAdConversions > 0 ? newAdRevenue / newAdConversions : 0;

        await supabase
          .from('ads')
          .update({
            clicks: newAdClicks,
            impressions: newAdImpressions,
            ctr: newAdCtr,
            revenue: newAdRevenue,
            conversions: newAdConversions,
            cost_per_conversion: newAdCostPerConv,
          })
          .eq('id', ad.id);
      }

      toast({
        title: "Success",
        description: "Campaign metrics updated successfully",
      });

      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating campaign metrics:', error);
      toast({
        title: "Error",
        description: "Failed to update campaign metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNewMetrics(currentMetrics);
    setIsEditing(false);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Campaign Metrics</CardTitle>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Metrics
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <Label>Total Clicks</Label>
            {isEditing ? (
              <Input
                type="number"
                value={newMetrics.totalClicks}
                onChange={(e) => setNewMetrics(prev => ({ ...prev, totalClicks: Number(e.target.value) }))}
              />
            ) : (
              <p className="text-2xl font-semibold">{Number(currentMetrics.totalClicks).toLocaleString()}</p>
            )}
          </div>

          <div>
            <Label>Total Impressions</Label>
            {isEditing ? (
              <Input
                type="number"
                value={newMetrics.totalImpressions}
                onChange={(e) => setNewMetrics(prev => ({ ...prev, totalImpressions: Number(e.target.value) }))}
              />
            ) : (
              <p className="text-2xl font-semibold">{Number(currentMetrics.totalImpressions).toLocaleString()}</p>
            )}
          </div>

          <div>
            <Label>Total Revenue</Label>
            {isEditing ? (
              <Input
                type="number"
                step="0.01"
                value={newMetrics.totalRevenue}
                onChange={(e) => setNewMetrics(prev => ({ ...prev, totalRevenue: Number(e.target.value) }))}
              />
            ) : (
              <p className="text-2xl font-semibold">₹{Number(currentMetrics.totalRevenue).toLocaleString()}</p>
            )}
          </div>

          <div>
            <Label>Total Conversions</Label>
            {isEditing ? (
              <Input
                type="number"
                value={newMetrics.totalConversions}
                onChange={(e) => setNewMetrics(prev => ({ ...prev, totalConversions: Number(e.target.value) }))}
              />
            ) : (
              <p className="text-2xl font-semibold">{Number(currentMetrics.totalConversions).toLocaleString()}</p>
            )}
          </div>

          <div>
            <Label>Avg. CPC</Label>
            <p className="text-2xl font-semibold">₹{currentMetrics.avgCpc.toFixed(2)}</p>
          </div>

          <div>
            <Label>Avg. Cost/Conv</Label>
            <p className="text-2xl font-semibold">₹{currentMetrics.avgCostPerConversion.toFixed(2)}</p>
          </div>

          <div>
            <Label>CTR</Label>
            <p className="text-2xl font-semibold">
              {currentMetrics.totalImpressions > 0 
                ? ((currentMetrics.totalClicks / currentMetrics.totalImpressions) * 100).toFixed(2)
                : '0.00'
              }%
            </p>
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}

        {isEditing && (
          <p className="text-sm text-muted-foreground mt-2">
            Changes will be distributed proportionally across all campaigns based on their current impression share.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignMetricsEditor;