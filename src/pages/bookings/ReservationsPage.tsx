import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

  const statusColors: Record<string, string> = {
    confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  };

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

          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-3">
            {reservations.map((res) => (
              <Card key={res.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{res.name}</p>
                      <p className="text-xs text-muted-foreground">{res.phone}</p>
                    </div>
                    <Badge className={statusColors[res.status]} variant="secondary">
                      {res.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>{res.date} at {res.time}</span>
                    <span>•</span>
                    <span>{res.guests} guests</span>
                    <Badge variant="outline" className="text-xs ml-auto">{res.table}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <Card className="border-border/50 hidden sm:block">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Guest</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Contact</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Date & Time</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Party</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Table</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                      <th className="w-10 p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((res) => (
                      <tr key={res.id} className="border-b border-border/50 last:border-0 group cursor-pointer hover:bg-muted/50">
                        <td className="font-medium text-sm p-4">{res.name}</td>
                        <td className="text-sm text-muted-foreground p-4">{res.phone}</td>
                        <td className="text-sm text-muted-foreground p-4">{res.date} at {res.time}</td>
                        <td className="text-sm p-4">{res.guests}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="text-xs font-normal">{res.table}</Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={statusColors[res.status]} variant="secondary">
                            {res.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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