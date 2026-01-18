import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Key, Bell, Shield, Clock, Users, Monitor, Printer } from "lucide-react";

export default function WorkstationSettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Workstation Settings</h1>
        <p className="text-muted-foreground">Configure workstation access and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              PIN Settings
            </CardTitle>
            <CardDescription>Configure staff PIN requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>PIN Length</Label>
              <Select defaultValue="4">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">4 Digits</SelectItem>
                  <SelectItem value="6">6 Digits</SelectItem>
                  <SelectItem value="8">8 Digits</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Require PIN Change</p>
                <p className="text-xs text-muted-foreground">Force PIN change every 30 days</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Allow PIN Recovery</p>
                <p className="text-xs text-muted-foreground">Let managers reset staff PINs</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Display Settings
            </CardTitle>
            <CardDescription>Configure workstation display</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Screen Timeout</Label>
              <Select defaultValue="5">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 minute</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Show Clock</p>
                <p className="text-xs text-muted-foreground">Display clock on workstation</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Use dark theme for workstation</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Shift Settings
            </CardTitle>
            <CardDescription>Configure shift management rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Auto Clock-out</p>
                <p className="text-xs text-muted-foreground">End shifts after 12 hours</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Require Break Logging</p>
                <p className="text-xs text-muted-foreground">Staff must log breaks</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Allow Shift Swap</p>
                <p className="text-xs text-muted-foreground">Staff can request shift swaps</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label>Minimum Break Duration</Label>
              <Select defaultValue="15">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Workstation alert preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">New Order Sound</p>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Shift Reminder</p>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Low Stock Alert</p>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Break Reminders</p>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label>Alert Volume</Label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="mute">Mute</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Access control settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Manager Override Required</p>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Lock After Failed Attempts</p>
                <p className="text-xs text-muted-foreground">Lock after 3 wrong PINs</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Activity Logging</p>
                <p className="text-xs text-muted-foreground">Log all workstation actions</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Void/Refund Requires Manager</p>
                <p className="text-xs text-muted-foreground">Manager PIN for voids</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Printer className="h-5 w-5" />
              Receipt & Printing
            </CardTitle>
            <CardDescription>Receipt printing settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Auto-print Kitchen Orders</p>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Print Customer Receipt</p>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Print Shift Summary</p>
              <Switch />
            </div>
            <Button variant="outline" className="w-full">Configure Printers</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Access
            </CardTitle>
            <CardDescription>Default permissions for new users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Can View Reports</p>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Can Manage Orders</p>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Can Open Cash Drawer</p>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Can Apply Discounts</p>
              <Switch />
            </div>
            <Button variant="outline" className="w-full">Manage Roles</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Advanced
            </CardTitle>
            <CardDescription>Advanced workstation options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Offline Mode</p>
                <p className="text-xs text-muted-foreground">Allow offline transactions</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Auto-sync Data</p>
                <p className="text-xs text-muted-foreground">Sync when online</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Developer Mode</p>
                <p className="text-xs text-muted-foreground">Enable debug options</p>
              </div>
              <Switch />
            </div>
            <Button variant="outline" className="w-full">Clear Cache</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}