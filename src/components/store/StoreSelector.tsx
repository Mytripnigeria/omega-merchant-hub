import { Check, ChevronDown, MapPin, Plus, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/contexts/StoreContext";
import { cn } from "@/lib/utils";

interface StoreSelectorProps {
  collapsed?: boolean;
}

export function StoreSelector({ collapsed = false }: StoreSelectorProps) {
  const { stores, currentStore, setCurrentStore } = useStore();

  if (collapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <Store className="h-5 w-5 text-primary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>Switch Store</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {stores.map((store) => (
            <DropdownMenuItem
              key={store.id}
              onClick={() => setCurrentStore(store)}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">{store.name}</p>
              </div>
              {currentStore?.id === store.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add New Store
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between gap-2 bg-sidebar-accent px-3 py-6 hover:bg-muted"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Store className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{currentStore?.name}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                {currentStore?.address.split(',')[0]}
              </p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Your Stores</span>
          <span className="text-xs text-muted-foreground">{stores.length} locations</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {stores.map((store) => (
          <DropdownMenuItem
            key={store.id}
            onClick={() => setCurrentStore(store)}
            className={cn(
              "flex items-start gap-3 p-3",
              currentStore?.id === store.id && "bg-sidebar-accent"
            )}
          >
            <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">{store.name}</p>
              <p className="text-xs text-muted-foreground">{store.address}</p>
            </div>
            {currentStore?.id === store.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 text-primary">
          <Plus className="h-4 w-4" />
          Add New Store
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
