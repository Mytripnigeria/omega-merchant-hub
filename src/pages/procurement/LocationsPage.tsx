import { useMemo, useState } from "react";
import { useStore } from "@/contexts/StoreContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Plus,
  Search,
  MapPin,
  Warehouse,
  Trash2,
  Edit,
} from "lucide-react";
import { TablePagination } from "@/components/ui/table-pagination";
import { toast } from "sonner";
import {
  useInventoryLocations,
  useCreateInventoryLocation,
  useUpdateInventoryLocation,
  useDeleteInventoryLocation,
} from "@/hooks/api/use-procurement";
import type {
  InventoryLocation,
  InventoryLocationType,
} from "@/services/api/procurement";

const ALL = "__all__";

interface LocationForm {
  name: string;
  type: InventoryLocationType;
  address: string;
  description: string;
  isDefault: boolean;
}

function emptyForm(): LocationForm {
  return {
    name: "",
    type: "instore",
    address: "",
    description: "",
    isDefault: false,
  };
}

function locationToForm(l: InventoryLocation): LocationForm {
  return {
    name: l.name,
    type: l.type,
    address: l.address ?? "",
    description: l.description ?? "",
    isDefault: l.isDefault,
  };
}

export default function LocationsPage() {
  const { currentStore } = useStore();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>(ALL);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<InventoryLocation | null>(null);
  const [form, setForm] = useState<LocationForm>(emptyForm());

  const locationsQuery = useInventoryLocations({
    storeId: currentStore?.id,
    type: typeFilter === ALL ? undefined : (typeFilter as InventoryLocationType),
    search: search || undefined,
    page,
    limit: pageSize,
  });
  const createLocation = useCreateInventoryLocation();
  const updateLocation = useUpdateInventoryLocation();
  const deleteLocation = useDeleteInventoryLocation();

  const locations = locationsQuery.data?.data ?? [];
  const total = locationsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  const stats = useMemo(
    () => [
      { label: "Total Locations", value: String(total) },
      {
        label: "Default",
        value: String(locations.filter((l) => l.isDefault).length),
      },
      {
        label: "Warehouses",
        value: String(locations.filter((l) => l.type === "warehouse").length),
      },
    ],
    [locations, total],
  );

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm());
    setSheetMode("create");
    setSheetOpen(true);
  };
  const openEdit = (l: InventoryLocation) => {
    setSelected(l);
    setForm(locationToForm(l));
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
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    createLocation.mutate(
      {
        storeId: currentStore.id,
        name: form.name,
        type: form.type,
        address: form.address || undefined,
        description: form.description || undefined,
        isDefault: form.isDefault,
      },
      {
        onSuccess: () => {
          toast.success("Location created");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't create"),
      },
    );
  };

  const handleUpdate = () => {
    if (!selected) return;
    updateLocation.mutate(
      {
        id: selected.id,
        data: {
          name: form.name,
          type: form.type,
          address: form.address || undefined,
          description: form.description || undefined,
          isDefault: form.isDefault,
        },
      },
      {
        onSuccess: () => {
          toast.success("Location updated");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't update"),
      },
    );
  };

  const handleDelete = (l: InventoryLocation) => {
    if (!confirm(`Delete location ${l.name}?`)) return;
    deleteLocation.mutate(l.id, {
      onSuccess: () => toast.success("Location deleted"),
      onError: (e: Error) => toast.error(e.message ?? "Couldn't delete"),
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Inventory Locations
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage where stock is kept across the store
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Location
        </Button>
      </div>

      <div className="grid gap-3 grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-3 sm:p-4">
              <p className="text-2xl font-semibold">{s.value}</p>
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
                placeholder="Search locations..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 h-9 bg-muted/50 border-0"
              />
            </div>
            <Select
              value={typeFilter}
              onValueChange={(v) => {
                setTypeFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-40 h-9 bg-muted/50 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Types</SelectItem>
                <SelectItem value="instore">In-store</SelectItem>
                <SelectItem value="outstore">Out-store</SelectItem>
                <SelectItem value="warehouse">Warehouse</SelectItem>
                <SelectItem value="kitchen">Kitchen</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {locationsQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : locations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Warehouse className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No locations yet</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={openCreate}>
                Add your first location
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {locations.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center justify-between p-4 border rounded-lg gap-3 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Warehouse className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{l.name}</p>
                        {l.isDefault && (
                          <Badge variant="outline" className="text-xs">
                            Default
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-xs capitalize">
                          {l.type}
                        </Badge>
                      </div>
                      {l.address && (
                        <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" /> {l.address}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(l)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(l)}
                      disabled={deleteLocation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {sheetMode === "create" ? "Add Location" : "Edit Location"}
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm({ ...form, type: v as InventoryLocationType })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instore">In-store</SelectItem>
                  <SelectItem value="outstore">Out-store</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="kitchen">Kitchen</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <p className="text-sm font-medium">Default Location</p>
                <p className="text-xs text-muted-foreground">
                  Used as the default destination for new stock
                </p>
              </div>
              <Switch
                checked={form.isDefault}
                onCheckedChange={(v) => setForm({ ...form, isDefault: v })}
              />
            </div>
          </div>
          <SheetFooter className="mt-4 pt-4 border-t flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto" onClick={close}>
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={sheetMode === "create" ? handleCreate : handleUpdate}
              disabled={createLocation.isPending || updateLocation.isPending}
            >
              {sheetMode === "create" ? "Create Location" : "Save Changes"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
