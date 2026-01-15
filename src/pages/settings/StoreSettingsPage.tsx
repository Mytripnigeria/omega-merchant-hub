import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

export default function StoreSettingsPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Store Info</h1>
        <p className="text-sm text-muted-foreground">Manage your store's basic information</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Store Logo</CardTitle>
            <CardDescription>Upload your store's logo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-xl text-white">
                  OR
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </Button>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB. Recommended: 200x200px</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Business Details</CardTitle>
            <CardDescription>Your store's legal and display information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Store Name</Label>
                <Input defaultValue="Omega Restaurant" />
              </div>
              <div className="space-y-2">
                <Label>Legal Name</Label>
                <Input defaultValue="Omega Foods Ltd" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Business Registration Number</Label>
              <Input placeholder="Enter registration number" />
            </div>
            <div className="space-y-2">
              <Label>Tax ID / VAT Number</Label>
              <Input placeholder="Enter tax ID" />
            </div>
            <Button size="sm">Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
            <CardDescription>How customers can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" defaultValue="info@omega-restaurant.com" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input type="tel" defaultValue="+234 803 456 7890" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea defaultValue="123 Victoria Island, Lagos, Nigeria" rows={3} />
            </div>
            <Button size="sm">Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
