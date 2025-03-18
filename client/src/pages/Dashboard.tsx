import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { HealthMetric, User, Article } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import MetricCard from "@/components/metrics/MetricCard";
import MealPlan from "@/components/diet/MealPlan";
import WorkoutPlan from "@/components/workout/WorkoutPlan";
import ArticleCard from "@/components/education/ArticleCard";
import WeightChart from "@/components/charts/WeightChart";
import WorkoutConsistencyChart from "@/components/charts/WorkoutConsistencyChart";
import { 
  Weight, 
  Calculator, 
  Flame, 
  Droplets,
  ChevronRight
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function Dashboard() {
  const { toast } = useToast();
  const [articleDialog, setArticleDialog] = useState<{ open: boolean, article: Article | null }>({
    open: false,
    article: null
  });
  
  // For demo purposes using a static user ID
  // In a real app, this would come from authentication
  const userId = 1;
  
  // Fetch user data
  const { data: user } = useQuery<User>({ 
    queryKey: [`/api/users/${userId}`],
  });
  
  // Fetch latest health metrics
  const { data: latestMetric } = useQuery<HealthMetric>({ 
    queryKey: [`/api/health-metrics/latest/${userId}`],
  });
  
  // Fetch educational articles
  const { data: articles } = useQuery<Article[]>({ 
    queryKey: ['/api/articles'],
  });
  
  // Handle check-in button click
  const handleCheckIn = () => {
    toast({
      title: "Daily Check-in",
      description: "Track your progress by recording your current metrics.",
    });
    
    // In a real application, this would open a form to input today's metrics
  };
  
  // Handle article read more
  const handleReadArticle = (articleId: number) => {
    if (articles) {
      const article = articles.find(a => a.id === articleId);
      if (article) {
        setArticleDialog({
          open: true,
          article
        });
      }
    }
  };
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark">
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          <p className="text-gray-500 mt-1">Here's a summary of your fitness journey</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            className="bg-accent hover:bg-accent/90 text-white"
            onClick={handleCheckIn}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
            Check In Today
          </Button>
        </div>
      </div>

      {/* Health Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Current Weight"
          value={latestMetric?.weight || 0}
          unit="kg"
          icon={<Weight className="h-5 w-5" />}
          changeValue="2.1kg"
          changeType="decrease"
          changeLabel="from last month"
        />
        
        <MetricCard
          title="BMI"
          value={latestMetric?.bmi || 0}
          icon={<Calculator className="h-5 w-5" />}
          changeValue="Healthy"
          changeType="neutral"
        />
        
        <MetricCard
          title="Daily Calories"
          value={latestMetric?.caloriesConsumed || 0}
          unit="kcal"
          icon={<Flame className="h-5 w-5" />}
          changeValue="450 remaining"
          changeType="neutral"
        />
        
        <MetricCard
          title="Daily Water"
          value={latestMetric?.waterIntake || 0}
          unit="L"
          icon={<Droplets className="h-5 w-5" />}
          changeValue="0.8L below target"
          changeType="warning"
        />
      </div>

      {/* Progress Charts */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-md font-medium mb-3">Weight History</h3>
            <WeightChart userId={userId} />
          </div>
          <div>
            <h3 className="text-md font-medium mb-3">Workout Consistency</h3>
            <WorkoutConsistencyChart userId={userId} />
          </div>
        </div>
      </div>

      {/* Today's Plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <MealPlan userId={userId} />
        <WorkoutPlan userId={userId} />
      </div>
      
      {/* Educational Content */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Learn & Improve</h2>
          <Link href="/education">
            <Button variant="link" className="text-primary hover:text-primary/80 text-sm font-medium">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {articles?.slice(0, 3).map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              onReadMore={handleReadArticle} 
            />
          ))}
          
          {!articles && (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="w-full h-48 bg-gray-200 animate-pulse" />
                <div className="p-5">
                  <div className="w-24 h-6 bg-gray-200 rounded animate-pulse mb-3" />
                  <div className="w-full h-6 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="w-2/3 h-6 bg-gray-200 rounded animate-pulse mb-3" />
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Article Dialog */}
      <Dialog 
        open={articleDialog.open} 
        onOpenChange={(open) => setArticleDialog(prev => ({ ...prev, open }))}
      >
        <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
          {articleDialog.article && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {articleDialog.article.title}
                </DialogTitle>
                <DialogDescription className="text-sm">
                  {articleDialog.article.category} • {articleDialog.article.readTime} min read
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <div 
                  className="w-full h-56 bg-cover bg-center mb-4 rounded-lg"
                  style={{ 
                    backgroundImage: `url(${articleDialog.article.imageUrl || 
                      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=800&q=80'})` 
                  }}
                />
                <div className="prose prose-sm max-w-none">
                  {articleDialog.article.content.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
