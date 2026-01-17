import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Calendar, Users, Clock, MoreHorizontal, Phone, Mail, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
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

interface Reservation {
  id: number;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  table: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  notes?: string;
  createdAt?: string;
}

const reservationsData: Reservation[] = [
  { id: 1, name: "John Smith", phone: "+234 801 234 5678", email: "john@email.com", date: "2026-01-20", time: "7:00 PM", guests: 4, table: "T-5", status: "confirmed", notes: "Anniversary dinner", createdAt: "2026-01-15" },
  { id: 2, name: "Sarah Johnson", phone: "+234 802 345 6789", email: "sarah@email.com", date: "2026-01-20", time: "8:00 PM", guests: 2, table: "T-3", status: "pending", createdAt: "2026-01-16" },
  { id: 3, name: "Mike Wilson", phone: "+234 803 456 7890", date: "2026-01-21", time: "6:30 PM", guests: 6, table: "T-8", status: "confirmed", createdAt: "2026-01-14" },
  { id: 4, name: "Emma Davis", phone: "+234 804 567 8901", email: "emma@email.com", date: "2026-01-21", time: "7:30 PM", guests: 3, table: "T-2", status: "confirmed", notes: "Vegetarian menu requested", createdAt: "2026-01-17" },
];

const tables = ["T-1", "T-2", "T-3", "T-4", "T-5", "T-6", "T-7", "T-8", "T-9", "T-10"];

export default function ReservationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reservations] = useState(reservationsData);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const stats = [
    { label: "Today", value: reservations.filter(r => r.date === "2026-01-20").length.toString(), icon: Calendar },
    { label: "This Week", value: "58", icon: Users },
    { label: "Pending", value: reservations.filter(r => r.status === "pending").length.toString(), icon: Clock },
  ];

  const statusColors: Record<string, string> = {
    confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };

  const handleViewReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsViewSheetOpen(true);
  };

  const filteredReservations = reservations.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
                          r.phone.includes(search);
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reservations</h1>
          <p className="text-sm text-muted-foreground">Manage table reservations</p>
        </div>
        <Button size="sm" onClick={() => setIsAddSheetOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />New Reservation
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
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-3">
            {filteredReservations.map((res) => (
              <Card 
                key={res.id} 
                className="border-border/50 cursor-pointer hover:bg-muted/50"
                onClick={() => handleViewReservation(res)}
              >
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
                    {filteredReservations.map((res) => (
                      <tr 
                        key={res.id} 
                        className="border-b border-border/50 last:border-0 group cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewReservation(res)}
                      >
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
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewReservation(res)}>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              {res.status === "pending" && (
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
              <CardTitle className="text-sm font-medium">Today's Reservations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reservations.filter(r => r.date === "2026-01-20").map((res) => (
                <div 
                  key={res.id} 
                  className="p-3 border border-border/50 rounded-lg cursor-pointer hover:bg-muted/50"
                  onClick={() => handleViewReservation(res)}
                >
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
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setIsAddSheetOpen(true)}>
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
              {tables.slice(0, 5).map((table) => {
                const isBooked = reservations.some(r => r.table === table && r.date === "2026-01-20");
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

      {/* Add Reservation Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>New Reservation</SheetTitle>
            <SheetDescription>Create a new table reservation</SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label>Guest Name</Label>
              <Input placeholder="e.g., John Smith" />
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
                <Label>Time</Label>
                <Input type="time" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Number of Guests</Label>
                <Input type="number" placeholder="2" min="1" />
              </div>
              <div className="space-y-2">
                <Label>Table</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select table" /></SelectTrigger>
                  <SelectContent>
                    {tables.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <Textarea placeholder="Special requests or notes..." rows={3} />
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddSheetOpen(false)} className="w-full sm:w-auto">Cancel</Button>
            <Button className="w-full sm:w-auto">Create Reservation</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View Reservation Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>{selectedReservation?.name}</SheetTitle>
                <SheetDescription>Reservation #{selectedReservation?.id}</SheetDescription>
              </div>
              <Badge className={statusColors[selectedReservation?.status || "pending"]}>
                {selectedReservation?.status}
              </Badge>
            </div>
          </SheetHeader>
          
          <Tabs defaultValue="details" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <Calendar className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium text-sm">{selectedReservation?.date}</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Clock className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="font-medium text-sm">{selectedReservation?.time}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <Users className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Guests</p>
                  <p className="font-medium text-sm">{selectedReservation?.guests}</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Table</p>
                  <p className="font-semibold text-lg">{selectedReservation?.table}</p>
                </div>
              </div>
              {selectedReservation?.notes && (
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{selectedReservation.notes}</p>
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Created: {selectedReservation?.createdAt}
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedReservation?.phone}</p>
                </div>
              </div>
              {selectedReservation?.email && (
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedReservation.email}</p>
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
          </Tabs>
          
          <SheetFooter className="flex-col sm:flex-row gap-2 mt-6">
            {selectedReservation?.status === "pending" && (
              <>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto">
                  <XCircle className="h-4 w-4 mr-2" />Cancel
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                  <CheckCircle className="h-4 w-4 mr-2" />Confirm
                </Button>
              </>
            )}
            {selectedReservation?.status === "confirmed" && (
              <>
                <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                  <Trash2 className="h-4 w-4 mr-2" />Cancel
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
