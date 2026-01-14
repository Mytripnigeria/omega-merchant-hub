import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart, Clock, ChefHat, CheckCircle2, AlertCircle, 
  Timer, Utensils, Package, User, Search, Filter
} from "lucide-react";
import { useStore } from "@/contexts/StoreContext";

export default function WorkstationPage() {
  const { currentStore } = useStore();
  const [search, setSearch] = useState("");

  const activeOrders = [
    { 
      id: "#1234", customer: "John D.", items: ["Classic Burger x2", "Fries", "Coke"], 
      status: "preparing", time: "5 min ago", type: "dine-in", table: "12"
    },
    { 
      id: "#1235", customer: "Sarah M.", items: ["Margherita Pizza", "Garlic Bread"], 
      status: "ready", time: "8 min ago", type: "pickup", table: null
    },
    { 
      id: "#1236", customer: "Mike R.", items: ["Caesar Salad", "Iced Tea x2"], 
      status: "new", time: "1 min ago", type: "delivery", table: null
    },
    { 
      id: "#1237", customer: "Lisa K.", items: ["Fish & Chips", "Coleslaw", "Lemonade"], 
      status: "preparing", time: "12 min ago", type: "dine-in", table: "5"
    },
  ];

  const kitchenQueue = [
    { id: "#1234", items: ["Classic Burger x2", "Fries"], station: "Grill", priority: "normal", elapsed: "5:23" },
    { id: "#1236", items: ["Caesar Salad"], station: "Salad", priority: "rush", elapsed: "1:45" },
    { id: "#1237", items: ["Fish & Chips", "Coleslaw"], station: "Fryer", priority: "normal", elapsed: "12:10" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500";
      case "preparing": return "bg-yellow-500";
      case "ready": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Workstation</h1>
          <p className="text-muted-foreground">Live order management for {currentStore?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="gap-1">
            <ShoppingCart className="h-3 w-3" />
            {activeOrders.length} Active Orders
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Timer className="h-3 w-3" />
            Avg: 8 min
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Order Board
          </TabsTrigger>
          <TabsTrigger value="kitchen" className="flex items-center gap-2">
            <ChefHat className="h-4 w-4" />
            Kitchen View
          </TabsTrigger>
          <TabsTrigger value="pickup" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Ready for Pickup
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search orders..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeOrders.map((order) => (
              <Card key={order.id} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 ${getStatusColor(order.status)}`} />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    <Badge variant={
                      order.status === "new" ? "default" :
                      order.status === "preparing" ? "secondary" : "outline"
                    }>
                      {order.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    {order.customer}
                    {order.table && <span>• Table {order.table}</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-sm">{item}</p>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {order.time}
                    </span>
                    <Badge variant="outline" className="text-xs">{order.type}</Badge>
                  </div>
                  <div className="flex gap-2">
                    {order.status === "new" && (
                      <Button size="sm" className="flex-1">Start</Button>
                    )}
                    {order.status === "preparing" && (
                      <Button size="sm" className="flex-1">Mark Ready</Button>
                    )}
                    {order.status === "ready" && (
                      <Button size="sm" variant="outline" className="flex-1">Complete</Button>
                    )}
                    <Button size="sm" variant="ghost">View</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="kitchen" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Kitchen Queue</CardTitle>
                  <CardDescription>Items waiting to be prepared</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="destructive">Rush: 1</Badge>
                  <Badge variant="secondary">Normal: 2</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {kitchenQueue.map((item) => (
                  <div 
                    key={`${item.id}-${item.station}`} 
                    className={`p-4 border rounded-lg ${item.priority === "rush" ? "border-red-500 bg-red-50 dark:bg-red-950" : ""}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{item.id}</span>
                        <Badge variant="outline">{item.station}</Badge>
                        {item.priority === "rush" && (
                          <Badge variant="destructive">RUSH</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Timer className="h-4 w-4" />
                        <span className={parseInt(item.elapsed) > 10 ? "text-red-500 font-bold" : ""}>
                          {item.elapsed}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        {item.items.map((itemName, i) => (
                          <p key={i} className="text-sm flex items-center gap-2">
                            <Utensils className="h-3 w-3" />
                            {itemName}
                          </p>
                        ))}
                      </div>
                      <Button size="sm">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Done
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-4">
            {["Grill", "Fryer", "Salad", "Beverage"].map((station) => (
              <Card key={station}>
                <CardContent className="pt-6 text-center">
                  <ChefHat className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <h3 className="font-semibold">{station} Station</h3>
                  <p className="text-2xl font-bold mt-1">
                    {kitchenQueue.filter(k => k.station === station).length}
                  </p>
                  <p className="text-sm text-muted-foreground">items in queue</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pickup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Ready for Pickup
              </CardTitle>
              <CardDescription>Orders waiting to be collected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeOrders.filter(o => o.status === "ready").map((order) => (
                  <div key={order.id} className="p-6 border-2 border-green-500 rounded-lg bg-green-50 dark:bg-green-950">
                    <div className="text-center space-y-2">
                      <CheckCircle2 className="h-12 w-12 mx-auto text-green-500" />
                      <h3 className="text-2xl font-bold">{order.id}</h3>
                      <p className="text-lg">{order.customer}</p>
                      <Badge variant="outline">{order.type}</Badge>
                      <div className="pt-4">
                        <Button className="w-full">Mark as Collected</Button>
                      </div>
                    </div>
                  </div>
                ))}
                {activeOrders.filter(o => o.status === "ready").length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4" />
                    <p>No orders ready for pickup</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
