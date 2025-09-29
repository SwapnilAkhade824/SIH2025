import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { WelcomeScreen } from "./components/WelcomeScreen";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import Create from "./pages/Create";
import Games from "./pages/Games";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle redirect on refresh
const RouteHandler = () => {
  const location = useLocation();

  useEffect(() => {
    // Mark that we've navigated to this page
    sessionStorage.setItem('hasNavigated', 'true');
  }, [location.pathname]);

  useEffect(() => {
    // Check if this is a fresh page load (not a navigation)
    const hasNavigated = sessionStorage.getItem('hasNavigated');
    
    if (!hasNavigated && location.pathname !== '/') {
      // This is a fresh page load on a non-home route, redirect to home
      window.location.replace('/');
      return;
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/analyze" element={<Analyze />} />
      <Route path="/create" element={<Create />} />
      <Route path="/games" element={<Games />} />
      <Route path="/community" element={<Community />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  if (showWelcome) {
    return <WelcomeScreen onComplete={() => setShowWelcome(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <RouteHandler />
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
