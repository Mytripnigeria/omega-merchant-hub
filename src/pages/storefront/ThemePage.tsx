import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Palette, Check, Eye } from "lucide-react";

export default function ThemePage() {
  const [activeTheme, setActiveTheme] = useState(1);

  const themes = [
    { id: 1, name: "Modern Light", colors: ["#ffffff", "#f3f4f6", "#3b82f6"], description: "Clean and professional" },
    { id: 2, name: "Dark Elegant", colors: ["#1f2937", "#374151", "#8b5cf6"], description: "Sophisticated dark mode" },
    { id: 3, name: "Warm Sunset", colors: ["#fef3c7", "#fcd34d", "#f59e0b"], description: "Warm and inviting" },
    { id: 4, name: "Fresh Green", colors: ["#ecfdf5", "#6ee7b7", "#10b981"], description: "Natural and organic" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Theme</h1>
          <p className="text-muted-foreground">Customize your storefront appearance</p>
        </div>
        <Button>
          <Palette className="mr-2 h-4 w-4" />
          Create Custom Theme
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {themes.map((theme) => (
          <Card 
            key={theme.id} 
            className={`cursor-pointer transition-all hover:shadow-elevated ${activeTheme === theme.id ? "ring-2 ring-primary" : ""}`}
            onClick={() => setActiveTheme(theme.id)}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-base">
                {theme.name}
                {activeTheme === theme.id && (
                  <Badge variant="default" className="gap-1">
                    <Check className="h-3 w-3" />
                    Active
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{theme.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                {theme.colors.map((color, idx) => (
                  <div 
                    key={idx} 
                    className="w-10 h-10 rounded-lg border shadow-sm" 
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                {activeTheme !== theme.id && (
                  <Button size="sm" className="flex-1" onClick={() => setActiveTheme(theme.id)}>
                    Apply
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Custom Colors</CardTitle>
          <CardDescription>Fine-tune individual color settings for your theme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex gap-2">
                <Input type="color" defaultValue="#3B82F6" className="w-12 h-10 p-1 cursor-pointer" />
                <Input defaultValue="#3B82F6" className="flex-1 font-mono" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <div className="flex gap-2">
                <Input type="color" defaultValue="#10B981" className="w-12 h-10 p-1 cursor-pointer" />
                <Input defaultValue="#10B981" className="flex-1 font-mono" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex gap-2">
                <Input type="color" defaultValue="#FFFFFF" className="w-12 h-10 p-1 cursor-pointer" />
                <Input defaultValue="#FFFFFF" className="flex-1 font-mono" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex gap-2">
                <Input type="color" defaultValue="#1F2937" className="w-12 h-10 p-1 cursor-pointer" />
                <Input defaultValue="#1F2937" className="flex-1 font-mono" />
              </div>
            </div>
          </div>
          <Button>Save Custom Colors</Button>
        </CardContent>
      </Card>
    </div>
  );
}
