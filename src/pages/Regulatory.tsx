import { useState } from "react";
import { Shield, Send, AlertCircle, CheckCircle, Clock, FileText, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

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

const complianceChecklist = [
  { id: "1", item: "GMP facility certification current", status: "complete" },
  { id: "2", item: "Annual product quality review submitted", status: "complete" },
  { id: "3", item: "Deviation reports up to date", status: "pending" },
  { id: "4", item: "Training records verified", status: "complete" },
  { id: "5", item: "Supplier qualification audits scheduled", status: "pending" },
  { id: "6", item: "Change control procedures reviewed", status: "complete" },
  { id: "7", item: "Stability testing protocols current", status: "complete" },
  { id: "8", item: "Adverse event reporting compliant", status: "complete" },
];

const sampleQuestions = [
  "What are the key differences between FDA and EMA requirements for CAR-T therapies?",
  "Summarize the latest ICH E6(R3) GCP guideline changes",
  "What documentation is required for a Pre-IND meeting?",
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Regulatory() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your Regulatory & GMP Assistant. Ask me about FDA, EMA, or ICH guidelines, compliance requirements, or any regulatory questions related to drug development.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = query;
    setQuery("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "car-t": `**CAR-T Regulatory Comparison: FDA vs EMA**

**FDA Requirements:**
- BLA submission under 21 CFR Part 600
- CMC section must include detailed manufacturing process
- Chain of identity documentation required
- REMS may be required for certain products

**EMA Requirements:**
- MAA submission with ATMP classification
- Requires CAT (Committee for Advanced Therapies) review
- Hospital exemption rules may apply
- GMP certification from EU-authorized facility

**Key Difference:** EMA's ATMP-specific pathway provides dedicated expertise, while FDA uses standard BLA process with additional guidance documents.`,
        "ich": `**ICH E6(R3) GCP Guidelines Summary**

**Major Changes:**
1. **Risk-Based Approach** - Emphasis on quality-by-design and risk proportionate monitoring
2. **Technology Integration** - Guidelines for electronic systems, eConsent, and decentralized trials
3. **Data Integrity** - Enhanced requirements for electronic data capture and audit trails
4. **Participant-Centric** - Greater focus on participant safety and benefit-risk assessment

**Implementation Timeline:**
- Publication: December 2024
- Industry adaptation: 18-24 months expected
- Full enforcement: Phased approach by region`,
        "pre-ind": `**Pre-IND Meeting Documentation Requirements**

**Required Submissions:**
1. **Meeting Request Letter** - Type B meeting request with specific objectives
2. **Briefing Document** - Comprehensive background package (60 days prior)
3. **Proposed Development Plan** - Clinical and nonclinical strategy

**Briefing Document Sections:**
- Product description and mechanism of action
- Nonclinical pharmacology and toxicology summary
- CMC overview and manufacturing process
- Proposed clinical protocol outline
- Specific questions for FDA feedback

**Timeline:** Submit request 90 days before desired meeting date`,
      };

      let response = "Based on current regulatory guidance, I can provide information on FDA, EMA, and ICH requirements. Could you please specify which aspect of regulatory compliance you'd like me to address?";

      const queryLower = userMessage.toLowerCase();
      if (queryLower.includes("car-t") || queryLower.includes("differences")) {
        response = responses["car-t"];
      } else if (queryLower.includes("ich") || queryLower.includes("gcp") || queryLower.includes("e6")) {
        response = responses["ich"];
      } else if (queryLower.includes("pre-ind") || queryLower.includes("documentation")) {
        response = responses["pre-ind"];
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setQuery(question);
  };

  const handleChecklistToggle = (id: string) => {
    toast({
      title: "Checklist Updated",
      description: "Compliance item status has been saved.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pb-12 pt-24">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Regulatory & Compliance Assistant</h1>
            <p className="text-muted-foreground">
              AI-powered guidance on FDA, EMA, and GMP requirements
            </p>
          </div>
          <Badge className="w-fit agent-badge-regulatory border">
            <Shield className="mr-1.5 h-3.5 w-3.5" />
            Regulatory Agent Active
          </Badge>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="glass-card flex h-[600px] flex-col overflow-hidden">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <div className="mb-2 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-rose-400" />
                            <span className="text-xs font-medium text-rose-400">
                              Regulatory Agent
                            </span>
                          </div>
                        )}
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      </div>
                    </div>
                  ))}
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
                </div>
              </ScrollArea>

              {/* Quick Questions */}
              <div className="border-t border-border/50 p-3">
                <div className="mb-2 flex flex-wrap gap-2">
                  {sampleQuestions.map((q, i) => (
                    <Button
                      key={i}
                      variant="secondary"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleQuickQuestion(q)}
                    >
                      {q.slice(0, 40)}...
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="border-t border-border/50 p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about regulatory requirements, GMP guidelines, or compliance..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Updates */}
            <Card className="glass-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-rose-400" />
                <h3 className="font-display text-lg font-semibold">Recent Updates</h3>
              </div>
              <div className="space-y-3">
                {regulatoryUpdates.map((update) => (
                  <div
                    key={update.id}
                    className="rounded-lg border border-border/50 p-3 transition-colors hover:bg-secondary/30"
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
                ))}
              </div>
            </Card>

            {/* Compliance Checklist */}
            <Card className="glass-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-semibold">Compliance Checklist</h3>
              </div>
              <div className="space-y-3">
                {complianceChecklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-secondary/30"
                  >
                    <Checkbox
                      id={item.id}
                      checked={item.status === "complete"}
                      onCheckedChange={() => handleChecklistToggle(item.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={item.id}
                        className={`text-sm ${
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
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-secondary/50 p-3">
                <p className="text-sm">
                  <span className="font-medium text-emerald-400">6/8</span>
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
