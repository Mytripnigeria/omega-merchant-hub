import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Globe,
  Palette,
  Share2,
  ExternalLink,
  Eye,
  Settings,
  Layout,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import {
  useStorefrontConfig,
  useUpdateStorefrontConfig,
} from "@/hooks/api/use-storefront";
import type {
  MenuLayout,
  StorefrontConfig,
  UpdateStorefrontConfigRequest,
} from "@/types/storefront";

const STATUS_BADGE: Record<StorefrontConfig["storeStatus"], string> = {
  live: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  offline: "bg-gray-200 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300",
  maintenance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const PUBLIC_STOREFRONT_URL =
  (import.meta.env.VITE_STOREFRONT_URL as string | undefined) ?? "";

export default function StorefrontPage() {
  const configQuery = useStorefrontConfig();
  const updateConfig = useUpdateStorefrontConfig();
  const [form, setForm] = useState<StorefrontConfig | null>(null);

  // Re-sync whenever the server object actually changes (all storefront pages
  // write the same `storefrontKeys.config()` object), merging server values
  // over the existing form so an in-progress edit isn't clobbered but fields
  // saved elsewhere show up without a full page reload.
  const configUpdatedAt = configQuery.dataUpdatedAt;
  useEffect(() => {
    const next = configQuery.data;
    if (!next) return;
    setForm((prev) => (prev ? { ...prev, ...next } : next));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configUpdatedAt]);

  if (configQuery.isLoading || !form) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Storefront</h1>
        <Skeleton className="h-96 w-full" />
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
      onSuccess: (next) => {
        setForm((prev) => (prev ? { ...prev, ...next } : next));
        toast.success("Saved");
      },
      onError: (e: Error) => toast.error(e.message ?? "Couldn't save"),
    });
  };

  const isLive = form.storeStatus === "live";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Storefront</h1>
          <p className="text-muted-foreground">Customise your online presence</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Switch
              checked={isLive}
              onCheckedChange={(v) => {
                set("storeStatus", v ? "live" : "offline");
                updateConfig.mutate(
                  { storeStatus: v ? "live" : "offline" },
                  {
                    onError: (e: Error) =>
                      toast.error(e.message ?? "Couldn't update"),
                  },
                );
              }}
            />
            <Badge
              variant="secondary"
              className={STATUS_BADGE[form.storeStatus]}
            >
              {form.storeStatus}
            </Badge>
          </div>
          {PUBLIC_STOREFRONT_URL && (
            <Button variant="outline" asChild>
              <a href={PUBLIC_STOREFRONT_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Storefront
              </a>
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto gap-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="design" className="flex items-center gap-2">
            <Palette className="h-4 w-4" /> Design
          </TabsTrigger>
          <TabsTrigger value="menu" className="flex items-center gap-2">
            <Layout className="h-4 w-4" /> Menu
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Globe className="h-4 w-4" /> SEO
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" /> Social
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Domain</CardTitle>
              <CardDescription>Your storefront's web address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Custom Domain</Label>
                <Input
                  placeholder="www.yourdomain.com"
                  value={form.customDomain ?? ""}
                  onChange={(e) =>
                    set("customDomain", e.target.value || null)
                  }
                />
              </div>
              <Button
                onClick={() => save(["customDomain"])}
                disabled={updateConfig.isPending}
              >
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Store Identity</CardTitle>
              <CardDescription>Public-facing store details</CardDescription>
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
                <Label>Logo URL</Label>
                <Input
                  value={form.logoUrl ?? ""}
                  onChange={(e) => set("logoUrl", e.target.value || null)}
                />
              </div>
              <Button
                onClick={() => save(["storeName", "tagline", "logoUrl"])}
                disabled={updateConfig.isPending}
              >
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="design" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Design Tokens</CardTitle>
              <CardDescription>
                Theme colors. For full customisation, see <a href="/storefront/theme" className="underline">Theme</a>.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={form.primaryColor}
                    onChange={(e) => set("primaryColor", e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={form.primaryColor}
                    onChange={(e) => set("primaryColor", e.target.value)}
                    className="flex-1 font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Background</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={form.backgroundColor}
                    onChange={(e) => set("backgroundColor", e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={form.backgroundColor}
                    onChange={(e) => set("backgroundColor", e.target.value)}
                    className="flex-1 font-mono"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <Button
                  onClick={() => save(["primaryColor", "backgroundColor"])}
                  disabled={updateConfig.isPending}
                >
                  <Save className="h-4 w-4 mr-2" /> Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Menu Display</CardTitle>
              <CardDescription>How menu items appear on the storefront</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Layout</Label>
                <Select
                  value={form.menuLayout}
                  onValueChange={(v) => set("menuLayout", v as MenuLayout)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grouped">Grouped by category</SelectItem>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium">Show Images</p>
                <Switch
                  checked={form.menuShowImages}
                  onCheckedChange={(v) => set("menuShowImages", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium">Show Calories</p>
                <Switch
                  checked={form.menuShowCalories}
                  onCheckedChange={(v) => set("menuShowCalories", v)}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium">Show Prep Time</p>
                <Switch
                  checked={form.menuShowPrepTime}
                  onCheckedChange={(v) => set("menuShowPrepTime", v)}
                />
              </div>
              <Button
                onClick={() =>
                  save([
                    "menuLayout",
                    "menuShowImages",
                    "menuShowCalories",
                    "menuShowPrepTime",
                  ])
                }
                disabled={updateConfig.isPending}
              >
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Defaults</CardTitle>
              <CardDescription>How your storefront appears in search</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={form.seoTitle ?? ""}
                  onChange={(e) => set("seoTitle", e.target.value || null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={form.seoDescription ?? ""}
                  onChange={(e) =>
                    set("seoDescription", e.target.value || null)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Keywords (comma-separated)</Label>
                <Input
                  value={(form.seoKeywords ?? []).join(", ")}
                  onChange={(e) =>
                    set(
                      "seoKeywords",
                      e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Open Graph Image URL</Label>
                <Input
                  value={form.seoOgImageUrl ?? ""}
                  onChange={(e) => set("seoOgImageUrl", e.target.value || null)}
                />
              </div>
              <Button
                onClick={() =>
                  save([
                    "seoTitle",
                    "seoDescription",
                    "seoKeywords",
                    "seoOgImageUrl",
                  ])
                }
                disabled={updateConfig.isPending}
              >
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Profiles</CardTitle>
              <CardDescription>Links shown on the storefront footer</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {(
                [
                  ["socialInstagram", "Instagram"],
                  ["socialFacebook", "Facebook"],
                  ["socialTwitter", "Twitter / X"],
                  ["socialTiktok", "TikTok"],
                  ["socialYoutube", "YouTube"],
                  ["socialWhatsapp", "WhatsApp"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <Label>{label}</Label>
                  <Input
                    value={(form[key] as string | null) ?? ""}
                    onChange={(e) => set(key, (e.target.value || null) as never)}
                  />
                </div>
              ))}
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
                  <Save className="h-4 w-4 mr-2" /> Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
