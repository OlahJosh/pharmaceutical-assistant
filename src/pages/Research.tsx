import { useState, useEffect, useMemo } from "react";
import { Search, ExternalLink, TrendingUp, BookOpen, Filter, Sparkles, RefreshCw, Loader2 } from "lucide-react";
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
import { useResearch } from "@/hooks/use-research";
import { Skeleton } from "@/components/ui/skeleton";
import { defaultResearchPapers, defaultTrendingKeywords, defaultAiInsights } from "@/data/default-data";

export default function Research() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJournal, setSelectedJournal] = useState("all");
  const { data, isLoading, fetchResearch } = useResearch();

  const handleRefresh = () => {
    fetchResearch(searchQuery || undefined);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchResearch(searchQuery);
    }
  };

  // Use fetched data if available, otherwise use defaults
  const papers = useMemo(() => {
    const sourcePapers = data?.papers?.length ? data.papers : defaultResearchPapers;
    
    return sourcePapers.filter(paper => {
      const matchesSearch = !searchQuery || 
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesJournal = selectedJournal === "all" || 
        paper.journal.toLowerCase().includes(selectedJournal.toLowerCase());
      
      return matchesSearch && matchesJournal;
    });
  }, [data?.papers, searchQuery, selectedJournal]);

  const trendingKeywords = data?.trendingKeywords?.length ? data.trendingKeywords : defaultTrendingKeywords;
  const aiInsights = data?.insights?.length ? data.insights : defaultAiInsights;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pb-12 pt-24">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
          <div>
            <h1 className="font-display text-3xl font-bold">Research Intelligence</h1>
            <p className="text-muted-foreground">
              AI-powered research monitoring across 47 journals
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
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
            <Badge className="w-fit agent-badge-research border animate-pulse-subtle">
              <Search className="mr-1.5 h-3.5 w-3.5" />
              Research Agent Active
            </Badge>
          </div>
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
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Select value={selectedJournal} onValueChange={setSelectedJournal}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Journals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Journals</SelectItem>
              <SelectItem value="nature">Nature</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="cell">Cell</SelectItem>
              <SelectItem value="lancet">The Lancet</SelectItem>
              <SelectItem value="nejm">NEJM</SelectItem>
              <SelectItem value="blood">Blood</SelectItem>
              <SelectItem value="jco">J Clinical Oncology</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2" onClick={handleSearch}>
            <Filter className="h-4 w-4" />
            Search
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Papers List */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold animate-fade-in">Recent Publications</h2>
              <Badge variant="secondary">{papers.length} papers</Badge>
            </div>
            
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="glass-card p-6">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-16 w-full mb-3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </Card>
              ))
            ) : (
              papers.slice(0, 20).map((paper, index) => (
                <Card key={paper.id} className={`glass-card p-6 transition-all hover:border-border hover-lift animate-fade-in-up stagger-${Math.min(index + 1, 5)}`}>
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
                          <Badge key={keyword} variant="secondary" className="text-xs cursor-pointer hover:bg-primary/20" onClick={() => setSearchQuery(keyword)}>
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
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Insights */}
            <Card className="glass-card p-6 animate-fade-in-right stagger-1 hover-glow">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse-subtle" />
                <h3 className="font-display text-lg font-semibold">AI Insights</h3>
              </div>
              <div className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))
                ) : (
                  aiInsights.map((insight, index) => (
                    <div key={index} className="border-l-2 border-primary/50 pl-3 hover:border-primary transition-colors">
                      <p className="text-sm text-muted-foreground">{insight}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Trending Keywords */}
            <Card className="glass-card p-6 animate-fade-in-right stagger-2 hover-glow">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-semibold">Trending Keywords</h3>
              </div>
              <div className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))
                ) : (
                  trendingKeywords.map((item, index) => (
                    <div
                      key={item.keyword}
                      className={`flex items-center justify-between rounded-lg bg-secondary/30 p-3 hover-scale cursor-pointer animate-fade-in-up stagger-${Math.min(index + 1, 5)}`}
                      onClick={() => {
                        setSearchQuery(item.keyword);
                      }}
                    >
                      <div>
                        <p className="text-sm font-medium">{item.keyword}</p>
                        <p className="text-xs text-muted-foreground">{item.count} papers</p>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        {item.change}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Sources */}
            <Card className="glass-card p-6 animate-fade-in-right stagger-3 hover-glow">
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
