import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Settings,
  Store,
  Truck,
  Receipt,
  Gift,
  ClipboardList,
  BarChart3,
  Calendar,
  Plug,
  Wallet,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building2,
  UserCog,
  Boxes,
  FileText,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
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
      { title: "Stock Transfer", href: "/procurement/transfer" },
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
      { title: "Best Sellers", href: "/reports/best-sellers" },
      { title: "Daily Sales", href: "/reports/daily-sales" },
      { title: "Category Report", href: "/reports/categories" },
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
      { title: "Tables", href: "/workstation/tables" },
      { title: "Messages", href: "/workstation/messages" },
      { title: "Training", href: "/workstation/training" },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    children: [
      { title: "Stores", href: "/settings/stores" },
      { title: "Payment Methods", href: "/settings/payments" },
      { title: "Delivery Methods", href: "/settings/delivery" },
      { title: "Notifications", href: "/settings/notifications" },
      { title: "Business Profile", href: "/settings/profile" },
      { title: "Tax Settings", href: "/settings/tax" },
      { title: "Team & Roles", href: "/settings/team" },
    ],
  },
];

function NavMenuItem({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = item.href 
    ? location.pathname === item.href 
    : item.children?.some(child => location.pathname === child.href);

  if (item.children) {
    return (
      <Collapsible open={isOpen && !collapsed} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-sidebar-accent",
              isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground",
              collapsed && "justify-center px-2"
            )}
          >
            <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.title}</span>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "rotate-180"
                )} />
              </>
            )}
          </button>
        </CollapsibleTrigger>
        {!collapsed && (
          <CollapsibleContent className="space-y-1 pl-8 pt-1">
            {item.children.map((child) => (
              <Link
                key={child.href}
                to={child.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition-all hover:bg-sidebar-accent",
                  location.pathname === child.href
                    ? "bg-sidebar-accent text-primary"
                    : "text-sidebar-foreground"
                )}
              >
                {child.title}
              </Link>
            ))}
          </CollapsibleContent>
        )}
      </Collapsible>
    );
  }

  return (
    <Link
      to={item.href!}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-sidebar-accent",
        isActive ? "bg-sidebar-accent text-primary" : "text-sidebar-foreground",
        collapsed && "justify-center px-2"
      )}
    >
      <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
      {!collapsed && <span>{item.title}</span>}
    </Link>
  );
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">OMEGA OS</h1>
              <p className="text-xs text-muted-foreground">Merchant</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Store Selector */}
      {!collapsed && (
        <div className="border-b border-sidebar-border p-3">
          <button className="flex w-full items-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2 text-sm hover:bg-muted">
            <Store className="h-4 w-4 text-primary" />
            <span className="flex-1 text-left text-foreground">Lekki Phase 1</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavMenuItem key={item.title} item={item} collapsed={collapsed} />
          ))}
        </nav>
      </ScrollArea>

      {/* Collapse Button */}
      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-center text-muted-foreground hover:text-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
