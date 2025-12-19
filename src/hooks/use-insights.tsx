import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Insight {
  title: string;
  summary: string;
  impact: "high" | "medium" | "low";
  category: string;
}

interface CrossDomainRecommendation {
  title: string;
  description: string;
  priority: "urgent" | "high" | "medium" | "low";
  domains: string[];
}

interface MarketTrends {
  topTherapeuticAreas: string[];
  emergingTechnologies: string[];
  keyPlayers: string[];
}

interface InsightsData {
  researchInsights: Insight[];
  trialsInsights: Insight[];
  regulatoryInsights: Insight[];
  crossDomainRecommendations: CrossDomainRecommendation[];
  marketTrends: MarketTrends;
  executiveSummary: string;
}

export function useInsights() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchInsights = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: responseData, error } = await supabase.functions.invoke('aggregate-insights', {});

      if (error) throw error;

      setData(responseData);
      toast({
        title: "Insights Generated",
        description: "AI has aggregated insights from all domains",
      });
    } catch (error) {
      console.error("Error fetching insights:", error);
      toast({
        title: "Error",
        description: "Failed to generate insights. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return { data, isLoading, fetchInsights };
}
