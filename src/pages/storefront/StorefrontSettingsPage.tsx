import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings,
  Globe,
  Bell,
  Image as ImageIcon,
  Save,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import {
  useStorefrontConfig,
  useUpdateStorefrontConfig,
} from "@/hooks/api/use-storefront";
import type {
  StorefrontConfig,
  UpdateStorefrontConfigRequest,
} from "@/types/storefront";

export default function StorefrontSettingsPage() {
  const configQuery = useStorefrontConfig();
  const updateConfig = useUpdateStorefrontConfig();
  const [form, setForm] = useState<StorefrontConfig | null>(null);

  useEffect(() => {
    if (configQuery.data && !form) setForm(configQuery.data);
  }, [configQuery.data, form]);

  if (configQuery.isLoading || !form) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Storefront Settings</h1>
          <p className="text-muted-foreground">Loading…</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const set = <K extends keyof StorefrontConfig>(
    key: K,
    value: StorefrontConfig[K],
  ) => setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const save = (fields: (keyof StorefrontConfig)[]) => {
    if (!form) return;
    const payload: UpdateStorefrontConfigRequest = {};
    for (const f of fields) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (payload as any)[f] = form[f];
    }
    updateConfig.mutate(payload, {
      // Merge the response into the existing form so a PATCH that echoes only
      // the changed fields doesn't blank out the other cards' values (the
      // "doesn't show saved info until reload" bug).
      onSuccess: (next) => {
        setForm((prev) => (prev ? { ...prev, ...next } : next));
        toast.success("Settings saved");
      },
      onError: (e: Error) => toast.error(e.message ?? "Couldn't save"),
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Storefront Settings</h1>
        <p className="text-muted-foreground">Configure your online store</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              General
            </CardTitle>
            <CardDescription>Basic store information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Store Name</Label>
              <Input
                value={form.storeName}
                onChange={(e) => set("storeName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input
                value={form.tagline ?? ""}
                onChange={(e) => set("tagline", e.target.value || null)}
              />
            </div>
            <div className="space-y-2">
              <Label>Custom Domain</Label>
              <Input
                placeholder="www.yourdomain.com"
                value={form.customDomain ?? ""}
                onChange={(e) => set("customDomain", e.target.value || null)}
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input
                type="email"
                value={form.contactEmail ?? ""}
                onChange={(e) => set("contactEmail", e.target.value || null)}
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Phone</Label>
              <Input
                value={form.contactPhone ?? ""}
                onChange={(e) => set("contactPhone", e.target.value || null)}
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea
                rows={2}
                value={form.contactAddress ?? ""}
                onChange={(e) => set("contactAddress", e.target.value || null)}
              />
            </div>
            <Button
              onClick={() =>
                save([
                  "storeName",
                  "tagline",
                  "customDomain",
                  "contactEmail",
                  "contactPhone",
                  "contactAddress",
                ])
              }
              disabled={updateConfig.isPending}
            >
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Store Status & Features
            </CardTitle>
            <CardDescription>Enable or disable storefront features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Store Status</Label>
              <Select
                value={form.storeStatus}
                onValueChange={(v) =>
                  set("storeStatus", v as StorefrontConfig["storeStatus"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.storeStatus !== "live" && (
              <div className="space-y-2">
                <Label>Maintenance Message</Label>
                <Textarea
                  rows={2}
                  value={form.maintenanceMessage ?? ""}
                  onChange={(e) =>
                    set("maintenanceMessage", e.target.value || null)
                  }
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Online Ordering</p>
                <p className="text-sm text-muted-foreground">
                  Allow customers to order online
                </p>
              </div>
              <Switch
                checked={form.onlineOrderingEnabled}
                onCheckedChange={(v) => set("onlineOrderingEnabled", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Reservations</p>
                <p className="text-sm text-muted-foreground">
                  Accept table reservations
                </p>
              </div>
              <Switch
                checked={form.reservationsEnabled}
                onCheckedChange={(v) => set("reservationsEnabled", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Customer Reviews</p>
                <p className="text-sm text-muted-foreground">
                  Show customer reviews
                </p>
              </div>
              <Switch
                checked={form.reviewsEnabled}
                onCheckedChange={(v) => set("reviewsEnabled", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Wallet</p>
                <p className="text-sm text-muted-foreground">
                  Show wallet on customer profile
                </p>
              </div>
              <Switch
                checked={form.walletEnabled}
                onCheckedChange={(v) => set("walletEnabled", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Loyalty Points</p>
                <p className="text-sm text-muted-foreground">
                  Reward customers with points
                </p>
              </div>
              <Switch
                checked={form.loyaltyEnabled}
                onCheckedChange={(v) => set("loyaltyEnabled", v)}
              />
            </div>
            <Button
              onClick={() =>
                save([
                  "storeStatus",
                  "maintenanceMessage",
                  "onlineOrderingEnabled",
                  "reservationsEnabled",
                  "reviewsEnabled",
                  "walletEnabled",
                  "loyaltyEnabled",
                ])
              }
              disabled={updateConfig.isPending}
            >
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Branding
            </CardTitle>
            <CardDescription>Logo and favicon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Logo URL</Label>
              <Input
                placeholder="https://..."
                value={form.logoUrl ?? ""}
                onChange={(e) => set("logoUrl", e.target.value || null)}
              />
            </div>
            <div className="space-y-2">
              <Label>Favicon URL</Label>
              <Input
                placeholder="https://..."
                value={form.faviconUrl ?? ""}
                onChange={(e) => set("faviconUrl", e.target.value || null)}
              />
            </div>
            <Button
              onClick={() => save(["logoUrl", "faviconUrl"])}
              disabled={updateConfig.isPending}
            >
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">New Order Alerts</p>
              <Switch
                checked={form.notifyOnNewOrder}
                onCheckedChange={(v) => set("notifyOnNewOrder", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Reservation Alerts</p>
              <Switch
                checked={form.notifyOnReservation}
                onCheckedChange={(v) => set("notifyOnReservation", v)}
              />
            </div>
            <Button
              onClick={() =>
                save(["notifyOnNewOrder", "notifyOnReservation"])
              }
              disabled={updateConfig.isPending}
            >
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Social Links
            </CardTitle>
            <CardDescription>Connect your social profiles</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Instagram</Label>
              <Input
                placeholder="https://instagram.com/..."
                value={form.socialInstagram ?? ""}
                onChange={(e) => set("socialInstagram", e.target.value || null)}
              />
            </div>
            <div className="space-y-2">
              <Label>Facebook</Label>
              <Input
                placeholder="https://facebook.com/..."
                value={form.socialFacebook ?? ""}
                onChange={(e) => set("socialFacebook", e.target.value || null)}
              />
            </div>
            <div className="space-y-2">
              <Label>Twitter / X</Label>
              <Input
                placeholder="https://x.com/..."
                value={form.socialTwitter ?? ""}
                onChange={(e) => set("socialTwitter", e.target.value || null)}
              />
            </div>
            <div className="space-y-2">
              <Label>TikTok</Label>
              <Input
                placeholder="https://tiktok.com/@..."
                value={form.socialTiktok ?? ""}
                onChange={(e) => set("socialTiktok", e.target.value || null)}
              />
            </div>
            <div className="space-y-2">
              <Label>YouTube</Label>
              <Input
                placeholder="https://youtube.com/..."
                value={form.socialYoutube ?? ""}
                onChange={(e) => set("socialYoutube", e.target.value || null)}
              />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp</Label>
              <Input
                placeholder="+234..."
                value={form.socialWhatsapp ?? ""}
                onChange={(e) => set("socialWhatsapp", e.target.value || null)}
              />
            </div>
            <div className="md:col-span-2">
              <Button
                onClick={() =>
                  save([
                    "socialInstagram",
                    "socialFacebook",
                    "socialTwitter",
                    "socialTiktok",
                    "socialYoutube",
                    "socialWhatsapp",
                  ])
                }
                disabled={updateConfig.isPending}
              >
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
