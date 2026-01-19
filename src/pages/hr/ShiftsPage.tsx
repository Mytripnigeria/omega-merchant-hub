import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Calendar, Clock, Plus, Users, ArrowLeftRight, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths, eachDayOfInterval, isSameDay } from "date-fns";
import type { Shift } from "@/types/hr";

// Extended Shift type for UI with computed fields
interface ShiftSchedule {
  id: string;
  period: "Morning" | "Afternoon" | "Night";
  role: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface ShiftGroup {
  id: string;
  staffId: string;
  staff: string;
  schedules: ShiftSchedule[];
}

// Transform API Shifts to grouped UI format
const groupShiftsByStaff = (shifts: Shift[]): ShiftGroup[] => {
  const grouped: Record<string, ShiftGroup> = {};
  
  shifts.forEach(shift => {
    if (!grouped[shift.staffId]) {
      grouped[shift.staffId] = {
        id: shift.staffId,
        staffId: shift.staffId,
        staff: shift.staffName,
        schedules: [],
      };
    }
    
    const startHour = parseInt(shift.startTime.split(":")[0]);
    const period: "Morning" | "Afternoon" | "Night" = 
      startHour < 12 ? "Morning" : startHour < 18 ? "Afternoon" : "Night";
    
    grouped[shift.staffId].schedules.push({
      id: shift.id,
      period,
      role: shift.roleName || "Staff",
      date: shift.date,
      startTime: shift.startTime,
      endTime: shift.endTime,
    });
  });
  
  return Object.values(grouped);
};

const mockShifts: Shift[] = [
  { id: "s1", storeId: "store-1", staffId: "1", staffName: "John Doe", roleId: "r1", roleName: "Manager", date: "2026-01-13", startTime: "06:00", endTime: "14:00", status: "scheduled", createdAt: "2026-01-10", updatedAt: "2026-01-10" },
  { id: "s2", storeId: "store-1", staffId: "1", staffName: "John Doe", roleId: "r1", roleName: "Manager", date: "2026-01-14", startTime: "06:00", endTime: "14:00", status: "scheduled", createdAt: "2026-01-10", updatedAt: "2026-01-10" },
  { id: "s3", storeId: "store-1", staffId: "1", staffName: "John Doe", roleId: "r1", roleName: "Manager", date: "2026-01-18", startTime: "14:00", endTime: "22:00", status: "scheduled", createdAt: "2026-01-10", updatedAt: "2026-01-10" },
  { id: "s4", storeId: "store-1", staffId: "2", staffName: "Sarah Smith", roleId: "r2", roleName: "Cashier", date: "2026-01-13", startTime: "14:00", endTime: "22:00", status: "scheduled", createdAt: "2026-01-10", updatedAt: "2026-01-10" },
  { id: "s5", storeId: "store-1", staffId: "2", staffName: "Sarah Smith", roleId: "r2", roleName: "Cashier", date: "2026-01-15", startTime: "06:00", endTime: "14:00", status: "scheduled", createdAt: "2026-01-10", updatedAt: "2026-01-10" },
  { id: "s6", storeId: "store-1", staffId: "3", staffName: "Mike Johnson", roleId: "r3", roleName: "Chef", date: "2026-01-13", startTime: "06:00", endTime: "14:00", status: "scheduled", createdAt: "2026-01-10", updatedAt: "2026-01-10" },
  { id: "s7", storeId: "store-1", staffId: "3", staffName: "Mike Johnson", roleId: "r3", roleName: "Chef", date: "2026-01-16", startTime: "22:00", endTime: "06:00", status: "scheduled", createdAt: "2026-01-10", updatedAt: "2026-01-10" },
  { id: "s8", storeId: "store-1", staffId: "4", staffName: "Lisa Brown", roleId: "r4", roleName: "Waiter", date: "2026-01-14", startTime: "14:00", endTime: "22:00", status: "scheduled", createdAt: "2026-01-10", updatedAt: "2026-01-10" },
  { id: "s9", storeId: "store-1", staffId: "4", staffName: "Lisa Brown", roleId: "r4", roleName: "Waiter", date: "2026-01-17", startTime: "06:00", endTime: "14:00", status: "scheduled", createdAt: "2026-01-10", updatedAt: "2026-01-10" },
  { id: "s10", storeId: "store-1", staffId: "5", staffName: "David Wilson", roleId: "r5", roleName: "Rider", date: "2026-01-15", startTime: "06:00", endTime: "14:00", status: "scheduled", createdAt: "2026-01-10", updatedAt: "2026-01-10" },
];

// Transform to UI format
const shiftsData: ShiftGroup[] = groupShiftsByStaff(mockShifts);

const periodColors = {
  Morning: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Afternoon: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Night: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function ShiftsPage() {
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [selectedShift, setSelectedShift] = useState<ShiftGroup | null>(null);
  const [sheetMode, setSheetMode] = useState<"view" | "add" | "edit">("view");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [schedules, setSchedules] = useState<Partial<ShiftSchedule>[]>([{ period: "Morning", role: "", date: "", startTime: "", endTime: "" }]);
  const [currentDate, setCurrentDate] = useState(new Date("2026-01-14"));

  const swapRequests = [
    { id: 1, from: "John Doe", to: "Sarah Smith", date: "Jan 15", status: "pending" },
    { id: 2, from: "Mike Johnson", to: "Lisa Brown", date: "Jan 16", status: "approved" },
  ];

  const stats = [
    { label: "Shifts This Week", value: "48", icon: Calendar },
    { label: "Staff Scheduled", value: "12", icon: Users },
    { label: "Swap Requests", value: "3", icon: ArrowLeftRight },
  ];

  const openSheet = (mode: "view" | "add" | "edit", shift?: ShiftGroup) => {
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

  // Navigation handlers
  const navigatePrevious = () => {
    if (view === "day") setCurrentDate(prev => subDays(prev, 1));
    else if (view === "week") setCurrentDate(prev => subWeeks(prev, 1));
    else setCurrentDate(prev => subMonths(prev, 1));
  };

  const navigateNext = () => {
    if (view === "day") setCurrentDate(prev => addDays(prev, 1));
    else if (view === "week") setCurrentDate(prev => addWeeks(prev, 1));
    else setCurrentDate(prev => addMonths(prev, 1));
  };

  // Get display dates based on view
  const displayDates = useMemo(() => {
    if (view === "day") {
      return [currentDate];
    } else if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return eachDayOfInterval({ start, end });
    }
  }, [currentDate, view]);

  // Get navigation label
  const navigationLabel = useMemo(() => {
    if (view === "day") {
      return format(currentDate, "EEEE, MMMM d, yyyy");
    } else if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(start, "MMM d")} - ${format(end, "d, yyyy")}`;
    } else {
      return format(currentDate, "MMMM yyyy");
    }
  }, [currentDate, view]);

  // Get shifts for a specific date
  const getShiftsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const result: { shift: ShiftGroup; schedule: ShiftSchedule }[] = [];
    shiftsData.forEach(shift => {
      shift.schedules.forEach(schedule => {
        if (schedule.date === dateStr) {
          result.push({ shift, schedule });
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

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={navigatePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{navigationLabel}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={navigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Schedule View */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                {view === "day" ? "Today's Schedule" : view === "week" ? "This Week's Schedule" : "Monthly Schedule"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Day View */}
              {view === "day" && (
                <div className="space-y-3">
                  {getShiftsForDate(currentDate).length > 0 ? (
                    getShiftsForDate(currentDate).map(({ shift, schedule }) => (
                      <div
                        key={`${shift.id}-${schedule.id}`}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => openSheet("view", shift)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                              {shift.staff.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{shift.staff}</p>
                              <p className="text-xs text-muted-foreground">{schedule.role}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className={periodColors[schedule.period]}>
                            {schedule.period}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{schedule.startTime} - {schedule.endTime}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No shifts scheduled for this day</p>
                    </div>
                  )}
                </div>
              )}

              {/* Week View */}
              {view === "week" && (
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {displayDates.map((date) => {
                    const shifts = getShiftsForDate(date);
                    const isToday = isSameDay(date, new Date("2026-01-14"));
                    return (
                      <div key={date.toISOString()} className="text-center">
                        <p className={`font-medium text-xs sm:text-sm mb-1 ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                          {format(date, "EEE")}
                        </p>
                        <p className={`text-xs mb-2 ${isToday ? 'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mx-auto' : 'text-muted-foreground'}`}>
                          {format(date, "d")}
                        </p>
                        <div className="space-y-1 min-h-[100px]">
                          {shifts.map(({ shift, schedule }) => (
                            <div 
                              key={`${shift.id}-${schedule.id}`}
                              className={`p-1.5 sm:p-2 rounded text-xs cursor-pointer transition-colors ${periodColors[schedule.period]}`}
                              onClick={() => openSheet("view", shift)}
                            >
                              <p className="font-medium truncate text-[10px] sm:text-xs">{shift.staff.split(' ')[0]}</p>
                              <p className="text-[9px] sm:text-[10px] hidden sm:block opacity-75">{schedule.startTime}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Month View */}
              {view === "month" && (
                <div className="grid grid-cols-7 gap-1">
                  {/* Weekday headers */}
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                  {/* Empty cells for start of month offset */}
                  {Array.from({ length: (startOfMonth(currentDate).getDay() + 6) % 7 }).map((_, i) => (
                    <div key={`empty-${i}`} className="p-1 min-h-[60px] sm:min-h-[80px]" />
                  ))}
                  {/* Date cells */}
                  {displayDates.map((date) => {
                    const shifts = getShiftsForDate(date);
                    const isToday = isSameDay(date, new Date("2026-01-14"));
                    return (
                      <div 
                        key={date.toISOString()} 
                        className={`p-1 min-h-[60px] sm:min-h-[80px] border rounded text-center ${isToday ? 'border-primary bg-primary/5' : 'border-border/50'}`}
                      >
                        <p className={`text-xs mb-1 ${isToday ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                          {format(date, "d")}
                        </p>
                        <div className="space-y-0.5">
                          {shifts.slice(0, 2).map(({ shift, schedule }) => (
                            <div 
                              key={`${shift.id}-${schedule.id}`}
                              className={`p-0.5 rounded text-[9px] cursor-pointer truncate ${periodColors[schedule.period]}`}
                              onClick={() => openSheet("view", shift)}
                            >
                              {shift.staff.split(' ')[0]}
                            </div>
                          ))}
                          {shifts.length > 2 && (
                            <p className="text-[9px] text-muted-foreground">+{shifts.length - 2} more</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
                        <Badge variant="outline" className={periodColors[schedule.period]}>{schedule.period}</Badge>
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