import { useState } from "react";
import { X, AlertCircle, TrendingUp, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface NotificationsPanelProps {
  open: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
}

const notifications = [
  {
    id: 1,
    type: "alert",
    title: "FDA Guidance Update",
    description: "New guidance on CAR-T cell therapy clinical trials published",
    time: "5 min ago",
    unread: true,
    agent: "Regulatory",
  },
  {
    id: 2,
    type: "insight",
    title: "Research Trend Detected",
    description: "15% increase in mRNA vaccine publications this month",
    time: "1 hour ago",
    unread: true,
    agent: "Research",
  },
  {
    id: 3,
    type: "trial",
    title: "Trial Status Change",
    description: "NCT04512345 moved to Phase III recruitment",
    time: "3 hours ago",
    unread: true,
    agent: "Clinical",
  },
  {
    id: 4,
    type: "system",
    title: "Weekly Report Ready",
    description: "Your pipeline intelligence report is ready for review",
    time: "Yesterday",
    unread: false,
    agent: "Orchestrator",
  },
  {
    id: 5,
    type: "alert",
    title: "GMP Compliance Reminder",
    description: "Quarterly compliance review due in 7 days",
    time: "2 days ago",
    unread: false,
    agent: "Regulatory",
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "alert":
      return <AlertCircle className="h-4 w-4 text-rose-400" />;
    case "insight":
      return <TrendingUp className="h-4 w-4 text-primary" />;
    case "trial":
      return <FileText className="h-4 w-4 text-amber-400" />;
    default:
      return <Clock className="h-4 w-4 text-purple-400" />;
  }
};

const getAgentBadgeClass = (agent: string) => {
  switch (agent) {
    case "Research":
      return "agent-badge-research";
    case "Clinical":
      return "agent-badge-clinical";
    case "Regulatory":
      return "agent-badge-regulatory";
    default:
      return "agent-badge-orchestrator";
  }
};

export default function NotificationsPanel({ open, onClose, onMarkAllRead }: NotificationsPanelProps) {
  const [notificationList, setNotificationList] = useState(notifications);
  
  const unreadCount = notificationList.filter(n => n.unread).length;

  const handleMarkAllRead = () => {
    setNotificationList(prev => prev.map(n => ({ ...n, unread: false })));
    onMarkAllRead();
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full border-l border-border/50 bg-card/95 backdrop-blur-xl sm:max-w-md">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-lg">Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                {unreadCount} new
              </Badge>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="space-y-3 pr-4">
            {notificationList.map((notification) => (
              <div
                key={notification.id}
                className={`group relative rounded-lg border p-4 transition-colors ${
                  notification.unread
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/50 bg-background/50"
                }`}
              >
                {notification.unread && (
                  <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-primary" />
                )}
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-tight">
                        {notification.title}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {notification.description}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getAgentBadgeClass(notification.agent)}`}
                      >
                        {notification.agent}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 border-t border-border/50 bg-card/95 p-4">
          <Button variant="outline" className="w-full" onClick={handleMarkAllRead}>
            Mark all as read
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
