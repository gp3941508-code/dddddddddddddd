-- Create banned_ips table for IP address blocking
CREATE TABLE public.banned_ips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL UNIQUE,
  banned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  banned_by TEXT DEFAULT 'admin',
  reason TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.banned_ips ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is admin functionality)
CREATE POLICY "Allow all operations on banned_ips" 
ON public.banned_ips 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create index for faster IP lookups
CREATE INDEX idx_banned_ips_ip_address ON public.banned_ips(ip_address);
CREATE INDEX idx_banned_ips_active ON public.banned_ips(ip_address, is_active);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_banned_ips_updated_at
BEFORE UPDATE ON public.banned_ips
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for banned_ips table
ALTER TABLE public.banned_ips REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.banned_ips;