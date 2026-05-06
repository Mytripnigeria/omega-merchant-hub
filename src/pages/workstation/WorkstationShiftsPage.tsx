import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  Clock,
  Play,
  Square,
  Users,
  Calendar,
  Coffee,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { format, formatDistanceStrict } from "date-fns";
import {
  useShifts,
  useStaff,
  useCreateShift,
  useUpdateShift,
  useAdminEndShift,
  useAddShiftBreak,
  useDeleteShiftBreak,
} from "@/hooks/api/use-hr";
import { useStore } from "@/contexts/StoreContext";
import type { Shift, ShiftBreak } from "@/types/hr";

const ALL = "__all__";

function formatDuration(start?: string | null, end?: string | null): string {
  if (!start) return "—";
  const startMs = new Date(start).getTime();
  const endMs = end ? new Date(end).getTime() : Date.now();
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return "—";
  return formatDistanceStrict(endMs, startMs);
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

interface NewShiftForm {
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
}

interface BreakForm {
  type: ShiftBreak["type"];
  durationMinutes: string;
  notes: string;
}

export default function WorkstationShiftsPage() {
  const { currentStore } = useStore();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [statusFilter, setStatusFilter] = useState<string>("in-progress");
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "edit" | "add">("view");
  const [newForm, setNewForm] = useState<NewShiftForm>({
    staffId: "",
    date: todayIso(),
    startTime: "09:00",
    endTime: "17:00",
    notes: "",
  });
  const [editNotes, setEditNotes] = useState("");
  const [breakForm, setBreakForm] = useState<BreakForm>({
    type: "lunch",
    durationMinutes: "30",
    notes: "",
  });

  const shiftsQuery = useShifts({
    storeId: currentStore?.id,
    status: statusFilter === ALL ? undefined : (statusFilter as Shift["status"]),
    page,
    limit: pageSize,
  });
  const staffQuery = useStaff({ storeId: currentStore?.id, limit: 100, status: "active" });

  const todaysCompletedShifts = useShifts({
    storeId: currentStore?.id,
    status: "completed",
    date: todayIso(),
    limit: 100,
  });
  const scheduledShifts = useShifts({
    storeId: currentStore?.id,
    status: "scheduled",
    dateFrom: todayIso(),
    limit: 100,
  });

  const createShift = useCreateShift();
  const updateShift = useUpdateShift();
  const adminEndShift = useAdminEndShift();
  const addBreak = useAddShiftBreak();
  const deleteBreak = useDeleteShiftBreak();

  const shifts = shiftsQuery.data?.data ?? [];
  const total = shiftsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  const totalHoursToday = useMemo(() => {
    const list = todaysCompletedShifts.data?.data ?? [];
    let mins = 0;
    for (const s of list) {
      if (s.actualClockIn && s.actualClockOut) {
        const ms = new Date(s.actualClockOut).getTime() - new Date(s.actualClockIn).getTime();
        if (ms > 0) mins += ms / 60000;
      }
    }
    return Math.round(mins / 60);
  }, [todaysCompletedShifts.data]);

  const stats = [
    {
      label: "Active Shifts",
      value: String(
        statusFilter === "in-progress"
          ? total
          : (shiftsQuery.data?.data.filter((s) => s.status === "in-progress").length ?? 0),
      ),
      icon: Users,
    },
    { label: "Total Hours Today", value: `${totalHoursToday}h`, icon: Clock },
    { label: "Scheduled", value: String(scheduledShifts.data?.total ?? 0), icon: Calendar },
  ];

  const openView = (s: Shift) => {
    setSelectedShift(s);
    setEditNotes(s.notes ?? "");
    setSheetMode("view");
    setSheetOpen(true);
  };
  const openEdit = (s: Shift) => {
    setSelectedShift(s);
    setEditNotes(s.notes ?? "");
    setSheetMode("edit");
    setSheetOpen(true);
  };
  const openAdd = () => {
    setSelectedShift(null);
    setNewForm({
      staffId: "",
      date: todayIso(),
      startTime: "09:00",
      endTime: "17:00",
      notes: "",
    });
    setSheetMode("add");
    setSheetOpen(true);
  };
  const closeSheet = () => {
    setSheetOpen(false);
    setSelectedShift(null);
    setBreakForm({ type: "lunch", durationMinutes: "30", notes: "" });
  };

  const handleStartShift = () => {
    if (!currentStore || !newForm.staffId) {
      toast.error("Pick a store and staff member");
      return;
    }
    createShift.mutate(
      {
        storeId: currentStore.id,
        staffId: newForm.staffId,
        date: newForm.date,
        startTime: newForm.startTime,
        endTime: newForm.endTime,
        notes: newForm.notes || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Shift created");
          closeSheet();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't create shift"),
      },
    );
  };

  const handleSaveEdit = () => {
    if (!selectedShift) return;
    updateShift.mutate(
      {
        id: selectedShift.id,
        data: { notes: editNotes },
      },
      {
        onSuccess: () => {
          toast.success("Shift updated");
          closeSheet();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't update shift"),
      },
    );
  };

  const handleSaveNotes = () => {
    if (!selectedShift) return;
    updateShift.mutate(
      { id: selectedShift.id, data: { notes: editNotes } },
      {
        onSuccess: () => toast.success("Notes saved"),
        onError: (e: Error) => toast.error(e.message ?? "Couldn't save notes"),
      },
    );
  };

  const handleEndShift = (id: string) => {
    if (!confirm("End this shift now?")) return;
    adminEndShift.mutate(id, {
      onSuccess: () => {
        toast.success("Shift ended");
        if (selectedShift?.id === id) closeSheet();
      },
      onError: (e: Error) => toast.error(e.message ?? "Couldn't end shift"),
    });
  };

  const handleAddBreak = () => {
    if (!selectedShift) return;
    const durationMinutes = Number(breakForm.durationMinutes);
    if (!durationMinutes || durationMinutes < 1) {
      toast.error("Duration must be a positive number");
      return;
    }
    addBreak.mutate(
      {
        shiftId: selectedShift.id,
        type: breakForm.type,
        startTime: new Date().toISOString(),
        durationMinutes,
        notes: breakForm.notes || undefined,
      },
      {
        onSuccess: (updated) => {
          setSelectedShift(updated);
          setBreakForm({ type: "lunch", durationMinutes: "30", notes: "" });
          toast.success("Break logged");
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't log break"),
      },
    );
  };

  const handleDeleteBreak = (breakId: string) => {
    if (!selectedShift) return;
    deleteBreak.mutate(
      { shiftId: selectedShift.id, breakId },
      {
        onSuccess: (updated) => {
          setSelectedShift(updated);
          toast.success("Break removed");
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't remove break"),
      },
    );
  };

  const isLoading = shiftsQuery.isLoading;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Workstation Shifts</h1>
          <p className="text-sm text-muted-foreground">Manage active shifts and clock in/out</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={openAdd}>
          <Play className="mr-2 h-4 w-4" />
          Start Shift
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={stat.label} className={index === 2 ? "col-span-2 md:col-span-1" : ""}>
            <CardContent className="p-3 sm:p-4 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="p-4 flex-row items-center justify-between">
          <CardTitle className="text-sm sm:text-base">Shifts</CardTitle>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All</SelectItem>
              <SelectItem value="in-progress">In progress</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="missed">Missed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : shifts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No shifts in this view</p>
            </div>
          ) : (
            <div className="space-y-3">
              {shifts.map((shift) => (
                <div
                  key={shift.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border rounded-lg transition-colors hover:bg-muted/50 cursor-pointer"
                  onClick={() => openView(shift)}
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{shift.staffName || "—"}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {shift.roleName ?? "—"} • {shift.date} • {shift.startTime} – {shift.endTime}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                    <Badge variant="outline" className="text-xs">
                      {shift.status === "in-progress"
                        ? `Active • ${formatDuration(shift.actualClockIn)}`
                        : shift.status}
                    </Badge>
                    {shift.status === "in-progress" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEndShift(shift.id);
                        }}
                        disabled={adminEndShift.isPending}
                      >
                        <Square className="mr-1 sm:mr-2 h-3 w-3" />
                        <span className="hidden sm:inline">End Shift</span>
                        <span className="sm:hidden">End</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {total > 0 && (
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          startIndex={startIndex + 1}
          endIndex={endIndex}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      )}

      <Sheet open={sheetOpen} onOpenChange={(o) => (o ? setSheetOpen(true) : closeSheet())}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {sheetMode === "add"
                ? "Start New Shift"
                : sheetMode === "edit"
                  ? "Edit Shift"
                  : "Shift Details"}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === "add"
                ? "Schedule a shift for a staff member"
                : selectedShift
                  ? `${selectedShift.staffName} • ${selectedShift.date}`
                  : ""}
            </SheetDescription>
          </SheetHeader>

          {sheetMode === "view" && selectedShift ? (
            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="breaks">Breaks</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Staff Member</Label>
                    <p className="text-sm font-medium">{selectedShift.staffName}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Role</Label>
                    <p className="text-sm font-medium">{selectedShift.roleName ?? "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Scheduled</Label>
                    <p className="text-sm font-medium">
                      {selectedShift.date} {selectedShift.startTime}–{selectedShift.endTime}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <Badge variant="outline">{selectedShift.status}</Badge>
                  </div>
                  {selectedShift.actualClockIn && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Clocked in</Label>
                      <p className="text-sm font-medium">
                        {format(new Date(selectedShift.actualClockIn), "p")}
                      </p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Duration</Label>
                    <p className="text-sm font-medium">
                      {formatDuration(selectedShift.actualClockIn, selectedShift.actualClockOut)}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="breaks" className="space-y-4 mt-4">
                {(selectedShift.breaks?.length ?? 0) > 0 ? (
                  <div className="space-y-3">
                    {selectedShift.breaks!.map((brk) => (
                      <div key={brk.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium capitalize">{brk.type}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(brk.startTime), "PP p")}
                            </p>
                            {brk.notes && (
                              <p className="text-xs mt-1">{brk.notes}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{brk.durationMinutes}m</Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteBreak(brk.id)}
                              disabled={deleteBreak.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <Coffee className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">No breaks logged yet</p>
                  </div>
                )}
                <div className="border-t pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={breakForm.type}
                      onValueChange={(v) => setBreakForm({ ...breakForm, type: v as ShiftBreak["type"] })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="rest">Rest</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min={1}
                      placeholder="Minutes"
                      value={breakForm.durationMinutes}
                      onChange={(e) => setBreakForm({ ...breakForm, durationMinutes: e.target.value })}
                    />
                  </div>
                  <Input
                    placeholder="Notes (optional)"
                    value={breakForm.notes}
                    onChange={(e) => setBreakForm({ ...breakForm, notes: e.target.value })}
                  />
                  <Button
                    className="w-full"
                    onClick={handleAddBreak}
                    disabled={addBreak.isPending}
                  >
                    <Coffee className="mr-2 h-4 w-4" />
                    Log Break
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4 mt-4">
                <Textarea
                  placeholder="Add a note..."
                  className="min-h-[120px]"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                />
                <Button
                  className="w-full"
                  onClick={handleSaveNotes}
                  disabled={updateShift.isPending}
                >
                  Save Notes
                </Button>
              </TabsContent>
            </Tabs>
          ) : sheetMode === "edit" && selectedShift ? (
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label>Staff Member</Label>
                <Select
                  value={newForm.staffId}
                  onValueChange={(v) => setNewForm({ ...newForm, staffId: v })}
                >
                  <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
                  <SelectContent>
                    {(staffQuery.data?.data ?? []).map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.firstName} {s.lastName} ({s.roleName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newForm.date}
                    onChange={(e) => setNewForm({ ...newForm, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start</Label>
                  <Input
                    type="time"
                    value={newForm.startTime}
                    onChange={(e) => setNewForm({ ...newForm, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End</Label>
                  <Input
                    type="time"
                    value={newForm.endTime}
                    onChange={(e) => setNewForm({ ...newForm, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Optional"
                  value={newForm.notes}
                  onChange={(e) => setNewForm({ ...newForm, notes: e.target.value })}
                />
              </div>
            </div>
          )}

          <SheetFooter className="mt-6 flex-col sm:flex-row gap-2">
            {sheetMode === "view" && selectedShift ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => openEdit(selectedShift)}
                  className="w-full sm:w-auto"
                >
                  Edit Shift
                </Button>
                {selectedShift.status === "in-progress" && (
                  <Button
                    variant="destructive"
                    className="w-full sm:w-auto"
                    onClick={() => handleEndShift(selectedShift.id)}
                    disabled={adminEndShift.isPending}
                  >
                    <Square className="mr-2 h-4 w-4" />
                    End Shift
                  </Button>
                )}
              </>
            ) : sheetMode === "edit" ? (
              <>
                <Button variant="outline" onClick={closeSheet} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button
                  className="w-full sm:w-auto"
                  onClick={handleSaveEdit}
                  disabled={updateShift.isPending}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={closeSheet} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button
                  className="w-full sm:w-auto"
                  onClick={handleStartShift}
                  disabled={createShift.isPending}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Shift
                </Button>
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
