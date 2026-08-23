import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, Plus, RefreshCw, Download } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/contexts/StoreContext";
import {
  cloveService,
  type CloveChannel,
  type CloveSyncResult,
} from "@/services/api/clove";

const when = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString() : "never";

/**
 * CloveAI connection for the selected store.
 *
 * A store may hold several Cloove workspaces, so this lists channels and edits
 * one at a time — the same shape as the Chowdeck panel.
 */
export function ClovePanel() {
  const { currentStore } = useStore();
  const storeId = currentStore?.id;
  const queryClient = useQueryClient();

  const { data: channels, isLoading } = useQuery({
    queryKey: ["clove", storeId],
    queryFn: () => cloveService.channels(storeId!),
    enabled: !!storeId,
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [autoAccept, setAutoAccept] = useState(false);
  const [syncResult, setSyncResult] = useState<CloveSyncResult | null>(null);

  const selected: CloveChannel | undefined =
    (channels ?? []).find((c) => c.id === selectedId) ?? (channels ?? [])[0];

  // Re-seed the form whenever the selected channel (or store) changes.
  useEffect(() => {
    setLabel(selected?.label ?? "");
    setIsEnabled(selected?.isEnabled ?? false);
    setAutoAccept(selected?.autoAccept ?? false);
    setApiKey("");
    setSyncResult(null);
  }, [selected?.id, storeId]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["clove", storeId] });

  const save = useMutation({
    mutationFn: () => {
      const payload = {
        label: label.trim(),
        // Blank means "leave the stored key alone" — the form never holds it.
        ...(apiKey.trim() ? { apiKey: apiKey.trim() } : {}),
        isEnabled,
        autoAccept,
      };
      return selected
        ? cloveService.update(storeId!, selected.id, payload)
        : cloveService.add(storeId!, payload);
    },
    onSuccess: () => {
      toast.success("Cloove settings saved");
      void invalidate();
    },
    onError: (e: Error) => toast.error(e.message ?? "Couldn't save"),
  });

  const test = useMutation({
    mutationFn: () => cloveService.test(storeId!, selected!.id),
    onSuccess: (r) =>
      toast.success(`Connected — Cloove returned ${r.products} products`),
    onError: (e: Error) => toast.error(e.message ?? "Connection failed"),
  });

  const sync = useMutation({
    mutationFn: () => cloveService.syncMenu(storeId!, selected!.id),
    onSuccess: (r) => {
      setSyncResult(r);
      toast.success(`Published ${r.published} products to Cloove`);
      void invalidate();
    },
    onError: (e: Error) => toast.error(e.message ?? "Publish failed"),
  });

  const pull = useMutation({
    mutationFn: () => cloveService.pullOrders(storeId!, selected!.id),
    onSuccess: (r) =>
      toast.success(
        `Pulled ${r.pulled} — ${r.ingested} new, ${r.duplicates} already here`,
      ),
    onError: (e: Error) => toast.error(e.message ?? "Pull failed"),
  });

  const testOrder = useMutation({
    mutationFn: () => cloveService.testOrder(storeId!, selected!.id),
    onSuccess: (r) => toast.success(`Test order #${r.orderNumber} sent to the POS`),
    onError: (e: Error) => toast.error(e.message ?? "Test order failed"),
  });

  if (!storeId) return null;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          CloveAI
          {selected?.isEnabled && (
            <Badge className="bg-status-success/10 text-status-success">
              connected
            </Badge>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Publish this store's menu to Cloove and bring Cloove orders into the
          counter POS. Orders arrive already paid and wait for a cashier unless
          you turn on auto-accept.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <>
            {(channels ?? []).length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {(channels ?? []).map((c) => (
                  <Button
                    key={c.id}
                    size="sm"
                    variant={selected?.id === c.id ? "default" : "outline"}
                    onClick={() => setSelectedId(c.id)}
                  >
                    {c.label || "Cloove channel"}
                  </Button>
                ))}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSelectedId(null);
                    setLabel("");
                    setApiKey("");
                    setIsEnabled(false);
                    setAutoAccept(false);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add channel
                </Button>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="clove-label">Channel name</Label>
                <Input
                  id="clove-label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Scoops x Mr. Jollof"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="clove-key">API key</Label>
                <Input
                  id="clove-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={
                    selected?.apiKeyPreview
                      ? `stored (${selected.apiKeyPreview})`
                      : "clv_live_sk_…"
                  }
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="clove-enabled"
                  checked={isEnabled}
                  onCheckedChange={setIsEnabled}
                />
                <Label htmlFor="clove-enabled">Enabled</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="clove-auto"
                  checked={autoAccept}
                  onCheckedChange={setAutoAccept}
                />
                <Label htmlFor="clove-auto">Auto-accept orders</Label>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => save.mutate()} disabled={save.isPending}>
                {selected ? "Save" : "Connect"}
              </Button>
              <Button
                variant="outline"
                onClick={() => test.mutate()}
                disabled={!selected || test.isPending}
              >
                Test connection
              </Button>
              <Button
                variant="outline"
                onClick={() => sync.mutate()}
                disabled={!selected || sync.isPending}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Publish menu
              </Button>
              <Button
                variant="outline"
                onClick={() => pull.mutate()}
                disabled={!selected || pull.isPending}
              >
                <Download className="h-4 w-4 mr-1" />
                Pull orders
              </Button>
              <Button
                variant="outline"
                onClick={() => testOrder.mutate()}
                disabled={!selected || testOrder.isPending}
              >
                Send test order
              </Button>
            </div>

            {selected && (
              <p className="text-xs text-muted-foreground">
                Menu last published {when(selected.lastMenuSyncAt)} · orders last
                pulled {when(selected.lastOrderSyncAt)}
              </p>
            )}

            {syncResult && (
              <div className="rounded-lg border p-3 text-sm">
                <p>
                  {syncResult.published} published · {syncResult.created} new ·{" "}
                  {syncResult.updated} corrected · {syncResult.mapped} mapped
                </p>
                {syncResult.failures.length > 0 && (
                  <p className="text-destructive mt-1">
                    {syncResult.failures.length} failed:{" "}
                    {syncResult.failures.slice(0, 3).join("; ")}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
