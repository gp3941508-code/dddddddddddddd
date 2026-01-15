import { useState, useEffect } from 'react';

interface MetricsData {
  dateRange: string;
  impressions: number;
  cost: number;
  conversions: number;
  cpa: number;
}

export const useCampaignMetrics = () => {
  const [metrics, setMetrics] = useState<MetricsData[]>([
    { dateRange: 'Today', impressions: 472000, cost: 64810, conversions: 401.52, cpa: 161.41 },
    { dateRange: 'Last 7 days', impressions: 3304000, cost: 453670, conversions: 2810.64, cpa: 161.41 },
    { dateRange: 'Last 30 days', impressions: 14160000, cost: 1944300, conversions: 12045.68, cpa: 161.41 },
    { dateRange: 'All time', impressions: 28320000, cost: 3888600, conversions: 24091.36, cpa: 161.41 }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
    
    const handleSettingsUpdate = () => {
      loadMetrics();
    };
    
    window.addEventListener('metricsUpdated', handleSettingsUpdate);
    
    return () => {
      window.removeEventListener('metricsUpdated', handleSettingsUpdate);
    };
  }, []);

  const loadMetrics = () => {
    const stored = localStorage.getItem('campaign_metrics');
    if (stored) {
      setMetrics(JSON.parse(stored));
    }
    setLoading(false);
  };

  const getMetricsByDateRange = (dateRange: string) => {
    return metrics.find(m => m.dateRange.toLowerCase() === dateRange.toLowerCase());
  };

  return { metrics, loading, getMetricsByDateRange, refresh: loadMetrics };
};
