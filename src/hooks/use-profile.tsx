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
  avatar_url: string | null;
}

type ProfileUpdatedEvent = CustomEvent<Partial<Profile> & { id?: string }>;

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = useCallback(async () => {
    try {
      // Check if in demo mode
      const isDemoMode = localStorage.getItem("demo_mode") === "true";
      const demoRole = localStorage.getItem("demo_role");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      
      // If in demo mode, override role with demo role
      if (isDemoMode && demoRole && data) {
        setProfile({ ...data, role: demoRole });
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<Profile>) => {
      if (!profile?.id) return;

      try {
        const { error } = await supabase
          .from("profiles")
          .update(updates)
          .eq("id", profile.id);

        if (error) throw error;

        const next = { ...profile, ...updates };
        setProfile(next);

        // Notify other hook instances (e.g., Header vs SettingsModal) to update immediately.
        window.dispatchEvent(
          new CustomEvent("profile:updated", { detail: { id: profile.id, ...updates } })
        );

        toast({
          title: "Settings Saved",
          description: "Your preferences have been updated.",
        });
      } catch (error) {
        console.error("Error updating profile:", error);
        toast({
          title: "Error",
          description: "Failed to save settings.",
          variant: "destructive",
        });
      }
    },
    [profile, toast]
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    const handler = (event: Event) => {
      const e = event as ProfileUpdatedEvent;
      const updates = e.detail ?? {};

      setProfile((prev) => {
        if (!prev) return prev;
        if (updates.id && updates.id !== prev.id) return prev;
        return { ...prev, ...updates };
      });
    };

    window.addEventListener("profile:updated", handler);
    return () => window.removeEventListener("profile:updated", handler);
  }, []);

  return { profile, isLoading, updateProfile, refetch: fetchProfile };
}
