import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Globe, Bell, Shield, Clock, CreditCard } from "lucide-react";

export default function StorefrontSettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Storefront Settings</h1>
        <p className="text-muted-foreground">Configure your online store settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              General
            </CardTitle>
            <CardDescription>Basic store information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Store Name</Label>
              <Input defaultValue="My Restaurant" />
            </div>
            <div className="space-y-2">
              <Label>Store URL</Label>
              <Input defaultValue="myrestaurant.com" />
            </div>
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input defaultValue="contact@myrestaurant.com" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Features
            </CardTitle>
            <CardDescription>Enable or disable store features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Online Ordering</p>
                <p className="text-sm text-muted-foreground">Allow customers to order online</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Reservations</p>
                <p className="text-sm text-muted-foreground">Accept table reservations</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Customer Reviews</p>
                <p className="text-sm text-muted-foreground">Show customer reviews</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">New Order Alerts</p>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Reservation Alerts</p>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Low Stock Alerts</p>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Customer Reviews</p>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Security and access settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">SSL Certificate</p>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Two-Factor Auth</p>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Password Protection</p>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Business Hours
            </CardTitle>
            <CardDescription>Set your operating hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Show Hours on Store</p>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Auto-close Outside Hours</p>
              <Switch />
            </div>
            <Button variant="outline" className="w-full">Configure Hours</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Methods
            </CardTitle>
            <CardDescription>Configure accepted payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Credit/Debit Cards</p>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Cash on Delivery</p>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Digital Wallets</p>
              <Switch />
            </div>
            <Button variant="outline" className="w-full">Manage Payments</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
