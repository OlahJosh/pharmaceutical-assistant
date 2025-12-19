import { useEffect, useRef } from "react";
import { Shield, AlertCircle, CheckCircle, Clock, FileText, Search, Filter, Globe } from "lucide-react";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useComplianceItems } from "@/hooks/use-compliance-items";
import { useChat } from "@/hooks/use-chat";
import { ChatSidebar } from "@/components/regulatory/ChatSidebar";
import { ChatMessage } from "@/components/regulatory/ChatMessage";
import { ChatInput } from "@/components/regulatory/ChatInput";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const regulatoryUpdates = [
  {
    id: "1",
    title: "FDA Updates CAR-T Manufacturing Guidelines",
    agency: "FDA",
    date: "Dec 15, 2024",
    priority: "high",
    summary: "New quality control requirements for viral vector production in CAR-T cell therapies",
  },
  {
    id: "2",
    title: "EMA Revises Clinical Trial Application Process",
    agency: "EMA",
    date: "Dec 12, 2024",
    priority: "medium",
    summary: "Streamlined submission pathway for first-in-human studies with enhanced safety monitoring",
  },
  {
    id: "3",
    title: "ICH E6(R3) GCP Guidelines Published",
    agency: "ICH",
    date: "Dec 10, 2024",
    priority: "high",
    summary: "Major revision to Good Clinical Practice guidelines with focus on risk-based monitoring",
  },
  {
    id: "4",
    title: "PMDA Announces New Accelerated Approval Criteria",
    agency: "PMDA",
    date: "Dec 8, 2024",
    priority: "medium",
    summary: "Japan expands conditional approval pathway for breakthrough therapies",
  },
];

const sampleQuestions = [
  "What are the key differences between FDA and EMA requirements for CAR-T therapies?",
  "Summarize the latest ICH E6(R3) GCP guideline changes",
  "What documentation is required for a Pre-IND meeting?",
  "Explain 21 CFR Part 211 requirements",
];

const agencies = ["All Agencies", "FDA", "EMA", "ICH", "PMDA"];
const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "ja", name: "日本語" },
];

export default function Regulatory() {
  const { items: complianceItems, isLoading: checklistLoading, toggleStatus, completeCount, totalCount } = useComplianceItems();
  const {
    messages,
    isLoading,
    sendMessage,
    conversations,
    currentConversationId,
    fetchConversations,
    loadConversation,
    startNewChat,
    deleteConversation,
    clearAllHistory,
  } = useChat();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgency, setSelectedAgency] = useState("All Agencies");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Filter updates based on search and agency
  const filteredUpdates = regulatoryUpdates.filter((update) => {
    const matchesSearch = searchQuery === "" || 
      update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      update.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAgency = selectedAgency === "All Agencies" || update.agency === selectedAgency;
    return matchesSearch && matchesAgency;
  });

  const handleQuickQuestion = (question: string) => {
    sendMessage(question, []);
  };

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    toast({
      title: "Language Updated",
      description: `Interface language set to ${languages.find(l => l.code === code)?.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pb-12 pt-24">
        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fadeInDown">
          <div>
            <h1 className="font-display text-3xl font-bold">Regulatory & Compliance Assistant</h1>
            <p className="text-muted-foreground">
              AI-powered guidance on FDA, EMA, and GMP requirements
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  {languages.find(l => l.code === selectedLanguage)?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={selectedLanguage === lang.code ? "bg-primary/20" : ""}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Badge className="agent-badge-regulatory border">
              <Shield className="mr-1.5 h-3.5 w-3.5" />
              Regulatory Agent Active
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chat Interface with Sidebar */}
          <div className="lg:col-span-2 animate-fadeInUp">
            <Card className="glass-card flex h-[650px] overflow-hidden">
              {/* Chat History Sidebar */}
              <ChatSidebar
                conversations={conversations}
                currentConversationId={currentConversationId}
                onSelectConversation={loadConversation}
                onNewChat={startNewChat}
                onDeleteConversation={deleteConversation}
                onClearHistory={clearAllHistory}
              />

              {/* Main Chat Area */}
              <div className="flex flex-1 flex-col">
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Shield className="mb-4 h-16 w-16 text-primary/50 animate-float" />
                        <h3 className="mb-2 font-display text-xl font-semibold">
                          Welcome to Regulatory Assistant
                        </h3>
                        <p className="mb-6 max-w-md text-muted-foreground">
                          Ask me about FDA, EMA, or ICH guidelines, compliance requirements, 
                          or upload documents for analysis.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {sampleQuestions.slice(0, 3).map((q, i) => (
                            <Button
                              key={i}
                              variant="outline"
                              size="sm"
                              className="text-xs animate-fadeInUp"
                              style={{ animationDelay: `${i * 0.1}s` }}
                              onClick={() => handleQuickQuestion(q)}
                            >
                              {q.slice(0, 45)}...
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <ChatMessage key={index} message={message} />
                      ))
                    )}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="rounded-lg bg-secondary p-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" style={{ animationDelay: "0.2s" }} />
                            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" style={{ animationDelay: "0.4s" }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Quick Questions (only show when no messages) */}
                {messages.length > 0 && (
                  <div className="border-t border-border/50 p-3">
                    <div className="flex flex-wrap gap-2">
                      {sampleQuestions.map((q, i) => (
                        <Button
                          key={i}
                          variant="secondary"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleQuickQuestion(q)}
                        >
                          {q.slice(0, 35)}...
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <ChatInput onSend={sendMessage} isLoading={isLoading} />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 animate-fadeInRight">
            {/* Search and Filter */}
            <Card className="glass-card p-4">
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search updates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedAgency} onValueChange={setSelectedAgency}>
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by agency" />
                  </SelectTrigger>
                  <SelectContent>
                    {agencies.map((agency) => (
                      <SelectItem key={agency} value={agency}>
                        {agency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Recent Updates */}
            <Card className="glass-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-rose-400" />
                <h3 className="font-display text-lg font-semibold">Recent Updates</h3>
              </div>
              <div className="space-y-3">
                {filteredUpdates.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No updates match your filters
                  </p>
                ) : (
                  filteredUpdates.map((update) => (
                    <div
                      key={update.id}
                      className="rounded-lg border border-border/50 p-3 transition-colors hover:bg-secondary/30 cursor-pointer"
                    >
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            update.priority === "high"
                              ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                              : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {update.agency}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{update.date}</span>
                      </div>
                      <p className="mb-1 text-sm font-medium">{update.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{update.summary}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Compliance Checklist */}
            <Card className="glass-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-semibold">Compliance Checklist</h3>
              </div>
              <div className="space-y-3">
                {checklistLoading ? (
                  <>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </>
                ) : (
                  complianceItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-secondary/30"
                    >
                      <Checkbox
                        id={item.id}
                        checked={item.status === "complete"}
                        onCheckedChange={() => toggleStatus(item.id, item.status)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={item.id}
                          className={`text-sm cursor-pointer ${
                            item.status === "complete"
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                          }`}
                        >
                          {item.item}
                        </label>
                      </div>
                      {item.status === "complete" ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-400" />
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 rounded-lg bg-secondary/50 p-3">
                <p className="text-sm">
                  <span className="font-medium text-emerald-400">{completeCount}/{totalCount}</span>
                  <span className="text-muted-foreground"> items complete</span>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
