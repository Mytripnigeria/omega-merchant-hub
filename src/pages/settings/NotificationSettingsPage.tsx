import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Monitor, Mail, Smartphone, BellOff, ShoppingBag, Users, AlertTriangle, TrendingUp } from "lucide-react";

export default function NotificationSettingsPage() {
  const channels = [
    { id: "web", name: "Web", description: "Browser notifications", icon: Monitor, enabled: true },
    { id: "email", name: "Email", description: "admin@omega.com", icon: Mail, enabled: true },
    { id: "push", name: "Push", description: "Mobile notifications", icon: Smartphone, enabled: true },
    { id: "dnd", name: "Do Not Disturb", description: "Mute all notifications", icon: BellOff, enabled: false },
  ];

  const notifications = [
    { id: "orders", name: "New Orders", description: "Get notified when orders are placed", icon: ShoppingBag, enabled: true },
    { id: "customers", name: "New Customers", description: "When new customers register", icon: Users, enabled: true },
    { id: "lowstock", name: "Low Stock Alerts", description: "When items run low", icon: AlertTriangle, enabled: true },
    { id: "reports", name: "Daily Reports", description: "Daily summary at 9 AM", icon: TrendingUp, enabled: false },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
        <p className="text-sm text-muted-foreground">Manage how you receive notifications</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notification Channels</CardTitle>
            <CardDescription>Choose how to receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {channels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between p-4 rounded-lg border gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <channel.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{channel.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{channel.description}</p>
                  </div>
                </div>
                <Switch defaultChecked={channel.enabled} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notification Types</CardTitle>
            <CardDescription>Select which events trigger notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <notification.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{notification.name}</p>
                    <p className="text-xs text-muted-foreground">{notification.description}</p>
                  </div>
                </div>
                <Switch defaultChecked={notification.enabled} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
