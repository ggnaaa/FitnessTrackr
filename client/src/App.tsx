import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Nutrition from "@/pages/Nutrition";
import Workouts from "@/pages/Workouts";
import Progress from "@/pages/Progress";
import Education from "@/pages/Education";
import About from "@/pages/About";
import UserProfile from "@/pages/UserProfile";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

function Router() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 mt-16 mb-16 md:mb-0 overflow-y-auto">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/nutrition" component={Nutrition} />
          <Route path="/workouts" component={Workouts} />
          <Route path="/progress" component={Progress} />
          <Route path="/education" component={Education} />
          <Route path="/about" component={About} />
          <Route path="/profile" component={UserProfile} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
