import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plug, Plus, Settings } from "lucide-react";

const IntegrationsPage = () => {
  const integrations = [
    { name: "Stripe", category: "Payments", status: "connected", description: "Process payments securely" },
    { name: "Google Analytics", category: "Analytics", status: "connected", description: "Track website traffic" },
    { name: "Mailchimp", category: "Marketing", status: "not_connected", description: "Email marketing automation" },
    { name: "Slack", category: "Communication", status: "connected", description: "Team notifications" },
    { name: "QuickBooks", category: "Accounting", status: "not_connected", description: "Sync financial data" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">Connect third-party services</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Browse Integrations</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {integrations.map((integration) => (
          <Card key={integration.name}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plug className="h-5 w-5" />
                  {integration.name}
                </div>
                <Badge variant={integration.status === "connected" ? "default" : "secondary"}>
                  {integration.status.replace("_", " ")}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{integration.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{integration.category}</span>
                <Button variant="outline" size="sm">
                  {integration.status === "connected" ? (
                    <><Settings className="mr-2 h-3 w-3" /> Configure</>
                  ) : (
                    "Connect"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsPage;
