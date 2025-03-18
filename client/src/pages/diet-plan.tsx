import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MealCard } from "@/components/dashboard/meal-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function DietPlan() {
  const { toast } = useToast();
  
  // State for new meal form
  const [mealName, setMealName] = useState("");
  const [mealDescription, setMealDescription] = useState("");
  const [mealTime, setMealTime] = useState("");
  const [mealCalories, setMealCalories] = useState("");
  const [mealIcon, setMealIcon] = useState("restaurant");
  const [showMealForm, setShowMealForm] = useState(false);

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ['/api/users/1'],
  });

  // Fetch current diet plan
  const { data: dietPlan, isLoading } = useQuery({
    queryKey: ['/api/users/1/diet-plans/current'],
  });

  // Fetch user's latest health metrics to get recommendations
  const { data: recommendations } = useQuery({
    queryKey: ['/api/users/1/recommendations'],
  });

  // Add meal mutation
  const addMealMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/meals', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/1/diet-plans/current'] });
      toast({
        title: "Meal added",
        description: "Your meal has been successfully added to your diet plan.",
      });
      // Reset form
      setMealName("");
      setMealDescription("");
      setMealTime("");
      setMealCalories("");
      setMealIcon("restaurant");
      setShowMealForm(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add meal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mealName || !mealDescription || !mealTime || !mealCalories) {
      toast({
        title: "Missing information",
        description: "Please fill in all meal details.",
        variant: "destructive",
      });
      return;
    }

    const newMeal = {
      dietPlanId: dietPlan?.id,
      name: mealName,
      description: mealDescription,
      mealTime: mealTime,
      calories: parseInt(mealCalories),
      icon: mealIcon
    };

    addMealMutation.mutate(newMeal);
  };

  // Icons for meal types
  const mealIcons = [
    { value: "breakfast_dining", label: "Breakfast" },
    { value: "lunch_dining", label: "Lunch" },
    { value: "dinner_dining", label: "Dinner" },
    { value: "local_cafe", label: "Snack" },
    { value: "restaurant", label: "Generic" },
  ];

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Diet Plan</h2>

      {isLoading ? (
        <div className="py-10 text-center">
          <span className="material-icons animate-spin text-gray-400">refresh</span>
          <p className="text-sm text-gray-500 mt-2">Loading your diet plan...</p>
        </div>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{dietPlan?.name || "Your Diet Plan"}</CardTitle>
              <CardDescription>{dietPlan?.description || "Personalized nutrition plan based on your health metrics"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <span className="material-icons text-primary mr-2">local_fire_department</span>
                  <span className="font-medium">Daily Calorie Target: </span>
                  <span className="ml-2">{dietPlan?.totalCalories || "1800-2000"} calories</span>
                </div>
                
                {recommendations?.diet && (
                  <div className="mt-4 space-y-4">
                    <h4 className="font-medium">Recommended Nutrition Plan: {recommendations.diet.type}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Protein</p>
                          <p className="text-xl font-bold text-primary">{recommendations.diet.macros.protein}g</p>
                        </div>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Carbs</p>
                          <p className="text-xl font-bold text-primary">{recommendations.diet.macros.carbs}g</p>
                        </div>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Fats</p>
                          <p className="text-xl font-bold text-primary">{recommendations.diet.macros.fats}g</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Diet Recommendations:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {recommendations.diet.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-gray-700 text-sm">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Today's Meals</CardTitle>
                <CardDescription>Your meal plan for the day</CardDescription>
              </div>
              <Button 
                onClick={() => setShowMealForm(!showMealForm)}
                variant="outline"
                className="flex items-center"
              >
                <span className="material-icons text-sm mr-1">add</span>
                {showMealForm ? "Cancel" : "Add Meal"}
              </Button>
            </CardHeader>
            <CardContent>
              {showMealForm && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Add New Meal</h3>
                  <form onSubmit={handleAddMeal} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mealName">Meal Name</Label>
                        <Input 
                          id="mealName" 
                          value={mealName} 
                          onChange={(e) => setMealName(e.target.value)}
                          placeholder="e.g., Breakfast, Lunch, Dinner, Snack"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mealTime">Time</Label>
                        <Input 
                          id="mealTime" 
                          value={mealTime} 
                          onChange={(e) => setMealTime(e.target.value)}
                          placeholder="e.g., 8:00 AM"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mealCalories">Calories</Label>
                        <Input 
                          id="mealCalories" 
                          type="number" 
                          value={mealCalories} 
                          onChange={(e) => setMealCalories(e.target.value)}
                          placeholder="e.g., 450"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mealIcon">Icon</Label>
                        <Select 
                          value={mealIcon} 
                          onValueChange={setMealIcon}
                        >
                          <SelectTrigger id="mealIcon">
                            <SelectValue placeholder="Select an icon" />
                          </SelectTrigger>
                          <SelectContent>
                            {mealIcons.map(icon => (
                              <SelectItem key={icon.value} value={icon.value}>
                                <div className="flex items-center">
                                  <span className="material-icons text-primary mr-2">{icon.value}</span>
                                  {icon.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mealDescription">Description</Label>
                      <Textarea 
                        id="mealDescription" 
                        value={mealDescription} 
                        onChange={(e) => setMealDescription(e.target.value)}
                        placeholder="Describe the meal contents"
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowMealForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={addMealMutation.isPending}
                      >
                        {addMealMutation.isPending ? (
                          <>
                            <span className="material-icons animate-spin mr-2">refresh</span>
                            Adding...
                          </>
                        ) : "Add Meal"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {dietPlan?.meals && dietPlan.meals.length > 0 ? (
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
                <div className="py-10 text-center border border-dashed border-gray-200 rounded-lg">
                  <span className="material-icons text-gray-400 mb-2">restaurant</span>
                  <p className="text-gray-500">No meals in your plan yet</p>
                  <p className="text-sm text-gray-400 mt-1">Add meals to create your daily plan</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nutritional Guidelines</CardTitle>
              <CardDescription>Healthy eating tips based on your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-medium flex items-center text-primary">
                    <span className="material-icons mr-2">water_drop</span>
                    Stay Hydrated
                  </h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Aim for 8 glasses (2 liters) of water daily. Proper hydration supports metabolism and helps control hunger.
                  </p>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-medium flex items-center text-primary">
                    <span className="material-icons mr-2">schedule</span>
                    Meal Timing
                  </h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Try to eat meals at consistent times each day. Avoid eating large meals within 2-3 hours of bedtime.
                  </p>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-medium flex items-center text-primary">
                    <span className="material-icons mr-2">psychology</span>
                    Mindful Eating
                  </h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Eat slowly and without distractions. Listen to physical hunger cues and stop eating when full.
                  </p>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-medium flex items-center text-primary">
                    <span className="material-icons mr-2">auto_awesome</span>
                    Food Quality
                  </h4>
                  <p className="text-sm text-gray-700 mt-1">
                    Focus on whole foods: fruits, vegetables, lean proteins, whole grains, and healthy fats. Limit processed foods.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
