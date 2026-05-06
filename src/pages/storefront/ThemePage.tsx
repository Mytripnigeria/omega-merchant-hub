import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Palette, Check, Trash2, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import {
  useStorefrontConfig,
  useStorefrontThemes,
  useUpdateStorefrontConfig,
  useCreateStorefrontTheme,
  useDeleteStorefrontTheme,
} from "@/hooks/api/use-storefront";
import type { CreateThemePresetRequest, ThemePreset } from "@/types/storefront";

const DEFAULT_PRESET: CreateThemePresetRequest = {
  name: "",
  description: "",
  primaryColor: "#3B82F6",
  secondaryColor: "#1F2937",
  accentColor: "#F59E0B",
  backgroundColor: "#FFFFFF",
  foregroundColor: "#0F172A",
  fontFamily: "Inter",
};

export default function ThemePage() {
  const configQuery = useStorefrontConfig();
  const themesQuery = useStorefrontThemes();
  const updateConfig = useUpdateStorefrontConfig();
  const createTheme = useCreateStorefrontTheme();
  const deleteTheme = useDeleteStorefrontTheme();

  const [createOpen, setCreateOpen] = useState(false);
  const [presetForm, setPresetForm] = useState<CreateThemePresetRequest>(
    DEFAULT_PRESET,
  );

  const config = configQuery.data;
  const themes = themesQuery.data ?? [];

  const handleApply = (preset: ThemePreset) => {
    updateConfig.mutate(
      { activeThemeId: preset.id },
      {
        onSuccess: () => toast.success(`Applied ${preset.name}`),
        onError: (e: Error) => toast.error(e.message ?? "Couldn't apply"),
      },
    );
  };

  const handleDelete = (preset: ThemePreset) => {
    if (preset.isSystem) return;
    if (!confirm(`Delete preset "${preset.name}"?`)) return;
    deleteTheme.mutate(preset.id, {
      onSuccess: () => toast.success("Preset deleted"),
      onError: (e: Error) => toast.error(e.message ?? "Couldn't delete"),
    });
  };

  const handleCreate = () => {
    if (!presetForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    createTheme.mutate(presetForm, {
      onSuccess: () => {
        toast.success("Theme created");
        setPresetForm(DEFAULT_PRESET);
        setCreateOpen(false);
      },
      onError: (e: Error) => toast.error(e.message ?? "Couldn't create"),
    });
  };

  const handleColor = (key: keyof typeof DEFAULT_PRESET, value: string) => {
    if (!config) return;
    updateConfig.mutate(
      { [key]: value },
      {
        onError: (e: Error) => toast.error(e.message ?? "Couldn't update"),
      },
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Theme</h1>
          <p className="text-muted-foreground">
            Customise the look of your storefront
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Palette className="mr-2 h-4 w-4" /> Create Custom Theme
        </Button>
      </div>

      {themesQuery.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {themes.map((theme) => {
            const isActive = config?.activeThemeId === theme.id;
            return (
              <Card
                key={theme.id}
                className={`transition-all hover:shadow-md ${
                  isActive ? "ring-2 ring-primary" : ""
                }`}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="truncate">{theme.name}</span>
                    {isActive && (
                      <Badge variant="default" className="gap-1">
                        <Check className="h-3 w-3" /> Active
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="truncate">
                    {theme.description ?? (theme.isSystem ? "System preset" : "Custom theme")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    {[
                      theme.primaryColor,
                      theme.secondaryColor,
                      theme.accentColor,
                      theme.backgroundColor,
                      theme.foregroundColor,
                    ].map((c, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-lg border shadow-sm"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {!isActive ? (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleApply(theme)}
                        disabled={updateConfig.isPending}
                      >
                        Apply
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="flex-1" disabled>
                        Active
                      </Button>
                    )}
                    {!theme.isSystem && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(theme)}
                        disabled={deleteTheme.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {config && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Colors</CardTitle>
            <CardDescription>
              Fine-tune individual colors. Changes save immediately.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <ColorRow
                label="Primary"
                value={config.primaryColor}
                onChange={(v) => handleColor("primaryColor", v)}
              />
              <ColorRow
                label="Secondary"
                value={config.secondaryColor}
                onChange={(v) => handleColor("secondaryColor", v)}
              />
              <ColorRow
                label="Accent"
                value={config.accentColor}
                onChange={(v) => handleColor("accentColor", v)}
              />
              <ColorRow
                label="Background"
                value={config.backgroundColor}
                onChange={(v) => handleColor("backgroundColor", v)}
              />
              <ColorRow
                label="Foreground"
                value={config.foregroundColor}
                onChange={(v) => handleColor("foregroundColor", v)}
              />
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Input
                  value={config.fontFamily}
                  onChange={(e) =>
                    updateConfig.mutate({ fontFamily: e.target.value })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create Custom Theme</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={presetForm.name}
                onChange={(e) =>
                  setPresetForm({ ...presetForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={presetForm.description ?? ""}
                onChange={(e) =>
                  setPresetForm({ ...presetForm, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ColorRow
                label="Primary"
                value={presetForm.primaryColor}
                onChange={(v) =>
                  setPresetForm({ ...presetForm, primaryColor: v })
                }
              />
              <ColorRow
                label="Secondary"
                value={presetForm.secondaryColor}
                onChange={(v) =>
                  setPresetForm({ ...presetForm, secondaryColor: v })
                }
              />
              <ColorRow
                label="Accent"
                value={presetForm.accentColor}
                onChange={(v) =>
                  setPresetForm({ ...presetForm, accentColor: v })
                }
              />
              <ColorRow
                label="Background"
                value={presetForm.backgroundColor}
                onChange={(v) =>
                  setPresetForm({ ...presetForm, backgroundColor: v })
                }
              />
              <ColorRow
                label="Foreground"
                value={presetForm.foregroundColor}
                onChange={(v) =>
                  setPresetForm({ ...presetForm, foregroundColor: v })
                }
              />
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Input
                  value={presetForm.fontFamily ?? ""}
                  onChange={(e) =>
                    setPresetForm({ ...presetForm, fontFamily: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <SheetFooter className="mt-4 pt-4 border-t flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={handleCreate}
              disabled={createTheme.isPending}
            >
              <Plus className="h-4 w-4 mr-2" /> Create Theme
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 p-1 cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 font-mono"
        />
      </div>
    </div>
  );
}
