-- Add conversions and cost_per_conversion columns to ads table
ALTER TABLE public.ads 
ADD COLUMN conversions integer NOT NULL DEFAULT 0,
ADD COLUMN cost_per_conversion numeric NOT NULL DEFAULT 0;