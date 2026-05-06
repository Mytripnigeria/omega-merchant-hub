import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  Plus,
  Users,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
} from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { toast } from "sonner";
import {
  useShifts,
  useStaff,
  useRoles,
  useCreateShift,
  useUpdateShift,
  useDeleteShift,
} from "@/hooks/api/use-hr";
import { useStore } from "@/contexts/StoreContext";
import type { Shift } from "@/types/hr";

type View = "day" | "week" | "month";
type Period = "Morning" | "Afternoon" | "Night";

const periodColors: Record<Period, string> = {
  Morning: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Afternoon: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Night: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

function periodForTime(start: string): Period {
  const hour = parseInt(start.split(":")[0] ?? "0", 10);
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  return "Night";
}

interface ShiftForm {
  staffId: string;
  roleId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
}

function emptyForm(): ShiftForm {
  const today = new Date().toISOString().slice(0, 10);
  return {
    staffId: "",
    roleId: "",
    date: today,
    startTime: "09:00",
    endTime: "17:00",
    notes: "",
  };
}

function shiftToForm(s: Shift): ShiftForm {
  return {
    staffId: s.staffId,
    roleId: s.roleId ?? "",
    date: s.date,
    startTime: s.startTime,
    endTime: s.endTime,
    notes: s.notes ?? "",
  };
}

export default function ShiftsPage() {
  const { currentStore } = useStore();
  const [view, setView] = useState<View>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "add" | "edit">("view");
  const [selected, setSelected] = useState<Shift | null>(null);
  const [form, setForm] = useState<ShiftForm>(emptyForm());

  const { dateFrom, dateTo } = useMemo(() => {
    if (view === "day") {
      const d = format(currentDate, "yyyy-MM-dd");
      return { dateFrom: d, dateTo: d };
    }
    if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return {
        dateFrom: format(start, "yyyy-MM-dd"),
        dateTo: format(end, "yyyy-MM-dd"),
      };
    }
    return {
      dateFrom: format(startOfMonth(currentDate), "yyyy-MM-dd"),
      dateTo: format(endOfMonth(currentDate), "yyyy-MM-dd"),
    };
  }, [view, currentDate]);

  const shiftsQuery = useShifts({
    storeId: currentStore?.id,
    dateFrom,
    dateTo,
    limit: 200,
  });
  const staffQuery = useStaff({ storeId: currentStore?.id, limit: 200, status: "active" });
  const rolesQuery = useRoles({ storeId: currentStore?.id, limit: 100 });

  const createShift = useCreateShift();
  const updateShift = useUpdateShift();
  const deleteShift = useDeleteShift();

  const shifts = shiftsQuery.data?.data ?? [];

  const navigatePrev = () => {
    if (view === "day") setCurrentDate((d) => subDays(d, 1));
    else if (view === "week") setCurrentDate((d) => subWeeks(d, 1));
    else setCurrentDate((d) => subMonths(d, 1));
  };
  const navigateNext = () => {
    if (view === "day") setCurrentDate((d) => addDays(d, 1));
    else if (view === "week") setCurrentDate((d) => addWeeks(d, 1));
    else setCurrentDate((d) => addMonths(d, 1));
  };

  const displayDates = useMemo(() => {
    if (view === "day") return [currentDate];
    if (view === "week")
      return eachDayOfInterval({
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 }),
      });
    return eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    });
  }, [view, currentDate]);

  const navigationLabel = useMemo(() => {
    if (view === "day") return format(currentDate, "EEEE, MMMM d, yyyy");
    if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
    }
    return format(currentDate, "MMMM yyyy");
  }, [view, currentDate]);

  const shiftsForDate = (date: Date): Shift[] => {
    const key = format(date, "yyyy-MM-dd");
    return shifts.filter((s) => s.date === key);
  };

  const stats = [
    { label: "Shifts in Range", value: String(shifts.length), icon: Calendar },
    {
      label: "Staff Scheduled",
      value: String(new Set(shifts.map((s) => s.staffId)).size),
      icon: Users,
    },
    {
      label: "In Progress",
      value: String(shifts.filter((s) => s.status === "in-progress").length),
      icon: Clock,
    },
  ];

  const openAdd = (date?: Date) => {
    setSelected(null);
    setForm({
      ...emptyForm(),
      date: format(date ?? currentDate, "yyyy-MM-dd"),
    });
    setSheetMode("add");
    setSheetOpen(true);
  };
  const openView = (s: Shift) => {
    setSelected(s);
    setForm(shiftToForm(s));
    setSheetMode("view");
    setSheetOpen(true);
  };
  const openEdit = (s: Shift) => {
    setSelected(s);
    setForm(shiftToForm(s));
    setSheetMode("edit");
    setSheetOpen(true);
  };
  const close = () => {
    setSheetOpen(false);
    setSelected(null);
  };

  const handleCreate = () => {
    if (!currentStore) {
      toast.error("Select a store first");
      return;
    }
    if (!form.staffId) {
      toast.error("Pick a staff member");
      return;
    }
    createShift.mutate(
      {
        storeId: currentStore.id,
        staffId: form.staffId,
        roleId: form.roleId || undefined,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        notes: form.notes || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Shift created");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't create shift"),
      },
    );
  };

  const handleUpdate = () => {
    if (!selected) return;
    updateShift.mutate(
      {
        id: selected.id,
        data: {
          staffId: form.staffId,
          roleId: form.roleId || undefined,
          date: form.date,
          startTime: form.startTime,
          endTime: form.endTime,
          notes: form.notes || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Shift updated");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't update shift"),
      },
    );
  };

  const handleDelete = () => {
    if (!selected) return;
    if (!confirm("Delete this shift?")) return;
    deleteShift.mutate(selected.id, {
      onSuccess: () => {
        toast.success("Shift deleted");
        close();
      },
      onError: (e: Error) => toast.error(e.message ?? "Couldn't delete shift"),
    });
  };

  const isLoading = shiftsQuery.isLoading;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Shifts</h1>
          <p className="text-sm text-muted-foreground">Schedule and manage staff shifts</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-0.5">
            {(["month", "week", "day"] as View[]).map((v) => (
              <Button
                key={v}
                variant={view === v ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView(v)}
                className="h-7 px-3 text-xs capitalize"
              >
                {v}
              </Button>
            ))}
          </div>
          <Button size="sm" onClick={() => openAdd()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Shift
          </Button>
        </div>
      </div>

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

      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={navigatePrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">{navigationLabel}</span>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={navigateNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            {view === "day" ? "Day Schedule" : view === "week" ? "Week Schedule" : "Month Schedule"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : view === "day" ? (
            <div className="space-y-3">
              {shiftsForDate(currentDate).length > 0 ? (
                shiftsForDate(currentDate).map((s) => {
                  const period = periodForTime(s.startTime);
                  return (
                    <div
                      key={s.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => openView(s)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                            {s.staffName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{s.staffName}</p>
                            <p className="text-xs text-muted-foreground">{s.roleName ?? "—"}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className={periodColors[period]}>
                          {period}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5" />
                          {s.startTime} - {s.endTime}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {s.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No shifts scheduled for this day</p>
                </div>
              )}
            </div>
          ) : view === "week" ? (
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {displayDates.map((date) => {
                const list = shiftsForDate(date);
                const isToday = isSameDay(date, new Date());
                return (
                  <div key={date.toISOString()} className="text-center">
                    <p
                      className={`font-medium text-xs sm:text-sm mb-1 ${isToday ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {format(date, "EEE")}
                    </p>
                    <p
                      className={`text-xs mb-2 ${isToday ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mx-auto" : "text-muted-foreground"}`}
                    >
                      {format(date, "d")}
                    </p>
                    <div className="space-y-1 min-h-[100px]">
                      {list.map((s) => {
                        const period = periodForTime(s.startTime);
                        return (
                          <div
                            key={s.id}
                            className={`p-1.5 sm:p-2 rounded text-xs cursor-pointer transition-colors ${periodColors[period]}`}
                            onClick={() => openView(s)}
                          >
                            <p className="font-medium truncate text-[10px] sm:text-xs">
                              {s.staffName.split(" ")[0]}
                            </p>
                            <p className="text-[9px] sm:text-[10px] hidden sm:block opacity-75">
                              {s.startTime}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {d}
                </div>
              ))}
              {Array.from({
                length: (startOfMonth(currentDate).getDay() + 6) % 7,
              }).map((_, i) => (
                <div key={`empty-${i}`} className="p-1 min-h-[60px] sm:min-h-[80px]" />
              ))}
              {displayDates.map((date) => {
                const list = shiftsForDate(date);
                const isToday = isSameDay(date, new Date());
                return (
                  <div
                    key={date.toISOString()}
                    onClick={() => openAdd(date)}
                    className={`p-1 min-h-[60px] sm:min-h-[80px] border rounded text-center cursor-pointer ${isToday ? "border-primary bg-primary/5" : "border-border/50"}`}
                  >
                    <p
                      className={`text-xs mb-1 ${isToday ? "text-primary font-medium" : "text-muted-foreground"}`}
                    >
                      {format(date, "d")}
                    </p>
                    <div className="space-y-0.5">
                      {list.slice(0, 2).map((s) => {
                        const period = periodForTime(s.startTime);
                        return (
                          <div
                            key={s.id}
                            className={`p-0.5 rounded text-[9px] cursor-pointer truncate ${periodColors[period]}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              openView(s);
                            }}
                          >
                            {s.staffName.split(" ")[0]}
                          </div>
                        );
                      })}
                      {list.length > 2 && (
                        <p className="text-[9px] text-muted-foreground">+{list.length - 2}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={(o) => (o ? setSheetOpen(true) : close())}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="space-y-1 pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle>
                {sheetMode === "add"
                  ? "Create Shift"
                  : sheetMode === "edit"
                    ? "Edit Shift"
                    : selected
                      ? `${selected.staffName}'s Shift`
                      : "Shift"}
              </SheetTitle>
              {sheetMode === "view" && selected && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEdit(selected)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
            {sheetMode === "view" && selected && (
              <SheetDescription>
                {selected.date} • {selected.startTime} – {selected.endTime}
              </SheetDescription>
            )}
          </SheetHeader>

          {sheetMode === "view" && selected ? (
            <div className="space-y-6 mt-4">
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Staff</span>
                  <span className="font-medium">{selected.staffName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role</span>
                  <span className="font-medium">{selected.roleName ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{selected.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">
                    {selected.startTime} – {selected.endTime}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline">{selected.status}</Badge>
                </div>
                {selected.actualClockIn && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Clocked in</span>
                    <span className="font-medium">
                      {format(new Date(selected.actualClockIn), "PPp")}
                    </span>
                  </div>
                )}
                {selected.actualClockOut && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Clocked out</span>
                    <span className="font-medium">
                      {format(new Date(selected.actualClockOut), "PPp")}
                    </span>
                  </div>
                )}
                {selected.notes && (
                  <div className="pt-2 border-t">
                    <p className="text-muted-foreground text-xs mb-1">Notes</p>
                    <p>{selected.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1" onClick={() => openEdit(selected)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDelete}
                  disabled={deleteShift.isPending}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Staff Member</Label>
                <Select
                  value={form.staffId}
                  onValueChange={(v) => setForm({ ...form, staffId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select staff" />
                  </SelectTrigger>
                  <SelectContent>
                    {(staffQuery.data?.data ?? []).map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.firstName} {s.lastName} ({s.roleName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Role (optional)</Label>
                <Select
                  value={form.roleId}
                  onValueChange={(v) => setForm({ ...form, roleId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Use staff's default role" />
                  </SelectTrigger>
                  <SelectContent>
                    {(rolesQuery.data?.data ?? []).map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" className="flex-1" onClick={close}>
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={sheetMode === "add" ? handleCreate : handleUpdate}
                  disabled={createShift.isPending || updateShift.isPending}
                >
                  {sheetMode === "add" ? "Create Shift" : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
