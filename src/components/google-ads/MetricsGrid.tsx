import { useMemo, useEffect } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Card, CardContent } from '@/components/ui/card';
import InlineEdit from '@/components/admin/InlineEdit';
import { toast } from '@/hooks/use-toast';
import { useAds } from '@/hooks/useAds';
import { useDateRange } from '@/contexts/DateRangeContext';
import { useCampaignMetrics } from '@/hooks/useCampaignMetrics';

const MetricsGrid = () => {
  const { ads, updateAd, loading } = useAds();
  const { dateRange, getDateRangeText } = useDateRange();
  const { settings } = useAppSettings();
  const symbol = settings.currencySymbol;
  const { metrics: campaignMetrics, getMetricsByDateRange } = useCampaignMetrics();

  // Get metrics based on date range from campaign metrics editor
  const metrics = useMemo(() => {
    const dateRangeMap: Record<string, string> = {
      'today': 'Today',
      '7days': 'Last 7 days',
      '1month': 'Last 30 days',
      'alltime': 'All time'
    };

    const selectedRange = dateRangeMap[dateRange];
    const campaignMetric = getMetricsByDateRange(selectedRange);

    if (!campaignMetric) {
      return [
        { label: 'Impr.', value: '0', bgColor: 'bg-google-blue', textColor: 'text-white', key: 'impressions', rawValue: 0 },
        { label: 'Cost', value: `${symbol}0.00`, bgColor: 'bg-google-red', textColor: 'text-white', key: 'revenue', rawValue: 0 },
        { label: 'Conversions', value: '0.00', bgColor: 'bg-google-yellow', textColor: 'text-white', key: 'conversions', rawValue: 0 },
        { label: 'Avg. target CPA', value: '—', bgColor: 'bg-google-green', textColor: 'text-white', key: 'cpa', rawValue: 0 },
      ];
    }

    const formatNumber = (num: number) => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
      return num.toString();
    };

    return [
      { 
        label: 'Impr.', 
        value: formatNumber(campaignMetric.impressions),
        bgColor: 'bg-google-blue', 
        textColor: 'text-white',
        key: 'impressions',
        rawValue: campaignMetric.impressions
      },
      { 
        label: 'Cost', 
        value: `${symbol}${campaignMetric.cost.toFixed(2)}`, 
        bgColor: 'bg-google-red', 
        textColor: 'text-white',
        key: 'revenue',
        rawValue: campaignMetric.cost
      },
      { 
        label: 'Conversions', 
        value: campaignMetric.conversions.toFixed(2), 
        bgColor: 'bg-google-yellow', 
        textColor: 'text-white',
        key: 'conversions',
        rawValue: campaignMetric.conversions
      },
      { 
        label: 'Avg. target CPA', 
        value: campaignMetric.cpa > 0 ? `${symbol}${campaignMetric.cpa.toFixed(2)}` : '—', 
        bgColor: 'bg-google-green', 
        textColor: 'text-white',
        key: 'cpa',
        rawValue: campaignMetric.cpa
      },
    ];
  }, [dateRange, campaignMetrics, symbol, getMetricsByDateRange]);

  // Old calculation (commented out for reference)
  /*const metrics = useMemo(() => {
    if (!ads.length) {
      return [
        { label: 'Impr.', value: '0', bgColor: 'bg-google-blue', textColor: 'text-white', key: 'impressions', rawValue: 0 },
        { label: 'Cost', value: `${symbol}0.00`, bgColor: 'bg-google-red', textColor: 'text-white', key: 'revenue', rawValue: 0 },
        { label: 'Conversions', value: '0.00', bgColor: 'bg-google-yellow', textColor: 'text-white', key: 'conversions', rawValue: 0 },
        { label: 'Avg. target CPA', value: '—', bgColor: 'bg-google-green', textColor: 'text-white', key: 'cpa', rawValue: 0 },
      ];
    }

    const totalImpressions = ads.reduce((sum, ad) => sum + (ad.impressions || 0), 0);
    const totalRevenue = ads.reduce((sum, ad) => sum + (Number(ad.revenue) || 0), 0);
    const totalClicks = ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
    const totalConversions = totalClicks * 0.02; // 2% conversion rate estimate
    const avgCpa = totalConversions > 0 ? totalRevenue / totalConversions : 0;

    return [
      { 
        label: 'Impr.', 
        value: totalImpressions >= 1000000 ? `${(totalImpressions / 1000000).toFixed(1)}M` : 
                totalImpressions >= 1000 ? `${(totalImpressions / 1000).toFixed(0)}K` : totalImpressions.toString(), 
        bgColor: 'bg-google-blue', 
        textColor: 'text-white',
        key: 'impressions',
        rawValue: totalImpressions
      },
      { 
        label: 'Cost', 
        value: `${symbol}${totalRevenue.toFixed(2)}`, 
        bgColor: 'bg-google-red', 
        textColor: 'text-white',
        key: 'revenue',
        rawValue: totalRevenue
      },
      { 
        label: 'Conversions', 
        value: totalConversions.toFixed(2), 
        bgColor: 'bg-google-yellow', 
        textColor: 'text-white',
        key: 'conversions',
        rawValue: totalConversions
      },
      { 
        label: 'Avg. target CPA', 
        value: avgCpa > 0 ? `${symbol}${avgCpa.toFixed(2)}` : '—', 
        bgColor: 'bg-google-green', 
        textColor: 'text-white',
        key: 'cpa',
        rawValue: avgCpa
      },
    ];
  }, [ads, settings.currencySymbol]);*/

  const handleMetricUpdate = async (index: number, newValue: string | number) => {
    if (loading || !ads.length) {
      toast({
        title: "Error",
        description: "Cannot update metrics while loading or no ads available",
        variant: "destructive",
      });
      return;
    }

    try {
      const metric = metrics[index];
      const numericValue = typeof newValue === 'string' ? 
        parseFloat(newValue.replace(new RegExp(`[${symbol},KM]`, 'g'), '')) : newValue;

      if (isNaN(numericValue)) {
        throw new Error('Invalid numeric value');
      }

      // Update all ads proportionally based on the new total
      const oldTotal = metric.rawValue;
      const newTotal = numericValue;
      
      if (oldTotal === 0) {
        toast({
          title: "Error",
          description: "Cannot update metric when current total is 0",
          variant: "destructive",
        });
        return;
      }

      const updatePromises = ads.map(async (ad) => {
        const currentValue = metric.key === 'impressions' ? ad.impressions :
                           metric.key === 'revenue' ? Number(ad.revenue) :
                           metric.key === 'conversions' ? ad.clicks * 0.02 :
                           metric.key === 'cpa' ? ad.clicks : 0;

        const proportion = currentValue / oldTotal;
        const newAdValue = Math.round(newTotal * proportion);

        const updates: any = {};
        if (metric.key === 'impressions') {
          updates.impressions = newAdValue;
        } else if (metric.key === 'revenue') {
          updates.revenue = newAdValue;
        }

        return updateAd(ad.id, updates);
      });

      await Promise.all(updatePromises);
      
      toast({
        title: "Success",
        description: "Metrics updated successfully across all campaigns!",
      });
    } catch (error) {
      console.error('Error updating metrics:', error);
      toast({
        title: "Error",
        description: "Failed to update metrics",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mb-6">
      <div className="flex overflow-hidden">
        {metrics.map((metric, index) => (
          <div key={index} className={`flex-1 ${metric.bgColor}`}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm ${metric.textColor}`}>{metric.label}</span>
              </div>
              <div className={`text-2xl font-normal ${metric.textColor}`}>
                <InlineEdit
                  value={metric.value}
                  onSave={(newValue) => handleMetricUpdate(index, newValue)}
                  type="text"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-sm text-muted-foreground mt-2">
        {getDateRangeText()}
      </div>
    </div>
  );
};

export default MetricsGrid;
