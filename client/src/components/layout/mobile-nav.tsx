import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/", icon: "dashboard", label: "Dashboard" },
  { href: "/metrics", icon: "monitoring", label: "Metrics" },
  { href: "/diet", icon: "restaurant", label: "Diet" },
  { href: "/workouts", icon: "fitness_center", label: "Workouts" },
];

const moreMenuItems: NavItem[] = [
  { href: "/learn", icon: "menu_book", label: "Learn" },
  { href: "/goals", icon: "flag", label: "Goals" },
  { href: "/settings", icon: "settings", label: "Settings" },
  { href: "/about", icon: "info", label: "About Us" },
];

export default function MobileNav() {
  const [location] = useLocation();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  return (
    <>
      <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 w-full z-10">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 w-full ${
                location === item.href ? "text-primary" : "text-gray-500"
              }`}
            >
              <span className="material-icons">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={() => setMoreMenuOpen(true)}
            className="flex flex-col items-center justify-center py-2 w-full text-gray-500"
          >
            <span className="material-icons">more_horiz</span>
            <span className="text-xs mt-1">More</span>
          </button>
        </div>
      </nav>

      <Dialog open={moreMenuOpen} onOpenChange={setMoreMenuOpen}>
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="w-full max-w-lg max-h-[85vh] overflow-auto p-4 bg-white rounded-t-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">More Options</h3>
              <button onClick={() => setMoreMenuOpen(false)}>
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {moreMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreMenuOpen(false)}
                  className="flex items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="material-icons text-primary mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
