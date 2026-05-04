import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCombos,
  useComboStats,
  useCreateCombo,
  useUpdateCombo,
  useDeleteCombo,
  useToggleComboStatus,
  useAddComboItem,
  useDeleteComboItem,
  useUpdateComboItem,
  useUploadImage,
} from "@/hooks/api/use-stock";
import { useProducts } from "@/hooks/api/use-products";
import { useStore } from "@/contexts/StoreContext";
import type { Combo, ComboItem, Product } from "@/types/products";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Layers,
  Tag,
  Search,
  Eye,
  X,
  Loader2,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface DraftItem {
  key: string;
  productId: string;
  quantity: number;
  existingItemId?: string;
}

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

function CombosSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Skeleton className="h-14 w-14 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
            <div className="mt-4 border-t pt-4">
              <Skeleton className="h-4 w-16 mb-2" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

function calculateSavings(original: number, discounted: number) {
  if (!original || original <= 0) return 0;
  return Math.round(((original - discounted) / original) * 100);
}

export default function CombosPage() {
  const { currentStore } = useStore();
  const storeId = currentStore?.id;

  const { data: combosData, isLoading } = useCombos(storeId ? { storeId } : undefined);
  const { data: stats } = useComboStats(storeId);
  const { data: productsData } = useProducts(storeId ? { storeId, limit: 200 } : undefined);
  const combos: Combo[] = combosData?.data ?? [];
  const products: Product[] = productsData?.data ?? [];

  const createCombo = useCreateCombo();
  const updateCombo = useUpdateCombo();
  const deleteCombo = useDeleteCombo();
  const toggleComboStatus = useToggleComboStatus();
  const addComboItem = useAddComboItem();
  const updateComboItem = useUpdateComboItem();
  const deleteComboItem = useDeleteComboItem();
  const uploadImage = useUploadImage();

  const [searchQuery, setSearchQuery] = useState("");
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(0);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formImageUrl, setFormImageUrl] = useState<string | null>(null);
  const [formImageFileId, setFormImageFileId] = useState<string | null>(null);
  const [draftItems, setDraftItems] = useState<DraftItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredCombos = combos.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormPrice(0);
    setFormOriginalPrice(0);
    setFormIsActive(true);
    setFormImageUrl(null);
    setFormImageFileId(null);
    setDraftItems([]);
  };

  const populateFormFromCombo = (combo: Combo) => {
    setFormName(combo.name);
    setFormDescription(combo.description ?? "");
    setFormPrice(Number(combo.price));
    setFormOriginalPrice(Number(combo.originalPrice));
    setFormIsActive(combo.isActive);
    setFormImageUrl(combo.imageUrl ?? null);
    setFormImageFileId((combo as Combo & { imageFileId?: string | null }).imageFileId ?? null);
    setDraftItems(
      (combo.items ?? []).map((item) => ({
        key: item.id,
        productId: item.productId,
        quantity: item.quantity,
        existingItemId: item.id,
      })),
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const result = await uploadImage.mutateAsync({ file, folder: "combos" });
      setFormImageUrl(result.url);
      setFormImageFileId(result.id);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error((err as Error).message ?? "Upload failed");
    }
  };

  const clearFormImage = () => {
    setFormImageUrl(null);
    setFormImageFileId(null);
  };

  useEffect(() => {
    if (selectedCombo && isFormSheetOpen) {
      populateFormFromCombo(selectedCombo);
    }
  }, [selectedCombo, isFormSheetOpen]);

  const handleViewCombo = (combo: Combo) => {
    setSelectedCombo(combo);
    setIsViewSheetOpen(true);
  };

  const handleEditCombo = (combo: Combo) => {
    setSelectedCombo(combo);
    setIsFormSheetOpen(true);
  };

  const handleAddNewCombo = () => {
    setSelectedCombo(null);
    resetForm();
    setIsFormSheetOpen(true);
  };

  const handleAddDraftItem = () => {
    setDraftItems([
      ...draftItems,
      { key: `temp-${Date.now()}`, productId: "", quantity: 1 },
    ]);
  };

  const handleRemoveDraftItem = (index: number) => {
    setDraftItems(draftItems.filter((_, i) => i !== index));
  };

  const handleDraftItemChange = (index: number, patch: Partial<DraftItem>) => {
    setDraftItems(draftItems.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  };

  const handleToggleActive = (combo: Combo) => {
    toggleComboStatus.mutate(
      { id: combo.id, isActive: !combo.isActive },
      { onError: () => toast.error("Failed to toggle status") },
    );
  };

  const handleDelete = (combo: Combo) => {
    deleteCombo.mutate(combo.id, {
      onSuccess: () => {
        toast.success("Combo deleted");
        setIsViewSheetOpen(false);
        setIsFormSheetOpen(false);
      },
      onError: (e: Error) => toast.error(e.message ?? "Failed to delete"),
    });
  };

  const validateForm = (): boolean => {
    if (!storeId) {
      toast.error("Select a store first");
      return false;
    }
    if (!formName.trim()) {
      toast.error("Combo name is required");
      return false;
    }
    if (formPrice <= 0) {
      toast.error("Combo price must be greater than 0");
      return false;
    }
    const validItems = draftItems.filter((d) => d.productId);
    if (validItems.length === 0) {
      toast.error("Add at least one product");
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm() || !storeId) return;
    const validItems = draftItems.filter((d) => d.productId);
    try {
      await createCombo.mutateAsync({
        name: formName.trim(),
        description: formDescription || undefined,
        price: formPrice,
        originalPrice: formOriginalPrice,
        isActive: formIsActive,
        imageFileId: formImageFileId ?? undefined,
        storeId,
        products: validItems.map((d) => ({ productId: d.productId, quantity: d.quantity })),
      } as Parameters<typeof createCombo.mutateAsync>[0]);
      toast.success("Combo created");
      setIsFormSheetOpen(false);
      resetForm();
    } catch (e) {
      toast.error((e as Error).message ?? "Failed to create combo");
    }
  };

  const handleUpdate = async () => {
    if (!selectedCombo || !validateForm()) return;
    try {
      await updateCombo.mutateAsync({
        id: selectedCombo.id,
        data: {
          name: formName.trim(),
          description: formDescription || undefined,
          price: formPrice,
          originalPrice: formOriginalPrice,
          isActive: formIsActive,
          imageFileId: formImageFileId,
        } as Partial<Combo> & { imageFileId?: string | null },
      });

      // Sync items: remove deleted, update changed quantity, add new
      const previousItems = selectedCombo.items ?? [];
      const previousById = new Map(previousItems.map((i) => [i.id, i]));
      const draftExistingIds = new Set(
        draftItems.map((d) => d.existingItemId).filter(Boolean) as string[],
      );

      // Remove items that were dropped
      for (const prev of previousItems) {
        if (!draftExistingIds.has(prev.id)) {
          await deleteComboItem.mutateAsync({ comboId: selectedCombo.id, itemId: prev.id });
        }
      }

      // Update changed quantities and add new items
      for (const draft of draftItems.filter((d) => d.productId)) {
        if (draft.existingItemId) {
          const prev = previousById.get(draft.existingItemId);
          if (prev && prev.quantity !== draft.quantity) {
            await updateComboItem.mutateAsync({
              comboId: selectedCombo.id,
              itemId: draft.existingItemId,
              data: { quantity: draft.quantity },
            });
          }
        } else {
          await addComboItem.mutateAsync({
            comboId: selectedCombo.id,
            data: { productId: draft.productId, quantity: draft.quantity },
          });
        }
      }

      toast.success("Combo updated");
      setIsFormSheetOpen(false);
      setSelectedCombo(null);
    } catch (e) {
      toast.error((e as Error).message ?? "Failed to update combo");
    }
  };

  const isFormPending =
    createCombo.isPending ||
    updateCombo.isPending ||
    addComboItem.isPending ||
    updateComboItem.isPending ||
    deleteComboItem.isPending;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Combo Meals</h1>
          <p className="text-sm text-muted-foreground">
            Create meal bundles with special pricing
          </p>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={handleAddNewCombo}>
          <Plus className="mr-2 h-4 w-4" />
          Create Combo
        </Button>
      </div>

      {/* Stats */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Combos</p>
              <p className="text-xl sm:text-2xl font-semibold">{stats?.total ?? combos.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
              <p className="text-xl sm:text-2xl font-semibold text-green-600">
                {stats?.active ?? combos.filter((c) => c.isActive).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Sales</p>
              <p className="text-xl sm:text-2xl font-semibold">
                {stats?.totalSales ?? combos.reduce((acc, c) => acc + (c.sales ?? 0), 0)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Revenue</p>
              <p className="text-xl sm:text-2xl font-semibold truncate">
                {formatPrice(stats?.revenue ?? 0)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search combos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Combos Grid */}
      {isLoading ? (
        <CombosSkeleton />
      ) : (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {filteredCombos.map((combo) => (
            <Card
              key={combo.id}
              className="transition-all hover:shadow-md cursor-pointer"
              onClick={() => handleViewCombo(combo)}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                    <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 overflow-hidden">
                      {combo.imageUrl ? (
                        <img src={combo.imageUrl} alt={combo.name} className="h-full w-full object-cover" />
                      ) : (
                        <Layers className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-sm sm:text-base">{combo.name}</h3>
                        {Number(combo.originalPrice) > Number(combo.price) && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs"
                          >
                            <Tag className="mr-1 h-3 w-3" />
                            {calculateSavings(Number(combo.originalPrice), Number(combo.price))}% off
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{combo.description}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCombo(combo);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCombo(combo);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(combo);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 border-t pt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">INCLUDES</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {(combo.items ?? []).map((item) => (
                      <Badge key={item.id} variant="secondary" className="text-xs">
                        {item.quantity}x {item.product?.name ?? "Product"}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t mt-4 pt-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg sm:text-xl font-bold">
                        {formatPrice(Number(combo.price))}
                      </span>
                      {Number(combo.originalPrice) > Number(combo.price) && (
                        <span className="text-xs sm:text-sm text-muted-foreground line-through">
                          {formatPrice(Number(combo.originalPrice))}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{combo.sales ?? 0} sold</p>
                  </div>
                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
                      {combo.isActive ? "Active" : "Inactive"}
                    </span>
                    <Switch
                      checked={combo.isActive}
                      onCheckedChange={() => handleToggleActive(combo)}
                      disabled={toggleComboStatus.isPending}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Combo Sheet */}
      <Sheet
        open={isFormSheetOpen}
        onOpenChange={(open) => {
          setIsFormSheetOpen(open);
          if (!open) {
            setSelectedCombo(null);
            resetForm();
          }
        }}
      >
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedCombo ? "Edit Combo" : "Create Combo Meal"}</SheetTitle>
            <SheetDescription>Bundle products together with a special price</SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Item Details</h3>
              <div className="space-y-2">
                <Label htmlFor="combo-name">Name</Label>
                <Input
                  id="combo-name"
                  placeholder="e.g., Family Feast"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="combo-price">Combo Price (₦)</Label>
                  <Input
                    id="combo-price"
                    type="number"
                    min={0}
                    placeholder="0"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="combo-original">Original Price (₦)</Label>
                  <Input
                    id="combo-original"
                    type="number"
                    min={0}
                    placeholder="0"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="combo-desc">Description</Label>
                <Textarea
                  id="combo-desc"
                  placeholder="e.g., Perfect for 4 people"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {formImageUrl ? (
                  <div className="relative border rounded-lg overflow-hidden">
                    <img src={formImageUrl} alt="Combo" className="w-full h-40 object-cover" />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={clearFormImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadImage.isPending}
                    className="w-full border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 disabled:opacity-50"
                  >
                    {uploadImage.isPending ? (
                      <Loader2 className="h-8 w-8 mx-auto text-muted-foreground mb-2 animate-spin" />
                    ) : (
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    )}
                    <p className="text-sm text-muted-foreground">
                      {uploadImage.isPending ? "Uploading..." : "Click to upload"}
                    </p>
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Combo Products</h3>
                <Button variant="outline" size="sm" onClick={handleAddDraftItem}>
                  <Plus className="mr-1 h-4 w-4" />
                  Add Product
                </Button>
              </div>
              {draftItems.length === 0 ? (
                <div className="p-4 border rounded-lg text-center text-sm text-muted-foreground">
                  No products added yet
                </div>
              ) : (
                <div className="space-y-3">
                  {draftItems.map((item, index) => (
                    <div key={item.key} className="p-3 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Product {index + 1}</Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleRemoveDraftItem(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Select
                        value={item.productId}
                        onValueChange={(val) => handleDraftItemChange(index, { productId: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} — {formatPrice(Number(p.sellingPrice ?? p.price))}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="space-y-1">
                        <Label className="text-xs">Quantity</Label>
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            handleDraftItemChange(index, { quantity: Math.max(1, Number(e.target.value)) })
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Publish</h3>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formIsActive ? "active" : "inactive"}
                  onValueChange={(v) => setFormIsActive(v === "active")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsFormSheetOpen(false)}
              className="w-full sm:w-auto"
              disabled={isFormPending}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={selectedCombo ? handleUpdate : handleCreate}
              disabled={isFormPending}
            >
              {isFormPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedCombo ? "Update Combo" : "Create Combo"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View Combo Details Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedCombo?.name}</SheetTitle>
            <SheetDescription>{selectedCombo?.description}</SheetDescription>
          </SheetHeader>
          {selectedCombo && (
            <div className="grid gap-6 py-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Combo Price</p>
                    <p className="text-lg font-bold">{formatPrice(Number(selectedCombo.price))}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Original Price</p>
                    <p className="text-lg font-medium line-through text-muted-foreground">
                      {formatPrice(Number(selectedCombo.originalPrice))}
                    </p>
                  </div>
                </div>
                {Number(selectedCombo.originalPrice) > Number(selectedCombo.price) && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-xs text-green-600 dark:text-green-400">Customer Saves</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatPrice(Number(selectedCombo.originalPrice) - Number(selectedCombo.price))} (
                      {calculateSavings(Number(selectedCombo.originalPrice), Number(selectedCombo.price))}% off)
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Products Included</h3>
                <div className="space-y-2">
                  {(selectedCombo.items ?? []).map((item: ComboItem) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{item.product?.name ?? "Product"}</p>
                        <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">
                        {formatPrice(Number(item.product?.sellingPrice ?? item.product?.price ?? 0) * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Total Sales</p>
                    <p className="text-xl font-semibold">{selectedCombo.sales ?? 0}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="text-xl font-semibold">
                      {formatPrice((selectedCombo.sales ?? 0) * Number(selectedCombo.price))}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Status</span>
                <Badge
                  className={
                    selectedCombo.isActive
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : ""
                  }
                >
                  {selectedCombo.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          )}
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsViewSheetOpen(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            {selectedCombo && (
              <Button
                onClick={() => {
                  setIsViewSheetOpen(false);
                  handleEditCombo(selectedCombo);
                }}
                className="w-full sm:w-auto"
              >
                Edit Combo
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
