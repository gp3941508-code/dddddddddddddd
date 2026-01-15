-- Create ads table
CREATE TABLE public.ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended')),
  budget_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  budget_period TEXT NOT NULL DEFAULT 'daily',
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  ctr NUMERIC(5,2) NOT NULL DEFAULT 0,
  revenue NUMERIC(10,2) NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  cost_per_conversion NUMERIC(10,2) NOT NULL DEFAULT 0,
  assigned_user_id UUID,
  assigned_user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- Create policies for ads (allowing public access for this demo)
CREATE POLICY "Allow all operations on ads" ON public.ads FOR ALL USING (true) WITH CHECK (true);

-- Create billing_data table
CREATE TABLE public.billing_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  available_funds NUMERIC(12,2) NOT NULL DEFAULT 0,
  last_payment_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  last_payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.billing_data ENABLE ROW LEVEL SECURITY;

-- Create policies for billing_data
CREATE POLICY "Allow all operations on billing_data" ON public.billing_data FOR ALL USING (true) WITH CHECK (true);

-- Create monthly_billing table
CREATE TABLE public.monthly_billing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2020),
  net_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  payments NUMERIC(12,2) NOT NULL DEFAULT 0,
  funds_from_previous NUMERIC(12,2) NOT NULL DEFAULT 0,
  campaigns NUMERIC(12,2) NOT NULL DEFAULT 0,
  adjustments NUMERIC(12,2) NOT NULL DEFAULT 0,
  taxes_and_fees NUMERIC(12,2) NOT NULL DEFAULT 0,
  ending_balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(month, year)
);

-- Enable Row Level Security
ALTER TABLE public.monthly_billing ENABLE ROW LEVEL SECURITY;

-- Create policies for monthly_billing
CREATE POLICY "Allow all operations on monthly_billing" ON public.monthly_billing FOR ALL USING (true) WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_ads_updated_at
  BEFORE UPDATE ON public.ads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_billing_data_updated_at
  BEFORE UPDATE ON public.billing_data
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_monthly_billing_updated_at
  BEFORE UPDATE ON public.monthly_billing
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data
INSERT INTO public.billing_data (available_funds, last_payment_amount, last_payment_date) VALUES (5000.00, 1500.00, now() - interval '7 days');

INSERT INTO public.ads (name, status, budget_amount, budget_period, impressions, clicks, ctr, revenue, conversions, cost_per_conversion) VALUES
('Summer Campaign', 'active', 500.00, 'daily', 12500, 850, 6.80, 2250.00, 45, 50.00),
('Winter Sale', 'paused', 300.00, 'daily', 8200, 420, 5.12, 1680.00, 28, 60.00),
('Spring Launch', 'active', 750.00, 'daily', 15600, 1240, 7.95, 3720.00, 62, 60.00);

INSERT INTO public.monthly_billing (month, year, net_cost, payments, funds_from_previous, campaigns, adjustments, taxes_and_fees, ending_balance) VALUES
(1, 2024, 2500.00, 3000.00, 1000.00, 2200.00, -100.00, 400.00, 500.00),
(2, 2024, 2800.00, 2500.00, 500.00, 2600.00, 0.00, 200.00, 200.00),
(3, 2024, 3200.00, 4000.00, 200.00, 3000.00, 150.00, 350.00, 1000.00);