import { useState } from "react";
import { 
  Bell, 
  Search, 
  Maximize, 
  Minimize, 
  User, 
  Settings, 
  LogOut,
  Moon,
  Sun,
  HelpCircle,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}

export function Header({ onToggleFullscreen, isFullscreen }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders, products, customers..."
            className="w-80 bg-muted pl-10 placeholder:text-muted-foreground focus:bg-background"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-secondary px-1.5 py-0.5 text-xs text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Fullscreen Toggle */}
        <Button variant="ghost" size="icon" onClick={onToggleFullscreen}>
          {isFullscreen ? (
            <Minimize className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Maximize className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>

        {/* Help */}
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="space-y-2 p-2">
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm font-medium">New order #OMG-2847</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm font-medium">Low stock alert: Jollof Rice</p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm font-medium">Staff check-in: Adaeze O.</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  AO
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium">Adaeze Okonkwo</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
