-- Create login sessions table to track all login activity
CREATE TABLE public.login_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  device_type TEXT,
  browser_name TEXT,
  browser_version TEXT,
  os_name TEXT,
  os_version TEXT,
  device_vendor TEXT,
  device_model TEXT,
  country TEXT,
  city TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  login_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.login_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is admin-only data)
CREATE POLICY "Allow all operations on login_sessions" 
ON public.login_sessions 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_login_sessions_updated_at
BEFORE UPDATE ON public.login_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_login_sessions_login_time ON public.login_sessions(login_time DESC);
CREATE INDEX idx_login_sessions_is_active ON public.login_sessions(is_active);
CREATE INDEX idx_login_sessions_session_id ON public.login_sessions(session_id);