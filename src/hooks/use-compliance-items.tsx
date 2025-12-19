import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ComplianceItem {
  id: string;
  item: string;
  status: "pending" | "complete";
  created_at: string;
  updated_at: string;
}

export function useComplianceItems() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["compliance-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("compliance_items")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as ComplianceItem[];
    },
  });

  const toggleStatus = useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string; currentStatus: string }) => {
      const newStatus = currentStatus === "complete" ? "pending" : "complete";
      const { error } = await supabase
        .from("compliance_items")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      return newStatus;
    },
    onSuccess: (newStatus) => {
      queryClient.invalidateQueries({ queryKey: ["compliance-items"] });
      toast({
        title: "Checklist Updated",
        description: `Item marked as ${newStatus}.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update checklist item.",
        variant: "destructive",
      });
    },
  });

  const completeCount = items.filter((item) => item.status === "complete").length;
  const totalCount = items.length;

  return {
    items,
    isLoading,
    toggleStatus: (id: string, currentStatus: string) =>
      toggleStatus.mutate({ id, currentStatus }),
    completeCount,
    totalCount,
  };
}
