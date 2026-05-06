import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Clock,
  CreditCard,
  Package,
  RefreshCw,
  ShoppingCart,
  UserPlus,
  Wallet,
} from "lucide-react";
import { useActivityLog } from "@/hooks/api/use-activity-log";
import { useStore } from "@/contexts/StoreContext";
import type { ActivityEntry } from "@/services/api/activity-log";

function iconFor(action: string) {
  if (action.startsWith("order.")) return ShoppingCart;
  if (action.startsWith("customer.wallet")) return Wallet;
  if (action.startsWith("customer.")) return UserPlus;
  if (action.startsWith("expense.")) return CreditCard;
  if (action.startsWith("cash_session.")) return Wallet;
  if (action.startsWith("delivery.")) return Package;
  return RefreshCw;
}

function colorFor(action: string): string {
  if (action.startsWith("order.created")) return "text-blue-600";
  if (action === "order.completed") return "text-green-600";
  if (action === "order.cancelled") return "text-red-600";
  if (action === "order.refunded") return "text-orange-600";
  if (action.startsWith("customer.wallet_credited")) return "text-emerald-600";
  if (action.startsWith("customer.wallet_debited")) return "text-yellow-600";
  if (action.startsWith("expense.")) return "text-amber-600";
  if (action.startsWith("cash_session.")) return "text-purple-600";
  return "text-muted-foreground";
}

function actionLabel(entry: ActivityEntry): string {
  const a = entry.action;
  const meta = entry.metadata ?? {};
  // Quick translation of the most common dot-namespaced actions into a
  // human-readable sentence. Falls back to the raw action key for anything
  // we don't recognise yet (still readable, e.g. "shift.clocked_in").
  const orderNo =
    typeof meta.orderNumber === "number"
      ? `#${meta.orderNumber}`
      : entry.resourceId
        ? `#${entry.resourceId.slice(0, 6)}`
        : "";
  switch (a) {
    case "order.created":
      return `New order ${orderNo} placed`;
    case "order.completed":
      return `Order ${orderNo} completed`;
    case "order.cancelled":
      return `Order ${orderNo} cancelled`;
    case "order.payment_recorded":
      return `Payment recorded on order ${orderNo}`;
    case "order.refunded":
      return `Order ${orderNo} refunded`;
    case "customer.created":
      return `New customer ${entry.actorName ?? ""}`.trim();
    case "customer.wallet_credited":
      return `Wallet credited`;
    case "customer.wallet_debited":
      return `Wallet debited`;
    case "expense.submitted":
      return `Expense submitted`;
    case "expense.approved":
      return `Expense approved`;
    case "expense.paid":
      return `Expense paid`;
    case "cash_session.opened":
      return `Cash session opened`;
    case "cash_session.closed":
      return `Cash session closed`;
    case "cash_session.reviewed":
      return `Cash session reviewed`;
    case "shift.clocked_in":
      return `Staff clocked in`;
    case "shift.clocked_out":
      return `Staff clocked out`;
    default:
      return a.replace(/[._]/g, " ");
  }
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "Just now";
  const mins = Math.round(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

export function LiveActivity() {
  const { currentStore, isAllStoresMode } = useStore();
  const { data, isLoading, error } = useActivityLog({
    storeId: !isAllStoresMode && currentStore ? currentStore.id : undefined,
    limit: 10,
    page: 1,
  });

  const entries = data?.data ?? [];

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Live Activity
          </h3>
          <p className="text-sm text-muted-foreground">
            Recent events across the business
          </p>
        </div>
        <Badge
          variant="outline"
          className="border-success/20 bg-success/10 text-success"
        >
          <span className="mr-1.5 h-2 w-2 rounded-full bg-success" />
          Live
        </Badge>
      </div>
      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3.5 w-44" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))
        ) : error ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Couldn't load recent activity.
          </p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No recent events.
          </p>
        ) : (
          entries.map((entry, idx) => {
            const Icon = iconFor(entry.action);
            return (
              <div
                key={entry.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg p-3 transition-colors",
                  idx === 0
                    ? "bg-primary/5 border border-primary/20"
                    : "hover:bg-muted",
                )}
              >
                <div className={cn("mt-0.5", colorFor(entry.action))}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground line-clamp-1">
                    {actionLabel(entry)}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" />
                    {formatRelative(entry.createdAt)}
                    {entry.actorName && (
                      <>
                        <span>·</span>
                        <span className="truncate">{entry.actorName}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
