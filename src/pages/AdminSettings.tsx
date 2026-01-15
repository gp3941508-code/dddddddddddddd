import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sidebar, Header } from '@/components/google-ads';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Mail, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AdminSettings = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('adsexpertteam34@gmail.com');
  const [currency, setCurrency] = useState('INR');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings' as any)
        .select('*')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data && typeof data === 'object') {
        const settingsData = data as any;
        setEmail(settingsData.contact_email || 'adsexpertteam34@gmail.com');
        setCurrency(settingsData.currency || 'INR');
        return;
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }

    // Fallback: load from localStorage if backend table is unavailable
    try {
      const saved = localStorage.getItem('app_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.contact_email) setEmail(parsed.contact_email);
        if (parsed?.currency) setCurrency(parsed.currency);
      }
    } catch (e) {
      console.warn('No local settings found');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('app_settings' as any)
        .upsert({
          id: 1,
          contact_email: email,
          currency: currency,
          updated_at: new Date().toISOString()
        } as any);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving settings (falling back to localStorage):', error);
      try {
        localStorage.setItem('app_settings', JSON.stringify({ contact_email: email, currency }));
        toast({
          title: 'Settings saved',
          description: 'Saved locally on this device (backend not available).',
        });
      } catch (storageError) {
        console.error('Local save failed:', storageError);
        toast({
          title: "Error",
          description: "Failed to save settings. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      // Dispatch custom event to notify other components regardless of backend/local save
      window.dispatchEvent(new CustomEvent('settingsUpdated', {
        detail: { email, currency }
      }));
      setLoading(false);
    }
  };

  const currencies = [
    { value: 'INR', label: 'Indian Rupee (₹)', symbol: '₹' },
    { value: 'PKR', label: 'Pakistani Rupee (₨)', symbol: '₨' },
    { value: 'BDT', label: 'Bangladeshi Taka (৳)', symbol: '৳' },
    { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
    { value: 'EUR', label: 'Euro (€)', symbol: '€' },
    { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
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
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg flex items-center gap-2">
                <Settings className="w-8 h-8" />
                Application Settings
              </h1>
              <p className="text-white/80">Configure global settings for your application</p>
            </div>

            {/* Email Settings */}
            <Card className="mb-6 backdrop-blur-sm bg-white/90 border-0 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      This email will be displayed in the header throughout the application
                    </p>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter contact email"
                      className="max-w-md"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Currency Settings */}
            <Card className="mb-6 backdrop-blur-sm bg-white/90 border-0 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Currency Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currency">Default Currency</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Select the currency to be used throughout the application for all monetary values
                    </p>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="max-w-md">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((curr) => (
                          <SelectItem key={curr.value} value={curr.value}>
                            {curr.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium mb-2">Preview</h4>
                    <p className="text-sm text-muted-foreground">
                      Example amount: {currencies.find(c => c.value === currency)?.symbol}12,560
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={loading} size="lg">
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
