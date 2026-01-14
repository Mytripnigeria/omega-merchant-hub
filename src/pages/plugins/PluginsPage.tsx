import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Puzzle, Search, Star, Download, Settings, ExternalLink, 
  CreditCard, Mail, MessageSquare, BarChart3, Truck, Calendar
} from "lucide-react";

export default function PluginsPage() {
  const [search, setSearch] = useState("");

  const installedPlugins = [
    { 
      name: "Stripe Payments", 
      description: "Accept credit card payments securely",
      icon: CreditCard,
      status: "active",
      version: "2.1.0"
    },
    { 
      name: "Email Marketing", 
      description: "Automated email campaigns and newsletters",
      icon: Mail,
      status: "active",
      version: "1.5.2"
    },
    { 
      name: "Live Chat", 
      description: "Real-time customer support widget",
      icon: MessageSquare,
      status: "inactive",
      version: "3.0.1"
    },
  ];

  const availablePlugins = [
    { 
      name: "Advanced Analytics", 
      description: "Deep insights into your business performance",
      icon: BarChart3,
      rating: 4.8,
      installs: "5.2k",
      price: "Free"
    },
    { 
      name: "Delivery Partners", 
      description: "Integrate with DoorDash, UberEats, and more",
      icon: Truck,
      rating: 4.5,
      installs: "12k",
      price: "$29/mo"
    },
    { 
      name: "Reservation System", 
      description: "Table booking and waitlist management",
      icon: Calendar,
      rating: 4.7,
      installs: "8.3k",
      price: "$19/mo"
    },
    { 
      name: "Loyalty Plus", 
      description: "Advanced rewards and gamification",
      icon: Star,
      rating: 4.6,
      installs: "3.1k",
      price: "$15/mo"
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Plugins & Integrations</h1>
          <p className="text-muted-foreground">Extend your store with powerful add-ons</p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search plugins..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="installed" className="space-y-6">
        <TabsList>
          <TabsTrigger value="installed">Installed ({installedPlugins.length})</TabsTrigger>
          <TabsTrigger value="browse">Browse Marketplace</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="installed" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {installedPlugins.map((plugin) => (
              <Card key={plugin.name}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <plugin.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{plugin.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">v{plugin.version}</p>
                      </div>
                    </div>
                    <Switch defaultChecked={plugin.status === "active"} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{plugin.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant={plugin.status === "active" ? "default" : "secondary"}>
                      {plugin.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="browse" className="space-y-6">
          <div className="flex items-center gap-4 flex-wrap">
            <Button variant="outline" size="sm">All</Button>
            <Button variant="ghost" size="sm">Payments</Button>
            <Button variant="ghost" size="sm">Marketing</Button>
            <Button variant="ghost" size="sm">Analytics</Button>
            <Button variant="ghost" size="sm">Delivery</Button>
            <Button variant="ghost" size="sm">Communication</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {availablePlugins.map((plugin) => (
              <Card key={plugin.name}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-muted">
                      <plugin.icon className="h-8 w-8 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{plugin.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{plugin.description}</p>
                        </div>
                        <Badge variant="outline">{plugin.price}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {plugin.rating}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Download className="h-4 w-4" />
                          {plugin.installs}
                        </div>
                        <div className="flex-1" />
                        <Button size="sm">Install</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Manage your API keys and webhooks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Public API Key</label>
                  <div className="flex gap-2">
                    <Input value="pk_live_*****************************" readOnly className="font-mono" />
                    <Button variant="outline">Copy</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Secret API Key</label>
                  <div className="flex gap-2">
                    <Input value="sk_live_*****************************" readOnly type="password" className="font-mono" />
                    <Button variant="outline">Reveal</Button>
                    <Button variant="outline">Regenerate</Button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Webhook Endpoints</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Order Events</p>
                      <p className="text-sm text-muted-foreground font-mono">https://api.example.com/webhooks/orders</p>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Add Webhook Endpoint
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>Learn how to integrate with our API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { title: "Quick Start", desc: "Get up and running in 5 minutes" },
                  { title: "API Reference", desc: "Complete endpoint documentation" },
                  { title: "Webhooks Guide", desc: "Handle real-time events" },
                ].map((doc) => (
                  <button key={doc.title} className="p-4 border rounded-lg text-left hover:border-primary transition-colors">
                    <h4 className="font-medium">{doc.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{doc.desc}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
