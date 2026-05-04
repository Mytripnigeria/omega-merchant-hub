import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Trash2,
  Edit,
  MoreHorizontal,
  Loader2,
  Webhook,
  Send,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import {
  useWebhooks,
  useCreateWebhook,
  useUpdateWebhook,
  useDeleteWebhook,
  useRotateWebhookSecret,
  useTestWebhook,
} from "@/hooks/api/use-settings";
import { ALLOWED_WEBHOOK_EVENTS, type Webhook as WebhookType } from "@/services/api/webhooks";

export function WebhooksTab() {
  const { data: webhooks = [], isLoading } = useWebhooks();
  const createWebhook = useCreateWebhook();
  const updateWebhook = useUpdateWebhook();
  const deleteWebhook = useDeleteWebhook();
  const rotateSecret = useRotateWebhookSecret();
  const testWebhook = useTestWebhook();

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<WebhookType | null>(null);
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);

  // Secret reveal modal (one-time)
  const [revealSecret, setRevealSecret] = useState<string | null>(null);

  useEffect(() => {
    if (editing) {
      setUrl(editing.url);
      setEvents(editing.events);
      setIsActive(editing.isActive);
    } else {
      setUrl("");
      setEvents([]);
      setIsActive(true);
    }
  }, [editing, isOpen]);

  const openAdd = () => {
    setEditing(null);
    setIsOpen(true);
  };

  const openEdit = (w: WebhookType) => {
    setEditing(w);
    setIsOpen(true);
  };

  const toggleEvent = (e: string, on: boolean) => {
    setEvents((prev) => (on ? [...prev, e] : prev.filter((x) => x !== e)));
  };

  const handleSave = async () => {
    if (!url.trim()) return toast.error("URL is required");
    if (events.length === 0) return toast.error("Select at least one event");
    try {
      if (editing) {
        await updateWebhook.mutateAsync({
          id: editing.id,
          data: { url: url.trim(), events, isActive },
        });
        toast.success("Webhook updated");
      } else {
        const result = await createWebhook.mutateAsync({ url: url.trim(), events, isActive });
        setRevealSecret(result.secret);
        toast.success("Webhook created");
      }
      setIsOpen(false);
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to save");
    }
  };

  const handleDelete = (w: WebhookType) => {
    deleteWebhook.mutate(w.id, {
      onSuccess: () => toast.success("Webhook deleted"),
      onError: (e: Error) => toast.error(e.message ?? "Failed to delete"),
    });
  };

  const handleRotate = async (w: WebhookType) => {
    try {
      const { secret } = await rotateSecret.mutateAsync(w.id);
      setRevealSecret(secret);
      toast.success("Secret rotated");
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to rotate");
    }
  };

  const handleTest = async (w: WebhookType) => {
    try {
      const result = await testWebhook.mutateAsync(w.id);
      if (result.ok) {
        toast.success(`Test sent — ${w.url} responded ${result.status}`);
      } else {
        toast.error(`Test failed: ${result.error ?? `HTTP ${result.status}`}`);
      }
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to test");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Webhooks</h2>
          <p className="text-sm text-muted-foreground">
            Receive HTTP callbacks when events happen in your business
          </p>
        </div>
        <Button size="sm" onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Webhook
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {webhooks.map((w) => (
            <Card key={w.id}>
              <CardContent className="p-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Webhook className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium truncate font-mono text-sm">{w.url}</p>
                      {!w.isActive && (
                        <Badge variant="secondary" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {w.events.map((e) => (
                        <Badge key={e} variant="outline" className="text-xs">
                          {e}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-3 flex-wrap">
                      <span>Secret: ••••{w.secretLastFour}</span>
                      {w.lastTriggeredAt && (
                        <span>
                          Last triggered: {new Date(w.lastTriggeredAt).toLocaleString()}
                        </span>
                      )}
                      {w.failureCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {w.failureCount} failures
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleTest(w)}>
                      <Send className="mr-2 h-4 w-4" />
                      Test
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRotate(w)}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Rotate secret
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openEdit(w)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(w)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
          {webhooks.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No webhooks configured.
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit Webhook" : "Add Webhook"}</SheetTitle>
            <SheetDescription>
              {editing ? "Update endpoint and events" : "Receive callbacks when events fire"}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label>Endpoint URL</Label>
              <Input
                placeholder="https://api.example.com/hooks/orders"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Events</Label>
              <div className="space-y-2 border rounded-lg p-3">
                {ALLOWED_WEBHOOK_EVENTS.map((e) => (
                  <div key={e} className="flex items-center gap-2">
                    <Checkbox
                      id={`evt-${e}`}
                      checked={events.includes(e)}
                      onCheckedChange={(c) => toggleEvent(e, c === true)}
                    />
                    <label htmlFor={`evt-${e}`} className="text-sm font-mono">
                      {e}
                    </label>
                  </div>
                ))}
              </div>
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
              disabled={createWebhook.isPending || updateWebhook.isPending}
            >
              {(createWebhook.isPending || updateWebhook.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editing ? "Save" : "Create"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={revealSecret !== null} onOpenChange={(open) => !open && setRevealSecret(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save your webhook secret</DialogTitle>
            <DialogDescription>
              This is the only time we will show this secret. Use it to verify the
              <code className="mx-1 font-mono">X-Mr-Jollof-Signature</code>
              header on incoming webhooks.
            </DialogDescription>
          </DialogHeader>
          <div className="p-3 bg-muted rounded font-mono text-sm break-all">{revealSecret}</div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (revealSecret) navigator.clipboard.writeText(revealSecret);
                toast.success("Copied to clipboard");
              }}
            >
              Copy
            </Button>
            <Button variant="outline" onClick={() => setRevealSecret(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
