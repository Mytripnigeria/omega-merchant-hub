import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import { Edit, Gift, Plus, Star, Trash2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useCreateLoyaltyTier,
  useDeleteLoyaltyTier,
  useLoyaltySettings,
  useLoyaltyStats,
  useLoyaltyTiers,
  useUpdateLoyaltySettings,
  useUpdateLoyaltyTier,
} from "@/hooks/api/use-marketing";
import type {
  CreateLoyaltyTierRequest,
  LoyaltyBenefit,
  LoyaltyBenefitType,
  LoyaltyTier,
} from "@/types/marketing";

type SheetMode = "view" | "create" | "edit";

const benefitLabel: Record<LoyaltyBenefitType, string> = {
  discount: "% Discount",
  free_shipping: "Free shipping",
  free_item: "Free item",
  points_multiplier: "Points multiplier",
  exclusive_access: "Exclusive access",
};

const tierColors: string[] = [
  "bg-orange-100 text-orange-800",
  "bg-gray-100 text-gray-800",
  "bg-yellow-100 text-yellow-800",
  "bg-purple-100 text-purple-800",
];

const newBenefit = (): LoyaltyBenefit => ({
  id: crypto.randomUUID(),
  type: "discount",
  value: 5,
  description: "5% discount",
});

interface TierFormState {
  name: string;
  description: string;
  minPoints: string;
  color: string;
  benefits: LoyaltyBenefit[];
  isActive: boolean;
}

const blankTierForm: TierFormState = {
  name: "",
  description: "",
  minPoints: "0",
  color: tierColors[0],
  benefits: [],
  isActive: true,
};

const tierToForm = (t: LoyaltyTier): TierFormState => ({
  name: t.name,
  description: t.description ?? "",
  minPoints: String(t.minPoints),
  color: t.color ?? tierColors[0],
  benefits: t.benefits ?? [],
  isActive: t.isActive,
});

const formToPayload = (f: TierFormState): CreateLoyaltyTierRequest => ({
  name: f.name.trim(),
  description: f.description.trim() || undefined,
  minPoints: Number(f.minPoints) || 0,
  color: f.color || undefined,
  benefits: f.benefits,
  isActive: f.isActive,
});

export default function LoyaltyPage() {
  const [sheetMode, setSheetMode] = useState<SheetMode>("create");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selected, setSelected] = useState<LoyaltyTier | null>(null);
  const [form, setForm] = useState<TierFormState>(blankTierForm);

  const tiersQuery = useLoyaltyTiers();
  const statsQuery = useLoyaltyStats();
  const settingsQuery = useLoyaltySettings();
  const createMutation = useCreateLoyaltyTier();
  const updateMutation = useUpdateLoyaltyTier();
  const deleteMutation = useDeleteLoyaltyTier();
  const updateSettings = useUpdateLoyaltySettings();

  const [pointsPerNaira, setPointsPerNaira] = useState("");
  const [nairaPerPoint, setNairaPerPoint] = useState("");
  const [minPointsToRedeem, setMinPointsToRedeem] = useState("");
  const [pointsExpiryDays, setPointsExpiryDays] = useState("");
  const [settingsActive, setSettingsActive] = useState(true);

  useEffect(() => {
    if (!settingsQuery.data) return;
    setPointsPerNaira(String(settingsQuery.data.pointsPerNaira));
    setNairaPerPoint(String(settingsQuery.data.nairaPerPoint));
    setMinPointsToRedeem(String(settingsQuery.data.minPointsToRedeem));
    setPointsExpiryDays(String(settingsQuery.data.pointsExpiryDays));
    setSettingsActive(settingsQuery.data.isActive);
  }, [settingsQuery.data]);

  const tiers = tiersQuery.data?.data ?? [];
  const stats = statsQuery.data;

  const openCreate = () => {
    setSelected(null);
    setForm(blankTierForm);
    setSheetMode("create");
    setSheetOpen(true);
  };

  const openView = (t: LoyaltyTier) => {
    setSelected(t);
    setForm(tierToForm(t));
    setSheetMode("view");
    setSheetOpen(true);
  };

  const openEdit = (t: LoyaltyTier) => {
    setSelected(t);
    setForm(tierToForm(t));
    setSheetMode("edit");
    setSheetOpen(true);
  };

  const closeSheet = () => setSheetOpen(false);

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Tier name is required");
      return;
    }
    try {
      if (sheetMode === "create") {
        await createMutation.mutateAsync(formToPayload(form));
        toast.success("Tier created");
      } else if (sheetMode === "edit" && selected) {
        await updateMutation.mutateAsync({
          id: selected.id,
          data: formToPayload(form),
        });
        toast.success("Tier updated");
      }
      closeSheet();
    } catch (e) {
      toast.error((e as Error).message ?? "Save failed");
    }
  };

  const handleDelete = async (t: LoyaltyTier) => {
    if (!confirm(`Delete tier ${t.name}?`)) return;
    try {
      await deleteMutation.mutateAsync(t.id);
      toast.success("Tier deleted");
      if (selected?.id === t.id) closeSheet();
    } catch (e) {
      toast.error((e as Error).message ?? "Delete failed");
    }
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettings.mutateAsync({
        pointsPerNaira: Number(pointsPerNaira),
        nairaPerPoint: Number(nairaPerPoint),
        minPointsToRedeem: Number(minPointsToRedeem),
        pointsExpiryDays: Number(pointsExpiryDays),
        isActive: settingsActive,
      });
      toast.success("Loyalty settings saved");
    } catch (e) {
      toast.error((e as Error).message ?? "Save failed");
    }
  };

  const benefitsEditor = useMemo(
    () => (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Benefits</Label>
          {sheetMode !== "view" && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() =>
                setForm({
                  ...form,
                  benefits: [...form.benefits, newBenefit()],
                })
              }
            >
              <Plus className="h-3 w-3 mr-1" /> Add benefit
            </Button>
          )}
        </div>
        {form.benefits.length === 0 ? (
          <p className="text-xs text-muted-foreground">No benefits yet.</p>
        ) : (
          <div className="space-y-2">
            {form.benefits.map((b, idx) => (
              <div
                key={b.id}
                className="border rounded-lg p-3 space-y-2 bg-muted/30"
              >
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={b.type}
                    onValueChange={(v) => {
                      const benefits = [...form.benefits];
                      benefits[idx] = {
                        ...b,
                        type: v as LoyaltyBenefitType,
                      };
                      setForm({ ...form, benefits });
                    }}
                    disabled={sheetMode === "view"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(
                        Object.keys(benefitLabel) as LoyaltyBenefitType[]
                      ).map((k) => (
                        <SelectItem key={k} value={k}>
                          {benefitLabel[k]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    value={b.value}
                    onChange={(e) => {
                      const benefits = [...form.benefits];
                      benefits[idx] = {
                        ...b,
                        value: Number(e.target.value),
                      };
                      setForm({ ...form, benefits });
                    }}
                    disabled={sheetMode === "view"}
                    placeholder="Value"
                  />
                </div>
                <Input
                  value={b.description}
                  onChange={(e) => {
                    const benefits = [...form.benefits];
                    benefits[idx] = {
                      ...b,
                      description: e.target.value,
                    };
                    setForm({ ...form, benefits });
                  }}
                  disabled={sheetMode === "view"}
                  placeholder="Description"
                />
                {sheetMode !== "view" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() =>
                      setForm({
                        ...form,
                        benefits: form.benefits.filter(
                          (_, i) => i !== idx,
                        ),
                      })
                    }
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    ),
    [form, sheetMode],
  );

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Loyalty
          </h1>
          <p className="text-sm text-muted-foreground">
            Define tiers + benefits and control how points are earned and
            redeemed.
          </p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4 mr-2" /> New Tier
        </Button>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Members</p>
              <p className="text-2xl font-semibold">
                {stats?.totalMembers ?? 0}
              </p>
            </div>
            <Users className="h-6 w-6 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Points issued</p>
              <p className="text-2xl font-semibold">
                {(stats?.totalPointsIssued ?? 0).toLocaleString()}
              </p>
            </div>
            <Star className="h-6 w-6 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Redemptions</p>
              <p className="text-2xl font-semibold">
                {stats?.rewardsRedeemed ?? 0}
              </p>
            </div>
            <Gift className="h-6 w-6 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">In circulation</p>
              <p className="text-2xl font-semibold">
                {(stats?.totalPointsBalance ?? 0).toLocaleString()}
              </p>
            </div>
            <Star className="h-6 w-6 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tiers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tiersQuery.isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))
              ) : tiers.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No tiers yet — create one to start rewarding repeat
                  customers.
                </p>
              ) : (
                tiers.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => openView(t)}
                    className="border rounded-xl p-4 cursor-pointer hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            className={cn(
                              "text-xs",
                              t.color ?? tierColors[0],
                            )}
                          >
                            {t.name}
                          </Badge>
                          {!t.isActive && (
                            <Badge variant="outline" className="text-xs">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        {t.description && (
                          <p className="text-sm text-muted-foreground">
                            {t.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          From {t.minPoints.toLocaleString()} pts ·{" "}
                          {t.benefits.length} benefit
                          {t.benefits.length === 1 ? "" : "s"} ·{" "}
                          {t.memberCount} member
                          {t.memberCount === 1 ? "" : "s"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(t);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(t);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Point settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="ppn">Points per ₦1 spent</Label>
              <Input
                id="ppn"
                type="number"
                step="0.01"
                value={pointsPerNaira}
                onChange={(e) => setPointsPerNaira(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                e.g. 0.1 means 1 point for every ₦10 spent.
              </p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="npp">Naira per point</Label>
              <Input
                id="npp"
                type="number"
                step="0.01"
                value={nairaPerPoint}
                onChange={(e) => setNairaPerPoint(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                Discount value when customer redeems 1 point at checkout.
              </p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="minPts">Min to redeem</Label>
              <Input
                id="minPts"
                type="number"
                value={minPointsToRedeem}
                onChange={(e) => setMinPointsToRedeem(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="exp">Expiry (days)</Label>
              <Input
                id="exp"
                type="number"
                value={pointsExpiryDays}
                onChange={(e) => setPointsExpiryDays(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                0 = points never expire.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Switch
                checked={settingsActive}
                onCheckedChange={setSettingsActive}
                id="loyaltyActive"
              />
              <Label htmlFor="loyaltyActive" className="text-sm">
                Loyalty program active
              </Label>
            </div>
            <Button
              onClick={handleSaveSettings}
              disabled={updateSettings.isPending}
              className="w-full"
            >
              {updateSettings.isPending ? "Saving…" : "Save settings"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {sheetMode === "create"
                ? "New tier"
                : sheetMode === "edit"
                  ? "Edit tier"
                  : selected?.name}
            </SheetTitle>
            <SheetDescription>
              {sheetMode === "view"
                ? selected?.description ?? "Tier details"
                : "Tier customers join automatically once they cross the points threshold."}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  disabled={sheetMode === "view"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threshold">Min points</Label>
                <Input
                  id="threshold"
                  type="number"
                  min={0}
                  value={form.minPoints}
                  onChange={(e) =>
                    setForm({ ...form, minPoints: e.target.value })
                  }
                  disabled={sheetMode === "view"}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tierDesc">Description</Label>
              <Textarea
                id="tierDesc"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                disabled={sheetMode === "view"}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {tierColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() =>
                      sheetMode !== "view" && setForm({ ...form, color: c })
                    }
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium",
                      c,
                      form.color === c
                        ? "ring-2 ring-offset-2 ring-foreground"
                        : "",
                    )}
                  >
                    Aa
                  </button>
                ))}
              </div>
            </div>

            {benefitsEditor}

            <div className="flex items-center gap-2">
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => setForm({ ...form, isActive: v })}
                disabled={sheetMode === "view"}
                id="tierActive"
              />
              <Label htmlFor="tierActive" className="text-sm">
                Active
              </Label>
            </div>

            {sheetMode === "view" && selected && (
              <div className="bg-secondary/50 rounded-lg p-3 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Members</span>
                  <span className="font-medium">{selected.memberCount}</span>
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
                    ? "Create tier"
                    : "Save changes"}
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
