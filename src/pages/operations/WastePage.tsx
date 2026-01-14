import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, TrendingDown, AlertTriangle, Plus } from "lucide-react";

const WastePage = () => {
  const wasteLog = [
    { id: 1, item: "Lettuce", quantity: "5 kg", reason: "Spoilage", cost: 25, date: "2024-01-15" },
    { id: 2, item: "Chicken Breast", quantity: "3 kg", reason: "Overproduction", cost: 45, date: "2024-01-15" },
    { id: 3, item: "Milk", quantity: "2 L", reason: "Expired", cost: 8, date: "2024-01-14" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Waste Management</h1>
          <p className="text-muted-foreground">Track and reduce food waste</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Log Waste</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Waste (MTD)</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">$1,250</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Waste %</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">3.2%</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">vs Last Month</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-500">-15%</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Items Logged</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">42</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Waste Log</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {wasteLog.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{item.item}</p>
                  <p className="text-sm text-muted-foreground">{item.quantity} • {item.reason}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-500">-${item.cost}</p>
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WastePage;
