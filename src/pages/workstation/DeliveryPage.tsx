import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, MapPin, Clock, CheckCircle, Package } from "lucide-react";

const DeliveryPage = () => {
  const deliveries = [
    { id: "DEL001", customer: "John Doe", address: "123 Main St", status: "in_transit", driver: "Mike", eta: "15 min" },
    { id: "DEL002", customer: "Jane Smith", address: "456 Oak Ave", status: "pending", driver: "Unassigned", eta: "-" },
    { id: "DEL003", customer: "Bob Wilson", address: "789 Pine Rd", status: "delivered", driver: "Sarah", eta: "Completed" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Delivery Management</h1>
          <p className="text-muted-foreground">Track and manage deliveries</p>
        </div>
        <Button><Truck className="mr-2 h-4 w-4" /> New Delivery</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">8</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">12</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Delivered Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">45</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">28 min</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Active Deliveries</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Truck className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{delivery.customer}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {delivery.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm">{delivery.driver}</p>
                    <p className="text-sm text-muted-foreground">ETA: {delivery.eta}</p>
                  </div>
                  <Badge variant={delivery.status === "delivered" ? "default" : delivery.status === "in_transit" ? "secondary" : "outline"}>
                    {delivery.status.replace("_", " ")}
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

export default DeliveryPage;
