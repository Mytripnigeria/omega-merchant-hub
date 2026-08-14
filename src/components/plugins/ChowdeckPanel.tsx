import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Bike, Copy, PlugZap, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/contexts/StoreContext";
import {
  chowdeckService,
  type ChowdeckConfig,
  type ChowdeckSyncResult,
} from "@/services/api/chowdeck";

const when = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString() : "never";

/**
 * Chowdeck marketplace connection for the selected store.
 *
 * Store-scoped on purpose: a Chowdeck merchant reference identifies one vendor
 * location, so each branch connects separately with its own menu.
 */
export function ChowdeckPanel() {
  const { currentStore } = useStore();
  const storeId = currentStore?.id;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["chowdeck", storeId],
    queryFn: () => chowdeckService.get(storeId!),
    enabled: !!storeId,
  });

  const [merchantReference, setMerchantReference] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [autoAccept, setAutoAccept] = useState(false);
  const [syncResult, setSyncResult] = useState<ChowdeckSyncResult | null>(null);

  // Re-seed the form whenever the loaded config (or the store) changes.
  useEffect(() => {
    setMerchantReference(data?.merchantReference ?? "");
    setIsEnabled(data?.isEnabled ?? false);
    setAutoAccept(data?.autoAccept ?? false);
    setSecretKey("");
    setSyncResult(null);
  }, [data, storeId]);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["chowdeck", storeId] });

  const save = useMutation({
    mutationFn: () =>
      chowdeckService.save(storeId!, {
        merchantReference: merchantReference.trim(),
        // Blank means "leave the stored key alone" — the form never holds it.
        ...(secretKey.trim() ? { secretKey: secretKey.trim() } : {}),
        isEnabled,
        autoAccept,
      }),
    onSuccess: () => {
      toast.success("Chowdeck settings saved");
      void invalidate();
    },
    onError: (e: Error) => toast.error(e.message ?? "Couldn't save"),
  });

  const test = useMutation({
    mutationFn: () => chowdeckService.test(storeId!),
    onSuccess: (r) =>
      toast.success(`Connected — Chowdeck returned ${r.menuItems} menu items`),
    onError: (e: Error) => toast.error(e.message ?? "Connection failed"),
  });

  const sync = useMutation({
    mutationFn: () => chowdeckService.syncMenu(storeId!),
    onSuccess: (r) => {
      setSyncResult(r);
      toast.success(
        `Chowdeck menu updated — ${r.created} added, ${r.updated} corrected`,
      );
      void invalidate();
    },
    onError: (e: Error) => toast.error(e.message ?? "Menu sync failed"),
  });

  const copyWebhook = async () => {
    if (!data?.webhookUrl) return;
    try {
      await navigator.clipboard.writeText(data.webhookUrl);
      toast.success("Webhook URL copied");
    } catch {
      toast.error("Couldn't copy — select the text manually");
    }
  };

  if (!storeId) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Pick a store to configure its Chowdeck connection.
        </CardContent>
      </Card>
    );
  }

  const connected = !!(data as ChowdeckConfig | null)?.merchantReference;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <Bike className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-base">Chowdeck</CardTitle>
            <p className="text-xs text-muted-foreground">
              Orders placed on Chowdeck arrive in {currentStore?.name}'s POS.
            </p>
          </div>
        </div>
        <Badge variant={data?.isEnabled ? "default" : "secondary"}>
          {data?.isEnabled ? "Live" : connected ? "Paused" : "Not connected"}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-5">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="cd-ref">Merchant reference</Label>
                <Input
                  id="cd-ref"
                  placeholder="ref_5ed0f23195c0fcd3da6b1fded5353974"
                  value={merchantReference}
                  onChange={(e) => setMerchantReference(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cd-key">Secret key</Label>
                <Input
                  id="cd-key"
                  type="password"
                  autoComplete="off"
                  placeholder={
                    data?.secretKeyPreview
                      ? `${data.secretKeyPreview} — leave blank to keep`
                      : "sk_live_…"
                  }
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label className="text-sm">Accept orders from Chowdeck</Label>
                  <p className="text-xs text-muted-foreground">
                    While off, Chowdeck orders are refused and no status updates
                    are sent.
                  </p>
                </div>
                <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label className="text-sm">Auto-accept</Label>
                  <p className="text-xs text-muted-foreground">
                    Skip the POS confirmation and take every Chowdeck order on
                    automatically.
                  </p>
                </div>
                <Switch checked={autoAccept} onCheckedChange={setAutoAccept} />
              </div>
            </div>

            {data?.webhookUrl && (
              <div className="space-y-1.5">
                <Label>Webhook URL</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 truncate rounded-md bg-muted px-3 py-2 text-xs">
                    {data.webhookUrl}
                  </code>
                  <Button variant="outline" size="sm" onClick={copyWebhook}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Give this to Chowdeck so they can notify this store of new
                  orders.
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => save.mutate()} disabled={save.isPending}>
                {save.isPending ? "Saving…" : "Save"}
              </Button>
              <Button
                variant="outline"
                onClick={() => test.mutate()}
                disabled={!connected || test.isPending}
              >
                <PlugZap className="mr-2 h-4 w-4" />
                {test.isPending ? "Testing…" : "Test connection"}
              </Button>
              <Button
                variant="outline"
                onClick={() => sync.mutate()}
                disabled={!connected || sync.isPending}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${sync.isPending ? "animate-spin" : ""}`}
                />
                {sync.isPending ? "Publishing…" : "Publish menu"}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Publishing is safe to repeat: new items are added, ones already on
              Chowdeck are corrected in place (price, name, availability). It is
              also what lets an incoming order deduct the right stock, so run it
              after changing products. Last published{" "}
              {when(data?.lastMenuSyncAt ?? null)} · last order received{" "}
              {when(data?.lastWebhookAt ?? null)}.
            </p>

            {syncResult && (
              <div className="rounded-md border p-3 text-xs">
                <p className="font-medium">
                  {syncResult.created} added · {syncResult.updated} corrected ·{" "}
                  {syncResult.mapped} matched to products
                </p>
                {syncResult.updateFailures.length > 0 && (
                  <p className="mt-1 text-destructive">
                    Chowdeck refused: {syncResult.updateFailures.join("; ")}
                  </p>
                )}
                {syncResult.unmapped.length > 0 && (
                  <p className="mt-1 text-muted-foreground">
                    Not matched to a product (these won't deduct stock):{" "}
                    {syncResult.unmapped.join(", ")}
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
