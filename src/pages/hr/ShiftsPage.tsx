import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Plus, Users, ArrowLeftRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function ShiftsPage() {
  const [view, setView] = useState("week");

  const shifts = [
    { id: 1, staff: "John Doe", day: "Mon", time: "06:00 - 14:00", type: "Morning" },
    { id: 2, staff: "Sarah Smith", day: "Mon", time: "14:00 - 22:00", type: "Afternoon" },
    { id: 3, staff: "Mike Johnson", day: "Mon", time: "06:00 - 14:00", type: "Morning" },
    { id: 4, staff: "Lisa Brown", day: "Tue", time: "14:00 - 22:00", type: "Afternoon" },
    { id: 5, staff: "David Wilson", day: "Wed", time: "06:00 - 14:00", type: "Morning" },
    { id: 6, staff: "Emma Davis", day: "Thu", time: "14:00 - 22:00", type: "Afternoon" },
    { id: 7, staff: "Chris Lee", day: "Fri", time: "06:00 - 14:00", type: "Morning" },
  ];

  const swapRequests = [
    { id: 1, from: "John Doe", to: "Sarah Smith", date: "Jan 15", status: "pending" },
    { id: 2, from: "Mike Johnson", to: "Lisa Brown", date: "Jan 16", status: "approved" },
  ];

  const stats = [
    { label: "Shifts This Week", value: "48", icon: Calendar },
    { label: "Staff Scheduled", value: "12", icon: Users },
    { label: "Swap Requests", value: "3", icon: ArrowLeftRight },
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Shifts</h1>
          <p className="text-sm text-muted-foreground">Schedule and manage staff shifts</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-0.5">
            <Button 
              variant={view === "week" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setView("week")}
              className="h-7 px-3 text-xs"
            >
              Week
            </Button>
            <Button 
              variant={view === "day" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setView("day")}
              className="h-7 px-3 text-xs"
            >
              Day
            </Button>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Shift</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Shift</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Staff Member</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Doe</SelectItem>
                      <SelectItem value="sarah">Sarah Smith</SelectItem>
                      <SelectItem value="mike">Mike Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Date</Label><Input type="date" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Start Time</Label><Input type="time" /></div>
                  <div className="space-y-2"><Label>End Time</Label><Input type="time" /></div>
                </div>
                <Button className="w-full">Create Shift</Button>
              </div>
            </DialogContent>
          </Dialog>
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

          {/* Week Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">January 13 - 19, 2026</span>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Weekly Schedule */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">This Week's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {days.map((day) => (
                  <div key={day} className="text-center">
                    <p className="font-medium text-xs sm:text-sm mb-2 text-muted-foreground">{day}</p>
                    <div className="space-y-1 min-h-[120px]">
                      {shifts.filter(s => s.day === day).map((shift) => (
                        <div 
                          key={shift.id} 
                          className="p-1.5 sm:p-2 bg-primary/10 rounded text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                        >
                          <p className="font-medium truncate text-[10px] sm:text-xs">{shift.staff.split(' ')[0]}</p>
                          <p className="text-muted-foreground text-[9px] sm:text-[10px] hidden sm:block">{shift.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Swap Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {swapRequests.map((req) => (
                <div key={req.id} className="p-3 border border-border/50 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{req.from}</span>
                    <ArrowLeftRight className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">{req.to}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">{req.date}</Badge>
                    <Badge 
                      variant={req.status === "approved" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {req.status}
                    </Badge>
                  </div>
                  {req.status === "pending" && (
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">Deny</Button>
                      <Button size="sm" className="flex-1 h-7 text-xs">Approve</Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Shift Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Morning</span>
                </div>
                <span className="text-xs text-muted-foreground">06:00 - 14:00</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500" />
                  <span className="text-sm">Afternoon</span>
                </div>
                <span className="text-xs text-muted-foreground">14:00 - 22:00</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500" />
                  <span className="text-sm">Night</span>
                </div>
                <span className="text-xs text-muted-foreground">22:00 - 06:00</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Today's Staff</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {["John Doe", "Sarah Smith", "Mike Johnson"].map((name) => (
                <div key={name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-xs text-muted-foreground">On shift</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
