import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Ad {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'ended';
  budget_amount: number;
  budget_period: string;
  impressions: number;
  clicks: number;
  ctr: number;
  revenue: number;
  conversions: number;
  cost_per_conversion: number;
  assigned_user_id?: string;
  assigned_user_name?: string;
  created_at: string;
  updated_at: string;
}

export const useAds = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch ads from database
  const fetchAds = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds((data || []) as Ad[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching ads');
    } finally {
      setLoading(false);
    }
  };

  // Create new ad
  const createAd = async (adData: Omit<Ad, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .insert([adData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating ad');
      throw err;
    }
  };

  // Update ad
  const updateAd = async (id: string, updates: Partial<Ad>) => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating ad');
      throw err;
    }
  };

  // Delete ad
  const deleteAd = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting ad');
      throw err;
    }
  };

  // Toggle ad status
  const toggleAdStatus = async (id: string) => {
    const ad = ads.find(a => a.id === id);
    if (!ad) return;

    const newStatus = ad.status === 'active' ? 'paused' : 'active';
    return updateAd(id, { status: newStatus });
  };

  // Setup real-time subscription
  useEffect(() => {
    fetchAds();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('ads-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ads'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          // Refresh ads on any change
          fetchAds();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    ads,
    loading,
    error,
    createAd,
    updateAd,
    deleteAd,
    toggleAdStatus,
    refreshAds: fetchAds
  };
};