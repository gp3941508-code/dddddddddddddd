-- Create the ads table for the admin panel
CREATE TABLE public.ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'paused' CHECK (status IN ('active', 'paused', 'ended')),
  budget_amount NUMERIC NOT NULL DEFAULT 0,
  budget_period TEXT NOT NULL DEFAULT 'daily',
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  ctr NUMERIC NOT NULL DEFAULT 0,
  revenue NUMERIC NOT NULL DEFAULT 0,
  assigned_user_id TEXT,
  assigned_user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (this allows public access for now)
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (since this is an admin panel)
CREATE POLICY "Allow all operations on ads" 
ON public.ads 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ads_updated_at
BEFORE UPDATE ON public.ads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO public.ads (name, status, budget_amount, budget_period, impressions, clicks, ctr, revenue, assigned_user_name) VALUES
('Campaign 1', 'active', 1000, 'daily', 15420, 245, 1.59, 2450, 'John Doe'),
('Campaign 2', 'paused', 500, 'daily', 8970, 134, 1.49, 1340, 'Jane Smith'),
('Campaign 3', 'active', 2000, 'weekly', 25600, 512, 2.00, 5120, 'Mike Johnson');