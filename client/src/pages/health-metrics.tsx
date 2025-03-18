import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { calculateBMI, getBMICategory } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WeightChart } from "@/components/dashboard/chart";

export default function HealthMetrics() {
  const { toast } = useToast();
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [calories, setCalories] = useState("");
  const [activeMinutes, setActiveMinutes] = useState("");

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ['/api/users/1'],
  });

  // Fetch health metrics history
  const { data: healthMetrics, isLoading } = useQuery({
    queryKey: ['/api/users/1/health-metrics'],
  });

  // Add health metric mutation
  const addMetricMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/health-metrics', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/1/health-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/1/health-metrics/latest'] });
      toast({
        title: "Health metrics updated",
        description: "Your health metrics have been successfully updated.",
      });
      // Reset form
      setWeight("");
      setHeight("");
      setCalories("");
      setActiveMinutes("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update health metrics. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weight || !height) {
      toast({
        title: "Missing information",
        description: "Please provide at least weight and height measurements.",
        variant: "destructive",
      });
      return;
    }

    const newMetric = {
      userId: user?.id || 1,
      weight: parseFloat(weight),
      height: parseFloat(height),
      calories: calories ? parseInt(calories) : undefined,
      activeMinutes: activeMinutes ? parseInt(activeMinutes) : undefined,
      recordedDate: new Date().toISOString().split('T')[0],
    };

    addMetricMutation.mutate(newMetric);
  };

  // For demonstration purposes - mock weight data
  const weightData = healthMetrics?.slice(0, 7).map((metric: any, index: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = new Date(metric.recordedDate);
    return {
      day: days[date.getDay()],
      value: Math.round(((metric.weight - 60) / 20) * 100), // Normalize for visualization
    };
  }) || [];

  // Latest metric for display
  const latestMetric = healthMetrics?.[0];
  const bmi = latestMetric ? latestMetric.bmi : calculateBMI(parseFloat(weight) || 0, parseFloat(height) || 0);
  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Health Metrics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Weight</CardTitle>
            <CardDescription>Your current weight and history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-3xl font-bold">{latestMetric?.weight || "--"}</span>
                <span className="text-gray-500 ml-1">kg</span>
              </div>
              <span className="material-icons text-primary text-2xl">monitor_weight</span>
            </div>
            {weightData.length > 0 && (
              <div className="h-32">
                <WeightChart data={weightData} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Body Mass Index (BMI)</CardTitle>
            <CardDescription>Your BMI and health category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-3xl font-bold">{bmi || "--"}</span>
              </div>
              <span className="material-icons text-primary text-2xl">straighten</span>
            </div>
            <div className="mt-4">
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`absolute top-0 left-0 h-full ${
                    bmiCategory === "Underweight" ? "bg-blue-500" : 
                    bmiCategory === "Normal" ? "bg-green-500" : 
                    bmiCategory === "Overweight" ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(100, (bmi / 40) * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
              <p className="mt-3 text-center font-medium">
                {bmiCategory}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Levels</CardTitle>
            <CardDescription>Your daily activity stats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Daily Calories</span>
                  <span className="text-sm font-medium">{latestMetric?.calories || "--"}</span>
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-primary"
                    style={{ width: `${latestMetric?.calories ? (latestMetric.calories / 2500) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Active Minutes</span>
                  <span className="text-sm font-medium">{latestMetric?.activeMinutes || "--"} min</span>
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-primary"
                    style={{ width: `${latestMetric?.activeMinutes ? (latestMetric.activeMinutes / 60) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Record New Measurements</CardTitle>
          <CardDescription>Enter your latest health metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input 
                  id="weight" 
                  type="number" 
                  placeholder="Enter your weight in kg" 
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)}
                  min="20"
                  max="300"
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input 
                  id="height" 
                  type="number" 
                  placeholder="Enter your height in cm" 
                  value={height} 
                  onChange={(e) => setHeight(e.target.value)}
                  min="100"
                  max="250"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calories">Daily Calories</Label>
                <Input 
                  id="calories" 
                  type="number" 
                  placeholder="Calories consumed today" 
                  value={calories} 
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="activeMinutes">Active Minutes</Label>
                <Input 
                  id="activeMinutes" 
                  type="number" 
                  placeholder="Minutes of activity today" 
                  value={activeMinutes} 
                  onChange={(e) => setActiveMinutes(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={addMetricMutation.isPending}
              >
                {addMetricMutation.isPending ? (
                  <>
                    <span className="material-icons animate-spin mr-2">refresh</span>
                    Saving...
                  </>
                ) : "Save Measurements"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Measurement History</CardTitle>
          <CardDescription>Your recorded health metrics over time</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center">
              <span className="material-icons animate-spin text-gray-400">refresh</span>
              <p className="text-sm text-gray-500 mt-2">Loading your measurement history...</p>
            </div>
          ) : healthMetrics && healthMetrics.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Date</th>
                    <th className="text-right p-2">Weight (kg)</th>
                    <th className="text-right p-2">BMI</th>
                    <th className="text-right p-2">Calories</th>
                    <th className="text-right p-2">Active Minutes</th>
                  </tr>
                </thead>
                <tbody>
                  {healthMetrics.map((metric: any) => (
                    <tr key={metric.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{new Date(metric.recordedDate).toLocaleDateString()}</td>
                      <td className="text-right p-2">{metric.weight}</td>
                      <td className="text-right p-2">{metric.bmi}</td>
                      <td className="text-right p-2">{metric.calories || '-'}</td>
                      <td className="text-right p-2">{metric.activeMinutes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-10 text-center">
              <span className="material-icons text-gray-400 mb-2">show_chart</span>
              <p className="text-gray-500">No measurement history available</p>
              <p className="text-sm text-gray-400 mt-1">Start recording your measurements to see your progress</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
