import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Play, Square, Users, Calendar, X, FileText, Coffee, AlertCircle } from "lucide-react";

interface Shift {
  id: number;
  user: string;
  role: string;
  started: string;
  duration: string;
  breaks?: { type: string; start: string; duration: string }[];
  notes?: string;
}

const activeShifts: Shift[] = [
  { id: 1, user: "John Doe", role: "Cashier", started: "9:00 AM", duration: "4h 30m", breaks: [{ type: "Lunch", start: "12:00 PM", duration: "30m" }], notes: "Regular shift" },
  { id: 2, user: "Sarah Smith", role: "Manager", started: "8:00 AM", duration: "5h 30m", breaks: [{ type: "Lunch", start: "1:00 PM", duration: "45m" }], notes: "Opening manager" },
  { id: 3, user: "Mike Johnson", role: "Kitchen", started: "10:00 AM", duration: "3h 30m", breaks: [], notes: "Prep work assigned" },
];

const stats = [
  { label: "Active Shifts", value: "8", icon: Users },
  { label: "Total Hours Today", value: "42h", icon: Clock },
  { label: "Scheduled", value: "12", icon: Calendar },
];

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className={i === 2 ? "col-span-2 md:col-span-1" : ""}>
          <CardContent className="p-3 sm:p-4 pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-12" />
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ShiftsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WorkstationShiftsPage() {
  const isLoading = useLoading(1000);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "edit" | "add">("view");

  const openViewSheet = (shift: Shift) => {
    setSelectedShift(shift);
    setSheetMode("view");
  };

  const openEditSheet = (shift: Shift) => {
    setSelectedShift(shift);
    setSheetMode("edit");
  };

  const openAddSheet = () => {
    setSelectedShift(null);
    setSheetMode("add");
    setIsAddSheetOpen(true);
  };

  const closeSheet = () => {
    setSelectedShift(null);
    setIsAddSheetOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Workstation Shifts</h1>
          <p className="text-sm text-muted-foreground">Manage active shifts and clock in/out</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={openAddSheet}>
          <Play className="mr-2 h-4 w-4" />
          Start Shift
        </Button>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : (
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
      )}

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-sm sm:text-base">Active Shifts</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {isLoading ? (
            <ShiftsSkeleton />
          ) : (
            <div className="space-y-3">
              {activeShifts.map((shift) => (
                <div 
                  key={shift.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 border rounded-lg transition-colors hover:bg-muted/50 cursor-pointer"
                  onClick={() => openViewSheet(shift)}
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{shift.user}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">{shift.role} • Started at {shift.started}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                    <Badge variant="outline" className="text-xs">{shift.duration}</Badge>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Square className="mr-1 sm:mr-2 h-3 w-3" />
                      <span className="hidden sm:inline">End Shift</span>
                      <span className="sm:hidden">End</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Sheet */}
      <Sheet open={!!selectedShift || isAddSheetOpen} onOpenChange={closeSheet}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle>
                {sheetMode === "add" ? "Start New Shift" : sheetMode === "edit" ? "Edit Shift" : "Shift Details"}
              </SheetTitle>
            </div>
            <SheetDescription>
              {sheetMode === "add" ? "Clock in a staff member" : `Active shift for ${selectedShift?.user}`}
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
                    <p className="text-sm font-medium">{selectedShift.user}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Role</Label>
                    <p className="text-sm font-medium">{selectedShift.role}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Start Time</Label>
                    <p className="text-sm font-medium">{selectedShift.started}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Duration</Label>
                    <p className="text-sm font-medium">{selectedShift.duration}</p>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <h4 className="font-medium text-sm">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <Coffee className="mr-2 h-4 w-4" />
                      Add Break
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Add Note
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="breaks" className="space-y-4 mt-4">
                {selectedShift.breaks && selectedShift.breaks.length > 0 ? (
                  <div className="space-y-3">
                    {selectedShift.breaks.map((brk, idx) => (
                      <div key={idx} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{brk.type}</p>
                            <p className="text-xs text-muted-foreground">Started at {brk.start}</p>
                          </div>
                          <Badge variant="outline">{brk.duration}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Coffee className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">No breaks taken yet</p>
                  </div>
                )}
                <Button variant="outline" className="w-full">
                  <Coffee className="mr-2 h-4 w-4" />
                  Start Break
                </Button>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4 mt-4">
                <div className="p-3 border rounded-lg">
                  <p className="text-sm">{selectedShift.notes || "No notes added"}</p>
                </div>
                <Textarea placeholder="Add a note..." className="min-h-[100px]" />
                <Button className="w-full">Save Note</Button>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4 mt-6">
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
              <div className="space-y-2">
                <Label>Role</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cashier">Cashier</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="server">Server</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea placeholder="Add shift notes..." />
              </div>
            </div>
          )}

          <SheetFooter className="mt-6 flex-col sm:flex-row gap-2">
            {sheetMode === "view" ? (
              <>
                <Button variant="outline" onClick={() => openEditSheet(selectedShift!)} className="w-full sm:w-auto">
                  Edit Shift
                </Button>
                <Button variant="destructive" className="w-full sm:w-auto">
                  <Square className="mr-2 h-4 w-4" />
                  End Shift
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={closeSheet} className="w-full sm:w-auto">Cancel</Button>
                <Button className="w-full sm:w-auto">
                  <Play className="mr-2 h-4 w-4" />
                  {sheetMode === "add" ? "Start Shift" : "Save Changes"}
                </Button>
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
