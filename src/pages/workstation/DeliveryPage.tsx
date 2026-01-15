import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, MapPin, Clock, CheckCircle, Package, Search, Filter } from "lucide-react";

interface Delivery {
  id: string;
  customer: string;
  address: string;
  status: "in_transit" | "pending" | "delivered";
  driver: string;
  eta: string;
}

const deliveries: Delivery[] = [
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

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-3 sm:p-4 pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-7 w-12" />
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DeliveriesSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="space-y-1 text-right">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DeliveryPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const isLoading = useLoading(1000);

  const filteredDeliveries = deliveries.filter(d => 
    (d.customer.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "all" || d.status === statusFilter)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Delivered</Badge>;
      case "in_transit":
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">In Transit</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Delivery Management</h1>
          <p className="text-sm text-muted-foreground">Track and manage deliveries</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto">
          <Truck className="mr-2 h-4 w-4" />
          New Delivery
        </Button>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-3 sm:p-4 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search deliveries..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
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
        <CardContent className="p-4 pt-0">
          {isLoading ? (
            <DeliveriesSkeleton />
          ) : (
            <div className="space-y-3">
              {filteredDeliveries.map((delivery) => (
                <div key={delivery.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border rounded-lg transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 rounded-lg bg-muted shrink-0">
                      <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{delivery.customer}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3 shrink-0" /> {delivery.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-10 sm:pl-0">
                    <div className="text-right">
                      <p className="text-sm font-medium">{delivery.driver}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">ETA: {delivery.eta}</p>
                    </div>
                    {getStatusBadge(delivery.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
