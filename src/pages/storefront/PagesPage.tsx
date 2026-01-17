import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FileText, Eye, Edit, Search, MoreHorizontal, Trash2, Code, Globe, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Page {
  id: number;
  name: string;
  slug: string;
  status: "published" | "draft";
  lastUpdated: string;
  views: number;
  metaTitle?: string;
  metaDescription?: string;
  content?: string;
  template?: string;
}

const pages: Page[] = [
  { id: 1, name: "Home", slug: "/", status: "published", lastUpdated: "2026-01-15", views: 1250, metaTitle: "Welcome to Our Restaurant", metaDescription: "Best food in town", template: "homepage", content: "<h1>Welcome</h1><p>Your content here...</p>" },
  { id: 2, name: "Menu", slug: "/menu", status: "published", lastUpdated: "2026-01-14", views: 890, metaTitle: "Our Menu", template: "menu" },
  { id: 3, name: "About Us", slug: "/about", status: "published", lastUpdated: "2026-01-10", views: 320, metaTitle: "About Us", template: "standard" },
  { id: 4, name: "Contact", slug: "/contact", status: "draft", lastUpdated: "2026-01-08", views: 0, template: "contact" },
  { id: 5, name: "FAQ", slug: "/faq", status: "published", lastUpdated: "2026-01-05", views: 180, metaTitle: "FAQ", template: "faq" },
];

const statusColors: Record<string, string> = {
  published: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
};

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className={i === 2 ? "col-span-2 md:col-span-1" : ""}>
          <CardContent className="p-3 sm:p-4 pt-6">
            <Skeleton className="h-3 w-20 mb-2" />
            <Skeleton className="h-7 w-12" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PagesSkeleton() {
  return (
    <>
      <div className="block sm:hidden space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 border border-border rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="space-y-1"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" /></div>
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
            <div className="flex items-center justify-between"><Skeleton className="h-5 w-16 rounded-full" /><Skeleton className="h-3 w-32" /></div>
          </div>
        ))}
      </div>
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead><tr className="border-b">{Array.from({ length: 6 }).map((_, i) => <th key={i} className="p-4"><Skeleton className="h-3 w-16" /></th>)}</tr></thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="p-4"><div className="flex items-center gap-3"><Skeleton className="h-8 w-8 rounded-lg" /><Skeleton className="h-4 w-20" /></div></td>
                <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                <td className="p-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                <td className="p-4"><Skeleton className="h-4 w-12" /></td>
                <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                <td className="p-4"><Skeleton className="h-8 w-8" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function PagesPage() {
  const [search, setSearch] = useState("");
  const isLoading = useLoading(1000);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "edit" | "add">("view");

  const stats = [
    { label: "Total Pages", value: pages.length.toString() },
    { label: "Published", value: pages.filter(p => p.status === "published").length.toString() },
    { label: "Total Views", value: pages.reduce((acc, p) => acc + p.views, 0).toLocaleString() },
  ];

  const filteredPages = pages.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const openViewSheet = (page: Page) => { setSelectedPage(page); setSheetMode("view"); };
  const openEditSheet = (page: Page) => { setSelectedPage(page); setSheetMode("edit"); };
  const openAddSheet = () => { setSelectedPage(null); setSheetMode("add"); setIsAddSheetOpen(true); };
  const closeSheet = () => { setSelectedPage(null); setIsAddSheetOpen(false); };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Pages</h1>
          <p className="text-sm text-muted-foreground">Manage your storefront pages</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={openAddSheet}><Plus className="mr-2 h-4 w-4" />Create Page</Button>
      </div>

      {isLoading ? <StatsSkeleton /> : (
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

      <Card>
        <CardHeader className="p-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search pages..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-4 sm:pt-0">
          {isLoading ? <PagesSkeleton /> : (
            <>
              <div className="block sm:hidden space-y-3 p-4 pt-0">
                {filteredPages.map((page) => (
                  <div key={page.id} className="p-4 border border-border rounded-lg cursor-pointer hover:bg-muted/50" onClick={() => openViewSheet(page)}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted"><FileText className="h-4 w-4 text-muted-foreground" /></div>
                        <div><p className="font-medium text-sm">{page.name}</p><p className="text-xs text-muted-foreground font-mono">{page.slug}</p></div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); }}><Eye className="mr-2 h-4 w-4" />Preview</DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openEditSheet(page); }}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <Badge className={statusColors[page.status]} variant="secondary">{page.status}</Badge>
                      <div className="text-xs text-muted-foreground">{page.views.toLocaleString()} views • {page.lastUpdated}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Page</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">URL</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Status</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Views</th>
                      <th className="text-left text-xs font-medium text-muted-foreground p-4">Last Updated</th>
                      <th className="text-right text-xs font-medium text-muted-foreground p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPages.map((page) => (
                      <tr key={page.id} className="border-b border-border last:border-0 hover:bg-muted/50 group cursor-pointer" onClick={() => openViewSheet(page)}>
                        <td className="p-4"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-muted"><FileText className="h-4 w-4 text-muted-foreground" /></div><span className="font-medium">{page.name}</span></div></td>
                        <td className="font-mono text-sm text-muted-foreground p-4">{page.slug}</td>
                        <td className="p-4"><Badge className={statusColors[page.status]} variant="secondary">{page.status}</Badge></td>
                        <td className="p-4">{page.views.toLocaleString()}</td>
                        <td className="text-muted-foreground p-4">{page.lastUpdated}</td>
                        <td className="text-right p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}><Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />Preview</DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openEditSheet(page); }}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Sheet open={!!selectedPage || isAddSheetOpen} onOpenChange={closeSheet}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle>{sheetMode === "add" ? "Create Page" : sheetMode === "edit" ? "Edit Page" : selectedPage?.name}</SheetTitle>
              {selectedPage && sheetMode === "view" && <Badge className={statusColors[selectedPage.status]} variant="secondary">{selectedPage.status}</Badge>}
            </div>
            <SheetDescription>{sheetMode === "add" ? "Add a new page to your storefront" : selectedPage?.slug}</SheetDescription>
          </SheetHeader>

          {sheetMode === "view" && selectedPage ? (
            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Page Name</Label><p className="text-sm font-medium">{selectedPage.name}</p></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">URL Slug</Label><p className="text-sm font-mono">{selectedPage.slug}</p></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Template</Label><Badge variant="outline">{selectedPage.template || "Standard"}</Badge></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Views</Label><p className="text-sm font-medium">{selectedPage.views.toLocaleString()}</p></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Last Updated</Label><p className="text-sm font-medium">{selectedPage.lastUpdated}</p></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Status</Label><Badge className={statusColors[selectedPage.status]} variant="secondary">{selectedPage.status}</Badge></div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-4">
                  <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" />Preview</Button>
                  <Button variant="outline" size="sm"><Globe className="mr-2 h-4 w-4" />View Live</Button>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4 mt-4">
                <div className="space-y-1"><Label className="text-xs text-muted-foreground">Meta Title</Label><p className="text-sm font-medium">{selectedPage.metaTitle || "Not set"}</p></div>
                <div className="space-y-1"><Label className="text-xs text-muted-foreground">Meta Description</Label><p className="text-sm">{selectedPage.metaDescription || "Not set"}</p></div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4 mt-4">
                {selectedPage.content ? (
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 mb-2"><Code className="h-4 w-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">HTML Content</span></div>
                    <pre className="text-xs overflow-auto">{selectedPage.content}</pre>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FileText className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">No custom content</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4 mt-6">
              <div className="space-y-2"><Label>Page Name</Label><Input placeholder="e.g., About Us" defaultValue={selectedPage?.name} /></div>
              <div className="space-y-2"><Label>URL Slug</Label><Input placeholder="/about-us" defaultValue={selectedPage?.slug} /></div>
              <div className="space-y-2">
                <Label>Template</Label>
                <Select defaultValue={selectedPage?.template || "standard"}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="homepage">Homepage</SelectItem>
                    <SelectItem value="menu">Menu</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="faq">FAQ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Meta Title</Label><Input placeholder="SEO title" defaultValue={selectedPage?.metaTitle} /></div>
              <div className="space-y-2"><Label>Meta Description</Label><Textarea placeholder="SEO description" defaultValue={selectedPage?.metaDescription} /></div>
            </div>
          )}

          <SheetFooter className="mt-6 flex-col sm:flex-row gap-2">
            {sheetMode === "view" ? (
              <>
                <Button variant="outline" onClick={() => openEditSheet(selectedPage!)} className="w-full sm:w-auto">Edit Page</Button>
                {selectedPage?.status === "draft" && <Button className="w-full sm:w-auto">Publish</Button>}
              </>
            ) : (
              <>
                <Button variant="outline" onClick={closeSheet} className="w-full sm:w-auto">Cancel</Button>
                <Button className="w-full sm:w-auto">{sheetMode === "add" ? "Create Page" : "Save Changes"}</Button>
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
