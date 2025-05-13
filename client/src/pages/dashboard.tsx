import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { StatCard } from "@/components/dashboard/stat-card";
import { WeightChart } from "@/components/dashboard/chart";
import { MealCard } from "@/components/dashboard/meal-card";
import { WorkoutCard, UpcomingWorkoutCard } from "@/components/dashboard/workout-card";
import { ArticleCard } from "@/components/dashboard/article-card";
import { formatDate, formatTime, formatChangeNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { toast } = useToast();

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ['/api/users/1'],
    staleTime: Infinity, // Demo user data won't change
  });

  // Fetch latest health metric
  const { data: healthMetric, isLoading: loadingMetrics } = useQuery({
    queryKey: ['/api/users/1/health-metrics/latest'],
  });

  // Fetch diet plan
  const { data: dietPlan, isLoading: loadingDiet } = useQuery({
    queryKey: ['/api/users/1/diet-plans/current'],
  });

  // Fetch current workout
  const { data: workout, isLoading: loadingWorkout } = useQuery({
    queryKey: ['/api/users/1/workouts/current'],
  });

  // Fetch upcoming workouts
  const { data: upcomingWorkouts, isLoading: loadingUpcoming } = useQuery({
    queryKey: ['/api/users/1/workouts/upcoming'],
  });

  // Fetch articles
  const { data: articles, isLoading: loadingArticles } = useQuery({
    queryKey: ['/api/articles'],
  });

  // Fetch user's goals
  const { data: goals, isLoading: loadingGoals } = useQuery({
    queryKey: ['/api/users/1/goals'],
  });

  // Calculate progress for the first goal
  const mainGoal = goals && goals.length > 0 ? goals[0] : null;
  const goalProgress = mainGoal ? 
    Math.round(((mainGoal.currentValue - mainGoal.startDate) / (mainGoal.targetValue - mainGoal.startDate)) * 100) : 0;

  // Mock weight data for the chart
  const weightData = [
    { day: "Mon", value: 72 },
    { day: "Tue", value: 71.5 },
    { day: "Wed", value: 70.5 },
    { day: "Thu", value: 69.5 },
    { day: "Fri", value: 69 },
    { day: "Sat", value: 68.5 },
    { day: "Sun", value: 68 }
  ];

  const handleStartWorkout = () => {
    toast({
      title: "Starting workout",
      description: `${workout?.name} workout has started. Good luck!`,
    });
  };

  const handleArticleRead = (id: number) => {
    toast({
      title: "Opening article",
      description: "This would open the full article view.",
    });
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-4 md:p-8">
      <div className="md:hidden">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      </div>
      <div className="hidden md:block">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              <span className="material-icons text-sm mr-1">calendar_today</span>
              Last 7 days
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Link href="/metrics">
                <Button variant="outline" className="w-full h-full flex flex-col items-center justify-center p-4 border border-gray-200">
                  <span className="material-icons text-primary text-2xl mb-2">monitoring</span>
                  <span className="text-sm">Update Metrics</span>
                </Button>
              </Link>
              <Link href="/goals">
                <Button variant="outline" className="w-full h-full flex flex-col items-center justify-center p-4 border border-gray-200">
                  <span className="material-icons text-primary text-2xl mb-2">flag</span>
                  <span className="text-sm">Set New Goal</span>
                </Button>
              </Link>
              <Link href="/diet">
                <Button variant="outline" className="w-full h-full flex flex-col items-center justify-center p-4 border border-gray-200">
                  <span className="material-icons text-primary text-2xl mb-2">restaurant</span>
                  <span className="text-sm">View Diet Plan</span>
                </Button>
              </Link>
              <Link href="/workouts">
                <Button variant="outline" className="w-full h-full flex flex-col items-center justify-center p-4 border border-gray-200">
                  <span className="material-icons text-primary text-2xl mb-2">fitness_center</span>
                  <span className="text-sm">Start Workout</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Section */}
      <div className="mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                {getGreeting()}, {user?.name || "User"}!
              </h3>
              <p className="text-gray-600">Here's a summary of your health progress</p>
            </div>
            <div className="hidden md:block">
              {mainGoal && (
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <h4 className="font-medium">{mainGoal.name}</h4>
                    <p className="text-sm text-gray-500">
                      Current: {mainGoal.currentValue}, Target: {mainGoal.targetValue}
                    </p>
                  </div>
                  <ProgressCircle 
                    percentage={Math.min(100, Math.max(0, goalProgress))} 
                    size={80} 
                    strokeWidth={8}
                  >
                    <div className="text-center">
                      <span className="text-lg font-bold">{goalProgress}%</span>
                    </div>
                  </ProgressCircle>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Health Metrics Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 max-h-96 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Health Metrics</h3>
            <Link href="/health-metrics">
              <button className="text-primary text-sm font-medium flex items-center">
                Update Metrics
                <span className="material-icons text-sm ml-1">arrow_forward</span>
              </button>
            </Link>
          </div>
        
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="flex space-x-3 items-center p-2 bg-gray-50 rounded-lg">
              <span className="material-icons text-primary p-2 bg-primary/10 rounded-full">monitor_weight</span>
              <div>
                <p className="text-xs text-gray-500">Weight</p>
                <p className="text-lg font-semibold">{healthMetric?.weight || 0} kg</p>
                {healthMetric?.weightChange && (
                  <div className="flex items-center text-xs">
                    <span className={`flex items-center ${healthMetric.weightChange < 0 ? "text-green-600" : "text-red-600"}`}>
                      <span className="material-icons text-xs">
                        {healthMetric.weightChange < 0 ? "arrow_drop_down" : "arrow_drop_up"}
                      </span>
                      {formatChangeNumber(healthMetric.weightChange)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3 items-center p-2 bg-gray-50 rounded-lg">
              <span className="material-icons text-primary p-2 bg-primary/10 rounded-full">insights</span>
              <div>
                <p className="text-xs text-gray-500">BMI</p>
                <p className="text-lg font-semibold">{healthMetric?.bmi || 0}</p>
                {healthMetric?.bmiChange && (
                  <div className="flex items-center text-xs">
                    <span className={`flex items-center ${healthMetric.bmiChange < 0 ? "text-green-600" : "text-red-600"}`}>
                      <span className="material-icons text-xs">
                        {healthMetric.bmiChange < 0 ? "arrow_drop_down" : "arrow_drop_up"}
                      </span>
                      {formatChangeNumber(healthMetric.bmiChange)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3 items-center p-2 bg-gray-50 rounded-lg">
              <span className="material-icons text-primary p-2 bg-primary/10 rounded-full">directions_run</span>
              <div>
                <p className="text-xs text-gray-500">Active Minutes</p>
                <p className="text-lg font-semibold">{healthMetric?.activeMinutes || 0} min</p>
                <div className="flex items-center text-xs">
                  <span className="flex items-center text-green-600">
                    <span className="material-icons text-xs">arrow_drop_up</span>
                    10%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 items-center p-2 bg-gray-50 rounded-lg">
              <span className="material-icons text-primary p-2 bg-primary/10 rounded-full">local_fire_department</span>
              <div>
                <p className="text-xs text-gray-500">Daily Calories</p>
                <p className="text-lg font-semibold">{healthMetric?.dailyCalories || 0}</p>
                <div className="flex items-center text-xs">
                  <span className="flex items-center text-green-600">
                    <span className="material-icons text-xs">arrow_drop_down</span>
                    5%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        {/* Weight Progress Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Weight Progress</h3>
            <Link href="/health-metrics">
              <button className="text-primary text-sm font-medium flex items-center">
                View History
                <span className="material-icons text-sm ml-1">arrow_forward</span>
              </button>
            </Link>
          </div>
          <div className="h-40">
            <WeightChart data={weightData} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Diet Plan Section */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Today's Diet Plan</h3>
              <Link href="/diet">
                <button className="text-primary text-sm font-medium flex items-center">
                  View Full Plan
                  <span className="material-icons text-sm ml-1">arrow_forward</span>
                </button>
              </Link>
            </div>

            {loadingDiet ? (
              <div className="py-10 text-center">
                <span className="material-icons animate-spin text-gray-400">refresh</span>
                <p className="text-sm text-gray-500 mt-2">Loading meal plan...</p>
              </div>
            ) : dietPlan?.meals && dietPlan.meals.length > 0 ? (
              <div className="space-y-4">
                {dietPlan.meals.slice(0, 3).map((meal: any) => (
                  <MealCard
                    key={meal.id}
                    name={meal.name}
                    description={meal.description}
                    time={formatTime(meal.time)}
                    calories={meal.calories}
                    icon={meal.type === 'breakfast' ? 'free_breakfast' : 
                          meal.type === 'lunch' ? 'lunch_dining' : 
                          meal.type === 'dinner' ? 'dinner_dining' : 'restaurant'}
                  />
                ))}
              </div>
            ) : (
              <div className="py-10 text-center border border-dashed border-gray-200 rounded-lg">
                <span className="material-icons text-gray-400 mb-2">restaurant</span>
                <p className="text-gray-500">No meals found</p>
                <Link href="/diet">
                  <button className="mt-2 text-primary text-sm">Create Diet Plan</button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Workout Section */}
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6 h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Today's Workout</h3>
              <Link href="/workouts">
                <button className="text-primary text-sm font-medium flex items-center">
                  View All
                  <span className="material-icons text-sm ml-1">arrow_forward</span>
                </button>
              </Link>
            </div>

            {loadingWorkout ? (
              <div className="py-10 text-center">
                <span className="material-icons animate-spin text-gray-400">refresh</span>
                <p className="text-sm text-gray-500 mt-2">Loading workout...</p>
              </div>
            ) : workout ? (
              <div className="space-y-4">
                <WorkoutCard
                  title={workout.name}
                  duration={workout.duration}
                  exercises={workout.exercises || []}
                  buttonText="Start Workout"
                  onButtonClick={handleStartWorkout}
                />
                
                {upcomingWorkouts && upcomingWorkouts.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-500 mt-6 mb-3">Coming up next</h4>
                    <UpcomingWorkoutCard
                      title={upcomingWorkouts[0].name}
                      date={formatDate(upcomingWorkouts[0].date)}
                      time={formatTime(upcomingWorkouts[0].time)}
                      duration={upcomingWorkouts[0].duration}
                      icon="fitness_center"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="py-10 text-center border border-dashed border-gray-200 rounded-lg">
                <span className="material-icons text-gray-400 mb-2">fitness_center</span>
                <p className="text-gray-500">No workout scheduled</p>
                <Link href="/workouts">
                  <button className="mt-2 text-primary text-sm">Create Workout</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Featured Articles</h3>
          <Link href="/learn">
            <button className="text-primary text-sm font-medium flex items-center">
              View All
              <span className="material-icons text-sm ml-1">arrow_forward</span>
            </button>
          </Link>
        </div>
        
        {loadingArticles ? (
          <div className="py-10 text-center">
            <span className="material-icons animate-spin text-gray-400">refresh</span>
            <p className="text-sm text-gray-500 mt-2">Loading articles...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles && articles.slice(0, 3).map((article: any) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                imageUrl={article.imageUrl}
                category={article.category}
                title={article.title}
                summary={article.summary}
                readTime={article.readTime}
                onReadClick={() => handleArticleRead(article.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
