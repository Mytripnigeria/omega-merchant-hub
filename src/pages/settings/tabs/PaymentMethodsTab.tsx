import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Trash2, Edit, MoreHorizontal, Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import {
  usePaymentMethods,
  useCreatePaymentMethod,
  useUpdatePaymentMethod,
  useDeletePaymentMethod,
} from "@/hooks/api/use-settings";
import type { PaymentMethod, PaymentMethodType } from "@/services/api/payment-methods";

const TYPE_OPTIONS: { value: PaymentMethodType; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "transfer", label: "Bank Transfer" },
  { value: "pos", label: "POS Terminal" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "other", label: "Other" },
];

export function PaymentMethodsTab() {
  const { data: methods = [], isLoading } = usePaymentMethods();
  const createMethod = useCreatePaymentMethod();
  const updateMethod = useUpdatePaymentMethod();
  const deleteMethod = useDeletePaymentMethod();

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const [type, setType] = useState<PaymentMethodType>("cash");
  const [label, setLabel] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (editing) {
      setType(editing.type);
      setLabel(editing.label);
      setIsEnabled(editing.isEnabled);
    } else {
      setType("cash");
      setLabel("");
      setIsEnabled(true);
    }
  }, [editing, isOpen]);

  const openAdd = () => {
    setEditing(null);
    setIsOpen(true);
  };

  const openEdit = (m: PaymentMethod) => {
    setEditing(m);
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!label.trim()) return toast.error("Label is required");
    try {
      if (editing) {
        await updateMethod.mutateAsync({
          id: editing.id,
          data: { type, label: label.trim(), isEnabled },
        });
        toast.success("Payment method updated");
      } else {
        await createMethod.mutateAsync({ type, label: label.trim(), isEnabled });
        toast.success("Payment method created");
      }
      setIsOpen(false);
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to save");
    }
  };

  const handleToggle = (m: PaymentMethod) => {
    updateMethod.mutate(
      { id: m.id, data: { isEnabled: !m.isEnabled } },
      { onError: () => toast.error("Failed to toggle") },
    );
  };

  const handleDelete = (m: PaymentMethod) => {
    deleteMethod.mutate(m.id, {
      onSuccess: () => toast.success("Payment method removed"),
      onError: (e: Error) => toast.error(e.message ?? "Failed to delete"),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Payment Methods</h2>
          <p className="text-sm text-muted-foreground">
            Configure how customers can pay across all stores
          </p>
        </div>
        <Button size="sm" onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Method
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
          {methods.map((m) => (
            <Card key={m.id}>
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{m.label}</p>
                      <Badge variant="outline" className="text-xs capitalize">
                        {m.type.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch
                    checked={m.isEnabled}
                    onCheckedChange={() => handleToggle(m)}
                    disabled={updateMethod.isPending}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(m)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(m)}
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
          {methods.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No payment methods yet — click &quot;Add Method&quot;.
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit Payment Method" : "Add Payment Method"}</SheetTitle>
            <SheetDescription>
              {editing ? "Update payment method settings" : "Configure a new way to accept payment"}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as PaymentMethodType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                placeholder="e.g., Cash on Delivery"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Enabled</p>
                <p className="text-xs text-muted-foreground">Customers can use this method</p>
              </div>
              <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={createMethod.isPending || updateMethod.isPending}
            >
              {(createMethod.isPending || updateMethod.isPending) && (
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
