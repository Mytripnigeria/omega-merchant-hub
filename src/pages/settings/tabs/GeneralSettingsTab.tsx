import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import {
  useBusiness,
  useBusinessSettings,
  useUpdateBusiness,
  useUpdateBusinessSettings,
} from "@/hooks/api/use-settings";
import { useUploadImage } from "@/hooks/api/use-stock";

const CURRENCIES = ["NGN", "USD", "EUR", "GBP", "GHS", "KES", "ZAR"];
const TIMEZONES = [
  "Africa/Lagos",
  "Africa/Accra",
  "Africa/Nairobi",
  "Africa/Johannesburg",
  "UTC",
  "Europe/London",
  "America/New_York",
];

export function GeneralSettingsTab() {
  const { data: business, isLoading } = useBusiness();
  const { data: settings } = useBusinessSettings();
  const updateBusiness = useUpdateBusiness();
  const updateSettings = useUpdateBusinessSettings();
  const uploadImage = useUploadImage();
  const [taxRatePct, setTaxRatePct] = useState<string>("");

  useEffect(() => {
    if (settings) {
      setTaxRatePct(((Number(settings.taxRate ?? 0.075)) * 100).toFixed(2));
    }
  }, [settings]);

  const handleSaveTaxRate = async () => {
    const pct = Number(taxRatePct);
    if (Number.isNaN(pct) || pct < 0 || pct > 100) {
      toast.error("Tax rate must be between 0 and 100");
      return;
    }
    try {
      await updateSettings.mutateAsync({ taxRate: pct / 100 });
      toast.success("Tax rate updated");
    } catch (e) {
      toast.error((e as Error).message ?? "Couldn't update tax rate");
    }
  };

  const [name, setName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [taxId, setTaxId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [timezone, setTimezone] = useState("Africa/Lagos");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoFileId, setLogoFileId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (business) {
      setName(business.name ?? "");
      setLegalName(business.legalName ?? "");
      setRegistrationNumber(business.registrationNumber ?? "");
      setTaxId(business.taxId ?? "");
      setEmail(business.email ?? "");
      setPhone(business.phone ?? "");
      setAddress(business.address ?? "");
      setCurrency(business.currency ?? "NGN");
      setTimezone(business.timezone ?? "Africa/Lagos");
      setLogoUrl(business.logoUrl ?? null);
      setLogoFileId(business.logoFileId ?? null);
    }
  }, [business]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const result = await uploadImage.mutateAsync({ file, folder: "business" });
      setLogoUrl(result.url);
      setLogoFileId(result.id);
      toast.success("Logo uploaded");
    } catch (err) {
      toast.error((err as Error).message ?? "Upload failed");
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Business name is required");
      return;
    }
    try {
      await updateBusiness.mutateAsync({
        name: name.trim(),
        legalName: legalName || undefined,
        registrationNumber: registrationNumber || undefined,
        taxId: taxId || undefined,
        email: email || undefined,
        phone: phone || undefined,
        address: address || undefined,
        currency,
        timezone,
        logoFileId,
      });
      toast.success("Business updated");
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to save");
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 max-w-2xl">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const initials = (business?.name ?? "MJ").slice(0, 2).toUpperCase();

  return (
    <div className="grid gap-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Business Logo</CardTitle>
          <CardDescription>Upload your business logo</CardDescription>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="h-20 w-20 shrink-0">
              {logoUrl ? <AvatarImage src={logoUrl} alt="Logo" /> : null}
              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-xl text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2 flex-1">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadImage.isPending}
                >
                  {uploadImage.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  {uploadImage.isPending ? "Uploading..." : "Upload Logo"}
                </Button>
                {logoUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setLogoUrl(null);
                      setLogoFileId(null);
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB. Recommended: 200x200px</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Business Details</CardTitle>
          <CardDescription>Your business&apos;s legal and display information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Business Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Legal Name</Label>
              <Input value={legalName} onChange={(e) => setLegalName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Registration Number</Label>
              <Input value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Tax ID</Label>
              <Input value={taxId} onChange={(e) => setTaxId(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact</CardTitle>
          <CardDescription>How customers and staff reach you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Regional</CardTitle>
          <CardDescription>Currency and timezone applied across all stores</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tax</CardTitle>
          <CardDescription>
            Single VAT rate applied to every storefront and POS order. Stored
            on the business and used to calculate tax at checkout.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
            <div className="space-y-2">
              <Label>Tax rate (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                step="0.01"
                value={taxRatePct}
                onChange={(e) => setTaxRatePct(e.target.value)}
                placeholder="7.50"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleSaveTaxRate}
              disabled={updateSettings.isPending}
              className="self-end"
            >
              {updateSettings.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save tax rate
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateBusiness.isPending}>
          {updateBusiness.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
