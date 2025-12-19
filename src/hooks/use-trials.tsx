import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/use-notifications";
import { defaultTrials } from "@/data/default-data";

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
  const [trialsData, setTrialsData] = useState<TrialsData>({ trials: defaultTrials });
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const fetchTrials = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: responseData, error } = await supabase.functions.invoke('fetch-trials', {});

      if (error) throw error;

      // Merge new trials with existing, avoiding duplicates
      const existingIds = new Set(trialsData.trials.map(t => t.id));
      const newTrials = responseData.trials?.filter((t: Trial) => !existingIds.has(t.id)) || [];
      
      if (newTrials.length > 0) {
        setTrialsData((prev) => ({ trials: [...prev.trials, ...newTrials] }));
        
        // Push real-time notification for new trials
        addNotification({
          type: "trial",
          title: "New Clinical Trials Detected",
          description: `${newTrials.length} new trials added to your monitoring list`,
          agent: "Clinical",
        });
      }
      
      toast({
        title: "Trials Updated",
        description: `Added ${newTrials.length} new clinical trials`,
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
  }, [toast, addNotification, trialsData.trials]);

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
