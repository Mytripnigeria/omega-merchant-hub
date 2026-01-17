import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Calendar, Users, Clock, MoreHorizontal, Phone, Mail, MapPin, FileText } from "lucide-react";

interface Booking {
  id: number;
  customer: string;
  phone?: string;
  email?: string;
  type: "table" | "event";
  date: string;
  time: string;
  guests: number;
  status: "confirmed" | "pending";
  notes?: string;
  specialRequests?: string;
}

const bookings: Booking[] = [
  { id: 1, customer: "John Doe", phone: "+234 801 234 5678", email: "john@email.com", type: "table", date: "2026-01-15", time: "19:00", guests: 4, status: "confirmed", notes: "Anniversary dinner", specialRequests: "Window table preferred" },
  { id: 2, customer: "Corporate Event", phone: "+234 802 345 6789", email: "events@corp.com", type: "event", date: "2026-01-20", time: "18:00", guests: 50, status: "pending", notes: "Company end of year party" },
  { id: 3, customer: "Sarah Smith", phone: "+234 803 456 7890", email: "sarah@email.com", type: "table", date: "2026-01-15", time: "20:30", guests: 2, status: "confirmed" },
  { id: 4, customer: "Birthday Party", phone: "+234 804 567 8901", type: "event", date: "2026-01-25", time: "15:00", guests: 25, status: "confirmed", notes: "Surprise birthday for Lisa", specialRequests: "Cake setup at 3:30 PM" },
];

export default function BookingsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "edit" | "add">("view");

  const stats = [
    { label: "Today", value: "12", icon: Calendar },
    { label: "Expected Guests", value: "48", icon: Users },
    { label: "Pending", value: "3", icon: Clock },
  ];

  const statusColors: Record<string, string> = {
    confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  };

  const filteredBookings = bookings.filter(b =>
    (b.customer.toLowerCase().includes(search.toLowerCase())) &&
    (typeFilter === "all" || b.type === typeFilter) &&
    (statusFilter === "all" || b.status === statusFilter)
  );

  const openViewSheet = (booking: Booking) => {
    setSelectedBooking(booking);
    setSheetMode("view");
  };

  const openEditSheet = (booking: Booking) => {
    setSelectedBooking(booking);
    setSheetMode("edit");
  };

  const openAddSheet = () => {
    setSelectedBooking(null);
    setSheetMode("add");
    setIsAddSheetOpen(true);
  };

  const closeSheet = () => {
    setSelectedBooking(null);
    setIsAddSheetOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
          <p className="text-sm text-muted-foreground">Manage reservations and events</p>
        </div>
        <Button size="sm" onClick={openAddSheet}><Plus className="h-4 w-4 mr-2" />New Booking</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
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

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search bookings..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 bg-muted/50 border-0" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[110px] h-9 bg-muted/50 border-0"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="table">Tables</SelectItem>
                <SelectItem value="event">Events</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[120px] h-9 bg-muted/50 border-0"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="block sm:hidden space-y-3">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="border-border/50 cursor-pointer hover:bg-muted/50" onClick={() => openViewSheet(booking)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{booking.customer}</p>
                      <p className="text-xs text-muted-foreground">{booking.date} at {booking.time}</p>
                    </div>
                    <Badge className={statusColors[booking.status]} variant="secondary">{booking.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={booking.type === "table" ? "outline" : "secondary"} className="text-xs">{booking.type}</Badge>
                    <span className="text-xs text-muted-foreground">{booking.guests} guests</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-border/50 last:border-0 group cursor-pointer hover:bg-muted/50" onClick={() => openViewSheet(booking)}>
                        <td className="font-medium text-sm p-4">{booking.customer}</td>
                        <td className="p-4"><Badge variant={booking.type === "table" ? "outline" : "secondary"} className="text-xs font-normal">{booking.type}</Badge></td>
                        <td className="text-sm text-muted-foreground p-4">{booking.date}</td>
                        <td className="text-sm text-muted-foreground p-4">{booking.time}</td>
                        <td className="text-sm p-4">{booking.guests}</td>
                        <td className="p-4"><Badge className={statusColors[booking.status]} variant="secondary">{booking.status}</Badge></td>
                        <td className="p-4">
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100"><MoreHorizontal className="h-4 w-4" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Today's Schedule</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {bookings.filter(b => b.date === "2026-01-15").map((booking) => (
                <div key={booking.id} className="p-3 border border-border/50 rounded-lg cursor-pointer hover:bg-muted/50" onClick={() => openViewSheet(booking)}>
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
            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={openAddSheet}><Plus className="mr-2 h-4 w-4" />New Booking</Button>
              <Button variant="outline" size="sm" className="w-full justify-start"><Calendar className="mr-2 h-4 w-4" />View Calendar</Button>
              <Button variant="outline" size="sm" className="w-full justify-start"><Users className="mr-2 h-4 w-4" />Manage Tables</Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Upcoming Events</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {bookings.filter(b => b.type === "event").map((event) => (
                <div key={event.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer" onClick={() => openViewSheet(event)}>
                  <div><p className="text-sm font-medium">{event.customer}</p><p className="text-xs text-muted-foreground">{event.date}</p></div>
                  <Badge variant="secondary" className="text-xs">{event.guests}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Sheet open={!!selectedBooking || isAddSheetOpen} onOpenChange={closeSheet}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle>{sheetMode === "add" ? "New Booking" : sheetMode === "edit" ? "Edit Booking" : selectedBooking?.customer}</SheetTitle>
              {selectedBooking && sheetMode === "view" && <Badge className={statusColors[selectedBooking.status]} variant="secondary">{selectedBooking.status}</Badge>}
            </div>
            <SheetDescription>
              {sheetMode === "add" ? "Create a new reservation or event" : selectedBooking ? `${selectedBooking.type === "table" ? "Table Reservation" : "Event"} for ${selectedBooking.guests} guests` : ""}
            </SheetDescription>
          </SheetHeader>

          {sheetMode === "view" && selectedBooking ? (
            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div><p className="text-sm font-medium">{selectedBooking.customer}</p><p className="text-xs text-muted-foreground">Customer</p></div>
                  </div>
                  {selectedBooking.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div><p className="text-sm font-medium">{selectedBooking.phone}</p><p className="text-xs text-muted-foreground">Phone</p></div>
                    </div>
                  )}
                  {selectedBooking.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div><p className="text-sm font-medium">{selectedBooking.email}</p><p className="text-xs text-muted-foreground">Email</p></div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Date</Label><p className="text-sm font-medium">{selectedBooking.date}</p></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Time</Label><p className="text-sm font-medium">{selectedBooking.time}</p></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Guests</Label><p className="text-sm font-medium">{selectedBooking.guests}</p></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Type</Label><Badge variant={selectedBooking.type === "table" ? "outline" : "secondary"}>{selectedBooking.type}</Badge></div>
                </div>

                {selectedBooking.specialRequests && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Special Requests</p>
                    <p className="text-sm">{selectedBooking.specialRequests}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="notes" className="space-y-4 mt-4">
                <div className="p-3 border rounded-lg">
                  <p className="text-sm">{selectedBooking.notes || "No notes added"}</p>
                </div>
                <Textarea placeholder="Add a note..." className="min-h-[100px]" />
                <Button className="w-full">Save Note</Button>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4 mt-6">
              <div className="space-y-2"><Label>Customer Name</Label><Input placeholder="Enter customer name" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Phone</Label><Input placeholder="+234..." /></div>
                <div className="space-y-2"><Label>Email</Label><Input placeholder="email@example.com" /></div>
              </div>
              <div className="space-y-2">
                <Label>Booking Type</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="table">Table Reservation</SelectItem><SelectItem value="event">Event</SelectItem></SelectContent></Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Date</Label><Input type="date" /></div>
                <div className="space-y-2"><Label>Time</Label><Input type="time" /></div>
              </div>
              <div className="space-y-2"><Label>Number of Guests</Label><Input type="number" placeholder="4" /></div>
              <div className="space-y-2"><Label>Special Requests</Label><Textarea placeholder="Any special requests..." /></div>
            </div>
          )}

          <SheetFooter className="mt-6 flex-col sm:flex-row gap-2">
            {sheetMode === "view" && selectedBooking ? (
              <>
                <Button variant="outline" onClick={() => openEditSheet(selectedBooking)} className="w-full sm:w-auto">Edit Booking</Button>
                {selectedBooking.status === "pending" && <Button className="w-full sm:w-auto">Confirm Booking</Button>}
              </>
            ) : (
              <>
                <Button variant="outline" onClick={closeSheet} className="w-full sm:w-auto">Cancel</Button>
                <Button className="w-full sm:w-auto">{sheetMode === "add" ? "Create Booking" : "Save Changes"}</Button>
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
