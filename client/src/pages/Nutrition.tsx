import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Meal, HealthMetric } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Utensils, Apple, Egg, Fish, Carrot, PieChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Nutrition() {
  const [activeTab, setActiveTab] = useState("meal-plan");
  
  // For demo purposes using a static user ID
  const userId = 1;
  
  // Fetch meal recommendations
  const { data: meals, isLoading: isLoadingMeals } = useQuery<Meal[]>({ 
    queryKey: ['/api/meals/recommendations', userId],
  });
  
  // Fetch latest health metrics for nutrition data
  const { data: latestMetric, isLoading: isLoadingMetrics } = useQuery<HealthMetric>({ 
    queryKey: [`/api/health-metrics/latest/${userId}`],
  });
  
  // Calculate total calories and macronutrients
  const totalCalories = meals?.reduce((sum, meal) => sum + (meal.calories || 0), 0) || 0;
  const dailyTarget = latestMetric?.caloriesConsumed || 2000;
  const remainingCalories = dailyTarget - totalCalories;
  
  // Example macronutrient data (would come from the API in a real app)
  const macros = {
    protein: { current: 120, target: 150 },
    carbs: { current: 180, target: 225 },
    fat: { current: 55, target: 70 },
  };
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nutrition & Diet</h1>
        <Button>Customize Diet Plan</Button>
      </div>
      
      <Tabs defaultValue="meal-plan" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="meal-plan">Meal Plan</TabsTrigger>
          <TabsTrigger value="nutrition-tracking">Nutrition Tracking</TabsTrigger>
        </TabsList>
        
        <TabsContent value="meal-plan" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Recommended Meals</CardTitle>
                  <CardDescription>
                    Personalized based on your goals and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingMeals ? (
                    <MealPlanSkeleton />
                  ) : meals && meals.length > 0 ? (
                    <div className="space-y-6">
                      {meals.map((meal) => (
                        <div key={meal.id} className="pb-6 border-b last:border-b-0">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <div className="bg-secondary/10 p-3 rounded-lg mr-4">
                                <Utensils className="text-secondary h-6 w-6" />
                              </div>
                              <div>
                                <h3 className="font-medium text-lg">{meal.name}</h3>
                                <p className="text-sm text-gray-500">{meal.time}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-medium text-lg text-secondary">{meal.calories} kcal</span>
                              <div className="flex items-center text-xs text-gray-500 mt-1 justify-end">
                                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                                <span className="mr-2">P: {meal.protein}g</span>
                                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                <span className="mr-2">C: {meal.carbs}g</span>
                                <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                                <span>F: {meal.fat}g</span>
                              </div>
                            </div>
                          </div>
                          <div className="ml-16 mt-3">
                            {meal.description && (
                              <p className="text-sm text-gray-600 mb-3">{meal.description}</p>
                            )}
                            {meal.items && (
                              <ul className="text-sm text-gray-600 space-y-2">
                                {meal.items.map((item, index) => (
                                  <li key={index} className="flex items-center">
                                    <span className="w-4 h-4 bg-secondary/10 rounded-full flex items-center justify-center mr-2">
                                      <span className="w-1 h-1 bg-secondary rounded-full"></span>
                                    </span>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Utensils className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No Meal Plan Available</h3>
                      <p className="text-gray-500 mb-4">Create a personalized meal plan based on your goals.</p>
                      <Button>Create Meal Plan</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Nutrition</CardTitle>
                  <CardDescription>Calorie and macronutrient goals</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingMetrics ? (
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-4 w-1/2 mt-2" />
                      <Skeleton className="h-4 w-full mt-6" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-4 w-full mt-4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-4 w-full mt-4" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Calories</span>
                          <span className="text-sm text-gray-500">
                            {totalCalories} / {dailyTarget} kcal
                          </span>
                        </div>
                        <Progress value={(totalCalories / dailyTarget) * 100} className="h-4" />
                        <div className="mt-2 text-sm text-secondary">
                          {remainingCalories > 0 ? `${remainingCalories} kcal remaining` : 'Daily target reached'}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                              <span className="text-sm font-medium">Protein</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {macros.protein.current} / {macros.protein.target}g
                            </span>
                          </div>
                          <Progress value={(macros.protein.current / macros.protein.target) * 100} className="h-2" indicatorClassName="bg-blue-500" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                              <span className="text-sm font-medium">Carbs</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {macros.carbs.current} / {macros.carbs.target}g
                            </span>
                          </div>
                          <Progress value={(macros.carbs.current / macros.carbs.target) * 100} className="h-2" indicatorClassName="bg-green-500" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                              <span className="text-sm font-medium">Fat</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {macros.fat.current} / {macros.fat.target}g
                            </span>
                          </div>
                          <Progress value={(macros.fat.current / macros.fat.target) * 100} className="h-2" indicatorClassName="bg-red-500" />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Food Categories</CardTitle>
                  <CardDescription>Recommended distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center bg-blue-50 p-4 rounded-lg">
                      <Egg className="h-8 w-8 text-blue-500 mb-2" />
                      <span className="font-medium">Protein</span>
                      <span className="text-sm text-gray-500">30-35%</span>
                    </div>
                    <div className="flex flex-col items-center bg-green-50 p-4 rounded-lg">
                      <Apple className="h-8 w-8 text-green-500 mb-2" />
                      <span className="font-medium">Fruits</span>
                      <span className="text-sm text-gray-500">20-25%</span>
                    </div>
                    <div className="flex flex-col items-center bg-amber-50 p-4 rounded-lg">
                      <Carrot className="h-8 w-8 text-amber-500 mb-2" />
                      <span className="font-medium">Vegetables</span>
                      <span className="text-sm text-gray-500">30-40%</span>
                    </div>
                    <div className="flex flex-col items-center bg-red-50 p-4 rounded-lg">
                      <Fish className="h-8 w-8 text-red-500 mb-2" />
                      <span className="font-medium">Healthy Fats</span>
                      <span className="text-sm text-gray-500">15-20%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="nutrition-tracking" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Nutrition Tracking</CardTitle>
                  <CardDescription>Track your daily food intake</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Start Tracking Your Nutrition</h3>
                    <p className="text-gray-500 mb-4">Log your meals and track your macronutrients.</p>
                    <Button>Log Food Intake</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Tips</CardTitle>
                <CardDescription>Helpful suggestions for your diet</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex">
                    <span className="bg-primary/10 text-primary p-2 rounded mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <div>
                      <h4 className="font-medium">Stay Hydrated</h4>
                      <p className="text-sm text-gray-600">Aim for 2-3 liters of water daily to support metabolism and overall health.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="bg-primary/10 text-primary p-2 rounded mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <div>
                      <h4 className="font-medium">Meal Timing</h4>
                      <p className="text-sm text-gray-600">Eat regularly throughout the day to maintain energy levels and control hunger.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="bg-primary/10 text-primary p-2 rounded mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <div>
                      <h4 className="font-medium">Protein Intake</h4>
                      <p className="text-sm text-gray-600">Include protein with each meal to support muscle recovery and growth.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="bg-primary/10 text-primary p-2 rounded mr-3 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <div>
                      <h4 className="font-medium">Fiber Focus</h4>
                      <p className="text-sm text-gray-600">Include high-fiber foods to improve digestion and feel fuller longer.</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MealPlanSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="pb-6 border-b last:border-b-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Skeleton className="h-12 w-12 rounded-lg mr-4" />
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton className="h-6 w-20 ml-auto mb-1" />
              <Skeleton className="h-4 w-32 ml-auto" />
            </div>
          </div>
          <div className="ml-16 mt-3">
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
