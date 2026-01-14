import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, TrendingUp, TrendingDown } from "lucide-react";

const CategoryReportPage = () => {
  const categories = [
    { name: "Main Course", sales: 45000, orders: 1200, growth: 15, trend: "up" },
    { name: "Beverages", sales: 18500, orders: 2100, growth: 8, trend: "up" },
    { name: "Appetizers", sales: 12000, orders: 850, growth: -3, trend: "down" },
    { name: "Desserts", sales: 9500, orders: 620, growth: 22, trend: "up" },
    { name: "Salads", sales: 7800, orders: 480, growth: 5, trend: "up" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Category Report</h1>
        <p className="text-muted-foreground">Sales performance by product category</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">12</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">Main Course</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">$92,800</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Category Performance</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{category.name}</p>
                  <p className="text-sm text-muted-foreground">{category.orders.toLocaleString()} orders</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold">${category.sales.toLocaleString()}</span>
                  <Badge variant={category.trend === "up" ? "default" : "destructive"} className="flex items-center gap-1">
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
};

export default CategoryReportPage;
