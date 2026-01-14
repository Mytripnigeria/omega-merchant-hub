import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, MapPin, Clock, CheckCircle, Package, Search, Filter } from "lucide-react";

export default function DeliveryPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const deliveries = [
    { id: "DEL001", customer: "John Doe", address: "123 Main St", status: "in_transit", driver: "Mike", eta: "15 min" },
    { id: "DEL002", customer: "Jane Smith", address: "456 Oak Ave", status: "pending", driver: "Unassigned", eta: "-" },
    { id: "DEL003", customer: "Bob Wilson", address: "789 Pine Rd", status: "delivered", driver: "Sarah", eta: "Completed" },
    { id: "DEL004", customer: "Lisa Chen", address: "321 Elm St", status: "in_transit", driver: "Tom", eta: "25 min" },
  ];

  const stats = [
    { label: "Pending", value: "8", icon: Package },
    { label: "In Transit", value: "12", icon: Truck },
    { label: "Delivered Today", value: "45", icon: CheckCircle },
    { label: "Avg. Time", value: "28 min", icon: Clock },
  ];

  const filteredDeliveries = deliveries.filter(d => 
    (d.customer.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "all" || d.status === statusFilter)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Delivery Management</h1>
          <p className="text-muted-foreground">Track and manage deliveries</p>
        </div>
        <Button><Truck className="mr-2 h-4 w-4" /> New Delivery</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search deliveries..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredDeliveries.map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-4 border rounded-lg transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-muted">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{delivery.customer}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {delivery.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{delivery.driver}</p>
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
}
