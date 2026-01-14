import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingDown, Utensils, PieChart, Download } from "lucide-react";

const FoodCostPage = () => {
  const costBreakdown = [
    { category: "Proteins", cost: 12500, percentage: 35, trend: "+2.1%" },
    { category: "Vegetables", cost: 5000, percentage: 14, trend: "-1.5%" },
    { category: "Dairy", cost: 3500, percentage: 10, trend: "+0.8%" },
    { category: "Beverages", cost: 8000, percentage: 22, trend: "-0.3%" },
    { category: "Other", cost: 6800, percentage: 19, trend: "+1.2%" },
  ];

  const stats = [
    { label: "Total Food Cost", value: "$35,800", icon: DollarSign },
    { label: "Food Cost %", value: "28.5%", icon: PieChart },
    { label: "vs Target", value: "-1.5%", icon: TrendingDown, positive: true },
    { label: "Items Tracked", value: "156", icon: Utensils },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Food Cost Analysis</h1>
          <p className="text-sm text-muted-foreground">Monitor and optimize food costs</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="this-month">
            <SelectTrigger className="w-[140px] h-9 bg-muted/50 border-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-semibold ${stat.positive ? "text-green-600" : ""}`}>
                    {stat.value}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Cost Breakdown by Category</h3>
            <span className="text-xs text-muted-foreground">Target: 30%</span>
          </div>
          <div className="space-y-4">
            {costBreakdown.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.category}</span>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs ${item.trend.startsWith("+") ? "text-red-500" : "text-green-500"}`}>
                      {item.trend}
                    </span>
                    <span className="text-sm text-muted-foreground w-24 text-right">
                      ${item.cost.toLocaleString()}
                    </span>
                    <span className="text-sm font-medium w-12 text-right">{item.percentage}%</span>
                  </div>
                </div>
                <Progress value={item.percentage} className="h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Cost Optimization Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                Protein costs are 2.1% higher - consider alternative suppliers
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                Vegetable costs decreased due to seasonal pricing
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                Review portion sizes to maintain target margins
              </li>
            </ul>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Monthly Comparison</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Month</span>
                <span className="font-medium">$37,200</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">This Month</span>
                <span className="font-medium">$35,800</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
                <span className="text-muted-foreground">Savings</span>
                <span className="font-medium text-green-600">$1,400 (3.8%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FoodCostPage;
