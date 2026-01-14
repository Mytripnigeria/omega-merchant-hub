import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{page.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{page.slug}</TableCell>
                  <TableCell>
                    <Badge variant={page.status === "published" ? "default" : "secondary"}>
                      {page.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{page.views.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{page.lastUpdated}</TableCell>
                  <TableCell className="text-right">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
