import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useVariationGroups,
  useVariationGroupStats,
  useCreateVariationGroup,
  useUpdateVariationGroup,
  useDeleteVariationGroup,
} from "@/hooks/api/use-stock";
import type { VariationGroup } from "@/services/api/stock";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Settings2,
  Search,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
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

function TableSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="block sm:hidden divide-y divide-border">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-5 w-16 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="hidden sm:block">
          <div className="p-4 border-b">
            <div className="flex gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-24" />
              ))}
            </div>
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 border-b last:border-0">
              <div className="flex gap-4 items-center">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-4 w-24" />
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-5 w-16 rounded-full" />
                  ))}
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function parseOptionsInput(raw: string): { name: string }[] {
  return raw
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
    .map(name => ({ name }));
}

function optionsToString(options: { name: string }[]): string {
  return options.map(o => o.name).join(", ");
}

export default function VariationsPage() {
  // Variation groups are business-scoped on the backend.
  const { data: variationsData, isLoading } = useVariationGroups();
  const { data: stats } = useVariationGroupStats();
  const variations: VariationGroup[] = variationsData?.data ?? [];

  const createVariationGroup = useCreateVariationGroup();
  const updateVariationGroup = useUpdateVariationGroup();
  const deleteVariationGroup = useDeleteVariationGroup();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<VariationGroup | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formOptions, setFormOptions] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  useEffect(() => {
    if (selectedVariation && isEditMode) {
      setFormName(selectedVariation.name);
      setFormOptions(optionsToString(selectedVariation.options ?? []));
      setFormIsActive(selectedVariation.isActive);
    }
  }, [selectedVariation, isEditMode]);

  const filteredVariations = variations.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const resetForm = () => {
    setFormName("");
    setFormOptions("");
    setFormIsActive(true);
  };

  const handleViewVariation = (variation: VariationGroup) => {
    setSelectedVariation(variation);
    setIsEditMode(false);
    setIsViewSheetOpen(true);
  };

  const handleEditVariation = (variation: VariationGroup) => {
    setSelectedVariation(variation);
    setIsEditMode(true);
    setIsViewSheetOpen(true);
  };

  const handleToggleActive = (variation: VariationGroup) => {
    updateVariationGroup.mutate(
      { id: variation.id, data: { isActive: !variation.isActive } },
      {
        onError: () => toast.error("Failed to update status"),
      },
    );
  };

  const handleCreate = () => {
    if (!formName.trim()) {
      toast.error("Group name is required");
      return;
    }
    const options = parseOptionsInput(formOptions);
    if (options.length === 0) {
      toast.error("Add at least one option");
      return;
    }
    createVariationGroup.mutate(
      { name: formName.trim(), isActive: formIsActive, options },
      {
        onSuccess: () => {
          toast.success("Variation group created");
          setIsAddSheetOpen(false);
          resetForm();
        },
        onError: (e: Error) => toast.error(e.message ?? "Failed to create"),
      },
    );
  };

  const handleUpdate = () => {
    if (!selectedVariation) return;
    if (!formName.trim()) {
      toast.error("Group name is required");
      return;
    }
    const options = parseOptionsInput(formOptions);
    if (options.length === 0) {
      toast.error("Add at least one option");
      return;
    }
    updateVariationGroup.mutate(
      {
        id: selectedVariation.id,
        data: { name: formName.trim(), isActive: formIsActive, options },
      },
      {
        onSuccess: () => {
          toast.success("Variation group updated");
          setIsViewSheetOpen(false);
          setIsEditMode(false);
        },
        onError: (e: Error) => toast.error(e.message ?? "Failed to update"),
      },
    );
  };

  const handleDelete = (variation: VariationGroup) => {
    deleteVariationGroup.mutate(variation.id, {
      onSuccess: () => {
        toast.success("Variation group deleted");
        setIsViewSheetOpen(false);
        setSelectedVariation(null);
      },
      onError: (e: Error) => toast.error(e.message ?? "Failed to delete"),
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Variations</h1>
          <p className="text-sm text-muted-foreground">
            Create variation groups to customize products
          </p>
        </div>
        <Button
          size="sm"
          className="w-full sm:w-auto"
          onClick={() => {
            resetForm();
            setIsAddSheetOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Variation
        </Button>
      </div>

      {/* Stats */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Variation Groups</p>
              <p className="text-xl sm:text-2xl font-semibold">
                {stats?.groups ?? variations.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Options</p>
              <p className="text-xl sm:text-2xl font-semibold">
                {stats?.totalOptions ??
                  variations.reduce((acc, v) => acc + (v.options?.length ?? 0), 0)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search variations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : (
        <Card>
          <CardContent className="p-0">
            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-border">
              {filteredVariations.map((variation) => (
                <div
                  key={variation.id}
                  className="p-4 space-y-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => handleViewVariation(variation)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
                      <Settings2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{variation.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {variation.options?.length ?? 0} options
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditVariation(variation)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(variation);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(variation.options ?? []).map((option) => (
                      <Badge key={option.id} variant="secondary" className="text-xs">
                        {option.name}
                      </Badge>
                    ))}
                  </div>
                  <div
                    className="flex items-center justify-between pt-2 border-t"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-xs text-muted-foreground">
                      {variation.isActive ? "Active" : "Inactive"}
                    </span>
                    <Switch
                      checked={variation.isActive}
                      onCheckedChange={() => handleToggleActive(variation)}
                      disabled={updateVariationGroup.isPending}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Group Name</TableHead>
                    <TableHead>Options</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="pr-6 w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVariations.map((variation) => (
                    <TableRow
                      key={variation.id}
                      className="group cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewVariation(variation)}
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <Settings2 className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <span className="font-medium">{variation.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(variation.options ?? []).map((option) => (
                            <Badge key={option.id} variant="secondary" className="text-xs">
                              {option.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={variation.isActive}
                            onCheckedChange={() => handleToggleActive(variation)}
                            disabled={updateVariationGroup.isPending}
                          />
                          <span className="text-sm text-muted-foreground">
                            {variation.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="pr-6" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditVariation(variation)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(variation)}
                            >
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredVariations.length} of {variations.length} variations
        </p>
      </div>

      {/* Add Variation Sheet */}
      <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add Variation Group</SheetTitle>
            <SheetDescription>
              Create a new variation group (e.g., Size, Protein Choice)
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                placeholder="e.g., Size"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="options">Options (comma separated)</Label>
              <Input
                id="options"
                placeholder="e.g., Small, Medium, Large"
                value={formOptions}
                onChange={(e) => setFormOptions(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Separate each option with a comma</p>
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
              disabled={createVariationGroup.isPending}
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={handleCreate}
              disabled={createVariationGroup.isPending}
            >
              {createVariationGroup.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Group
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* View/Edit Variation Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedVariation && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                    <Settings2 className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div>
                    <SheetTitle>{selectedVariation.name}</SheetTitle>
                    <SheetDescription>
                      {selectedVariation.options?.length ?? 0} options
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="py-6 space-y-4">
                {isEditMode ? (
                  <>
                    <div className="space-y-2">
                      <Label>Group Name</Label>
                      <Input
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Options (comma separated)</Label>
                      <Input
                        value={formOptions}
                        onChange={(e) => setFormOptions(e.target.value)}
                      />
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
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Options</p>
                      <div className="flex flex-wrap gap-2">
                        {(selectedVariation.options ?? []).map((option) => (
                          <Badge key={option.id} variant="secondary" className="text-sm">
                            {option.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge variant={selectedVariation.isActive ? "default" : "secondary"}>
                          {selectedVariation.isActive ? "Active" : "Inactive"}
                        </Badge>
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
                      disabled={updateVariationGroup.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="w-full sm:w-auto"
                      onClick={handleUpdate}
                      disabled={updateVariationGroup.isPending}
                    >
                      {updateVariationGroup.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => setIsEditMode(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />Edit
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full sm:w-auto"
                      onClick={() => handleDelete(selectedVariation)}
                      disabled={deleteVariationGroup.isPending}
                    >
                      {deleteVariationGroup.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
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
