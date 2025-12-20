import { Link } from "react-router-dom";
import { ArrowRight, Brain, Search, FileText, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroAnimation from "@/components/landing/HeroAnimation";

const agents = [
  {
    icon: <Brain className="h-6 w-6" />,
    title: "Orchestrator Agent",
    description: "Coordinates all agent tasks and aggregates outputs into unified insights",
    color: "purple",
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: "Research Intelligence",
    description: "Monitors and summarizes scientific research trends across publications",
    color: "teal",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Clinical Trial Analysis",
    description: "Compares clinical trials by phase, endpoints, and outcome patterns",
    color: "amber",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Regulatory & GMP",
    description: "Surfaces regulatory updates and answers compliance questions",
    color: "rose",
  },
];

const agentColorClasses = {
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
  },
  teal: {
    bg: "bg-primary/10",
    border: "border-primary/30",
    text: "text-primary",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-400",
  },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

        <div className="container relative mx-auto px-4 pb-24 pt-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary fade-in">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Healthcare Intelligence</span>
            </div>

            {/* Headline */}
            <h1 className="mb-6 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl fade-in stagger-1">
              Transform Fragmented Data into{" "}
              <span className="gradient-text">Actionable Insights</span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground fade-in stagger-2">
              PharmaLens unifies research publications, clinical trials, and regulatory guidelines 
              through intelligent AI agents—reducing research time by 70% and accelerating 
              drug development decisions.
            </p>

            {/* CTA */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row fade-in stagger-3">
              <Button asChild size="xl" variant="hero" className="w-full sm:w-auto">
                <Link to="/dashboard">
                  Launch Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="w-full sm:w-auto">
                <a href="#agents">Learn More</a>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 fade-in stagger-4">
              <div className="space-y-1">
                <p className="font-display text-3xl font-bold text-primary">1.5M+</p>
                <p className="text-sm text-muted-foreground">Papers Analyzed Annually</p>
              </div>
              <div className="space-y-1">
                <p className="font-display text-3xl font-bold text-primary">70%</p>
                <p className="text-sm text-muted-foreground">Faster Insights</p>
              </div>
              <div className="space-y-1">
                <p className="font-display text-3xl font-bold text-primary">24/7</p>
                <p className="text-sm text-muted-foreground">Continuous Monitoring</p>
              </div>
            </div>

            {/* Hero Animation */}
            <div className="mt-20 fade-in stagger-5">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="border-y border-border/50 bg-card/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 font-display text-3xl font-bold">The Challenge</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">80%</strong> of pharmaceutical researchers 
                report delays due to fragmented data sources.
              </p>
              <p>
                <strong className="text-foreground">60%</strong> of trial design revisions 
                occur from late discovery of competing trials.
              </p>
              <p>
                <strong className="text-foreground">25%</strong> of drug development delays 
                stem from missed regulatory updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Agents Section */}
      <section id="agents" className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold sm:text-4xl">
              Four AI Agents. One Unified Platform.
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Our multi-agent system continuously monitors, analyzes, and synthesizes 
              healthcare intelligence across the entire drug development lifecycle.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {agents.map((agent, index) => {
              const colors = agentColorClasses[agent.color as keyof typeof agentColorClasses];
              return (
                <div
                  key={agent.title}
                  className={`glass-card group p-6 transition-all duration-300 hover:border-border hover-lift hover-glow animate-fade-in-up stagger-${index + 1}`}
                >
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl border ${colors.bg} ${colors.border} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <span className={colors.text}>{agent.icon}</span>
                  </div>
                  <h3 className="mb-2 font-display text-lg font-semibold">{agent.title}</h3>
                  <p className="text-sm text-muted-foreground">{agent.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50 py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold">
            Ready to accelerate your research?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Join pharmaceutical teams making faster, better-informed decisions 
            with AI-powered intelligence.
          </p>
          <Button asChild size="xl" variant="hero">
            <Link to="/dashboard">
              Explore the Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                <div className="h-4 w-4 rounded-full bg-primary" />
              </div>
              <span className="font-display font-bold">
                Pharma<span className="text-primary">Lens</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 PharmaLens. AI-Powered Healthcare Intelligence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
