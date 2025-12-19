import { useState } from "react";
import { MessageSquare, Plus, Trash2, ChevronLeft, ChevronRight, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/hooks/use-chat";

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onClearHistory: () => void;
}

export function ChatSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onClearHistory,
}: ChatSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Group conversations by date
  const groupedConversations = conversations.reduce((groups, conv) => {
    const dateKey = formatDate(conv.updated_at);
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(conv);
    return groups;
  }, {} as Record<string, Conversation[]>);

  if (isCollapsed) {
    return (
      <div className="flex h-full w-12 flex-col border-r border-border/50 bg-secondary/20">
        <TooltipProvider>
          <div className="flex flex-col gap-2 p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCollapsed(false)}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onNewChat}
                  className="h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">New chat</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <History className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{conversations.length} conversations</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-border/50 bg-secondary/20 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 p-3">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Chat History</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(true)}
          className="h-7 w-7"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 px-2">
        {Object.entries(groupedConversations).map(([date, convs]) => (
          <div key={date} className="mb-4">
            <div className="mb-2 px-2 text-xs font-medium text-muted-foreground">{date}</div>
            <div className="space-y-1">
              {convs.map((conv) => (
                <div
                  key={conv.id}
                  className={cn(
                    "group flex items-center gap-2 rounded-lg p-2 text-sm transition-colors cursor-pointer",
                    currentConversationId === conv.id
                      ? "bg-primary/20 text-foreground"
                      : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => onSelectConversation(conv.id)}
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">{conv.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <MessageSquare className="mb-2 h-8 w-8 opacity-50" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs">Start a new chat to begin</p>
          </div>
        )}
      </ScrollArea>

      {/* Clear History Button */}
      {conversations.length > 0 && (
        <div className="border-t border-border/50 p-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                Clear all history
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all chat history?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your conversations. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onClearHistory}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Clear all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
