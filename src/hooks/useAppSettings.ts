import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AppSettings {
  contactEmail: string;
  currency: string;
  currencySymbol: string;
}

const currencySymbols: Record<string, string> = {
  INR: '₹',
  PKR: '₨',
  BDT: '৳',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>({
    contactEmail: 'adsexpertteam34@gmail.com',
    currency: 'INR',
    currencySymbol: '₹',
  });
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings' as any)
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data && typeof data === 'object') {
        const settingsData = data as any;
        setSettings({
          contactEmail: settingsData.contact_email || 'adsexpertteam34@gmail.com',
          currency: settingsData.currency || 'INR',
          currencySymbol: currencySymbols[settingsData.currency] || '₹',
        });
        return;
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      // If no backend settings, fallback to localStorage
      try {
        const saved = localStorage.getItem('app_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSettings({
            contactEmail: parsed.contact_email || 'adsexpertteam34@gmail.com',
            currency: parsed.currency || 'INR',
            currencySymbol: currencySymbols[parsed.currency] || '₹',
          });
        }
      } catch {}
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();

    // Listen for settings updates
    const handleSettingsUpdate = (event: CustomEvent) => {
      setSettings({
        contactEmail: event.detail.email,
        currency: event.detail.currency,
        currencySymbol: currencySymbols[event.detail.currency] || '₹',
      });
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener);

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, []);

  return { settings, loading, refresh: loadSettings };
};
