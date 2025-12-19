import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  email_notifications: boolean;
  alerts_enabled: boolean;
  weekly_digest: boolean;
  default_view: string;
  refresh_interval: number;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!profile?.id) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);

      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast({ title: "Settings Saved", description: "Your preferences have been updated." });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    }
  }, [profile?.id, toast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, isLoading, updateProfile, refetch: fetchProfile };
}
