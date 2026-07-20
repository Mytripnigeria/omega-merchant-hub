import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import {
  Search,
  Plus,
  ClipboardList,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Loader2,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  useChecklists,
  useCreateChecklist,
  useUpdateChecklist,
  useDeleteChecklist,
  useToggleChecklistItem,
  useChecklistPerformances,
} from "@/hooks/api/use-modules";
import { useStaff, useRoles } from "@/hooks/api/use-hr";
import { useStore } from "@/contexts/StoreContext";
import type {
  Checklist,
  ChecklistAssignmentType,
  ChecklistFrequency,
  ChecklistItemInput,
  CreateChecklistRequest,
} from "@/types/operations";

const ASSIGNMENT_LABEL: Record<ChecklistAssignmentType, string> = {
  all_staff: "All Staff",
  role: "Role",
  staff: "Staff",
};

const FREQUENCY_LABEL: Record<ChecklistFrequency, string> = {
  one_off: "One-off",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

interface ChecklistFormState {
  name: string;
  description: string;
  assignmentType: ChecklistAssignmentType;
  assignedToId: string;
  frequency: ChecklistFrequency;
  dueDate: string;
  dueTime: string;
  items: ChecklistItemInput[];
}

const blankForm = (): ChecklistFormState => ({
  name: "",
  description: "",
  assignmentType: "all_staff",
  assignedToId: "",
  frequency: "daily",
  dueDate: "",
  dueTime: "",
  items: [{ title: "", order: 1 }],
});

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className={i === 2 ? "col-span-2 md:col-span-1" : ""}>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-10" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </CardContent>
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
            <div className="flex items-start justify-between mb-3 gap-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function statusBadge(status: Checklist["status"]) {
  if (status === "completed")
    return (
      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
        Completed
      </Badge>
    );
  if (status === "in_progress")
    return (
      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
        In Progress
      </Badge>
    );
  return <Badge variant="secondary">Pending</Badge>;
}

export default function ChecklistsPage() {
  const { currentStore } = useStore();
  const storeId = currentStore?.id;

  const [search, setSearch] = useState("");
  const { data: checklistsData, isLoading } = useChecklists(
    storeId ? { storeId } : undefined,
  );
  const checklists: Checklist[] = checklistsData?.data ?? [];
  const { data: rolesData } = useRoles();
  const roles =
    (rolesData?.data ?? []) as Array<{ id: string; name: string }>;
  // Backend caps page size at 200; requesting more fails validation.
  const { data: staffData } = useStaff(
    storeId ? { storeId, limit: 200 } : undefined,
  );
  const staff = (staffData?.data ?? []) as Array<{
    id: string;
    firstName: string;
    lastName: string;
  }>;

  const createMutation = useCreateChecklist();
  const updateMutation = useUpdateChecklist();
  const deleteMutation = useDeleteChecklist();
  const toggleMutation = useToggleChecklistItem();

  const [sheetMode, setSheetMode] = useState<"view" | "edit" | "create" | null>(
    null,
  );
  const [selected, setSelected] = useState<Checklist | null>(null);
  const [form, setForm] = useState<ChecklistFormState>(blankForm());

  const filtered = useMemo(
    () =>
      checklists.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [checklists, search],
  );

  const stats = [
    {
      label: "Active Checklists",
      value: checklists.filter((c) => c.status !== "completed").length,
      icon: ClipboardList,
    },
    {
      label: "Completed",
      value: checklists.filter((c) => c.status === "completed").length,
      icon: CheckCircle,
    },
    {
      label: "Pending",
      value: checklists.filter((c) => c.status === "pending").length,
      icon: Clock,
    },
  ];

  const openCreate = () => {
    setSelected(null);
    setForm(blankForm());
    setSheetMode("create");
  };

  const openView = (c: Checklist) => {
    setSelected(c);
    setSheetMode("view");
  };

  const openEdit = (c: Checklist) => {
    setSelected(c);
    setSheetMode("edit");
  };

  useEffect(() => {
    if (selected && sheetMode === "edit") {
      setForm({
        name: selected.name,
        description: selected.description ?? "",
        assignmentType: selected.assignmentType,
        assignedToId: selected.assignedToId ?? "",
        frequency: selected.frequency,
        dueDate: selected.dueDate ?? "",
        dueTime: selected.dueTime ?? "",
        items: selected.items.map((i) => ({
          id: i.id,
          title: i.title,
          description: i.description,
          isCompleted: i.isCompleted,
          order: i.order,
        })),
      });
    }
  }, [selected, sheetMode]);

  const closeSheet = () => {
    setSheetMode(null);
    setSelected(null);
  };

  const handleToggle = (checklistId: string, itemId: string, next: boolean) => {
    toggleMutation.mutate(
      { id: checklistId, itemId, isCompleted: next },
      {
        onError: (e: Error) => toast.error(e.message ?? "Toggle failed"),
        onSuccess: (updated) => {
          // Keep the open view in sync with the saved server state.
          if (selected && selected.id === checklistId) setSelected(updated);
        },
      },
    );
  };

  const handleSave = async () => {
    if (!storeId) {
      toast.error("Select a store first");
      return;
    }
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const items = form.items
      .filter((i) => i.title.trim())
      .map((i, idx) => ({ ...i, title: i.title.trim(), order: idx + 1 }));
    if (items.length === 0) {
      toast.error("Add at least one checklist item");
      return;
    }
    if (form.assignmentType !== "all_staff" && !form.assignedToId) {
      toast.error(
        `Pick a ${form.assignmentType === "role" ? "role" : "staff member"}`,
      );
      return;
    }
    if (form.frequency === "one_off" && !form.dueDate) {
      toast.error("One-off checklists need a due date");
      return;
    }

    const payload: CreateChecklistRequest = {
      storeId,
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      assignmentType: form.assignmentType,
      assignedToId:
        form.assignmentType === "all_staff" ? undefined : form.assignedToId,
      frequency: form.frequency,
      dueDate: form.dueDate || undefined,
      dueTime: form.dueTime || undefined,
      items,
    };

    try {
      if (sheetMode === "edit" && selected) {
        await updateMutation.mutateAsync({ id: selected.id, data: payload });
        toast.success("Checklist updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Checklist created");
      }
      closeSheet();
    } catch (err) {
      toast.error((err as Error).message ?? "Save failed");
    }
  };

  const handleDelete = (c: Checklist) => {
    deleteMutation.mutate(c.id, {
      onSuccess: () => {
        toast.success("Checklist deleted");
        if (selected?.id === c.id) closeSheet();
      },
      onError: (e: Error) => toast.error(e.message ?? "Delete failed"),
    });
  };

  const assignmentLabel = (c: Checklist) =>
    c.assignedToName ?? ASSIGNMENT_LABEL[c.assignmentType];

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Checklists
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage operational checklists for staff, roles, or everyone
          </p>
        </div>
        <Button
          size="sm"
          className="w-full sm:w-auto"
          onClick={openCreate}
          disabled={!storeId}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Checklist
        </Button>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {stats.map((stat, i) => (
            <Card
              key={stat.label}
              className={`border-border/50 ${i === 2 ? "col-span-2 md:col-span-1" : ""}`}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-xl sm:text-2xl font-semibold">
                      {stat.value}
                    </p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search checklists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <ChecklistsSkeleton />
      ) : filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center text-sm text-muted-foreground">
            No checklists yet. Click "Create Checklist" to add the first one.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((c) => {
            const completed = c.items.filter((i) => i.isCompleted).length;
            const progress = c.items.length
              ? (completed / c.items.length) * 100
              : 0;
            return (
              <Card key={c.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3 gap-3">
                    <div
                      className="min-w-0 flex-1 cursor-pointer"
                      onClick={() => openView(c)}
                    >
                      <h3 className="font-medium text-sm truncate">{c.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {assignmentLabel(c)} · {FREQUENCY_LABEL[c.frequency]}
                        {c.dueTime ? ` · ${c.dueTime}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {statusBadge(c.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openView(c)}>
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(c)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(c)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {completed}/{c.items.length} items
                      </span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Sheet
        open={sheetMode !== null}
        onOpenChange={(open) => {
          if (!open) closeSheet();
        }}
      >
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {sheetMode === "view" && selected ? (
            <>
              <SheetHeader>
                <div className="flex items-center justify-between gap-2">
                  <SheetTitle>{selected.name}</SheetTitle>
                  {statusBadge(selected.status)}
                </div>
                <SheetDescription>
                  {assignmentLabel(selected)} · {FREQUENCY_LABEL[selected.frequency]}
                  {selected.dueDate ? ` · ${selected.dueDate}` : ""}
                  {selected.dueTime ? ` · ${selected.dueTime}` : ""}
                </SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-4">
                {selected.description && (
                  <p className="text-sm text-muted-foreground">
                    {selected.description}
                  </p>
                )}

                {/* Aggregate progress card + tabs, mirroring the KPI targets
                    view sheet the client referenced. */}
                {(() => {
                  const completedCount = selected.items.filter(
                    (it) => it.isCompleted,
                  ).length;
                  const totalCount = selected.items.length;
                  const progress = totalCount
                    ? Math.round((completedCount / totalCount) * 100)
                    : 0;
                  return (
                    <Card>
                      <CardContent className="p-4 space-y-2">
                        <p className="text-xs text-muted-foreground">
                          Aggregate progress
                        </p>
                        <p className="text-3xl font-semibold">
                          {completedCount}{" "}
                          <span className="text-base font-normal text-muted-foreground">
                            / {totalCount} items
                          </span>
                        </p>
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {progress}% complete
                        </p>
                      </CardContent>
                    </Card>
                  );
                })()}

                <Tabs defaultValue="performances" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="performances">Performances</TabsTrigger>
                    <TabsTrigger value="items">Items</TabsTrigger>
                  </TabsList>

                  <TabsContent value="performances" className="space-y-3 mt-4">
                    <p className="text-xs text-muted-foreground">
                      How each assigned staff member fills out this checklist.
                    </p>
                    <ChecklistPerformanceList checklistId={selected.id} />
                  </TabsContent>

                  <TabsContent value="items" className="mt-4">
                    <div className="space-y-2">
                      {selected.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between border rounded-lg p-3"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Checkbox
                              checked={item.isCompleted}
                              onCheckedChange={(v) =>
                                handleToggle(selected.id, item.id, !!v)
                              }
                            />
                            <span
                              className={`text-sm truncate ${item.isCompleted ? "line-through text-muted-foreground" : ""}`}
                            >
                              {item.title}
                            </span>
                          </div>
                          {item.isCompleted && item.completedByName && (
                            <span className="text-xs text-muted-foreground shrink-0">
                              {item.completedByName}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <SheetFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => openEdit(selected)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto"
                  onClick={() => handleDelete(selected)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Delete
                </Button>
              </SheetFooter>
            </>
          ) : (
            <>
              <SheetHeader>
                <SheetTitle>
                  {sheetMode === "edit" ? "Edit Checklist" : "Create Checklist"}
                </SheetTitle>
                <SheetDescription>
                  {sheetMode === "edit"
                    ? "Update checklist details"
                    : "Define a new checklist to assign to staff"}
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-6">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    placeholder="e.g., Opening Checklist"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Textarea
                    placeholder="What's this checklist for?"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Assign to</Label>
                    <Select
                      value={form.assignmentType}
                      onValueChange={(v) =>
                        setForm({
                          ...form,
                          assignmentType: v as ChecklistAssignmentType,
                          assignedToId: "",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_staff">All Staff</SelectItem>
                        <SelectItem value="role">Role</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select
                      value={form.frequency}
                      onValueChange={(v) =>
                        setForm({ ...form, frequency: v as ChecklistFrequency })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one_off">One-off</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {form.assignmentType === "role" && (
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select
                      value={form.assignedToId}
                      onValueChange={(v) =>
                        setForm({ ...form, assignedToId: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pick a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {form.assignmentType === "staff" && (
                  <div className="space-y-2">
                    <Label>Staff member</Label>
                    <Select
                      value={form.assignedToId}
                      onValueChange={(v) =>
                        setForm({ ...form, assignedToId: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pick a staff member" />
                      </SelectTrigger>
                      <SelectContent>
                        {staff.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.firstName} {s.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>
                      Due date
                      {form.frequency === "one_off" && (
                        <span className="text-destructive"> *</span>
                      )}
                    </Label>
                    <Input
                      type="date"
                      value={form.dueDate}
                      onChange={(e) =>
                        setForm({ ...form, dueDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Due time</Label>
                    <Input
                      type="time"
                      value={form.dueTime}
                      onChange={(e) =>
                        setForm({ ...form, dueTime: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Items</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setForm({
                          ...form,
                          items: [
                            ...form.items,
                            { title: "", order: form.items.length + 1 },
                          ],
                        })
                      }
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add item
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {form.items.map((item, idx) => (
                      <div
                        key={item.id ?? `new-${idx}`}
                        className="flex items-center gap-2"
                      >
                        <Input
                          placeholder={`Item ${idx + 1}`}
                          value={item.title}
                          onChange={(e) => {
                            const next = [...form.items];
                            next[idx] = { ...next[idx], title: e.target.value };
                            setForm({ ...form, items: next });
                          }}
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            setForm({
                              ...form,
                              items: form.items.filter((_, i) => i !== idx),
                            })
                          }
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <SheetFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={closeSheet}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  className="w-full sm:w-auto"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {sheetMode === "edit" ? "Save changes" : "Create checklist"}
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ChecklistPerformanceList({ checklistId }: { checklistId: string }) {
  const { data: performances, isLoading } =
    useChecklistPerformances(checklistId);
  const rows = performances ?? [];

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No assigned staff yet. Assign this checklist to staff or a role.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {rows
        .slice()
        .sort((a, b) => b.progress - a.progress)
        .map((row) => (
          <div key={row.staffId} className="border rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback>
                    {row.staffName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {row.staffName}
                  </p>
                  {row.roleName && (
                    <p className="text-xs text-muted-foreground truncate">
                      {row.roleName}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold">
                  {row.completed}
                  <span className="text-xs font-normal text-muted-foreground">
                    {" "}
                    / {row.total}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">completed</p>
              </div>
            </div>
            <Progress value={Math.min(row.progress, 100)} className="h-1.5" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{row.progress}% complete</span>
              {row.lastCompletedAt && (
                <span>
                  {formatDistanceToNow(new Date(row.lastCompletedAt), {
                    addSuffix: true,
                  })}
                </span>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
