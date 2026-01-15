import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Eye, Edit, Search, MoreHorizontal, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function PagesPage() {
  const [search, setSearch] = useState("");

  const pages = [
    { id: 1, name: "Home", slug: "/", status: "published", lastUpdated: "2026-01-15", views: 1250 },
    { id: 2, name: "Menu", slug: "/menu", status: "published", lastUpdated: "2026-01-14", views: 890 },
    { id: 3, name: "About Us", slug: "/about", status: "published", lastUpdated: "2026-01-10", views: 320 },
    { id: 4, name: "Contact", slug: "/contact", status: "draft", lastUpdated: "2026-01-08", views: 0 },
    { id: 5, name: "FAQ", slug: "/faq", status: "published", lastUpdated: "2026-01-05", views: 180 },
  ];

  const stats = [
    { label: "Total Pages", value: pages.length.toString() },
    { label: "Published", value: pages.filter(p => p.status === "published").length.toString() },
    { label: "Total Views", value: pages.reduce((acc, p) => acc + p.views, 0).toLocaleString() },
  ];

  const filteredPages = pages.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    published: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Pages</h1>
          <p className="text-muted-foreground">Manage your storefront pages</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Page
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search pages..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-10" 
            />
          </div>
        </CardHeader>
        <CardContent>
          {/* Mobile Card View */}
          <div className="block sm:hidden space-y-3">
            {filteredPages.map((page) => (
              <div key={page.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{page.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{page.slug}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Badge className={statusColors[page.status]} variant="secondary">
                    {page.status}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {page.views.toLocaleString()} views • {page.lastUpdated}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
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
                  <tr key={page.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium">{page.name}</span>
                      </div>
                    </td>
                    <td className="font-mono text-sm text-muted-foreground p-4">{page.slug}</td>
                    <td className="p-4">
                      <Badge className={statusColors[page.status]} variant="secondary">
                        {page.status}
                      </Badge>
                    </td>
                    <td className="p-4">{page.views.toLocaleString()}</td>
                    <td className="text-muted-foreground p-4">{page.lastUpdated}</td>
                    <td className="text-right p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}