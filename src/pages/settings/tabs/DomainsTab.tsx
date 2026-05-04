import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Trash2, Loader2, Globe, MoreHorizontal, CheckCircle, AlertCircle, Star } from "lucide-react";
import { toast } from "sonner";
import {
  useDomains,
  useCreateDomain,
  useDeleteDomain,
  useVerifyDomain,
  useSetPrimaryDomain,
} from "@/hooks/api/use-settings";
import type { Domain } from "@/services/api/domains";

export function DomainsTab() {
  const { data: domains = [], isLoading } = useDomains();
  const createDomain = useCreateDomain();
  const deleteDomain = useDeleteDomain();
  const verifyDomain = useVerifyDomain();
  const setPrimary = useSetPrimaryDomain();

  const [isOpen, setIsOpen] = useState(false);
  const [hostname, setHostname] = useState("");
  const [createdDomain, setCreatedDomain] = useState<Domain | null>(null);

  const handleCreate = async () => {
    if (!hostname.trim()) return toast.error("Hostname is required");
    try {
      const result = await createDomain.mutateAsync({ hostname: hostname.trim().toLowerCase() });
      setCreatedDomain(result);
      setHostname("");
      toast.success("Domain added — configure DNS to verify");
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to create domain");
    }
  };

  const handleVerify = async (d: Domain) => {
    try {
      await verifyDomain.mutateAsync(d.id);
      toast.success(`${d.hostname} verified`);
    } catch (err) {
      toast.error((err as Error).message ?? "Verification failed");
    }
  };

  const handleSetPrimary = async (d: Domain) => {
    try {
      await setPrimary.mutateAsync(d.id);
      toast.success(`${d.hostname} is now primary`);
    } catch (err) {
      toast.error((err as Error).message ?? "Failed");
    }
  };

  const handleDelete = (d: Domain) => {
    deleteDomain.mutate(d.id, {
      onSuccess: () => toast.success("Domain removed"),
      onError: (e: Error) => toast.error(e.message ?? "Failed to delete"),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Custom Domains</h2>
          <p className="text-sm text-muted-foreground">
            Connect your own domain to your storefront
          </p>
        </div>
        <Button size="sm" onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Domain
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {domains.map((d) => (
            <Card key={d.id}>
              <CardContent className="p-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium font-mono">{d.hostname}</p>
                      {d.isPrimary && (
                        <Badge className="text-xs gap-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                          <Star className="h-3 w-3" />
                          Primary
                        </Badge>
                      )}
                      {d.verifiedAt ? (
                        <Badge variant="default" className="text-xs gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs capitalize">
                        SSL: {d.sslStatus}
                      </Badge>
                    </div>
                    {!d.verifiedAt && d.dnsRecords && (
                      <div className="text-xs text-muted-foreground space-y-1 mt-2">
                        <p className="font-medium">Add these DNS records, then click Verify:</p>
                        {d.dnsRecords.map((r, i) => (
                          <div
                            key={i}
                            className="font-mono p-2 bg-muted rounded grid grid-cols-3 gap-2"
                          >
                            <span>
                              <span className="text-muted-foreground">Type:</span> {r.type}
                            </span>
                            <span className="truncate">
                              <span className="text-muted-foreground">Name:</span> {r.name}
                            </span>
                            <span className="truncate">
                              <span className="text-muted-foreground">Value:</span> {r.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!d.verifiedAt && (
                      <DropdownMenuItem onClick={() => handleVerify(d)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Verify
                      </DropdownMenuItem>
                    )}
                    {d.verifiedAt && !d.isPrimary && (
                      <DropdownMenuItem onClick={() => handleSetPrimary(d)}>
                        <Star className="mr-2 h-4 w-4" />
                        Set as Primary
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(d)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
          {domains.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No custom domains yet.
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Sheet
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setCreatedDomain(null);
        }}
      >
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add Custom Domain</SheetTitle>
            <SheetDescription>
              Connect a domain you own. After creating, you&apos;ll see DNS records to add.
            </SheetDescription>
          </SheetHeader>
          {createdDomain ? (
            <div className="grid gap-4 py-6">
              <p className="text-sm">
                Domain <span className="font-mono">{createdDomain.hostname}</span> created. Add the
                DNS records below at your registrar, then come back and click Verify.
              </p>
              <div className="space-y-2">
                {(createdDomain.dnsRecords ?? []).map((r, i) => (
                  <div key={i} className="font-mono p-3 bg-muted rounded text-xs space-y-1">
                    <div>Type: {r.type}</div>
                    <div className="break-all">Name: {r.name}</div>
                    <div className="break-all">Value: {r.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 py-6">
              <div className="space-y-2">
                <Label>Hostname</Label>
                <Input
                  placeholder="shop.yourdomain.com"
                  value={hostname}
                  onChange={(e) => setHostname(e.target.value)}
                />
              </div>
            </div>
          )}
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {createdDomain ? "Done" : "Cancel"}
            </Button>
            {!createdDomain && (
              <Button onClick={handleCreate} disabled={createDomain.isPending}>
                {createDomain.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
