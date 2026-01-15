import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Calendar, Users, Clock, MoreHorizontal } from "lucide-react";

export default function ReservationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const reservations = [
    { id: 1, name: "John Smith", phone: "+1 234 567 890", date: "2026-01-20", time: "7:00 PM", guests: 4, table: "T-5", status: "confirmed" },
    { id: 2, name: "Sarah Johnson", phone: "+1 234 567 891", date: "2026-01-20", time: "8:00 PM", guests: 2, table: "T-3", status: "pending" },
    { id: 3, name: "Mike Wilson", phone: "+1 234 567 892", date: "2026-01-21", time: "6:30 PM", guests: 6, table: "T-8", status: "confirmed" },
    { id: 4, name: "Emma Davis", phone: "+1 234 567 893", date: "2026-01-21", time: "7:30 PM", guests: 3, table: "T-2", status: "confirmed" },
  ];

  const stats = [
    { label: "Today", value: "12", icon: Calendar },
    { label: "This Week", value: "58", icon: Users },
    { label: "Pending", value: "5", icon: Clock },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reservations</h1>
          <p className="text-sm text-muted-foreground">Manage table reservations</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-2" />New Reservation</Button>
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

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search reservations..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9 h-9 bg-muted/50 border-0" 
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[130px] h-9 bg-muted/50 border-0">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reservations Table */}
          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="text-xs font-medium text-muted-foreground">Guest</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground hidden sm:table-cell">Contact</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground hidden md:table-cell">Date & Time</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Party</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground hidden sm:table-cell">Table</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.map((res) => (
                      <TableRow key={res.id} className="border-border/50 group cursor-pointer">
                        <TableCell className="font-medium text-sm">{res.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{res.phone}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{res.date} at {res.time}</TableCell>
                        <TableCell className="text-sm">{res.guests}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className="text-xs font-normal">{res.table}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={res.status === "confirmed" ? "default" : "secondary"}
                            className="text-xs font-normal"
                          >
                            {res.status}
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
              <CardTitle className="text-sm font-medium">Today's Reservations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reservations.filter(r => r.date === "2026-01-20").map((res) => (
                <div key={res.id} className="p-3 border border-border/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{res.name}</span>
                    <Badge variant="outline" className="text-xs">{res.time}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{res.guests} guests • Table {res.table}</p>
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
                New Reservation
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Floor Plan
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Table Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {["T-1", "T-2", "T-3", "T-4", "T-5"].map((table) => {
                const isBooked = reservations.some(r => r.table === table);
                return (
                  <div key={table} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <span className="text-sm">{table}</span>
                    <Badge variant={isBooked ? "secondary" : "default"} className="text-xs">
                      {isBooked ? "Booked" : "Available"}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
