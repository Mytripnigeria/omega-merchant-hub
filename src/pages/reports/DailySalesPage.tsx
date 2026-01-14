import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, TrendingUp, Users } from "lucide-react";

const DailySalesPage = () => {
  const hourlyData = [
    { time: "9:00 AM", sales: 450, orders: 12 },
    { time: "10:00 AM", sales: 680, orders: 18 },
    { time: "11:00 AM", sales: 1200, orders: 32 },
    { time: "12:00 PM", sales: 2100, orders: 56 },
    { time: "1:00 PM", sales: 1850, orders: 49 },
    { time: "2:00 PM", sales: 920, orders: 24 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Daily Sales Report</h1>
          <p className="text-muted-foreground">Track today's sales performance</p>
        </div>
        <Button variant="outline"><Calendar className="mr-2 h-4 w-4" /> Select Date</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">$7,200</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">191</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">$37.70</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">vs Yesterday</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-500">+12%</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Hourly Breakdown</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hourlyData.map((hour) => (
              <div key={hour.time} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">{hour.time}</span>
                <div className="flex items-center gap-8">
                  <span>{hour.orders} orders</span>
                  <span className="font-bold">${hour.sales.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailySalesPage;
