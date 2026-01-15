import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Package, AlertTriangle, DollarSign, MapPin, MoreHorizontal } from "lucide-react";

export default function InventoriesPage() {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");

  const inventories = [
    { id: 1, name: "Flour", sku: "ING-001", quantity: 50, unit: "kg", location: "Main Kitchen", reorderLevel: 20, value: 150.00, status: "ok" },
    { id: 2, name: "Olive Oil", sku: "ING-002", quantity: 8, unit: "L", location: "Main Kitchen", reorderLevel: 10, value: 120.00, status: "low" },
    { id: 3, name: "Cheese", sku: "ING-003", quantity: 25, unit: "kg", location: "Cold Storage", reorderLevel: 15, value: 375.00, status: "ok" },
    { id: 4, name: "Tomatoes", sku: "ING-004", quantity: 5, unit: "kg", location: "Cold Storage", reorderLevel: 10, value: 25.00, status: "critical" },
    { id: 5, name: "Chicken", sku: "ING-005", quantity: 30, unit: "kg", location: "Cold Storage", reorderLevel: 20, value: 450.00, status: "ok" },
  ];

  const stats = [
    { label: "Total Items", value: "156", icon: Package },
    { label: "Low Stock", value: "12", icon: AlertTriangle, color: "text-yellow-600" },
    { label: "Total Value", value: "$12,450", icon: DollarSign },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Inventories</h1>
          <p className="text-sm text-muted-foreground">Manage stock levels across locations</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Inventory Item</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Item Name</Label><Input placeholder="Enter item name" /></div>
              <div className="space-y-2"><Label>SKU</Label><Input placeholder="SKU" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Quantity</Label><Input type="number" /></div>
                <div className="space-y-2"><Label>Unit</Label><Input placeholder="kg, L, pcs" /></div>
              </div>
              <Button className="w-full">Add Item</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Two-column layout for desktop */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid gap-3 grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <stat.icon className={`h-4 w-4 ${stat.color || "text-muted-foreground"}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search inventory..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9 h-9 bg-muted/50 border-0" 
              />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full sm:w-[160px] h-9 bg-muted/50 border-0">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="main">Main Kitchen</SelectItem>
                <SelectItem value="cold">Cold Storage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inventory Table */}
          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="text-xs font-medium text-muted-foreground">Item</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground hidden sm:table-cell">SKU</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Qty</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground hidden md:table-cell">Location</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground hidden sm:table-cell">Value</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventories.map((item) => (
                      <TableRow key={item.id} className="border-border/50 group cursor-pointer">
                        <TableCell className="font-medium text-sm">{item.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{item.sku}</TableCell>
                        <TableCell className="text-sm">{item.quantity} {item.unit}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{item.location}</TableCell>
                        <TableCell className="text-sm hidden sm:table-cell">${item.value.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={item.status === "ok" ? "default" : item.status === "low" ? "secondary" : "destructive"}
                            className="text-xs"
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {inventories.filter(i => i.status !== "ok").map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity} {item.unit} remaining</p>
                  </div>
                  <Badge variant={item.status === "low" ? "secondary" : "destructive"} className="text-xs">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Locations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Main Kitchen</span>
                </div>
                <Badge variant="secondary" className="text-xs">45 items</Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Cold Storage</span>
                </div>
                <Badge variant="secondary" className="text-xs">32 items</Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Warehouse</span>
                </div>
                <Badge variant="secondary" className="text-xs">79 items</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add New Item
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Stock Count
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Reorder Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
