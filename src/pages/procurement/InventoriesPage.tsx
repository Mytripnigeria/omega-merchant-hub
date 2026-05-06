import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
import { TablePagination } from "@/components/ui/table-pagination";
import {
  Search,
  Plus,
  Package,
  AlertTriangle,
  Edit,
  Trash2,
  PackagePlus,
  PackageMinus,
} from "lucide-react";
import { toast } from "sonner";
import {
  useIngredients,
  useIngredientStats,
  useCreateIngredient,
  useUpdateIngredient,
  useDeleteIngredient,
  useAdjustStock,
} from "@/hooks/api/use-stock";
import { useStore } from "@/contexts/StoreContext";
import type { Ingredient } from "@/types/products";

interface IngredientForm {
  name: string;
  unit: string;
  currentStock: string;
  minStock: string;
  costPerUnit: string;
  sku: string;
  supplierId: string;
}

function emptyForm(): IngredientForm {
  return {
    name: "",
    unit: "kg",
    currentStock: "0",
    minStock: "0",
    costPerUnit: "0",
    sku: "",
    supplierId: "",
  };
}

function ingredientToForm(i: Ingredient): IngredientForm {
  return {
    name: i.name,
    unit: i.unit,
    currentStock: String(i.currentStock),
    minStock: String(i.minStock),
    costPerUnit: String(i.costPerUnit),
    sku: i.sku ?? "",
    supplierId: i.supplierId ?? "",
  };
}

function ngn(n: number): string {
  return `₦${n.toLocaleString()}`;
}

export default function InventoriesPage() {
  const { currentStore } = useStore();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"create" | "edit" | "adjust">("create");
  const [selected, setSelected] = useState<Ingredient | null>(null);
  const [form, setForm] = useState<IngredientForm>(emptyForm());
  const [adjustment, setAdjustment] = useState("");
  const [adjustReason, setAdjustReason] = useState("");

  const ingredientsQuery = useIngredients({
    storeId: currentStore?.id,
    search: search || undefined,
    page,
    limit: pageSize,
  });
  const statsQuery = useIngredientStats(currentStore?.id);

  const createIngredient = useCreateIngredient();
  const updateIngredient = useUpdateIngredient();
  const deleteIngredient = useDeleteIngredient();
  const adjustStock = useAdjustStock();

  const ingredients: Ingredient[] = ingredientsQuery.data?.data ?? [];
  const total = ingredientsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  const stats = useMemo(() => {
    const s = statsQuery.data;
    return [
      { label: "Total Items", value: s ? String(s.total) : "—", icon: Package },
      { label: "Low Stock", value: s ? String(s.lowStock) : "—", icon: AlertTriangle },
      {
        label: "Inventory Value",
        value: s ? ngn(s.totalValue) : "—",
        icon: Package,
      },
    ];
  }, [statsQuery.data]);

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm());
    setSheetMode("create");
    setSheetOpen(true);
  };
  const openEdit = (i: Ingredient) => {
    setSelected(i);
    setForm(ingredientToForm(i));
    setSheetMode("edit");
    setSheetOpen(true);
  };
  const openAdjust = (i: Ingredient) => {
    setSelected(i);
    setAdjustment("");
    setAdjustReason("");
    setSheetMode("adjust");
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
    createIngredient.mutate(
      {
        storeId: currentStore.id,
        name: form.name,
        unit: form.unit,
        currentStock: Number(form.currentStock) || 0,
        minStock: Number(form.minStock) || 0,
        costPerUnit: Number(form.costPerUnit) || 0,
        sku: form.sku || undefined,
        supplierId: form.supplierId || undefined,
      } as Partial<Ingredient> & { storeId: string },
      {
        onSuccess: () => {
          toast.success("Ingredient added");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't create"),
      },
    );
  };

  const handleUpdate = () => {
    if (!selected) return;
    updateIngredient.mutate(
      {
        id: selected.id,
        data: {
          name: form.name,
          unit: form.unit,
          minStock: Number(form.minStock) || 0,
          costPerUnit: Number(form.costPerUnit) || 0,
          sku: form.sku || undefined,
          supplierId: form.supplierId || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Ingredient updated");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't update"),
      },
    );
  };

  const handleAdjust = () => {
    if (!selected) return;
    const amount = Number(adjustment);
    if (!amount) {
      toast.error("Adjustment must be a non-zero number");
      return;
    }
    adjustStock.mutate(
      {
        id: selected.id,
        adjustment: amount,
        reason: adjustReason || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Stock adjusted");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't adjust"),
      },
    );
  };

  const handleDelete = (i: Ingredient) => {
    if (!confirm(`Delete ${i.name}?`)) return;
    deleteIngredient.mutate(i.id, {
      onSuccess: () => toast.success("Ingredient deleted"),
      onError: (e: Error) => toast.error(e.message ?? "Couldn't delete"),
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Inventory
          </h1>
          <p className="text-sm text-muted-foreground">
            Track ingredient stock levels for {currentStore?.name ?? "your store"}
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Ingredient
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ingredients..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 h-9 bg-muted/50 border-0"
            />
          </div>

          {ingredientsQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : ingredients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No ingredients yet</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={openCreate}>
                Add your first ingredient
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Name</th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-3">Stock</th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-3">Min</th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-3">Cost</th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-3">Value</th>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Status</th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((i) => {
                    const value = Number(i.currentStock) * Number(i.costPerUnit);
                    const lowStock = Number(i.currentStock) <= Number(i.minStock);
                    const outOfStock = Number(i.currentStock) <= 0;
                    return (
                      <tr key={i.id} className="border-b border-border last:border-0">
                        <td className="p-3">
                          <p className="font-medium">{i.name}</p>
                          {i.sku && (
                            <p className="text-xs text-muted-foreground font-mono">{i.sku}</p>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {Number(i.currentStock)} {i.unit}
                        </td>
                        <td className="p-3 text-right">
                          {Number(i.minStock)} {i.unit}
                        </td>
                        <td className="p-3 text-right">{ngn(Number(i.costPerUnit))}</td>
                        <td className="p-3 text-right font-medium">{ngn(value)}</td>
                        <td className="p-3">
                          {outOfStock ? (
                            <Badge variant="destructive" className="text-xs">Out of stock</Badge>
                          ) : lowStock ? (
                            <Badge variant="outline" className="text-xs text-yellow-700">
                              Low stock
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">In stock</Badge>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openAdjust(i)}
                              title="Adjust stock"
                            >
                              <PackagePlus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEdit(i)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(i)}
                              disabled={deleteIngredient.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
                ? "Add Ingredient"
                : sheetMode === "edit"
                  ? `Edit ${selected?.name}`
                  : `Adjust Stock — ${selected?.name}`}
            </SheetTitle>
          </SheetHeader>

          {sheetMode === "adjust" && selected ? (
            <div className="space-y-4 mt-4">
              <div className="p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">Current stock</p>
                <p className="text-2xl font-semibold">
                  {Number(selected.currentStock)} {selected.unit}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Adjustment ({selected.unit})</Label>
                <Input
                  type="number"
                  placeholder="e.g. +10 or -5"
                  value={adjustment}
                  onChange={(e) => setAdjustment(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Use a positive number to receive stock; negative to write off.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Reason</Label>
                <Input
                  placeholder="e.g. New shipment, spoilage..."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={close}>
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleAdjust}
                  disabled={adjustStock.isPending}
                >
                  <PackageMinus className="h-4 w-4 mr-2" />
                  Adjust Stock
                </Button>
              </div>
            </div>
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
                  <Label>Unit</Label>
                  <Input
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Input
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Current Stock</Label>
                  <Input
                    type="number"
                    value={form.currentStock}
                    onChange={(e) =>
                      setForm({ ...form, currentStock: e.target.value })
                    }
                    disabled={sheetMode === "edit"}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Min Stock</Label>
                  <Input
                    type="number"
                    value={form.minStock}
                    onChange={(e) => setForm({ ...form, minStock: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cost per Unit (₦)</Label>
                <Input
                  type="number"
                  value={form.costPerUnit}
                  onChange={(e) => setForm({ ...form, costPerUnit: e.target.value })}
                />
              </div>
            </div>
          )}

          {sheetMode !== "adjust" && (
            <SheetFooter className="mt-4 pt-4 border-t flex-col sm:flex-row gap-2">
              <Button variant="outline" className="w-full sm:w-auto" onClick={close}>
                Cancel
              </Button>
              <Button
                className="w-full sm:w-auto"
                onClick={sheetMode === "create" ? handleCreate : handleUpdate}
                disabled={createIngredient.isPending || updateIngredient.isPending}
              >
                {sheetMode === "create" ? "Add Ingredient" : "Save Changes"}
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
