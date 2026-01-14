import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Globe, Bell, Shield } from "lucide-react";

const StorefrontSettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Storefront Settings</h1>
        <p className="text-muted-foreground">Configure your online store settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" /> General
            </CardTitle>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" /> Features
            </CardTitle>
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
                <p className="font-medium">Reviews</p>
                <p className="text-sm text-muted-foreground">Show customer reviews</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p>New Order Alerts</p>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <p>Reservation Alerts</p>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <p>Low Stock Alerts</p>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" /> Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p>SSL Certificate</p>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <p>Two-Factor Auth</p>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button>Save Changes</Button>
    </div>
  );
};

export default StorefrontSettingsPage;
