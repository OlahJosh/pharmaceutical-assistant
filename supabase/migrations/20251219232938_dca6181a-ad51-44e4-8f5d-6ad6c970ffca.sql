-- Create profiles table to persist user settings
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  first_name TEXT DEFAULT '',
  last_name TEXT DEFAULT '',
  email TEXT DEFAULT '',
  role TEXT DEFAULT 'User',
  email_notifications BOOLEAN DEFAULT true,
  alerts_enabled BOOLEAN DEFAULT true,
  weekly_digest BOOLEAN DEFAULT true,
  default_view TEXT DEFAULT 'overview',
  refresh_interval INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read and write profiles (no auth in this app)
CREATE POLICY "Anyone can read profiles"
ON public.profiles
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert profiles"
ON public.profiles
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update profiles"
ON public.profiles
FOR UPDATE
USING (true);

-- Create trigger for updating timestamps
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert a default profile
INSERT INTO public.profiles (first_name, last_name, email, role)
VALUES ('Sarah', 'Chen', 's.chen@pharmalens.io', 'Research Director');