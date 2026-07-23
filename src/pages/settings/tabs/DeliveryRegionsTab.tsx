import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
import { Plus, Trash2, Edit, MoreHorizontal, Loader2, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/contexts/StoreContext";
import {
  useDeliveryRegions,
  useCreateDeliveryRegion,
  useUpdateDeliveryRegion,
  useDeleteDeliveryRegion,
} from "@/hooks/api/use-delivery-regions";
import type { DeliveryRegion } from "@/types/delivery-regions";

export function DeliveryRegionsTab() {
  const { currentStore } = useStore();
  const { data: regions = [], isLoading } = useDeliveryRegions(
    currentStore?.id ? { storeId: currentStore.id } : undefined,
  );
  const createRegion = useCreateDeliveryRegion();
  const updateRegion = useUpdateDeliveryRegion();
  const deleteRegion = useDeleteDeliveryRegion();

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<DeliveryRegion | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fee, setFee] = useState<number>(0);
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setDescription(editing.description ?? "");
      setFee(Number(editing.fee));
      setMinOrderAmount(
        editing.minOrderAmount === null || editing.minOrderAmount === undefined
          ? ""
          : String(editing.minOrderAmount),
      );
      setEstimatedMinutes(
        editing.estimatedMinutes === null || editing.estimatedMinutes === undefined
          ? ""
          : String(editing.estimatedMinutes),
      );
      setIsActive(editing.isActive);
    } else {
      setName("");
      setDescription("");
      setFee(0);
      setMinOrderAmount("");
      setEstimatedMinutes("");
      setIsActive(true);
    }
  }, [editing, isOpen]);

  const openAdd = () => {
    setEditing(null);
    setIsOpen(true);
  };

  const openEdit = (r: DeliveryRegion) => {
    setEditing(r);
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return toast.error("Name is required");
    if (fee < 0) return toast.error("Fee must be 0 or greater");
    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      fee,
      minOrderAmount: minOrderAmount === "" ? undefined : Number(minOrderAmount),
      estimatedMinutes:
        estimatedMinutes === "" ? undefined : Number(estimatedMinutes),
      isActive,
    };
    try {
      if (editing) {
        await updateRegion.mutateAsync({ id: editing.id, data: payload });
        toast.success("Delivery region updated");
      } else {
        if (!currentStore?.id) return toast.error("Select a store first");
        await createRegion.mutateAsync({ ...payload, storeId: currentStore.id });
        toast.success("Delivery region created");
      }
      setIsOpen(false);
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to save");
    }
  };

  const handleDelete = (r: DeliveryRegion) => {
    deleteRegion.mutate(r.id, {
      onSuccess: () => toast.success("Delivery region deleted"),
      onError: (e: Error) => toast.error(e.message ?? "Failed to delete"),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Delivery Regions</h2>
          <p className="text-sm text-muted-foreground">
            Manage delivery areas, fees and minimum order amounts for this store
          </p>
        </div>
        <Button size="sm" onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Region
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {regions.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium truncate">{r.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {formatPrice(Number(r.fee))}
                      </Badge>
                      {Number(r.minOrderAmount) > 0 && (
                        <Badge variant="outline" className="text-xs">
                          Min {formatPrice(Number(r.minOrderAmount))}
                        </Badge>
                      )}
                      {r.estimatedMinutes !== null && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Clock className="h-3 w-3" />
                          {r.estimatedMinutes} min
                        </Badge>
                      )}
                      {!r.isActive && (
                        <Badge variant="outline" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    {r.description && (
                      <p className="text-xs text-muted-foreground truncate">
                        {r.description}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(r)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(r)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
          {regions.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No delivery regions yet — click &quot;Add Region&quot;.
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editing ? "Edit Delivery Region" : "Add Delivery Region"}
            </SheetTitle>
            <SheetDescription>
              {editing ? "Update delivery region" : "Create a new delivery region"}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="e.g., Lekki Phase 1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="e.g., Includes Admiralty Way"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Fee (₦)</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Minimum order amount (₦)</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                placeholder="Optional"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Estimated minutes</Label>
              <Input
                type="number"
                min={0}
                placeholder="Optional"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-xs text-muted-foreground">
                  Available for customers to select at checkout
                </p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={createRegion.isPending || updateRegion.isPending}
            >
              {(createRegion.isPending || updateRegion.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editing ? "Save" : "Create"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
