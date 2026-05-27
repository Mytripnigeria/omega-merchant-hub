import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, Loader2, Utensils } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import { ErrorState } from "@/components/ui/data-states";
import { toast } from "sonner";
import { useStore } from "@/contexts/StoreContext";
import {
  useTables,
  useCreateTable,
  useUpdateTable,
  useDeleteTable,
} from "@/hooks/api/use-tables";
import type { RestaurantTable, TableStatus } from "@/services/api/tables";

const STATUS_LABEL: Record<TableStatus, string> = {
  available: "Available",
  occupied: "Occupied",
  reserved: "Reserved",
  cleaning: "Cleaning",
};

const STATUS_TONE: Record<TableStatus, "default" | "secondary" | "destructive" | "outline"> = {
  available: "default",
  occupied: "destructive",
  reserved: "secondary",
  cleaning: "outline",
};

export default function TablesPage() {
  const { currentStore } = useStore();
  const storeId = currentStore?.id;
  const tablesQuery = useTables({ storeId });
  const createTable = useCreateTable();
  const updateTable = useUpdateTable();
  const deleteTable = useDeleteTable();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<RestaurantTable | null>(null);
  const [name, setName] = useState("");
  const [section, setSection] = useState("");
  const [capacity, setCapacity] = useState<number>(2);
  const [status, setStatus] = useState<TableStatus>("available");
  const [notes, setNotes] = useState("");

  const resetForm = () => {
    setName("");
    setSection("");
    setCapacity(2);
    setStatus("available");
    setNotes("");
  };

  useEffect(() => {
    if (editing && sheetOpen) {
      setName(editing.name);
      setSection(editing.section ?? "");
      setCapacity(editing.capacity);
      setStatus(editing.status);
      setNotes(editing.notes ?? "");
    }
  }, [editing, sheetOpen]);

  const openCreate = () => {
    setEditing(null);
    resetForm();
    setSheetOpen(true);
  };

  const openEdit = (t: RestaurantTable) => {
    setEditing(t);
    setSheetOpen(true);
  };

  const handleSave = async () => {
    if (!storeId) {
      toast.error("Select a store first");
      return;
    }
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      if (editing) {
        await updateTable.mutateAsync({
          id: editing.id,
          data: {
            name: name.trim(),
            section: section || undefined,
            capacity,
            status,
            notes: notes || undefined,
          },
        });
        toast.success("Table updated");
      } else {
        await createTable.mutateAsync({
          storeId,
          name: name.trim(),
          section: section || undefined,
          capacity,
          status,
          notes: notes || undefined,
        });
        toast.success("Table created");
      }
      setSheetOpen(false);
      setEditing(null);
      resetForm();
    } catch (err) {
      toast.error((err as Error).message ?? "Couldn't save table");
    }
  };

  const handleDelete = (t: RestaurantTable) => {
    if (!confirm(`Delete table ${t.name}? Active orders on this table will keep their snapshotted label.`)) {
      return;
    }
    deleteTable.mutate(t.id, {
      onSuccess: () => toast.success("Table deleted"),
      onError: (e: Error) => toast.error(e.message ?? "Couldn't delete"),
    });
  };

  const tables = tablesQuery.data ?? [];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Tables</h1>
          <p className="text-sm text-muted-foreground">
            Floor plan and seating for the current store.
          </p>
        </div>
        <Button size="sm" onClick={openCreate} disabled={!storeId}>
          <Plus className="mr-2 h-4 w-4" />
          Add table
        </Button>
      </div>

      {tablesQuery.isError ? (
        <ErrorState
          description={(tablesQuery.error as Error)?.message ?? "Couldn't load tables."}
          onRetry={() => tablesQuery.refetch()}
        />
      ) : tablesQuery.isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading tables…
        </div>
      ) : tables.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Utensils className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-1">No tables yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add the tables in your dining room so staff can seat orders against them.
            </p>
            <Button onClick={openCreate} disabled={!storeId}>
              <Plus className="mr-2 h-4 w-4" />
              Add your first table
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tables.map((t) => (
            <Card key={t.id}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-lg">{t.name}</p>
                    {t.section && (
                      <p className="text-xs text-muted-foreground">{t.section}</p>
                    )}
                  </div>
                  <Badge variant={STATUS_TONE[t.status]} className="text-xs">
                    {STATUS_LABEL[t.status]}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Seats {t.capacity}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(t)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(t)}
                    disabled={deleteTable.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) {
            setEditing(null);
            resetForm();
          }
        }}
      >
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit table" : "Add table"}</SheetTitle>
            <SheetDescription>
              {editing
                ? "Update this table's details. Renames apply to new orders only — historical orders keep their snapshotted label."
                : "Add a dining table for this store."}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="e.g., T-12"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Section (optional)</Label>
              <Input
                placeholder="e.g., Patio, VIP, Window"
                value={section}
                onChange={(e) => setSection(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Capacity</Label>
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as TableStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(STATUS_LABEL) as TableStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setSheetOpen(false)}
              className="w-full sm:w-auto"
              disabled={createTable.isPending || updateTable.isPending}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={handleSave}
              disabled={createTable.isPending || updateTable.isPending}
            >
              {(createTable.isPending || updateTable.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editing ? "Save" : "Add table"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
