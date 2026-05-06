import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TablePagination } from "@/components/ui/table-pagination";
import {
  CheckCircle2,
  Clock,
  Gift,
  Sparkles,
  Users,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import {
  useReferrals,
  useReferralSettings,
  useReferralStats,
  useUpdateReferralSettings,
} from "@/hooks/api/use-marketing";
import type {
  Referral,
  ReferralRewardType,
  ReferralStatus,
} from "@/types/marketing";

const statusLabel: Record<ReferralStatus, string> = {
  pending: "Pending",
  signed_up: "Signed up",
  first_purchase: "First order placed",
  rewarded: "Rewarded",
  expired: "Expired",
};

const statusStyle: Record<ReferralStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  signed_up: "bg-blue-100 text-blue-700",
  first_purchase: "bg-indigo-100 text-indigo-700",
  rewarded: "bg-green-100 text-green-700",
  expired: "bg-gray-100 text-gray-700",
};

const formatReward = (amount: number, type: ReferralRewardType) =>
  type === "wallet_credit"
    ? formatPrice(amount)
    : `${amount.toLocaleString()} pts`;

export default function ReferralsPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | ReferralStatus>(
    "all",
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const filters = useMemo(
    () => ({
      status: statusFilter === "all" ? undefined : statusFilter,
      page,
      limit: pageSize,
    }),
    [statusFilter, page, pageSize],
  );

  const referralsQuery = useReferrals(filters);
  const statsQuery = useReferralStats();
  const settingsQuery = useReferralSettings();
  const updateSettings = useUpdateReferralSettings();

  const [referrerReward, setReferrerReward] = useState("");
  const [referredReward, setReferredReward] = useState("");
  const [rewardType, setRewardType] = useState<ReferralRewardType>(
    "wallet_credit",
  );
  const [expiryDays, setExpiryDays] = useState("");
  const [settingsActive, setSettingsActive] = useState(true);

  useEffect(() => {
    if (!settingsQuery.data) return;
    setReferrerReward(String(settingsQuery.data.referrerReward));
    setReferredReward(String(settingsQuery.data.referredReward));
    setRewardType(settingsQuery.data.rewardType);
    setExpiryDays(String(settingsQuery.data.expiryDays));
    setSettingsActive(settingsQuery.data.isActive);
  }, [settingsQuery.data]);

  const referrals: Referral[] = referralsQuery.data?.data ?? [];
  const total = referralsQuery.data?.total ?? 0;
  const totalPages = referralsQuery.data?.totalPages ?? 1;
  const startIndex = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, total);
  const stats = statsQuery.data;

  const handleSaveSettings = async () => {
    try {
      await updateSettings.mutateAsync({
        referrerReward: Number(referrerReward),
        referredReward: Number(referredReward),
        rewardType,
        expiryDays: Number(expiryDays),
        isActive: settingsActive,
      });
      toast.success("Referral settings saved");
    } catch (e) {
      toast.error((e as Error).message ?? "Save failed");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Referrals
        </h1>
        <p className="text-sm text-muted-foreground">
          Customers earn a reward when their referrals place a first paid
          order. Configure the rewards and review the funnel here.
        </p>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total referrals</p>
              <p className="text-2xl font-semibold">
                {stats?.totalReferrals ?? 0}
              </p>
            </div>
            <Users className="h-6 w-6 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Rewarded</p>
              <p className="text-2xl font-semibold text-green-600">
                {stats?.rewarded ?? 0}
              </p>
            </div>
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-2xl font-semibold text-yellow-600">
                {(stats?.signedUp ?? 0) + (stats?.pending ?? 0)}
              </p>
            </div>
            <Clock className="h-6 w-6 text-yellow-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Rewards paid</p>
              <p className="text-2xl font-semibold">
                {settingsQuery.data
                  ? formatReward(
                      stats?.totalRewardsPaid ?? 0,
                      settingsQuery.data.rewardType,
                    )
                  : "—"}
              </p>
            </div>
            <Gift className="h-6 w-6 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
            <CardTitle className="text-base">Referrals</CardTitle>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v as typeof statusFilter);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="signed_up">Signed up</SelectItem>
                <SelectItem value="first_purchase">First purchase</SelectItem>
                <SelectItem value="rewarded">Rewarded</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="p-0">
            {referralsQuery.isLoading ? (
              <div className="divide-y divide-border">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 flex items-center gap-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                ))}
              </div>
            ) : referrals.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No referrals yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                        Referrer
                      </th>
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                        Referred
                      </th>
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                        Code
                      </th>
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="text-right p-4 text-xs font-medium text-muted-foreground">
                        Reward
                      </th>
                      <th className="text-left p-4 text-xs font-medium text-muted-foreground">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map((r) => (
                      <tr
                        key={r.id}
                        className="border-b border-border last:border-0 hover:bg-muted/30"
                      >
                        <td className="p-4 text-sm font-medium">
                          {r.referrerName ?? "—"}
                        </td>
                        <td className="p-4 text-sm">
                          <p className="font-medium">
                            {r.referredName ?? "—"}
                          </p>
                          {r.referredEmail && (
                            <p className="text-xs text-muted-foreground">
                              {r.referredEmail}
                            </p>
                          )}
                        </td>
                        <td className="p-4 font-mono text-xs">
                          {r.referralCode}
                        </td>
                        <td className="p-4">
                          <Badge
                            className={cn("text-xs", statusStyle[r.status])}
                          >
                            {statusLabel[r.status]}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-right">
                          {formatReward(r.referrerReward, r.rewardType)}
                        </td>
                        <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reward settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="rewardType">Reward type</Label>
              <Select
                value={rewardType}
                onValueChange={(v) => setRewardType(v as ReferralRewardType)}
              >
                <SelectTrigger id="rewardType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wallet_credit">Wallet credit</SelectItem>
                  <SelectItem value="points">Loyalty points</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="referrerReward">
                Referrer bonus{" "}
                {rewardType === "wallet_credit" ? "(₦)" : "(pts)"}
              </Label>
              <Input
                id="referrerReward"
                type="number"
                min={0}
                value={referrerReward}
                onChange={(e) => setReferrerReward(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                Released after their friend's first paid order.
              </p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="referredReward">
                New customer bonus{" "}
                {rewardType === "wallet_credit" ? "(₦)" : "(pts)"}
              </Label>
              <Input
                id="referredReward"
                type="number"
                min={0}
                value={referredReward}
                onChange={(e) => setReferredReward(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                Granted as soon as they register with the code.
              </p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="expiry">Expiry (days)</Label>
              <Input
                id="expiry"
                type="number"
                min={0}
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                0 = referral never expires.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Switch
                checked={settingsActive}
                onCheckedChange={setSettingsActive}
                id="referralActive"
              />
              <Label htmlFor="referralActive" className="text-sm">
                Program active
              </Label>
            </div>
            <Button
              onClick={handleSaveSettings}
              disabled={updateSettings.isPending}
              className="w-full"
            >
              {updateSettings.isPending ? "Saving…" : "Save settings"}
            </Button>
            <div className="flex items-start gap-2 text-xs text-muted-foreground pt-2 border-t">
              <Sparkles className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>
                Customers see their referral code on their profile and can
                share a ?ref=CODE link.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

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
    </div>
  );
}
