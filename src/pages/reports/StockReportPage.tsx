import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, TrendingDown, CheckCircle } from "lucide-react";

const StockReportPage = () => {
  const stockItems = [
    { name: "Chicken Breast", current: 45, minimum: 20, status: "good" },
    { name: "Olive Oil", current: 8, minimum: 10, status: "low" },
    { name: "Tomatoes", current: 5, minimum: 15, status: "critical" },
    { name: "Pasta", current: 120, minimum: 50, status: "good" },
    { name: "Cheese", current: 22, minimum: 20, status: "good" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Stock Report</h1>
        <p className="text-muted-foreground">Inventory levels and stock status</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">248</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">215</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">25</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">8</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Stock Levels</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stockItems.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Min: {item.minimum} units</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold">{item.current} units</span>
                  <Badge 
                    variant={item.status === "good" ? "default" : item.status === "low" ? "secondary" : "destructive"}
                  >
                    {item.status}
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

export default StockReportPage;
