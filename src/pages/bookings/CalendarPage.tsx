import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const CalendarPage = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentMonth = "January 2024";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">View all bookings and events</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
          <span className="font-medium min-w-32 text-center">{currentMonth}</span>
          <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Booking Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => (
              <div key={day} className="text-center font-medium py-2 text-muted-foreground">{day}</div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const dayNum = i - 1;
              const isCurrentMonth = dayNum >= 0 && dayNum < 31;
              const hasBooking = [5, 12, 15, 20, 25, 28].includes(dayNum + 1);
              return (
                <div 
                  key={i} 
                  className={`text-center py-4 rounded-lg border cursor-pointer hover:bg-accent ${
                    isCurrentMonth ? '' : 'text-muted-foreground/50'
                  } ${hasBooking ? 'bg-primary/10 border-primary' : ''}`}
                >
                  {isCurrentMonth ? dayNum + 1 : ''}
                  {hasBooking && isCurrentMonth && (
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mx-auto mt-1" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;
