import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Calendar, PartyPopper, Users, MoreHorizontal } from "lucide-react";

const EventsPage = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const events = [
    { id: 1, name: "Corporate Dinner", organizer: "Acme Corp", date: "2026-01-25", time: "6:00 PM", guests: 50, type: "Private", status: "confirmed" },
    { id: 2, name: "Birthday Party", organizer: "John Smith", date: "2026-01-28", time: "7:30 PM", guests: 25, type: "Celebration", status: "pending" },
    { id: 3, name: "Wine Tasting", organizer: "Sommelier Club", date: "2026-02-01", time: "5:00 PM", guests: 30, type: "Special", status: "confirmed" },
    { id: 4, name: "Anniversary Dinner", organizer: "Mike & Sarah", date: "2026-02-05", time: "8:00 PM", guests: 12, type: "Celebration", status: "confirmed" },
  ];

  const stats = [
    { label: "Upcoming Events", value: "8", icon: Calendar },
    { label: "This Month", value: "15", icon: PartyPopper },
    { label: "Total Guests", value: "320", icon: Users },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Events</h1>
          <p className="text-sm text-muted-foreground">Manage special events and private bookings</p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Event
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
                placeholder="Search events..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="pl-9 h-9 bg-muted/50 border-0" 
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px] h-9 bg-muted/50 border-0">
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

          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">Event</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Organizer</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Date & Time</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Guests</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Type</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id} className="border-border/50">
                  <TableCell className="font-medium text-sm">{event.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{event.organizer}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{event.date} at {event.time}</TableCell>
                  <TableCell className="text-sm">{event.guests}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-normal">
                      {event.type}
                    </Badge>
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

export default EventsPage;
