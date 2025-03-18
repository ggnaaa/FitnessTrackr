import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Workout, Exercise } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Clock, Flame, Calendar, PlayCircle, Target, ArrowRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Workouts() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("workout-plan");
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [exerciseDialog, setExerciseDialog] = useState<{
    open: boolean;
    exercise: Exercise | null;
  }>({
    open: false,
    exercise: null,
  });
  
  // For demo purposes using a static user ID
  const userId = 1;
  
  // Fetch all user workouts
  const { data: workouts, isLoading: isLoadingWorkouts } = useQuery<Workout[]>({ 
    queryKey: ['/api/workouts/user', userId],
  });
  
  // Fetch exercises for the selected workout
  const { data: exercises, isLoading: isLoadingExercises } = useQuery<Exercise[]>({
    queryKey: ['/api/exercises/workout', selectedWorkout?.id],
    enabled: !!selectedWorkout?.id,
  });
  
  const handleViewWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
  };
  
  const handleStartWorkout = (workout: Workout) => {
    toast({
      title: `Starting: ${workout.name}`,
      description: "Get ready for your workout session!",
    });
  };
  
  const handleViewExercise = (exercise: Exercise) => {
    setExerciseDialog({
      open: true,
      exercise,
    });
  };
  
  // Example weekly progress data
  const weeklyProgress = {
    workoutsCompleted: 3,
    workoutsTarget: 5,
    totalTime: 135, // minutes
    totalCalories: 960,
  };
  
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Workout Plans</h1>
        <Button>Create Custom Workout</Button>
      </div>
      
      <Tabs defaultValue="workout-plan" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workout-plan">Workout Plans</TabsTrigger>
          <TabsTrigger value="exercise-library">Exercise Library</TabsTrigger>
          <TabsTrigger value="progress">Your Progress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="workout-plan" className="mt-6">
          {selectedWorkout ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <Button variant="outline" onClick={() => setSelectedWorkout(null)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Back to Workouts
                </Button>
                <Button onClick={() => handleStartWorkout(selectedWorkout)}>
                  Start Workout
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{selectedWorkout.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {selectedWorkout.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <Clock className="h-5 w-5 mx-auto text-gray-400" />
                        <span className="text-sm text-gray-500 block mt-1">{selectedWorkout.duration} min</span>
                      </div>
                      <div className="text-center">
                        <Flame className="h-5 w-5 mx-auto text-gray-400" />
                        <span className="text-sm text-gray-500 block mt-1">{selectedWorkout.caloriesBurned} kcal</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-medium mb-4 text-lg">Exercises</h3>
                  
                  {isLoadingExercises ? (
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center p-4 border rounded-md">
                          <Skeleton className="h-12 w-12 rounded-lg mr-4" />
                          <div className="flex-1">
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-4 w-40" />
                          </div>
                          <Skeleton className="h-9 w-9 rounded-full" />
                        </div>
                      ))}
                    </div>
                  ) : exercises && exercises.length > 0 ? (
                    <div className="space-y-4">
                      {exercises.map((exercise, index) => (
                        <div 
                          key={exercise.id} 
                          className="flex items-center p-4 border rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <div className="bg-primary/10 text-primary rounded-lg w-12 h-12 flex items-center justify-center mr-4">
                            <span className="font-semibold">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{exercise.name}</h4>
                            <div className="flex mt-1">
                              {exercise.sets && <span className="text-xs bg-gray-100 px-2 py-1 rounded mr-2">{exercise.sets} sets</span>}
                              {exercise.reps && <span className="text-xs bg-gray-100 px-2 py-1 rounded mr-2">{exercise.reps} reps</span>}
                              {exercise.duration && <span className="text-xs bg-gray-100 px-2 py-1 rounded">{exercise.duration} sec</span>}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-primary"
                            onClick={() => handleViewExercise(exercise)}
                          >
                            <PlayCircle className="h-6 w-6" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No exercises found for this workout.</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Save Workout</Button>
                  <Button onClick={() => handleStartWorkout(selectedWorkout)}>
                    Start Workout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingWorkouts ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-7 w-48 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between mb-4">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <Skeleton className="h-24 w-full rounded-md" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full rounded-md" />
                    </CardFooter>
                  </Card>
                ))
              ) : workouts && workouts.length > 0 ? (
                workouts.map((workout) => (
                  <Card key={workout.id}>
                    <CardHeader>
                      <CardTitle>{workout.name}</CardTitle>
                      <CardDescription>
                        {workout.description?.substring(0, 100)}
                        {workout.description && workout.description.length > 100 ? '...' : ''}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-500">{workout.duration} min</span>
                        </div>
                        <div className="flex items-center">
                          <Flame className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-500">{workout.caloriesBurned} kcal</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-primary/5 rounded-md">
                        <div className="flex items-center">
                          <Dumbbell className="h-6 w-6 text-primary mr-2" />
                          <span className="font-medium">Start this workout</span>
                        </div>
                        <ArrowRight className="h-5 w-5 text-primary" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="w-full" 
                        variant="outline" 
                        onClick={() => handleViewWorkout(workout)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Dumbbell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Workout Plans Found</h3>
                  <p className="text-gray-500 mb-4">Create a personalized workout plan based on your fitness level.</p>
                  <Button>Create Workout Plan</Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="exercise-library" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Library</CardTitle>
              <CardDescription>
                Browse through our collection of exercises
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Dumbbell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Exercise Library</h3>
                <p className="text-gray-500 mb-4">Coming soon! Browse and learn about various exercises.</p>
                <Button>Explore Exercises</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                  <CardDescription>Track your workout achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <Target className="h-5 w-5 mr-2 text-primary" />
                          <span className="font-medium">Workouts Completed</span>
                        </div>
                        <span>{weeklyProgress.workoutsCompleted} / {weeklyProgress.workoutsTarget}</span>
                      </div>
                      <Progress 
                        value={(weeklyProgress.workoutsCompleted / weeklyProgress.workoutsTarget) * 100} 
                        className="h-3"
                      />
                      <div className="mt-2 flex justify-between text-sm text-gray-500">
                        <span>Weekly Goal: {weeklyProgress.workoutsTarget} workouts</span>
                        <span>{weeklyProgress.workoutsTarget - weeklyProgress.workoutsCompleted} remaining</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-500">Total Workout Time</span>
                          <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold mr-2">{weeklyProgress.totalTime}</span>
                          <span className="text-gray-500">minutes</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">This week</div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-gray-500">Calories Burned</span>
                          <Flame className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold mr-2">{weeklyProgress.totalCalories}</span>
                          <span className="text-gray-500">kcal</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">This week</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-medium mb-4">Recent Workouts</h3>
                      
                      {workouts && workouts.length > 0 ? (
                        <div className="space-y-4">
                          {workouts.slice(0, 3).map((workout) => (
                            <div key={workout.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
                              <div className="flex items-center">
                                <div className="bg-primary/10 p-2 rounded-lg mr-3">
                                  <Dumbbell className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{workout.name}</h4>
                                  <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>{workout.date ? format(parseISO(workout.date), 'MMM d, yyyy') : 'No date'}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant="outline" className="mb-1">{workout.duration} min</Badge>
                                <div className="text-sm text-gray-500">{workout.caloriesBurned} kcal</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500">No recent workouts.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Workout Statistics</CardTitle>
                  <CardDescription>Your fitness journey in numbers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Total Workouts</h3>
                      <div className="flex justify-between items-baseline">
                        <span className="text-3xl font-bold">{workouts?.length || 0}</span>
                        <Badge variant="outline" className="text-green-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                          </svg>
                          20%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Total Time</h3>
                      <div className="flex justify-between items-baseline">
                        <span className="text-3xl font-bold">
                          {workouts?.reduce((sum, workout) => sum + (workout.duration || 0), 0) || 0}
                        </span>
                        <span className="text-sm text-gray-500">minutes</span>
                      </div>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Total Calories</h3>
                      <div className="flex justify-between items-baseline">
                        <span className="text-3xl font-bold">
                          {workouts?.reduce((sum, workout) => sum + (workout.caloriesBurned || 0), 0) || 0}
                        </span>
                        <span className="text-sm text-gray-500">kcal</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Most Popular Workout</h3>
                      {workouts && workouts.length > 0 ? (
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-2 rounded-lg mr-3">
                            <Dumbbell className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{workouts[0].name}</h4>
                            <div className="text-sm text-gray-500">{workouts[0].duration} min</div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No workouts completed yet</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Exercise Demonstration Dialog */}
      <Dialog 
        open={exerciseDialog.open} 
        onOpenChange={(open) => setExerciseDialog(prev => ({ ...prev, open }))}
      >
        <DialogContent className="max-w-xl">
          {exerciseDialog.exercise && (
            <>
              <DialogHeader>
                <DialogTitle>{exerciseDialog.exercise.name}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <div className="bg-gray-100 rounded-md p-8 flex items-center justify-center mb-4 h-52">
                  <Dumbbell className="h-16 w-16 text-gray-400" />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {exerciseDialog.exercise.sets && (
                    <div className="bg-gray-50 p-3 rounded-md text-center">
                      <span className="block text-gray-500 text-sm">Sets</span>
                      <span className="font-bold text-lg">{exerciseDialog.exercise.sets}</span>
                    </div>
                  )}
                  
                  {exerciseDialog.exercise.reps && (
                    <div className="bg-gray-50 p-3 rounded-md text-center">
                      <span className="block text-gray-500 text-sm">Reps</span>
                      <span className="font-bold text-lg">{exerciseDialog.exercise.reps}</span>
                    </div>
                  )}
                  
                  {exerciseDialog.exercise.duration && (
                    <div className="bg-gray-50 p-3 rounded-md text-center">
                      <span className="block text-gray-500 text-sm">Duration</span>
                      <span className="font-bold text-lg">{exerciseDialog.exercise.duration} sec</span>
                    </div>
                  )}
                </div>
                
                {exerciseDialog.exercise.notes && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Instructions</h4>
                    <p className="text-gray-600">{exerciseDialog.exercise.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-end mt-6">
                  <Button onClick={() => setExerciseDialog({ open: false, exercise: null })}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
