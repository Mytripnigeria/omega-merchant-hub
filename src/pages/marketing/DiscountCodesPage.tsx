import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
  Edit,
  Filter,
  Plus,
  Search,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import {
  useCreateDiscountCode,
  useDeleteDiscountCode,
  useDiscountCodes,
  useUpdateDiscountCode,
} from "@/hooks/api/use-marketing";
import { useProducts, useCategories } from "@/hooks/api/use-products";
import { useStore } from "@/contexts/StoreContext";
import type {
  CouponApplicableTo,
  CouponMethod,
  CouponType,
  CreateDiscountCodeRequest,
  DiscountCode,
} from "@/types/marketing";

type SheetMode = "view" | "create" | "edit";

interface DiscountFormState {
  code: string;
  description: string;
  type: CouponType;
  method: CouponMethod;
  value: string;
  minOrderAmount: string;
  maxDiscount: string;
  usageLimit: string;
  perCustomerLimit: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  applicableTo: CouponApplicableTo;
  productIds: string[];
  categoryIds: string[];
}

const blankForm: DiscountFormState = {
  code: "",
  description: "",
  type: "percentage",
  method: "code",
  value: "",
  minOrderAmount: "",
  maxDiscount: "",
  usageLimit: "",
  perCustomerLimit: "",
  startsAt: "",
  endsAt: "",
  isActive: true,
  applicableTo: "all",
  productIds: [],
  categoryIds: [],
};

const toForm = (d: DiscountCode): DiscountFormState => ({
  code: d.code,
  description: d.description ?? "",
  type: d.type,
  method: d.method ?? "code",
  value: String(d.value),
  minOrderAmount: d.minOrderAmount != null ? String(d.minOrderAmount) : "",
  maxDiscount: d.maxDiscount != null ? String(d.maxDiscount) : "",
  usageLimit: d.usageLimit != null ? String(d.usageLimit) : "",
  perCustomerLimit:
    d.perCustomerLimit != null ? String(d.perCustomerLimit) : "",
  startsAt: d.startsAt ? d.startsAt.slice(0, 10) : "",
  endsAt: d.endsAt ? d.endsAt.slice(0, 10) : "",
  isActive: d.isActive,
  applicableTo: d.applicableTo,
  productIds: d.productIds ?? [],
  categoryIds: d.categoryIds ?? [],
});

const formToPayload = (f: DiscountFormState): CreateDiscountCodeRequest => ({
  code: f.code.trim().toUpperCase(),
  description: f.description.trim() || undefined,
  type: f.type,
  method: f.method,
  value: Number(f.value),
  minOrderAmount: f.minOrderAmount ? Number(f.minOrderAmount) : undefined,
  maxDiscount: f.maxDiscount ? Number(f.maxDiscount) : undefined,
  usageLimit: f.usageLimit ? Number(f.usageLimit) : undefined,
  perCustomerLimit: f.perCustomerLimit
    ? Number(f.perCustomerLimit)
    : undefined,
  startsAt: f.startsAt
    ? new Date(`${f.startsAt}T00:00:00`).toISOString()
    : undefined,
  endsAt: f.endsAt
    ? new Date(`${f.endsAt}T23:59:59`).toISOString()
    : undefined,
  isActive: f.isActive,
  applicableTo: f.applicableTo,
  productIds: f.applicableTo === "specific_products" ? f.productIds : [],
  categoryIds:
    f.applicableTo === "specific_categories" ? f.categoryIds : [],
});

export default function DiscountCodesPage() {
  const { currentStore } = useStore();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">(
    "all",
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [sheetMode, setSheetMode] = useState<SheetMode>("create");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selected, setSelected] = useState<DiscountCode | null>(null);
  const [form, setForm] = useState<DiscountFormState>(blankForm);

  const filters = useMemo(
    () => ({
      search: search || undefined,
      isActive:
        activeFilter === "all" ? undefined : activeFilter === "active",
      page,
      limit: pageSize,
    }),
    [search, activeFilter, page, pageSize],
  );

  const codesQuery = useDiscountCodes(filters);
  const productsQuery = useProducts({ storeId: currentStore?.id });
  const categoriesQuery = useCategories(currentStore?.id);
  const createMutation = useCreateDiscountCode();
  const updateMutation = useUpdateDiscountCode();
  const deleteMutation = useDeleteDiscountCode();

  const codes = codesQuery.data?.data ?? [];
  const total = codesQuery.data?.total ?? 0;
  const totalPages = codesQuery.data?.totalPages ?? 1;
  const startIndex = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, total);

  const products = (productsQuery.data ?? []) as Array<{ id: string; name: string }>;
  const categories = (categoriesQuery.data ?? []) as Array<{ id: string; name: string }>;

  const stats = useMemo(() => {
    const active = codes.filter((c) => c.isActive).length;
    const totalUses = codes.reduce((sum, c) => sum + c.usageCount, 0);
    return { active, totalUses };
  }, [codes]);

  const openCreate = () => {
    setSelected(null);
    setForm(blankForm);
    setSheetMode("create");
    setSheetOpen(true);
  };

  const openView = (d: DiscountCode) => {
    setSelected(d);
    setForm(toForm(d));
    setSheetMode("view");
    setSheetOpen(true);
  };

  const openEdit = (d: DiscountCode) => {
    setSelected(d);
    setForm(toForm(d));
    setSheetMode("edit");
    setSheetOpen(true);
  };

  const closeSheet = () => setSheetOpen(false);

  const handleSubmit = async () => {
    if (!form.code.trim()) {
      toast.error("Code is required");
      return;
    }
    if (!form.value) {
      toast.error("Value is required");
      return;
    }
    if (
      form.applicableTo === "specific_products" &&
      form.productIds.length === 0
    ) {
      toast.error("Pick at least one product");
      return;
    }
    if (
      form.applicableTo === "specific_categories" &&
      form.categoryIds.length === 0
    ) {
      toast.error("Pick at least one category");
      return;
    }

    try {
      if (sheetMode === "create") {
        await createMutation.mutateAsync(formToPayload(form));
        toast.success("Discount code created");
      } else if (sheetMode === "edit" && selected) {
        await updateMutation.mutateAsync({
          id: selected.id,
          data: formToPayload(form),
        });
        toast.success("Discount code updated");
      }
      closeSheet();
    } catch (e) {
      toast.error((e as Error).message ?? "Save failed");
    }
  };

  const handleDelete = async (d: DiscountCode) => {
    if (!confirm(`Delete code ${d.code}?`)) return;
    try {
      await deleteMutation.mutateAsync(d.id);
      toast.success("Code deleted");
      if (selected?.id === d.id) closeSheet();
    } catch (e) {
      toast.error((e as Error).message ?? "Delete failed");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Discount Codes
          </h1>
          <p className="text-sm text-muted-foreground">
            Create and manage promo codes customers can apply at checkout.
          </p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4 mr-2" /> New Code
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total codes</p>
              <p className="text-2xl font-semibold">{total}</p>
            </div>
            <Tag className="h-6 w-6 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Active here</p>
              <p className="text-2xl font-semibold text-green-600">
                {stats.active}
              </p>
            </div>
            <Tag className="h-6 w-6 text-green-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Uses (page)</p>
              <p className="text-2xl font-semibold">{stats.totalUses}</p>
            </div>
            <Users className="h-6 w-6 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by code or description…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearch(searchInput.trim());
                setPage(1);
              }
            }}
            onBlur={() => {
              setSearch(searchInput.trim());
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={activeFilter}
          onValueChange={(v) => {
            setActiveFilter(v as typeof activeFilter);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[140px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {codesQuery.isLoading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : codes.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No discount codes yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                      Code
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                      Applies to
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                      Usage
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-right p-4 text-xs font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer"
                      onClick={() => openView(c)}
                    >
                      <td className="p-4">
                        <p className="font-mono font-semibold">{c.code}</p>
                        {c.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {c.description}
                          </p>
                        )}
                      </td>
                      <td className="p-4 text-sm">
                        {c.type === "percentage"
                          ? `${c.value}%`
                          : formatPrice(c.value)}
                      </td>
                      <td className="p-4 text-sm">
                        {c.applicableTo === "all"
                          ? "All products"
                          : c.applicableTo === "specific_products"
                            ? `${c.productIds.length} products`
                            : `${c.categoryIds.length} categories`}
                      </td>
                      <td className="p-4 text-sm">
                        {c.usageCount}
                        {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                      </td>
                      <td className="p-4">
                        <Badge
                          className={cn(
                            "text-xs",
                            c.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600",
                          )}
                        >
                          {c.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(c);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(c);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <TablePagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        startIndex={startIndex}
        endIndex={endIndex}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {sheetMode === "create"
                ? "New discount code"
                : sheetMode === "edit"
                  ? "Edit discount code"
                  : selected?.code}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === "view"
                ? selected?.description ?? "Discount details"
                : "Discounts apply at checkout when the customer enters this code."}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={form.code}
                  onChange={(e) =>
                    setForm({ ...form, code: e.target.value.toUpperCase() })
                  }
                  disabled={sheetMode === "view"}
                  placeholder="WELCOME20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    setForm({ ...form, type: v as CouponType })
                  }
                  disabled={sheetMode === "view"}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Method</Label>
              <Select
                value={form.method}
                onValueChange={(v) =>
                  setForm({ ...form, method: v as CouponMethod })
                }
                disabled={sheetMode === "view"}
              >
                <SelectTrigger id="method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="code">
                    Code — customer enters at checkout
                  </SelectItem>
                  <SelectItem value="automatic">
                    Automatic — applied to product price instantly
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Automatic discounts apply on storefront without the customer
                typing anything; code discounts only kick in when the promo
                code is entered at checkout.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                disabled={sheetMode === "view"}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="value">
                  {form.type === "percentage" ? "Percent" : "Amount (₦)"}
                </Label>
                <Input
                  id="value"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.value}
                  onChange={(e) =>
                    setForm({ ...form, value: e.target.value })
                  }
                  disabled={sheetMode === "view"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">Max discount (₦)</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  min={0}
                  value={form.maxDiscount}
                  onChange={(e) =>
                    setForm({ ...form, maxDiscount: e.target.value })
                  }
                  disabled={
                    sheetMode === "view" || form.type !== "percentage"
                  }
                  placeholder="No cap"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="minOrder">Min order (₦)</Label>
                <Input
                  id="minOrder"
                  type="number"
                  min={0}
                  value={form.minOrderAmount}
                  onChange={(e) =>
                    setForm({ ...form, minOrderAmount: e.target.value })
                  }
                  disabled={sheetMode === "view"}
                  placeholder="None"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usageLimit">Total uses</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  min={1}
                  value={form.usageLimit}
                  onChange={(e) =>
                    setForm({ ...form, usageLimit: e.target.value })
                  }
                  disabled={sheetMode === "view"}
                  placeholder="Unlimited"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="perCustomer">Per customer</Label>
                <Input
                  id="perCustomer"
                  type="number"
                  min={1}
                  value={form.perCustomerLimit}
                  onChange={(e) =>
                    setForm({ ...form, perCustomerLimit: e.target.value })
                  }
                  disabled={sheetMode === "view"}
                  placeholder="Unlimited"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isActive">Status</Label>
                <div className="flex items-center gap-2 h-10">
                  <Switch
                    id="isActive"
                    checked={form.isActive}
                    onCheckedChange={(v) =>
                      setForm({ ...form, isActive: v })
                    }
                    disabled={sheetMode === "view"}
                  />
                  <span className="text-sm text-muted-foreground">
                    {form.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="startsAt">Starts</Label>
                <Input
                  id="startsAt"
                  type="date"
                  value={form.startsAt}
                  onChange={(e) =>
                    setForm({ ...form, startsAt: e.target.value })
                  }
                  disabled={sheetMode === "view"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endsAt">Ends</Label>
                <Input
                  id="endsAt"
                  type="date"
                  value={form.endsAt}
                  onChange={(e) =>
                    setForm({ ...form, endsAt: e.target.value })
                  }
                  disabled={sheetMode === "view"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Applies to</Label>
              <Select
                value={form.applicableTo}
                onValueChange={(v) =>
                  setForm({
                    ...form,
                    applicableTo: v as CouponApplicableTo,
                  })
                }
                disabled={sheetMode === "view"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All products</SelectItem>
                  <SelectItem value="specific_products">
                    Specific products
                  </SelectItem>
                  <SelectItem value="specific_categories">
                    Specific categories
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.applicableTo === "specific_products" && (
              <div className="space-y-2">
                <Label>Pick products</Label>
                <div className="max-h-56 overflow-y-auto border rounded-lg p-2 space-y-1">
                  {products.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-3 text-center">
                      No products to pick from.
                    </p>
                  ) : (
                    products.map((p) => (
                      <label
                        key={p.id}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted/50 rounded cursor-pointer"
                      >
                        <Checkbox
                          checked={form.productIds.includes(p.id)}
                          onCheckedChange={(checked) => {
                            if (sheetMode === "view") return;
                            setForm({
                              ...form,
                              productIds: checked
                                ? [...form.productIds, p.id]
                                : form.productIds.filter((id) => id !== p.id),
                            });
                          }}
                          disabled={sheetMode === "view"}
                        />
                        <span className="text-sm">{p.name}</span>
                      </label>
                    ))
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {form.productIds.length} product
                  {form.productIds.length === 1 ? "" : "s"} selected
                </p>
              </div>
            )}

            {form.applicableTo === "specific_categories" && (
              <div className="space-y-2">
                <Label>Pick categories</Label>
                <div className="max-h-56 overflow-y-auto border rounded-lg p-2 space-y-1">
                  {categories.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-3 text-center">
                      No categories to pick from.
                    </p>
                  ) : (
                    categories.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted/50 rounded cursor-pointer"
                      >
                        <Checkbox
                          checked={form.categoryIds.includes(cat.id)}
                          onCheckedChange={(checked) => {
                            if (sheetMode === "view") return;
                            setForm({
                              ...form,
                              categoryIds: checked
                                ? [...form.categoryIds, cat.id]
                                : form.categoryIds.filter(
                                    (id) => id !== cat.id,
                                  ),
                            });
                          }}
                          disabled={sheetMode === "view"}
                        />
                        <span className="text-sm">{cat.name}</span>
                      </label>
                    ))
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {form.categoryIds.length} categor
                  {form.categoryIds.length === 1 ? "y" : "ies"} selected
                </p>
              </div>
            )}

            {sheetMode === "view" && selected && (
              <div className="bg-secondary/50 rounded-lg p-3 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Used</span>
                  <span className="font-medium">
                    {selected.usageCount}
                    {selected.usageLimit ? ` / ${selected.usageLimit}` : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>
                    {new Date(selected.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <SheetFooter className="mt-6 gap-2">
            <Button variant="outline" onClick={closeSheet}>
              Cancel
            </Button>
            {sheetMode === "view" ? (
              <Button onClick={() => selected && openEdit(selected)}>
                Edit
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={
                  createMutation.isPending || updateMutation.isPending
                }
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving…"
                  : sheetMode === "create"
                    ? "Create"
                    : "Save changes"}
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
