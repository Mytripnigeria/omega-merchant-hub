import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoading } from "@/hooks/use-loading";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  GripVertical,
  Search,
  Upload,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  emoji: string;
  description: string;
  image: string | null;
  productCount: number;
  isActive: boolean;
  order: number;
  visibility: string[];
}

const mockCategories: Category[] = [
  { id: "cat-1", name: "Popular", emoji: "🔥", description: "Most ordered items", image: null, productCount: 12, isActive: true, order: 1, visibility: ["pos", "storefront"] },
  { id: "cat-2", name: "New Release", emoji: "✨", description: "Fresh additions to our menu", image: null, productCount: 5, isActive: true, order: 2, visibility: ["pos", "storefront", "ubereats"] },
  { id: "cat-3", name: "Specialties", emoji: "🏆", description: "Chef's special dishes", image: null, productCount: 8, isActive: true, order: 3, visibility: ["pos", "storefront"] },
  { id: "cat-4", name: "Starters", emoji: "🥗", description: "Appetizers and small plates", image: null, productCount: 6, isActive: true, order: 4, visibility: ["pos", "storefront"] },
  { id: "cat-5", name: "Mains", emoji: "🍛", description: "Main course dishes", image: null, productCount: 15, isActive: true, order: 5, visibility: ["pos", "storefront", "ubereats"] },
  { id: "cat-6", name: "Desserts", emoji: "🍰", description: "Sweet treats", image: null, productCount: 4, isActive: false, order: 6, visibility: ["pos"] },
];

// Sortable Category Card Component
interface SortableCategoryCardProps {
  category: Category;
  onView: (category: Category) => void;
  onEdit: (category: Category) => void;
  onToggle: (categoryId: string) => void;
}

function SortableCategoryCard({ category, onView, onEdit, onToggle }: SortableCategoryCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "group transition-all hover:shadow-md cursor-pointer",
        isDragging && "opacity-50 shadow-lg z-50"
      )}
      onClick={() => onView(category)}
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
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(category); }}>
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
          <div 
            className="flex items-center gap-2 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Order: {category.order}</span>
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs text-muted-foreground">
              {category.isActive ? "Active" : "Hidden"}
            </span>
            <Switch
              checked={category.isActive}
              onCheckedChange={() => onToggle(category.id)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isLoading = useLoading(1000);

  const toggleCategory = (categoryId: string) => {
    setCategories(categories.map(c => 
      c.id === categoryId ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsEditMode(false);
    setIsViewSheetOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsEditMode(true);
    setIsViewSheetOpen(true);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        // Update order values
        return newItems.map((item, index) => ({ ...item, order: index + 1 }));
      });
      toast.success("Categories reordered");
    }
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={filteredCategories} strategy={rectSortingStrategy}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((category) => (
                <SortableCategoryCard
                  key={category.id}
                  category={category}
                  onView={handleViewCategory}
                  onEdit={handleEditCategory}
                  onToggle={toggleCategory}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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
              <Input id="name" placeholder="e.g., Breakfast" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emoji">Emoji</Label>
              <Input id="emoji" placeholder="e.g., 🍳" className="text-2xl" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Brief description of this category..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
              </div>
            </div>
            <div className="space-y-3">
              <Label>Visibility</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="pos" defaultChecked />
                  <label htmlFor="pos" className="text-sm">Show on POS</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="self" />
                  <label htmlFor="self" className="text-sm">Show on Self-Order</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="storefront" defaultChecked />
                  <label htmlFor="storefront" className="text-sm">Show on Storefront</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="omni" />
                  <label htmlFor="omni" className="text-sm">Show on Omnichannels</label>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <Label>Status</Label>
              <Select defaultValue="active">
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddSheetOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button className="w-full sm:w-auto">
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
                {isEditMode ? (
                  <>
                    <div className="space-y-2">
                      <Label>Category Name</Label>
                      <Input defaultValue={selectedCategory.name} />
                    </div>
                    <div className="space-y-2">
                      <Label>Emoji</Label>
                      <Input defaultValue={selectedCategory.emoji} className="text-2xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea defaultValue={selectedCategory.description} rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>Image</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label>Visibility</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="edit-pos" defaultChecked={selectedCategory.visibility.includes("pos")} />
                          <label htmlFor="edit-pos" className="text-sm">Show on POS</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="edit-self" defaultChecked={selectedCategory.visibility.includes("self")} />
                          <label htmlFor="edit-self" className="text-sm">Show on Self-Order</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="edit-storefront" defaultChecked={selectedCategory.visibility.includes("storefront")} />
                          <label htmlFor="edit-storefront" className="text-sm">Show on Storefront</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="edit-omni" defaultChecked={selectedCategory.visibility.includes("ubereats")} />
                          <label htmlFor="edit-omni" className="text-sm">Show on Omnichannels</label>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Label>Status</Label>
                      <Select defaultValue={selectedCategory.isActive ? "active" : "inactive"}>
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-sm text-muted-foreground">Description</span>
                      <span className="text-sm">{selectedCategory.description}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-sm text-muted-foreground">Display Order</span>
                      <span className="font-medium">#{selectedCategory.order}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-sm text-muted-foreground">Products</span>
                      <span className="font-medium">{selectedCategory.productCount}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant={selectedCategory.isActive ? "default" : "secondary"}>
                        {selectedCategory.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="py-3">
                      <span className="text-sm text-muted-foreground">Visibility</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedCategory.visibility.map((v, idx) => (
                          <Badge key={idx} variant="outline" className="capitalize">{v}</Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <SheetFooter className="flex-col sm:flex-row gap-2">
                {isEditMode ? (
                  <>
                    <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsEditMode(false)}>
                      Cancel
                    </Button>
                    <Button className="w-full sm:w-auto">Save Changes</Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsEditMode(true)}>
                      <Edit className="h-4 w-4 mr-2" />Edit
                    </Button>
                    <Button variant="destructive" className="w-full sm:w-auto">
                      <Trash2 className="h-4 w-4 mr-2" />Delete
                    </Button>
                  </>
                )}
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
