import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, ArrowRight, Truck, Clock, CheckCircle2 } from "lucide-react";

export default function StockTransferPage() {
  const [search, setSearch] = useState("");

  const transfers = [
    { id: "TRF-001", from: "Main Kitchen", to: "Cold Storage", items: 5, date: "2026-01-14", status: "completed" },
    { id: "TRF-002", from: "Warehouse", to: "Main Kitchen", items: 12, date: "2026-01-14", status: "in-transit" },
    { id: "TRF-003", from: "Cold Storage", to: "VI Branch", items: 8, date: "2026-01-13", status: "pending" },
  ];

  const stats = [
    { label: "Pending", value: "3", icon: Clock },
    { label: "In Transit", value: "2", icon: Truck },
    { label: "Completed", value: "45", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stock Transfers</h1>
          <p className="text-muted-foreground">Move inventory between locations</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />New Transfer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Stock Transfer</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>From Location</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Kitchen</SelectItem>
                    <SelectItem value="cold">Cold Storage</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>To Location</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
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

      <div className="grid gap-4 md:grid-cols-3">
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
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search transfers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell className="font-medium">{transfer.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {transfer.from} <ArrowRight className="h-4 w-4" /> {transfer.to}
                    </div>
                  </TableCell>
                  <TableCell>{transfer.items} items</TableCell>
                  <TableCell>{transfer.date}</TableCell>
                  <TableCell>
                    <Badge variant={transfer.status === "completed" ? "default" : transfer.status === "in-transit" ? "secondary" : "outline"}>
                      {transfer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">View</Button>
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
