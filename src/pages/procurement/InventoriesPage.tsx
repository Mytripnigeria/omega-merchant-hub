import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Package, AlertTriangle, DollarSign, MapPin } from "lucide-react";

export default function InventoriesPage() {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");

  const inventories = [
    { id: 1, name: "Flour", sku: "ING-001", quantity: 50, unit: "kg", location: "Main Kitchen", reorderLevel: 20, value: 150.00, status: "ok" },
    { id: 2, name: "Olive Oil", sku: "ING-002", quantity: 8, unit: "L", location: "Main Kitchen", reorderLevel: 10, value: 120.00, status: "low" },
    { id: 3, name: "Cheese", sku: "ING-003", quantity: 25, unit: "kg", location: "Cold Storage", reorderLevel: 15, value: 375.00, status: "ok" },
    { id: 4, name: "Tomatoes", sku: "ING-004", quantity: 5, unit: "kg", location: "Cold Storage", reorderLevel: 10, value: 25.00, status: "critical" },
  ];

  const stats = [
    { label: "Total Items", value: "156", icon: Package },
    { label: "Low Stock", value: "12", icon: AlertTriangle, color: "text-yellow-600" },
    { label: "Total Value", value: "$12,450", icon: DollarSign },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventories</h1>
          <p className="text-muted-foreground">Manage stock levels across locations</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add Item</Button>
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

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color || "text-muted-foreground"}`} />
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
              <Input placeholder="Search inventory..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[180px]">
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
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventories.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.quantity} {item.unit}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>${item.value.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "ok" ? "default" : item.status === "low" ? "secondary" : "destructive"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
