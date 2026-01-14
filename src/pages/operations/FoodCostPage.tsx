import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingDown, Utensils, PieChart } from "lucide-react";

const FoodCostPage = () => {
  const costBreakdown = [
    { category: "Proteins", cost: 12500, percentage: 35 },
    { category: "Vegetables", cost: 5000, percentage: 14 },
    { category: "Dairy", cost: 3500, percentage: 10 },
    { category: "Beverages", cost: 8000, percentage: 22 },
    { category: "Other", cost: 6800, percentage: 19 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Food Cost Analysis</h1>
        <p className="text-muted-foreground">Monitor and optimize food costs</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Food Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">$35,800</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Food Cost %</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">28.5%</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">vs Target</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-500">-1.5%</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Items Tracked</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">156</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Cost Breakdown by Category</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {costBreakdown.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.category}</span>
                  <span>${item.cost.toLocaleString()} ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodCostPage;
