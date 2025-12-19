import { useState, useEffect } from "react";
import { FileText, Plus, X, Sparkles, RefreshCw, Loader2, ArrowRight, AlertTriangle, CheckCircle, Target } from "lucide-react";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTrials, Trial } from "@/hooks/use-trials";

const phaseColors: Record<string, string> = {
  "Phase I": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Phase I/II": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Phase II": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "Phase III": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const statusColors: Record<string, string> = {
  Recruiting: "bg-primary/20 text-primary border-primary/30",
  Active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Completed: "bg-muted text-muted-foreground border-border",
  Suspended: "bg-red-500/20 text-red-400 border-red-500/30",
};

const insightTypeColors: Record<string, string> = {
  endpoint: "border-primary/50",
  competitive: "border-amber-500/50",
  timeline: "border-purple-500/50",
  risk: "border-red-500/50",
  recommendation: "border-emerald-500/50",
};

const riskScoreColors: Record<string, { bg: string; text: string; icon: any }> = {
  low: { bg: "bg-emerald-500/20", text: "text-emerald-400", icon: CheckCircle },
  medium: { bg: "bg-amber-500/20", text: "text-amber-400", icon: Target },
  high: { bg: "bg-red-500/20", text: "text-red-400", icon: AlertTriangle },
};

export default function Trials() {
  const [selectedTrials, setSelectedTrials] = useState<string[]>([]);
  const { trialsData, comparisonData, isLoading, isComparing, fetchTrials, compareTrials } = useTrials();

  useEffect(() => {
    fetchTrials();
  }, []);

  const trials = trialsData?.trials || [];

  const toggleTrial = (id: string) => {
    setSelectedTrials((prev) => {
      const newSelection = prev.includes(id) 
        ? prev.filter((t) => t !== id) 
        : prev.length < 3 ? [...prev, id] : prev;
      
      // Auto-compare when 2+ trials selected
      if (newSelection.length >= 2) {
        const selectedTrialData = trials.filter((t) => newSelection.includes(t.id));
        setTimeout(() => compareTrials(selectedTrialData), 100);
      }
      
      return newSelection;
    });
  };

  const selectedTrialData = trials.filter((t) => selectedTrials.includes(t.id));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pb-12 pt-24">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Clinical Trial Comparison</h1>
            <p className="text-muted-foreground">
              Compare trials by phase, endpoints, and outcomes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchTrials()}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
            <Badge className="w-fit agent-badge-clinical border">
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              Clinical Agent Active
            </Badge>
          </div>
        </div>

        {/* Trial Selection */}
        <Card className="glass-card mb-8 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Select Trials to Compare</h2>
            <p className="text-sm text-muted-foreground">
              {selectedTrials.length}/3 selected
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full" />
              ))}
            </div>
          ) : trials.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {trials.map((trial) => {
                const isSelected = selectedTrials.includes(trial.id);
                return (
                  <button
                    key={trial.id}
                    onClick={() => toggleTrial(trial.id)}
                    className={`rounded-lg border p-4 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border/50 bg-secondary/30 hover:border-border"
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <Badge variant="outline" className={phaseColors[trial.phase] || phaseColors["Phase II"]}>
                        {trial.phase}
                      </Badge>
                      {isSelected ? (
                        <X className="h-4 w-4 text-primary" />
                      ) : (
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="mb-1 text-sm font-medium">{trial.id}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{trial.title}</p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Click refresh to load clinical trials</p>
              <Button onClick={() => fetchTrials()} disabled={isLoading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Load Trials
              </Button>
            </div>
          )}
        </Card>

        {/* Comparison Table */}
        {selectedTrials.length >= 2 ? (
          <div className="space-y-8">
            <Card className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="w-48 font-display">Attribute</TableHead>
                      {selectedTrialData.map((trial) => (
                        <TableHead key={trial.id} className="min-w-64 font-display">
                          {trial.id}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-border/50">
                      <TableCell className="font-medium">Title</TableCell>
                      {selectedTrialData.map((trial) => (
                        <TableCell key={trial.id} className="text-sm">
                          {trial.title}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow className="border-border/50">
                      <TableCell className="font-medium">Sponsor</TableCell>
                      {selectedTrialData.map((trial) => (
                        <TableCell key={trial.id} className="text-sm">
                          {trial.sponsor}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow className="border-border/50">
                      <TableCell className="font-medium">Phase</TableCell>
                      {selectedTrialData.map((trial) => (
                        <TableCell key={trial.id}>
                          <Badge variant="outline" className={phaseColors[trial.phase] || phaseColors["Phase II"]}>
                            {trial.phase}
                          </Badge>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow className="border-border/50">
                      <TableCell className="font-medium">Status</TableCell>
                      {selectedTrialData.map((trial) => (
                        <TableCell key={trial.id}>
                          <Badge variant="outline" className={statusColors[trial.status] || statusColors["Active"]}>
                            {trial.status}
                          </Badge>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow className="border-border/50">
                      <TableCell className="font-medium">Indication</TableCell>
                      {selectedTrialData.map((trial) => (
                        <TableCell key={trial.id} className="text-sm">
                          {trial.indication}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow className="border-border/50">
                      <TableCell className="font-medium">Primary Endpoint</TableCell>
                      {selectedTrialData.map((trial) => (
                        <TableCell key={trial.id} className="text-sm font-medium text-primary">
                          {trial.primaryEndpoint}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow className="border-border/50">
                      <TableCell className="font-medium">Secondary Endpoints</TableCell>
                      {selectedTrialData.map((trial) => (
                        <TableCell key={trial.id}>
                          <div className="flex flex-wrap gap-1">
                            {trial.secondaryEndpoints.map((ep) => (
                              <Badge key={ep} variant="secondary" className="text-xs">
                                {ep}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow className="border-border/50">
                      <TableCell className="font-medium">Enrollment</TableCell>
                      {selectedTrialData.map((trial) => (
                        <TableCell key={trial.id} className="text-sm">
                          {trial.enrollment} patients
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow className="border-border/50">
                      <TableCell className="font-medium">Timeline</TableCell>
                      {selectedTrialData.map((trial) => (
                        <TableCell key={trial.id} className="text-sm text-muted-foreground">
                          {trial.startDate} → {trial.completionDate}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* AI Insights */}
            <Card className="glass-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse-subtle" />
                  <h3 className="font-display text-lg font-semibold">AI-Generated Comparison Insights</h3>
                </div>
                {isComparing && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </div>
                )}
              </div>

              {isComparing ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : comparisonData ? (
                <div className="space-y-6">
                  {/* Risk Score & Recommendation */}
                  {comparisonData.riskScore && (
                    <div className={`flex items-center gap-3 p-4 rounded-lg ${riskScoreColors[comparisonData.riskScore]?.bg || "bg-secondary/30"}`}>
                      {(() => {
                        const RiskIcon = riskScoreColors[comparisonData.riskScore]?.icon || Target;
                        return <RiskIcon className={`h-5 w-5 ${riskScoreColors[comparisonData.riskScore]?.text || "text-muted-foreground"}`} />;
                      })()}
                      <div>
                        <p className="font-medium">Risk Assessment: <span className="capitalize">{comparisonData.riskScore}</span></p>
                        <p className="text-sm text-muted-foreground">{comparisonData.recommendation}</p>
                      </div>
                    </div>
                  )}

                  {/* Insights */}
                  <div className="space-y-4">
                    {comparisonData.insights?.map((insight, index) => (
                      <div key={index} className={`border-l-2 ${insightTypeColors[insight.type] || "border-primary/50"} pl-4`}>
                        <p className="mb-1 font-medium">{insight.title}</p>
                        <p className="text-sm text-muted-foreground">{insight.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* Competitive Analysis */}
                  {comparisonData.competitiveAnalysis && (
                    <div className="border-t border-border/50 pt-4">
                      <p className="font-medium mb-2">Competitive Landscape</p>
                      <p className="text-sm text-muted-foreground">{comparisonData.competitiveAnalysis}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-l-2 border-primary/50 pl-4">
                    <p className="mb-1 font-medium">Endpoint Alignment</p>
                    <p className="text-sm text-muted-foreground">
                      Select trials to generate AI-powered comparison insights.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        ) : (
          <Card className="glass-card flex flex-col items-center justify-center p-12 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-display text-xl font-semibold">Select Trials to Compare</h3>
            <p className="mb-4 max-w-md text-muted-foreground">
              Choose at least 2 trials from the list above to generate a side-by-side 
              comparison with AI-powered insights.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary">
              <span>Select 2-3 trials above</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
