import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Calendar, Clock, Plus, Users, ArrowLeftRight, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";

interface ShiftSchedule {
  id: number;
  period: "Morning" | "Afternoon" | "Night";
  role: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface Shift {
  id: number;
  staffId: number;
  staff: string;
  schedules: ShiftSchedule[];
}

const shiftsData: Shift[] = [
  { 
    id: 1, 
    staffId: 1,
    staff: "John Doe", 
    schedules: [
      { id: 1, period: "Morning", role: "Manager", date: "2026-01-13", startTime: "06:00", endTime: "14:00" },
      { id: 2, period: "Morning", role: "Manager", date: "2026-01-14", startTime: "06:00", endTime: "14:00" },
    ]
  },
  { 
    id: 2, 
    staffId: 2,
    staff: "Sarah Smith", 
    schedules: [
      { id: 3, period: "Afternoon", role: "Cashier", date: "2026-01-13", startTime: "14:00", endTime: "22:00" },
    ]
  },
  { 
    id: 3, 
    staffId: 3,
    staff: "Mike Johnson", 
    schedules: [
      { id: 4, period: "Morning", role: "Chef", date: "2026-01-13", startTime: "06:00", endTime: "14:00" },
    ]
  },
  { 
    id: 4, 
    staffId: 4,
    staff: "Lisa Brown", 
    schedules: [
      { id: 5, period: "Afternoon", role: "Waiter", date: "2026-01-14", startTime: "14:00", endTime: "22:00" },
    ]
  },
  { 
    id: 5, 
    staffId: 5,
    staff: "David Wilson", 
    schedules: [
      { id: 6, period: "Morning", role: "Rider", date: "2026-01-15", startTime: "06:00", endTime: "14:00" },
    ]
  },
];

export default function ShiftsPage() {
  const [view, setView] = useState("week");
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [sheetMode, setSheetMode] = useState<"view" | "add" | "edit">("view");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [schedules, setSchedules] = useState<Partial<ShiftSchedule>[]>([{ period: "Morning", role: "", date: "", startTime: "", endTime: "" }]);

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

  const openSheet = (mode: "view" | "add" | "edit", shift?: Shift) => {
    setSheetMode(mode);
    setSelectedShift(shift || null);
    if (mode === "add") {
      setSchedules([{ period: "Morning", role: "", date: "", startTime: "", endTime: "" }]);
    } else if (shift) {
      setSchedules(shift.schedules);
    }
    setIsSheetOpen(true);
  };

  const addScheduleRow = () => {
    setSchedules([...schedules, { period: "Morning", role: "", date: "", startTime: "", endTime: "" }]);
  };

  const removeScheduleRow = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  // Create a map of shifts by day for display
  const getShiftsByDay = (day: string) => {
    const dayIndex = days.indexOf(day);
    const baseDate = new Date("2026-01-13");
    baseDate.setDate(baseDate.getDate() + dayIndex);
    const dateStr = baseDate.toISOString().split('T')[0];
    
    const result: { staff: string; time: string; type: string }[] = [];
    shiftsData.forEach(shift => {
      shift.schedules.forEach(schedule => {
        if (schedule.date === dateStr) {
          result.push({
            staff: shift.staff,
            time: `${schedule.startTime} - ${schedule.endTime}`,
            type: schedule.period
          });
        }
      });
    });
    return result;
  };

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
              variant={view === "month" ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setView("month")}
              className="h-7 px-3 text-xs"
            >
              Month
            </Button>
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
          <Button size="sm" onClick={() => openSheet("add")}>
            <Plus className="h-4 w-4 mr-2" />Add Shift
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
                {days.map((day) => {
                  const shifts = getShiftsByDay(day);
                  return (
                    <div key={day} className="text-center">
                      <p className="font-medium text-xs sm:text-sm mb-2 text-muted-foreground">{day}</p>
                      <div className="space-y-1 min-h-[120px]">
                        {shifts.map((shift, idx) => (
                          <div 
                            key={idx} 
                            className="p-1.5 sm:p-2 bg-primary/10 rounded text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                            onClick={() => {
                              const fullShift = shiftsData.find(s => s.staff === shift.staff);
                              if (fullShift) openSheet("view", fullShift);
                            }}
                          >
                            <p className="font-medium truncate text-[10px] sm:text-xs">{shift.staff.split(' ')[0]}</p>
                            <p className="text-muted-foreground text-[9px] sm:text-[10px] hidden sm:block">{shift.time}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
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

      {/* Action Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="space-y-1 pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle>
                {sheetMode === "add" ? "Create Shift" : sheetMode === "edit" ? "Edit Shift" : `${selectedShift?.staff}'s Shift`}
              </SheetTitle>
              {sheetMode === "view" && selectedShift && (
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setSheetMode("edit")}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
            {sheetMode === "view" && selectedShift && (
              <SheetDescription>{selectedShift.schedules.length} schedule(s)</SheetDescription>
            )}
          </SheetHeader>

          {sheetMode === "view" && selectedShift ? (
            <div className="space-y-6 mt-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Staff Member</h4>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium">{selectedShift.staff}</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium text-muted-foreground">Schedules</h4>
                <div className="space-y-3">
                  {selectedShift.schedules.map((schedule) => (
                    <div key={schedule.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{schedule.period}</Badge>
                        <span className="text-sm font-medium">{schedule.role}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{schedule.date}</span>
                        <span>{schedule.startTime} - {schedule.endTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1" onClick={() => setSheetMode("edit")}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" className="flex-1">Delete Shift</Button>
              </div>
            </div>
          ) : (
            /* Add/Edit Form */
            <div className="space-y-6 mt-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Shift Details</h4>
                <div className="space-y-2">
                  <Label>Select Staff</Label>
                  <Select defaultValue={selectedShift?.staffId.toString()}>
                    <SelectTrigger><SelectValue placeholder="Select staff member" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">John Doe</SelectItem>
                      <SelectItem value="2">Sarah Smith</SelectItem>
                      <SelectItem value="3">Mike Johnson</SelectItem>
                      <SelectItem value="4">Lisa Brown</SelectItem>
                      <SelectItem value="5">David Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Schedule(s)</h4>
                  <Button variant="outline" size="sm" onClick={addScheduleRow}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Schedule
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {schedules.map((schedule, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Schedule {index + 1}</span>
                        {schedules.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeScheduleRow(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Period</Label>
                          <Select defaultValue={schedule.period}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Morning">Morning</SelectItem>
                              <SelectItem value="Afternoon">Afternoon</SelectItem>
                              <SelectItem value="Night">Night</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Role</Label>
                          <Select defaultValue={schedule.role}>
                            <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Manager">Manager</SelectItem>
                              <SelectItem value="Cashier">Cashier</SelectItem>
                              <SelectItem value="Chef">Chef</SelectItem>
                              <SelectItem value="Waiter">Waiter</SelectItem>
                              <SelectItem value="Rider">Rider</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" defaultValue={schedule.date} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Time</Label>
                          <Input type="time" defaultValue={schedule.startTime} />
                        </div>
                        <div className="space-y-2">
                          <Label>End Time</Label>
                          <Input type="time" defaultValue={schedule.endTime} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1" onClick={() => setIsSheetOpen(false)}>Cancel</Button>
                <Button className="flex-1">{sheetMode === "add" ? "Create Shift" : "Save Changes"}</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
