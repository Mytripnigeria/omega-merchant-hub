import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, AlertTriangle, TrendingDown, CheckCircle, Search, Filter, Download, MoreHorizontal } from "lucide-react";

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
    { label: "Critical", value: "8", icon: TrendingDown, color: "text-red-600" },
  ];

  const filteredItems = stockItems.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === "all" || item.status === statusFilter)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Stock Report</h1>
          <p className="text-sm text-muted-foreground">Inventory levels and stock status</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Two-column layout for desktop */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
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
                placeholder="Search items..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9 h-9 bg-muted/50 border-0" 
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[130px] h-9 bg-muted/50 border-0">
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

          {/* Stock Table */}
          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="text-xs font-medium text-muted-foreground">Item</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground hidden sm:table-cell">SKU</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Current</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground hidden md:table-cell">Minimum</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.sku} className="border-border/50 group cursor-pointer">
                        <TableCell className="font-medium text-sm">{item.name}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground hidden sm:table-cell">{item.sku}</TableCell>
                        <TableCell className="text-sm">{item.current} {item.unit}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{item.minimum} {item.unit}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={item.status === "good" ? "default" : item.status === "low" ? "secondary" : "destructive"}
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
              <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stockItems.filter(i => i.status !== "good").map((item) => (
                <div 
                  key={item.sku} 
                  className={`p-3 rounded-lg ${
                    item.status === "critical" 
                      ? "bg-red-50 dark:bg-red-900/20" 
                      : "bg-yellow-50 dark:bg-yellow-900/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.name}</span>
                    <Badge variant={item.status === "critical" ? "destructive" : "secondary"} className="text-xs">
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.current} / {item.minimum} {item.unit}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Stock Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Good</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "87%" }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-600">Low</span>
                    <span className="font-medium">10%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: "10%" }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600">Critical</span>
                    <span className="font-medium">3%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: "3%" }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Reorder Items
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
