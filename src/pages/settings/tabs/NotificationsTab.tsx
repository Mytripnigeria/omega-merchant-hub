import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Mail, Phone, Bell, BellOff, ShoppingBag, Users, AlertTriangle, TrendingUp, Banknote, Clock } from "lucide-react";
import { toast } from "sonner";
import { useNotificationPreferences, useUpdateNotificationPreferences } from "@/hooks/api/use-settings";
import type { NotificationChannels, NotificationEventToggles } from "@/services/api/notifications";

const CHANNELS: { key: keyof NotificationChannels; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "email", label: "Email", icon: Mail },
  { key: "sms", label: "SMS", icon: Phone },
  { key: "push", label: "Push", icon: Bell },
  { key: "doNotDisturb", label: "Do Not Disturb", icon: BellOff },
];

const EVENTS: { key: keyof NotificationEventToggles; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "newOrder", label: "New orders", icon: ShoppingBag },
  { key: "newCustomer", label: "New customers", icon: Users },
  { key: "lowStock", label: "Low stock", icon: AlertTriangle },
  { key: "dailyReport", label: "Daily reports", icon: TrendingUp },
  { key: "paymentReceived", label: "Payment received", icon: Banknote },
  { key: "shiftReminder", label: "Shift reminders", icon: Clock },
];

export function NotificationsTab() {
  const { data, isLoading } = useNotificationPreferences();
  const update = useUpdateNotificationPreferences();

  if (isLoading) {
    return <Skeleton className="h-96 w-full max-w-2xl" />;
  }
  if (!data) return null;

  const handleChannel = (key: keyof NotificationChannels, value: boolean) => {
    update.mutate(
      { channels: { [key]: value } },
      { onError: () => toast.error("Failed to save") },
    );
  };

  const handleEvent = (key: keyof NotificationEventToggles, value: boolean) => {
    update.mutate(
      { events: { [key]: value } },
      { onError: () => toast.error("Failed to save") },
    );
  };

  return (
    <div className="grid gap-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Channels</CardTitle>
          <CardDescription>How notifications reach you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {CHANNELS.map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                <p className="text-sm font-medium">{label}</p>
              </div>
              <Switch
                checked={data.channels[key]}
                onCheckedChange={(v) => handleChannel(key, v)}
                disabled={update.isPending}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Events</CardTitle>
          <CardDescription>Which events trigger notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {EVENTS.map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                <p className="text-sm font-medium">{label}</p>
              </div>
              <Switch
                checked={data.events[key]}
                onCheckedChange={(v) => handleEvent(key, v)}
                disabled={update.isPending}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
