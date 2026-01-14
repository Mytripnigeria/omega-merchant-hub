import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Award, ShoppingBag, Download, Calendar } from "lucide-react";

export default function BestSellersPage() {
  const [period, setPeriod] = useState("month");

  const bestSellers = [
    { rank: 1, name: "Signature Burger", category: "Main Course", sold: 1250, revenue: 18750, growth: 12 },
    { rank: 2, name: "Caesar Salad", category: "Salads", sold: 980, revenue: 11760, growth: 8 },
    { rank: 3, name: "Margherita Pizza", category: "Pizza", sold: 875, revenue: 13125, growth: -3 },
    { rank: 4, name: "Chocolate Cake", category: "Desserts", sold: 720, revenue: 5760, growth: 15 },
    { rank: 5, name: "Iced Latte", category: "Beverages", sold: 650, revenue: 3250, growth: 22 },
    { rank: 6, name: "Fish & Chips", category: "Main Course", sold: 580, revenue: 8700, growth: 5 },
    { rank: 7, name: "Garlic Bread", category: "Appetizers", sold: 520, revenue: 2600, growth: -2 },
    { rank: 8, name: "Tiramisu", category: "Desserts", sold: 480, revenue: 4320, growth: 18 },
  ];

  const stats = [
    { label: "Top Product", value: "Signature Burger", icon: Award },
    { label: "Total Units Sold", value: "4,475", icon: ShoppingBag },
    { label: "Total Revenue", value: "$52,645", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Best Sellers</h1>
          <p className="text-muted-foreground">Top performing products by sales volume</p>
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
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bestSellers.map((item) => (
              <div 
                key={item.rank} 
                className="flex items-center justify-between p-4 border rounded-lg transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <Badge 
                    variant={item.rank <= 3 ? "default" : "secondary"}
                    className="w-8 h-8 rounded-full flex items-center justify-center p-0"
                  >
                    {item.rank}
                  </Badge>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold">{item.sold.toLocaleString()} sold</p>
                    <p className="text-sm text-muted-foreground">${item.revenue.toLocaleString()}</p>
                  </div>
                  <Badge 
                    variant={item.growth >= 0 ? "default" : "destructive"} 
                    className="min-w-[60px] justify-center"
                  >
                    {item.growth >= 0 ? "+" : ""}{item.growth}%
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
