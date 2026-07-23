import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Settings,
  CreditCard,
  Users,
  Building2,
  Shield,
  Webhook,
  Globe,
  Receipt,
  Percent,
  Printer,
  Bell,
  Store,
  Truck,
  Activity,
} from "lucide-react";

import { GeneralSettingsTab } from "./tabs/GeneralSettingsTab";
import { StoresSettingsTab } from "./StoresSettingsTab";
import { PaymentMethodsTab } from "./tabs/PaymentMethodsTab";
import { TaxRatesTab } from "./tabs/TaxRatesTab";
import { DeliveryRegionsTab } from "./tabs/DeliveryRegionsTab";
import { ReceiptTab } from "./tabs/ReceiptTab";
import { PrintersTab } from "./tabs/PrintersTab";
import { NotificationsTab } from "./tabs/NotificationsTab";
import { TeamTab } from "./tabs/TeamTab";
import { SecurityTab } from "./tabs/SecurityTab";
import { WebhooksTab } from "./tabs/WebhooksTab";
import { DomainsTab } from "./tabs/DomainsTab";
import { ActivityLogTab } from "./tabs/ActivityLogTab";

const TABS = [
  { value: "general", label: "General", icon: Settings, component: <GeneralSettingsTab /> },
  { value: "stores", label: "Stores", icon: Store, component: <StoresSettingsTab /> },
  { value: "payments", label: "Payment Methods", icon: CreditCard, component: <PaymentMethodsTab /> },
  { value: "tax", label: "Tax", icon: Percent, component: <TaxRatesTab /> },
  { value: "delivery-regions", label: "Delivery Regions", icon: Truck, component: <DeliveryRegionsTab /> },
  { value: "receipt", label: "Receipt", icon: Receipt, component: <ReceiptTab /> },
  { value: "printers", label: "Printers", icon: Printer, component: <PrintersTab /> },
  { value: "notifications", label: "Notifications", icon: Bell, component: <NotificationsTab /> },
  { value: "team", label: "Team", icon: Users, component: <TeamTab /> },
  { value: "security", label: "Security", icon: Shield, component: <SecurityTab /> },
  { value: "webhooks", label: "Webhooks", icon: Webhook, component: <WebhooksTab /> },
  { value: "domains", label: "Domains", icon: Globe, component: <DomainsTab /> },
  { value: "activity", label: "Audit Log", icon: Activity, component: <ActivityLogTab /> },
];

export default function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "general";
  const onTabChange = (val: string) => {
    setSearchParams((prev) => {
      prev.set("tab", val);
      return prev;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your business, stores, payments, and integrations
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
        <ScrollArea className="w-full">
          <TabsList className="inline-flex w-max">
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="gap-2">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {TABS.map(({ value, component }) => (
          <TabsContent key={value} value={value} className="mt-4">
            {component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
