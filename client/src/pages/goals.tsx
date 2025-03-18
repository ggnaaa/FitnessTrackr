import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { calculateProgressPercentage } from "@/lib/utils";
import { 
  Select, 
  SelectTrigger, 
  SelectContent, 
  SelectItem, 
  SelectValue 
} from "@/components/ui/select";

export default function Goals() {
  const { toast } = useToast();
  const [showGoalForm, setShowGoalForm] = useState(false);
  
  // New goal form state
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalCurrent, setGoalCurrent] = useState("");
  const [goalDate, setGoalDate] = useState("");
  
  // Update goal progress state
  const [updateGoalId, setUpdateGoalId] = useState<number | null>(null);
  const [newProgress, setNewProgress] = useState("");

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ['/api/users/1'],
  });

  // Fetch user's goals
  const { data: goals, isLoading } = useQuery({
    queryKey: ['/api/users/1/goals'],
  });

  // Fetch latest health metric
  const { data: healthMetric } = useQuery({
    queryKey: ['/api/users/1/health-metrics/latest'],
  });

  // Add goal mutation
  const addGoalMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/goals', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/1/goals'] });
      toast({
        title: "Goal created",
        description: "Your goal has been successfully created.",
      });
      // Reset form
      setGoalName("");
      setGoalTarget("");
      setGoalCurrent("");
      setGoalDate("");
      setShowGoalForm(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update goal progress mutation
  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, currentValue }: { id: number; currentValue: number }) => {
      return await apiRequest('PATCH', `/api/goals/${id}/progress`, { currentValue });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/1/goals'] });
      toast({
        title: "Progress updated",
        description: "Your goal progress has been updated.",
      });
      // Reset update form
      setUpdateGoalId(null);
      setNewProgress("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Complete goal mutation
  const completeGoalMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('PATCH', `/api/goals/${id}/complete`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/1/goals'] });
      toast({
        title: "Goal completed",
        description: "Congratulations on completing your goal!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to mark goal as complete. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goalName || !goalTarget || !goalCurrent) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const targetDate = goalDate ? new Date(goalDate) : new Date();
    targetDate.setMonth(targetDate.getMonth() + 3); // Default to 3 months if no date selected

    const newGoal = {
      userId: user?.id || 1,
      name: goalName,
      targetValue: parseFloat(goalTarget),
      currentValue: parseFloat(goalCurrent),
      startDate: new Date().toISOString().split('T')[0],
      targetDate: targetDate.toISOString().split('T')[0],
      completed: false
    };

    addGoalMutation.mutate(newGoal);
  };

  const handleUpdateProgress = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!updateGoalId || !newProgress) {
      toast({
        title: "Missing information",
        description: "Please select a goal and enter your current progress.",
        variant: "destructive",
      });
      return;
    }

    updateGoalMutation.mutate({
      id: updateGoalId,
      currentValue: parseFloat(newProgress)
    });
  };

  const handleCompleteGoal = (id: number) => {
    completeGoalMutation.mutate(id);
  };

  // Calculate days remaining for a goal
  const getDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Goal suggestion based on current health metrics
  const suggestGoal = () => {
    if (!healthMetric) return null;
    
    const { weight, bmi } = healthMetric;
    
    if (bmi > 25) {
      // Suggest weight loss
      const targetWeight = Math.round(weight * 0.9); // 10% weight loss
      return {
        name: "Weight Loss",
        target: targetWeight,
        current: weight,
        description: "Healthy weight loss goal of 10%"
      };
    } else if (bmi < 18.5) {
      // Suggest weight gain
      const targetWeight = Math.round(weight * 1.1); // 10% weight gain
      return {
        name: "Weight Gain",
        target: targetWeight,
        current: weight,
        description: "Healthy weight gain goal of 10%"
      };
    } else {
      // Suggest active minutes increase
      return {
        name: "Increase Activity",
        target: 60,
        current: healthMetric.activeMinutes || 30,
        description: "Increase daily active minutes"
      };
    }
  };

  const suggestedGoal = suggestGoal();

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold">Goals</h2>
        <Button 
          onClick={() => setShowGoalForm(!showGoalForm)}
          className="mt-4 md:mt-0 flex items-center"
        >
          <span className="material-icons text-sm mr-1">{showGoalForm ? "close" : "add"}</span>
          {showGoalForm ? "Cancel" : "Create New Goal"}
        </Button>
      </div>

      {showGoalForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Goal</CardTitle>
            <CardDescription>Set a specific, measurable goal to track your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddGoal} className="space-y-4">
              {suggestedGoal && (
                <div className="mb-4 p-4 bg-indigo-50 rounded-lg">
                  <h3 className="font-medium text-primary flex items-center">
                    <span className="material-icons mr-2">lightbulb</span>
                    Suggested Goal
                  </h3>
                  <p className="text-sm text-gray-700 mt-1">{suggestedGoal.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-sm font-medium">{suggestedGoal.name}</p>
                      <p className="text-xs text-gray-500">
                        Current: {suggestedGoal.current} → Target: {suggestedGoal.target}
                      </p>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setGoalName(suggestedGoal.name);
                        setGoalTarget(suggestedGoal.target.toString());
                        setGoalCurrent(suggestedGoal.current.toString());
                      }}
                    >
                      Use Suggestion
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goalName">Goal Name</Label>
                  <Input 
                    id="goalName" 
                    value={goalName} 
                    onChange={(e) => setGoalName(e.target.value)}
                    placeholder="e.g., Lose Weight, Run 5K"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goalDate">Target Date (optional)</Label>
                  <Input 
                    id="goalDate" 
                    type="date" 
                    value={goalDate} 
                    onChange={(e) => setGoalDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goalCurrent">Current Value</Label>
                  <Input 
                    id="goalCurrent" 
                    type="number" 
                    step="0.1"
                    value={goalCurrent} 
                    onChange={(e) => setGoalCurrent(e.target.value)}
                    placeholder="Your starting point"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goalTarget">Target Value</Label>
                  <Input 
                    id="goalTarget" 
                    type="number" 
                    step="0.1"
                    value={goalTarget} 
                    onChange={(e) => setGoalTarget(e.target.value)}
                    placeholder="Your goal"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowGoalForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={addGoalMutation.isPending}
                >
                  {addGoalMutation.isPending ? (
                    <>
                      <span className="material-icons animate-spin mr-2">refresh</span>
                      Creating...
                    </>
                  ) : "Create Goal"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Update Progress</CardTitle>
            <CardDescription>Track your current progress towards your goals</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProgress} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="updateGoalId">Select Goal</Label>
                {isLoading ? (
                  <div className="py-2">
                    <span className="material-icons animate-spin text-gray-400">refresh</span>
                  </div>
                ) : goals && goals.length > 0 ? (
                  <Select 
                    value={updateGoalId?.toString() || ""} 
                    onValueChange={(value) => setUpdateGoalId(parseInt(value))}
                  >
                    <SelectTrigger id="updateGoalId">
                      <SelectValue placeholder="Select a goal to update" />
                    </SelectTrigger>
                    <SelectContent>
                      {goals.filter((goal: any) => !goal.completed).map((goal: any) => (
                        <SelectItem key={goal.id} value={goal.id.toString()}>
                          {goal.name} (Current: {goal.currentValue}, Target: {goal.targetValue})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-gray-500">No active goals to update</p>
                )}
              </div>
              
              {updateGoalId && (
                <div className="space-y-2">
                  <Label htmlFor="newProgress">Current Progress</Label>
                  <Input 
                    id="newProgress" 
                    type="number" 
                    step="0.1"
                    value={newProgress} 
                    onChange={(e) => setNewProgress(e.target.value)}
                    placeholder="Enter your current progress"
                  />
                </div>
              )}
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updateGoalMutation.isPending || !updateGoalId}
                >
                  {updateGoalMutation.isPending ? (
                    <>
                      <span className="material-icons animate-spin mr-2">refresh</span>
                      Updating...
                    </>
                  ) : "Update Progress"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Motivation</CardTitle>
            <CardDescription>Focus on your journey, not just the destination</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <blockquote className="italic text-gray-700 border-l-4 border-primary pl-4 py-2">
                "The only person you should try to be better than is the person you were yesterday."
              </blockquote>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-medium">Remember:</h3>
                <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-gray-700">
                  <li>Progress is rarely linear - some days will be better than others</li>
                  <li>Small, consistent actions lead to big results over time</li>
                  <li>Celebrate your victories, no matter how small</li>
                  <li>Healthy habits are just as important as the end result</li>
                </ul>
              </div>
              
              <div className="flex items-center justify-center">
                <Button 
                  variant="link" 
                  className="text-primary"
                  onClick={() => alert("This would link to motivational content")}
                >
                  Find more motivation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Goals</CardTitle>
          <CardDescription>Track your progress towards your fitness targets</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center">
              <span className="material-icons animate-spin text-gray-400">refresh</span>
              <p className="text-sm text-gray-500 mt-2">Loading your goals...</p>
            </div>
          ) : goals && goals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal: any) => {
                const progress = calculateProgressPercentage(
                  goal.currentValue, 
                  goal.targetValue,
                  parseFloat(goal.startDate)
                );
                const daysRemaining = getDaysRemaining(goal.targetDate);
                
                return (
                  <div 
                    key={goal.id} 
                    className={`border rounded-lg p-4 ${
                      goal.completed ? "bg-green-50 border-green-200" : ""
                    }`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-lg flex items-center">
                          {goal.name}
                          {goal.completed && (
                            <span className="ml-2 material-icons text-green-500">check_circle</span>
                          )}
                        </h3>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Started:</span> {new Date(goal.startDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Target:</span> {goal.targetValue}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Current:</span> {goal.currentValue}
                          </p>
                          {!goal.completed && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Days left:</span> {daysRemaining}
                            </p>
                          )}
                        </div>
                      </div>
                      <ProgressCircle 
                        percentage={goal.completed ? 100 : progress} 
                        size={80}
                        fgColor={goal.completed ? "#10B981" : "#4F46E5"}
                      >
                        <span className="text-lg font-bold">
                          {goal.completed ? 100 : progress}%
                        </span>
                      </ProgressCircle>
                    </div>
                    
                    {!goal.completed && (
                      <div className="mt-4 flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setUpdateGoalId(goal.id);
                            setNewProgress(goal.currentValue.toString());
                          }}
                          className="mr-2"
                        >
                          Update
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleCompleteGoal(goal.id)}
                        >
                          Complete
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center border border-dashed border-gray-200 rounded-lg">
              <span className="material-icons text-gray-400 mb-2">flag</span>
              <p className="text-gray-500">No goals set yet</p>
              <p className="text-sm text-gray-400 mt-1">Create goals to track your fitness journey</p>
              <Button 
                className="mt-4" 
                onClick={() => setShowGoalForm(true)}
              >
                Create Your First Goal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
