import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddonGroups,
  useAddonGroupStats,
  useCreateAddonGroup,
  useUpdateAddonGroup,
  useDeleteAddonGroup,
  useAddAddon,
  useUpdateAddon,
  useDeleteAddon,
  useToggleAddonAvailability,
  useIngredients,
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
import { Label } from "@/components/ui/label";
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
  PlusCircle,
  Search,
  Eye,
  Loader2,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface AddOnIngredient {
  id: string;
  ingredientId: string;
  ingredientName?: string | null;
  quantity: number;
  unit: string;
}

interface AddOn {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  addOnGroupId?: string;
  /** Stock links consumed when this add-on is ordered. */
  ingredients?: AddOnIngredient[];
}

/** Editable row in the add-on's stock-link list. */
interface DraftAddonIngredient {
  key: string;
  ingredientId: string;
  quantity: number;
  unit: string;
}

interface AddOnGroup {
  id: string;
  name: string;
  addons: AddOn[];
  minSelection: number;
  maxSelection: number | null;
  status: boolean;
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
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

function AddOnsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="h-8 w-8" />
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="p-4 flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-10 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);

export default function AddOnsPage() {
  // Add-on groups are store-scoped on the backend. In all-stores mode we omit
  // storeId (show all); with a specific store selected we filter by it and
  // require it on create.
  const { currentStore, isAllStoresMode } = useStore();
  const scopedStoreId = isAllStoresMode ? undefined : currentStore?.id;
  const { data: addOnGroupsData, isLoading } = useAddonGroups({ storeId: scopedStoreId });
  const { data: stats } = useAddonGroupStats(scopedStoreId);
  const addOnGroups: AddOnGroup[] =
    ((addOnGroupsData as unknown as { data?: AddOnGroup[] })?.data ?? []) as AddOnGroup[];

  const createGroup = useCreateAddonGroup();
  const updateGroup = useUpdateAddonGroup();
  const deleteGroup = useDeleteAddonGroup();
  const addAddon = useAddAddon();
  const updateAddon = useUpdateAddon();
  const deleteAddon = useDeleteAddon();
  const toggleAvailability = useToggleAddonAvailability();

  const [searchQuery, setSearchQuery] = useState("");

  // Group form state
  const [isGroupSheetOpen, setIsGroupSheetOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<AddOnGroup | null>(null);
  const [groupName, setGroupName] = useState("");
  const [groupMin, setGroupMin] = useState<number>(0);
  const [groupMax, setGroupMax] = useState<number | "">("");
  const [groupStatus, setGroupStatus] = useState(true);

  // Item form state
  const [isItemSheetOpen, setIsItemSheetOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<AddOn | null>(null);
  const [itemGroupId, setItemGroupId] = useState<string | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState<number>(0);
  const [itemIsAvailable, setItemIsAvailable] = useState(true);
  // Stock links for this add-on — mirrors the ingredient rows on ProductsPage.
  const [itemIngredients, setItemIngredients] = useState<DraftAddonIngredient[]>([]);
  const { data: ingredientsPage } = useIngredients({
    storeId: currentStore?.id,
    limit: 200,
  });
  const ingredients = ingredientsPage?.data ?? [];

  // View sheet
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [viewingGroup, setViewingGroup] = useState<AddOnGroup | null>(null);

  const filteredGroups = addOnGroups.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Group form handlers
  const resetGroupForm = () => {
    setGroupName("");
    setGroupMin(0);
    setGroupMax("");
    setGroupStatus(true);
  };

  const openGroupForCreate = () => {
    setSelectedGroup(null);
    resetGroupForm();
    setIsGroupSheetOpen(true);
  };

  const openGroupForEdit = (group: AddOnGroup) => {
    setSelectedGroup(group);
    setIsGroupSheetOpen(true);
  };

  useEffect(() => {
    if (selectedGroup && isGroupSheetOpen) {
      setGroupName(selectedGroup.name);
      setGroupMin(selectedGroup.minSelection ?? 0);
      setGroupMax(selectedGroup.maxSelection ?? "");
      setGroupStatus(selectedGroup.status);
    }
  }, [selectedGroup, isGroupSheetOpen]);

  const handleSaveGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Group name is required");
      return;
    }
    const payload = {
      name: groupName.trim(),
      minSelection: groupMin,
      maxSelection: groupMax === "" ? null : Number(groupMax),
      status: groupStatus,
    };
    try {
      if (selectedGroup) {
        await updateGroup.mutateAsync({ id: selectedGroup.id, data: payload });
        toast.success("Group updated");
      } else {
        if (!currentStore?.id) {
          toast.error("Select a store first");
          return;
        }
        await createGroup.mutateAsync({ ...payload, addons: [], storeId: currentStore.id });
        toast.success("Group created");
      }
      setIsGroupSheetOpen(false);
      resetGroupForm();
      setSelectedGroup(null);
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to save group");
    }
  };

  const handleDeleteGroup = (group: AddOnGroup) => {
    deleteGroup.mutate(group.id, {
      onSuccess: () => {
        toast.success("Group deleted");
        setIsViewSheetOpen(false);
        setIsGroupSheetOpen(false);
      },
      onError: (e: Error) => toast.error(e.message ?? "Failed to delete"),
    });
  };

  // Item form handlers
  const resetItemForm = () => {
    setItemName("");
    setItemPrice(0);
    setItemIsAvailable(true);
    setItemIngredients([]);
  };

  const addDraftAddonIngredient = () =>
    setItemIngredients((prev) => [
      ...prev,
      { key: `new-${Date.now()}-${prev.length}`, ingredientId: "", quantity: 0, unit: "" },
    ]);
  const updateDraftAddonIngredient = (
    index: number,
    patch: Partial<DraftAddonIngredient>,
  ) =>
    setItemIngredients((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    );
  const removeDraftAddonIngredient = (index: number) =>
    setItemIngredients((prev) => prev.filter((_, i) => i !== index));

  const openItemForCreate = (groupId: string) => {
    setEditingAddon(null);
    setItemGroupId(groupId);
    resetItemForm();
    setIsItemSheetOpen(true);
  };

  const openItemForEdit = (groupId: string, addon: AddOn) => {
    setEditingAddon(addon);
    setItemGroupId(groupId);
    setItemName(addon.name);
    setItemPrice(Number(addon.price));
    setItemIsAvailable(addon.isAvailable);
    setItemIngredients(
      (addon.ingredients ?? []).map((ai) => ({
        key: ai.id,
        ingredientId: ai.ingredientId,
        quantity: Number(ai.quantity ?? 0),
        unit: ai.unit ?? "",
      })),
    );
    setIsItemSheetOpen(true);
  };

  const handleSaveItem = async () => {
    if (!itemGroupId) return;
    const addonIngredientPayload = itemIngredients
      .filter((i) => i.ingredientId)
      .map((i) => ({
        ingredientId: i.ingredientId,
        quantity: i.quantity,
        unit: i.unit,
      }));
    if (!itemName.trim()) {
      toast.error("Add-on name is required");
      return;
    }
    try {
      if (editingAddon) {
        await updateAddon.mutateAsync({
          groupId: itemGroupId,
          addonId: editingAddon.id,
          data: {
            name: itemName.trim(),
            price: itemPrice,
            isAvailable: itemIsAvailable,
            ingredients: addonIngredientPayload,
          },
        });
        toast.success("Add-on updated");
      } else {
        await addAddon.mutateAsync({
          groupId: itemGroupId,
          data: {
            name: itemName.trim(),
            price: itemPrice,
            isAvailable: itemIsAvailable,
            ingredients: addonIngredientPayload,
          },
        });
        toast.success("Add-on added");
      }
      setIsItemSheetOpen(false);
      resetItemForm();
      setEditingAddon(null);
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to save add-on");
    }
  };

  const handleDeleteAddon = (groupId: string, addonId: string) => {
    deleteAddon.mutate(
      { groupId, addonId },
      {
        onSuccess: () => toast.success("Add-on removed"),
        onError: (e: Error) => toast.error(e.message ?? "Failed to remove"),
      },
    );
  };

  const handleToggleAddon = (groupId: string, addonId: string) => {
    toggleAvailability.mutate(
      { groupId, addonId },
      { onError: () => toast.error("Failed to toggle availability") },
    );
  };

  const handleViewGroup = (group: AddOnGroup) => {
    setViewingGroup(group);
    setIsViewSheetOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Add-ons</h1>
          <p className="text-sm text-muted-foreground">
            Create add-on groups for extra items and upgrades
          </p>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={openGroupForCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Group
        </Button>
      </div>

      {/* Stats */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Add-on Groups</p>
              <p className="text-xl sm:text-2xl font-semibold">
                {stats?.totalGroups ?? addOnGroups.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Add-ons</p>
              <p className="text-xl sm:text-2xl font-semibold">
                {stats?.totalAddons ??
                  addOnGroups.reduce((acc, g) => acc + (g.addons?.length ?? 0), 0)}
              </p>
            </CardContent>
          </Card>
          <Card className="col-span-2 md:col-span-1">
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Available</p>
              <p className="text-xl sm:text-2xl font-semibold text-green-600">
                {stats?.availableAddons ??
                  addOnGroups.reduce(
                    (acc, g) => acc + (g.addons ?? []).filter((a) => a.isAvailable).length,
                    0,
                  )}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search add-on groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Groups */}
      {isLoading ? (
        <AddOnsSkeleton />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredGroups.map((group) => (
            <Card key={group.id}>
              <div className="flex items-center justify-between border-b p-4">
                <div
                  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  onClick={() => handleViewGroup(group)}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <PlusCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base truncate">{group.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {(group.minSelection ?? 0) === 0 ? "Optional" : `Min ${group.minSelection}`}
                      {group.maxSelection != null ? ` · Max ${group.maxSelection}` : ""}
                      {" · "}
                      {(group.addons ?? []).length} items
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex"
                    onClick={() => openItemForCreate(group.id)}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewGroup(group)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="sm:hidden"
                        onClick={() => openItemForCreate(group.id)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Add-on
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openGroupForEdit(group)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Group
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteGroup(group)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardContent className="p-0">
                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-6">Add-on</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead className="pr-6 w-20">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(group.addons ?? []).map((addon) => (
                        <TableRow key={addon.id} className="group">
                          <TableCell className="pl-6 font-medium">{addon.name}</TableCell>
                          <TableCell>{formatPrice(Number(addon.price))}</TableCell>
                          <TableCell>
                            <Switch
                              checked={addon.isAvailable}
                              onCheckedChange={() => handleToggleAddon(group.id, addon.id)}
                              disabled={toggleAvailability.isPending}
                            />
                          </TableCell>
                          <TableCell className="pr-6">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => openItemForEdit(group.id, addon)}
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive"
                                onClick={() => handleDeleteAddon(group.id, addon.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(group.addons ?? []).length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="text-center text-sm text-muted-foreground py-6"
                          >
                            No add-ons yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="block sm:hidden divide-y divide-border">
                  {(group.addons ?? []).map((addon) => (
                    <div key={addon.id} className="p-4 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{addon.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(Number(addon.price))}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Switch
                          checked={addon.isAvailable}
                          onCheckedChange={() => handleToggleAddon(group.id, addon.id)}
                          disabled={toggleAvailability.isPending}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openItemForEdit(group.id, addon)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteAddon(group.id, addon.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredGroups.length === 0 && (
            <div className="col-span-full p-12 text-center text-sm text-muted-foreground">
              No add-on groups yet — click "Add Group" to create one.
            </div>
          )}
        </div>
      )}

      {/* Group Sheet */}
      <Sheet
        open={isGroupSheetOpen}
        onOpenChange={(open) => {
          setIsGroupSheetOpen(open);
          if (!open) {
            setSelectedGroup(null);
            resetGroupForm();
          }
        }}
      >
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedGroup ? "Edit Add-on Group" : "Add Add-on Group"}</SheetTitle>
            <SheetDescription>
              {selectedGroup ? "Update group details" : "Create a new add-on group"}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Group Details</h3>
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Extra Sides"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min">Minimum Selection</Label>
                  <Input
                    id="min"
                    type="number"
                    min={0}
                    value={groupMin}
                    onChange={(e) => setGroupMin(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max">Maximum Selection</Label>
                  <Input
                    id="max"
                    type="number"
                    min={0}
                    placeholder="No limit"
                    value={groupMax}
                    onChange={(e) =>
                      setGroupMax(e.target.value === "" ? "" : Number(e.target.value))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Publish</h3>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={groupStatus ? "active" : "inactive"}
                  onValueChange={(v) => setGroupStatus(v === "active")}
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
              onClick={() => setIsGroupSheetOpen(false)}
              className="w-full sm:w-auto"
              disabled={createGroup.isPending || updateGroup.isPending}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={handleSaveGroup}
              disabled={createGroup.isPending || updateGroup.isPending}
            >
              {(createGroup.isPending || updateGroup.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {selectedGroup ? "Update Group" : "Create Group"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Item Sheet */}
      <Sheet
        open={isItemSheetOpen}
        onOpenChange={(open) => {
          setIsItemSheetOpen(open);
          if (!open) {
            setEditingAddon(null);
            resetItemForm();
          }
        }}
      >
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingAddon ? "Edit Add-on" : "Add Item"}</SheetTitle>
            <SheetDescription>
              {editingAddon ? "Update add-on details" : "Add a new item to this group"}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Item Details</h3>
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input
                  placeholder="e.g., Extra Cheese"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Price (₦)</Label>
                <Input
                  type="number"
                  min={0}
                  value={itemPrice}
                  onChange={(e) => setItemPrice(Number(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <Label>Available</Label>
                <Switch
                  checked={itemIsAvailable}
                  onCheckedChange={setItemIsAvailable}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Ingredients (link to stock)</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addDraftAddonIngredient}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Ingredient
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Deducted from inventory each time this add-on is ordered.
              </p>
              {itemIngredients.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No ingredients linked.
                </p>
              ) : (
                <div className="space-y-2">
                  {itemIngredients.map((ing, index) => (
                    <div
                      key={ing.key}
                      className="flex items-center gap-2 p-2 border rounded-lg"
                    >
                      <Select
                        value={ing.ingredientId}
                        onValueChange={(val) => {
                          const matched = ingredients.find((i) => i.id === val);
                          updateDraftAddonIngredient(index, {
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
                          updateDraftAddonIngredient(index, {
                            quantity: Number(e.target.value),
                          })
                        }
                        className="w-24"
                      />
                      <Input
                        placeholder="unit"
                        value={ing.unit}
                        onChange={(e) =>
                          updateDraftAddonIngredient(index, { unit: e.target.value })
                        }
                        className="w-20"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={() => removeDraftAddonIngredient(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsItemSheetOpen(false)}
              className="w-full sm:w-auto"
              disabled={addAddon.isPending || updateAddon.isPending}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={handleSaveItem}
              disabled={addAddon.isPending || updateAddon.isPending}
            >
              {(addAddon.isPending || updateAddon.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingAddon ? "Update" : "Add Item"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{viewingGroup?.name}</SheetTitle>
            <SheetDescription>Add-on group details and items</SheetDescription>
          </SheetHeader>
          {viewingGroup && (
            <div className="grid gap-6 py-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Group Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Min Selection</p>
                    <p className="font-medium">{viewingGroup.minSelection ?? 0}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Max Selection</p>
                    <p className="font-medium">
                      {viewingGroup.maxSelection ?? "No limit"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">Status</span>
                  <Badge
                    className={
                      viewingGroup.status
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : ""
                    }
                  >
                    {viewingGroup.status ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Items ({(viewingGroup.addons ?? []).length})
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsViewSheetOpen(false);
                      openItemForCreate(viewingGroup.id);
                    }}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
                <div className="space-y-2">
                  {(viewingGroup.addons ?? []).map((addon) => (
                    <div
                      key={addon.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{addon.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(Number(addon.price))}
                        </p>
                      </div>
                      <Badge variant={addon.isAvailable ? "default" : "secondary"}>
                        {addon.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  ))}
                </div>
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
            {viewingGroup && (
              <Button
                onClick={() => {
                  setIsViewSheetOpen(false);
                  openGroupForEdit(viewingGroup);
                }}
                className="w-full sm:w-auto"
              >
                Edit Group
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
