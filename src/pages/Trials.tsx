import { useState } from "react";
import { FileText, Plus, X, Sparkles, ExternalLink, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const trialsData = [
  {
    id: "NCT04512345",
    title: "Phase III Study of XYZ-101 in Advanced NSCLC",
    sponsor: "BioGenex Therapeutics",
    phase: "Phase III",
    status: "Recruiting",
    indication: "Non-Small Cell Lung Cancer",
    primaryEndpoint: "Overall Survival (OS)",
    secondaryEndpoints: ["PFS", "ORR", "DOR", "Safety"],
    enrollment: 450,
    startDate: "Jan 2024",
    completionDate: "Dec 2026",
  },
  {
    id: "NCT04678901",
    title: "Phase II Basket Trial of ABC-202 in Solid Tumors",
    sponsor: "Oncology Partners Inc.",
    phase: "Phase II",
    status: "Active",
    indication: "Multiple Solid Tumors",
    primaryEndpoint: "Objective Response Rate (ORR)",
    secondaryEndpoints: ["PFS", "DCR", "Safety", "PK/PD"],
    enrollment: 180,
    startDate: "Mar 2023",
    completionDate: "Sep 2025",
  },
  {
    id: "NCT04234567",
    title: "Phase I/II First-in-Human Study of DEF-303",
    sponsor: "NovaTech Pharma",
    phase: "Phase I/II",
    status: "Recruiting",
    indication: "Relapsed/Refractory AML",
    primaryEndpoint: "MTD and RP2D Determination",
    secondaryEndpoints: ["ORR", "CR Rate", "MRD Negativity"],
    enrollment: 90,
    startDate: "Jun 2024",
    completionDate: "Jun 2027",
  },
  {
    id: "NCT04890123",
    title: "Phase III Registrational Study of GHI-404",
    sponsor: "MediBio Sciences",
    phase: "Phase III",
    status: "Completed",
    indication: "Metastatic Breast Cancer",
    primaryEndpoint: "Progression-Free Survival (PFS)",
    secondaryEndpoints: ["OS", "ORR", "QoL", "Safety"],
    enrollment: 600,
    startDate: "Aug 2021",
    completionDate: "Nov 2024",
  },
];

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
};

export default function Trials() {
  const [selectedTrials, setSelectedTrials] = useState<string[]>([]);

  const toggleTrial = (id: string) => {
    setSelectedTrials((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const selectedTrialData = trialsData.filter((t) => selectedTrials.includes(t.id));

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
          <Badge className="w-fit agent-badge-clinical border">
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            Clinical Agent Active
          </Badge>
        </div>

        {/* Trial Selection */}
        <Card className="glass-card mb-8 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Select Trials to Compare</h2>
            <p className="text-sm text-muted-foreground">
              {selectedTrials.length}/3 selected
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {trialsData.map((trial) => {
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
                    <Badge variant="outline" className={phaseColors[trial.phase]}>
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
                          <Badge variant="outline" className={phaseColors[trial.phase]}>
                            {trial.phase}
                          </Badge>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow className="border-border/50">
                      <TableCell className="font-medium">Status</TableCell>
                      {selectedTrialData.map((trial) => (
                        <TableCell key={trial.id}>
                          <Badge variant="outline" className={statusColors[trial.status]}>
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
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-semibold">AI-Generated Comparison Insights</h3>
              </div>
              <div className="space-y-4">
                <div className="border-l-2 border-primary/50 pl-4">
                  <p className="mb-1 font-medium">Endpoint Alignment</p>
                  <p className="text-sm text-muted-foreground">
                    The selected trials show convergence on survival-based endpoints (OS/PFS), 
                    indicating industry alignment with regulatory preferences for hard clinical outcomes.
                  </p>
                </div>
                <div className="border-l-2 border-amber-500/50 pl-4">
                  <p className="mb-1 font-medium">Competitive Positioning</p>
                  <p className="text-sm text-muted-foreground">
                    Phase III trials in this comparison target similar patient populations, 
                    suggesting potential market overlap and competitive pressure on enrollment timelines.
                  </p>
                </div>
                <div className="border-l-2 border-purple-500/50 pl-4">
                  <p className="mb-1 font-medium">Timeline Risk</p>
                  <p className="text-sm text-muted-foreground">
                    Based on historical data, Phase III trials in oncology have a 23% probability 
                    of timeline extension. Consider this in competitive landscape planning.
                  </p>
                </div>
              </div>
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
