import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectTrigger, 
  SelectContent, 
  SelectItem, 
  SelectValue 
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WorkoutCard, UpcomingWorkoutCard } from "@/components/dashboard/workout-card";
import { formatDate, formatTime } from "@/lib/utils";

export default function Workouts() {
  const { toast } = useToast();
  const [openExerciseDialog, setOpenExerciseDialog] = useState(false);
  
  // Current workout state
  const [activeWorkoutId, setActiveWorkoutId] = useState<number | null>(null);
  
  // New workout form state
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDescription, setWorkoutDescription] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [workoutIcon, setWorkoutIcon] = useState("fitness_center");
  const [workoutDate, setWorkoutDate] = useState("");
  const [workoutTime, setWorkoutTime] = useState("");
  
  // New exercise form state
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseSets, setExerciseSets] = useState("");
  const [exerciseReps, setExerciseReps] = useState("");
  const [exerciseIcon, setExerciseIcon] = useState("fitness_center");

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ['/api/users/1'],
  });

  // Fetch current workout
  const { data: currentWorkout, isLoading: loadingCurrentWorkout } = useQuery({
    queryKey: ['/api/users/1/workouts/current'],
  });

  // Fetch all user workouts
  const { data: workouts, isLoading: loadingWorkouts } = useQuery({
    queryKey: ['/api/users/1/workouts'],
  });

  // Fetch upcoming workouts
  const { data: upcomingWorkouts, isLoading: loadingUpcoming } = useQuery({
    queryKey: ['/api/users/1/workouts/upcoming'],
  });

  // Fetch user's latest health metrics to get recommendations
  const { data: recommendations } = useQuery({
    queryKey: ['/api/users/1/recommendations'],
  });

  // Add workout mutation
  const addWorkoutMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/workouts', data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/1/workouts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/1/workouts/current'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/1/workouts/upcoming'] });
      
      toast({
        title: "Workout added",
        description: "Your workout has been successfully created.",
      });
      
      // Reset form and set active workout to new one for adding exercises
      const workoutData = response.json();
      workoutData.then((data) => {
        setActiveWorkoutId(data.id);
        setOpenExerciseDialog(true);
      });
      
      setShowWorkoutForm(false);
      resetWorkoutForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create workout. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Add exercise mutation
  const addExerciseMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/exercises', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/1/workouts/current'] });
      queryClient.invalidateQueries({ queryKey: ['/api/workouts'] });
      
      toast({
        title: "Exercise added",
        description: "The exercise has been added to your workout.",
      });
      
      resetExerciseForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add exercise. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workoutName || !workoutDuration) {
      toast({
        title: "Missing information",
        description: "Please provide at least a name and duration for the workout.",
        variant: "destructive",
      });
      return;
    }

    const newWorkout = {
      userId: user?.id || 1,
      name: workoutName,
      description: workoutDescription || `${workoutName} workout routine`,
      duration: parseInt(workoutDuration),
      icon: workoutIcon,
      scheduledDate: workoutDate || undefined,
      scheduledTime: workoutTime || undefined
    };

    addWorkoutMutation.mutate(newWorkout);
  };

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!exerciseName || !exerciseSets || !exerciseReps) {
      toast({
        title: "Missing information",
        description: "Please fill in all exercise details.",
        variant: "destructive",
      });
      return;
    }

    const newExercise = {
      workoutId: activeWorkoutId,
      name: exerciseName,
      sets: parseInt(exerciseSets),
      reps: parseInt(exerciseReps),
      icon: exerciseIcon
    };

    addExerciseMutation.mutate(newExercise);
  };

  const resetWorkoutForm = () => {
    setWorkoutName("");
    setWorkoutDescription("");
    setWorkoutDuration("");
    setWorkoutIcon("fitness_center");
    setWorkoutDate("");
    setWorkoutTime("");
  };

  const resetExerciseForm = () => {
    setExerciseName("");
    setExerciseSets("");
    setExerciseReps("");
    setExerciseIcon("fitness_center");
  };

  const handleStartWorkout = () => {
    toast({
      title: "Starting workout",
      description: `${currentWorkout?.name} workout has started. Good luck!`,
    });
  };

  // Icons for workouts
  const workoutIcons = [
    { value: "fitness_center", label: "Weights" },
    { value: "directions_run", label: "Cardio" },
    { value: "self_improvement", label: "Yoga" },
    { value: "pedal_bike", label: "Cycling" },
    { value: "pool", label: "Swimming" },
  ];

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Workouts</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Today's Workout</CardTitle>
              <CardDescription>Your scheduled training for today</CardDescription>
            </div>
            <Button 
              onClick={() => setShowWorkoutForm(!showWorkoutForm)}
              variant={showWorkoutForm ? "outline" : "default"}
              className="flex items-center"
            >
              <span className="material-icons text-sm mr-1">{showWorkoutForm ? "close" : "add"}</span>
              {showWorkoutForm ? "Cancel" : "New Workout"}
            </Button>
          </CardHeader>
          <CardContent>
            {showWorkoutForm ? (
              <div className="p-4 border border-gray-200 rounded-lg mb-4">
                <h3 className="text-lg font-medium mb-4">Create New Workout</h3>
                <form onSubmit={handleAddWorkout} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="workoutName">Workout Name</Label>
                      <Input 
                        id="workoutName" 
                        value={workoutName} 
                        onChange={(e) => setWorkoutName(e.target.value)}
                        placeholder="e.g., Full Body Strength"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workoutDuration">Duration (minutes)</Label>
                      <Input 
                        id="workoutDuration" 
                        type="number" 
                        value={workoutDuration} 
                        onChange={(e) => setWorkoutDuration(e.target.value)}
                        placeholder="e.g., 30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workoutDate">Scheduled Date (optional)</Label>
                      <Input 
                        id="workoutDate" 
                        type="date" 
                        value={workoutDate} 
                        onChange={(e) => setWorkoutDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workoutTime">Scheduled Time (optional)</Label>
                      <Input 
                        id="workoutTime" 
                        type="time" 
                        value={workoutTime} 
                        onChange={(e) => setWorkoutTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workoutIcon">Icon</Label>
                      <Select 
                        value={workoutIcon} 
                        onValueChange={setWorkoutIcon}
                      >
                        <SelectTrigger id="workoutIcon">
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {workoutIcons.map(icon => (
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
                    <Label htmlFor="workoutDescription">Description (optional)</Label>
                    <Textarea 
                      id="workoutDescription" 
                      value={workoutDescription} 
                      onChange={(e) => setWorkoutDescription(e.target.value)}
                      placeholder="Describe the workout focus and goals"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowWorkoutForm(false);
                        resetWorkoutForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={addWorkoutMutation.isPending}
                    >
                      {addWorkoutMutation.isPending ? (
                        <>
                          <span className="material-icons animate-spin mr-2">refresh</span>
                          Creating...
                        </>
                      ) : "Create Workout"}
                    </Button>
                  </div>
                </form>
              </div>
            ) : loadingCurrentWorkout ? (
              <div className="py-10 text-center">
                <span className="material-icons animate-spin text-gray-400">refresh</span>
                <p className="text-sm text-gray-500 mt-2">Loading your workout...</p>
              </div>
            ) : currentWorkout ? (
              <Dialog open={openExerciseDialog} onOpenChange={setOpenExerciseDialog}>
                <DialogTrigger asChild>
                  <div className="cursor-pointer">
                    <WorkoutCard
                      title={currentWorkout.name}
                      duration={currentWorkout.duration}
                      exercises={currentWorkout.exercises || []}
                      buttonText="Start Workout"
                      onButtonClick={handleStartWorkout}
                    />
                    
                    <Button 
                      variant="outline" 
                      className="mt-4 w-full"
                      onClick={() => {
                        setActiveWorkoutId(currentWorkout.id);
                        setOpenExerciseDialog(true);
                      }}
                    >
                      <span className="material-icons mr-2">add</span>
                      Add Exercise
                    </Button>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Exercise to Workout</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddExercise} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="exerciseName">Exercise Name</Label>
                      <Input 
                        id="exerciseName" 
                        value={exerciseName} 
                        onChange={(e) => setExerciseName(e.target.value)}
                        placeholder="e.g., Squats, Push-ups"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="exerciseSets">Sets</Label>
                        <Input 
                          id="exerciseSets" 
                          type="number" 
                          value={exerciseSets} 
                          onChange={(e) => setExerciseSets(e.target.value)}
                          placeholder="e.g., 3"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exerciseReps">Reps</Label>
                        <Input 
                          id="exerciseReps" 
                          type="number" 
                          value={exerciseReps} 
                          onChange={(e) => setExerciseReps(e.target.value)}
                          placeholder="e.g., 12"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exerciseIcon">Icon</Label>
                      <Select 
                        value={exerciseIcon} 
                        onValueChange={setExerciseIcon}
                      >
                        <SelectTrigger id="exerciseIcon">
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {workoutIcons.map(icon => (
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
                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setOpenExerciseDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={addExerciseMutation.isPending}
                      >
                        {addExerciseMutation.isPending ? (
                          <>
                            <span className="material-icons animate-spin mr-2">refresh</span>
                            Adding...
                          </>
                        ) : "Add Exercise"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            ) : (
              <div className="py-10 text-center border border-dashed border-gray-200 rounded-lg">
                <span className="material-icons text-gray-400 mb-2">fitness_center</span>
                <p className="text-gray-500">No workout scheduled for today</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setShowWorkoutForm(true)}
                >
                  Create Workout Plan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workout Recommendations</CardTitle>
            <CardDescription>Based on your fitness profile</CardDescription>
          </CardHeader>
          <CardContent>
            {recommendations?.workout ? (
              <div className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-medium">Recommended Focus</h4>
                  <p className="text-primary font-medium">{recommendations.workout.type}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {recommendations.workout.frequency}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Workout Tips:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {recommendations.workout.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-gray-700 text-sm">{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-gray-500">Loading recommendations...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upcoming Workouts</CardTitle>
          <CardDescription>Your scheduled exercise sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingUpcoming ? (
            <div className="py-6 text-center">
              <span className="material-icons animate-spin text-gray-400">refresh</span>
              <p className="text-sm text-gray-500 mt-2">Loading upcoming workouts...</p>
            </div>
          ) : upcomingWorkouts && upcomingWorkouts.length > 0 ? (
            <div className="space-y-3">
              {upcomingWorkouts.map((workout: any) => (
                <UpcomingWorkoutCard
                  key={workout.id}
                  icon={workout.icon}
                  title={workout.name}
                  date={workout.scheduledDate ? formatDate(workout.scheduledDate) : "Unscheduled"}
                  time={workout.scheduledTime ? formatTime(workout.scheduledTime) : "Any time"}
                  duration={workout.duration}
                />
              ))}
            </div>
          ) : (
            <div className="py-6 text-center border border-dashed border-gray-200 rounded-lg">
              <span className="material-icons text-gray-400 mb-2">event</span>
              <p className="text-gray-500">No upcoming workouts scheduled</p>
              <p className="text-sm text-gray-400 mt-1">Plan your exercise routine in advance</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workout History</CardTitle>
          <CardDescription>Your past workout sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingWorkouts ? (
            <div className="py-6 text-center">
              <span className="material-icons animate-spin text-gray-400">refresh</span>
              <p className="text-sm text-gray-500 mt-2">Loading workout history...</p>
            </div>
          ) : workouts && workouts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Workout</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-right p-2">Duration</th>
                    <th className="text-right p-2">Exercises</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.map((workout: any) => (
                    <tr key={workout.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div className="flex items-center">
                          <span className="material-icons text-primary mr-2">{workout.icon}</span>
                          {workout.name}
                        </div>
                      </td>
                      <td className="p-2">{workout.scheduledDate ? new Date(workout.scheduledDate).toLocaleDateString() : "N/A"}</td>
                      <td className="text-right p-2">{workout.duration} min</td>
                      <td className="text-right p-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{workout.name} Exercises</DialogTitle>
                            </DialogHeader>
                            {workout.exercises && workout.exercises.length > 0 ? (
                              <div className="grid grid-cols-2 gap-3 mt-4">
                                {workout.exercises.map((exercise: any) => (
                                  <div key={exercise.id} className="bg-gray-100 rounded-lg p-3 flex flex-col items-center justify-center">
                                    <span className="material-icons text-primary mb-1">{exercise.icon}</span>
                                    <p className="text-center font-medium">{exercise.name}</p>
                                    <p className="text-sm text-gray-500">
                                      {exercise.sets} x {exercise.reps}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="py-4 text-center">
                                <p className="text-gray-500">No exercises found for this workout</p>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-6 text-center border border-dashed border-gray-200 rounded-lg">
              <span className="material-icons text-gray-400 mb-2">history</span>
              <p className="text-gray-500">No workout history available</p>
              <p className="text-sm text-gray-400 mt-1">Complete workouts to see them here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
