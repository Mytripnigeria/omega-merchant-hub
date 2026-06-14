import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  Store,
  Truck,
  Gift,
  ClipboardList,
  BarChart3,
  Calendar,
  Plug,
  Wallet,
  ChevronRight,
  UserCog,
  Boxes,
  Monitor,
  Search,
  X,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { StoreSelector } from "@/components/store/StoreSelector";
import { useBusiness } from "@/hooks/api/use-settings";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

interface NavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    children: [
      { title: "All Orders", href: "/orders" },
      { title: "Transactions", href: "/orders/transactions" },
      { title: "Registers", href: "/orders/registers" },
      { title: "Account Balancing", href: "/orders/account" },
    ],
  },
  {
    title: "Stocks",
    icon: Package,
    children: [
      { title: "Products", href: "/stocks/products" },
      { title: "Categories", href: "/stocks/categories" },
      { title: "Ingredients", href: "/stocks/ingredients" },
      { title: "Add-ons", href: "/stocks/addons" },
      { title: "Combos", href: "/stocks/combos" },
    ],
  },
  {
    title: "Procurement",
    icon: Boxes,
    children: [
      { title: "Inventory Locations", href: "/procurement/locations" },
      { title: "Inventories", href: "/procurement/inventories" },
      { title: "Equipment", href: "/procurement/equipment" },
      { title: "Stock Transfer", href: "/procurement/transfers" },
    ],
  },
  {
    title: "Suppliers",
    href: "/suppliers",
    icon: Truck,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Marketing",
    icon: Gift,
    children: [
      { title: "Discount Codes", href: "/marketing/discounts" },
      { title: "Loyalty Offers", href: "/marketing/loyalty" },
      { title: "Referrals", href: "/marketing/referrals" },
    ],
  },
  {
    title: "Operations",
    icon: ClipboardList,
    children: [
      { title: "Tables", href: "/operations/tables" },
      { title: "Checklists", href: "/operations/checklists" },
      { title: "KPI Targets", href: "/operations/kpi" },
      { title: "Expenses", href: "/operations/expenses" },
      { title: "Food Cost %", href: "/operations/food-cost" },
      { title: "Waste Management", href: "/operations/waste" },
    ],
  },
  {
    title: "HR",
    icon: UserCog,
    children: [
      { title: "Staff Members", href: "/hr/staff" },
      { title: "Roles", href: "/hr/roles" },
      { title: "Shift Schedule", href: "/hr/shifts" },
      { title: "Payslips", href: "/hr/payslips" },
    ],
  },
  {
    title: "Reports",
    icon: BarChart3,
    children: [
      { title: "Download Reports", href: "/reports/download" },
      { title: "Best Sellers", href: "/reports/bestsellers" },
      { title: "Daily Sales", href: "/reports/daily-sales" },
      { title: "Category Report", href: "/reports/category" },
      { title: "Stock Report", href: "/reports/stock" },
    ],
  },
  {
    title: "Bookings",
    icon: Calendar,
    children: [
      { title: "Reservations", href: "/bookings/reservations" },
      { title: "Events", href: "/bookings/events" },
      { title: "Calendar", href: "/bookings/calendar" },
    ],
  },
  {
    title: "Payouts",
    href: "/payouts",
    icon: Wallet,
  },
  {
    title: "Storefront",
    icon: Store,
    children: [
      { title: "Theme", href: "/storefront/theme" },
      { title: "Pages", href: "/storefront/pages" },
      { title: "Feature Banners", href: "/storefront/banners" },
      { title: "Settings", href: "/storefront/settings" },
    ],
  },
  {
    title: "Plugins",
    icon: Plug,
    children: [
      { title: "Omnichannel", href: "/plugins/omnichannel" },
      { title: "Integrations", href: "/plugins/integrations" },
    ],
  },
  {
    title: "Workstation",
    icon: Monitor,
    children: [
      { title: "Users", href: "/workstation/users" },
      { title: "Shifts", href: "/workstation/shifts" },
      { title: "Activity Log", href: "/workstation/activity" },
      { title: "Delivery", href: "/workstation/delivery" },
      { title: "Settings", href: "/workstation/settings" },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    children: [
      { title: "General", href: "/settings" },
    ],
  },
];

interface NavMenuItemProps {
  item: NavItem;
  onNavigate?: () => void;
  expandedItem: string | null;
  onExpand: (title: string | null) => void;
  collapsed?: boolean;
}

function NavMenuItem({ item, onNavigate, expandedItem, onExpand, collapsed }: NavMenuItemProps) {
  const location = useLocation();
  
  const isActive = item.href 
    ? location.pathname === item.href 
    : item.children?.some(child => location.pathname === child.href);

  const isChildActive = (href: string) => location.pathname === href;
  
  const isOpen = expandedItem === item.title;

  // Auto-expand if a child is active on mount
  useEffect(() => {
    if (item.children?.some(child => location.pathname === child.href)) {
      onExpand(item.title);
    }
  }, []);

  const handleToggle = () => {
    onExpand(isOpen ? null : item.title);
  };

  // Collapsed state - show only icons with tooltips
  if (collapsed) {
    const firstChildHref = item.children?.[0]?.href || item.href || "#";
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={firstChildHref}
            onClick={onNavigate}
            className={cn(
              "flex items-center justify-center rounded-md p-2 transition-colors",
              isActive 
                ? "bg-accent text-foreground" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {item.title}
        </TooltipContent>
      </Tooltip>
    );
  }

  if (item.children) {
    return (
      <Collapsible open={isOpen} onOpenChange={handleToggle}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
              isActive 
                ? "bg-accent text-accent-foreground font-medium" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </div>
            <ChevronRight className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-90"
            )} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1 space-y-1 pl-10">
          {item.children.map((child) => (
            <Link
              key={child.href}
              to={child.href}
              onClick={onNavigate}
              className={cn(
                "block rounded-md px-3 py-2 text-sm transition-colors",
                isChildActive(child.href)
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {child.title}
            </Link>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link
      to={item.href!}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive 
          ? "bg-accent text-foreground font-medium" 
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <item.icon className="h-4 w-4" />
      <span>{item.title}</span>
    </Link>
  );
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileOpenChange }: SidebarProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { data: business } = useBusiness();
  
  const handleNavigate = () => {
    onMobileOpenChange?.(false);
  };

  const sidebarContent = (
    <>
      {/* Store Selector */}
      <div className="p-3 border-b border-border">
        <StoreSelector />
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="h-9 bg-muted/50 pl-9 text-sm border-0"
          />
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 pb-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavMenuItem 
              key={item.title} 
              item={item} 
              onNavigate={handleNavigate}
              expandedItem={expandedItem}
              onExpand={setExpandedItem}
            />
          ))}
        </nav>
      </ScrollArea>
    </>
  );

  const collapsedContent = (
    <>
      {/* Collapsed Logo */}
      <div className="flex items-center justify-center p-3 border-b border-border">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-foreground">
          <span className="text-xs font-bold text-background">Ω</span>
        </div>
      </div>

      {/* Collapsed Search Icon */}
      <div className="flex items-center justify-center p-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Search className="h-4 w-4 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Search</TooltipContent>
        </Tooltip>
      </div>

      {/* Collapsed Navigation */}
      <ScrollArea className="flex-1 px-2 pb-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavMenuItem 
              key={item.title} 
              item={item} 
              onNavigate={handleNavigate}
              expandedItem={expandedItem}
              onExpand={setExpandedItem}
              collapsed
            />
          ))}
        </nav>
      </ScrollArea>
    </>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-80 max-w-[85vw] p-0">
          <aside className="flex h-full flex-col bg-background">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-foreground">
                  <span className="text-xs font-bold text-background">Ω</span>
                </div>
                <span className="text-sm font-medium truncate">
                  {business?.name ?? "—"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onMobileOpenChange?.(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {sidebarContent}
          </aside>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-30 hidden md:flex h-screen flex-col border-r border-border bg-background transition-all duration-300",
          collapsed ? "w-14" : "w-64"
        )}
      >
        {collapsed ? collapsedContent : sidebarContent}
        
        {/* Toggle Button */}
        <div className={cn(
          "border-t border-border p-2",
          collapsed ? "flex justify-center" : "px-3"
        )}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={collapsed ? "icon" : "sm"}
                className={cn(
                  "h-8 text-muted-foreground hover:text-foreground",
                  collapsed ? "w-8" : "w-full justify-start gap-2"
                )}
                onClick={onToggle}
              >
                {collapsed ? (
                  <PanelLeft className="h-4 w-4" />
                ) : (
                  <>
                    <PanelLeftClose className="h-4 w-4" />
                    <span className="text-xs">Collapse</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            )}
          </Tooltip>
        </div>
      </aside>
    </>
  );
}
