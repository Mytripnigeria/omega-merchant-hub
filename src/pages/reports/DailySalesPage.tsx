import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const chartData = [
  { time: "9 AM", sales: 45000 },
  { time: "10 AM", sales: 68000 },
  { time: "11 AM", sales: 120000 },
  { time: "12 PM", sales: 210000 },
  { time: "1 PM", sales: 185000 },
  { time: "2 PM", sales: 92000 },
  { time: "3 PM", sales: 156000 },
  { time: "4 PM", sales: 178000 },
  { time: "5 PM", sales: 220000 },
  { time: "6 PM", sales: 195000 },
];

const hourlyData = [
  { time: "9:00 AM", sales: "₦45,000", orders: 12, avgOrder: "₦3,750" },
  { time: "10:00 AM", sales: "₦68,000", orders: 18, avgOrder: "₦3,778" },
  { time: "11:00 AM", sales: "₦120,000", orders: 32, avgOrder: "₦3,750" },
  { time: "12:00 PM", sales: "₦210,000", orders: 56, avgOrder: "₦3,750" },
  { time: "1:00 PM", sales: "₦185,000", orders: 49, avgOrder: "₦3,776" },
  { time: "2:00 PM", sales: "₦92,000", orders: 24, avgOrder: "₦3,833" },
];

export default function DailySalesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Daily Sales</h1>
          <p className="text-sm text-muted-foreground">
            Track today's sales performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="today">
            <SelectTrigger className="w-40">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="custom">Custom Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Today's Revenue</p>
            <p className="text-2xl font-semibold">₦1,469,000</p>
            <div className="flex items-center gap-1 mt-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              +12.5% vs yesterday
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-semibold">191</p>
            <div className="flex items-center gap-1 mt-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              +8 vs yesterday
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg Order Value</p>
            <p className="text-2xl font-semibold">₦7,691</p>
            <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
              <TrendingDown className="h-4 w-4" />
              -2.3% vs yesterday
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Peak Hour</p>
            <p className="text-2xl font-semibold">5:00 PM</p>
            <p className="text-sm text-muted-foreground mt-1">₦220,000 revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-medium">Revenue by Hour</h3>
              <p className="text-sm text-muted-foreground">Today's sales trend</p>
            </div>
            <Button variant="ghost" size="sm">
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) => `₦${value/1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`₦${value.toLocaleString()}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Hourly Breakdown */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium mb-4">Hourly Breakdown</h3>
          <div className="space-y-3">
            {hourlyData.map((hour) => (
              <div key={hour.time} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <span className="font-medium">{hour.time}</span>
                <div className="flex items-center gap-8">
                  <span className="text-muted-foreground">{hour.orders} orders</span>
                  <span className="text-muted-foreground">Avg: {hour.avgOrder}</span>
                  <span className="font-semibold">{hour.sales}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
