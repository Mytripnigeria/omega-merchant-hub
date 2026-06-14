import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Globe, CheckCircle, AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useDomains,
  useCreateDomain,
  useVerifyDomain,
} from "@/hooks/api/use-settings";

export default function DomainSettingsPage() {
  const { data: domains = [], isLoading } = useDomains();
  const createDomain = useCreateDomain();
  const verifyDomain = useVerifyDomain();
  const [newHostname, setNewHostname] = useState("");

  const handleAdd = async () => {
    const hostname = newHostname.trim();
    if (!hostname) return toast.error("Enter a domain name");
    try {
      await createDomain.mutateAsync({ hostname });
      toast.success("Domain added — add the DNS record then verify");
      setNewHostname("");
    } catch (e) {
      toast.error((e as Error).message ?? "Failed to add domain");
    }
  };

  const handleVerify = async () => {
    const hostname = newHostname.trim().toLowerCase();
    // Verify the typed domain if it exists, else the first unverified domain.
    const target =
      domains.find((d) => d.hostname.toLowerCase() === hostname) ??
      domains.find((d) => !d.verifiedAt);
    if (!target) return toast.error("Add a domain first");
    try {
      const result = await verifyDomain.mutateAsync(target.id);
      toast.success(
        result.verifiedAt ? "Domain verified" : "Verification pending — check your DNS records",
      );
    } catch (e) {
      toast.error((e as Error).message ?? "Verification failed");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Domains</h1>
        <p className="text-sm text-muted-foreground">Manage custom domains for your storefront</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Connected Domains</CardTitle>
              <CardDescription>Domains pointing to your store</CardDescription>
            </div>
            <Button
              size="sm"
              className="w-full sm:w-auto"
              onClick={handleAdd}
              disabled={createDomain.isPending}
            >
              {createDomain.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Add Domain
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading && (
              <p className="text-sm text-muted-foreground">Loading domains…</p>
            )}
            {!isLoading && domains.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No domains connected yet.
              </p>
            )}
            {domains.map((domain) => {
              const isActive = !!domain.verifiedAt || domain.sslStatus === "active";
              const type = domain.hostname.includes("lovable") ? "Lovable" : "Custom";
              return (
                <div key={domain.id} className="p-4 rounded-lg border space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-sm break-all">{domain.hostname}</p>
                          {domain.isPrimary && <Badge variant="secondary" className="text-xs shrink-0">Primary</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{type} domain</p>
                      </div>
                    </div>
                    <a
                      href={`https://${domain.hostname}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                  <div className="flex items-center justify-end sm:justify-start sm:pl-13">
                    {isActive ? (
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
              );
            })}
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
              <Input
                placeholder="www.yourdomain.com"
                value={newHostname}
                onChange={(e) => setNewHostname(e.target.value)}
              />
            </div>
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <p className="font-medium text-sm">DNS Configuration</p>
              <p className="text-xs text-muted-foreground">
                Add a CNAME record pointing to <code className="px-1 py-0.5 bg-muted rounded">cname.lovable.app</code>
              </p>
            </div>
            <Button size="sm" onClick={handleVerify} disabled={verifyDomain.isPending}>
              {verifyDomain.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Domain
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
