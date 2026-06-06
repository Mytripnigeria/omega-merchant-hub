import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  useIntegrations,
  useUpdateIntegration,
} from "@/hooks/api/use-integrations";
import type {
  Integration,
  IntegrationProvider,
} from "@/services/api/integrations";

const PROVIDER_META: Record<
  IntegrationProvider,
  { name: string; description: string; docsUrl: string; publicLabel: string; secretLabel: string }
> = {
  paystack: {
    name: "Paystack",
    description: "Accept card, bank, and transfer payments via Paystack.",
    docsUrl: "https://dashboard.paystack.com/#/settings/developers",
    publicLabel: "Public key (pk_…)",
    secretLabel: "Secret key (sk_…)",
  },
  flutterwave: {
    name: "Flutterwave",
    description: "Accept payments across Africa via Flutterwave.",
    docsUrl: "https://dashboard.flutterwave.com/settings/apis",
    publicLabel: "Public key (FLWPUBK_…)",
    secretLabel: "Secret key (FLWSECK_…)",
  },
};

function ProviderCard({ integration }: { integration: Integration }) {
  const meta = PROVIDER_META[integration.provider];
  const update = useUpdateIntegration();

  const [publicKey, setPublicKey] = useState(integration.publicKey ?? "");
  const [secretKey, setSecretKey] = useState("");
  const [isLive, setIsLive] = useState(integration.isLive);
  const [isEnabled, setIsEnabled] = useState(integration.isEnabled);

  // Re-sync local form when the server data changes (e.g. after save/refetch).
  useEffect(() => {
    setPublicKey(integration.publicKey ?? "");
    setSecretKey("");
    setIsLive(integration.isLive);
    setIsEnabled(integration.isEnabled);
  }, [integration]);

  const handleSave = async () => {
    if (isEnabled && !integration.secretKeySet && !secretKey.trim()) {
      toast.error(`Add your ${meta.name} secret key before enabling it`);
      return;
    }
    try {
      await update.mutateAsync({
        provider: integration.provider,
        data: {
          publicKey: publicKey.trim(),
          // Only send the secret when the merchant typed a new one.
          secretKey: secretKey.trim() || undefined,
          isLive,
          isEnabled,
        },
      });
      toast.success(`${meta.name} settings saved`);
    } catch (e) {
      toast.error((e as Error).message ?? "Failed to save");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {meta.name}
                {integration.isEnabled && (
                  <Badge variant="outline" className="text-green-600 border-green-600/30">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {integration.isLive ? "Live" : "Test"}
                </Badge>
              </CardTitle>
              <CardDescription>{meta.description}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{meta.publicLabel}</Label>
          <Input
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="Enter public key"
            className="font-mono text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label>{meta.secretLabel}</Label>
          <Input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder={
              integration.secretKeySet
                ? `Saved: ${integration.secretKeyMasked} — type to replace`
                : "Enter secret key"
            }
            className="font-mono text-sm"
          />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <p className="text-sm font-medium">Live mode</p>
            <p className="text-xs text-muted-foreground">
              Use live keys to charge real customers
            </p>
          </div>
          <Switch checked={isLive} onCheckedChange={setIsLive} />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <p className="text-sm font-medium">Enabled</p>
            <p className="text-xs text-muted-foreground">
              Offer {meta.name} at checkout
            </p>
          </div>
          <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
        </div>
        <div className="flex items-center justify-between">
          <a
            href={meta.docsUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-primary hover:underline"
          >
            Where do I find my keys?
          </a>
          <Button onClick={handleSave} disabled={update.isPending}>
            {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function IntegrationsPage() {
  const { data: integrations = [], isLoading } = useIntegrations();

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          Integrations
        </h1>
        <p className="text-sm text-muted-foreground">
          Connect your payment providers. Keys are stored securely and never
          shown again in full.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {integrations.map((integration) => (
            <ProviderCard key={integration.provider} integration={integration} />
          ))}
        </div>
      )}
    </div>
  );
}
