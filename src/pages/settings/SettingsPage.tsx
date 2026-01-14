import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Store, Bell, CreditCard, Globe, Shield, Palette, Receipt, Users, Clock } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";

export default function SettingsPage() {
  const { currentStore } = useStore();
  const [notifications, setNotifications] = useState({
    orders: true,
    lowStock: true,
    reviews: false,
    marketing: true,
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your store configuration and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto gap-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Basic details about your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" defaultValue={currentStore?.name || "My Store"} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Contact Email</Label>
                  <Input id="storeEmail" type="email" defaultValue="contact@store.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Phone Number</Label>
                  <Input id="storePhone" defaultValue="+1 234 567 8900" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                      <SelectItem value="gmt">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" defaultValue="123 Main Street, City, Country" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Operating Hours
              </CardTitle>
              <CardDescription>Set your store's business hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <div key={day} className="flex items-center justify-between">
                  <span className="font-medium w-28">{day}</span>
                  <div className="flex items-center gap-2">
                    <Input type="time" defaultValue="09:00" className="w-32" />
                    <span>to</span>
                    <Input type="time" defaultValue="22:00" className="w-32" />
                    <Switch defaultChecked />
                  </div>
                </div>
              ))}
              <Button>Update Hours</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">New Orders</p>
                  <p className="text-sm text-muted-foreground">Get notified when new orders come in</p>
                </div>
                <Switch 
                  checked={notifications.orders} 
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, orders: checked }))} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Low Stock Alerts</p>
                  <p className="text-sm text-muted-foreground">Alert when inventory runs low</p>
                </div>
                <Switch 
                  checked={notifications.lowStock} 
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, lowStock: checked }))} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Customer Reviews</p>
                  <p className="text-sm text-muted-foreground">Notify on new reviews</p>
                </div>
                <Switch 
                  checked={notifications.reviews} 
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, reviews: checked }))} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Updates</p>
                  <p className="text-sm text-muted-foreground">Campaign performance updates</p>
                </div>
                <Switch 
                  checked={notifications.marketing} 
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, marketing: checked }))} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Configure accepted payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Cash", enabled: true, icon: "💵" },
                { name: "Credit/Debit Cards", enabled: true, icon: "💳" },
                { name: "Mobile Payments", enabled: true, icon: "📱" },
                { name: "Bank Transfer", enabled: false, icon: "🏦" },
              ].map((method) => (
                <div key={method.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <span className="font-medium">{method.name}</span>
                  </div>
                  <Switch defaultChecked={method.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Tax Settings
              </CardTitle>
              <CardDescription>Configure tax rates and rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Default Tax Rate (%)</Label>
                  <Input type="number" defaultValue="10" />
                </div>
                <div className="space-y-2">
                  <Label>Tax Included in Prices</Label>
                  <Select defaultValue="included">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="included">Tax Included</SelectItem>
                      <SelectItem value="excluded">Tax Excluded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button>Save Tax Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>Customize the look of your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Color Theme</Label>
                <div className="flex gap-3">
                  {["Default", "Dark", "Ocean", "Forest"].map((theme) => (
                    <Button key={theme} variant={theme === "Default" ? "default" : "outline"} size="sm">
                      {theme}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex gap-2">
                  {["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"].map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full border-2 border-transparent hover:border-foreground transition-colors"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Compact Mode</p>
                  <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Localization
              </CardTitle>
              <CardDescription>Language and regional settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Access Control
              </CardTitle>
              <CardDescription>Manage user permissions and access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Session Timeout</p>
                  <p className="text-sm text-muted-foreground">Auto logout after inactivity</p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">IP Whitelisting</p>
                  <p className="text-sm text-muted-foreground">Restrict access to specific IPs</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Log</CardTitle>
              <CardDescription>Recent security events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { event: "Login from new device", time: "2 hours ago", status: "warning" },
                  { event: "Password changed", time: "1 day ago", status: "success" },
                  { event: "2FA enabled", time: "3 days ago", status: "success" },
                  { event: "Failed login attempt", time: "5 days ago", status: "error" },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <span>{log.event}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{log.time}</span>
                      <Badge variant={log.status === "success" ? "default" : log.status === "warning" ? "secondary" : "destructive"}>
                        {log.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
