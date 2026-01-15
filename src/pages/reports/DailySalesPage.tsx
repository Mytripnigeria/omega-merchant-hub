import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, TrendingUp, TrendingDown, Download, DollarSign, ShoppingCart, Clock } from "lucide-react";
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
  const stats = [
    { label: "Today's Revenue", value: "₦1.47M", icon: DollarSign, change: "+12.5%", positive: true },
    { label: "Total Orders", value: "191", icon: ShoppingCart, change: "+8", positive: true },
    { label: "Avg Order", value: "₦7,691", icon: TrendingUp, change: "-2.3%", positive: false },
    { label: "Peak Hour", value: "5:00 PM", icon: Clock, subtext: "₦220K" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Daily Sales</h1>
          <p className="text-sm text-muted-foreground">Track today's sales performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="today">
            <SelectTrigger className="w-[120px] h-9 bg-muted/50 border-0">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Two-column layout for desktop */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-xl font-semibold">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    {stat.change && (
                      <span className={`text-xs ${stat.positive ? "text-green-600" : "text-red-600"}`}>
                        {stat.change}
                      </span>
                    )}
                    {stat.subtext && (
                      <span className="text-xs text-muted-foreground">({stat.subtext})</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenue by Hour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
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
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#salesGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Hourly Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {hourlyData.map((hour) => (
                <div key={hour.time} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{hour.time}</p>
                    <p className="text-xs text-muted-foreground">{hour.orders} orders</p>
                  </div>
                  <p className="font-semibold text-sm">{hour.sales}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Comparison</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">vs Yesterday</span>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">+12.5%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">vs Last Week</span>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">+8.3%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">vs Last Month</span>
                <div className="flex items-center gap-1 text-red-600">
                  <TrendingDown className="h-4 w-4" />
                  <span className="font-medium">-2.1%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                View History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
