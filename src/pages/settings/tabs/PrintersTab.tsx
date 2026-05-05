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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Trash2, Edit, MoreHorizontal, Loader2, Printer as PrinterIcon } from "lucide-react";
import { toast } from "sonner";
import {
  useStores,
  usePrinters,
  useCreatePrinter,
  useUpdatePrinter,
  useDeletePrinter,
} from "@/hooks/api/use-settings";
import { useStore } from "@/contexts/StoreContext";
import type {
  Printer,
  PrinterConnection,
  PrinterType,
} from "@/services/api/printers";
import type { Store } from "@/types";

const TYPES: { value: PrinterType; label: string }[] = [
  { value: "kitchen", label: "Kitchen" },
  { value: "receipt", label: "Receipt" },
  { value: "bar", label: "Bar" },
  { value: "label", label: "Label" },
];

const CONNECTIONS: { value: PrinterConnection; label: string }[] = [
  { value: "network", label: "Network (IP)" },
  { value: "usb", label: "USB" },
  { value: "bluetooth", label: "Bluetooth" },
  { value: "cloud", label: "Cloud" },
];

export function PrintersTab() {
  const { currentStore } = useStore();
  const { data: storesPage } = useStores();
  const stores: Store[] = storesPage?.data ?? [];
  const [storeFilter, setStoreFilter] = useState<string>(currentStore?.id ?? "");

  useEffect(() => {
    if (!storeFilter && currentStore?.id) setStoreFilter(currentStore.id);
  }, [currentStore, storeFilter]);

  const ALL_STORES = "__all__";
  const { data: printers = [], isLoading } = usePrinters(
    storeFilter && storeFilter !== ALL_STORES ? storeFilter : undefined,
  );
  const createPrinter = useCreatePrinter();
  const updatePrinter = useUpdatePrinter();
  const deletePrinter = useDeletePrinter();

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Printer | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<PrinterType>("kitchen");
  const [connection, setConnection] = useState<PrinterConnection>("network");
  const [address, setAddress] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [storeIdForCreate, setStoreIdForCreate] = useState<string>("");

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setType(editing.type);
      setConnection(editing.connection);
      setAddress(editing.address ?? "");
      setIsActive(editing.isActive);
    } else {
      setName("");
      setType("kitchen");
      setConnection("network");
      setAddress("");
      setIsActive(true);
      setStoreIdForCreate(storeFilter || stores[0]?.id || "");
    }
  }, [editing, isOpen, storeFilter, stores]);

  const openAdd = () => {
    setEditing(null);
    setIsOpen(true);
  };

  const openEdit = (p: Printer) => {
    setEditing(p);
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return toast.error("Name is required");
    try {
      if (editing) {
        await updatePrinter.mutateAsync({
          id: editing.id,
          data: { name: name.trim(), type, connection, address, isActive },
        });
        toast.success("Printer updated");
      } else {
        if (!storeIdForCreate) return toast.error("Select a store");
        await createPrinter.mutateAsync({
          storeId: storeIdForCreate,
          name: name.trim(),
          type,
          connection,
          address: address || undefined,
          isActive,
        });
        toast.success("Printer added");
      }
      setIsOpen(false);
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to save");
    }
  };

  const handleDelete = (p: Printer) => {
    deletePrinter.mutate(p.id, {
      onSuccess: () => toast.success("Printer removed"),
      onError: (e: Error) => toast.error(e.message ?? "Failed to delete"),
    });
  };

  const handleToggle = (p: Printer) => {
    updatePrinter.mutate(
      { id: p.id, data: { isActive: !p.isActive } },
      { onError: () => toast.error("Failed to toggle") },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Printers</h2>
          <p className="text-sm text-muted-foreground">Per-store printer configuration</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={storeFilter || ALL_STORES} onValueChange={setStoreFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Filter by store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STORES}>All stores</SelectItem>
              {stores.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Printer
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {printers.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <PrinterIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium truncate">{p.name}</p>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {p.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {p.connection}
                      </Badge>
                    </div>
                    {p.address && (
                      <p className="text-xs text-muted-foreground font-mono">{p.address}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch
                    checked={p.isActive}
                    onCheckedChange={() => handleToggle(p)}
                    disabled={updatePrinter.isPending}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(p)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(p)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
          {printers.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No printers configured.
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit Printer" : "Add Printer"}</SheetTitle>
            <SheetDescription>
              {editing ? "Update printer config" : "Configure a new printer"}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            {!editing && (
              <div className="space-y-2">
                <Label>Store</Label>
                <Select value={storeIdForCreate} onValueChange={setStoreIdForCreate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select store" />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="e.g., Kitchen Printer 1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as PrinterType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Connection</Label>
              <Select
                value={connection}
                onValueChange={(v) => setConnection(v as PrinterConnection)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONNECTIONS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Address (IP / device id / cloud key)</Label>
              <Input
                placeholder="192.168.1.20 or device id"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <p className="text-sm font-medium">Active</p>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={createPrinter.isPending || updatePrinter.isPending}
            >
              {(createPrinter.isPending || updatePrinter.isPending) && (
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
