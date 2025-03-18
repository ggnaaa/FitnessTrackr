import { Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Meal } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

interface MealPlanProps {
  userId: number;
}

export default function MealPlan({ userId }: MealPlanProps) {
  const { data: meals, isLoading } = useQuery<Meal[]>({ 
    queryKey: ['/api/meals/recommendations', userId],
  });
  
  if (isLoading) {
    return <MealPlanSkeleton />;
  }
  
  if (!meals || meals.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold mb-4">Today's Diet Plan</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No meal plan available yet.</p>
          <Button className="mt-4" variant="outline">Create a meal plan</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Today's Diet Plan</h2>
        <Button variant="ghost" size="icon">
          <span className="sr-only">Options</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </Button>
      </div>
      
      {meals.map((meal) => (
        <div key={meal.id} className="mb-4 pb-4 border-b last:border-b-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <div className="bg-secondary/10 p-2 rounded-lg mr-3">
                <Utensils className="text-secondary h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">{meal.name}</h3>
                <p className="text-sm text-gray-500">{meal.time}</p>
              </div>
            </div>
            <div>
              <span className="text-secondary text-sm">{meal.calories} kcal</span>
            </div>
          </div>
          <div className="ml-12 mt-2">
            {meal.items && (
              <ul className="text-sm text-gray-600 space-y-1">
                {meal.items.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
      
      <div className="mt-4 text-center">
        <Link href="/nutrition">
          <Button variant="link" className="text-primary hover:text-primary/80 text-sm font-medium">
            View complete nutrition plan 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Button>
        </Link>
      </div>
    </div>
  );
}

function MealPlanSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      
      {[1, 2, 3].map((i) => (
        <div key={i} className="mb-4 pb-4 border-b last:border-b-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-lg mr-3" />
              <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="ml-12 mt-2">
            <Skeleton className="h-4 w-full max-w-[280px] mb-1" />
            <Skeleton className="h-4 w-full max-w-[260px] mb-1" />
            <Skeleton className="h-4 w-full max-w-[240px]" />
          </div>
        </div>
      ))}
      
      <div className="mt-4 text-center">
        <Skeleton className="h-5 w-48 mx-auto" />
      </div>
    </div>
  );
}
