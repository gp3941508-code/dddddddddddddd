import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Campaigns from "./pages/Campaigns";
import Billing from "./pages/Billing";
import Admin from "./pages/Admin";
import AdminAds from "./pages/AdminAds";
import AdminCreateAd from "./pages/AdminCreateAd";
import AdminBillingEdit from "./pages/AdminBillingEdit";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminLoginSessions from "./pages/AdminLoginSessions";
import AdminSettings from "./pages/AdminSettings";
import AdminCampaignMetrics from "./pages/AdminCampaignMetrics";
import Insights from "./pages/Insights";
import Content from "./pages/Content";
import NotFound from "./pages/NotFound";

import BannedOverlay from "./components/BannedOverlay";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BannedOverlay />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/ads" element={<AdminAds />} />
          <Route path="/admin/ads/create" element={<AdminCreateAd />} />
          <Route path="/admin/billing" element={<AdminBillingEdit />} />
          <Route path="/admin/sessions" element={<AdminLoginSessions />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/metrics" element={<AdminCampaignMetrics />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/content" element={<Content />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
