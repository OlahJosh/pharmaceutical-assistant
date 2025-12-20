import { AlertCircle, TrendingUp, FileText, Zap, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Insight {
  id: string;
  type: "alert" | "trend" | "update" | "action";
  title: string;
  description: string;
  agent: "Research" | "Clinical" | "Regulatory" | "Orchestrator";
  time: string;
  priority: "high" | "medium" | "low";
}

const insights: Insight[] = [
  {
    id: "1",
    type: "alert",
    title: "FDA Issues New CAR-T Guidelines",
    description: "Updated manufacturing and quality requirements for CAR-T cell therapies effective Q2 2024",
    agent: "Regulatory",
    time: "2 hours ago",
    priority: "high",
  },
  {
    id: "2",
    type: "trend",
    title: "mRNA Research Surge Detected",
    description: "23% increase in mRNA-based therapeutic publications across 47 journals this month",
    agent: "Research",
    time: "4 hours ago",
    priority: "medium",
  },
  {
    id: "3",
    type: "update",
    title: "Competitor Trial Phase Change",
    description: "NCT04892345 (BioGenex) advanced to Phase III for solid tumor immunotherapy",
    agent: "Clinical",
    time: "6 hours ago",
    priority: "high",
  },
  {
    id: "4",
    type: "action",
    title: "Cross-Agent Analysis Complete",
    description: "Pipeline risk assessment compiled from all agents - 3 items require attention",
    agent: "Orchestrator",
    time: "8 hours ago",
    priority: "medium",
  },
  {
    id: "5",
    type: "trend",
    title: "Oncology Endpoint Patterns",
    description: "Shift toward surrogate endpoints in Phase II trials: 34% adoption increase YoY",
    agent: "Clinical",
    time: "1 day ago",
    priority: "low",
  },
];

const typeIcons = {
  alert: <AlertCircle className="h-4 w-4" />,
  trend: <TrendingUp className="h-4 w-4" />,
  update: <FileText className="h-4 w-4" />,
  action: <Zap className="h-4 w-4" />,
};

const agentColors = {
  Research: "agent-badge-research",
  Clinical: "agent-badge-clinical",
  Regulatory: "agent-badge-regulatory",
  Orchestrator: "agent-badge-orchestrator",
};

const priorityColors = {
  high: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-muted text-muted-foreground border-border",
};

export default function InsightFeed() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-border/50 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Latest Insights</h3>
          <Button variant="ghost" size="sm" className="gap-1 text-primary" asChild>
            <Link to="/insights">View All <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>

      <div className="divide-y divide-border/50">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="group flex gap-4 p-4 transition-colors hover:bg-secondary/30"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                insight.type === "alert"
                  ? "bg-rose-500/20 text-rose-400"
                  : insight.type === "trend"
                  ? "bg-primary/20 text-primary"
                  : insight.type === "update"
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-purple-500/20 text-purple-400"
              }`}
            >
              {typeIcons[insight.type]}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium leading-tight">{insight.title}</p>
                <Badge
                  variant="outline"
                  className={`shrink-0 text-xs ${priorityColors[insight.priority]}`}
                >
                  {insight.priority}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
              <div className="flex items-center gap-2 pt-1">
                <Badge
                  variant="outline"
                  className={`text-xs ${agentColors[insight.agent]}`}
                >
                  {insight.agent}
                </Badge>
                <span className="text-xs text-muted-foreground">{insight.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
