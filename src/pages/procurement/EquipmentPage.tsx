import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  Search,
  Plus,
  Wrench,
  Edit,
  Trash2,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  useEquipmentList,
  useCreateEquipment,
  useUpdateEquipment,
  useDeleteEquipment,
  useMaintenanceLogs,
  useLogMaintenance,
  useInventoryLocations,
} from "@/hooks/api/use-procurement";
import { useStore } from "@/contexts/StoreContext";
import type {
  Equipment,
  EquipmentCategory,
  EquipmentStatus,
  MaintenanceType,
} from "@/services/api/procurement";

const ALL = "__all__";

const statusColor: Record<EquipmentStatus, string> = {
  operational: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  maintenance: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  repair: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  offline: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300",
  retired: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

interface EquipmentForm {
  name: string;
  category: EquipmentCategory;
  status: EquipmentStatus;
  locationId: string;
  serialNumber: string;
  model: string;
  manufacturer: string;
  purchaseDate: string;
  purchasePrice: string;
  warrantyExpiry: string;
  maintenanceCycleDays: string;
  /** Lower bound of the safe-temperature range, in Celsius. Blank = unset. */
  minTempC: string;
  /** Upper bound of the safe-temperature range, in Celsius. Blank = unset. */
  maxTempC: string;
  notes: string;
}

interface MaintenanceForm {
  type: MaintenanceType;
  performedOn: string;
  performedBy: string;
  cost: string;
  description: string;
}

function emptyForm(): EquipmentForm {
  return {
    name: "",
    category: "kitchen",
    status: "operational",
    locationId: "",
    serialNumber: "",
    model: "",
    manufacturer: "",
    purchaseDate: "",
    purchasePrice: "",
    warrantyExpiry: "",
    maintenanceCycleDays: "",
    minTempC: "",
    maxTempC: "",
    notes: "",
  };
}

function emptyMaintenance(): MaintenanceForm {
  return {
    type: "routine",
    performedOn: new Date().toISOString().slice(0, 10),
    performedBy: "",
    cost: "",
    description: "",
  };
}

function ngn(n: number): string {
  return `₦${n.toLocaleString()}`;
}

export default function EquipmentPage() {
  const { currentStore } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [categoryFilter, setCategoryFilter] = useState<string>(ALL);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "create" | "edit">("create");
  const [selected, setSelected] = useState<Equipment | null>(null);
  const [form, setForm] = useState<EquipmentForm>(emptyForm());
  const [maintForm, setMaintForm] = useState<MaintenanceForm>(emptyMaintenance());

  const equipmentQuery = useEquipmentList({
    storeId: currentStore?.id,
    status: statusFilter === ALL ? undefined : (statusFilter as EquipmentStatus),
    category:
      categoryFilter === ALL ? undefined : (categoryFilter as EquipmentCategory),
    search: search || undefined,
    page,
    limit: pageSize,
  });
  const locationsQuery = useInventoryLocations({
    storeId: currentStore?.id,
    limit: 100,
  });
  const maintLogs = useMaintenanceLogs(selected?.id ?? "");

  const createEquipment = useCreateEquipment();
  const updateEquipment = useUpdateEquipment();
  const deleteEquipment = useDeleteEquipment();
  const logMaintenance = useLogMaintenance();

  const equipment = equipmentQuery.data?.data ?? [];
  const total = equipmentQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  const locationsById = useMemo(() => {
    const map = new Map<string, string>();
    (locationsQuery.data?.data ?? []).forEach((l) => map.set(l.id, l.name));
    return map;
  }, [locationsQuery.data]);

  const stats = useMemo(
    () => [
      { label: "Total", value: String(total), icon: Wrench },
      {
        label: "Operational",
        value: String(equipment.filter((e) => e.status === "operational").length),
        icon: Wrench,
      },
      {
        label: "Maintenance Due",
        value: String(
          equipment.filter(
            (e) =>
              e.nextMaintenanceDate &&
              new Date(e.nextMaintenanceDate) <= new Date(),
          ).length,
        ),
        icon: AlertTriangle,
      },
    ],
    [equipment, total],
  );

  const equipmentToForm = (e: Equipment): EquipmentForm => ({
    name: e.name,
    category: e.category,
    status: e.status,
    locationId: e.locationId ?? "",
    serialNumber: e.serialNumber ?? "",
    model: e.model ?? "",
    manufacturer: e.manufacturer ?? "",
    purchaseDate: e.purchaseDate ?? "",
    purchasePrice: e.purchasePrice != null ? String(e.purchasePrice) : "",
    warrantyExpiry: e.warrantyExpiry ?? "",
    maintenanceCycleDays:
      e.maintenanceCycleDays != null ? String(e.maintenanceCycleDays) : "",
    minTempC: e.minTempC != null ? String(e.minTempC) : "",
    maxTempC: e.maxTempC != null ? String(e.maxTempC) : "",
    notes: e.notes ?? "",
  });

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm());
    setSheetMode("create");
    setSheetOpen(true);
  };
  const openView = (e: Equipment) => {
    setSelected(e);
    setForm(equipmentToForm(e));
    setMaintForm(emptyMaintenance());
    setSheetMode("view");
    setSheetOpen(true);
  };
  const openEdit = (e: Equipment) => {
    setSelected(e);
    setForm(equipmentToForm(e));
    setSheetMode("edit");
    setSheetOpen(true);
  };
  const close = () => {
    setSheetOpen(false);
    setSelected(null);
  };

  const buildPayload = () => ({
    name: form.name,
    category: form.category,
    status: form.status,
    locationId: form.locationId || undefined,
    serialNumber: form.serialNumber || undefined,
    model: form.model || undefined,
    manufacturer: form.manufacturer || undefined,
    purchaseDate: form.purchaseDate || undefined,
    purchasePrice: form.purchasePrice ? Number(form.purchasePrice) : undefined,
    warrantyExpiry: form.warrantyExpiry || undefined,
    maintenanceCycleDays: form.maintenanceCycleDays
      ? Number(form.maintenanceCycleDays)
      : undefined,
    minTempC: form.minTempC === "" ? undefined : Number(form.minTempC),
    maxTempC: form.maxTempC === "" ? undefined : Number(form.maxTempC),
    notes: form.notes || undefined,
  });

  const handleCreate = () => {
    if (!currentStore) {
      toast.error("Select a store first");
      return;
    }
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    createEquipment.mutate(
      { storeId: currentStore.id, ...buildPayload() },
      {
        onSuccess: () => {
          toast.success("Equipment added");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't create"),
      },
    );
  };

  const handleUpdate = () => {
    if (!selected) return;
    updateEquipment.mutate(
      { id: selected.id, data: buildPayload() },
      {
        onSuccess: () => {
          toast.success("Equipment updated");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't update"),
      },
    );
  };

  const handleDelete = (e: Equipment) => {
    if (!confirm(`Delete ${e.name}?`)) return;
    deleteEquipment.mutate(e.id, {
      onSuccess: () => toast.success("Equipment deleted"),
      onError: (e: Error) => toast.error(e.message ?? "Couldn't delete"),
    });
  };

  const handleLogMaintenance = () => {
    if (!selected) return;
    if (!maintForm.description.trim()) {
      toast.error("Description is required");
      return;
    }
    logMaintenance.mutate(
      {
        equipmentId: selected.id,
        type: maintForm.type,
        performedOn: maintForm.performedOn,
        performedBy: maintForm.performedBy || undefined,
        cost: maintForm.cost ? Number(maintForm.cost) : undefined,
        description: maintForm.description,
      },
      {
        onSuccess: () => {
          toast.success("Maintenance logged");
          setMaintForm(emptyMaintenance());
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't log"),
      },
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Equipment</h1>
          <p className="text-sm text-muted-foreground">
            Track equipment, maintenance, and warranty
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Equipment
        </Button>
      </div>

      <div className="grid gap-3 grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-muted flex items-center justify-center">
                  <s.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-semibold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search equipment..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 h-9 bg-muted/50 border-0"
              />
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(v) => {
                setCategoryFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-40 h-9 bg-muted/50 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Categories</SelectItem>
                <SelectItem value="kitchen">Kitchen</SelectItem>
                <SelectItem value="refrigeration">Refrigeration</SelectItem>
                <SelectItem value="pos">POS</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="hvac">HVAC</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-36 h-9 bg-muted/50 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Status</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {equipmentQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : equipment.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Wrench className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No equipment yet</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={openCreate}>
                Add your first item
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {equipment.map((eq) => (
                <div
                  key={eq.id}
                  className="flex items-center justify-between p-4 border rounded-lg gap-3 hover:bg-muted/40 transition-colors cursor-pointer"
                  onClick={() => openView(eq)}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{eq.name}</p>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {eq.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {eq.locationId
                        ? `${locationsById.get(eq.locationId) ?? "—"} · `
                        : ""}
                      {eq.model ?? "No model"} · {eq.serialNumber ?? "—"}
                    </p>
                    {eq.nextMaintenanceDate && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Next maintenance:{" "}
                        {format(new Date(eq.nextMaintenanceDate), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Badge
                      variant="secondary"
                      className={`text-xs capitalize ${statusColor[eq.status]}`}
                    >
                      {eq.status}
                    </Badge>
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

      <Sheet open={sheetOpen} onOpenChange={(o) => (o ? setSheetOpen(true) : close())}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {sheetMode === "create"
                ? "Add Equipment"
                : sheetMode === "edit"
                  ? `Edit ${selected?.name}`
                  : selected?.name}
            </SheetTitle>
          </SheetHeader>

          {sheetMode === "view" && selected ? (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-3 mt-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge
                      variant="secondary"
                      className={`text-xs capitalize ${statusColor[selected.status]}`}
                    >
                      {selected.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="font-medium capitalize">{selected.category}</p>
                  </div>
                  {selected.locationId && (
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium">
                        {locationsById.get(selected.locationId) ?? "—"}
                      </p>
                    </div>
                  )}
                  {selected.serialNumber && (
                    <div>
                      <p className="text-xs text-muted-foreground">Serial</p>
                      <p className="font-mono">{selected.serialNumber}</p>
                    </div>
                  )}
                  {selected.model && (
                    <div>
                      <p className="text-xs text-muted-foreground">Model</p>
                      <p className="font-medium">{selected.model}</p>
                    </div>
                  )}
                  {selected.manufacturer && (
                    <div>
                      <p className="text-xs text-muted-foreground">Manufacturer</p>
                      <p className="font-medium">{selected.manufacturer}</p>
                    </div>
                  )}
                  {selected.purchaseDate && (
                    <div>
                      <p className="text-xs text-muted-foreground">Purchased</p>
                      <p className="font-medium">
                        {format(new Date(selected.purchaseDate), "MMM d, yyyy")}
                      </p>
                    </div>
                  )}
                  {selected.purchasePrice != null && (
                    <div>
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="font-medium">{ngn(selected.purchasePrice)}</p>
                    </div>
                  )}
                  {selected.warrantyExpiry && (
                    <div>
                      <p className="text-xs text-muted-foreground">Warranty</p>
                      <p className="font-medium">
                        {format(new Date(selected.warrantyExpiry), "MMM d, yyyy")}
                      </p>
                    </div>
                  )}
                  {selected.lastMaintenanceDate && (
                    <div>
                      <p className="text-xs text-muted-foreground">Last Maintenance</p>
                      <p className="font-medium">
                        {format(new Date(selected.lastMaintenanceDate), "MMM d, yyyy")}
                      </p>
                    </div>
                  )}
                  {selected.nextMaintenanceDate && (
                    <div>
                      <p className="text-xs text-muted-foreground">Next Maintenance</p>
                      <p className="font-medium">
                        {format(new Date(selected.nextMaintenanceDate), "MMM d, yyyy")}
                      </p>
                    </div>
                  )}
                </div>
                {selected.notes && (
                  <div>
                    <p className="text-xs text-muted-foreground">Notes</p>
                    <p>{selected.notes}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-3 border-t">
                  <Button variant="outline" className="flex-1" onClick={() => openEdit(selected)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleDelete(selected)}
                    disabled={deleteEquipment.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="maintenance" className="space-y-4 mt-4">
                <div className="border rounded-lg p-3 space-y-2">
                  <p className="text-sm font-medium">Log maintenance</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={maintForm.type}
                      onValueChange={(v) =>
                        setMaintForm({ ...maintForm, type: v as MaintenanceType })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        <SelectItem value="cleaning">Cleaning</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="date"
                      value={maintForm.performedOn}
                      onChange={(e) =>
                        setMaintForm({ ...maintForm, performedOn: e.target.value })
                      }
                    />
                  </div>
                  <Input
                    placeholder="Performed by"
                    value={maintForm.performedBy}
                    onChange={(e) =>
                      setMaintForm({ ...maintForm, performedBy: e.target.value })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Cost (₦)"
                    value={maintForm.cost}
                    onChange={(e) => setMaintForm({ ...maintForm, cost: e.target.value })}
                  />
                  <Textarea
                    placeholder="Description"
                    rows={2}
                    value={maintForm.description}
                    onChange={(e) =>
                      setMaintForm({ ...maintForm, description: e.target.value })
                    }
                  />
                  <Button
                    size="sm"
                    onClick={handleLogMaintenance}
                    disabled={logMaintenance.isPending}
                    className="w-full"
                  >
                    Log
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">History</p>
                  {maintLogs.isLoading ? (
                    <Skeleton className="h-24 w-full" />
                  ) : (maintLogs.data ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No maintenance logged</p>
                  ) : (
                    (maintLogs.data ?? []).map((l) => (
                      <div key={l.id} className="border rounded p-2 text-sm">
                        <div className="flex justify-between mb-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {l.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(l.performedOn), "MMM d, yyyy")}
                          </span>
                        </div>
                        <p>{l.description}</p>
                        {(l.performedBy || l.cost != null) && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {l.performedBy && `by ${l.performedBy}`}
                            {l.performedBy && l.cost != null && " · "}
                            {l.cost != null && ngn(l.cost)}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) =>
                      setForm({ ...form, category: v as EquipmentCategory })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kitchen">Kitchen</SelectItem>
                      <SelectItem value="refrigeration">Refrigeration</SelectItem>
                      <SelectItem value="pos">POS</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) =>
                      setForm({ ...form, status: v as EquipmentStatus })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Select
                  value={form.locationId}
                  onValueChange={(v) => setForm({ ...form, locationId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {(locationsQuery.data?.data ?? []).map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Input
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Serial Number</Label>
                  <Input
                    value={form.serialNumber}
                    onChange={(e) =>
                      setForm({ ...form, serialNumber: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Manufacturer</Label>
                <Input
                  value={form.manufacturer}
                  onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Purchase Date</Label>
                  <Input
                    type="date"
                    value={form.purchaseDate}
                    onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Purchase Price (₦)</Label>
                  <Input
                    type="number"
                    value={form.purchasePrice}
                    onChange={(e) =>
                      setForm({ ...form, purchasePrice: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Warranty Expiry</Label>
                  <Input
                    type="date"
                    value={form.warrantyExpiry}
                    onChange={(e) =>
                      setForm({ ...form, warrantyExpiry: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maintenance Cycle (days)</Label>
                  <Input
                    type="number"
                    value={form.maintenanceCycleDays}
                    onChange={(e) =>
                      setForm({ ...form, maintenanceCycleDays: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Min temperature (°C)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., -22"
                    value={form.minTempC}
                    onChange={(e) =>
                      setForm({ ...form, minTempC: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max temperature (°C)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="e.g., -15"
                    value={form.maxTempC}
                    onChange={(e) =>
                      setForm({ ...form, maxTempC: e.target.value })
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground col-span-2">
                  When set, the workstation flags readings outside this range. Leave blank to skip temperature monitoring for this item.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
              <SheetFooter className="flex-col sm:flex-row gap-2 pt-4 border-t">
                <Button variant="outline" className="w-full sm:w-auto" onClick={close}>
                  Cancel
                </Button>
                <Button
                  className="w-full sm:w-auto"
                  onClick={sheetMode === "create" ? handleCreate : handleUpdate}
                  disabled={createEquipment.isPending || updateEquipment.isPending}
                >
                  {sheetMode === "create" ? "Add Equipment" : "Save Changes"}
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
