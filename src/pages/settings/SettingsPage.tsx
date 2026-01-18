import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Settings, CreditCard, Users, Building2, Shield, Webhook, Globe, Receipt, Percent, 
  Printer, Clock, MapPin, Bell, Upload, Plus, MoreHorizontal, Trash2, Key, Smartphone,
  History, Monitor, Mail, BellOff, ShoppingBag, AlertTriangle, TrendingUp, Banknote,
  Wifi, WifiOff, CheckCircle, AlertCircle, ExternalLink, Search, Store
} from "lucide-react";
import { StoresSettingsTab } from "./StoresSettingsTab";

function SettingsSkeleton() {
  return (
    <div className="grid gap-6 max-w-2xl">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// General Settings Tab
function GeneralSettings() {
  return (
    <div className="grid gap-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Store Logo</CardTitle>
          <CardDescription>Upload your store's logo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-20 w-20 shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-xl text-white">
                OR
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB. Recommended: 200x200px</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Business Details</CardTitle>
          <CardDescription>Your store's legal and display information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Store Name</Label>
              <Input defaultValue="Omega Restaurant" />
            </div>
            <div className="space-y-2">
              <Label>Legal Name</Label>
              <Input defaultValue="Omega Foods Ltd" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Business Registration Number</Label>
              <Input placeholder="Enter registration number" />
            </div>
            <div className="space-y-2">
              <Label>Tax ID / VAT Number</Label>
              <Input placeholder="Enter tax ID" />
            </div>
          </div>
          <Button size="sm">Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
          <CardDescription>How customers can reach you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" defaultValue="info@omega-restaurant.com" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input type="tel" defaultValue="+234 803 456 7890" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea defaultValue="123 Victoria Island, Lagos, Nigeria" rows={3} />
          </div>
          <Button size="sm">Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Regional Settings</CardTitle>
          <CardDescription>Configure currency, timezone and language preferences</CardDescription>
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
          <Button size="sm">Save</Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Payment Settings Tab
function PaymentSettings() {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: "cash", name: "Cash", description: "Accept cash payments", icon: Banknote, enabled: true },
    { id: "card", name: "Card (POS)", description: "Credit/Debit via terminal", icon: CreditCard, enabled: true },
    { id: "transfer", name: "Bank Transfer", description: "Direct bank transfers", icon: Building2, enabled: true },
    { id: "mobile", name: "Mobile Money", description: "Opay, Palmpay, etc.", icon: Smartphone, enabled: false },
  ]);

  const togglePayment = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => method.id === id ? { ...method, enabled: !method.enabled } : method)
    );
  };

  return (
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
  );
}

// Tax Settings Tab
function TaxSettings() {
  const [taxes] = useState([
    { id: 1, name: "VAT", rate: 7.5, enabled: true },
    { id: 2, name: "Service Charge", rate: 10, enabled: true },
  ]);

  return (
    <div className="grid gap-6 max-w-2xl">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Tax Rates</CardTitle>
            <CardDescription>Configure taxes applied to orders</CardDescription>
          </div>
          <Button size="sm" variant="outline" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Tax
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {taxes.map((tax) => (
            <div key={tax.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-3">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium">{tax.name}</p>
                  <p className="text-sm text-muted-foreground">{tax.rate}%</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <Badge variant={tax.enabled ? "default" : "secondary"}>
                  {tax.enabled ? "Active" : "Inactive"}
                </Badge>
                <Switch checked={tax.enabled} />
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tax Display</CardTitle>
          <CardDescription>How taxes are shown to customers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Show prices including tax</p>
              <p className="text-xs text-muted-foreground">Display tax-inclusive prices on menus</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Show tax breakdown on receipt</p>
              <p className="text-xs text-muted-foreground">List individual tax amounts</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Receipt Settings Tab
function ReceiptSettings() {
  return (
    <div className="grid gap-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Receipt Header</CardTitle>
          <CardDescription>Information shown at the top of receipts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border border-dashed">
            <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Receipt className="h-8 w-8 text-muted-foreground" />
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
            <Textarea defaultValue="Follow us on Instagram @omega_restaurant" rows={3} />
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
  );
}

// Printer Settings Tab
function PrinterSettings() {
  const printers = [
    { id: 1, name: "Kitchen Printer", location: "Main Kitchen", type: "Receipt", connected: true },
    { id: 2, name: "Bar Printer", location: "Bar Counter", type: "Receipt", connected: true },
    { id: 3, name: "Front Desk", location: "Reception", type: "Receipt", connected: false },
  ];

  return (
    <div className="grid gap-6 max-w-2xl">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Connected Printers</CardTitle>
            <CardDescription>{printers.filter(p => p.connected).length} of {printers.length} online</CardDescription>
          </div>
          <Button size="sm" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Printer
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {printers.map((printer) => (
            <div key={printer.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-3">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Printer className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{printer.name}</p>
                    {printer.connected ? (
                      <Wifi className="h-3 w-3 text-green-500" />
                    ) : (
                      <WifiOff className="h-3 w-3 text-destructive" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{printer.location} • {printer.type}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2 pl-14 sm:pl-0">
                <Badge variant={printer.connected ? "default" : "secondary"}>
                  {printer.connected ? "Online" : "Offline"}
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Print Routing</CardTitle>
          <CardDescription>Configure which orders go to which printer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { category: "Food Orders", printer: "Kitchen Printer" },
            { category: "Beverages", printer: "Bar Printer" },
            { category: "Receipts", printer: "Front Desk" },
          ].map((route) => (
            <div key={route.category} className="flex items-center justify-between p-3 rounded-lg border">
              <p className="text-sm font-medium">{route.category}</p>
              <Badge variant="secondary">{route.printer}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Hours Settings Tab
function HoursSettings() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="grid gap-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Schedule</CardTitle>
          <CardDescription>Set opening and closing times for each day</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {days.map((day, index) => (
            <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border gap-3">
              <div className="flex items-center justify-between sm:justify-start">
                <span className="font-medium text-sm w-24">{day}</span>
                <Switch defaultChecked={index !== 6} className="sm:hidden" />
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Input type="time" defaultValue="09:00" className="flex-1 sm:w-28 h-9" />
                <span className="text-muted-foreground text-sm">to</span>
                <Input type="time" defaultValue={index === 6 ? "18:00" : "22:00"} className="flex-1 sm:w-28 h-9" />
                <Switch defaultChecked={index !== 6} className="hidden sm:flex" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Holiday Hours</CardTitle>
          <CardDescription>Set special hours for holidays</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-muted-foreground text-sm mb-4">No holiday hours configured</p>
              <Button variant="outline" size="sm">Add Holiday</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Auto-close Store</CardTitle>
          <CardDescription>Automatically pause online orders outside business hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Pause orders when closed</p>
              <p className="text-xs text-muted-foreground">Customers won't be able to place orders outside business hours</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Button className="w-fit">Save Changes</Button>
    </div>
  );
}

// Locations Settings Tab
function LocationsSettings() {
  const locations = [
    { id: 1, name: "Victoria Island", address: "123 Adeola Odeku St, VI", status: "active", isMain: true },
    { id: 2, name: "Lekki Phase 1", address: "45 Admiralty Way, Lekki", status: "active", isMain: false },
    { id: 3, name: "Ikoyi", address: "12 Bourdillon Rd, Ikoyi", status: "inactive", isMain: false },
  ];

  return (
    <div className="grid gap-6 max-w-2xl">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Store Locations</CardTitle>
            <CardDescription>{locations.filter(l => l.status === "active").length} active locations</CardDescription>
          </div>
          <Button size="sm" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Location
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {locations.map((location) => (
            <div key={location.id} className="p-4 rounded-lg border space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{location.name}</p>
                      {location.isMain && <Badge variant="secondary" className="text-xs shrink-0">Main</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground break-words">{location.address}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-end sm:justify-start sm:pl-13">
                <Badge variant={location.status === "active" ? "default" : "secondary"}>
                  {location.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Delivery Zones</CardTitle>
          <CardDescription>Configure delivery areas for each location</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-muted-foreground text-sm mb-4">No delivery zones configured</p>
              <Button variant="outline" size="sm">Configure Zones</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Notification Settings Tab
function NotificationSettings() {
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
  );
}

// Team Settings Tab
function TeamSettings() {
  const [search, setSearch] = useState("");
  
  const teamMembers = [
    { id: 1, name: "John Doe", email: "john@omega.com", role: "Owner", avatar: "JD" },
    { id: 2, name: "Jane Smith", email: "jane@omega.com", role: "Manager", avatar: "JS" },
    { id: 3, name: "Mike Johnson", email: "mike@omega.com", role: "Staff", avatar: "MJ" },
    { id: 4, name: "Sarah Williams", email: "sarah@omega.com", role: "Staff", avatar: "SW" },
  ];

  return (
    <div className="grid gap-6 max-w-3xl">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Team Members</CardTitle>
            <CardDescription>{teamMembers.length} members</CardDescription>
          </div>
          <Button size="sm" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search members..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-muted/50 border-0"
            />
          </div>
          
          <div className="space-y-2">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border gap-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 pl-13 sm:pl-0">
                  <Badge variant={member.role === "Owner" ? "default" : "secondary"}>
                    {member.role}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pending Invitations</CardTitle>
          <CardDescription>Invitations waiting to be accepted</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-center">
            <div>
              <Mail className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No pending invitations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Security Settings Tab
function SecuritySettings() {
  const sessions = [
    { id: 1, device: "Chrome on Windows", location: "Lagos, Nigeria", lastActive: "Active now", current: true },
    { id: 2, device: "Safari on iPhone", location: "Lagos, Nigeria", lastActive: "2 hours ago", current: false },
  ];

  return (
    <div className="grid gap-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Password</CardTitle>
          <CardDescription>Change your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Key className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">Change</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Authenticator App</p>
                <p className="text-sm text-muted-foreground">Use an app like Google Authenticator</p>
              </div>
            </div>
            <Switch />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">SMS Verification</p>
                <p className="text-sm text-muted-foreground">Receive codes via text message</p>
              </div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Active Sessions</CardTitle>
            <CardDescription>Manage your logged-in devices</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="text-destructive w-full sm:w-auto">
            Sign Out All
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <History className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-sm">{session.device}</p>
                    {session.current && <Badge variant="secondary" className="text-xs">Current</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{session.location} • {session.lastActive}</p>
                </div>
              </div>
              {!session.current && (
                <Button variant="ghost" size="sm" className="text-destructive w-full sm:w-auto">
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Webhook Settings Tab
function WebhookSettings() {
  const webhooks = [
    { id: 1, name: "Order Created", url: "https://api.example.com/orders", events: ["order.created"], status: "active" },
    { id: 2, name: "Payment Received", url: "https://api.example.com/payments", events: ["payment.completed"], status: "active" },
  ];

  return (
    <div className="grid gap-6 max-w-2xl">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Webhook Endpoints</CardTitle>
            <CardDescription>{webhooks.length} configured endpoints</CardDescription>
          </div>
          <Button size="sm" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Webhook
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {webhooks.length > 0 ? (
            webhooks.map((webhook) => (
              <div key={webhook.id} className="p-4 rounded-lg border space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Webhook className="h-4 w-4 text-muted-foreground shrink-0" />
                    <p className="font-medium truncate">{webhook.name}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={webhook.status === "active" ? "default" : "secondary"}>
                      {webhook.status}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-mono truncate">{webhook.url}</p>
                <div className="flex flex-wrap gap-1">
                  {webhook.events.map((event) => (
                    <Badge key={event} variant="secondary" className="text-xs">{event}</Badge>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Webhook className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">No webhooks configured</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Events</CardTitle>
          <CardDescription>Events that can trigger webhooks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              "order.created", "order.updated", "order.completed", "order.cancelled",
              "payment.completed", "payment.failed", "customer.created", "inventory.low"
            ].map((event) => (
              <Badge key={event} variant="outline" className="justify-start py-2 px-3">
                {event}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Domain Settings Tab
function DomainSettings() {
  const domains = [
    { id: 1, domain: "omega-restaurant.lovable.app", type: "Lovable", status: "active", primary: true },
    { id: 2, domain: "www.omega-restaurant.com", type: "Custom", status: "pending", primary: false },
  ];

  return (
    <div className="grid gap-6 max-w-2xl">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Connected Domains</CardTitle>
            <CardDescription>Domains pointing to your store</CardDescription>
          </div>
          <Button size="sm" className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Domain
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {domains.map((domain) => (
            <div key={domain.id} className="p-4 rounded-lg border space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-sm break-all">{domain.domain}</p>
                      {domain.primary && <Badge variant="secondary" className="text-xs shrink-0">Primary</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{domain.type} domain</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-end sm:justify-start sm:pl-13">
                {domain.status === "active" ? (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Custom Domain</CardTitle>
          <CardDescription>Connect your own domain to your store</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Domain Name</Label>
            <Input placeholder="www.yourdomain.com" />
          </div>
          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <p className="font-medium text-sm">DNS Configuration</p>
            <p className="text-xs text-muted-foreground">
              Add a CNAME record pointing to <code className="px-1 py-0.5 bg-muted rounded">cname.lovable.app</code>
            </p>
          </div>
          <Button size="sm">Verify Domain</Button>
        </CardContent>
      </Card>
    </div>
  );
}

const tabItems = [
  { value: "general", label: "General", icon: Settings },
  { value: "stores", label: "Stores", icon: Store },
  { value: "payments", label: "Payments", icon: CreditCard },
  { value: "tax", label: "Tax", icon: Percent },
  { value: "receipt", label: "Receipt", icon: Receipt },
  { value: "printers", label: "Printers", icon: Printer },
  { value: "hours", label: "Hours", icon: Clock },
  { value: "locations", label: "Locations", icon: MapPin },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "team", label: "Team", icon: Users },
  { value: "security", label: "Security", icon: Shield },
  { value: "webhooks", label: "Webhooks", icon: Webhook },
  { value: "domains", label: "Domains", icon: Globe },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const isLoading = useLoading(800);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your store configuration and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Scrollable Tab List */}
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="inline-flex h-auto p-1 bg-muted/50 rounded-lg w-auto gap-1">
            {tabItems.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 px-3 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>

        {/* Tab Contents */}
        {isLoading ? (
          <SettingsSkeleton />
        ) : (
          <>
            <TabsContent value="general" className="mt-0">
              <GeneralSettings />
            </TabsContent>
            <TabsContent value="stores" className="mt-0">
              <StoresSettingsTab />
            </TabsContent>
            <TabsContent value="payments" className="mt-0">
              <PaymentSettings />
            </TabsContent>
            <TabsContent value="tax" className="mt-0">
              <TaxSettings />
            </TabsContent>
            <TabsContent value="receipt" className="mt-0">
              <ReceiptSettings />
            </TabsContent>
            <TabsContent value="printers" className="mt-0">
              <PrinterSettings />
            </TabsContent>
            <TabsContent value="hours" className="mt-0">
              <HoursSettings />
            </TabsContent>
            <TabsContent value="locations" className="mt-0">
              <LocationsSettings />
            </TabsContent>
            <TabsContent value="notifications" className="mt-0">
              <NotificationSettings />
            </TabsContent>
            <TabsContent value="team" className="mt-0">
              <TeamSettings />
            </TabsContent>
            <TabsContent value="security" className="mt-0">
              <SecuritySettings />
            </TabsContent>
            <TabsContent value="webhooks" className="mt-0">
              <WebhookSettings />
            </TabsContent>
            <TabsContent value="domains" className="mt-0">
              <DomainSettings />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}