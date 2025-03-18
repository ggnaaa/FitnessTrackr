import { useQuery } from "@tanstack/react-query";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function Header() {
  const { data: user } = useQuery({
    queryKey: ['/api/users/1'],
    staleTime: Infinity, // Demo user data won't change
  });

  return (
    <header className="bg-white shadow-sm py-4 px-4 flex items-center justify-between sticky top-0 z-10 md:hidden">
      <div className="flex items-center">
        <span className="material-icons text-primary mr-2">fitness_center</span>
        <h1 className="text-xl font-bold text-primary">FitTrack</h1>
      </div>
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1">
              <span className="material-icons text-gray-500">notifications</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <div className="p-3 border-b border-gray-100">
              <h3 className="font-medium">Notifications</h3>
            </div>
            <div className="p-2 text-center text-sm text-gray-500">
              <p>No new notifications</p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 ml-3">
              <img
                src={user?.avatar || "https://via.placeholder.com/40"}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="p-2 border-b border-gray-100">
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-gray-500">{user?.email || ""}</p>
            </div>
            <DropdownMenuItem asChild>
              <a href="/settings" className="cursor-pointer">
                <span className="material-icons text-sm mr-2">settings</span>
                Settings
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/about" className="cursor-pointer">
                <span className="material-icons text-sm mr-2">info</span>
                About
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
