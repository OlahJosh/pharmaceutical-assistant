import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
  created_at?: string;
}

export interface Attachment {
  type: "image" | "file";
  name: string;
  url: string;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/regulatory-chat`;

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { toast } = useToast();

  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching conversations:", error);
      return;
    }

    setConversations(data || []);
  }, []);

  // Load messages for a conversation
  const loadConversation = useCallback(async (conversationId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error loading messages:", error);
      return;
    }

    const formattedMessages: Message[] = (data || []).map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      content: msg.content,
      attachments: (msg.attachments as unknown as Attachment[]) || [],
      created_at: msg.created_at,
    }));

    setMessages(formattedMessages);
    setCurrentConversationId(conversationId);
  }, []);

  // Create new conversation
  const createConversation = useCallback(async (title?: string): Promise<string | null> => {
    const { data, error } = await supabase
      .from("conversations")
      .insert({ title: title || "New Conversation" })
      .select()
      .single();

    if (error) {
      console.error("Error creating conversation:", error);
      toast({
        title: "Error",
        description: "Failed to create conversation",
        variant: "destructive",
      });
      return null;
    }

    setCurrentConversationId(data.id);
    setMessages([]);
    await fetchConversations();
    return data.id;
  }, [fetchConversations, toast]);

  // Start new chat
  const startNewChat = useCallback(() => {
    setCurrentConversationId(null);
    setMessages([]);
  }, []);

  // Delete conversation
  const deleteConversation = useCallback(async (conversationId: string) => {
    const { error } = await supabase
      .from("conversations")
      .delete()
      .eq("id", conversationId);

    if (error) {
      console.error("Error deleting conversation:", error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      });
      return;
    }

    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
      setMessages([]);
    }
    
    await fetchConversations();
    toast({
      title: "Deleted",
      description: "Conversation deleted",
    });
  }, [currentConversationId, fetchConversations, toast]);

  // Clear all history
  const clearAllHistory = useCallback(async () => {
    const { error } = await supabase
      .from("conversations")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

    if (error) {
      console.error("Error clearing history:", error);
      toast({
        title: "Error",
        description: "Failed to clear history",
        variant: "destructive",
      });
      return;
    }

    setConversations([]);
    setCurrentConversationId(null);
    setMessages([]);
    toast({
      title: "Cleared",
      description: "All chat history cleared",
    });
  }, [toast]);

  // Save message to database
  const saveMessage = useCallback(async (
    conversationId: string,
    role: "user" | "assistant",
    content: string,
    attachments: Attachment[] = []
  ) => {
    const { error } = await supabase
      .from("messages")
      .insert([{
        conversation_id: conversationId,
        role,
        content,
        attachments: attachments as unknown as any,
      }]);

    if (error) {
      console.error("Error saving message:", error);
    }
  }, []);

  // Update conversation title based on first message
  const updateConversationTitle = useCallback(async (conversationId: string, firstMessage: string) => {
    const title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : "");
    await supabase
      .from("conversations")
      .update({ title })
      .eq("id", conversationId);
    
    await fetchConversations();
  }, [fetchConversations]);

  // Send message with streaming
  const sendMessage = useCallback(async (content: string, attachments: Attachment[] = []) => {
    if (!content.trim() && attachments.length === 0) return;

    // Create conversation if needed
    let convId = currentConversationId;
    if (!convId) {
      convId = await createConversation();
      if (!convId) return;
    }

    // Add user message
    const userMessage: Message = { role: "user", content, attachments };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Save user message
    await saveMessage(convId, "user", content, attachments);

    // Update title if first message
    if (messages.length === 0) {
      await updateConversationTitle(convId, content);
    }

    // Prepare messages for API
    const apiMessages = [...messages, userMessage].map((msg) => ({
      role: msg.role,
      content: msg.content,
      attachments: msg.attachments,
    }));

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantContent = "";

      // Add empty assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return updated;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Save assistant message
      await saveMessage(convId, "assistant", assistantContent);
      await fetchConversations();
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
      // Remove the empty assistant message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId, createConversation, messages, saveMessage, updateConversationTitle, fetchConversations, toast]);

  return {
    messages,
    isLoading,
    sendMessage,
    conversations,
    currentConversationId,
    fetchConversations,
    loadConversation,
    createConversation,
    startNewChat,
    deleteConversation,
    clearAllHistory,
  };
}
