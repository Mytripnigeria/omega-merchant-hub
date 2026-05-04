import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useBusinessSettings, useUpdateBusinessSettings } from "@/hooks/api/use-settings";

export function ReceiptTab() {
  const { data, isLoading } = useBusinessSettings();
  const update = useUpdateBusinessSettings();

  const [header, setHeader] = useState("");
  const [footer, setFooter] = useState("");
  const [showLogo, setShowLogo] = useState(true);
  const [showItemPrices, setShowItemPrices] = useState(true);
  const [showTaxBreakdown, setShowTaxBreakdown] = useState(true);
  const [showServerName, setShowServerName] = useState(false);
  const [showOrderNumber, setShowOrderNumber] = useState(true);
  const [customerCopy, setCustomerCopy] = useState(true);

  useEffect(() => {
    if (data) {
      setHeader(data.receiptHeader ?? "");
      setFooter(data.receiptFooter ?? "");
      setShowLogo(data.receiptShowLogo);
      setShowItemPrices(data.receiptShowItemPrices);
      setShowTaxBreakdown(data.receiptShowTaxBreakdown);
      setShowServerName(data.receiptShowServerName);
      setShowOrderNumber(data.receiptShowOrderNumber);
      setCustomerCopy(data.receiptCustomerCopy);
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await update.mutateAsync({
        receiptHeader: header || undefined,
        receiptFooter: footer || undefined,
        receiptShowLogo: showLogo,
        receiptShowItemPrices: showItemPrices,
        receiptShowTaxBreakdown: showTaxBreakdown,
        receiptShowServerName: showServerName,
        receiptShowOrderNumber: showOrderNumber,
        receiptCustomerCopy: customerCopy,
      });
      toast.success("Receipt settings saved");
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to save");
    }
  };

  if (isLoading) {
    return <Skeleton className="h-96 w-full max-w-2xl" />;
  }

  return (
    <div className="grid gap-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Receipt Content</CardTitle>
          <CardDescription>
            Header and footer printed on every receipt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Header</Label>
            <Textarea
              placeholder="Welcome to our store..."
              rows={2}
              value={header}
              onChange={(e) => setHeader(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Footer</Label>
            <Textarea
              placeholder="Thank you for your business!"
              rows={2}
              value={footer}
              onChange={(e) => setFooter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Display Options</CardTitle>
          <CardDescription>What to show on the receipt</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Show logo", checked: showLogo, set: setShowLogo },
            { label: "Show item prices", checked: showItemPrices, set: setShowItemPrices },
            { label: "Show tax breakdown", checked: showTaxBreakdown, set: setShowTaxBreakdown },
            { label: "Show server name", checked: showServerName, set: setShowServerName },
            { label: "Show order number", checked: showOrderNumber, set: setShowOrderNumber },
            { label: "Print customer copy", checked: customerCopy, set: setCustomerCopy },
          ].map((opt) => (
            <div
              key={opt.label}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <p className="text-sm font-medium">{opt.label}</p>
              <Switch checked={opt.checked} onCheckedChange={opt.set} />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={update.isPending}>
          {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
