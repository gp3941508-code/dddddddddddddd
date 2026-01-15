-- Create billing_data table for permanent storage
CREATE TABLE public.billing_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  available_funds NUMERIC NOT NULL DEFAULT 0,
  last_payment_amount NUMERIC DEFAULT 0,
  last_payment_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create monthly_billing table for monthly data
CREATE TABLE public.monthly_billing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  billing_data_id UUID REFERENCES public.billing_data(id) ON DELETE CASCADE,
  month_name TEXT NOT NULL,
  year INTEGER NOT NULL,
  net_cost NUMERIC NOT NULL DEFAULT 0,
  payments NUMERIC NOT NULL DEFAULT 0,
  funds_from_previous NUMERIC NOT NULL DEFAULT 0,
  campaigns NUMERIC NOT NULL DEFAULT 0,
  adjustments NUMERIC NOT NULL DEFAULT 0,
  taxes_and_fees NUMERIC NOT NULL DEFAULT 0,
  ending_balance NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.billing_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_billing ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (admin panel)
CREATE POLICY "Allow all operations on billing_data" 
ON public.billing_data 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on monthly_billing" 
ON public.monthly_billing 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_billing_data_updated_at
BEFORE UPDATE ON public.billing_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_monthly_billing_updated_at
BEFORE UPDATE ON public.monthly_billing
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial billing data
INSERT INTO public.billing_data (available_funds, last_payment_amount, last_payment_date) 
VALUES (0, 0, NULL);

-- Get the inserted billing_data_id for monthly records
DO $$ 
DECLARE 
    billing_id UUID;
BEGIN
    SELECT id INTO billing_id FROM public.billing_data LIMIT 1;
    
    -- Insert sample monthly billing data
    INSERT INTO public.monthly_billing (billing_data_id, month_name, year, net_cost, payments, funds_from_previous, campaigns, adjustments, taxes_and_fees, ending_balance) VALUES
    (billing_id, 'July', 2025, 0, 0, 0, 0, 0, 0, 0),
    (billing_id, 'June', 2025, 0, 0, 0, 0, 0, 0, 0),
    (billing_id, 'May', 2025, 0, 0, 0, 0, 0, 0, 0),
    (billing_id, 'April', 2025, 0, 0, 0, 0, 0, 0, 0),
    (billing_id, 'March', 2025, 0, 0, 0, 0, 0, 0, 0),
    (billing_id, 'February', 2025, 0, 0, 0, 0, 0, 0, 0),
    (billing_id, 'January', 2025, 0, 0, 0, 0, 0, 0, 0);
END $$;