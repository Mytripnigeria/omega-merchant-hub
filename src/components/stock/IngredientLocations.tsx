import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useIngredientLocationStocks,
  useSetIngredientLocationStock,
  useRemoveIngredientLocationStock,
} from "@/hooks/api/use-stock";
import type { Ingredient, IngredientLocationStock } from "@/types/products";

/** Per-location stock row used when creating a new inventory item. */
export interface InitialLocationStockRow {
  locationId: string;
  currentStock: number;
  minStock: number;
  expiryDate?: string;
}

/**
 * Multi-row "Initial per-location stock" section for create forms.
 * Submitting these rows as `locations` makes the backend derive the
 * aggregate currentStock/minStock from them.
 */
export function InitialLocationStockSection({
  allLocations,
  value,
  onChange,
}: {
  allLocations: { id: string; name: string }[];
  value: InitialLocationStockRow[];
  onChange: (rows: InitialLocationStockRow[]) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>Initial per-location stock (optional)</Label>
      <p className="text-xs text-muted-foreground">
        Split the starting stock across one or more inventory locations. The aggregate
        fields above are recomputed from these rows.
      </p>
      <div className="space-y-2">
        {value.map((row, idx) => (
          <div
            key={`${row.locationId}-${idx}`}
            className="grid grid-cols-12 gap-2 items-center"
          >
            <Select
              value={row.locationId}
              onValueChange={(v) => {
                const next = [...value];
                next[idx] = { ...next[idx], locationId: v };
                onChange(next);
              }}
            >
              <SelectTrigger className="col-span-5">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {allLocations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              step="0.01"
              min={0}
              placeholder="Stock"
              className="col-span-3"
              value={row.currentStock}
              onChange={(e) => {
                const next = [...value];
                next[idx] = { ...next[idx], currentStock: Number(e.target.value) };
                onChange(next);
              }}
            />
            <Input
              type="number"
              step="0.01"
              min={0}
              placeholder="Min"
              className="col-span-3"
              value={row.minStock}
              onChange={(e) => {
                const next = [...value];
                next[idx] = { ...next[idx], minStock: Number(e.target.value) };
                onChange(next);
              }}
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="col-span-1"
              onClick={() => onChange(value.filter((_, i) => i !== idx))}
              aria-label="Remove location row"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            onChange([...value, { locationId: "", currentStock: 0, minStock: 0 }])
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add location
        </Button>
      </div>
    </div>
  );
}

/**
 * Edit-mode per-location stock editor backed by the dedicated
 * PUT/DELETE /ingredients/:id/locations/:locationId endpoints.
 */
export function IngredientLocationsEditor({
  ingredient,
  allLocations,
}: {
  ingredient: Ingredient;
  allLocations: { id: string; name: string }[];
}) {
  const { data: rows, isLoading } = useIngredientLocationStocks(ingredient.id);
  const setStock = useSetIngredientLocationStock();
  const removeStock = useRemoveIngredientLocationStock();

  const [newLocationId, setNewLocationId] = useState("");
  const [newStock, setNewStock] = useState<number>(0);
  const [newMin, setNewMin] = useState<number>(0);

  const usedIds = new Set((rows ?? []).map((r) => r.locationId));
  const addable = allLocations.filter((l) => !usedIds.has(l.id));

  const handleSave = async (
    locationId: string,
    data: { currentStock?: number; minStock?: number; expiryDate?: string | null },
  ) => {
    try {
      await setStock.mutateAsync({ id: ingredient.id, locationId, data });
      toast.success("Location stock saved");
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to save");
    }
  };

  const handleRemove = async (locationId: string) => {
    try {
      await removeStock.mutateAsync({ id: ingredient.id, locationId });
      toast.success("Location removed");
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to remove");
    }
  };

  const handleAdd = async () => {
    if (!newLocationId) {
      toast.error("Pick a location");
      return;
    }
    await handleSave(newLocationId, { currentStock: newStock, minStock: newMin });
    setNewLocationId("");
    setNewStock(0);
    setNewMin(0);
  };

  return (
    <div className="space-y-2">
      <Label>Per-location stock</Label>
      <p className="text-xs text-muted-foreground">
        Adjustments here update the aggregate stock on this ingredient automatically.
      </p>
      {isLoading ? (
        <Skeleton className="h-16 w-full" />
      ) : (
        <div className="rounded-md border divide-y">
          {(rows ?? []).length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              No per-location stock yet. Add one below to start tracking by location.
            </p>
          ) : (
            (rows ?? []).map((row) => (
              <LocationStockRow
                key={row.id}
                row={row}
                unit={ingredient.unit}
                allLocations={allLocations}
                onSave={(data) => handleSave(row.locationId, data)}
                onRemove={() => handleRemove(row.locationId)}
                disabled={setStock.isPending || removeStock.isPending}
              />
            ))
          )}
        </div>
      )}
      {addable.length > 0 && (
        <div className="grid grid-cols-12 gap-2 items-center pt-2">
          <Select value={newLocationId} onValueChange={setNewLocationId}>
            <SelectTrigger className="col-span-5">
              <SelectValue placeholder="Add location" />
            </SelectTrigger>
            <SelectContent>
              {addable.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            step="0.01"
            min={0}
            placeholder="Stock"
            className="col-span-3"
            value={newStock}
            onChange={(e) => setNewStock(Number(e.target.value))}
          />
          <Input
            type="number"
            step="0.01"
            min={0}
            placeholder="Min"
            className="col-span-3"
            value={newMin}
            onChange={(e) => setNewMin(Number(e.target.value))}
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="col-span-1"
            onClick={handleAdd}
            disabled={setStock.isPending}
            aria-label="Add location stock"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function LocationStockRow({
  row,
  unit,
  allLocations,
  onSave,
  onRemove,
  disabled,
}: {
  row: IngredientLocationStock;
  unit: string;
  allLocations: { id: string; name: string }[];
  onSave: (data: { currentStock?: number; minStock?: number; expiryDate?: string | null }) => void;
  onRemove: () => void;
  disabled: boolean;
}) {
  const [currentStock, setCurrentStock] = useState<number>(Number(row.currentStock));
  const [minStock, setMinStock] = useState<number>(Number(row.minStock));
  const name = allLocations.find((l) => l.id === row.locationId)?.name ?? row.locationId.slice(0, 8);

  const dirty =
    currentStock !== Number(row.currentStock) || minStock !== Number(row.minStock);

  return (
    <div className="grid grid-cols-12 gap-2 items-center px-3 py-2">
      <p className="col-span-4 text-sm font-medium truncate">{name}</p>
      <div className="col-span-3">
        <Input
          type="number"
          step="0.01"
          min={0}
          value={currentStock}
          onChange={(e) => setCurrentStock(Number(e.target.value))}
        />
      </div>
      <div className="col-span-3">
        <Input
          type="number"
          step="0.01"
          min={0}
          value={minStock}
          onChange={(e) => setMinStock(Number(e.target.value))}
        />
      </div>
      <div className="col-span-2 flex justify-end gap-1">
        {dirty && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={disabled}
            onClick={() => onSave({ currentStock, minStock })}
          >
            Save
          </Button>
        )}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          disabled={disabled}
          onClick={onRemove}
          aria-label="Remove location"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <p className="col-span-12 text-xs text-muted-foreground">
        Current: {row.currentStock} {unit} · Min: {row.minStock} {unit}
        {row.expiryDate ? ` · BB ${row.expiryDate}` : ""}
      </p>
    </div>
  );
}
