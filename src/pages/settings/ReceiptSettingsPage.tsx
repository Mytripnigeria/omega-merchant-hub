import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Receipt as ReceiptIcon, Printer, Upload } from "lucide-react";

export default function ReceiptSettingsPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Receipt Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your receipt layout and content</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Receipt Header</CardTitle>
            <CardDescription>Information shown at the top of receipts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border border-dashed">
              <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <ReceiptIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Receipt Logo</p>
                <p className="text-xs text-muted-foreground">Upload a logo for your receipts</p>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Header Text</Label>
              <Input defaultValue="Thank you for dining with us!" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Receipt Footer</CardTitle>
            <CardDescription>Custom message at the bottom of receipts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Footer Message</Label>
              <Textarea 
                defaultValue="Follow us on Instagram @omega_restaurant" 
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Show QR Code</p>
                <p className="text-xs text-muted-foreground">Add a QR code linking to your website</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Receipt Options</CardTitle>
            <CardDescription>Configure what appears on receipts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Show item prices", enabled: true },
              { name: "Show tax breakdown", enabled: true },
              { name: "Show server name", enabled: true },
              { name: "Show order number", enabled: true },
              { name: "Print customer copy", enabled: false },
            ].map((option) => (
              <div key={option.name} className="flex items-center justify-between p-3 rounded-lg border">
                <p className="text-sm font-medium">{option.name}</p>
                <Switch defaultChecked={option.enabled} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
            <CardDescription>See how your receipt will look</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              <Printer className="mr-2 h-4 w-4" />
              Print Test Receipt
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
