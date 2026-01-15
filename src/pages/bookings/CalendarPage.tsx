import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus, Calendar, Users, Clock } from "lucide-react";

export default function CalendarPage() {
  const [currentDate] = useState(new Date(2026, 0, 1));
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentMonth = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const bookings = [
    { day: 5, count: 3, type: "table" },
    { day: 12, count: 5, type: "event" },
    { day: 15, count: 2, type: "table" },
    { day: 20, count: 1, type: "event" },
    { day: 25, count: 4, type: "table" },
    { day: 28, count: 2, type: "table" },
  ];

  const stats = [
    { label: "This Month", value: "48", icon: Calendar },
    { label: "Total Guests", value: "320", icon: Users },
    { label: "Events", value: "8", icon: Clock },
  ];

  const getBookingForDay = (day: number) => bookings.find(b => b.day === day);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
          <p className="text-sm text-muted-foreground">View all bookings and events</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium min-w-28 text-center text-sm">{currentMonth}</span>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button size="sm" className="ml-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Booking
          </Button>
        </div>
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

          {/* Calendar */}
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
                {days.map((day) => (
                  <div key={day} className="bg-muted/50 text-center font-medium py-2 sm:py-3 text-xs text-muted-foreground">
                    <span className="hidden sm:inline">{day}</span>
                    <span className="sm:hidden">{day.slice(0, 1)}</span>
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const dayNum = i - 3;
                  const isCurrentMonth = dayNum >= 0 && dayNum < 31;
                  const booking = isCurrentMonth ? getBookingForDay(dayNum + 1) : null;
                  const isToday = dayNum + 1 === 14;

                  return (
                    <div
                      key={i}
                      className={`bg-background min-h-16 sm:min-h-24 p-1 sm:p-2 transition-colors hover:bg-muted/50 cursor-pointer ${
                        !isCurrentMonth ? "bg-muted/30" : ""
                      }`}
                    >
                      {isCurrentMonth && (
                        <>
                          <div className={`text-xs sm:text-sm font-medium mb-1 ${
                            isToday 
                              ? "bg-primary text-primary-foreground w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs" 
                              : "text-foreground"
                          }`}>
                            {dayNum + 1}
                          </div>
                          {booking && (
                            <Badge 
                              variant={booking.type === "event" ? "default" : "secondary"} 
                              className="text-[9px] sm:text-xs px-1 py-0"
                            >
                              <span className="hidden sm:inline">{booking.count} {booking.type === "event" ? "events" : "tables"}</span>
                              <span className="sm:hidden">{booking.count}</span>
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">Tables</Badge>
              <span className="text-xs">Table reservations</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs">Events</Badge>
              <span className="text-xs">Special events</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Upcoming This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {bookings.slice(0, 4).map((booking, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">Jan {booking.day}</p>
                    <p className="text-xs text-muted-foreground">{booking.count} {booking.type}s</p>
                  </div>
                  <Badge variant={booking.type === "event" ? "default" : "secondary"} className="text-xs">
                    {booking.type}
                  </Badge>
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
                View Day
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                All Reservations
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Monthly Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Bookings</span>
                <span className="font-medium">48</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Table Reservations</span>
                <span className="font-medium">36</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Special Events</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="text-muted-foreground">Expected Guests</span>
                <span className="font-semibold">320</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
