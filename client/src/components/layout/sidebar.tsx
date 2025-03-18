import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/", icon: "dashboard", label: "Dashboard" },
  { href: "/metrics", icon: "monitoring", label: "Health Metrics" },
  { href: "/diet", icon: "restaurant", label: "Diet Plan" },
  { href: "/workouts", icon: "fitness_center", label: "Workouts" },
  { href: "/learn", icon: "menu_book", label: "Learn" },
  { href: "/goals", icon: "flag", label: "Goals" },
  { href: "/settings", icon: "settings", label: "Settings" },
  { href: "/about", icon: "info", label: "About Us" },
];

export default function Sidebar() {
  const [location] = useLocation();
  
  const { data: user } = useQuery({
    queryKey: ['/api/users/1'],
    staleTime: Infinity, // Demo user data won't change
  });

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 bg-white shadow-md border-r border-gray-200">
      <div className="p-4 flex items-center">
        <span className="material-icons text-primary mr-2">fitness_center</span>
        <h1 className="text-xl font-bold text-primary">FitTrack</h1>
      </div>
      <div className="mt-4 flex flex-col flex-1">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-md group ${
                location === item.href
                  ? "text-primary bg-indigo-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="material-icons mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <img
            src={user?.avatar || "https://via.placeholder.com/40"}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">{user?.name || "User"}</p>
            <Link href="/settings" className="text-xs text-gray-500">
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
