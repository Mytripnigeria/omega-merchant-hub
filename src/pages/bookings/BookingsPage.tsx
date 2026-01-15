import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Calendar, Users, Clock, MoreHorizontal } from "lucide-react";

export default function BookingsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const bookings = [
    { id: 1, customer: "John Doe", type: "table", date: "2026-01-15", time: "19:00", guests: 4, status: "confirmed" },
    { id: 2, customer: "Corporate Event", type: "event", date: "2026-01-20", time: "18:00", guests: 50, status: "pending" },
    { id: 3, customer: "Sarah Smith", type: "table", date: "2026-01-15", time: "20:30", guests: 2, status: "confirmed" },
    { id: 4, customer: "Birthday Party", type: "event", date: "2026-01-25", time: "15:00", guests: 25, status: "confirmed" },
  ];

  const stats = [
    { label: "Today", value: "12", icon: Calendar },
    { label: "Expected Guests", value: "48", icon: Users },
    { label: "Pending", value: "3", icon: Clock },
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
          <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
          <p className="text-sm text-muted-foreground">Manage reservations and events</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-2" />New Booking</Button>
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
                placeholder="Search bookings..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9 h-9 bg-muted/50 border-0" 
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[110px] h-9 bg-muted/50 border-0">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="table">Tables</SelectItem>
                <SelectItem value="event">Events</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[120px] h-9 bg-muted/50 border-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-3">
            {bookings.map((booking) => (
              <Card key={booking.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{booking.customer}</p>
                      <p className="text-xs text-muted-foreground">{booking.date} at {booking.time}</p>
                    </div>
                    <Badge className={statusColors[booking.status]} variant="secondary">
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={booking.type === "table" ? "outline" : "secondary"} className="text-xs">
                      {booking.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{booking.guests} guests</span>
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
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Customer</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Type</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Date</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Time</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Guests</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                      <th className="w-10 p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-border/50 last:border-0 group cursor-pointer hover:bg-muted/50">
                        <td className="font-medium text-sm p-4">{booking.customer}</td>
                        <td className="p-4">
                          <Badge variant={booking.type === "table" ? "outline" : "secondary"} className="text-xs font-normal">
                            {booking.type}
                          </Badge>
                        </td>
                        <td className="text-sm text-muted-foreground p-4">{booking.date}</td>
                        <td className="text-sm text-muted-foreground p-4">{booking.time}</td>
                        <td className="text-sm p-4">{booking.guests}</td>
                        <td className="p-4">
                          <Badge className={statusColors[booking.status]} variant="secondary">
                            {booking.status}
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
              <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bookings.filter(b => b.date === "2026-01-15").map((booking) => (
                <div key={booking.id} className="p-3 border border-border/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{booking.customer}</span>
                    <Badge variant="outline" className="text-xs">{booking.time}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{booking.guests} guests • {booking.type}</p>
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
                New Booking
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage Tables
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {bookings.filter(b => b.type === "event").map((event) => (
                <div key={event.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{event.customer}</p>
                    <p className="text-xs text-muted-foreground">{event.date}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">{event.guests}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}