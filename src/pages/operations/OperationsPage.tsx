import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Monitor, Printer, Wifi, Bell, Clock, MapPin, 
  Truck, ChefHat, AlertTriangle, CheckCircle2, Settings
} from "lucide-react";
import { useStore } from "@/contexts/StoreContext";

export default function OperationsPage() {
  const { selectedStore } = useStore();
  const [kitchenDisplay, setKitchenDisplay] = useState(true);

  const devices = [
    { name: "Main POS Terminal", type: "POS", status: "online", lastSeen: "Now" },
    { name: "Kitchen Display 1", type: "KDS", status: "online", lastSeen: "Now" },
    { name: "Kitchen Display 2", type: "KDS", status: "offline", lastSeen: "2 hours ago" },
    { name: "Receipt Printer", type: "Printer", status: "online", lastSeen: "Now" },
    { name: "Label Printer", type: "Printer", status: "warning", lastSeen: "Low paper" },
  ];

  const deliveryZones = [
    { zone: "Zone A (0-3km)", fee: "$2.00", minOrder: "$15", time: "20-30 min", active: true },
    { zone: "Zone B (3-5km)", fee: "$4.00", minOrder: "$25", time: "30-45 min", active: true },
    { zone: "Zone C (5-8km)", fee: "$6.00", minOrder: "$35", time: "45-60 min", active: false },
  ];

  const kitchenStations = [
    { name: "Grill Station", orders: 5, status: "busy" },
    { name: "Fryer Station", orders: 3, status: "normal" },
    { name: "Salad Station", orders: 2, status: "idle" },
    { name: "Beverage Station", orders: 8, status: "busy" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Operations</h1>
          <p className="text-muted-foreground">Manage devices, kitchen, and delivery for {selectedStore?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            4 Devices Online
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            1 Warning
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="devices" className="space-y-6">
        <TabsList>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Devices
          </TabsTrigger>
          <TabsTrigger value="kitchen" className="flex items-center gap-2">
            <ChefHat className="h-4 w-4" />
            Kitchen
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Delivery
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Connected Devices</CardTitle>
                  <CardDescription>Manage your POS terminals, printers, and displays</CardDescription>
                </div>
                <Button>
                  <Wifi className="h-4 w-4 mr-2" />
                  Add Device
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {devices.map((device) => (
                  <div key={device.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        device.status === "online" ? "bg-green-100 text-green-600" :
                        device.status === "warning" ? "bg-yellow-100 text-yellow-600" :
                        "bg-red-100 text-red-600"
                      }`}>
                        {device.type === "POS" && <Monitor className="h-5 w-5" />}
                        {device.type === "KDS" && <Monitor className="h-5 w-5" />}
                        {device.type === "Printer" && <Printer className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-sm text-muted-foreground">{device.type} • {device.lastSeen}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={
                        device.status === "online" ? "default" :
                        device.status === "warning" ? "secondary" : "destructive"
                      }>
                        {device.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Printer className="h-5 w-5" />
                Print Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-print receipts</p>
                  <p className="text-sm text-muted-foreground">Print receipt for every order</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Kitchen tickets</p>
                  <p className="text-sm text-muted-foreground">Print kitchen order tickets</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Customer copy</p>
                  <p className="text-sm text-muted-foreground">Print additional customer receipt</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kitchen" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kitchenStations.map((station) => (
              <Card key={station.name}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <ChefHat className={`h-8 w-8 ${
                      station.status === "busy" ? "text-orange-500" :
                      station.status === "normal" ? "text-green-500" : "text-gray-400"
                    }`} />
                    <Badge variant={
                      station.status === "busy" ? "destructive" :
                      station.status === "normal" ? "default" : "secondary"
                    }>
                      {station.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold">{station.name}</h3>
                  <p className="text-2xl font-bold mt-1">{station.orders} orders</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Kitchen Display System</CardTitle>
                  <CardDescription>Configure order routing and display settings</CardDescription>
                </div>
                <Switch checked={kitchenDisplay} onCheckedChange={setKitchenDisplay} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Order sound alerts</p>
                  <p className="text-sm text-muted-foreground">Play sound for new orders</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-bump completed</p>
                  <p className="text-sm text-muted-foreground">Remove orders when all items done</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Warning time (minutes)</label>
                  <Input type="number" defaultValue="10" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Critical time (minutes)</label>
                  <Input type="number" defaultValue="15" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Zones
                  </CardTitle>
                  <CardDescription>Configure delivery areas and fees</CardDescription>
                </div>
                <Button>Add Zone</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deliveryZones.map((zone) => (
                  <div key={zone.zone} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <MapPin className={`h-5 w-5 ${zone.active ? "text-primary" : "text-muted-foreground"}`} />
                      <div>
                        <p className="font-medium">{zone.zone}</p>
                        <p className="text-sm text-muted-foreground">
                          Fee: {zone.fee} • Min: {zone.minOrder} • Est: {zone.time}
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked={zone.active} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Delivery Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default prep time (min)</label>
                  <Input type="number" defaultValue="15" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Buffer time (min)</label>
                  <Input type="number" defaultValue="5" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Driver tracking</p>
                  <p className="text-sm text-muted-foreground">Share live location with customers</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Contactless delivery</p>
                  <p className="text-sm text-muted-foreground">Default to contactless option</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Configuration</CardTitle>
              <CardDescription>Set up operational alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: "Low stock alert", desc: "Notify when inventory is low", enabled: true },
                { title: "Long wait times", desc: "Alert when orders exceed target time", enabled: true },
                { title: "Device offline", desc: "Notify when devices disconnect", enabled: true },
                { title: "End of day summary", desc: "Daily operations summary", enabled: false },
                { title: "Shift reminders", desc: "Remind staff of upcoming shifts", enabled: true },
              ].map((alert) => (
                <div key={alert.title} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.desc}</p>
                  </div>
                  <Switch defaultChecked={alert.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
