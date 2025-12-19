import { useEffect } from "react";
import { Sparkles, RefreshCw, Loader2, TrendingUp, FileText, Scale, Target, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useInsights } from "@/hooks/use-insights";
import { Link } from "react-router-dom";
import { defaultInsightsData } from "@/data/default-data";

const impactColors = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const priorityColors = {
  urgent: "bg-red-500/20 text-red-400",
  high: "bg-amber-500/20 text-amber-400",
  medium: "bg-primary/20 text-primary",
  low: "bg-muted text-muted-foreground",
};

export default function Insights() {
  const { data: fetchedData, isLoading, fetchInsights } = useInsights();

  // Use fetched data if available, otherwise use defaults
  const data = fetchedData || defaultInsightsData;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pb-12 pt-24">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
          <div>
            <h1 className="font-display text-3xl font-bold">Intelligence Summary</h1>
            <p className="text-muted-foreground">AI-aggregated insights across Research, Trials & Regulatory</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchInsights()} disabled={isLoading} className="gap-2">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>

        {/* Executive Summary */}
        {data?.executiveSummary && (
          <Card className="glass-card p-6 mb-8 border-primary/30 animate-fade-in-up">
            <div className="flex items-start gap-3">
              <Sparkles className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h2 className="font-display text-lg font-semibold mb-2">Executive Summary</h2>
                <p className="text-muted-foreground">{data.executiveSummary}</p>
              </div>
            </div>
          </Card>
        )}

        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : (
          <>
            {/* Domain Insights Grid */}
            <div className="grid gap-6 lg:grid-cols-3 mb-8">
              {[
                { title: "Research", insights: data.researchInsights, icon: TrendingUp, link: "/research" },
                { title: "Clinical Trials", insights: data.trialsInsights, icon: FileText, link: "/trials" },
                { title: "Regulatory", insights: data.regulatoryInsights, icon: Scale, link: "/regulatory" },
              ].map((section) => (
                <Card key={section.title} className="glass-card p-6 animate-fade-in-up">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <section.icon className="h-5 w-5 text-primary" />
                      <h3 className="font-display font-semibold">{section.title}</h3>
                    </div>
                    <Link to={section.link}>
                      <Button variant="ghost" size="sm"><ArrowRight className="h-4 w-4" /></Button>
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {section.insights?.map((insight, i) => (
                      <div key={i} className="border-l-2 border-primary/30 pl-3">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium">{insight.title}</p>
                          <Badge variant="outline" className={impactColors[insight.impact]}>{insight.impact}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{insight.summary}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Cross-Domain Recommendations */}
            <Card className="glass-card p-6 mb-8">
              <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Strategic Recommendations
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {data.crossDomainRecommendations?.map((rec, i) => (
                  <div key={i} className={`p-4 rounded-lg ${priorityColors[rec.priority]}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium">{rec.title}</p>
                      <Badge variant="outline" className="text-xs capitalize">{rec.priority}</Badge>
                    </div>
                    <p className="text-sm opacity-80 mb-2">{rec.description}</p>
                    <div className="flex gap-1">
                      {rec.domains?.map((d) => <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Market Trends */}
            {data.marketTrends && (
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="glass-card p-6">
                  <h4 className="font-semibold mb-3">Top Therapeutic Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.marketTrends.topTherapeuticAreas?.map((area, i) => (
                      <Badge key={i} variant="secondary">{area}</Badge>
                    ))}
                  </div>
                </Card>
                <Card className="glass-card p-6">
                  <h4 className="font-semibold mb-3">Emerging Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.marketTrends.emergingTechnologies?.map((tech, i) => (
                      <Badge key={i} variant="outline" className="border-primary/30">{tech}</Badge>
                    ))}
                  </div>
                </Card>
                <Card className="glass-card p-6">
                  <h4 className="font-semibold mb-3">Key Players</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.marketTrends.keyPlayers?.map((player, i) => (
                      <Badge key={i} variant="secondary">{player}</Badge>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
