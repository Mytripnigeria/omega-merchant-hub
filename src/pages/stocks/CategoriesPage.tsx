import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  GripVertical,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Category {
  id: string;
  name: string;
  emoji: string;
  productCount: number;
  isActive: boolean;
  order: number;
}

const mockCategories: Category[] = [
  { id: "cat-1", name: "Popular", emoji: "🔥", productCount: 12, isActive: true, order: 1 },
  { id: "cat-2", name: "New Release", emoji: "✨", productCount: 5, isActive: true, order: 2 },
  { id: "cat-3", name: "Specialties", emoji: "🏆", productCount: 8, isActive: true, order: 3 },
  { id: "cat-4", name: "Starters", emoji: "🥗", productCount: 6, isActive: true, order: 4 },
  { id: "cat-5", name: "Mains", emoji: "🍛", productCount: 15, isActive: true, order: 5 },
  { id: "cat-6", name: "Sides", emoji: "🍟", productCount: 8, isActive: true, order: 6 },
  { id: "cat-7", name: "Drinks", emoji: "🧃", productCount: 10, isActive: true, order: 7 },
  { id: "cat-8", name: "Desserts", emoji: "🍰", productCount: 4, isActive: false, order: 8 },
];

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-3 sm:p-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-7 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-10 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", emoji: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const isLoading = useLoading(1000);

  const toggleCategory = (categoryId: string) => {
    setCategories(categories.map(c => 
      c.id === categoryId ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const handleAddCategory = () => {
    if (newCategory.name && newCategory.emoji) {
      setCategories([
        ...categories,
        {
          id: `cat-${Date.now()}`,
          name: newCategory.name,
          emoji: newCategory.emoji,
          productCount: 0,
          isActive: true,
          order: categories.length + 1,
        },
      ]);
      setNewCategory({ name: "", emoji: "" });
      setIsAddSheetOpen(false);
    }
  };

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsViewSheetOpen(true);
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">Organize your menu with categories</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={() => setIsAddSheetOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Categories</p>
              <p className="text-xl sm:text-2xl font-semibold">{categories.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
              <p className="text-xl sm:text-2xl font-semibold text-green-600">{categories.filter(c => c.isActive).length}</p>
            </CardContent>
          </Card>
          <Card className="col-span-2 md:col-span-1">
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Products</p>
              <p className="text-xl sm:text-2xl font-semibold">
                {categories.reduce((acc, c) => acc + c.productCount, 0)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <CategoriesSkeleton />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <Card
              key={category.id}
              className="group transition-all hover:shadow-md cursor-pointer"
              onClick={() => handleViewCategory(category)}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-muted text-xl sm:text-2xl">
                      {category.emoji}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base">{category.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {category.productCount} products
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 sm:opacity-0 sm:group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewCategory(category); }}>
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
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    <span className="text-xs text-muted-foreground">Order: {category.order}</span>
                  </div>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <span className="text-xs text-muted-foreground">
                      {category.isActive ? "Active" : "Hidden"}
                    </span>
                    <Switch
                      checked={category.isActive}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Category Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New Category</SheetTitle>
            <SheetDescription>
              Create a new category to organize your products
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                placeholder="e.g., Breakfast"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emoji">Emoji</Label>
              <Input
                id="emoji"
                placeholder="e.g., 🍳"
                value={newCategory.emoji}
                onChange={(e) => setNewCategory({ ...newCategory, emoji: e.target.value })}
                className="text-2xl"
              />
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddSheetOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleAddCategory} className="w-full sm:w-auto">
              Create Category
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View/Edit Category Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedCategory && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-3xl">
                    {selectedCategory.emoji}
                  </div>
                  <div>
                    <SheetTitle>{selectedCategory.name}</SheetTitle>
                    <SheetDescription>{selectedCategory.productCount} products</SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="py-6 space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm text-muted-foreground">Display Order</span>
                  <span className="font-medium">#{selectedCategory.order}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Switch
                    checked={selectedCategory.isActive}
                    onCheckedChange={() => toggleCategory(selectedCategory.id)}
                  />
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-muted-foreground">Products</span>
                  <span className="font-medium">{selectedCategory.productCount}</span>
                </div>
              </div>
              <SheetFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Edit className="h-4 w-4 mr-2" />Edit
                </Button>
                <Button variant="destructive" className="w-full sm:w-auto">
                  <Trash2 className="h-4 w-4 mr-2" />Delete
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
