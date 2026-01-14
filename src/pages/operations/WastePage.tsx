import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Trash2, TrendingDown, AlertTriangle, MoreHorizontal } from "lucide-react";

const WastePage = () => {
  const [search, setSearch] = useState("");
  const [reasonFilter, setReasonFilter] = useState("all");

  const wasteLog = [
    { id: 1, item: "Lettuce", quantity: "5 kg", reason: "Spoilage", cost: 25, date: "2026-01-15", loggedBy: "John D." },
    { id: 2, item: "Chicken Breast", quantity: "3 kg", reason: "Overproduction", cost: 45, date: "2026-01-15", loggedBy: "Sarah M." },
    { id: 3, item: "Milk", quantity: "2 L", reason: "Expired", cost: 8, date: "2026-01-14", loggedBy: "Mike R." },
    { id: 4, item: "Bread Rolls", quantity: "24 pcs", reason: "Overproduction", cost: 12, date: "2026-01-14", loggedBy: "Emma W." },
  ];

  const stats = [
    { label: "Total Waste (MTD)", value: "$1,250", icon: Trash2 },
    { label: "Waste %", value: "3.2%", icon: AlertTriangle },
    { label: "vs Last Month", value: "-15%", icon: TrendingDown, positive: true },
    { label: "Items Logged", value: "42", icon: Trash2 },
  ];

  const getReasonColor = (reason: string) => {
    switch (reason.toLowerCase()) {
      case "spoilage": return "destructive";
      case "expired": return "destructive";
      case "overproduction": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Waste Management</h1>
          <p className="text-sm text-muted-foreground">Track and reduce food waste</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Log Waste
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-semibold ${stat.positive ? "text-green-600" : ""}`}>
                    {stat.value}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search waste log..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9 h-9 bg-muted/50 border-0" 
              />
            </div>
            <Select value={reasonFilter} onValueChange={setReasonFilter}>
              <SelectTrigger className="w-[140px] h-9 bg-muted/50 border-0">
                <SelectValue placeholder="All Reasons" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reasons</SelectItem>
                <SelectItem value="spoilage">Spoilage</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="overproduction">Overproduction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">Item</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Quantity</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Reason</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Date</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Logged By</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground text-right">Cost</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wasteLog.map((item) => (
                <TableRow key={item.id} className="border-border/50">
                  <TableCell className="font-medium text-sm">{item.item}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.quantity}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={getReasonColor(item.reason) as "default" | "secondary" | "destructive" | "outline"}
                      className="text-xs font-normal"
                    >
                      {item.reason}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.date}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.loggedBy}</TableCell>
                  <TableCell className="text-sm font-medium text-right text-red-500">
                    -${item.cost}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WastePage;
