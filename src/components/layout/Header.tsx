import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { canView, moduleForPath } from "@/lib/permissions";
import {
  Bell,
  Search,
  Settings,
  LogOut,
  HelpCircle,
  ChevronDown,
  Moon,
  Sun,
  Monitor,
  Maximize,
  Minimize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/hooks/api/use-settings";
import { toast } from "sonner";

const mainNavItems = [
  { title: "Overview", href: "/dashboard" },
  { title: "Orders", href: "/orders" },
  { title: "Products", href: "/stocks/products" },
  { title: "Customers", href: "/customers" },
  { title: "Reports", href: "/reports/daily-sales" },
  { title: "Settings", href: "/settings" },
];

function initialsOf(name: string | undefined | null, fallback = "??"): string {
  if (!name) return fallback;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { admin, isLoading: adminLoading, logout, permissions } = useAuth();

  // The sidebar hides modules a restricted staff login can't reach; these tabs
  // must obey the same rule or they just advertise links that 403. Same
  // moduleForPath/canView pair the sidebar uses, so the two can't drift.
  const navItems = useMemo(
    () =>
      mainNavItems.filter((item) => {
        const module = moduleForPath(item.href);
        return module ? canView(permissions, module) : true;
      }),
    [permissions]
  );
  const { data: business } = useBusiness();

  const isActive = (href: string) => {
    if (href === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out");
    } catch (e) {
      toast.error((e as Error).message ?? "Couldn't sign out");
    } finally {
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      {/* Top Bar */}
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left: Logo & Project */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link to="/dashboard" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden">
  <img
    src="/favicon.png"
    alt="Logo"
    className="h-full w-full object-contain"
  />
</div>
          </Link>
          <span className="text-muted-foreground hidden sm:inline">/</span>
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex-shrink-0" />
            <span className="text-sm font-medium truncate max-w-[140px] sm:max-w-none">
              {business?.name ?? "—"}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="h-9 w-64 bg-muted/50 pl-9 text-sm border-0 focus-visible:ring-1"
            />
          </div>

          <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-muted-foreground">
            Feedback
          </Button>

          {/* Fullscreen Toggle - Desktop only */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 hidden lg:inline-flex"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Maximize className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-muted-foreground" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-muted-foreground" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light
                {theme === "light" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
                {theme === "dark" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                System
                {theme === "system" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Bell className="h-4 w-4 text-muted-foreground" />
          </Button>

          {/* Help */}
          <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:inline-flex">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-[10px] text-white">
                    {initialsOf(admin?.fullName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {adminLoading && !admin ? (
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {admin?.fullName ?? "Signed in"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {admin?.email ?? ""}
                    </span>
                  </div>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={handleLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex h-10 items-center gap-1 px-4 sm:px-6 overflow-x-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "relative px-3 py-2 text-sm transition-colors shrink-0 whitespace-nowrap",
              isActive(item.href)
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.title}
            {isActive(item.href) && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground" />
            )}
          </Link>
        ))}
      </nav>
    </header>
  );
}
