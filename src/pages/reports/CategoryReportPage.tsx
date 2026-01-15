import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderOpen, TrendingUp, TrendingDown, Download, Calendar, DollarSign } from "lucide-react";

export default function CategoryReportPage() {
  const [period, setPeriod] = useState("month");

  const categories = [
    { name: "Main Course", sales: 45000, orders: 1200, growth: 15, trend: "up" },
    { name: "Beverages", sales: 18500, orders: 2100, growth: 8, trend: "up" },
    { name: "Appetizers", sales: 12000, orders: 850, growth: -3, trend: "down" },
    { name: "Desserts", sales: 9500, orders: 620, growth: 22, trend: "up" },
    { name: "Salads", sales: 7800, orders: 480, growth: 5, trend: "up" },
    { name: "Pizza", sales: 6200, orders: 320, growth: -1, trend: "down" },
  ];

  const totalRevenue = categories.reduce((acc, c) => acc + c.sales, 0);
  const totalOrders = categories.reduce((acc, c) => acc + c.orders, 0);

  const stats = [
    { label: "Categories", value: categories.length.toString(), icon: FolderOpen },
    { label: "Total Orders", value: totalOrders.toLocaleString(), icon: TrendingUp },
    { label: "Revenue", value: `$${(totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Category Report</h1>
          <p className="text-sm text-muted-foreground">Sales performance by product category</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[130px] h-9 bg-muted/50 border-0">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
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
          <div className="grid gap-3 grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Category Performance */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Category Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <div 
                  key={category.name} 
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                      <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{category.name}</p>
                      <p className="text-xs text-muted-foreground">{category.orders.toLocaleString()} orders</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="font-semibold text-sm">${category.sales.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {((category.sales / totalRevenue) * 100).toFixed(1)}%
                      </p>
                    </div>
                    <Badge 
                      variant={category.trend === "up" ? "default" : "destructive"} 
                      className="min-w-[50px] justify-center text-xs gap-1"
                    >
                      {category.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {category.growth}%
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Revenue Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categories.slice(0, 4).map((category) => (
                <div key={category.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{category.name}</span>
                    <span className="font-medium">{((category.sales / totalRevenue) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${(category.sales / totalRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4 rounded-lg bg-primary/5">
                <FolderOpen className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="font-semibold">{categories[0].name}</p>
                <p className="text-2xl font-bold mt-1">${categories[0].sales.toLocaleString()}</p>
                <Badge className="mt-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  +{categories[0].growth}% growth
                </Badge>
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
                Compare Periods
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
