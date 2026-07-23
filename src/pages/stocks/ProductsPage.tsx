import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useProducts,
  useProductStats,
  useToggleProductStatus,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useAddProductVariation,
  useRemoveProductVariation,
  useLinkProductAddonGroup,
  useUnlinkProductAddonGroup,
} from "@/hooks/api/use-products";
import {
  useCategories,
  useIngredients,
  useAddonGroups,
  useUploadImage,
} from "@/hooks/api/use-stock";
import { useTaxRates } from "@/hooks/api/use-settings";
import { useDiscountCodes } from "@/hooks/api/use-marketing";
import { ErrorState } from "@/components/ui/data-states";
import { useStore } from "@/contexts/StoreContext";
import type { Product, Category, Ingredient, AddOnGroup } from "@/types/products";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Plus,
  Image as ImageIcon,
  Edit,
  Trash2,
  Eye,
  X,
  Upload,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const VISIBILITY_OPTIONS: { id: string; label: string }[] = [
  { id: "pos", label: "Show on POS" },
  { id: "self", label: "Show on Self-Order" },
  { id: "storefront", label: "Show on Storefront" },
  { id: "ubereats", label: "Show on Omnichannels" },
];

interface DraftVariation {
  key: string;
  id?: string;
  name: string;
  sku: string;
  price: number;
  sellingPrice: number;
  stock: number;
}

/** Sentinel for "this recipe line applies to the product, not one variation". */
const ALL_VARIATIONS = "__all__";

interface DraftIngredient {
  key: string;
  id?: string;
  ingredientId: string;
  quantity: number;
  unit: string;
  /**
   * Variation this recipe line applies to. Empty = the product-level default,
   * used only by products with no variation-scoped recipe. Lets a Large portion
   * consume more than a Small one.
   */
  variationId?: string;
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
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

function TableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 border-b last:border-0 flex gap-4 items-center">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-10 rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function ProductsPage() {
  const { currentStore } = useStore();
  const storeId = currentStore?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Data fetching
  const filters = useMemo(
    () => ({
      storeId,
      ...(searchQuery ? { search: searchQuery } : {}),
      ...(categoryFilter !== "all" ? { categoryId: categoryFilter } : {}),
      ...(statusFilter !== "all" ? { status: statusFilter === "active" } : {}),
    }),
    [storeId, searchQuery, categoryFilter, statusFilter],
  );

  const { data: products = [], isLoading, error, refetch } = useProducts(filters);
  const { data: stats } = useProductStats(storeId);
  const { data: categoriesData, isError: categoriesError } = useCategories(storeId ? { storeId, limit: 200 } : undefined);
  const categories: Category[] = (categoriesData?.data as Category[] | undefined) ?? [];
  const { data: ingredientsData, isError: ingredientsError } = useIngredients(storeId ? { storeId, limit: 200 } : undefined);
  const { data: addonGroupsData, isError: addonGroupsError } = useAddonGroups(storeId ? { storeId, limit: 200 } : undefined);
  // Tax + Discount dropdowns are populated from the live /tax-rates and
  // /coupons endpoints so the merchant picks rates / codes they've actually
  // configured (was a hardcoded placeholder list).
  const { data: taxRates = [] } = useTaxRates();
  const { data: discountCodesPage } = useDiscountCodes({ isActive: true, limit: 100 });
  const discountCodes = discountCodesPage?.data ?? [];
  const ingredients: Ingredient[] = ingredientsData?.data ?? [];
  const addonGroups: AddOnGroup[] = (addonGroupsData?.data as AddOnGroup[] | undefined) ?? [];

  // Mutations
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const toggleStatus = useToggleProductStatus();
  const addVariation = useAddProductVariation();
  const removeVariation = useRemoveProductVariation();
  const linkAddonGroup = useLinkProductAddonGroup();
  const unlinkAddonGroup = useUnlinkProductAddonGroup();
  const uploadImage = useUploadImage();

  // Sheet state
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formProductCode, setFormProductCode] = useState("");
  const [formCategoryId, setFormCategoryId] = useState<string>("");
  const [formSupplierId, setFormSupplierId] = useState("");
  const [formImageUrl, setFormImageUrl] = useState<string | null>(null);
  const [formImageFileId, setFormImageFileId] = useState<string | null>(null);
  const [formSku, setFormSku] = useState("");
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formSellingPrice, setFormSellingPrice] = useState<number>(0);
  const [formStock, setFormStock] = useState<number>(0);
  const [formPrepTime, setFormPrepTime] = useState("");
  const [formTaxOption, setFormTaxOption] = useState("");
  const [formDiscountOption, setFormDiscountOption] = useState("");
  const [formVisibility, setFormVisibility] = useState<string[]>(["pos", "storefront"]);
  const [formStatus, setFormStatus] = useState(true);
  const [draftVariations, setDraftVariations] = useState<DraftVariation[]>([]);
  const [draftIngredients, setDraftIngredients] = useState<DraftIngredient[]>([]);
  const [selectedAddonGroupIds, setSelectedAddonGroupIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormProductCode("");
    setFormCategoryId("");
    setFormSupplierId("");
    setFormImageUrl(null);
    setFormImageFileId(null);
    setFormSku("");
    setFormPrice(0);
    setFormSellingPrice(0);
    setFormStock(0);
    setFormPrepTime("");
    setFormTaxOption("");
    setFormDiscountOption("");
    setFormVisibility(["pos", "storefront"]);
    setFormStatus(true);
    setDraftVariations([]);
    setDraftIngredients([]);
    setSelectedAddonGroupIds([]);
  };

  const populateFormFromProduct = (p: Product) => {
    setFormName(p.name);
    setFormDescription(p.description ?? "");
    setFormProductCode(p.productCode ?? "");
    setFormCategoryId(p.categoryId ?? "");
    setFormSupplierId(p.supplierId ?? "");
    setFormImageUrl(p.imageUrl ?? null);
    setFormImageFileId(p.imageFileId ?? null);
    setFormSku(p.sku ?? "");
    setFormPrice(Number(p.price ?? 0));
    setFormSellingPrice(Number(p.sellingPrice ?? 0));
    setFormStock(Number(p.stock ?? 0));
    setFormPrepTime(typeof p.prepTime === "number" ? String(p.prepTime) : (p.prepTime ?? ""));
    setFormTaxOption(p.taxOption ?? "");
    setFormDiscountOption(p.discountOption ?? "");
    setFormVisibility(p.visibility ?? []);
    setFormStatus(p.status);
    setDraftVariations(
      (p.variations ?? []).map((v) => ({
        key: v.id,
        id: v.id,
        name: v.name,
        sku: v.sku ?? "",
        price: Number(v.price ?? 0),
        sellingPrice: Number(v.sellingPrice ?? 0),
        stock: Number(v.stock ?? 0),
      })),
    );
    const pis = p.productIngredients ?? p.ingredients ?? [];
    setDraftIngredients(
      pis.map((pi) => ({
        key: pi.id,
        id: pi.id,
        ingredientId: pi.ingredientId,
        quantity: Number(pi.quantity ?? 0),
        unit: pi.unit ?? pi.ingredient?.unit ?? "",
        variationId: pi.variationId ?? "",
      })),
    );
    setSelectedAddonGroupIds((p.addonGroups ?? []).map((g) => g.id));
  };

  useEffect(() => {
    if (selectedProduct && isFormSheetOpen) {
      populateFormFromProduct(selectedProduct);
    }
  }, [selectedProduct, isFormSheetOpen]);

  const handleAddNew = () => {
    setSelectedProduct(null);
    resetForm();
    setIsFormSheetOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewSheetOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsFormSheetOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const result = await uploadImage.mutateAsync({ file, folder: "products" });
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

  const toggleVisibility = (value: string, checked: boolean) => {
    setFormVisibility((prev) =>
      checked ? Array.from(new Set([...prev, value])) : prev.filter((v) => v !== value),
    );
  };

  const addDraftVariation = () => {
    setDraftVariations((prev) => [
      ...prev,
      { key: `tmp-${Date.now()}`, name: "", sku: "", price: 0, sellingPrice: 0, stock: 0 },
    ]);
  };
  const updateDraftVariation = (index: number, patch: Partial<DraftVariation>) => {
    setDraftVariations((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  };
  const removeDraftVariation = async (index: number) => {
    const v = draftVariations[index];
    if (selectedProduct && v.id) {
      try {
        await removeVariation.mutateAsync({ productId: selectedProduct.id, varId: v.id });
      } catch (err) {
        toast.error((err as Error).message ?? "Failed to remove variation");
        return;
      }
    }
    setDraftVariations((prev) => prev.filter((_, i) => i !== index));
  };

  const addDraftIngredient = () => {
    setDraftIngredients((prev) => [
      ...prev,
      { key: `tmp-${Date.now()}`, ingredientId: "", quantity: 0, unit: "" },
    ]);
  };
  const updateDraftIngredient = (index: number, patch: Partial<DraftIngredient>) => {
    setDraftIngredients((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  };
  // Only variations that already exist server-side can scope a recipe line —
  // a brand-new, unsaved variation has no id yet.
  const savedVariations = draftVariations.filter((v) => !!v.id);

  const removeDraftIngredient = async (index: number) => {
    // Removal is expressed by omitting the row from the replacement
    // `ingredients` array sent on save — no immediate API call.
    setDraftIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAddonGroup = (groupId: string, checked: boolean) => {
    setSelectedAddonGroupIds((prev) =>
      checked ? Array.from(new Set([...prev, groupId])) : prev.filter((id) => id !== groupId),
    );
  };

  const validateForm = (): boolean => {
    if (!storeId) {
      toast.error("Select a store first");
      return false;
    }
    if (!formName.trim()) {
      toast.error("Product name is required");
      return false;
    }
    if (!formCategoryId) {
      toast.error("Category is required");
      return false;
    }
    if (formSellingPrice <= 0) {
      toast.error("Selling price must be greater than 0");
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm() || !storeId) return;
    try {
      await createProduct.mutateAsync({
        name: formName.trim(),
        description: formDescription || undefined,
        productCode: formProductCode || undefined,
        categoryId: formCategoryId,
        supplierId: formSupplierId || undefined,
        sku: formSku || undefined,
        price: formPrice,
        sellingPrice: formSellingPrice,
        stock: formStock,
        prepTime: formPrepTime || undefined,
        taxOption: formTaxOption || undefined,
        discountOption: formDiscountOption || undefined,
        visibility: formVisibility as Product["visibility"],
        status: formStatus,
        imageFileId: formImageFileId ?? undefined,
        storeId,
        variations: draftVariations
          .filter((v) => v.name.trim())
          .map((v) => ({
            name: v.name.trim(),
            sku: v.sku || undefined,
            price: v.price,
            sellingPrice: v.sellingPrice,
            stock: v.stock,
          })),
        ingredients: draftIngredients
          .filter((i) => i.ingredientId)
          .map((i) => ({ ingredientId: i.ingredientId, quantity: i.quantity, unit: i.unit })),
        addonGroupIds: selectedAddonGroupIds,
      });
      toast.success("Product created");
      setIsFormSheetOpen(false);
      resetForm();
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to create product");
    }
  };

  const handleUpdate = async () => {
    if (!selectedProduct || !validateForm()) return;
    try {
      await updateProduct.mutateAsync({
        id: selectedProduct.id,
        data: {
          name: formName.trim(),
          description: formDescription || undefined,
          productCode: formProductCode || undefined,
          categoryId: formCategoryId,
          supplierId: formSupplierId || undefined,
          sku: formSku || undefined,
          price: formPrice,
          sellingPrice: formSellingPrice,
          stock: formStock,
          prepTime: formPrepTime || undefined,
          taxOption: formTaxOption || undefined,
          discountOption: formDiscountOption || undefined,
          visibility: formVisibility as Product["visibility"],
          status: formStatus,
          imageFileId: formImageFileId,
          // Full replacement of the product's recipe.
          ingredients: draftIngredients
            .filter((i) => i.ingredientId)
            .map((i) => ({
              ingredientId: i.ingredientId,
              quantity: i.quantity,
              unit: i.unit,
              variationId: i.variationId || null,
            })),
        },
      });

      // Sync new variations (existing ones edits not yet supported inline; add only)
      for (const v of draftVariations.filter((v) => !v.id && v.name.trim())) {
        await addVariation.mutateAsync({
          productId: selectedProduct.id,
          data: {
            name: v.name.trim(),
            sku: v.sku || undefined,
            price: v.price,
            sellingPrice: v.sellingPrice,
            stock: v.stock,
          },
        });
      }

      // Ingredients are sent with the PATCH above as a full replacement list.

      // Sync addon group changes
      const previousIds = (selectedProduct.addonGroups ?? []).map((g) => g.id);
      for (const id of previousIds.filter((id) => !selectedAddonGroupIds.includes(id))) {
        await unlinkAddonGroup.mutateAsync({ productId: selectedProduct.id, groupId: id });
      }
      for (const id of selectedAddonGroupIds.filter((id) => !previousIds.includes(id))) {
        await linkAddonGroup.mutateAsync({ productId: selectedProduct.id, groupId: id });
      }

      toast.success("Product updated");
      setIsFormSheetOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to update product");
    }
  };

  const handleDelete = (product: Product) => {
    deleteProduct.mutate(product.id, {
      onSuccess: () => {
        toast.success("Product deleted");
        setIsViewSheetOpen(false);
        setIsFormSheetOpen(false);
        setSelectedProduct(null);
      },
      onError: (e: Error) => toast.error(e.message ?? "Failed to delete"),
    });
  };

  const handleToggleStatus = (product: Product) => {
    toggleStatus.mutate(
      { id: product.id, status: !product.status },
      { onError: () => toast.error("Failed to update status") },
    );
  };

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your menu items and inventory</p>
        </div>
        <ErrorState onRetry={refetch} description={error.message} />
      </div>
    );
  }

  const isFormPending =
    createProduct.isPending ||
    updateProduct.isPending ||
    addVariation.isPending ||
    linkAddonGroup.isPending ||
    unlinkAddonGroup.isPending;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your menu items and inventory</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Products</p>
              <p className="text-xl sm:text-2xl font-semibold">{stats?.total ?? products.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
              <p className="text-xl sm:text-2xl font-semibold text-green-600">
                {stats?.active ?? products.filter((p) => p.status).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-xl sm:text-2xl font-semibold text-destructive">
                {stats?.outOfStock ?? products.filter((p) => Number(p.stock) === 0).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Categories</p>
              <p className="text-xl sm:text-2xl font-semibold">
                {(stats as { categoryCount?: number } | undefined)?.categoryCount ?? categories.length}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-6 w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product.id}
                      className="group cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewProduct(product)}
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted overflow-hidden">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1 max-w-[260px]">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {product.categoryId
                            ? categoryNameById.get(product.categoryId) ?? "—"
                            : "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatPrice(Number(product.sellingPrice ?? 0))}
                      </TableCell>
                      <TableCell>
                        <span className={cn(Number(product.stock) === 0 && "text-destructive")}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={product.status}
                            onCheckedChange={() => handleToggleStatus(product)}
                            disabled={toggleStatus.isPending}
                          />
                          <span
                            className={cn(
                              "text-sm",
                              product.status ? "text-green-600" : "text-muted-foreground",
                            )}
                          >
                            {product.status ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewProduct(product)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(product)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {products.length === 0 && (
                <div className="p-12 text-center text-sm text-muted-foreground">
                  No products yet — click "Add Product" to create one.
                </div>
              )}
            </div>

            {/* Mobile: stacked card list (the desktop table is hidden below sm). */}
            <div className="sm:hidden divide-y divide-border">
              {products.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No products yet — tap "Add Product" to create one.
                </div>
              ) : (
                products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleViewProduct(product)}
                    className="w-full text-left p-4 flex items-center gap-3 active:bg-muted/50 transition-colors"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {product.categoryId
                          ? (categoryNameById.get(product.categoryId) ?? "—")
                          : "—"}
                        {" · "}
                        {formatPrice(Number(product.sellingPrice ?? 0))}
                      </p>
                      <p
                        className={cn(
                          "text-xs",
                          Number(product.stock) === 0
                            ? "text-destructive"
                            : "text-muted-foreground",
                        )}
                      >
                        Stock: {product.stock}
                        {" · "}
                        <span
                          className={
                            product.status ? "text-green-600" : "text-muted-foreground"
                          }
                        >
                          {product.status ? "Active" : "Inactive"}
                        </span>
                      </p>
                    </div>
                    <Switch
                      checked={product.status}
                      onClick={(e) => e.stopPropagation()}
                      onCheckedChange={() => handleToggleStatus(product)}
                      disabled={toggleStatus.isPending}
                    />
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Product Sheet */}
      <Sheet
        open={isFormSheetOpen}
        onOpenChange={(open) => {
          setIsFormSheetOpen(open);
          if (!open) {
            setSelectedProduct(null);
            resetForm();
          }
        }}
      >
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedProduct ? "Edit Product" : "Add New Product"}</SheetTitle>
            <SheetDescription>Create a menu item with full details</SheetDescription>
          </SheetHeader>
          <Tabs defaultValue="details" className="mt-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="variations">Variants</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input
                  placeholder="e.g., Jollof Rice"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe your product..."
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Product Code</Label>
                <Input
                  placeholder="e.g., PRD-001"
                  value={formProductCode}
                  onChange={(e) => setFormProductCode(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formCategoryId} onValueChange={setFormCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {categoriesError && (
                  <p className="text-xs text-destructive">
                    Couldn't load categories. Refresh and try again.
                  </p>
                )}
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
                    <img src={formImageUrl} alt="Product" className="w-full h-48 object-cover" />
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
              <div className="space-y-2">
                <Label>Supplier ID (optional)</Label>
                <Input
                  placeholder="Supplier reference"
                  value={formSupplierId}
                  onChange={(e) => setFormSupplierId(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input
                  placeholder="e.g., JOL-001"
                  value={formSku}
                  onChange={(e) => setFormSku(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cost Price (₦)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Selling Price (₦)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formSellingPrice}
                    onChange={(e) => setFormSellingPrice(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input
                  type="number"
                  min={0}
                  value={formStock}
                  onChange={(e) => setFormStock(Number(e.target.value))}
                />
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label>Ingredients (Link to Stock)</Label>
                  <Button variant="outline" size="sm" onClick={addDraftIngredient}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                {ingredientsError && (
                  <p className="text-xs text-destructive">
                    Couldn't load ingredients. Refresh and try again.
                  </p>
                )}
                {draftIngredients.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No ingredients linked.</p>
                ) : (
                  <div className="space-y-2">
                    {draftIngredients.map((ing, index) => (
                      <div key={ing.key} className="flex items-center gap-2 p-2 border rounded-lg">
                        <Select
                          value={ing.ingredientId}
                          onValueChange={(val) => {
                            const matched = ingredients.find((i) => i.id === val);
                            updateDraftIngredient(index, {
                              ingredientId: val,
                              unit: ing.unit || matched?.unit || "",
                            });
                          }}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select ingredient" />
                          </SelectTrigger>
                          <SelectContent>
                            {ingredients.map((i) => (
                              <SelectItem key={i.id} value={i.id}>
                                {i.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="Qty"
                          value={ing.quantity}
                          onChange={(e) =>
                            updateDraftIngredient(index, { quantity: Number(e.target.value) })
                          }
                          className="w-24"
                        />
                        <Input
                          placeholder="unit"
                          value={ing.unit}
                          onChange={(e) => updateDraftIngredient(index, { unit: e.target.value })}
                          className="w-20"
                        />
                        {savedVariations.length > 0 && (
                          <Select
                            value={ing.variationId || ALL_VARIATIONS}
                            onValueChange={(val) =>
                              updateDraftIngredient(index, {
                                variationId: val === ALL_VARIATIONS ? "" : val,
                              })
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={ALL_VARIATIONS}>All variants</SelectItem>
                              {savedVariations.map((v) => (
                                <SelectItem key={v.id} value={v.id!}>
                                  {v.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={() => removeDraftIngredient(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="variations" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Variations</Label>
                  <Button variant="outline" size="sm" onClick={addDraftVariation}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Variation
                  </Button>
                </div>
                {draftVariations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No variations.</p>
                ) : (
                  draftVariations.map((v, index) => (
                    <div key={v.key} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Variation {index + 1}</Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeDraftVariation(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Name</Label>
                        <Input
                          placeholder="e.g., Small"
                          value={v.name}
                          onChange={(e) => updateDraftVariation(index, { name: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">SKU</Label>
                          <Input
                            value={v.sku}
                            onChange={(e) => updateDraftVariation(index, { sku: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Price (₦)</Label>
                          <Input
                            type="number"
                            min={0}
                            value={v.price}
                            onChange={(e) =>
                              updateDraftVariation(index, { price: Number(e.target.value) })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Selling (₦)</Label>
                          <Input
                            type="number"
                            min={0}
                            value={v.sellingPrice}
                            onChange={(e) =>
                              updateDraftVariation(index, { sellingPrice: Number(e.target.value) })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Stock</Label>
                        <Input
                          type="number"
                          min={0}
                          value={v.stock}
                          onChange={(e) =>
                            updateDraftVariation(index, { stock: Number(e.target.value) })
                          }
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-3 border-t pt-4">
                <Label>Add-on Groups</Label>
                {addonGroupsError && (
                  <p className="text-xs text-destructive">
                    Couldn't load add-on groups. Refresh and try again.
                  </p>
                )}
                {addonGroups.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No add-on groups exist yet. Create them in the Add-ons section.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {addonGroups.map((g) => (
                      <div key={g.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`addon-${g.id}`}
                          checked={selectedAddonGroupIds.includes(g.id)}
                          onCheckedChange={(checked) =>
                            toggleAddonGroup(g.id, checked === true)
                          }
                        />
                        <label htmlFor={`addon-${g.id}`} className="text-sm">
                          {g.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Prep Time (minutes)</Label>
                <Input
                  placeholder="e.g., 25"
                  value={formPrepTime}
                  onChange={(e) => setFormPrepTime(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tax Option</Label>
                  <Select value={formTaxOption} onValueChange={setFormTaxOption}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tax rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No tax</SelectItem>
                      {taxRates.map((tr) => (
                        <SelectItem key={tr.id} value={tr.id}>
                          {tr.name} ({tr.ratePercent}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {taxRates.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No tax rates yet — add one in Settings → Tax Rates.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Discount Option</Label>
                  <Select value={formDiscountOption} onValueChange={setFormDiscountOption}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select discount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {discountCodes.map((dc) => (
                        <SelectItem key={dc.id} value={dc.id}>
                          {dc.code}
                          {dc.type === "percentage" ? ` (${dc.value}%)` : ` (₦${dc.value})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {discountCodes.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No active discount codes — create one in Marketing → Discount Codes.
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <Label>Visibility</Label>
                <div className="space-y-2">
                  {VISIBILITY_OPTIONS.map((opt) => (
                    <div key={opt.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`vis-${opt.id}`}
                        checked={formVisibility.includes(opt.id)}
                        onCheckedChange={(checked) => toggleVisibility(opt.id, checked === true)}
                      />
                      <label htmlFor={`vis-${opt.id}`} className="text-sm">
                        {opt.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <Label>Publish Status</Label>
                <Select
                  value={formStatus ? "active" : "inactive"}
                  onValueChange={(v) => setFormStatus(v === "active")}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
          <SheetFooter className="flex-col sm:flex-row gap-2 mt-6">
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
              onClick={selectedProduct ? handleUpdate : handleCreate}
              disabled={isFormPending}
            >
              {isFormPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedProduct ? "Update Product" : "Create Product"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selectedProduct && (
            <>
              <SheetHeader>
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted overflow-hidden">
                    {selectedProduct.imageUrl ? (
                      <img
                        src={selectedProduct.imageUrl}
                        alt={selectedProduct.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <SheetTitle>{selectedProduct.name}</SheetTitle>
                    <SheetDescription>{selectedProduct.description}</SheetDescription>
                    <div className="flex items-center gap-2 mt-2">
                      {selectedProduct.categoryId && (
                        <Badge variant="secondary">
                          {categoryNameById.get(selectedProduct.categoryId) ?? "—"}
                        </Badge>
                      )}
                      <Badge variant={selectedProduct.status ? "default" : "secondary"}>
                        {selectedProduct.status ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Product Code</p>
                    <p className="font-medium">{selectedProduct.productCode ?? "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">SKU</p>
                    <p className="font-medium">{selectedProduct.sku ?? "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Cost Price</p>
                    <p className="font-medium">{formatPrice(Number(selectedProduct.price ?? 0))}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Selling Price</p>
                    <p className="font-medium text-lg">
                      {formatPrice(Number(selectedProduct.sellingPrice ?? 0))}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Stock</p>
                    <p
                      className={cn(
                        "font-medium",
                        Number(selectedProduct.stock) === 0 && "text-destructive",
                      )}
                    >
                      {selectedProduct.stock}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Prep Time</p>
                    <p className="font-medium">{selectedProduct.prepTime ?? "—"}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-3">Ingredients</p>
                  {(selectedProduct.productIngredients ?? selectedProduct.ingredients ?? []).length > 0 ? (
                    <div className="space-y-2">
                      {(selectedProduct.productIngredients ?? selectedProduct.ingredients ?? []).map((pi) => (
                        <div
                          key={pi.id}
                          className="flex items-center justify-between p-2 bg-muted rounded-lg"
                        >
                          <span>{pi.ingredient?.name ?? pi.name ?? pi.ingredientId}</span>
                          <span className="text-muted-foreground">
                            {pi.quantity} {pi.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No ingredients linked</p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-3">Variations</p>
                  {(selectedProduct.variations ?? []).length > 0 ? (
                    <div className="space-y-2">
                      {(selectedProduct.variations ?? []).map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{v.name}</p>
                            <p className="text-xs text-muted-foreground">{v.sku}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatPrice(Number(v.sellingPrice ?? 0))}</p>
                            <p className="text-xs text-muted-foreground line-through">
                              {formatPrice(Number(v.price ?? 0))}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No variations</p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-3">Add-on Groups</p>
                  {(selectedProduct.addonGroups ?? []).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {(selectedProduct.addonGroups ?? []).map((g) => (
                        <Badge key={g.id} variant="secondary">
                          {g.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No add-ons attached</p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-3">Visibility</p>
                  <div className="flex flex-wrap gap-2">
                    {(selectedProduct.visibility ?? []).map((v) => (
                      <Badge key={v} variant="outline" className="capitalize">
                        {v}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <SheetFooter className="flex-col sm:flex-row gap-2 mt-6">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setIsViewSheetOpen(false);
                    handleEditProduct(selectedProduct);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto"
                  onClick={() => handleDelete(selectedProduct)}
                  disabled={deleteProduct.isPending}
                >
                  {deleteProduct.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
