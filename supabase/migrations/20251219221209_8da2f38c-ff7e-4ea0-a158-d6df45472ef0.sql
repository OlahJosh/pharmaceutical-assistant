-- Create compliance_items table for storing checklist items
CREATE TABLE public.compliance_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    item TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'complete')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.compliance_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (MVP demo - no auth)
CREATE POLICY "Anyone can read compliance items" 
ON public.compliance_items 
FOR SELECT 
USING (true);

-- Create policy to allow public write access (MVP demo - no auth)
CREATE POLICY "Anyone can insert compliance items" 
ON public.compliance_items 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow public update access (MVP demo - no auth)
CREATE POLICY "Anyone can update compliance items" 
ON public.compliance_items 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_compliance_items_updated_at
BEFORE UPDATE ON public.compliance_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default compliance items
INSERT INTO public.compliance_items (item, status) VALUES
('GMP facility certification current', 'complete'),
('Annual product quality review submitted', 'complete'),
('Deviation reports up to date', 'pending'),
('Training records verified', 'complete'),
('Supplier qualification audits scheduled', 'pending'),
('Change control procedures reviewed', 'complete'),
('Stability testing protocols current', 'complete'),
('Adverse event reporting compliant', 'complete');