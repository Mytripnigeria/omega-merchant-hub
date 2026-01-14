import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plug, Plus, Settings, Search, CheckCircle2, XCircle } from "lucide-react";

export default function IntegrationsPage() {
  const [search, setSearch] = useState("");

  const integrations = [
    { name: "Stripe", category: "Payments", status: "connected", description: "Process payments securely" },
    { name: "Google Analytics", category: "Analytics", status: "connected", description: "Track website traffic" },
    { name: "Mailchimp", category: "Marketing", status: "not_connected", description: "Email marketing automation" },
    { name: "Slack", category: "Communication", status: "connected", description: "Team notifications" },
    { name: "QuickBooks", category: "Accounting", status: "not_connected", description: "Sync financial data" },
    { name: "Zapier", category: "Automation", status: "not_connected", description: "Connect with 5000+ apps" },
  ];

  const stats = [
    { label: "Connected", value: integrations.filter(i => i.status === "connected").length.toString() },
    { label: "Available", value: integrations.length.toString() },
    { label: "Categories", value: [...new Set(integrations.map(i => i.category))].length.toString() },
  ];

  const filteredIntegrations = integrations.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Integrations</h1>
          <p className="text-muted-foreground">Connect third-party services to extend functionality</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Browse Marketplace
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search integrations..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="pl-10" 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.name} className="transition-all hover:shadow-elevated">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${integration.status === "connected" ? "bg-primary/10" : "bg-muted"}`}>
                    <Plug className={`h-5 w-5 ${integration.status === "connected" ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <span className="text-base font-medium">{integration.name}</span>
                    <p className="text-xs text-muted-foreground font-normal">{integration.category}</p>
                  </div>
                </div>
                <Badge variant={integration.status === "connected" ? "default" : "secondary"} className="gap-1">
                  {integration.status === "connected" ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {integration.status.replace("_", " ")}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{integration.description}</p>
              <Button variant="outline" size="sm" className="w-full">
                {integration.status === "connected" ? (
                  <>
                    <Settings className="mr-2 h-4 w-4" />
                    Configure
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
