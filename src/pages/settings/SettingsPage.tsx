import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Mail, Smartphone, Monitor, BellOff, Settings, CreditCard, Users, Building2, Shield, Webhook, Globe } from "lucide-react";

const sidebarItems = [
  { title: "General", href: "/settings" },
  { title: "Billing", href: "/settings/billing" },
  { title: "Team Members", href: "/settings/team" },
  { title: "Stores", href: "/settings/stores" },
  { title: "Security", href: "/settings/security" },
  { title: "Webhooks", href: "/settings/webhooks" },
  { title: "Domains", href: "/settings/domains" },
];

export default function SettingsPage() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      </div>

      <div className="flex gap-12">
        {/* Settings Sidebar */}
        <aside className="w-56 flex-shrink-0">
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
            {sidebarItems.map((item) => {
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
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Settings Content */}
        <div className="flex-1 max-w-2xl space-y-8">
          {/* Team Name */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium">Team Name</CardTitle>
              <CardDescription>
                This is your team's visible name. For example, the name of your company or department.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input defaultValue="Omega Restaurant" className="max-w-sm" />
              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-sm text-muted-foreground">Please use 32 characters at maximum.</p>
                <Button>Save</Button>
              </div>
            </CardContent>
          </Card>

          {/* Team URL */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium">Team URL</CardTitle>
              <CardDescription>
                This is your team's URL namespace. Within it, your team can inspect projects and configure settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-0 max-w-sm">
                <span className="flex h-10 items-center rounded-l-md border border-r-0 bg-muted px-3 text-sm text-muted-foreground">
                  omega.app/
                </span>
                <Input defaultValue="omega-restaurant" className="rounded-l-none" />
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-sm text-muted-foreground">Please use 48 characters at maximum.</p>
                <Button>Save</Button>
              </div>
            </CardContent>
          </Card>

          {/* Team Avatar */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium">Team Avatar</CardTitle>
              <CardDescription>
                This is your team's avatar. Click on the avatar to upload a custom one from your files.
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
                    <p className="text-sm font-medium">Upload a new avatar</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                  </div>
                </div>
                <Button variant="outline">Upload</Button>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">An avatar is optional but strongly recommended.</p>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium">Notifications</CardTitle>
              <CardDescription>
                Manage how you receive notifications for your team's activity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Web</p>
                    <p className="text-sm text-muted-foreground">Receive notifications in the dashboard.</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">admin@omega.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Push</p>
                    <p className="text-sm text-muted-foreground">Receive notifications on desktop or mobile.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <BellOff className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Mute</p>
                    <p className="text-sm text-muted-foreground">Select projects to mute notifications for.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">No projects</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
