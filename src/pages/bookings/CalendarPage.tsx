import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const CalendarPage = () => {
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

  const getBookingForDay = (day: number) => bookings.find(b => b.day === day);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Calendar</h1>
          <p className="text-sm text-muted-foreground">View all bookings and events</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium min-w-32 text-center text-sm">{currentMonth}</span>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button size="sm" className="ml-2">
            <Plus className="h-4 w-4 mr-2" />
            Add Booking
          </Button>
        </div>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
            {days.map((day) => (
              <div key={day} className="bg-muted/50 text-center font-medium py-3 text-xs text-muted-foreground">
                {day}
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
                  className={`bg-background min-h-24 p-2 transition-colors hover:bg-muted/50 cursor-pointer ${
                    !isCurrentMonth ? "bg-muted/30" : ""
                  }`}
                >
                  {isCurrentMonth && (
                    <>
                      <div className={`text-sm font-medium mb-1 ${
                        isToday 
                          ? "bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center" 
                          : "text-foreground"
                      }`}>
                        {dayNum + 1}
                      </div>
                      {booking && (
                        <Badge 
                          variant={booking.type === "event" ? "default" : "secondary"} 
                          className="text-xs px-1.5 py-0"
                        >
                          {booking.count} {booking.type === "event" ? "events" : "tables"}
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

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">Tables</Badge>
          <span>Table reservations</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-xs">Events</Badge>
          <span>Special events</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
