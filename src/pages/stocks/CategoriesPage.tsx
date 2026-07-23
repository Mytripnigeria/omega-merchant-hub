import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories, useCategoryStats, useCreateCategory, useUpdateCategory, useDeleteCategory, useReorderCategories, useUploadImage } from "@/hooks/api/use-stock";
import { useStore } from "@/contexts/StoreContext";
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
  Loader2,
  X,
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
  imageUrl?: string | null;
  imageFileId?: string | null;
  productCount: number;
  isActive: boolean;
  order: number;
  visibility: string[];
}

// Sortable Category Card Component
interface SortableCategoryCardProps {
  category: Category;
  onView: (category: Category) => void;
  onEdit: (category: Category) => void;
  onToggle: (categoryId: string) => void;
  onDelete: (category: Category) => void;
}

function SortableCategoryCard({ category, onView, onEdit, onToggle, onDelete }: SortableCategoryCardProps) {
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
              <DropdownMenuItem
                className="text-destructive"
                onClick={(e) => { e.stopPropagation(); onDelete(category); }}
              >
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

const VISIBILITY_OPTIONS: { id: string; label: string; value: string }[] = [
  { id: "pos", label: "Show on POS", value: "pos" },
  { id: "self", label: "Show on Self-Order", value: "self" },
  { id: "storefront", label: "Show on Storefront", value: "storefront" },
  { id: "omni", label: "Show on Omnichannels", value: "omni" },
];

const DEFAULT_VISIBILITY = ["pos", "storefront"];

export default function CategoriesPage() {
  // Categories are store-scoped on the backend. In all-stores mode we omit
  // storeId (show all); with a specific store selected we filter by it and
  // require it on create.
  // Default backend page size is 10 — bump to the cap so the merchant sees
  // every category they've created without us needing pagination UI here.
  const { currentStore, isAllStoresMode } = useStore();
  const scopedStoreId = isAllStoresMode ? undefined : currentStore?.id;
  const { data: categoriesData, isLoading } = useCategories({ limit: 200, storeId: scopedStoreId });
  const categories: Category[] = (categoriesData as { data?: Category[] })?.data ?? (categoriesData as Category[] | undefined) ?? [];
  const updateCategory = useUpdateCategory();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const reorderCategories = useReorderCategories();
  const uploadImage = useUploadImage();

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmoji, setFormEmoji] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImageUrl, setFormImageUrl] = useState<string | null>(null);
  const [formImageFileId, setFormImageFileId] = useState<string | null>(null);
  const [formVisibility, setFormVisibility] = useState<string[]>(DEFAULT_VISIBILITY);
  const [formIsActive, setFormIsActive] = useState(true);
  const addFileInputRef = useRef<HTMLInputElement | null>(null);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);

  const resetForm = () => {
    setFormName("");
    setFormEmoji("");
    setFormDescription("");
    setFormImageUrl(null);
    setFormImageFileId(null);
    setFormVisibility(DEFAULT_VISIBILITY);
    setFormIsActive(true);
  };

  const populateFormFromCategory = (c: Category) => {
    setFormName(c.name);
    setFormEmoji(c.emoji ?? "");
    setFormDescription(c.description ?? "");
    setFormImageUrl(c.imageUrl ?? null);
    setFormImageFileId(c.imageFileId ?? null);
    setFormVisibility(c.visibility ?? DEFAULT_VISIBILITY);
    setFormIsActive(c.isActive);
  };

  useEffect(() => {
    if (selectedCategory && isEditMode) {
      populateFormFromCategory(selectedCategory);
    }
  }, [selectedCategory, isEditMode]);

  const toggleVisibility = (value: string, checked: boolean) => {
    setFormVisibility((prev) =>
      checked ? Array.from(new Set([...prev, value])) : prev.filter((v) => v !== value),
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const result = await uploadImage.mutateAsync({ file, folder: "categories" });
      setFormImageUrl(result.url);
      setFormImageFileId(result.id);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error((err as Error).message ?? "Upload failed");
    }
  };

  const clearFormImage = () => {
    setFormImageUrl(null);
    setFormImageFileId(null);
  };

  const handleCreate = async () => {
    if (!formName.trim()) {
      toast.error("Category name is required");
      return;
    }
    if (!currentStore?.id) {
      toast.error("Select a store first");
      return;
    }
    try {
      await createCategory.mutateAsync({
        name: formName.trim(),
        emoji: formEmoji || undefined,
        description: formDescription || undefined,
        imageFileId: formImageFileId,
        visibility: formVisibility,
        isActive: formIsActive,
        storeId: currentStore.id,
      } as Parameters<typeof createCategory.mutateAsync>[0]);
      toast.success("Category created");
      setIsAddSheetOpen(false);
      resetForm();
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to create category");
    }
  };

  const handleSave = async () => {
    if (!selectedCategory) return;
    if (!formName.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      await updateCategory.mutateAsync({
        id: selectedCategory.id,
        data: {
          name: formName.trim(),
          emoji: formEmoji || undefined,
          description: formDescription || undefined,
          imageFileId: formImageFileId,
          visibility: formVisibility,
          isActive: formIsActive,
        },
      });
      toast.success("Category updated");
      setIsViewSheetOpen(false);
      setIsEditMode(false);
      setSelectedCategory(null);
    } catch (err) {
      toast.error((err as Error).message ?? "Failed to update category");
    }
  };

  const handleDelete = (category: Category) => {
    deleteCategory.mutate(category.id, {
      onSuccess: () => {
        toast.success("Category deleted");
        setIsViewSheetOpen(false);
        setSelectedCategory(null);
      },
      onError: (e: Error) => toast.error(e.message ?? "Failed to delete"),
    });
  };

  const toggleCategory = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    if (cat) updateCategory.mutate({ id: categoryId, data: { isActive: !cat.isActive } });
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

  const handleAddNewClick = () => {
    resetForm();
    setIsAddSheetOpen(true);
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
      const oldIndex = categories.findIndex((item) => item.id === active.id);
      const newIndex = categories.findIndex((item) => item.id === over.id);
      const reordered = arrayMove(categories, oldIndex, newIndex);
      const items = reordered.map((item, index) => ({ id: item.id, order: index + 1 }));
      reorderCategories.mutate(items);
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
        <Button size="sm" className="w-full sm:w-auto" onClick={handleAddNewClick}>
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
                  onDelete={handleDelete}
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
              <Input
                id="name"
                placeholder="e.g., Breakfast"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emoji">Emoji</Label>
              <Input
                id="emoji"
                placeholder="e.g., 🍳"
                className="text-2xl"
                value={formEmoji}
                onChange={(e) => setFormEmoji(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Brief description of this category..."
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <input
                ref={addFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {formImageUrl ? (
                <div className="relative border rounded-lg overflow-hidden">
                  <img src={formImageUrl} alt="Category" className="w-full h-40 object-cover" />
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={clearFormImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => addFileInputRef.current?.click()}
                  disabled={uploadImage.isPending}
                  className="w-full border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 disabled:opacity-50"
                >
                  {uploadImage.isPending ? (
                    <Loader2 className="h-8 w-8 mx-auto text-muted-foreground mb-2 animate-spin" />
                  ) : (
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  )}
                  <p className="text-sm text-muted-foreground">
                    {uploadImage.isPending ? "Uploading..." : "Click to upload"}
                  </p>
                </button>
              )}
            </div>
            <div className="space-y-3">
              <Label>Visibility</Label>
              <div className="space-y-2">
                {VISIBILITY_OPTIONS.map((opt) => (
                  <div key={opt.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`add-${opt.id}`}
                      checked={formVisibility.includes(opt.value)}
                      onCheckedChange={(checked) => toggleVisibility(opt.value, checked === true)}
                    />
                    <label htmlFor={`add-${opt.id}`} className="text-sm">{opt.label}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <Label>Status</Label>
              <Select
                value={formIsActive ? "active" : "inactive"}
                onValueChange={(v) => setFormIsActive(v === "active")}
              >
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddSheetOpen(false)}
              className="w-full sm:w-auto"
              disabled={createCategory.isPending}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={handleCreate}
              disabled={createCategory.isPending}
            >
              {createCategory.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                      <Input value={formName} onChange={(e) => setFormName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Emoji</Label>
                      <Input
                        value={formEmoji}
                        onChange={(e) => setFormEmoji(e.target.value)}
                        className="text-2xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image</Label>
                      <input
                        ref={editFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      {formImageUrl ? (
                        <div className="relative border rounded-lg overflow-hidden">
                          <img src={formImageUrl} alt="Category" className="w-full h-40 object-cover" />
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7"
                            onClick={clearFormImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => editFileInputRef.current?.click()}
                          disabled={uploadImage.isPending}
                          className="w-full border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 disabled:opacity-50"
                        >
                          {uploadImage.isPending ? (
                            <Loader2 className="h-8 w-8 mx-auto text-muted-foreground mb-2 animate-spin" />
                          ) : (
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          )}
                          <p className="text-sm text-muted-foreground">
                            {uploadImage.isPending ? "Uploading..." : "Click to upload"}
                          </p>
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Label>Visibility</Label>
                      <div className="space-y-2">
                        {VISIBILITY_OPTIONS.map((opt) => (
                          <div key={opt.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`edit-${opt.id}`}
                              checked={formVisibility.includes(opt.value)}
                              onCheckedChange={(checked) => toggleVisibility(opt.value, checked === true)}
                            />
                            <label htmlFor={`edit-${opt.id}`} className="text-sm">{opt.label}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Label>Status</Label>
                      <Select
                        value={formIsActive ? "active" : "inactive"}
                        onValueChange={(v) => setFormIsActive(v === "active")}
                      >
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
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => setIsEditMode(false)}
                      disabled={updateCategory.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="w-full sm:w-auto"
                      onClick={handleSave}
                      disabled={updateCategory.isPending}
                    >
                      {updateCategory.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsEditMode(true)}>
                      <Edit className="h-4 w-4 mr-2" />Edit
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full sm:w-auto"
                      onClick={() => handleDelete(selectedCategory)}
                      disabled={deleteCategory.isPending}
                    >
                      {deleteCategory.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
