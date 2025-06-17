import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner"; // Renamed to avoid conflict
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import TradingPage from "./pages/TradingPage";
import MarketsPage from "./pages/MarketsPage";
import WalletPage from "./pages/WalletPage";
import AccountPage from "./pages/AccountPage";
import NotFound from "./pages/NotFound"; // Assumed to exist

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner /> {/* Ensure this is the shadcn/ui Sonner component */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} /> {/* Default to dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/trading" element={<TradingPage />} /> 
          {/* Consider /trading/:pairId for specific pairs in future */}
          <Route path="/markets" element={<MarketsPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/account" element={<AccountPage />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;