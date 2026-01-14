import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, Mail, Smartphone, Monitor, BellOff, Settings, CreditCard, 
  Users, Building2, Shield, Webhook, Globe, Receipt, Percent, 
  Printer, Clock, MapPin, Bell, ChevronRight, Upload
} from "lucide-react";

const sidebarItems = [
  { title: "General", href: "/settings", icon: Settings },
  { title: "Store Info", href: "/settings/store", icon: Building2 },
  { title: "Payment Methods", href: "/settings/payments", icon: CreditCard },
  { title: "Tax Settings", href: "/settings/tax", icon: Percent },
  { title: "Receipt", href: "/settings/receipt", icon: Receipt },
  { title: "Printers", href: "/settings/printers", icon: Printer },
  { title: "Operating Hours", href: "/settings/hours", icon: Clock },
  { title: "Locations", href: "/settings/locations", icon: MapPin },
  { title: "Notifications", href: "/settings/notifications", icon: Bell },
  { title: "Team Members", href: "/settings/team", icon: Users },
  { title: "Security", href: "/settings/security", icon: Shield },
  { title: "Webhooks", href: "/settings/webhooks", icon: Webhook },
  { title: "Domains", href: "/settings/domains", icon: Globe },
];

export default function SettingsPage() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = sidebarItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your store configuration and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Sidebar - Hidden on mobile, shown on desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 text-sm border-0 bg-muted/50"
            />
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {filteredItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-accent text-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-9"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {filteredItems.slice(0, 6).map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border p-3 text-sm transition-colors",
                    isActive
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          {/* Two Column Layout for Desktop */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Store Name */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium">Store Name</CardTitle>
                  <CardDescription>
                    This is your store's visible name shown to customers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input defaultValue="Omega Restaurant" />
                  <div className="flex items-center justify-between pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Please use 32 characters at maximum.</p>
                    <Button size="sm">Save</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Store URL */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium">Store URL</CardTitle>
                  <CardDescription>
                    Your store's unique URL for online ordering.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-0">
                    <span className="flex h-10 items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                      omega.app/
                    </span>
                    <Input defaultValue="omega-restaurant" className="rounded-l-none" />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Please use 48 characters at maximum.</p>
                    <Button size="sm">Save</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Currency & Timezone */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium">Regional Settings</CardTitle>
                  <CardDescription>
                    Configure currency, timezone and language preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select defaultValue="ngn">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ngn">₦ Nigerian Naira (NGN)</SelectItem>
                          <SelectItem value="usd">$ US Dollar (USD)</SelectItem>
                          <SelectItem value="gbp">£ British Pound (GBP)</SelectItem>
                          <SelectItem value="eur">€ Euro (EUR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select defaultValue="wat">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wat">West Africa Time (WAT)</SelectItem>
                          <SelectItem value="gmt">GMT (UTC+0)</SelectItem>
                          <SelectItem value="est">Eastern Time (EST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <Button size="sm">Save</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Store Avatar */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium">Store Logo</CardTitle>
                  <CardDescription>
                    Upload your store's logo for branding.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-lg text-white">
                          OR
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Upload a new logo</p>
                        <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium">Contact Information</CardTitle>
                  <CardDescription>
                    Your store's contact details for customers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" defaultValue="info@omega-restaurant.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input type="tel" defaultValue="+234 803 456 7890" />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Textarea defaultValue="123 Victoria Island, Lagos, Nigeria" rows={2} />
                  </div>
                  <div className="pt-2 border-t">
                    <Button size="sm">Save</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium">Business Hours</CardTitle>
                  <CardDescription>
                    Set your store's operating hours.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-sm font-medium w-12">{day}</span>
                      <div className="flex items-center gap-2">
                        <Input type="time" defaultValue="09:00" className="w-24 h-8 text-sm" />
                        <span className="text-muted-foreground">-</span>
                        <Input type="time" defaultValue="22:00" className="w-24 h-8 text-sm" />
                        <Switch defaultChecked={day !== "Sun"} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Full Width Cards */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium">Notifications</CardTitle>
              <CardDescription>
                Manage how you receive notifications for your store's activity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Monitor className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Web</p>
                      <p className="text-sm text-muted-foreground">Browser notifications</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">admin@omega.com</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Push</p>
                      <p className="text-sm text-muted-foreground">Mobile notifications</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <BellOff className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Do Not Disturb</p>
                      <p className="text-sm text-muted-foreground">Mute all notifications</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-medium">Payment Methods</CardTitle>
                  <CardDescription>
                    Configure accepted payment methods for your store.
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Method
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Cash", description: "Accept cash payments", enabled: true },
                  { name: "Card (POS)", description: "Credit/Debit card via terminal", enabled: true },
                  { name: "Bank Transfer", description: "Direct bank transfers", enabled: true },
                  { name: "Mobile Money", description: "Opay, Palmpay, etc.", enabled: false },
                ].map((method) => (
                  <div key={method.name} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={method.enabled ? "default" : "secondary"}>
                        {method.enabled ? "Active" : "Inactive"}
                      </Badge>
                      <Switch defaultChecked={method.enabled} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tax Settings */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium">Tax Configuration</CardTitle>
              <CardDescription>
                Set up tax rates for your products and services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Default Tax Rate (%)</Label>
                  <Input type="number" defaultValue="7.5" />
                </div>
                <div className="space-y-2">
                  <Label>Tax Name</Label>
                  <Input defaultValue="VAT" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="font-medium">Include tax in prices</p>
                  <p className="text-sm text-muted-foreground">Prices shown include tax</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="pt-2 border-t">
                <Button size="sm">Save Tax Settings</Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that affect your store.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                <div>
                  <p className="font-medium">Delete Store</p>
                  <p className="text-sm text-muted-foreground">Permanently delete this store and all data</p>
                </div>
                <Button variant="destructive" size="sm">Delete Store</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
