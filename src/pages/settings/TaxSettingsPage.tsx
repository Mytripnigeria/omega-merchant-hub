import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

export default function TaxSettingsPage() {
  const [taxes, setTaxes] = useState([
    { id: 1, name: "VAT", rate: 7.5, enabled: true },
    { id: 2, name: "Service Charge", rate: 10, enabled: true },
  ]);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Tax Settings</h1>
        <p className="text-sm text-muted-foreground">Manage tax rates for your store</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Tax Rates</CardTitle>
              <CardDescription>Configure taxes applied to orders</CardDescription>
            </div>
            <Button size="sm" variant="outline" className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Tax
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {taxes.map((tax) => (
              <div key={tax.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-3">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{tax.name}</p>
                    <p className="text-sm text-muted-foreground">{tax.rate}%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <Badge variant={tax.enabled ? "default" : "secondary"}>
                    {tax.enabled ? "Active" : "Inactive"}
                  </Badge>
                  <Switch checked={tax.enabled} />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tax Display</CardTitle>
            <CardDescription>How taxes are shown to customers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show prices including tax</p>
                <p className="text-sm text-muted-foreground">Display tax-inclusive prices on menus</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show tax breakdown on receipt</p>
                <p className="text-sm text-muted-foreground">List individual tax amounts</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
