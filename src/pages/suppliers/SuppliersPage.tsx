import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { TablePagination } from "@/components/ui/table-pagination";
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
import {
  Search,
  Plus,
  Truck,
  Mail,
  Phone,
  MapPin,
  Star,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useSuppliers,
  useSupplierStats,
  useSupplierIngredients,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
} from "@/hooks/api/use-suppliers";
import type {
  Supplier,
  SupplierStatus,
  CreateSupplierRequest,
} from "@/services/api/suppliers";

const ALL = "__all__";

const statusColor: Record<SupplierStatus, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  inactive: "bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400",
  suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

interface SupplierForm {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  paymentTerms: string;
  category: string;
  status: SupplierStatus;
  rating: string;
  notes: string;
}

function emptyForm(): SupplierForm {
  return {
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    paymentTerms: "",
    category: "",
    status: "active",
    rating: "",
    notes: "",
  };
}

function supplierToForm(s: Supplier): SupplierForm {
  return {
    name: s.name,
    contactPerson: s.contactPerson ?? "",
    email: s.email ?? "",
    phone: s.phone ?? "",
    address: s.address ?? "",
    paymentTerms: s.paymentTerms ?? "",
    category: s.category ?? "",
    status: s.status,
    rating: s.rating != null ? String(s.rating) : "",
    notes: s.notes ?? "",
  };
}

export default function SuppliersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "create" | "edit">("create");
  const [selected, setSelected] = useState<Supplier | null>(null);
  const [form, setForm] = useState<SupplierForm>(emptyForm());

  const suppliersQuery = useSuppliers({
    search: search || undefined,
    status: statusFilter === ALL ? undefined : (statusFilter as SupplierStatus),
    page,
    limit: pageSize,
  });
  const statsQuery = useSupplierStats();
  const ingredientsQuery = useSupplierIngredients(selected?.id ?? "");

  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  const suppliers = suppliersQuery.data?.data ?? [];
  const total = suppliersQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  const stats = useMemo(
    () => [
      {
        label: "Total Suppliers",
        value: statsQuery.data ? String(statsQuery.data.total) : "—",
      },
      {
        label: "Active",
        value: statsQuery.data ? String(statsQuery.data.active) : "—",
      },
      {
        label: "Categories",
        value: String(new Set(suppliers.map((s) => s.category).filter(Boolean)).size),
      },
    ],
    [suppliers, statsQuery.data],
  );

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm());
    setSheetMode("create");
    setSheetOpen(true);
  };
  const openView = (s: Supplier) => {
    setSelected(s);
    setForm(supplierToForm(s));
    setSheetMode("view");
    setSheetOpen(true);
  };
  const openEdit = (s: Supplier) => {
    setSelected(s);
    setForm(supplierToForm(s));
    setSheetMode("edit");
    setSheetOpen(true);
  };
  const close = () => {
    setSheetOpen(false);
    setSelected(null);
  };

  const buildPayload = (): CreateSupplierRequest => ({
    name: form.name,
    contactPerson: form.contactPerson || undefined,
    email: form.email || undefined,
    phone: form.phone || undefined,
    address: form.address || undefined,
    paymentTerms: form.paymentTerms || undefined,
    category: form.category || undefined,
    status: form.status,
    rating: form.rating ? Number(form.rating) : undefined,
    notes: form.notes || undefined,
  });

  const handleCreate = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    createSupplier.mutate(buildPayload(), {
      onSuccess: () => {
        toast.success("Supplier added");
        close();
      },
      onError: (e: Error) => toast.error(e.message ?? "Couldn't create"),
    });
  };

  const handleUpdate = () => {
    if (!selected) return;
    updateSupplier.mutate(
      { id: selected.id, data: buildPayload() },
      {
        onSuccess: () => {
          toast.success("Supplier updated");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't update"),
      },
    );
  };

  const handleDelete = () => {
    if (!selected) return;
    if (!confirm(`Delete ${selected.name}?`)) return;
    deleteSupplier.mutate(selected.id, {
      onSuccess: () => {
        toast.success("Supplier deleted");
        close();
      },
      onError: (e: Error) => toast.error(e.message ?? "Couldn't delete"),
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Suppliers</h1>
          <p className="text-sm text-muted-foreground">
            Manage your vendors and supply chain partners
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Supplier
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
                placeholder="Search suppliers..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 h-9 bg-muted/50 border-0"
              />
            </div>
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
                <SelectItem value={ALL}>All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {suppliersQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : suppliers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Truck className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No suppliers yet</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={openCreate}>
                Add your first supplier
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {suppliers.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-4 border rounded-lg gap-3 hover:bg-muted/40 transition-colors cursor-pointer"
                  onClick={() => openView(s)}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Truck className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{s.name}</p>
                        {s.category && (
                          <Badge variant="secondary" className="text-xs">
                            {s.category}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {s.contactPerson ?? "—"}
                        {s.email && <> · {s.email}</>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {s.rating != null && (
                      <span className="flex items-center gap-1 text-xs">
                        <Star className="h-3 w-3 fill-yellow-400 stroke-yellow-400" />
                        {s.rating.toFixed(1)}
                      </span>
                    )}
                    <Badge
                      variant="secondary"
                      className={cn("text-xs capitalize", statusColor[s.status])}
                    >
                      {s.status}
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
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {sheetMode === "create"
                ? "Add Supplier"
                : sheetMode === "edit"
                  ? `Edit ${selected?.name}`
                  : selected?.name}
            </SheetTitle>
          </SheetHeader>

          {sheetMode === "view" && selected ? (
            <Tabs defaultValue="overview" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-3 mt-4 text-sm">
                <div className="space-y-2">
                  {selected.contactPerson && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contact</span>
                      <span className="font-medium">{selected.contactPerson}</span>
                    </div>
                  )}
                  {selected.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" /> {selected.email}
                    </div>
                  )}
                  {selected.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" /> {selected.phone}
                    </div>
                  )}
                  {selected.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>{selected.address}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                  {selected.paymentTerms && (
                    <div>
                      <p className="text-xs text-muted-foreground">Payment Terms</p>
                      <p className="font-medium">{selected.paymentTerms}</p>
                    </div>
                  )}
                  {selected.category && (
                    <div>
                      <p className="text-xs text-muted-foreground">Category</p>
                      <p className="font-medium">{selected.category}</p>
                    </div>
                  )}
                  {selected.rating != null && (
                    <div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                      <p className="font-medium flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 stroke-yellow-400" />
                        {selected.rating.toFixed(1)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs capitalize", statusColor[selected.status])}
                    >
                      {selected.status}
                    </Badge>
                  </div>
                </div>

                {selected.notes && (
                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground mb-1">Notes</p>
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
                    onClick={handleDelete}
                    disabled={deleteSupplier.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="ingredients" className="space-y-2 mt-4">
                {ingredientsQuery.isLoading ? (
                  <Skeleton className="h-24 w-full" />
                ) : (ingredientsQuery.data ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No ingredients linked to this supplier
                  </p>
                ) : (
                  (ingredientsQuery.data ?? []).map((i) => (
                    <div
                      key={i.id}
                      className="flex justify-between p-2 border rounded text-sm"
                    >
                      <span>{i.name}</span>
                      <span className="text-muted-foreground">
                        {i.sku ?? "—"} · {i.unit}
                      </span>
                    </div>
                  ))
                )}
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
              <div className="space-y-2">
                <Label>Contact Person</Label>
                <Input
                  value={form.contactPerson}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    placeholder="e.g. Produce, Beverages"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Payment Terms</Label>
                  <Input
                    placeholder="e.g. Net 30"
                    value={form.paymentTerms}
                    onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) =>
                      setForm({ ...form, status: v as SupplierStatus })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Rating (0-5)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min={0}
                    max={5}
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  />
                </div>
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
                  disabled={createSupplier.isPending || updateSupplier.isPending}
                >
                  {sheetMode === "create" ? "Add Supplier" : "Save Changes"}
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
