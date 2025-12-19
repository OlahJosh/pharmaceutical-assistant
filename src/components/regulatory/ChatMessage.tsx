import { Shield, User, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message, Attachment } from "@/hooks/use-chat";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  // Simple markdown-like formatting
  const formatContent = (content: string) => {
    // Bold
    let formatted = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Headers
    formatted = formatted.replace(/^### (.+)$/gm, '<h4 class="font-semibold mt-3 mb-1">$1</h4>');
    formatted = formatted.replace(/^## (.+)$/gm, '<h3 class="font-semibold text-lg mt-4 mb-2">$1</h3>');
    // Lists
    formatted = formatted.replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>');
    formatted = formatted.replace(/^\d+\. (.+)$/gm, '<li class="ml-4">$1</li>');
    // Line breaks
    formatted = formatted.replace(/\n/g, '<br />');
    
    return formatted;
  };

  return (
    <div
      className={cn(
        "flex animate-fadeInUp",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl p-4",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-secondary rounded-bl-md"
        )}
      >
        {!isUser && (
          <div className="mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-rose-400" />
            <span className="text-xs font-medium text-rose-400">
              Regulatory Agent
            </span>
          </div>
        )}
        
        {isUser && (
          <div className="mb-2 flex items-center gap-2 justify-end">
            <span className="text-xs font-medium opacity-80">You</span>
            <User className="h-4 w-4 opacity-80" />
          </div>
        )}

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {message.attachments.map((attachment, idx) => (
              <div key={idx} className="relative">
                {attachment.type === "image" ? (
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="max-h-48 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex items-center gap-2 rounded-lg bg-background/20 px-3 py-2">
                    <FileImage className="h-4 w-4" />
                    <span className="text-xs">{attachment.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div
          className="text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
        />
      </div>
    </div>
  );
}
