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
      { title: "Variations", href: "/stocks/variations" },
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
      { title: "Checklists", href: "/operations/checklists" },
      { title: "KPI Targets", href: "/operations/kpi" },
      { title: "Expenses", href: "/operations/expenses" },
      { title: "Sales vs Target", href: "/operations/sales-target" },
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
}

function NavMenuItem({ item, onNavigate, expandedItem, onExpand }: NavMenuItemProps) {
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

export function Sidebar({ collapsed, mobileOpen, onMobileOpenChange }: SidebarProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  
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
                <span className="text-sm font-medium">omega-restaurant</span>
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
      {!collapsed && (
        <aside className="sticky top-0 hidden md:flex h-screen w-64 flex-col border-r border-border bg-background">
          {sidebarContent}
        </aside>
      )}
    </>
  );
}
