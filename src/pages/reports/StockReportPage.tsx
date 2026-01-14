import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, AlertTriangle, TrendingDown, CheckCircle, Search, Filter, Download } from "lucide-react";

export default function StockReportPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const stockItems = [
    { name: "Chicken Breast", sku: "ING-001", current: 45, minimum: 20, unit: "kg", status: "good" },
    { name: "Olive Oil", sku: "ING-002", current: 8, minimum: 10, unit: "L", status: "low" },
    { name: "Tomatoes", sku: "ING-003", current: 5, minimum: 15, unit: "kg", status: "critical" },
    { name: "Pasta", sku: "ING-004", current: 120, minimum: 50, unit: "kg", status: "good" },
    { name: "Cheese", sku: "ING-005", current: 22, minimum: 20, unit: "kg", status: "good" },
    { name: "Lettuce", sku: "ING-006", current: 3, minimum: 10, unit: "kg", status: "critical" },
  ];

  const stats = [
    { label: "Total Items", value: "248", icon: Package },
    { label: "In Stock", value: "215", icon: CheckCircle, color: "text-green-600" },
    { label: "Low Stock", value: "25", icon: AlertTriangle, color: "text-yellow-600" },
    { label: "Out of Stock", value: "8", icon: TrendingDown, color: "text-red-600" },
  ];

  const filteredItems = stockItems.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === "all" || item.status === statusFilter)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Stock Report</h1>
          <p className="text-muted-foreground">Inventory levels and stock status</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
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
              <Input 
                placeholder="Search items..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-10" 
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
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
                <TableHead>Current Stock</TableHead>
                <TableHead>Minimum</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.sku}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{item.sku}</TableCell>
                  <TableCell>{item.current} {item.unit}</TableCell>
                  <TableCell className="text-muted-foreground">{item.minimum} {item.unit}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={item.status === "good" ? "default" : item.status === "low" ? "secondary" : "destructive"}
                    >
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
