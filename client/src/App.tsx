import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useState, useEffect } from "react";
import { apiRequest } from "./lib/queryClient";

// Layout components
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import Header from "@/components/layout/header";

// Pages
import Dashboard from "@/pages/dashboard";
import HealthMetrics from "@/pages/health-metrics";
import DietPlan from "@/pages/diet-plan";
import Workouts from "@/pages/workouts";
import Learn from "@/pages/learn";
import Goals from "@/pages/goals";
import Settings from "@/pages/settings";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/metrics" component={HealthMetrics} />
      <Route path="/diet" component={DietPlan} />
      <Route path="/workouts" component={Workouts} />
      <Route path="/learn" component={Learn} />
      <Route path="/goals" component={Goals} />
      <Route path="/settings" component={Settings} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Setup the demo account on first load
    const setupDemo = async () => {
      try {
        await apiRequest('POST', '/api/setup-demo');
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to set up demo account:', err);
        setError('Failed to set up the demo account. Please try refreshing the page.');
        setIsLoading(false);
      }
    };

    setupDemo();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-2">Setting up FitTrack...</h2>
          <p className="text-gray-500">Creating demo account and sample data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-4">
          <h2 className="text-xl font-medium text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <Router />
          </main>
        </div>
        <MobileNav />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
