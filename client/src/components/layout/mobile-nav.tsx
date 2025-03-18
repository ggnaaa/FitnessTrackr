import { Link, useLocation } from "wouter";
import { useState } from "react";

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

// Combined all navigation items into a single array, placing most important ones first
const allNavItems: NavItem[] = [
  { href: "/", icon: "dashboard", label: "Dashboard" },
  { href: "/metrics", icon: "monitoring", label: "Metrics" },
  { href: "/diet", icon: "restaurant", label: "Diet" },
  { href: "/workouts", icon: "fitness_center", label: "Workouts" },
  { href: "/goals", icon: "flag", label: "Goals" },
  { href: "/learn", icon: "menu_book", label: "Learn" },
  { href: "/settings", icon: "settings", label: "Settings" },
  { href: "/about", icon: "info", label: "About" },
];

export default function MobileNav() {
  const [location] = useLocation();
  const [scrollPosition, setScrollPosition] = useState(0);

  // Scroll handler for navigation bar
  const handleScroll = (direction: 'left' | 'right') => {
    const navContainer = document.getElementById('mobileNavScroll');
    if (navContainer) {
      const scrollAmount = 120; // Adjust this value based on your item width
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      navContainer.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      
      setScrollPosition(newPosition);
    }
  };

  return (
    <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 w-full z-10">
      <div className="relative">
        {/* Scrollable navigation container */}
        <div 
          id="mobileNavScroll"
          className="flex overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-[70px] ${
                location === item.href ? "text-primary" : "text-gray-500"
              }`}
            >
              <span className="material-icons">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
