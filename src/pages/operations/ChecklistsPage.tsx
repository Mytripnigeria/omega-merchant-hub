import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, ClipboardList, CheckCircle, Clock, MoreHorizontal, ChevronDown, ChevronUp, User, Calendar, FileText } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ChecklistItem {
  id: number;
  text: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
}

interface Checklist {
  id: number;
  name: string;
  items: ChecklistItem[];
  assignee: string;
  dueTime: string;
  status: "in-progress" | "completed" | "pending";
  createdAt: string;
  description?: string;
}

const checklistsData: Checklist[] = [
  { id: 1, name: "Opening Checklist", items: [{ id: 1, text: "Turn on all kitchen equipment", completed: true, completedBy: "John", completedAt: "6:05 AM" }, { id: 2, text: "Check refrigerator temperatures", completed: true }, { id: 3, text: "Prep vegetables", completed: true }, { id: 4, text: "Set up POS system", completed: true }, { id: 5, text: "Check inventory levels", completed: true }, { id: 6, text: "Clean dining area", completed: true }, { id: 7, text: "Set up tables", completed: true }, { id: 8, text: "Review reservations", completed: true }, { id: 9, text: "Brief staff on specials", completed: false }, { id: 10, text: "Check bathroom supplies", completed: false }, { id: 11, text: "Turn on music", completed: false }, { id: 12, text: "Unlock front door", completed: false }], assignee: "Morning Shift", dueTime: "6:00 AM", status: "in-progress", createdAt: "2026-01-01", description: "Daily opening tasks for morning shift" },
  { id: 2, name: "Closing Checklist", items: [{ id: 1, text: "Clean all cooking stations", completed: true }, { id: 2, text: "Store all perishables properly", completed: true }, { id: 3, text: "Turn off equipment", completed: true }, { id: 4, text: "Lock all doors", completed: true }, { id: 5, text: "Set alarm system", completed: true }], assignee: "Evening Shift", dueTime: "10:00 PM", status: "completed", createdAt: "2026-01-01" },
  { id: 3, name: "Food Safety Check", items: [{ id: 1, text: "Check fridge temperatures", completed: true }, { id: 2, text: "Check freezer temperatures", completed: true }, { id: 3, text: "Inspect raw ingredients", completed: true }, { id: 4, text: "Check expiry dates", completed: true }, { id: 5, text: "Sanitize prep surfaces", completed: true }, { id: 6, text: "Check handwashing stations", completed: false }, { id: 7, text: "Inspect storage areas", completed: false }, { id: 8, text: "Review HACCP logs", completed: false }, { id: 9, text: "Check pest control", completed: false }, { id: 10, text: "Document all findings", completed: false }], assignee: "Kitchen Staff", dueTime: "12:00 PM", status: "in-progress", createdAt: "2026-01-10", description: "Mandatory food safety compliance check" },
  { id: 4, name: "Equipment Inspection", items: [{ id: 1, text: "Inspect ovens", completed: false }, { id: 2, text: "Check fryers", completed: false }, { id: 3, text: "Test grills", completed: false }, { id: 4, text: "Inspect dishwasher", completed: false }, { id: 5, text: "Check refrigeration units", completed: false }, { id: 6, text: "Test fire suppression system", completed: false }, { id: 7, text: "Inspect ventilation", completed: false }, { id: 8, text: "Document any issues", completed: false }], assignee: "Maintenance", dueTime: "2:00 PM", status: "pending", createdAt: "2026-01-05" },
];

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className={i === 2 ? "col-span-2 md:col-span-1" : ""}>
          <CardContent className="p-3 sm:p-4"><div className="flex items-center justify-between"><div className="space-y-2"><Skeleton className="h-3 w-24" /><Skeleton className="h-7 w-10" /></div><Skeleton className="h-8 w-8 rounded-full" /></div></CardContent>
        </Card>
      ))}
    </div>
  );
}

function ChecklistsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3 gap-3"><div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-48" /></div><Skeleton className="h-5 w-20 rounded-full" /></div>
            <div className="space-y-2"><div className="flex items-center justify-between"><Skeleton className="h-3 w-16" /><Skeleton className="h-3 w-20" /></div><Skeleton className="h-1.5 w-full rounded-full" /></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ChecklistsPage() {
  const [search, setSearch] = useState("");
  const [checklists, setChecklists] = useState(checklistsData);
  const [expandedChecklist, setExpandedChecklist] = useState<number | null>(null);
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "edit" | "add">("view");
  const isLoading = useLoading(1000);

  const stats = [
    { label: "Active Checklists", value: checklists.filter(c => c.status !== "completed").length.toString(), icon: ClipboardList },
    { label: "Completed Today", value: checklists.filter(c => c.status === "completed").length.toString(), icon: CheckCircle },
    { label: "Pending", value: checklists.filter(c => c.status === "pending").length.toString(), icon: Clock },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Completed</Badge>;
      case "in-progress": return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">In Progress</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const filteredChecklists = checklists.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const toggleChecklistItem = (checklistId: number, itemId: number) => {
    setChecklists(prev => prev.map(checklist => {
      if (checklist.id === checklistId) {
        const updatedItems = checklist.items.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item);
        const completedCount = updatedItems.filter(i => i.completed).length;
        const newStatus = completedCount === updatedItems.length ? "completed" : completedCount > 0 ? "in-progress" : "pending";
        return { ...checklist, items: updatedItems, status: newStatus as Checklist["status"] };
      }
      return checklist;
    }));
  };

  const openViewSheet = (checklist: Checklist) => { setSelectedChecklist(checklist); setSheetMode("view"); };
  const openEditSheet = (checklist: Checklist) => { setSelectedChecklist(checklist); setSheetMode("edit"); };
  const openAddSheet = () => { setSelectedChecklist(null); setSheetMode("add"); setIsAddSheetOpen(true); };
  const closeSheet = () => { setSelectedChecklist(null); setIsAddSheetOpen(false); };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Checklists</h1><p className="text-sm text-muted-foreground">Manage daily operational checklists</p></div>
        <Button size="sm" className="w-full sm:w-auto" onClick={openAddSheet}><Plus className="h-4 w-4 mr-2" />Create Checklist</Button>
      </div>

      {isLoading ? <StatsSkeleton /> : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={stat.label} className={`border-border/50 ${index === 2 ? "col-span-2 md:col-span-1" : ""}`}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p><p className="text-xl sm:text-2xl font-semibold">{stat.value}</p></div>
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0"><stat.icon className="h-4 w-4 text-muted-foreground" /></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search checklists..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {isLoading ? <ChecklistsSkeleton /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredChecklists.map((checklist) => {
            const completedCount = checklist.items.filter(i => i.completed).length;
            const progress = (completedCount / checklist.items.length) * 100;
            const isExpanded = expandedChecklist === checklist.id;
            
            return (
              <Card key={checklist.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3 gap-3">
                    <div className="min-w-0 flex-1 cursor-pointer" onClick={() => openViewSheet(checklist)}>
                      <div className="flex items-center gap-2"><h3 className="font-medium text-sm truncate">{checklist.name}</h3></div>
                      <p className="text-xs text-muted-foreground mt-0.5">Assigned to: {checklist.assignee} • Due: {checklist.dueTime}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {getStatusBadge(checklist.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openViewSheet(checklist)}>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditSheet(checklist)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Progress</span><span className="font-medium">{completedCount}/{checklist.items.length} items</span></div>
                    <Progress value={progress} className="h-1.5" />
                  </div>

                  <Button variant="ghost" size="sm" className="w-full mt-3 h-8" onClick={() => setExpandedChecklist(isExpanded ? null : checklist.id)}>
                    {isExpanded ? <><ChevronUp className="h-4 w-4 mr-1" />Hide Items</> : <><ChevronDown className="h-4 w-4 mr-1" />View Items</>}
                  </Button>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t space-y-2 max-h-48 overflow-y-auto">
                      {checklist.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer" onClick={() => toggleChecklistItem(checklist.id, item.id)}>
                          <Checkbox checked={item.completed} />
                          <span className={`text-sm ${item.completed ? "line-through text-muted-foreground" : ""}`}>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Sheet open={!!selectedChecklist || isAddSheetOpen} onOpenChange={closeSheet}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle>{sheetMode === "add" ? "Create Checklist" : sheetMode === "edit" ? "Edit Checklist" : selectedChecklist?.name}</SheetTitle>
              {selectedChecklist && sheetMode === "view" && getStatusBadge(selectedChecklist.status)}
            </div>
            <SheetDescription>{sheetMode === "add" ? "Add a new operational checklist" : selectedChecklist ? `Assigned to ${selectedChecklist.assignee}` : ""}</SheetDescription>
          </SheetHeader>

          {sheetMode === "view" && selectedChecklist ? (
            <Tabs defaultValue="items" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="space-y-4 mt-4">
                <div className="space-y-2">
                  {selectedChecklist.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Checkbox checked={item.completed} onCheckedChange={() => toggleChecklistItem(selectedChecklist.id, item.id)} />
                        <span className={`text-sm ${item.completed ? "line-through text-muted-foreground" : ""}`}>{item.text}</span>
                      </div>
                      {item.completedBy && <span className="text-xs text-muted-foreground">{item.completedBy}</span>}
                    </div>
                  ))}
                </div>
                <Progress value={(selectedChecklist.items.filter(i => i.completed).length / selectedChecklist.items.length) * 100} className="h-2" />
              </TabsContent>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Assignee</Label><p className="text-sm font-medium">{selectedChecklist.assignee}</p></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Due Time</Label><p className="text-sm font-medium">{selectedChecklist.dueTime}</p></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Created</Label><p className="text-sm font-medium">{selectedChecklist.createdAt}</p></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Items</Label><p className="text-sm font-medium">{selectedChecklist.items.length}</p></div>
                </div>
                {selectedChecklist.description && (
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground mb-1">Description</p><p className="text-sm">{selectedChecklist.description}</p></div>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4 mt-4">
                <div className="space-y-3">
                  {selectedChecklist.items.filter(i => i.completed && i.completedAt).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3"><CheckCircle className="h-4 w-4 text-green-600" /><span className="text-sm">{item.text}</span></div>
                      <div className="text-right"><p className="text-xs font-medium">{item.completedBy}</p><p className="text-xs text-muted-foreground">{item.completedAt}</p></div>
                    </div>
                  ))}
                  {selectedChecklist.items.filter(i => i.completed && i.completedAt).length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center"><FileText className="h-10 w-10 text-muted-foreground mb-3" /><p className="text-sm text-muted-foreground">No completion history</p></div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4 mt-6">
              <div className="space-y-2"><Label>Checklist Name</Label><Input placeholder="e.g., Morning Opening Checklist" defaultValue={selectedChecklist?.name} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Assign To</Label><Select defaultValue={selectedChecklist?.assignee}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Morning Shift">Morning Shift</SelectItem><SelectItem value="Evening Shift">Evening Shift</SelectItem><SelectItem value="Kitchen Staff">Kitchen Staff</SelectItem><SelectItem value="Maintenance">Maintenance</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Due Time</Label><Input type="time" defaultValue={selectedChecklist?.dueTime?.replace(" AM", "").replace(" PM", "")} /></div>
              </div>
              <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Describe the checklist purpose..." defaultValue={selectedChecklist?.description} /></div>
              <div className="space-y-2"><Label>Items (one per line)</Label><Textarea placeholder="Turn on equipment&#10;Check temperatures&#10;..." rows={6} /></div>
            </div>
          )}

          <SheetFooter className="mt-6 flex-col sm:flex-row gap-2">
            {sheetMode === "view" ? (
              <><Button variant="outline" onClick={() => openEditSheet(selectedChecklist!)} className="w-full sm:w-auto">Edit Checklist</Button><Button className="w-full sm:w-auto">Mark All Complete</Button></>
            ) : (
              <><Button variant="outline" onClick={closeSheet} className="w-full sm:w-auto">Cancel</Button><Button className="w-full sm:w-auto">{sheetMode === "add" ? "Create Checklist" : "Save Changes"}</Button></>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
