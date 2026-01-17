import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Calendar, PartyPopper, Users, MoreHorizontal, Phone, Mail, Edit, Trash2, CheckCircle, XCircle, Clock, DollarSign } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Event {
  id: number;
  name: string;
  organizer: string;
  phone?: string;
  email?: string;
  date: string;
  time: string;
  endTime?: string;
  guests: number;
  type: string;
  status: "confirmed" | "pending" | "cancelled";
  deposit?: number;
  total?: number;
  notes?: string;
  createdAt?: string;
  menu?: string;
}

const eventsData: Event[] = [
  { id: 1, name: "Corporate Dinner", organizer: "Acme Corp", phone: "+234 801 234 5678", email: "events@acme.com", date: "2026-01-25", time: "6:00 PM", endTime: "10:00 PM", guests: 50, type: "Private", status: "confirmed", deposit: 250000, total: 1500000, notes: "Full venue hire, custom menu required", menu: "3-course dinner", createdAt: "2026-01-10" },
  { id: 2, name: "Birthday Party", organizer: "John Smith", phone: "+234 802 345 6789", date: "2026-01-28", time: "7:30 PM", endTime: "11:00 PM", guests: 25, type: "Celebration", status: "pending", deposit: 100000, total: 500000, createdAt: "2026-01-15" },
  { id: 3, name: "Wine Tasting", organizer: "Sommelier Club", phone: "+234 803 456 7890", email: "club@sommelier.ng", date: "2026-02-01", time: "5:00 PM", endTime: "8:00 PM", guests: 30, type: "Special", status: "confirmed", deposit: 150000, total: 600000, menu: "Wine pairing menu", createdAt: "2026-01-12" },
  { id: 4, name: "Anniversary Dinner", organizer: "Mike & Sarah", phone: "+234 804 567 8901", date: "2026-02-05", time: "8:00 PM", endTime: "11:00 PM", guests: 12, type: "Celebration", status: "confirmed", notes: "10th anniversary, need cake", createdAt: "2026-01-18" },
];

const eventTypes = ["Private", "Celebration", "Corporate", "Special", "Wedding", "Other"];

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [events] = useState(eventsData);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const stats = [
    { label: "Upcoming", value: events.filter(e => e.status !== "cancelled").length.toString(), icon: Calendar },
    { label: "This Month", value: "15", icon: PartyPopper },
    { label: "Total Guests", value: events.reduce((sum, e) => sum + e.guests, 0).toString(), icon: Users },
  ];

  const statusColors: Record<string, string> = {
    confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsViewSheetOpen(true);
  };

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
                          e.organizer.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || e.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Events</h1>
          <p className="text-sm text-muted-foreground">Manage special events and private bookings</p>
        </div>
        <Button size="sm" onClick={() => setIsAddSheetOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />Create Event
        </Button>
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
                {eventTypes.map(t => (
                  <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-3">
            {filteredEvents.map((event) => (
              <Card 
                key={event.id} 
                className="border-border/50 cursor-pointer hover:bg-muted/50"
                onClick={() => handleViewEvent(event)}
              >
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
                    {filteredEvents.map((event) => (
                      <tr 
                        key={event.id} 
                        className="border-b border-border/50 last:border-0 group cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewEvent(event)}
                      >
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
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewEvent(event)}>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              {event.status === "pending" && (
                                <DropdownMenuItem className="text-green-600">Confirm</DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-destructive">Cancel</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
              <div 
                className="text-center p-4 rounded-lg bg-primary/5 cursor-pointer hover:bg-primary/10"
                onClick={() => handleViewEvent(events[0])}
              >
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
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setIsAddSheetOpen(true)}>
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
              {eventTypes.slice(0, 4).map((type) => (
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

      {/* Add Event Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create Event</SheetTitle>
            <SheetDescription>Plan a new special event or private booking</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label>Event Name</Label>
              <Input placeholder="e.g., Corporate Dinner" />
            </div>
            <div className="space-y-2">
              <Label>Organizer Name</Label>
              <Input placeholder="e.g., Acme Corp" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="+234 801 234 5678" />
              </div>
              <div className="space-y-2">
                <Label>Email (Optional)</Label>
                <Input type="email" placeholder="email@example.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Event Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {eventTypes.map(t => (
                      <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input type="time" />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input type="time" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Number of Guests</Label>
                <Input type="number" placeholder="50" min="1" />
              </div>
              <div className="space-y-2">
                <Label>Deposit (₦)</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea placeholder="Special requests, menu requirements, etc." rows={3} />
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddSheetOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button className="w-full sm:w-auto">Create Event</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View Event Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>{selectedEvent?.name}</SheetTitle>
                <SheetDescription>by {selectedEvent?.organizer}</SheetDescription>
              </div>
              <Badge className={statusColors[selectedEvent?.status || "pending"]}>
                {selectedEvent?.status}
              </Badge>
            </div>
          </SheetHeader>
          
          <Tabs defaultValue="details" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <Calendar className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium text-sm">{selectedEvent?.date}</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Clock className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="font-medium text-sm">{selectedEvent?.time} - {selectedEvent?.endTime}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <Users className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Guests</p>
                  <p className="font-semibold text-lg">{selectedEvent?.guests}</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <PartyPopper className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Type</p>
                  <Badge variant="outline" className="mt-1">{selectedEvent?.type}</Badge>
                </div>
              </div>
              {selectedEvent?.menu && (
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Menu</p>
                  <p className="text-sm font-medium">{selectedEvent.menu}</p>
                </div>
              )}
              {selectedEvent?.notes && (
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{selectedEvent.notes}</p>
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Created: {selectedEvent?.createdAt}
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedEvent?.phone}</p>
                </div>
              </div>
              {selectedEvent?.email && (
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedEvent.email}</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />Call
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />Email
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="payment" className="space-y-4 mt-4">
              {selectedEvent?.deposit && (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Deposit Paid</p>
                      <p className="font-medium">₦{selectedEvent.deposit.toLocaleString()}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600">Received</Badge>
                </div>
              )}
              {selectedEvent?.total && (
                <>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-xl font-semibold">₦{selectedEvent.total.toLocaleString()}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Balance Due</p>
                    <p className="text-xl font-semibold text-orange-600">
                      ₦{(selectedEvent.total - (selectedEvent.deposit || 0)).toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
          
          <SheetFooter className="flex-col sm:flex-row gap-2 mt-6">
            {selectedEvent?.status === "pending" && (
              <>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto">
                  <XCircle className="h-4 w-4 mr-2" />Cancel
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                  <CheckCircle className="h-4 w-4 mr-2" />Confirm
                </Button>
              </>
            )}
            {selectedEvent?.status === "confirmed" && (
              <>
                <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                  <Trash2 className="h-4 w-4 mr-2" />Cancel Event
                </Button>
                <Button className="w-full sm:w-auto">
                  <Edit className="h-4 w-4 mr-2" />Edit
                </Button>
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
