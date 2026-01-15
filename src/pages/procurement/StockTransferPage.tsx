import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, ArrowRight, Truck, Clock, CheckCircle2, MoreHorizontal } from "lucide-react";

export default function StockTransferPage() {
  const [search, setSearch] = useState("");

  const transfers = [
    { id: "TRF-001", from: "Main Kitchen", to: "Cold Storage", items: 5, date: "2026-01-14", status: "completed" },
    { id: "TRF-002", from: "Warehouse", to: "Main Kitchen", items: 12, date: "2026-01-14", status: "in-transit" },
    { id: "TRF-003", from: "Cold Storage", to: "VI Branch", items: 8, date: "2026-01-13", status: "pending" },
    { id: "TRF-004", from: "Warehouse", to: "Lekki Store", items: 15, date: "2026-01-12", status: "completed" },
  ];

  const stats = [
    { label: "Pending", value: "3", icon: Clock },
    { label: "In Transit", value: "2", icon: Truck },
    { label: "Completed", value: "45", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Stock Transfers</h1>
          <p className="text-sm text-muted-foreground">Move inventory between locations</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-2" />New Transfer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Stock Transfer</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>From Location</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Kitchen</SelectItem>
                    <SelectItem value="cold">Cold Storage</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>To Location</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Kitchen</SelectItem>
                    <SelectItem value="cold">Cold Storage</SelectItem>
                    <SelectItem value="vi">VI Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Create Transfer</Button>
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
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search transfers..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-9 h-9 bg-muted/50 border-0" 
            />
          </div>

          {/* Transfers Table */}
          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="text-xs font-medium text-muted-foreground">ID</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Route</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground hidden sm:table-cell">Items</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transfers.map((transfer) => (
                      <TableRow key={transfer.id} className="border-border/50 group cursor-pointer">
                        <TableCell className="font-medium text-sm font-mono">{transfer.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="truncate max-w-[80px]">{transfer.from}</span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <span className="truncate max-w-[80px]">{transfer.to}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm hidden sm:table-cell">{transfer.items}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{transfer.date}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={transfer.status === "completed" ? "default" : transfer.status === "in-transit" ? "secondary" : "outline"}
                            className="text-xs"
                          >
                            {transfer.status}
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
              <CardTitle className="text-sm font-medium">Recent Transfers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {transfers.slice(0, 3).map((transfer) => (
                <div key={transfer.id} className="p-3 border border-border/50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground">{transfer.id}</span>
                    <Badge 
                      variant={transfer.status === "completed" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {transfer.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span>{transfer.from}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span>{transfer.to}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{transfer.items} items • {transfer.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                New Transfer
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Truck className="mr-2 h-4 w-4" />
                Track Shipments
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                View History
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-muted/30">
            <CardContent className="p-4">
              <h4 className="font-medium text-sm mb-2">Tip</h4>
              <p className="text-xs text-muted-foreground">
                Create stock transfers to move inventory between locations and maintain optimal stock levels.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
