import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { StatCard } from "@/components/dashboard/stat-card";
import { WeightChart } from "@/components/dashboard/chart";
import { MealCard } from "@/components/dashboard/meal-card";
import { WorkoutCard, UpcomingWorkoutCard } from "@/components/dashboard/workout-card";
import { ArticleCard } from "@/components/dashboard/article-card";
import { formatDate, formatTime } from "@/lib/utils";

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
    { day: "Mon", value: 60 },
    { day: "Tue", value: 70 },
    { day: "Wed", value: 75 },
    { day: "Thu", value: 68 },
    { day: "Fri", value: 65 },
    { day: "Sat", value: 60 },
    { day: "Sun", value: 55 }
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

      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold mb-1">
              {getGreeting()}, {user?.name || "User"}!
            </h3>
            <p className="text-gray-600 mb-4">Here's a summary of your health progress</p>
            <div className="flex mt-4 space-x-3">
              <Link href="/metrics">
                <button className="bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-600 transition-colors">
                  Track Today
                </button>
              </Link>
              <Link href="/goals">
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition-colors">
                  View Reports
                </button>
              </Link>
            </div>
          </div>
          {/* Progress Circle */}
          <ProgressCircle percentage={goalProgress || 70} fgColor="#4F46E5">
            <span className="text-2xl font-bold text-primary">{goalProgress || 70}%</span>
            <span className="text-xs text-gray-500">of goal</span>
          </ProgressCircle>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Current Weight"
          value={`${healthMetric?.weight || 68} kg`}
          icon="monitor_weight"
          change={-2}
          changeText="from last month"
          status="success"
        />
        <StatCard
          title="BMI"
          value={healthMetric?.bmi || "22.6"}
          icon="straighten"
          changeText="Normal healthy range"
          status="success"
        />
        <StatCard
          title="Daily Calories"
          value={healthMetric?.calories || 1850}
          icon="local_fire_department"
          change={-120}
          changeText="from target"
          status="success"
        />
        <StatCard
          title="Active Minutes"
          value={`${healthMetric?.activeMinutes || 38} min`}
          icon="timer"
          change={-22}
          changeText="to target"
          status="danger"
          changeDirection="down"
        />
      </div>

      {/* Weight Progress Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Weight Progress</h3>
          <div className="text-sm text-gray-500">
            <Link href="/metrics">
              <button className="text-primary font-medium">View All</button>
            </Link>
          </div>
        </div>
        <WeightChart data={weightData} />
      </div>

      {/* Two Column Section for Diet and Workouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Diet Recommendation */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Today's Diet Plan</h3>
            <Link href="/diet">
              <button className="text-primary text-sm font-medium">View All</button>
            </Link>
          </div>

          {loadingDiet ? (
            <div className="py-10 text-center">
              <span className="material-icons animate-spin text-gray-400">refresh</span>
              <p className="text-sm text-gray-500 mt-2">Loading your meal plan...</p>
            </div>
          ) : dietPlan?.meals && dietPlan.meals.length > 0 ? (
            dietPlan.meals.map((meal: any) => (
              <MealCard
                key={meal.id}
                name={meal.name}
                description={meal.description}
                time={meal.mealTime}
                calories={meal.calories}
                icon={meal.icon}
              />
            ))
          ) : (
            <div className="py-6 text-center border border-dashed border-gray-200 rounded-lg">
              <span className="material-icons text-gray-400 mb-2">restaurant</span>
              <p className="text-gray-500">No meal plan available</p>
            </div>
          )}

          <div className="mt-4">
            <Link href="/diet">
              <button className="w-full bg-primary text-white py-2 rounded-md font-medium hover:bg-indigo-600 transition-colors">
                Update Diet Preferences
              </button>
            </Link>
          </div>
        </div>

        {/* Workout Recommendation */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Today's Workout</h3>
            <Link href="/workouts">
              <button className="text-primary text-sm font-medium">View All</button>
            </Link>
          </div>

          {loadingWorkout ? (
            <div className="py-10 text-center">
              <span className="material-icons animate-spin text-gray-400">refresh</span>
              <p className="text-sm text-gray-500 mt-2">Loading your workout...</p>
            </div>
          ) : workout ? (
            <WorkoutCard
              title={workout.name}
              duration={workout.duration}
              exercises={workout.exercises || []}
              buttonText="Start Workout"
              onButtonClick={handleStartWorkout}
            />
          ) : (
            <div className="py-6 text-center border border-dashed border-gray-200 rounded-lg mb-4">
              <span className="material-icons text-gray-400 mb-2">fitness_center</span>
              <p className="text-gray-500">No workout scheduled for today</p>
            </div>
          )}

          <div className="border-t border-gray-100 pt-4 mb-4">
            <h4 className="font-medium mb-3">Upcoming Workouts</h4>
            {loadingUpcoming ? (
              <div className="py-4 text-center">
                <span className="material-icons animate-spin text-gray-400">refresh</span>
              </div>
            ) : upcomingWorkouts && upcomingWorkouts.length > 0 ? (
              upcomingWorkouts.slice(0, 2).map((workout: any) => (
                <UpcomingWorkoutCard
                  key={workout.id}
                  icon={workout.icon}
                  title={workout.name}
                  date={workout.scheduledDate ? formatDate(workout.scheduledDate) : "Unscheduled"}
                  time={workout.scheduledTime ? formatTime(workout.scheduledTime) : "Any time"}
                  duration={workout.duration}
                />
              ))
            ) : (
              <div className="py-2 text-center">
                <p className="text-sm text-gray-500">No upcoming workouts</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Health Articles Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recommended Articles</h3>
          <Link href="/learn">
            <button className="text-primary text-sm font-medium">View All</button>
          </Link>
        </div>
        {loadingArticles ? (
          <div className="py-10 text-center">
            <span className="material-icons animate-spin text-gray-400">refresh</span>
            <p className="text-sm text-gray-500 mt-2">Loading articles...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles?.slice(0, 3).map((article: any) => (
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

      {/* About App Section - Brief version on dashboard */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0 md:mr-8">
            <h3 className="text-lg font-semibold mb-2">About FitTrack</h3>
            <p className="text-gray-600 text-sm mb-3">
              FitTrack is your personal health companion designed to help you achieve your fitness
              goals through personalized diet plans, workout routines, and health tracking.
            </p>
            <Link href="/about">
              <button className="text-primary text-sm font-medium">Learn more about us</button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="bg-indigo-50 rounded-lg p-3 text-center min-w-[100px]">
              <p className="text-2xl font-bold text-primary">15k+</p>
              <p className="text-xs text-gray-600">Active Users</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-3 text-center min-w-[100px]">
              <p className="text-2xl font-bold text-primary">500+</p>
              <p className="text-xs text-gray-600">Workout Plans</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-3 text-center min-w-[100px]">
              <p className="text-2xl font-bold text-primary">1000+</p>
              <p className="text-xs text-gray-600">Diet Plans</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
