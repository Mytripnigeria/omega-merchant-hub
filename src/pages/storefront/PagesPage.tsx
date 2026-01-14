import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Eye, Edit } from "lucide-react";

const PagesPage = () => {
  const pages = [
    { id: 1, name: "Home", slug: "/", status: "published", lastUpdated: "2024-01-15" },
    { id: 2, name: "Menu", slug: "/menu", status: "published", lastUpdated: "2024-01-14" },
    { id: 3, name: "About Us", slug: "/about", status: "published", lastUpdated: "2024-01-10" },
    { id: 4, name: "Contact", slug: "/contact", status: "draft", lastUpdated: "2024-01-08" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="text-muted-foreground">Manage your storefront pages</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" /> Create Page</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>All Pages</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pages.map((page) => (
              <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{page.name}</p>
                    <p className="text-sm text-muted-foreground">{page.slug} • Updated {page.lastUpdated}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={page.status === "published" ? "default" : "secondary"}>{page.status}</Badge>
                  <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PagesPage;
