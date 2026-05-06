import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, Image as ImageIcon, Search, MoreHorizontal, Trash2, Edit, 
  GripVertical, Eye, ExternalLink, Sun, Moon
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { 
  useFeatureBanners, 
  useCreateFeatureBanner, 
  useUpdateFeatureBanner, 
  useDeleteFeatureBanner,
  useReorderFeatureBanners 
} from "@/hooks/api/use-storefront";
import type { FeatureBanner, CreateFeatureBannerRequest, UpdateFeatureBannerRequest } from "@/types/storefront";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from "@/lib/utils";

const themeColors = {
  light: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  dark: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400",
};

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

// Sortable Banner Item Component
interface SortableBannerItemProps {
  banner: FeatureBanner;
  onView: (banner: FeatureBanner) => void;
  onEdit: (banner: FeatureBanner) => void;
  onDelete: (banner: FeatureBanner) => void;
}

function SortableBannerItem({ banner, onView, onEdit, onDelete }: SortableBannerItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group bg-background",
        isDragging && "opacity-50 shadow-lg z-50"
      )}
      onClick={() => onView(banner)}
    >
      {/* Drag Handle & Position */}
      <div 
        className="hidden sm:flex flex-col items-center gap-1 text-muted-foreground cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-4 w-4" />
        <span className="text-xs font-medium">{banner.position}</span>
      </div>

      {/* Image Preview */}
      <div className="relative h-14 w-20 sm:h-16 sm:w-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
        {banner.imageUrl ? (
          <img 
            src={banner.imageUrl} 
            alt={banner.title} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <div className={`absolute inset-0 ${banner.theme === 'dark' ? 'bg-black/30' : 'bg-white/30'}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-sm sm:text-base truncate">{banner.title}</h3>
          <Badge className={themeColors[banner.theme]} variant="secondary">
            {banner.theme === 'dark' ? <Moon className="h-3 w-3 mr-1" /> : <Sun className="h-3 w-3 mr-1" />}
            {banner.theme}
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground truncate">{banner.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{banner.actionText}</span>
          <span className="text-xs text-muted-foreground">→</span>
          <span className="text-xs text-primary truncate">{banner.actionUrl}</span>
        </div>
      </div>

      {/* Status & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Badge 
          className={banner.isActive ? statusColors.active : statusColors.inactive} 
          variant="secondary"
        >
          {banner.isActive ? 'Active' : 'Inactive'}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(banner); }}>
              <Eye className="mr-2 h-4 w-4" />View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(banner); }}>
              <Edit className="mr-2 h-4 w-4" />Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive" 
              onClick={(e) => { e.stopPropagation(); onDelete(banner); }}
            >
              <Trash2 className="mr-2 h-4 w-4" />Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

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

function BannersSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-lg">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-16 w-24 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-8 w-8" />
        </div>
      ))}
    </div>
  );
}

interface BannerFormData {
  title: string;
  description: string;
  imageUrl: string;
  theme: 'light' | 'dark';
  actionText: string;
  actionUrl: string;
  isActive: boolean;
}

const defaultFormData: BannerFormData = {
  title: '',
  description: '',
  imageUrl: '',
  theme: 'dark',
  actionText: '',
  actionUrl: '',
  isActive: true,
};

export default function FeatureBannersPage() {
  const [search, setSearch] = useState("");
  const [selectedBanner, setSelectedBanner] = useState<FeatureBanner | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"view" | "edit" | "add">("view");
  const [formData, setFormData] = useState<BannerFormData>(defaultFormData);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<FeatureBanner | null>(null);

  const { data: bannersData, isLoading } = useFeatureBanners({ search: search || undefined });
  const createMutation = useCreateFeatureBanner();
  const updateMutation = useUpdateFeatureBanner();
  const deleteMutation = useDeleteFeatureBanner();
  const reorderMutation = useReorderFeatureBanners();

  const banners = bannersData?.data || [];
  const totalBanners = banners.length;
  const activeBanners = banners.filter(b => b.isActive).length;

  const stats = [
    { label: "Total Banners", value: totalBanners.toString() },
    { label: "Active", value: activeBanners.toString() },
    { label: "Inactive", value: (totalBanners - activeBanners).toString() },
  ];

  const openViewSheet = (banner: FeatureBanner) => {
    setSelectedBanner(banner);
    setSheetMode("view");
    setIsSheetOpen(true);
  };

  const openEditSheet = (banner: FeatureBanner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      theme: banner.theme,
      actionText: banner.actionText,
      actionUrl: banner.actionUrl,
      isActive: banner.isActive,
    });
    setSheetMode("edit");
    setIsSheetOpen(true);
  };

  const openAddSheet = () => {
    setSelectedBanner(null);
    setFormData(defaultFormData);
    setSheetMode("add");
    setIsSheetOpen(true);
  };

  const closeSheet = () => {
    setSelectedBanner(null);
    setIsSheetOpen(false);
    setFormData(defaultFormData);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.imageUrl || !formData.actionText || !formData.actionUrl) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (sheetMode === "add") {
        await createMutation.mutateAsync(formData as CreateFeatureBannerRequest);
        toast.success("Banner created successfully");
      } else if (sheetMode === "edit" && selectedBanner) {
        await updateMutation.mutateAsync({ id: selectedBanner.id, data: formData as UpdateFeatureBannerRequest });
        toast.success("Banner updated successfully");
      }
      closeSheet();
    } catch {
      toast.error("Failed to save banner");
    }
  };

  const handleDelete = async () => {
    if (!bannerToDelete) return;
    
    try {
      await deleteMutation.mutateAsync(bannerToDelete.id);
      toast.success("Banner deleted successfully");
      setDeleteDialogOpen(false);
      setBannerToDelete(null);
      if (selectedBanner?.id === bannerToDelete.id) {
        closeSheet();
      }
    } catch {
      toast.error("Failed to delete banner");
    }
  };

  const handleToggleActive = async (banner: FeatureBanner) => {
    try {
      await updateMutation.mutateAsync({ id: banner.id, data: { isActive: !banner.isActive } });
      toast.success(`Banner ${banner.isActive ? 'deactivated' : 'activated'}`);
    } catch {
      toast.error("Failed to update banner status");
    }
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = banners.findIndex((b) => b.id === active.id);
      const newIndex = banners.findIndex((b) => b.id === over.id);
      const newOrder = arrayMove(banners, oldIndex, newIndex);
      
      try {
        await reorderMutation.mutateAsync(
          newOrder.map((b, idx) => ({ id: b.id, position: idx })),
        );
        toast.success("Banners reordered");
      } catch {
        toast.error("Failed to reorder banners");
      }
    }
  };

  const confirmDelete = (banner: FeatureBanner) => {
    setBannerToDelete(banner);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Feature Banners</h1>
          <p className="text-sm text-muted-foreground">Manage hero banners for your storefront</p>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={openAddSheet}>
          <Plus className="mr-2 h-4 w-4" />Add Banner
        </Button>
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
            <Input 
              placeholder="Search banners..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-10" 
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {isLoading ? <BannersSkeleton /> : banners.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium text-foreground mb-1">No banners yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Create your first feature banner</p>
              <Button size="sm" onClick={openAddSheet}>
                <Plus className="mr-2 h-4 w-4" />Add Banner
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={banners} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {banners.map((banner) => (
                    <SortableBannerItem
                      key={banner.id}
                      banner={banner}
                      onView={openViewSheet}
                      onEdit={openEditSheet}
                      onDelete={confirmDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* Action Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={closeSheet}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle>
                {sheetMode === "add" ? "Add Banner" : sheetMode === "edit" ? "Edit Banner" : selectedBanner?.title}
              </SheetTitle>
              {selectedBanner && sheetMode === "view" && (
                <Badge 
                  className={selectedBanner.isActive ? statusColors.active : statusColors.inactive} 
                  variant="secondary"
                >
                  {selectedBanner.isActive ? 'Active' : 'Inactive'}
                </Badge>
              )}
            </div>
            <SheetDescription>
              {sheetMode === "add" 
                ? "Create a new feature banner for your storefront" 
                : sheetMode === "edit" 
                  ? "Update banner details" 
                  : `Position ${selectedBanner?.position}`}
            </SheetDescription>
          </SheetHeader>

          {sheetMode === "view" && selectedBanner ? (
            <div className="mt-6 space-y-6">
              {/* Image Preview */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                {selectedBanner.imageUrl ? (
                  <img 
                    src={selectedBanner.imageUrl} 
                    alt={selectedBanner.title} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className={`absolute inset-0 ${selectedBanner.theme === 'dark' ? 'bg-black/40' : 'bg-white/40'}`}>
                  <div className={`absolute bottom-4 left-4 right-4 ${selectedBanner.theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    <h3 className="font-bold text-lg">{selectedBanner.title}</h3>
                    <p className="text-sm opacity-90 mt-1">{selectedBanner.description}</p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Theme</Label>
                  <Badge className={themeColors[selectedBanner.theme]} variant="secondary">
                    {selectedBanner.theme === 'dark' ? <Moon className="h-3 w-3 mr-1" /> : <Sun className="h-3 w-3 mr-1" />}
                    {selectedBanner.theme}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Position</Label>
                  <p className="text-sm font-medium">{selectedBanner.position}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Action Text</Label>
                  <p className="text-sm font-medium">{selectedBanner.actionText}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Action URL</Label>
                  <a href={selectedBanner.actionUrl} className="text-sm text-primary flex items-center gap-1">
                    {selectedBanner.actionUrl}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Created</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedBanner.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Last Updated</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedBanner.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Active Status</p>
                  <p className="text-xs text-muted-foreground">Show this banner on your storefront</p>
                </div>
                <Switch 
                  checked={selectedBanner.isActive} 
                  onCheckedChange={() => handleToggleActive(selectedBanner)}
                />
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input 
                  placeholder="e.g., Weekend Special Offers" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea 
                  placeholder="Brief description of the banner..." 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Image URL *</Label>
                <Input 
                  placeholder="https://example.com/image.jpg" 
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
                {formData.imageUrl && (
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted mt-2">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="h-full w-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Theme *</Label>
                <Select 
                  value={formData.theme} 
                  onValueChange={(value: 'light' | 'dark') => setFormData({ ...formData, theme: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />Light
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Action Text *</Label>
                  <Input 
                    placeholder="e.g., Learn More" 
                    value={formData.actionText}
                    onChange={(e) => setFormData({ ...formData, actionText: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Action URL *</Label>
                  <Input 
                    placeholder="/page-url" 
                    value={formData.actionUrl}
                    onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Active</p>
                  <p className="text-xs text-muted-foreground">Show this banner on your storefront</p>
                </div>
                <Switch 
                  checked={formData.isActive} 
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </div>
          )}

          <SheetFooter className="mt-6 flex-col sm:flex-row gap-2">
            {sheetMode === "view" ? (
              <>
                <Button variant="outline" onClick={() => openEditSheet(selectedBanner!)} className="w-full sm:w-auto">
                  Edit Banner
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => confirmDelete(selectedBanner!)} 
                  className="w-full sm:w-auto"
                >
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={closeSheet} className="w-full sm:w-auto">Cancel</Button>
                <Button 
                  onClick={handleSave} 
                  className="w-full sm:w-auto"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending 
                    ? "Saving..." 
                    : sheetMode === "add" ? "Create Banner" : "Save Changes"}
                </Button>
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Banner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{bannerToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
