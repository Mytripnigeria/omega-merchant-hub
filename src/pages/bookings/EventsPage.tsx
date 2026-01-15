import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

  const statusColors: Record<string, string> = {
    confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  };

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

          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-3">
            {events.map((event) => (
              <Card key={event.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{event.name}</p>
                      <p className="text-xs text-muted-foreground">{event.organizer}</p>
                    </div>
                    <Badge className={statusColors[event.status]} variant="secondary">
                      {event.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>{event.date} at {event.time}</span>
                    <span>•</span>
                    <span>{event.guests} guests</span>
                  </div>
                  <Badge variant="outline" className="text-xs mt-2">{event.type}</Badge>
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
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Event</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Organizer</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Date & Time</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Guests</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Type</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                      <th className="w-10 p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event) => (
                      <tr key={event.id} className="border-b border-border/50 last:border-0 group cursor-pointer hover:bg-muted/50">
                        <td className="font-medium text-sm p-4">{event.name}</td>
                        <td className="text-sm text-muted-foreground p-4">{event.organizer}</td>
                        <td className="text-sm text-muted-foreground p-4">{event.date} at {event.time}</td>
                        <td className="text-sm p-4">{event.guests}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="text-xs font-normal">{event.type}</Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={statusColors[event.status]} variant="secondary">
                            {event.status}
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