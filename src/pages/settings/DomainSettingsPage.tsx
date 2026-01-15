import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Globe, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";

export default function DomainSettingsPage() {
  const domains = [
    { id: 1, domain: "omega-restaurant.lovable.app", type: "Lovable", status: "active", primary: true },
    { id: 2, domain: "www.omega-restaurant.com", type: "Custom", status: "pending", primary: false },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Domains</h1>
        <p className="text-sm text-muted-foreground">Manage custom domains for your storefront</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Connected Domains</CardTitle>
              <CardDescription>Domains pointing to your store</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Domain
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {domains.map((domain) => (
              <div key={domain.id} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{domain.domain}</p>
                        {domain.primary && <Badge variant="secondary" className="text-xs">Primary</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{domain.type} domain</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
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
    </div>
  );
}
