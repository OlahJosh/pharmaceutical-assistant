import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface AgentCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  agentType: "orchestrator" | "research" | "clinical" | "regulatory";
  stats?: { label: string; value: string }[];
  status?: "active" | "processing" | "idle";
  className?: string;
}

const agentColors = {
  orchestrator: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    badge: "agent-badge-orchestrator",
    glow: "shadow-purple-500/10",
  },
  research: {
    bg: "bg-primary/10",
    border: "border-primary/30",
    text: "text-primary",
    badge: "agent-badge-research",
    glow: "shadow-primary/10",
  },
  clinical: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    badge: "agent-badge-clinical",
    glow: "shadow-amber-500/10",
  },
  regulatory: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-400",
    badge: "agent-badge-regulatory",
    glow: "shadow-rose-500/10",
  },
};

const statusColors = {
  active: "bg-emerald-500",
  processing: "bg-amber-500 animate-pulse",
  idle: "bg-muted-foreground",
};

export default function AgentCard({
  title,
  description,
  icon,
  agentType,
  stats,
  status = "active",
  className = "",
}: AgentCardProps) {
  const colors = agentColors[agentType];

  return (
    <div
      className={`glass-card group relative overflow-hidden p-6 transition-all duration-300 hover:border-border hover-lift hover-glow ${className}`}
    >
      {/* Subtle glow effect */}
      <div
        className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${colors.bg}`}
      />

      <div className="relative">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg} ${colors.border} border transition-transform duration-300 group-hover:scale-110`}
          >
            <span className={colors.text}>{icon}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${statusColors[status]}`} />
            <span className="text-xs capitalize text-muted-foreground">{status}</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-1">
                <p className={`text-xl font-bold ${colors.text}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Agent Badge */}
        <div className="mt-4">
          <Badge variant="outline" className={`text-xs ${colors.badge}`}>
            {title} Agent
          </Badge>
        </div>
      </div>
    </div>
  );
}
