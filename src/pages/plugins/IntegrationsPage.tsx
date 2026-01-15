import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Plug, Plus, Settings, Search, CheckCircle2, XCircle } from "lucide-react";

interface Integration {
  name: string;
  category: string;
  status: "connected" | "not_connected";
  description: string;
}

const integrations: Integration[] = [
  { name: "Stripe", category: "Payments", status: "connected", description: "Process payments securely" },
  { name: "Google Analytics", category: "Analytics", status: "connected", description: "Track website traffic" },
  { name: "Mailchimp", category: "Marketing", status: "not_connected", description: "Email marketing automation" },
  { name: "Slack", category: "Communication", status: "connected", description: "Team notifications" },
  { name: "QuickBooks", category: "Accounting", status: "not_connected", description: "Sync financial data" },
  { name: "Zapier", category: "Automation", status: "not_connected", description: "Connect with 5000+ apps" },
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
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Integrations</h1>
          <p className="text-sm text-muted-foreground">Connect third-party services to extend functionality</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Browse Marketplace
        </Button>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : (
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
        <Input 
          placeholder="Search integrations..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="pl-10" 
        />
      </div>

      {isLoading ? (
        <IntegrationsSkeleton />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredIntegrations.map((integration) => (
            <Card key={integration.name} className="transition-all hover:shadow-md">
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
                  <Badge 
                    className={integration.status === "connected" 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                      : ""
                    }
                    variant={integration.status === "connected" ? "secondary" : "secondary"}
                  >
                    {integration.status === "connected" ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    <span className="hidden sm:inline">{integration.status.replace("_", " ")}</span>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground">{integration.description}</p>
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
      )}
    </div>
  );
}
