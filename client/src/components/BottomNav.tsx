import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Utensils, Plus, Dumbbell, User } from "lucide-react";

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-t md:hidden z-10 border-t">
      <div className="flex justify-around items-center h-16">
        <Link href="/" className="w-1/5">
          <div className={cn(
            "flex flex-col items-center justify-center", 
            location === "/" ? "text-primary" : "text-gray-500"
          )}>
            <Home className="text-xl h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </div>
        </Link>
        
        <Link href="/nutrition" className="w-1/5">
          <div className={cn(
            "flex flex-col items-center justify-center", 
            location === "/nutrition" ? "text-primary" : "text-gray-500"
          )}>
            <Utensils className="text-xl h-5 w-5" />
            <span className="text-xs mt-1">Diet</span>
          </div>
        </Link>
        
        <Link href="/profile">
          <div className="flex flex-col items-center justify-center bg-primary text-white rounded-full h-14 w-14 -mt-5">
            <Plus className="text-xl h-5 w-5" />
          </div>
        </Link>
        
        <Link href="/workouts" className="w-1/5">
          <div className={cn(
            "flex flex-col items-center justify-center", 
            location === "/workouts" ? "text-primary" : "text-gray-500"
          )}>
            <Dumbbell className="text-xl h-5 w-5" />
            <span className="text-xs mt-1">Workout</span>
          </div>
        </Link>
        
        <Link href="/profile" className="w-1/5">
          <div className={cn(
            "flex flex-col items-center justify-center", 
            location === "/profile" ? "text-primary" : "text-gray-500"
          )}>
            <User className="text-xl h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
