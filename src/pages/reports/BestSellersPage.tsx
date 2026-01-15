import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Award, ShoppingBag, Download, Calendar, TrendingDown } from "lucide-react";

export default function BestSellersPage() {
  const [period, setPeriod] = useState("month");

  const bestSellers = [
    { rank: 1, name: "Signature Burger", category: "Main Course", sold: 1250, revenue: 18750, growth: 12 },
    { rank: 2, name: "Caesar Salad", category: "Salads", sold: 980, revenue: 11760, growth: 8 },
    { rank: 3, name: "Margherita Pizza", category: "Pizza", sold: 875, revenue: 13125, growth: -3 },
    { rank: 4, name: "Chocolate Cake", category: "Desserts", sold: 720, revenue: 5760, growth: 15 },
    { rank: 5, name: "Iced Latte", category: "Beverages", sold: 650, revenue: 3250, growth: 22 },
    { rank: 6, name: "Fish & Chips", category: "Main Course", sold: 580, revenue: 8700, growth: 5 },
  ];

  const stats = [
    { label: "Top Product", value: "Signature Burger", icon: Award },
    { label: "Total Sold", value: "4,475", icon: ShoppingBag },
    { label: "Revenue", value: "$52,645", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Best Sellers</h1>
          <p className="text-sm text-muted-foreground">Top performing products by sales volume</p>
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
                  <p className="text-lg font-semibold truncate">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Best Sellers List */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Top Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {bestSellers.map((item) => (
                <div 
                  key={item.rank} 
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={item.rank <= 3 ? "default" : "secondary"}
                      className="w-7 h-7 rounded-full flex items-center justify-center p-0 text-xs"
                    >
                      {item.rank}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="font-semibold text-sm">{item.sold.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">${item.revenue.toLocaleString()}</p>
                    </div>
                    <Badge 
                      variant={item.growth >= 0 ? "default" : "destructive"} 
                      className="min-w-[50px] justify-center text-xs"
                    >
                      {item.growth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {item.growth}%
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
              <CardTitle className="text-sm font-medium">Category Leaders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Main Course", "Beverages", "Desserts", "Salads"].map((category) => (
                <div key={category} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <span className="text-sm">{category}</span>
                  <Badge variant="secondary" className="text-xs">
                    {bestSellers.find(b => b.category === category)?.name || "—"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Growth Leaders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {bestSellers
                .filter(b => b.growth > 0)
                .sort((a, b) => b.growth - a.growth)
                .slice(0, 3)
                .map((item) => (
                  <div key={item.rank} className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <span className="text-sm font-medium">{item.name}</span>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                      +{item.growth}%
                    </Badge>
                  </div>
                ))}
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
