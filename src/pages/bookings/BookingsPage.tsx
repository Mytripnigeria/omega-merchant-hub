import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    { label: "Today's Bookings", value: "12", icon: Calendar },
    { label: "Expected Guests", value: "48", icon: Users },
    { label: "Pending", value: "3", icon: Clock },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Bookings</h1>
          <p className="text-sm text-muted-foreground">Manage reservations and events</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Booking
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
                placeholder="Search bookings..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9 h-9 bg-muted/50 border-0" 
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[120px] h-9 bg-muted/50 border-0">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="table">Tables</SelectItem>
                <SelectItem value="event">Events</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px] h-9 bg-muted/50 border-0">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">Customer</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Type</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Date</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Time</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Guests</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id} className="border-border/50">
                  <TableCell className="font-medium text-sm">{booking.customer}</TableCell>
                  <TableCell>
                    <Badge variant={booking.type === "table" ? "outline" : "secondary"} className="text-xs font-normal">
                      {booking.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{booking.date}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{booking.time}</TableCell>
                  <TableCell className="text-sm">{booking.guests}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={booking.status === "confirmed" ? "default" : "secondary"} 
                      className="text-xs font-normal"
                    >
                      {booking.status}
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
}
