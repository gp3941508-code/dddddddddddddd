-- Create ads table for storing campaign advertisements
CREATE TABLE public.ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended')),
  budget_amount DECIMAL(10,2) NOT NULL,
  budget_period TEXT NOT NULL DEFAULT 'day' CHECK (budget_period IN ('day', 'week', 'month')),
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  ctr DECIMAL(5,2) NOT NULL DEFAULT 0,
  revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  assigned_user_id UUID REFERENCES auth.users(id),
  assigned_user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is admin functionality)
CREATE POLICY "Anyone can view ads" 
ON public.ads 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create ads" 
ON public.ads 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update ads" 
ON public.ads 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete ads" 
ON public.ads 
FOR DELETE 
USING (true);

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

-- Enable realtime for the ads table
ALTER TABLE public.ads REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.ads;