import { useState, useCallback, useEffect, createContext, useContext, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  type: "alert" | "insight" | "trial" | "system";
  title: string;
  description: string;
  time: string;
  unread: boolean;
  agent: "Research" | "Clinical" | "Regulatory" | "Orchestrator";
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "time" | "unread">) => void;
  markAllRead: () => void;
  markAsRead: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "FDA Guidance Update",
    description: "New guidance on CAR-T cell therapy clinical trials published",
    time: "5 min ago",
    unread: true,
    agent: "Regulatory",
  },
  {
    id: "2",
    type: "insight",
    title: "Research Trend Detected",
    description: "15% increase in mRNA vaccine publications this month",
    time: "1 hour ago",
    unread: true,
    agent: "Research",
  },
  {
    id: "3",
    type: "trial",
    title: "Trial Status Change",
    description: "NCT04512345 moved to Phase III recruitment",
    time: "3 hours ago",
    unread: true,
    agent: "Clinical",
  },
];

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const { toast } = useToast();

  const unreadCount = notifications.filter((n) => n.unread).length;

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "time" | "unread">) => {
      const newNotification: Notification = {
        ...notification,
        id: crypto.randomUUID(),
        time: "Just now",
        unread: true,
      };

      setNotifications((prev) => [newNotification, ...prev]);

      // Show toast for real-time push notification
      toast({
        title: `🔔 ${notification.title}`,
        description: notification.description,
      });
    },
    [toast]
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  }, []);

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, addNotification, markAllRead, markAsRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
}
