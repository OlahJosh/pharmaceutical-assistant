import { useState } from "react";
import { Search, ExternalLink, TrendingUp, BookOpen, Filter, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const researchPapers = [
  {
    id: "1",
    title: "Novel CAR-T Cell Engineering Approaches for Solid Tumor Treatment",
    authors: "Zhang et al.",
    journal: "Nature Medicine",
    date: "Dec 2024",
    citations: 47,
    abstract: "This study presents breakthrough modifications to CAR-T cell constructs that enhance tumor infiltration and persistence in solid tumor microenvironments...",
    keywords: ["CAR-T", "Immunotherapy", "Solid Tumors", "Cell Engineering"],
    trending: true,
    link: "https://www.nature.com/nm/",
  },
  {
    id: "2",
    title: "mRNA Lipid Nanoparticle Optimization for Enhanced Tissue Targeting",
    authors: "Chen & Williams",
    journal: "Science Translational Medicine",
    date: "Dec 2024",
    citations: 32,
    abstract: "A comprehensive analysis of ionizable lipid structures and their impact on mRNA delivery efficiency to specific tissue types...",
    keywords: ["mRNA", "Lipid Nanoparticles", "Drug Delivery", "Gene Therapy"],
    trending: true,
    link: "https://www.science.org/journal/stm",
  },
  {
    id: "3",
    title: "CRISPR-Based Approaches to Rare Genetic Disease Treatment",
    authors: "Patel et al.",
    journal: "Cell",
    date: "Nov 2024",
    citations: 89,
    abstract: "Review of current clinical applications of CRISPR gene editing for rare diseases, including outcomes from ongoing trials...",
    keywords: ["CRISPR", "Gene Editing", "Rare Diseases", "Clinical Trials"],
    trending: false,
    link: "https://www.cell.com/cell/home",
  },
  {
    id: "4",
    title: "AI-Driven Drug Discovery: From Target Identification to Lead Optimization",
    authors: "Kumar & Anderson",
    journal: "Nature Reviews Drug Discovery",
    date: "Nov 2024",
    citations: 156,
    abstract: "Comprehensive overview of machine learning applications across the drug discovery pipeline, with focus on recent successes...",
    keywords: ["AI", "Drug Discovery", "Machine Learning", "Lead Optimization"],
    trending: true,
    link: "https://www.nature.com/nrd/",
  },
  {
    id: "5",
    title: "Antibody-Drug Conjugate Design Principles for Improved Therapeutic Index",
    authors: "Thompson et al.",
    journal: "Journal of Medicinal Chemistry",
    date: "Oct 2024",
    citations: 28,
    abstract: "Structure-activity relationship analysis of linker chemistry and payload selection in next-generation ADCs...",
    keywords: ["ADC", "Antibody", "Linker Chemistry", "Oncology"],
    trending: false,
    link: "https://pubs.acs.org/journal/jmcmar",
  },
];

const trendingKeywords = [
  { keyword: "mRNA Therapeutics", count: 234, change: "+23%" },
  { keyword: "CAR-T Cells", count: 189, change: "+18%" },
  { keyword: "CRISPR", count: 167, change: "+12%" },
  { keyword: "AI Drug Discovery", count: 145, change: "+31%" },
  { keyword: "Antibody-Drug Conjugates", count: 98, change: "+8%" },
];

const aiInsights = [
  "Research output in mRNA therapeutics increased 23% month-over-month, primarily driven by COVID-19 vaccine platform extensions to oncology applications.",
  "CAR-T publications show growing focus on allogeneic approaches, with 34% of new papers addressing off-the-shelf manufacturing.",
  "Cross-referencing with clinical trial data suggests a 6-month lag between publication peaks and trial initiations in gene therapy space.",
];

export default function Research() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJournal, setSelectedJournal] = useState("all");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pb-12 pt-24">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Research Intelligence</h1>
            <p className="text-muted-foreground">
              AI-powered research monitoring across 47 journals
            </p>
          </div>
          <Badge className="w-fit agent-badge-research border">
            <Search className="mr-1.5 h-3.5 w-3.5" />
            Research Agent Active
          </Badge>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search papers, authors, keywords..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedJournal} onValueChange={setSelectedJournal}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Journals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Journals</SelectItem>
              <SelectItem value="nature">Nature Medicine</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="cell">Cell</SelectItem>
              <SelectItem value="nejm">NEJM</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Papers List */}
          <div className="space-y-4 lg:col-span-2">
            <h2 className="font-display text-xl font-semibold">Recent Publications</h2>
            {researchPapers.map((paper) => (
              <Card key={paper.id} className="glass-card p-6 transition-all hover:border-border">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-2">
                      {paper.trending && (
                        <Badge className="shrink-0 bg-primary/20 text-primary border-primary/30">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-semibold leading-tight">
                      {paper.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span>{paper.authors}</span>
                      <span>•</span>
                      <span className="text-primary">{paper.journal}</span>
                      <span>•</span>
                      <span>{paper.date}</span>
                      <span>•</span>
                      <span>{paper.citations} citations</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {paper.abstract}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {paper.keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={paper.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            <Card className="glass-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-semibold">AI Insights</h3>
              </div>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="border-l-2 border-primary/50 pl-3">
                    <p className="text-sm text-muted-foreground">{insight}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Trending Keywords */}
            <Card className="glass-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-semibold">Trending Keywords</h3>
              </div>
              <div className="space-y-3">
                {trendingKeywords.map((item) => (
                  <div
                    key={item.keyword}
                    className="flex items-center justify-between rounded-lg bg-secondary/30 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.keyword}</p>
                      <p className="text-xs text-muted-foreground">{item.count} papers</p>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      {item.change}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Sources */}
            <Card className="glass-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-semibold">Monitored Sources</h3>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• 47 peer-reviewed journals</p>
                <p>• 12 preprint servers</p>
                <p>• 8 patent databases</p>
                <p>• 15 conference proceedings</p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
