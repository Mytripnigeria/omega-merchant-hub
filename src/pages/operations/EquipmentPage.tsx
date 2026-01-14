import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Wrench, CheckCircle, AlertTriangle, MoreHorizontal } from "lucide-react";

const EquipmentPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const equipment = [
    { id: 1, name: "Industrial Oven", category: "Cooking", status: "operational", lastMaintenance: "2026-01-10", nextMaintenance: "2026-04-10", location: "Kitchen A" },
    { id: 2, name: "Walk-in Freezer", category: "Storage", status: "maintenance", lastMaintenance: "2026-01-05", nextMaintenance: "2026-02-05", location: "Back Area" },
    { id: 3, name: "Dishwasher", category: "Cleaning", status: "operational", lastMaintenance: "2026-01-15", nextMaintenance: "2026-04-15", location: "Kitchen B" },
    { id: 4, name: "Espresso Machine", category: "Beverage", status: "operational", lastMaintenance: "2026-01-08", nextMaintenance: "2026-03-08", location: "Bar" },
  ];

  const stats = [
    { label: "Total Equipment", value: "24", icon: Wrench },
    { label: "Operational", value: "21", icon: CheckCircle },
    { label: "Needs Attention", value: "3", icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Equipment</h1>
          <p className="text-sm text-muted-foreground">Manage and track equipment maintenance</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
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
                placeholder="Search equipment..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9 h-9 bg-muted/50 border-0" 
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-9 bg-muted/50 border-0">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">Equipment</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Category</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Location</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Last Maintenance</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Next Due</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.map((item) => (
                <TableRow key={item.id} className="border-border/50">
                  <TableCell className="font-medium text-sm">{item.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.category}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.location}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.lastMaintenance}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.nextMaintenance}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={item.status === "operational" ? "default" : "secondary"}
                      className="text-xs font-normal"
                    >
                      {item.status}
                    </Badge>
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

export default EquipmentPage;
