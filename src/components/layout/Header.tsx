import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Settings, User, Globe, ChevronDown, Menu, X } from "lucide-react";
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
import NotificationsPanel from "./NotificationsPanel";
import SettingsModal from "./SettingsModal";

const navLinks = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/research", label: "Research" },
  { path: "/trials", label: "Trials" },
  { path: "/regulatory", label: "Regulatory" },
  { path: "/insights", label: "Insights" },
];

export default function Header() {
  const location = useLocation();
  const { toast } = useToast();
  const { profile } = useProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  // Get display name from profile
  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : profile?.first_name || profile?.email || "User";
  const role = profile?.role || "User";

  const handleMarkAllRead = () => {
    setUnreadCount(0);
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
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
                <div className="h-5 w-5 rounded-full bg-primary" />
              </div>
              <span className="font-display text-xl font-bold">
                Pharma<span className="text-primary">Lens</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              {/* Google Translate Widget */}
              <div id="google_translate_element" className="hidden sm:block"></div>

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
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="h-5 w-5" />
              </Button>

              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="hidden text-sm font-medium sm:inline">{displayName}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{displayName}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {role}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Preferences
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="border-t border-border/50 py-4 md:hidden">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      <NotificationsPanel 
        open={notificationsOpen} 
        onClose={() => setNotificationsOpen(false)} 
        onMarkAllRead={handleMarkAllRead}
      />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
