import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bell,
  MenuIcon
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { useState } from "react";

const navigationItems = [
  { name: "Dashboard", path: "/" },
  { name: "Nutrition", path: "/nutrition" },
  { name: "Workouts", path: "/workouts" },
  { name: "Progress", path: "/progress" },
  { name: "Education", path: "/education" },
  { name: "About", path: "/about" }
];

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock user data (in a real app this would come from context or a store)
  const user = {
    firstName: "John",
    lastName: "Doe"
  };

  const userInitials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  return (
    <header className="bg-white shadow-sm py-4 px-4 fixed top-0 left-0 right-0 z-10">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link href="/">
            <span className="text-primary font-bold text-2xl cursor-pointer">FitTrack</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          {navigationItems.map((item) => (
            <Link 
              href={item.path} 
              key={item.name}
            >
              <span 
                className={cn(
                  "text-dark hover:text-primary cursor-pointer",
                  location === item.path && "text-primary"
                )}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="bg-primary text-white rounded-full h-10 w-10 flex items-center justify-center">
            <Bell className="h-5 w-5" />
          </button>
          <Link href="/profile">
            <Avatar className="bg-secondary text-white h-10 w-10 cursor-pointer">
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="text-primary">
                  <MenuIcon className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 pt-6">
                  {navigationItems.map((item) => (
                    <Link 
                      href={item.path} 
                      key={item.name}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span 
                        className={cn(
                          "text-dark hover:text-primary text-lg",
                          location === item.path && "text-primary font-medium"
                        )}
                      >
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
