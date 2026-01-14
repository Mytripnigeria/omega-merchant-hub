import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  DollarSign,
  Package,
  Clock
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { TopProducts } from "@/components/dashboard/TopProducts";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { LiveActivity } from "@/components/dashboard/LiveActivity";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening at <span className="text-primary">Lekki Phase 1</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Revenue"
          value="₦512,000"
          change="+12.5%"
          changeType="positive"
          description="vs yesterday"
          icon={DollarSign}
        />
        <StatCard
          title="Orders"
          value="98"
          change="+8"
          changeType="positive"
          description="vs yesterday"
          icon={ShoppingCart}
        />
        <StatCard
          title="Customers"
          value="1,284"
          change="+23"
          changeType="positive"
          description="this week"
          icon={Users}
        />
        <StatCard
          title="Avg Order Value"
          value="₦5,224"
          change="-2.3%"
          changeType="negative"
          description="vs last week"
          icon={TrendingUp}
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <TopProducts />
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrders />

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <QuickActions />
        <LiveActivity />
      </div>
    </div>
  );
}
