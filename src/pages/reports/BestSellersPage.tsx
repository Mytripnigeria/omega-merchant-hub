import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, ShoppingBag } from "lucide-react";

const BestSellersPage = () => {
  const bestSellers = [
    { rank: 1, name: "Signature Burger", category: "Main Course", sold: 1250, revenue: 18750 },
    { rank: 2, name: "Caesar Salad", category: "Salads", sold: 980, revenue: 11760 },
    { rank: 3, name: "Margherita Pizza", category: "Pizza", sold: 875, revenue: 13125 },
    { rank: 4, name: "Chocolate Cake", category: "Desserts", sold: 720, revenue: 5760 },
    { rank: 5, name: "Iced Latte", category: "Beverages", sold: 650, revenue: 3250 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Best Sellers</h1>
        <p className="text-muted-foreground">Top performing products by sales volume</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Product</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">Signature Burger</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Units Sold</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">4,475</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">$52,645</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Top 5 Best Sellers</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bestSellers.map((item) => (
              <div key={item.rank} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Badge variant={item.rank <= 3 ? "default" : "secondary"}>#{item.rank}</Badge>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{item.sold.toLocaleString()} sold</p>
                  <p className="text-sm text-muted-foreground">${item.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BestSellersPage;
