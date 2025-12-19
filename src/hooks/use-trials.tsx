import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Trial {
  id: string;
  title: string;
  sponsor: string;
  phase: string;
  status: string;
  indication: string;
  primaryEndpoint: string;
  secondaryEndpoints: string[];
  enrollment: number;
  startDate: string;
  completionDate: string;
}

interface TrialsData {
  trials: Trial[];
}

interface ComparisonInsight {
  title: string;
  content: string;
  type: string;
}

interface ComparisonData {
  insights: ComparisonInsight[];
  recommendation: string;
  riskScore: string;
  competitiveAnalysis: string;
}

export function useTrials() {
  const [trialsData, setTrialsData] = useState<TrialsData | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const { toast } = useToast();

  const fetchTrials = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: responseData, error } = await supabase.functions.invoke('fetch-trials', {});

      if (error) throw error;

      setTrialsData(responseData);
      toast({
        title: "Trials Updated",
        description: `Loaded ${responseData.trials?.length || 0} clinical trials`,
      });
    } catch (error) {
      console.error("Error fetching trials:", error);
      toast({
        title: "Error",
        description: "Failed to fetch trials data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const compareTrials = useCallback(async (trials: Trial[]) => {
    if (trials.length < 2) return;
    
    setIsComparing(true);
    setComparisonData(null);
    
    try {
      const { data: responseData, error } = await supabase.functions.invoke('compare-trials', {
        body: { trials }
      });

      if (error) throw error;

      setComparisonData(responseData);
      toast({
        title: "AI Analysis Complete",
        description: "Generated comparison insights for selected trials",
      });
    } catch (error) {
      console.error("Error comparing trials:", error);
      toast({
        title: "Error",
        description: "Failed to generate comparison. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsComparing(false);
    }
  }, [toast]);

  return { trialsData, comparisonData, isLoading, isComparing, fetchTrials, compareTrials };
}
