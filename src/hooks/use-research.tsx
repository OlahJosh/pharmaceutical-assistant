import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  date: string;
  citations: number;
  abstract: string;
  keywords: string[];
  trending: boolean;
  link: string;
}

interface TrendingKeyword {
  keyword: string;
  count: number;
  change: string;
}

interface ResearchData {
  papers: ResearchPaper[];
  trendingKeywords: TrendingKeyword[];
  insights: string[];
}

export function useResearch() {
  const [data, setData] = useState<ResearchData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchResearch = useCallback(async (query?: string) => {
    setIsLoading(true);
    try {
      const { data: responseData, error } = await supabase.functions.invoke('fetch-research', {
        body: { query }
      });

      if (error) throw error;

      setData(responseData);
      toast({
        title: "Research Updated",
        description: `Loaded ${responseData.papers?.length || 0} papers from AI intelligence`,
      });
    } catch (error) {
      console.error("Error fetching research:", error);
      toast({
        title: "Error",
        description: "Failed to fetch research data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return { data, isLoading, fetchResearch };
}
