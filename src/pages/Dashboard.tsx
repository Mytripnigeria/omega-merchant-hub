import { 
  TrendingUp, 
  TrendingDown,
  ShoppingCart, 
  Users, 
  DollarSign,
  ArrowUpRight,
  MoreHorizontal,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { useLoading } from "@/hooks/use-loading";
import { useStore } from "@/contexts/StoreContext";
import { RecentOrders } from "@/components/dashboard/RecentOrders";

const chartData = [
  { name: "Mon", value: 245 },
  { name: "Tue", value: 312 },
  { name: "Wed", value: 289 },
  { name: "Thu", value: 378 },
  { name: "Fri", value: 456 },
  { name: "Sat", value: 512 },
  { name: "Sun", value: 398 },
];

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  isLoading?: boolean;
}

function StatCard({ title, value, change, trend, icon, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-2 min-w-0 flex-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 rounded-full flex-shrink-0" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{title}</p>
            <p className="text-xl sm:text-2xl font-semibold tracking-tight truncate">{value}</p>
            <div className="flex items-center gap-1 text-xs sm:text-sm flex-wrap">
              {trend === "up" ? (
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
              ) : (
                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
              )}
              <span className={trend === "up" ? "text-green-600" : "text-red-600"}>
                {change}
              </span>
              <span className="text-muted-foreground hidden sm:inline">vs last period</span>
            </div>
          </div>
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-muted flex-shrink-0">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-[180px] sm:h-[240px] flex items-center justify-center">
      <div className="w-full h-full flex flex-col justify-end px-4 gap-2">
        <div className="flex items-end justify-between gap-2 h-full">
          {[40, 60, 50, 75, 85, 95, 70].map((height, i) => (
            <Skeleton 
              key={i} 
              className="flex-1 rounded-t" 
              style={{ height: `${height}%` }} 
            />
          ))}
        </div>
        <div className="flex justify-between">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <Skeleton key={day} className="h-3 w-6" />
          ))}
        </div>
      </div>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <>
      {/* Mobile skeleton */}
      <div className="block sm:hidden divide-y divide-border">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>

      {/* Desktop skeleton */}
      <div className="hidden sm:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Order ID", "Customer", "Status", "Total", "Time"].map((header) => (
                <th key={header} className="text-left p-4 first:pl-6 last:pr-6">
                  <Skeleton className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="p-4 pl-6"><Skeleton className="h-4 w-20" /></td>
                <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                <td className="p-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                <td className="p-4 pr-6"><Skeleton className="h-4 w-12" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function Dashboard() {
  const isLoading = useLoading(1200);
  const { isAllStoresMode, currentStore } = useStore();

  // Dynamic stats based on mode (master = combined data)
  const masterMultiplier = isAllStoresMode ? 3 : 1;
  const revenueValue = `₦${(2.59 * masterMultiplier).toFixed(2)}M`;
  const ordersValue = `${Math.round(489 * masterMultiplier)}`;
  const customersValue = `${Math.round(1284 * masterMultiplier).toLocaleString()}`;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Dashboard</h1>
            {isAllStoresMode && (
              <Badge variant="secondary" className="gap-1">
                <Building2 className="h-3 w-3" />
                Master Insights
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {isAllStoresMode 
              ? "Combined performance across all stores" 
              : `Overview of ${currentStore?.name || "your restaurant"} performance`}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Select defaultValue="7d">
            <SelectTrigger className="w-full sm:w-36 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9 w-9 p-0 sm:w-auto sm:px-3">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Grid - 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={revenueValue}
          change="+12.5%"
          trend="up"
          icon={<DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Orders"
          value={ordersValue}
          change="+8.2%"
          trend="up"
          icon={<ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Customers"
          value={customersValue}
          change="+23.1%"
          trend="up"
          icon={<Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Avg Order"
          value="₦5,300"
          change="-2.3%"
          trend="down"
          icon={<TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />}
          isLoading={isLoading}
        />
      </div>

      {/* Charts Row - stacked on mobile, 2 cols on desktop */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 sm:px-6">
            <div>
              <CardTitle className="text-sm sm:text-base font-medium">Revenue</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">Daily revenue trend</p>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground h-8 w-8 p-0">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <div className="h-[180px] sm:h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                      tickFormatter={(value) => `${value}k`}
                      width={35}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`₦${value}k`, "Revenue"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(217, 91%, 60%)"
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 sm:px-6">
            <div>
              <CardTitle className="text-sm sm:text-base font-medium">Orders</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">Daily order count</p>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground h-8 w-8 p-0">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <div className="h-[180px] sm:h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                      width={35}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [value, "Orders"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(142, 76%, 36%)"
                      strokeWidth={2}
                      fill="url(#ordersGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <RecentOrders />
    </div>
  );
}