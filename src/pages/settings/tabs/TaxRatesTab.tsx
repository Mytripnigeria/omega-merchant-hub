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
import { Plus, Trash2, Edit, MoreHorizontal, Loader2, Percent, Star } from "lucide-react";
import { toast } from "sonner";
import {
  useTaxRates,
  useCreateTaxRate,
  useUpdateTaxRate,
  useDeleteTaxRate,
} from "@/hooks/api/use-settings";
import type { TaxRate } from "@/services/api/tax-rates";

export function TaxRatesTab() {
  const { data: rates = [], isLoading } = useTaxRates();
  const createRate = useCreateTaxRate();
  const updateRate = useUpdateTaxRate();
  const deleteRate = useDeleteTaxRate();

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<TaxRate | null>(null);
  const [name, setName] = useState("");
  const [percent, setPercent] = useState<number>(0);
  const [isInclusive, setIsInclusive] = useState(false);
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setPercent(Number(editing.ratePercent));
      setIsInclusive(editing.isInclusive);
      setIsDefault(editing.isDefault);
    } else {
      setName("");
      setPercent(0);
      setIsInclusive(false);
      setIsDefault(false);
    }
  }, [editing, isOpen]);

  const openAdd = () => {
    setEditing(null);
    setIsOpen(true);
  };

  const openEdit = (r: TaxRate) => {
    setEditing(r);
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) return toast.error("Name is required");
    if (percent < 0 || percent > 100) return toast.error("Rate must be between 0 and 100");
    try {
      if (editing) {
        await updateRate.mutateAsync({
          id: editing.id,
          data: { name: name.trim(), ratePercent: percent, isInclusive, isDefault },
        });
        toast.success("Tax rate updated");
      } else {
        await createRate.mutateAsync({
          name: name.trim(),
          ratePercent: percent,
          isInclusive,
          isDefault,
        });
        toast.success("Tax rate created");
      }
      setIsOpen(false);
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to save");
    }
  };

  const handleDelete = (r: TaxRate) => {
    deleteRate.mutate(r.id, {
      onSuccess: () => toast.success("Tax rate deleted"),
      onError: (e: Error) => toast.error(e.message ?? "Failed to delete"),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Tax Rates</h2>
          <p className="text-sm text-muted-foreground">
            Manage VAT and other tax rates applied to orders
          </p>
        </div>
        <Button size="sm" onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tax Rate
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
          {rates.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Percent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium truncate">{r.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {Number(r.ratePercent).toFixed(2)}%
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {r.isInclusive ? "Inclusive" : "Exclusive"}
                      </Badge>
                      {r.isDefault && (
                        <Badge className="text-xs gap-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                          <Star className="h-3 w-3" />
                          Default
                        </Badge>
                      )}
                    </div>
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
          {rates.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No tax rates yet — click &quot;Add Tax Rate&quot;.
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit Tax Rate" : "Add Tax Rate"}</SheetTitle>
            <SheetDescription>
              {editing ? "Update tax rate" : "Create a new tax rate"}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="e.g., VAT"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Rate (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={percent}
                onChange={(e) => setPercent(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Inclusive</p>
                <p className="text-xs text-muted-foreground">
                  Tax already included in displayed prices
                </p>
              </div>
              <Switch checked={isInclusive} onCheckedChange={setIsInclusive} />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Default rate</p>
                <p className="text-xs text-muted-foreground">
                  Used when no other rate is specified
                </p>
              </div>
              <Switch checked={isDefault} onCheckedChange={setIsDefault} />
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={createRate.isPending || updateRate.isPending}
            >
              {(createRate.isPending || updateRate.isPending) && (
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
