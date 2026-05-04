import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useIngredients,
  useIngredientStats,
  useCreateIngredient,
  useUpdateIngredient,
  useDeleteIngredient,
  useAdjustStock,
} from "@/hooks/api/use-stock";
import { useStore } from "@/contexts/StoreContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Search,
  Plus,
  AlertTriangle,
  TrendingDown,
  Package,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Ingredient {
  id: string;
  name: string;
  sku?: string;
  unit: string;
  currentStock: number;
  minStock: number;
  costPerUnit: number;
  supplierId?: string;
  storeId: string;
  lastRestocked?: string;
  createdAt?: string;
  updatedAt?: string;
}

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
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

function TableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 border-b last:border-0 flex gap-4 items-center">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function getStockStatus(current: number, min: number) {
  if (current <= min * 0.5)
    return {
      label: "Critical",
      class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
  if (current <= min)
    return {
      label: "Low",
      class: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    };
  return {
    label: "Good",
    class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };
}

export default function IngredientsPage() {
  const { currentStore } = useStore();
  const storeId = currentStore?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "low">("all");

  const queryParams = useMemo(
    () => ({
      ...(storeId ? { storeId } : {}),
      ...(searchQuery ? { search: searchQuery } : {}),
      ...(statusFilter === "low" ? { status: "low" } : {}),
    }),
    [storeId, searchQuery, statusFilter],
  );

  const { data: ingredientsData, isLoading } = useIngredients(queryParams);
  const { data: stats } = useIngredientStats(storeId);
  const ingredients: Ingredient[] = (ingredientsData?.data ?? []) as Ingredient[];

  const createIngredient = useCreateIngredient();
  const updateIngredient = useUpdateIngredient();
  const deleteIngredient = useDeleteIngredient();
  const adjustStock = useAdjustStock();

  // Form sheet
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formUnit, setFormUnit] = useState("");
  const [formCurrentStock, setFormCurrentStock] = useState<number>(0);
  const [formMinStock, setFormMinStock] = useState<number>(0);
  const [formCostPerUnit, setFormCostPerUnit] = useState<number>(0);
  const [formSupplierId, setFormSupplierId] = useState("");

  // View sheet
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [viewingIngredient, setViewingIngredient] = useState<Ingredient | null>(null);

  // Adjust stock sheet
  const [isAdjustSheetOpen, setIsAdjustSheetOpen] = useState(false);
  const [adjustTarget, setAdjustTarget] = useState<Ingredient | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState("");

  const lowStockItems = ingredients.filter((i) => Number(i.currentStock) <= Number(i.minStock));

  const resetForm = () => {
    setFormName("");
    setFormSku("");
    setFormUnit("");
    setFormCurrentStock(0);
    setFormMinStock(0);
    setFormCostPerUnit(0);
    setFormSupplierId("");
  };

  const openCreateSheet = () => {
    setSelectedIngredient(null);
    resetForm();
    setIsFormSheetOpen(true);
  };

  const openEditSheet = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setIsFormSheetOpen(true);
  };

  useEffect(() => {
    if (selectedIngredient && isFormSheetOpen) {
      setFormName(selectedIngredient.name);
      setFormSku(selectedIngredient.sku ?? "");
      setFormUnit(selectedIngredient.unit);
      setFormCurrentStock(Number(selectedIngredient.currentStock ?? 0));
      setFormMinStock(Number(selectedIngredient.minStock ?? 0));
      setFormCostPerUnit(Number(selectedIngredient.costPerUnit ?? 0));
      setFormSupplierId(selectedIngredient.supplierId ?? "");
    }
  }, [selectedIngredient, isFormSheetOpen]);

  const handleSave = async () => {
    if (!storeId) {
      toast.error("Select a store first");
      return;
    }
    if (!formName.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formUnit.trim()) {
      toast.error("Unit is required");
      return;
    }
    const payload = {
      name: formName.trim(),
      sku: formSku || undefined,
      unit: formUnit.trim(),
      currentStock: formCurrentStock,
      minStock: formMinStock,
      costPerUnit: formCostPerUnit,
      supplierId: formSupplierId || undefined,
    };
    try {
      if (selectedIngredient) {
        await updateIngredient.mutateAsync({ id: selectedIngredient.id, data: payload });
        toast.success("Ingredient updated");
      } else {
        await createIngredient.mutateAsync({ ...payload, storeId } as Parameters<
          typeof createIngredient.mutateAsync
        >[0]);
        toast.success("Ingredient created");
      }
      setIsFormSheetOpen(false);
      resetForm();
      setSelectedIngredient(null);
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to save");
    }
  };

  const handleDelete = (ingredient: Ingredient) => {
    deleteIngredient.mutate(ingredient.id, {
      onSuccess: () => {
        toast.success("Ingredient deleted");
        setIsViewSheetOpen(false);
        setIsFormSheetOpen(false);
      },
      onError: (e: Error) => toast.error(e.message ?? "Failed to delete"),
    });
  };

  const openAdjustSheet = (ingredient: Ingredient) => {
    setAdjustTarget(ingredient);
    setAdjustAmount(0);
    setAdjustReason("");
    setIsAdjustSheetOpen(true);
  };

  const handleAdjustStock = async () => {
    if (!adjustTarget) return;
    if (adjustAmount === 0) {
      toast.error("Adjustment must be non-zero");
      return;
    }
    try {
      await adjustStock.mutateAsync({
        id: adjustTarget.id,
        adjustment: adjustAmount,
        reason: adjustReason || undefined,
      });
      toast.success("Stock adjusted");
      setIsAdjustSheetOpen(false);
      setAdjustTarget(null);
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to adjust stock");
    }
  };

  const handleViewIngredient = (ingredient: Ingredient) => {
    setViewingIngredient(ingredient);
    setIsViewSheetOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Ingredients</h1>
          <p className="text-sm text-muted-foreground">Manage raw materials and stock levels</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={openCreateSheet}>
          <Plus className="mr-2 h-4 w-4" />
          Add Ingredient
        </Button>
      </div>

      {lowStockItems.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 p-4">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <div className="flex-1">
            <p className="font-medium text-yellow-800 dark:text-yellow-200">Low Stock Alert</p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {lowStockItems.length} ingredient(s) need restocking
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-yellow-300 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-200"
            onClick={() => setStatusFilter("low")}
          >
            View All
          </Button>
        </div>
      )}

      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Ingredients</p>
              <p className="text-xl sm:text-2xl font-semibold">
                {stats?.total ?? ingredients.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Low Stock</p>
              <p className="text-xl sm:text-2xl font-semibold text-yellow-600">
                {stats?.lowStock ?? lowStockItems.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Value</p>
              <p className="text-xl sm:text-2xl font-semibold">
                {formatPrice(
                  stats?.totalValue ??
                    ingredients.reduce(
                      (acc, i) => acc + Number(i.currentStock) * Number(i.costPerUnit),
                      0,
                    ),
                )}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Suppliers</p>
              <p className="text-xl sm:text-2xl font-semibold">
                {stats?.supplierCount ??
                  new Set(ingredients.map((i) => i.supplierId).filter(Boolean)).size}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | "low")}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Ingredient</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost/Unit</TableHead>
                    <TableHead className="pr-6 w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ingredients.map((ingredient) => {
                    const status = getStockStatus(
                      Number(ingredient.currentStock),
                      Number(ingredient.minStock),
                    );
                    return (
                      <TableRow
                        key={ingredient.id}
                        className="group cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewIngredient(ingredient)}
                      >
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <span className="font-medium">{ingredient.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {ingredient.sku ?? "—"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{ingredient.currentStock}</span>
                            <span className="text-muted-foreground">{ingredient.unit}</span>
                            {Number(ingredient.currentStock) <= Number(ingredient.minStock) && (
                              <TrendingDown className="h-4 w-4 text-destructive" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn("font-normal", status.class)}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatPrice(Number(ingredient.costPerUnit))}</TableCell>
                        <TableCell className="pr-6" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewIngredient(ingredient)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openAdjustSheet(ingredient)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Adjust Stock
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditSheet(ingredient)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(ingredient)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {ingredients.length === 0 && (
                <div className="p-12 text-center text-sm text-muted-foreground">
                  No ingredients yet — click "Add Ingredient" to create one.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form Sheet */}
      <Sheet
        open={isFormSheetOpen}
        onOpenChange={(open) => {
          setIsFormSheetOpen(open);
          if (!open) {
            setSelectedIngredient(null);
            resetForm();
          }
        }}
      >
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedIngredient ? "Edit Ingredient" : "Add Ingredient"}</SheetTitle>
            <SheetDescription>
              {selectedIngredient ? "Update ingredient details" : "Add a new raw material"}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="e.g., Basmati Rice"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input
                  placeholder="ING-001"
                  value={formSku}
                  onChange={(e) => setFormSku(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Input
                  placeholder="kg, litre, pcs"
                  value={formUnit}
                  onChange={(e) => setFormUnit(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Current Stock</Label>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  value={formCurrentStock}
                  onChange={(e) => setFormCurrentStock(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Reorder Level</Label>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  value={formMinStock}
                  onChange={(e) => setFormMinStock(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cost per Unit (₦)</Label>
              <Input
                type="number"
                min={0}
                value={formCostPerUnit}
                onChange={(e) => setFormCostPerUnit(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Supplier ID (optional)</Label>
              <Input
                placeholder="Supplier reference"
                value={formSupplierId}
                onChange={(e) => setFormSupplierId(e.target.value)}
              />
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsFormSheetOpen(false)}
              className="w-full sm:w-auto"
              disabled={createIngredient.isPending || updateIngredient.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="w-full sm:w-auto"
              disabled={createIngredient.isPending || updateIngredient.isPending}
            >
              {(createIngredient.isPending || updateIngredient.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {selectedIngredient ? "Update" : "Create"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Adjust Stock Sheet */}
      <Sheet open={isAdjustSheetOpen} onOpenChange={setIsAdjustSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Adjust Stock</SheetTitle>
            <SheetDescription>
              {adjustTarget?.name} — current: {adjustTarget?.currentStock} {adjustTarget?.unit}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label>Adjustment ({adjustTarget?.unit})</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="Positive to add, negative to subtract"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                New stock: {Number(adjustTarget?.currentStock ?? 0) + adjustAmount}{" "}
                {adjustTarget?.unit}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Reason (optional)</Label>
              <Textarea
                placeholder="e.g., Restock from supplier, spoilage, audit correction"
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAdjustSheetOpen(false)}
              className="w-full sm:w-auto"
              disabled={adjustStock.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdjustStock}
              className="w-full sm:w-auto"
              disabled={adjustStock.isPending}
            >
              {adjustStock.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Apply
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {viewingIngredient && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                    <Package className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <SheetTitle>{viewingIngredient.name}</SheetTitle>
                    <SheetDescription>{viewingIngredient.sku ?? "—"}</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="py-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Unit</p>
                    <p className="font-medium capitalize">{viewingIngredient.unit}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Stock Available</p>
                    <p
                      className={cn(
                        "font-medium",
                        Number(viewingIngredient.currentStock) <=
                          Number(viewingIngredient.minStock) && "text-destructive",
                      )}
                    >
                      {viewingIngredient.currentStock} {viewingIngredient.unit}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Reorder Level</p>
                    <p className="font-medium">
                      {viewingIngredient.minStock} {viewingIngredient.unit}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Cost per Unit</p>
                    <p className="font-medium">
                      {formatPrice(Number(viewingIngredient.costPerUnit))}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Value</p>
                    <p className="font-medium">
                      {formatPrice(
                        Number(viewingIngredient.currentStock) *
                          Number(viewingIngredient.costPerUnit),
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Last Restocked</p>
                    <p className="font-medium">
                      {viewingIngredient.lastRestocked
                        ? new Date(viewingIngredient.lastRestocked).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                  {viewingIngredient.supplierId && (
                    <div className="space-y-1 col-span-2">
                      <p className="text-sm text-muted-foreground">Supplier ID</p>
                      <p className="font-mono text-sm">{viewingIngredient.supplierId}</p>
                    </div>
                  )}
                </div>
              </div>
              <SheetFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setIsViewSheetOpen(false);
                    openAdjustSheet(viewingIngredient);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adjust Stock
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setIsViewSheetOpen(false);
                    openEditSheet(viewingIngredient);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto"
                  onClick={() => handleDelete(viewingIngredient)}
                  disabled={deleteIngredient.isPending}
                >
                  {deleteIngredient.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
