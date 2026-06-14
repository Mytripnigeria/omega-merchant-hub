import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Users,
  DollarSign,
  Clock,
  Star,
  Plus,
  Loader2,
  MoreHorizontal,
  Trash2,
  Sparkles,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  useKPITargets,
  useCreateKPITarget,
  useUpdateKPITarget,
  useDeleteKPITarget,
  useKpiPerformances,
  useRecordKpiPerformance,
} from "@/hooks/api/use-modules";
import { useStaff, useRoles } from "@/hooks/api/use-hr";
import { useStore } from "@/contexts/StoreContext";
import type {
  KPITarget,
  KpiAssignmentType,
  KpiCategory,
  KpiPeriod,
  KpiStatus,
  CreateKPITargetRequest,
} from "@/types/operations";

const CATEGORY_LABEL: Record<KpiCategory, string> = {
  sales: "Sales",
  orders: "Orders",
  customers: "Customers",
  efficiency: "Efficiency",
  waste: "Waste",
  labor: "Labor",
  custom: "Custom",
};

const PERIOD_LABEL: Record<KpiPeriod, string> = {
  one_off: "One-off",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

const ASSIGNMENT_LABEL: Record<KpiAssignmentType, string> = {
  all_staff: "All Staff",
  role: "Role",
  staff: "Staff",
};

function categoryIcon(category: KpiCategory) {
  switch (category) {
    case "sales":
      return DollarSign;
    case "orders":
      return BarChart3;
    case "customers":
      return Users;
    case "efficiency":
      return TrendingUp;
    case "waste":
      return Clock;
    case "labor":
      return Star;
    default:
      return Target;
  }
}

function statusBadge(status: KpiStatus) {
  switch (status) {
    case "exceeded":
    case "achieved":
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          {status === "exceeded" ? "Exceeded" : "Achieved"}
        </Badge>
      );
    case "on_track":
      return (
        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          On Track
        </Badge>
      );
    case "at_risk":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
          At Risk
        </Badge>
      );
    case "behind":
      return (
        <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          Behind
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

interface FormState {
  name: string;
  description: string;
  category: KpiCategory;
  assignmentType: KpiAssignmentType;
  assignedToId: string;
  period: KpiPeriod;
  targetValue: string;
  unit: string;
  periodStart: string;
  periodEnd: string;
}

const blankForm = (): FormState => ({
  name: "",
  description: "",
  category: "sales",
  assignmentType: "all_staff",
  assignedToId: "",
  period: "monthly",
  targetValue: "",
  unit: "₦",
  periodStart: "",
  periodEnd: "",
});

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-3 sm:p-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-7 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function KpiPage() {
  const { currentStore } = useStore();
  const storeId = currentStore?.id;

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | KpiCategory>(
    "all",
  );

  const filters = useMemo(
    () => ({
      ...(storeId ? { storeId } : {}),
      ...(categoryFilter !== "all" ? { category: categoryFilter } : {}),
    }),
    [storeId, categoryFilter],
  );
  const { data: targetsData, isLoading } = useKPITargets(filters);
  const targets: KPITarget[] = targetsData?.data ?? [];

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

  const createMutation = useCreateKPITarget();
  const updateMutation = useUpdateKPITarget();
  const deleteMutation = useDeleteKPITarget();

  const [sheetMode, setSheetMode] = useState<"view" | "edit" | "create" | null>(
    null,
  );
  const [selected, setSelected] = useState<KPITarget | null>(null);
  const [form, setForm] = useState<FormState>(blankForm());

  const filtered = useMemo(
    () =>
      targets.filter((t) =>
        t.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [targets, search],
  );

  const openCreate = () => {
    setSelected(null);
    setForm(blankForm());
    setSheetMode("create");
  };
  const openView = (t: KPITarget) => {
    setSelected(t);
    setSheetMode("view");
  };
  const openEdit = (t: KPITarget) => {
    setSelected(t);
    setSheetMode("edit");
  };
  const closeSheet = () => {
    setSheetMode(null);
    setSelected(null);
  };

  useEffect(() => {
    if (selected && sheetMode === "edit") {
      setForm({
        name: selected.name,
        description: selected.description ?? "",
        category: selected.category,
        assignmentType: selected.assignmentType,
        assignedToId: selected.assignedToId ?? "",
        period: selected.period,
        targetValue: String(selected.targetValue),
        unit: selected.unit ?? "",
        periodStart: selected.periodStart ?? "",
        periodEnd: selected.periodEnd ?? "",
      });
    }
  }, [selected, sheetMode]);

  const handleSave = async () => {
    if (!storeId) {
      toast.error("Select a store first");
      return;
    }
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    const targetValue = Number(form.targetValue);
    if (!targetValue || targetValue <= 0) {
      toast.error("Target value must be a positive number");
      return;
    }
    if (form.assignmentType !== "all_staff" && !form.assignedToId) {
      toast.error(
        `Pick a ${form.assignmentType === "role" ? "role" : "staff member"}`,
      );
      return;
    }
    if (form.period === "one_off" && (!form.periodStart || !form.periodEnd)) {
      toast.error("One-off KPIs need a start and end date");
      return;
    }

    const payload: CreateKPITargetRequest = {
      storeId,
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      category: form.category,
      assignmentType: form.assignmentType,
      assignedToId:
        form.assignmentType === "all_staff" ? undefined : form.assignedToId,
      period: form.period,
      targetValue,
      unit: form.unit || undefined,
      periodStart: form.periodStart || undefined,
      periodEnd: form.periodEnd || undefined,
    };

    try {
      if (sheetMode === "edit" && selected) {
        await updateMutation.mutateAsync({ id: selected.id, data: payload });
        toast.success("KPI updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("KPI created");
      }
      closeSheet();
    } catch (err) {
      toast.error((err as Error).message ?? "Save failed");
    }
  };

  const handleDelete = (t: KPITarget) => {
    deleteMutation.mutate(t.id, {
      onSuccess: () => {
        toast.success("KPI deleted");
        if (selected?.id === t.id) closeSheet();
      },
      onError: (e: Error) => toast.error(e.message ?? "Delete failed"),
    });
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const stats = [
    { label: "Total KPIs", value: targets.length, icon: Target },
    {
      label: "Achieved / Exceeded",
      value: targets.filter(
        (t) => t.status === "achieved" || t.status === "exceeded",
      ).length,
      icon: Sparkles,
    },
    {
      label: "On Track",
      value: targets.filter((t) => t.status === "on_track").length,
      icon: TrendingUp,
    },
    {
      label: "At Risk / Behind",
      value: targets.filter(
        (t) => t.status === "at_risk" || t.status === "behind",
      ).length,
      icon: TrendingDown,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            KPI Targets
          </h1>
          <p className="text-sm text-muted-foreground">
            Set performance targets and track progress per individual
          </p>
        </div>
        <Button
          size="sm"
          className="w-full sm:w-auto"
          onClick={openCreate}
          disabled={!storeId}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create KPI
        </Button>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {s.label}
                    </p>
                    <p className="text-xl sm:text-2xl font-semibold">{s.value}</p>
                  </div>
                  <s.icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Input
          placeholder="Search KPIs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select
          value={categoryFilter}
          onValueChange={(v) => setCategoryFilter(v as "all" | KpiCategory)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-1.5 w-full rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center text-sm text-muted-foreground">
            No KPI targets yet. Click "Create KPI" to add the first one.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => {
            const Icon = categoryIcon(t.category);
            return (
              <Card
                key={t.id}
                className="cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => openView(t)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <h3 className="font-medium text-sm truncate">
                          {t.name}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {ASSIGNMENT_LABEL[t.assignmentType]}
                        {t.assignedToName ? ` · ${t.assignedToName}` : ""} ·{" "}
                        {PERIOD_LABEL[t.period]}
                      </p>
                    </div>
                    <div
                      className="flex items-center gap-1 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {statusBadge(t.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openView(t)}>
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(t)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(t)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-semibold">
                      {t.unit}
                      {Number(t.currentValue).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      / {t.unit}
                      {Number(t.targetValue).toLocaleString()}
                    </p>
                  </div>
                  <Progress value={Math.min(t.progress, 100)} className="h-1.5" />
                  <p className="text-xs text-muted-foreground">
                    {t.progress}% of target
                  </p>
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
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {sheetMode === "view" && selected ? (
            <KpiViewSheet
              kpi={selected}
              onEdit={() => openEdit(selected)}
              onDelete={() => handleDelete(selected)}
              deleting={deleteMutation.isPending}
            />
          ) : (
            <>
              <SheetHeader>
                <SheetTitle>
                  {sheetMode === "edit" ? "Edit KPI" : "Create KPI"}
                </SheetTitle>
                <SheetDescription>
                  {sheetMode === "edit"
                    ? "Update target details"
                    : "Define a new KPI target to track"}
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-6">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    placeholder="e.g., Monthly Revenue"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Textarea
                    placeholder="What does this KPI measure?"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={form.category}
                      onValueChange={(v) =>
                        setForm({ ...form, category: v as KpiCategory })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
                          <SelectItem key={k} value={k}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tracking period</Label>
                    <Select
                      value={form.period}
                      onValueChange={(v) =>
                        setForm({ ...form, period: v as KpiPeriod })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PERIOD_LABEL).map(([k, v]) => (
                          <SelectItem key={k} value={k}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Assign to</Label>
                    <Select
                      value={form.assignmentType}
                      onValueChange={(v) =>
                        setForm({
                          ...form,
                          assignmentType: v as KpiAssignmentType,
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
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Target value</Label>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="e.g., 100000"
                      value={form.targetValue}
                      onChange={(e) =>
                        setForm({ ...form, targetValue: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Input
                      placeholder="₦, %, orders, etc."
                      value={form.unit}
                      onChange={(e) =>
                        setForm({ ...form, unit: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>
                      Period start
                      {form.period === "one_off" && (
                        <span className="text-destructive"> *</span>
                      )}
                    </Label>
                    <Input
                      type="date"
                      value={form.periodStart}
                      onChange={(e) =>
                        setForm({ ...form, periodStart: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Period end
                      {form.period === "one_off" && (
                        <span className="text-destructive"> *</span>
                      )}
                    </Label>
                    <Input
                      type="date"
                      value={form.periodEnd}
                      onChange={(e) =>
                        setForm({ ...form, periodEnd: e.target.value })
                      }
                    />
                  </div>
                </div>
                {(form.category === "sales" || form.category === "orders") && (
                  <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
                    Progress for Sales / Orders categories is auto-computed from
                    completed orders, attributed to each order's staff member.
                  </p>
                )}
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
                  {sheetMode === "edit" ? "Save changes" : "Create KPI"}
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function KpiViewSheet({
  kpi,
  onEdit,
  onDelete,
  deleting,
}: {
  kpi: KPITarget;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  const { data: performances, isLoading: perfLoading } = useKpiPerformances(
    kpi.id,
  );
  const recordMutation = useRecordKpiPerformance();
  const rows = performances ?? [];
  const Icon = categoryIcon(kpi.category);

  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const handleSavePerformance = async (staffId: string) => {
    const value = Number(editValue);
    if (!Number.isFinite(value) || value < 0) {
      toast.error("Enter a non-negative number");
      return;
    }
    try {
      await recordMutation.mutateAsync({
        id: kpi.id,
        data: { staffId, value },
      });
      toast.success("Performance updated");
      setEditingStaffId(null);
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to save");
    }
  };

  return (
    <>
      <SheetHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <SheetTitle>{kpi.name}</SheetTitle>
          </div>
          {statusBadge(kpi.status)}
        </div>
        <SheetDescription>
          {CATEGORY_LABEL[kpi.category]} · {PERIOD_LABEL[kpi.period]} ·{" "}
          {ASSIGNMENT_LABEL[kpi.assignmentType]}
          {kpi.assignedToName ? ` (${kpi.assignedToName})` : ""}
        </SheetDescription>
      </SheetHeader>
      <div className="py-6 space-y-4">
        <Card>
          <CardContent className="p-4 space-y-2">
            <p className="text-xs text-muted-foreground">Aggregate progress</p>
            <p className="text-3xl font-semibold">
              {kpi.unit}
              {Number(kpi.currentValue).toLocaleString()}{" "}
              <span className="text-base font-normal text-muted-foreground">
                / {kpi.unit}
                {Number(kpi.targetValue).toLocaleString()}
              </span>
            </p>
            <Progress value={Math.min(kpi.progress, 100)} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {kpi.progress}% of target
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="performances" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performances">Performances</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="performances" className="space-y-3 mt-4">
            {perfLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : rows.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No contributors yet. Assign staff or add manual progress entries.
              </p>
            ) : (
              rows
                .slice()
                .sort((a, b) => b.value - a.value)
                .map((row) => {
                  const isEditing = editingStaffId === row.staffId;
                  return (
                    <div
                      key={row.staffId}
                      className="border rounded-lg p-3 space-y-2"
                    >
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
                            {kpi.unit}
                            {Number(row.value).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            / {kpi.unit}
                            {Number(row.share).toLocaleString()} share
                          </p>
                        </div>
                      </div>
                      <Progress
                        value={Math.min(row.progress, 100)}
                        className="h-1.5"
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{row.progress}% of share</span>
                        {row.source === "computed" ? (
                          <Badge variant="outline" className="text-[10px]">
                            Auto from orders
                          </Badge>
                        ) : isEditing ? (
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              min={0}
                              step="0.01"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="h-7 w-24 text-xs"
                              autoFocus
                            />
                            <Button
                              size="sm"
                              className="h-7"
                              onClick={() => handleSavePerformance(row.staffId)}
                              disabled={recordMutation.isPending}
                            >
                              {recordMutation.isPending ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                "Save"
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7"
                              onClick={() => setEditingStaffId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => {
                              setEditingStaffId(row.staffId);
                              setEditValue(String(row.value));
                            }}
                          >
                            Record progress
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-3 mt-4">
            <div className="p-3 border rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">KPI created</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(kpi.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge variant="outline">Initial</Badge>
            </div>
            {kpi.updatedAt !== kpi.createdAt && (
              <div className="p-3 border rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Last updated</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(kpi.updatedAt).toLocaleString()}
                  </p>
                </div>
                <Badge variant="secondary">
                  {kpi.unit}
                  {Number(kpi.currentValue).toLocaleString()}
                </Badge>
              </div>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-3 mt-4">
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  {kpi.progress >= 100 ? (
                    <Sparkles className="h-4 w-4 text-green-600" />
                  ) : kpi.progress >= 85 ? (
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm font-medium">
                    {kpi.progress >= 100
                      ? "Target met"
                      : kpi.progress >= 85
                        ? "Trending up"
                        : "Needs attention"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This KPI is at {kpi.progress}% of its target. Top performers
                  are listed under the Performances tab; review their share to
                  rebalance workloads if needed.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <SheetFooter className="flex-col sm:flex-row gap-2">
        <Button variant="outline" className="w-full sm:w-auto" onClick={onEdit}>
          Edit
        </Button>
        <Button
          variant="destructive"
          className="w-full sm:w-auto"
          onClick={onDelete}
          disabled={deleting}
        >
          {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </SheetFooter>
    </>
  );
}
