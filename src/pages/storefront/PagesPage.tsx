import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  FileText,
  Search,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useStorefrontPages,
  useCreateStorefrontPage,
  useUpdateStorefrontPage,
  useDeleteStorefrontPage,
} from "@/hooks/api/use-storefront";
import type {
  CreateStorefrontPageRequest,
  PageStatus,
  PageTemplate,
  StorefrontPage,
} from "@/types/storefront";

const ALL = "__all__";

const statusColor: Record<PageStatus, string> = {
  draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  published: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

interface PageForm {
  name: string;
  slug: string;
  template: PageTemplate;
  status: PageStatus;
  metaTitle: string;
  metaDescription: string;
  content: string;
}

function emptyForm(): PageForm {
  return {
    name: "",
    slug: "",
    template: "standard",
    status: "draft",
    metaTitle: "",
    metaDescription: "",
    content: "",
  };
}

function pageToForm(p: StorefrontPage): PageForm {
  return {
    name: p.name,
    slug: p.slug,
    template: p.template,
    status: p.status,
    metaTitle: p.metaTitle ?? "",
    metaDescription: p.metaDescription ?? "",
    content: p.content ?? "",
  };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function PagesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "create" | "edit">("create");
  const [selected, setSelected] = useState<StorefrontPage | null>(null);
  const [form, setForm] = useState<PageForm>(emptyForm());

  const pagesQuery = useStorefrontPages({
    search: search || undefined,
    status: statusFilter === ALL ? undefined : (statusFilter as PageStatus),
    limit: 50,
  });
  const createPage = useCreateStorefrontPage();
  const updatePage = useUpdateStorefrontPage();
  const deletePage = useDeleteStorefrontPage();

  const pages = pagesQuery.data?.data ?? [];

  const stats = useMemo(() => {
    const total = pages.length;
    const published = pages.filter((p) => p.status === "published").length;
    const totalViews = pages.reduce((acc, p) => acc + p.views, 0);
    return [
      { label: "Total Pages", value: String(total) },
      { label: "Published", value: String(published) },
      { label: "Total Views", value: totalViews.toLocaleString() },
    ];
  }, [pages]);

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm());
    setSheetMode("create");
    setSheetOpen(true);
  };
  const openView = (p: StorefrontPage) => {
    setSelected(p);
    setForm(pageToForm(p));
    setSheetMode("view");
    setSheetOpen(true);
  };
  const openEdit = (p: StorefrontPage) => {
    setSelected(p);
    setForm(pageToForm(p));
    setSheetMode("edit");
    setSheetOpen(true);
  };
  const close = () => {
    setSheetOpen(false);
    setSelected(null);
  };

  const buildPayload = (): CreateStorefrontPageRequest => ({
    name: form.name,
    slug: form.slug || slugify(form.name),
    template: form.template,
    status: form.status,
    metaTitle: form.metaTitle || undefined,
    metaDescription: form.metaDescription || undefined,
    content: form.content || undefined,
  });

  const handleCreate = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    createPage.mutate(buildPayload(), {
      onSuccess: () => {
        toast.success("Page created");
        close();
      },
      onError: (e: Error) => toast.error(e.message ?? "Couldn't create"),
    });
  };

  const handleUpdate = () => {
    if (!selected) return;
    updatePage.mutate(
      { id: selected.id, data: buildPayload() },
      {
        onSuccess: () => {
          toast.success("Page updated");
          close();
        },
        onError: (e: Error) => toast.error(e.message ?? "Couldn't update"),
      },
    );
  };

  const handlePublishToggle = (p: StorefrontPage) => {
    const next: PageStatus = p.status === "published" ? "draft" : "published";
    updatePage.mutate(
      { id: p.id, data: { status: next } },
      {
        onSuccess: () => toast.success(`Page ${next}`),
        onError: (e: Error) => toast.error(e.message ?? "Couldn't update"),
      },
    );
  };

  const handleDelete = (p: StorefrontPage) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    deletePage.mutate(p.id, {
      onSuccess: () => {
        toast.success("Page deleted");
        if (selected?.id === p.id) close();
      },
      onError: (e: Error) => toast.error(e.message ?? "Couldn't delete"),
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Pages</h1>
          <p className="text-sm text-muted-foreground">
            Manage your storefront pages
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Create Page
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {stats.map((stat, i) => (
          <Card
            key={stat.label}
            className={i === 2 ? "col-span-2 md:col-span-1" : ""}
          >
            <CardContent className="p-3 sm:p-4 pt-6">
              <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-muted/50 border-0"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36 h-9 bg-muted/50 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {pagesQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : pages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No pages yet</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={openCreate}>
                Create your first page
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {pages.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 hover:bg-muted/40 transition-colors cursor-pointer"
                  onClick={() => openView(p)}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 rounded-lg bg-muted">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm truncate">{p.name}</p>
                        <Badge variant="outline" className="text-xs capitalize">
                          {p.template}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">
                        /{p.slug}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {p.views.toLocaleString()} views
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn("text-xs capitalize", statusColor[p.status])}
                    >
                      {p.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={(o) => (o ? setSheetOpen(true) : close())}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {sheetMode === "create"
                ? "Create Page"
                : sheetMode === "edit"
                  ? `Edit ${selected?.name}`
                  : selected?.name}
            </SheetTitle>
            {sheetMode === "view" && selected && (
              <SheetDescription>
                /{selected.slug} · {selected.template} · last updated{" "}
                {format(new Date(selected.updatedAt), "PP")}
              </SheetDescription>
            )}
          </SheetHeader>

          {sheetMode === "view" && selected ? (
            <Tabs defaultValue="overview" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-3 mt-4 text-sm">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className={cn("text-xs capitalize", statusColor[selected.status])}
                  >
                    {selected.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {selected.views.toLocaleString()} views
                  </span>
                </div>
                {selected.publishedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Published</span>
                    <span>{format(new Date(selected.publishedAt), "PP")}</span>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Content</p>
                  <div className="p-3 border rounded text-sm whitespace-pre-wrap">
                    {selected.content || (
                      <span className="text-muted-foreground italic">Empty</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => openEdit(selected)}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handlePublishToggle(selected)}
                    disabled={updatePage.isPending}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {selected.status === "published" ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(selected)}
                    disabled={deletePage.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="seo" className="space-y-3 mt-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Meta title</p>
                  <p className="font-medium">{selected.metaTitle ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Meta description</p>
                  <p>{selected.metaDescription ?? "—"}</p>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                        slug:
                          sheetMode === "create" && !form.slug
                            ? slugify(e.target.value)
                            : form.slug,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input
                    value={form.slug}
                    onChange={(e) =>
                      setForm({ ...form, slug: slugify(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select
                    value={form.template}
                    onValueChange={(v) =>
                      setForm({ ...form, template: v as PageTemplate })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="homepage">Homepage</SelectItem>
                      <SelectItem value="menu">Menu</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="contact">Contact</SelectItem>
                      <SelectItem value="faq">FAQ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) =>
                      setForm({ ...form, status: v as PageStatus })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input
                  value={form.metaTitle}
                  onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  rows={2}
                  value={form.metaDescription}
                  onChange={(e) =>
                    setForm({ ...form, metaDescription: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Content (markdown / HTML)</Label>
                <Textarea
                  rows={10}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                />
              </div>

              <SheetFooter className="flex-col sm:flex-row gap-2 pt-4 border-t">
                <Button variant="outline" className="w-full sm:w-auto" onClick={close}>
                  Cancel
                </Button>
                <Button
                  className="w-full sm:w-auto"
                  onClick={sheetMode === "create" ? handleCreate : handleUpdate}
                  disabled={createPage.isPending || updatePage.isPending}
                >
                  {sheetMode === "create" ? "Create Page" : "Save Changes"}
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
