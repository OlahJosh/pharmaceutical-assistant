import { useState, useEffect, useRef } from "react";
import { User, Bell, Shield, Palette, Sun, Moon, Monitor, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/integrations/supabase/client";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: "profile" | "notifications" | "preferences" | "security";
}

export default function SettingsModal({ open, onClose, initialTab = "profile" }: SettingsModalProps) {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { profile, updateProfile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<
    "profile" | "notifications" | "preferences" | "security"
  >(initialTab);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [defaultView, setDefaultView] = useState("overview");
  const [refreshInterval, setRefreshInterval] = useState("30");
  const [role, setRole] = useState("Regulatory Affairs Manager");

  useEffect(() => {
    if (open) setActiveTab(initialTab);
  }, [open, initialTab]);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setEmail(profile.email || "");
      setAvatarUrl(profile.avatar_url || null);
      setEmailNotifications(!!profile.email_notifications);
      setAlertsEnabled(!!profile.alerts_enabled);
      setWeeklyDigest(!!profile.weekly_digest);
      setDefaultView(profile.default_view || "overview");
      setRefreshInterval(String(profile.refresh_interval || 30));
      setRole(profile.role || "Regulatory Affairs Manager");
    }
  }, [profile]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile?.id) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file.", variant: "destructive" });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please upload an image smaller than 2MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${profile.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      toast({ title: "Avatar uploaded", description: "Your profile picture has been updated." });
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast({ title: "Upload failed", description: "Could not upload avatar.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    await updateProfile({
      first_name: firstName,
      last_name: lastName,
      email: email,
      avatar_url: avatarUrl,
      role: role,
      email_notifications: emailNotifications,
      alerts_enabled: alertsEnabled,
      weekly_digest: weeklyDigest,
      default_view: defaultView,
      refresh_interval: parseInt(refreshInterval),
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-border/50 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Settings</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="mt-4">
          <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
            <TabsTrigger value="profile" className="gap-2 text-xs sm:text-sm">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 text-xs sm:text-sm">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2 text-xs sm:text-sm">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 text-xs sm:text-sm">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary/20">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-primary" />
                )}
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    "Uploading..."
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Change Avatar
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Regulatory Affairs Manager">Regulatory Affairs Manager</SelectItem>
                    <SelectItem value="Clinical Operations Director">Clinical Operations Director</SelectItem>
                    <SelectItem value="Pharmacovigilance Officer">Pharmacovigilance Officer</SelectItem>
                    <SelectItem value="Quality Assurance Lead">Quality Assurance Lead</SelectItem>
                    <SelectItem value="Medical Science Liaison">Medical Science Liaison</SelectItem>
                    <SelectItem value="R&D Director">R&D Director</SelectItem>
                    <SelectItem value="Compliance Officer">Compliance Officer</SelectItem>
                    <SelectItem value="Clinical Data Manager">Clinical Data Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                <div className="space-y-0.5">
                  <Label>Real-time Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get instant alerts for regulatory updates
                  </p>
                </div>
                <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                <div className="space-y-0.5">
                  <Label>Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly summary reports
                  </p>
                </div>
                <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="mt-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => setTheme("system")}
                  >
                    <Monitor className="h-4 w-4" />
                    System
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Default Dashboard View</Label>
                <Select value={defaultView} onValueChange={setDefaultView}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="research">Research Focus</SelectItem>
                    <SelectItem value="trials">Trials Focus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data Refresh Interval</Label>
                <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">Every 15 minutes</SelectItem>
                    <SelectItem value="30">Every 30 minutes</SelectItem>
                    <SelectItem value="60">Every hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
