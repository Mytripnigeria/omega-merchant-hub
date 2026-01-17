import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plug, Plus, Settings, Search, CheckCircle2, XCircle, ExternalLink, Key, Calendar, Activity } from "lucide-react";

interface Integration {
  id: number;
  name: string;
  category: string;
  status: "connected" | "not_connected";
  description: string;
  connectedAt?: string;
  lastSync?: string;
  apiKey?: string;
  webhookUrl?: string;
  events?: { date: string; event: string }[];
}

const integrations: Integration[] = [
  { id: 1, name: "Stripe", category: "Payments", status: "connected", description: "Process payments securely", connectedAt: "2026-01-10", lastSync: "2 min ago", apiKey: "sk_live_*****", webhookUrl: "https://webhook.site/stripe", events: [{ date: "2026-01-15", event: "Payment processed" }, { date: "2026-01-14", event: "Subscription renewed" }] },
  { id: 2, name: "Google Analytics", category: "Analytics", status: "connected", description: "Track website traffic", connectedAt: "2026-01-05", lastSync: "5 min ago" },
  { id: 3, name: "Mailchimp", category: "Marketing", status: "not_connected", description: "Email marketing automation" },
  { id: 4, name: "Slack", category: "Communication", status: "connected", description: "Team notifications", connectedAt: "2026-01-12", lastSync: "1 min ago", webhookUrl: "https://hooks.slack.com/services/..." },
  { id: 5, name: "QuickBooks", category: "Accounting", status: "not_connected", description: "Sync financial data" },
  { id: 6, name: "Zapier", category: "Automation", status: "not_connected", description: "Connect with 5000+ apps" },
];

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className={i === 2 ? "col-span-2 md:col-span-1" : ""}>
          <CardContent className="p-3 sm:p-4 pt-6">
            <Skeleton className="h-3 w-20 mb-2" />
            <Skeleton className="h-7 w-8" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function IntegrationsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="transition-all">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function IntegrationsPage() {
  const [search, setSearch] = useState("");
  const isLoading = useLoading(1000);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "configure">("view");

  const stats = [
    { label: "Connected", value: integrations.filter(i => i.status === "connected").length.toString() },
    { label: "Available", value: integrations.length.toString() },
    { label: "Categories", value: [...new Set(integrations.map(i => i.category))].length.toString() },
  ];

  const filteredIntegrations = integrations.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const openViewSheet = (integration: Integration) => {
    setSelectedIntegration(integration);
    setSheetMode("view");
  };

  const openConfigureSheet = (integration: Integration) => {
    setSelectedIntegration(integration);
    setSheetMode("configure");
  };

  const closeSheet = () => {
    setSelectedIntegration(null);
    setIsAddSheetOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Integrations</h1>
          <p className="text-sm text-muted-foreground">Connect third-party services to extend functionality</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={() => setIsAddSheetOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Browse Marketplace
        </Button>
      </div>

      {isLoading ? <StatsSkeleton /> : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={stat.label} className={index === 2 ? "col-span-2 md:col-span-1" : ""}>
              <CardContent className="p-3 sm:p-4 pt-6">
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search integrations..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {isLoading ? <IntegrationsSkeleton /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredIntegrations.map((integration) => (
            <Card key={integration.id} className="transition-all hover:shadow-md cursor-pointer" onClick={() => openViewSheet(integration)}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${integration.status === "connected" ? "bg-primary/10" : "bg-muted"}`}>
                      <Plug className={`h-5 w-5 ${integration.status === "connected" ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <span className="text-sm sm:text-base font-medium">{integration.name}</span>
                      <p className="text-xs text-muted-foreground font-normal">{integration.category}</p>
                    </div>
                  </div>
                  <Badge className={integration.status === "connected" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""} variant="secondary">
                    {integration.status === "connected" ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                    <span className="hidden sm:inline">{integration.status.replace("_", " ")}</span>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground">{integration.description}</p>
                <Button variant="outline" size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); openConfigureSheet(integration); }}>
                  {integration.status === "connected" ? <><Settings className="mr-2 h-4 w-4" />Configure</> : "Connect"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={!!selectedIntegration || isAddSheetOpen} onOpenChange={closeSheet}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center gap-3">
              {selectedIntegration && (
                <div className={`p-2 rounded-lg ${selectedIntegration.status === "connected" ? "bg-primary/10" : "bg-muted"}`}>
                  <Plug className={`h-5 w-5 ${selectedIntegration.status === "connected" ? "text-primary" : "text-muted-foreground"}`} />
                </div>
              )}
              <div>
                <SheetTitle>{selectedIntegration?.name || "Browse Integrations"}</SheetTitle>
                <SheetDescription>{selectedIntegration?.category || "Find and connect new services"}</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {selectedIntegration ? (
            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="config">Config</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm">{selectedIntegration.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <Badge className={selectedIntegration.status === "connected" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""} variant="secondary">
                      {selectedIntegration.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Category</Label>
                    <p className="text-sm font-medium">{selectedIntegration.category}</p>
                  </div>
                  {selectedIntegration.connectedAt && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Connected</Label>
                      <p className="text-sm font-medium">{selectedIntegration.connectedAt}</p>
                    </div>
                  )}
                  {selectedIntegration.lastSync && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Last Sync</Label>
                      <p className="text-sm font-medium">{selectedIntegration.lastSync}</p>
                    </div>
                  )}
                </div>

                <Button variant="outline" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Documentation
                </Button>
              </TabsContent>

              <TabsContent value="config" className="space-y-4 mt-4">
                {selectedIntegration.status === "connected" ? (
                  <>
                    {selectedIntegration.apiKey && (
                      <div className="space-y-2">
                        <Label>API Key</Label>
                        <div className="flex gap-2">
                          <Input value={selectedIntegration.apiKey} readOnly className="font-mono" type="password" />
                          <Button variant="outline" size="icon"><Key className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    )}
                    {selectedIntegration.webhookUrl && (
                      <div className="space-y-2">
                        <Label>Webhook URL</Label>
                        <Input value={selectedIntegration.webhookUrl} readOnly className="font-mono text-xs" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Sync Frequency</Label>
                      <Select defaultValue="realtime">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Plug className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">Connect this integration to configure settings</p>
                    <Button>Connect {selectedIntegration.name}</Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="activity" className="space-y-4 mt-4">
                {selectedIntegration.events && selectedIntegration.events.length > 0 ? (
                  <div className="space-y-3">
                    {selectedIntegration.events.map((event, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{event.event}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{event.date}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4 mt-6">
              <p className="text-sm text-muted-foreground">Browse available integrations in the marketplace.</p>
            </div>
          )}

          <SheetFooter className="mt-6 flex-col sm:flex-row gap-2">
            {selectedIntegration?.status === "connected" ? (
              <>
                <Button variant="outline" className="w-full sm:w-auto">Sync Now</Button>
                <Button variant="destructive" className="w-full sm:w-auto">Disconnect</Button>
              </>
            ) : selectedIntegration ? (
              <Button className="w-full">Connect {selectedIntegration.name}</Button>
            ) : (
              <Button variant="outline" onClick={closeSheet} className="w-full">Close</Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
