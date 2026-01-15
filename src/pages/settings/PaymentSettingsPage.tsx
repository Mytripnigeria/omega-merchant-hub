import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Banknote, Smartphone, Building, Plus, Settings } from "lucide-react";

export default function PaymentSettingsPage() {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: "cash", name: "Cash", description: "Accept cash payments", icon: Banknote, enabled: true },
    { id: "card", name: "Card (POS)", description: "Credit/Debit via terminal", icon: CreditCard, enabled: true },
    { id: "transfer", name: "Bank Transfer", description: "Direct bank transfers", icon: Building, enabled: true },
    { id: "mobile", name: "Mobile Money", description: "Opay, Palmpay, etc.", icon: Smartphone, enabled: false },
  ]);

  const togglePayment = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => method.id === id ? { ...method, enabled: !method.enabled } : method)
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Payment Methods</h1>
        <p className="text-sm text-muted-foreground">Configure accepted payment methods</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Accepted Payments</CardTitle>
              <CardDescription>Toggle payment methods on or off</CardDescription>
            </div>
            <Button size="sm" variant="outline" className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Method
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-3">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <method.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 pl-14 sm:pl-0">
                  <Badge variant={method.enabled ? "default" : "secondary"}>
                    {method.enabled ? "Active" : "Inactive"}
                  </Badge>
                  <Switch checked={method.enabled} onCheckedChange={() => togglePayment(method.id)} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Gateway</CardTitle>
            <CardDescription>Connect your payment processor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-dashed gap-3">
              <div>
                <p className="font-medium">No payment gateway connected</p>
                <p className="text-sm text-muted-foreground">Connect Stripe, Paystack, or Flutterwave</p>
              </div>
              <Button size="sm" className="w-full sm:w-auto">
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
