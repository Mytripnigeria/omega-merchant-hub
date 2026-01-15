import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Calendar, PartyPopper, Users, MoreHorizontal } from "lucide-react";

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const events = [
    { id: 1, name: "Corporate Dinner", organizer: "Acme Corp", date: "2026-01-25", time: "6:00 PM", guests: 50, type: "Private", status: "confirmed" },
    { id: 2, name: "Birthday Party", organizer: "John Smith", date: "2026-01-28", time: "7:30 PM", guests: 25, type: "Celebration", status: "pending" },
    { id: 3, name: "Wine Tasting", organizer: "Sommelier Club", date: "2026-02-01", time: "5:00 PM", guests: 30, type: "Special", status: "confirmed" },
    { id: 4, name: "Anniversary Dinner", organizer: "Mike & Sarah", date: "2026-02-05", time: "8:00 PM", guests: 12, type: "Celebration", status: "confirmed" },
  ];

  const stats = [
    { label: "Upcoming", value: "8", icon: Calendar },
    { label: "This Month", value: "15", icon: PartyPopper },
    { label: "Total Guests", value: "320", icon: Users },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
          <p className="text-sm text-muted-foreground">Manage special events and private bookings</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-2" />Create Event</Button>
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
                placeholder="Search events..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9 h-9 bg-muted/50 border-0" 
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[130px] h-9 bg-muted/50 border-0">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="celebration">Celebration</SelectItem>
                <SelectItem value="special">Special</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Events Table */}
          <Card className="border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="text-xs font-medium text-muted-foreground">Event</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground hidden sm:table-cell">Organizer</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground hidden md:table-cell">Date & Time</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Guests</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground hidden sm:table-cell">Type</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id} className="border-border/50 group cursor-pointer">
                        <TableCell className="font-medium text-sm">{event.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{event.organizer}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{event.date} at {event.time}</TableCell>
                        <TableCell className="text-sm">{event.guests}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className="text-xs font-normal">{event.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={event.status === "confirmed" ? "default" : "secondary"}
                            className="text-xs font-normal"
                          >
                            {event.status}
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
              <CardTitle className="text-sm font-medium">Next Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4 rounded-lg bg-primary/5">
                <PartyPopper className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="font-semibold">{events[0].name}</p>
                <p className="text-sm text-muted-foreground">{events[0].date}</p>
                <div className="flex justify-center gap-2 mt-2">
                  <Badge variant="secondary">{events[0].guests} guests</Badge>
                  <Badge variant="outline">{events[0].type}</Badge>
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
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Guest Lists
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Event Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {["Private", "Celebration", "Special", "Corporate"].map((type) => (
                <div key={type} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <span className="text-sm">{type}</span>
                  <Badge variant="secondary" className="text-xs">
                    {events.filter(e => e.type === type).length}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
