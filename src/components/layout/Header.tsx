import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Settings, User, ChevronDown, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/use-profile";
import { useNotifications } from "@/hooks/use-notifications";
import NotificationsPanel from "./NotificationsPanel";
import SettingsModal from "./SettingsModal";
import LanguageSelector from "./LanguageSelector";

const navLinks = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/research", label: "Research" },
  { path: "/trials", label: "Trials" },
  { path: "/regulatory", label: "Regulatory" },
  { path: "/insights", label: "Insights" },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useProfile();
  const { unreadCount, markAllRead } = useNotifications();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<
    "profile" | "notifications" | "preferences" | "security"
  >("profile");

  // Check for demo mode name
  const isDemoMode = localStorage.getItem("demo_mode") === "true";
  const demoRole = localStorage.getItem("demo_role");

  // Get display name - use "Demo User" for demo mode, or profile name
  const displayName = isDemoMode 
    ? "Demo User"
    : profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.first_name || profile?.email || "User";
  
  const role = isDemoMode && demoRole ? demoRole : (profile?.role || "User");

  const openSettings = (tab: "profile" | "notifications" | "preferences" | "security") => {
    setSettingsTab(tab);
    setSettingsOpen(true);
  };

  const handleSignOut = () => {
    // Clear demo mode
    localStorage.removeItem("demo_mode");
    localStorage.removeItem("demo_role");
    
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    
    navigate("/auth");
  };

  const handleMarkAllRead = () => {
    markAllRead();
    toast({
      title: "Notifications cleared",
      description: "All notifications marked as read",
    });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Hamburger Menu - Always visible */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-background">
                  <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {navLinks.map((link) => (
                    <DropdownMenuItem key={link.path} asChild>
                      <Link
                        to={link.path}
                        className={`w-full ${
                          location.pathname === link.path
                            ? "text-primary font-medium"
                            : ""
                        }`}
                      >
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
                  <div className="h-5 w-5 rounded-full bg-primary" />
                </div>
                <span className="font-display text-xl font-bold">
                  Pharma<span className="text-primary">Lens</span>
                </span>
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <LanguageSelector />

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setNotificationsOpen(true)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>

              {/* Settings */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openSettings("profile")}
              >
                <Settings className="h-5 w-5" />
              </Button>

              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary/20">
                      {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <span className="hidden text-sm font-medium sm:inline">{displayName}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{displayName}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {role}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => openSettings("profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openSettings("preferences")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Preferences
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <NotificationsPanel
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onMarkAllRead={handleMarkAllRead}
      />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        initialTab={settingsTab}
      />
    </>
  );
}
