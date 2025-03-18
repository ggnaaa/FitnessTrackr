import { Dumbbell, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Workout, Exercise } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface WorkoutPlanProps {
  userId: number;
}

export default function WorkoutPlan({ userId }: WorkoutPlanProps) {
  const { toast } = useToast();
  
  const { data: workout, isLoading: isLoadingWorkout } = useQuery<Workout>({ 
    queryKey: ['/api/workouts/recommendations', userId],
  });
  
  const { data: exercises = [], isLoading: isLoadingExercises } = useQuery<Exercise[]>({
    queryKey: ['/api/exercises/workout', workout?.id],
    enabled: !!workout?.id,
  });
  
  const isLoading = isLoadingWorkout || isLoadingExercises;
  
  const handleStartWorkout = () => {
    toast({
      title: "Workout Started",
      description: "Track your progress and stay hydrated!",
    });
  };
  
  const handlePlayExercise = (exerciseName: string) => {
    toast({
      title: `${exerciseName}`,
      description: "Exercise demonstration video would play here.",
    });
  };
  
  if (isLoading) {
    return <WorkoutPlanSkeleton />;
  }
  
  if (!workout) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-4">Today's Workout</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No workout plan available yet.</p>
          <Button className="mt-4" variant="outline">Create a workout plan</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Today's Workout</h2>
        <Button variant="ghost" size="icon">
          <span className="sr-only">Options</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </Button>
      </div>
      
      <div className="bg-primary/5 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{workout.name}</h3>
            <p className="text-sm text-gray-500">{workout.duration} mins • {workout.caloriesBurned} calories</p>
          </div>
          <Button className="bg-primary" onClick={handleStartWorkout}>
            Start
          </Button>
        </div>
      </div>
      
      {exercises.map((exercise) => (
        <div key={exercise.id} className="py-3 border-b last:border-b-0">
          <div className="flex items-center">
            <div className="bg-gray-100 rounded-lg w-12 h-12 flex items-center justify-center mr-3">
              <Dumbbell className="text-gray-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{exercise.name}</h3>
              <div className="flex mt-1">
                {exercise.sets && <span className="text-xs bg-gray-100 px-2 py-1 rounded mr-2">{exercise.sets} sets</span>}
                {exercise.reps && <span className="text-xs bg-gray-100 px-2 py-1 rounded">{exercise.reps} reps</span>}
                {exercise.duration && <span className="text-xs bg-gray-100 px-2 py-1 rounded">{exercise.duration} sec</span>}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary"
              onClick={() => handlePlayExercise(exercise.name)}
            >
              <PlayCircle className="h-6 w-6" />
            </Button>
          </div>
        </div>
      ))}
      
      <div className="mt-4 text-center">
        <Link href="/workouts">
          <Button variant="link" className="text-primary hover:text-primary/80 text-sm font-medium">
            View complete workout plan 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Button>
        </Link>
      </div>
    </div>
  );
}

function WorkoutPlanSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      
      <Skeleton className="h-24 w-full rounded-lg mb-4" />
      
      {[1, 2, 3].map((i) => (
        <div key={i} className="py-3 border-b last:border-b-0">
          <div className="flex items-center">
            <Skeleton className="h-12 w-12 rounded-lg mr-3" />
            <div className="flex-1">
              <Skeleton className="h-5 w-32 mb-2" />
              <div className="flex mt-1">
                <Skeleton className="h-5 w-16 rounded mr-2" />
                <Skeleton className="h-5 w-16 rounded" />
              </div>
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      ))}
      
      <div className="mt-4 text-center">
        <Skeleton className="h-5 w-48 mx-auto" />
      </div>
    </div>
  );
}
