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
    { label: "Total Categories", value: categories.length.toString(), icon: FolderOpen },
    { label: "Top Category", value: "Main Course", icon: TrendingUp },
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Category Report</h1>
          <p className="text-muted-foreground">Sales performance by product category</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-muted">
                    <FolderOpen className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-muted-foreground">{category.orders.toLocaleString()} orders</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold">${category.sales.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {((category.sales / totalRevenue) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                  <Badge 
                    variant={category.trend === "up" ? "default" : "destructive"} 
                    className="gap-1 min-w-[60px] justify-center"
                  >
                    {category.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {category.growth > 0 ? "+" : ""}{category.growth}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
