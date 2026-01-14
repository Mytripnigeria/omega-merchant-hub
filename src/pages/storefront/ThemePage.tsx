import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Check, Eye } from "lucide-react";

const ThemePage = () => {
  const themes = [
    { id: 1, name: "Modern Light", colors: ["#ffffff", "#f3f4f6", "#3b82f6"], active: true },
    { id: 2, name: "Dark Elegant", colors: ["#1f2937", "#374151", "#8b5cf6"], active: false },
    { id: 3, name: "Warm Sunset", colors: ["#fef3c7", "#fcd34d", "#f59e0b"], active: false },
    { id: 4, name: "Fresh Green", colors: ["#ecfdf5", "#6ee7b7", "#10b981"], active: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Theme</h1>
          <p className="text-muted-foreground">Customize your storefront appearance</p>
        </div>
        <Button><Palette className="mr-2 h-4 w-4" /> Create Custom Theme</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {themes.map((theme) => (
          <Card key={theme.id} className={theme.active ? "ring-2 ring-primary" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {theme.name}
                {theme.active && <Check className="h-4 w-4 text-primary" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                {theme.colors.map((color, idx) => (
                  <div 
                    key={idx} 
                    className="w-8 h-8 rounded-full border" 
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Eye className="mr-2 h-4 w-4" /> Preview
                </Button>
                <Button variant={theme.active ? "secondary" : "default"} className="flex-1">
                  {theme.active ? "Active" : "Apply"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Custom Colors</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Fine-tune individual color settings for your theme.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemePage;
