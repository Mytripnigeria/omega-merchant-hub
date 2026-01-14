import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, Smartphone, Palette, Image, Link2, Share2, 
  ExternalLink, Eye, Settings, Layout, Type 
} from "lucide-react";
import { useStore } from "@/contexts/StoreContext";

export default function StorefrontPage() {
  const { selectedStore } = useStore();
  const [isLive, setIsLive] = useState(true);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Storefront</h1>
          <p className="text-muted-foreground">Customize your online presence</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Store Status:</span>
            <Switch checked={isLive} onCheckedChange={setIsLive} />
            <Badge variant={isLive ? "default" : "secondary"}>{isLive ? "Live" : "Offline"}</Badge>
          </div>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button>
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Store
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto gap-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="design" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Design
          </TabsTrigger>
          <TabsTrigger value="menu" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Menu Display
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Social
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store URL</CardTitle>
              <CardDescription>Your store's web address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Input value={`${selectedStore?.name?.toLowerCase().replace(/\s+/g, "-")}.omegaos.com`} readOnly />
                <Button variant="outline" size="icon">
                  <Link2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Custom Domain</Label>
                <div className="flex gap-2">
                  <Input placeholder="www.yourdomain.com" />
                  <Button>Connect</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Details shown to customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Store Name</Label>
                <Input defaultValue={selectedStore?.name || "My Store"} />
              </div>
              <div className="space-y-2">
                <Label>Tagline</Label>
                <Input placeholder="Fresh food, fast delivery" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Tell customers about your store..." rows={4} />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ordering Options</CardTitle>
              <CardDescription>Configure how customers can order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Pickup Orders", description: "Allow customers to order for pickup", enabled: true },
                { name: "Delivery Orders", description: "Enable delivery to customers", enabled: true },
                { name: "Dine-In Orders", description: "Table ordering for in-store customers", enabled: false },
                { name: "Scheduled Orders", description: "Allow advance ordering", enabled: true },
              ].map((option) => (
                <div key={option.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{option.name}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  <Switch defaultChecked={option.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="design" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Branding
              </CardTitle>
              <CardDescription>Upload your store's logo and banner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                    <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Drop logo here or click to upload</p>
                    <Button variant="outline" size="sm" className="mt-2">Choose File</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Banner Image</Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                    <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">1200x400px recommended</p>
                    <Button variant="outline" size="sm" className="mt-2">Choose File</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Colors
              </CardTitle>
              <CardDescription>Customize your store's color scheme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" defaultValue="#3B82F6" className="w-12 h-10 p-1" />
                    <Input defaultValue="#3B82F6" className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" defaultValue="#10B981" className="w-12 h-10 p-1" />
                    <Input defaultValue="#10B981" className="flex-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Typography
              </CardTitle>
              <CardDescription>Choose fonts for your storefront</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Heading Font</Label>
                  <Input defaultValue="Inter" />
                </div>
                <div className="space-y-2">
                  <Label>Body Font</Label>
                  <Input defaultValue="Inter" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Menu Layout</CardTitle>
              <CardDescription>How products are displayed to customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Layout Style</Label>
                <div className="grid grid-cols-3 gap-4">
                  {["Grid", "List", "Cards"].map((layout) => (
                    <button
                      key={layout}
                      className={`p-4 border rounded-lg text-center hover:border-primary transition-colors ${layout === "Grid" ? "border-primary bg-primary/5" : ""}`}
                    >
                      <Layout className="h-6 w-6 mx-auto mb-2" />
                      <span className="text-sm">{layout}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Product Images</p>
                  <p className="text-sm text-muted-foreground">Display images in menu</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Product Descriptions</p>
                  <p className="text-sm text-muted-foreground">Display descriptions below names</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Calories</p>
                  <p className="text-sm text-muted-foreground">Display nutritional info</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Engine Optimization</CardTitle>
              <CardDescription>Improve your store's visibility on search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input placeholder="Store Name | Best Food in Town" />
                <p className="text-xs text-muted-foreground">Recommended: 50-60 characters</p>
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea placeholder="Describe your store for search results..." rows={3} />
                <p className="text-xs text-muted-foreground">Recommended: 150-160 characters</p>
              </div>
              <div className="space-y-2">
                <Label>Keywords</Label>
                <Input placeholder="food, restaurant, delivery, pizza" />
              </div>
              <Button>Save SEO Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Connect your social profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Facebook", placeholder: "https://facebook.com/yourstore" },
                { name: "Instagram", placeholder: "https://instagram.com/yourstore" },
                { name: "Twitter", placeholder: "https://twitter.com/yourstore" },
                { name: "TikTok", placeholder: "https://tiktok.com/@yourstore" },
              ].map((social) => (
                <div key={social.name} className="space-y-2">
                  <Label>{social.name}</Label>
                  <Input placeholder={social.placeholder} />
                </div>
              ))}
              <Button>Save Social Links</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Social Sharing
              </CardTitle>
              <CardDescription>Default image when your store is shared</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">1200x630px for best results</p>
                <Button variant="outline" size="sm" className="mt-2">Upload OG Image</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
