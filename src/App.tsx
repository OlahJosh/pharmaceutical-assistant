import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { NotificationsProvider } from "@/hooks/use-notifications";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Research from "./pages/Research";
import Trials from "./pages/Trials";
import Regulatory from "./pages/Regulatory";
import Insights from "./pages/Insights";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <NotificationsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/research" element={<Research />} />
              <Route path="/trials" element={<Trials />} />
              <Route path="/regulatory" element={<Regulatory />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationsProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
