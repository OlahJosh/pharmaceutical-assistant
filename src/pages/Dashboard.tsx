import { Brain, Search, FileText, Shield, Activity, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import AgentCard from "@/components/agents/AgentCard";
import InsightFeed from "@/components/agents/InsightFeed";
import { Card } from "@/components/ui/card";

const summaryStats = [
  {
    label: "Active Monitors",
    value: "247",
    change: "+12 this week",
    icon: <Activity className="h-5 w-5" />,
    trend: "up",
  },
  {
    label: "Research Papers",
    value: "1,847",
    change: "Analyzed this month",
    icon: <TrendingUp className="h-5 w-5" />,
    trend: "up",
  },
  {
    label: "Pending Alerts",
    value: "8",
    change: "3 high priority",
    icon: <AlertTriangle className="h-5 w-5" />,
    trend: "warning",
  },
  {
    label: "Compliance Score",
    value: "94%",
    change: "All checks passed",
    icon: <CheckCircle className="h-5 w-5" />,
    trend: "up",
  },
];

const trendColors = {
  up: "text-emerald-400",
  down: "text-rose-400",
  warning: "text-amber-400",
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pb-12 pt-24">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Real-time intelligence across all agents
          </p>
        </div>

        {/* Summary Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryStats.map((stat) => (
            <Card
              key={stat.label}
              className="glass-card flex items-center gap-4 p-5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {stat.icon}
              </div>
              <div>
                <p className="font-display text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-xs ${trendColors[stat.trend as keyof typeof trendColors]}`}>
                  {stat.change}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Agent Cards Grid */}
        <div className="mb-8">
          <h2 className="mb-4 font-display text-xl font-semibold">Agent Status</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AgentCard
              title="Orchestrator"
              description="Coordinating cross-agent analysis and synthesizing insights"
              icon={<Brain className="h-6 w-6" />}
              agentType="orchestrator"
              status="active"
              stats={[
                { label: "Tasks Today", value: "34" },
                { label: "Synced", value: "100%" },
              ]}
            />
            <AgentCard
              title="Research Intelligence"
              description="Monitoring 47 journals and 12 preprint servers"
              icon={<Search className="h-6 w-6" />}
              agentType="research"
              status="processing"
              stats={[
                { label: "Papers Today", value: "127" },
                { label: "Trends", value: "8" },
              ]}
            />
            <AgentCard
              title="Clinical Trials"
              description="Tracking 892 active trials across 6 therapeutic areas"
              icon={<FileText className="h-6 w-6" />}
              agentType="clinical"
              status="active"
              stats={[
                { label: "Active Trials", value: "892" },
                { label: "Updates", value: "23" },
              ]}
            />
            <AgentCard
              title="Regulatory & GMP"
              description="Monitoring FDA, EMA, and 12 regional authorities"
              icon={<Shield className="h-6 w-6" />}
              agentType="regulatory"
              status="active"
              stats={[
                { label: "Alerts", value: "5" },
                { label: "Compliance", value: "94%" },
              ]}
            />
          </div>
        </div>

        {/* Insights Feed */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <InsightFeed />
          </div>

          {/* Quick Actions / Pipeline Summary */}
          <div className="space-y-6">
            <Card className="glass-card p-6">
              <h3 className="mb-4 font-display text-lg font-semibold">Pipeline Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Discovery</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-secondary">
                      <div className="h-2 w-16 rounded-full bg-primary" />
                    </div>
                    <span className="text-sm font-medium">12</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Preclinical</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-secondary">
                      <div className="h-2 w-20 rounded-full bg-amber-400" />
                    </div>
                    <span className="text-sm font-medium">8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Phase I</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-secondary">
                      <div className="h-2 w-12 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-sm font-medium">5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Phase II</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-secondary">
                      <div className="h-2 w-8 rounded-full bg-purple-400" />
                    </div>
                    <span className="text-sm font-medium">3</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Phase III</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-secondary">
                      <div className="h-2 w-4 rounded-full bg-rose-400" />
                    </div>
                    <span className="text-sm font-medium">1</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="glass-card p-6">
              <h3 className="mb-4 font-display text-lg font-semibold">Upcoming Deadlines</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-lg bg-rose-500/10 p-3">
                  <div className="h-2 w-2 rounded-full bg-rose-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">FDA Pre-IND Meeting</p>
                    <p className="text-xs text-muted-foreground">In 3 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-amber-500/10 p-3">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Quarterly Compliance Review</p>
                    <p className="text-xs text-muted-foreground">In 7 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Trial Data Lock</p>
                    <p className="text-xs text-muted-foreground">In 14 days</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
