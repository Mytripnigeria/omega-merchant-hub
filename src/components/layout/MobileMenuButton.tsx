import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileMenuButtonProps {
  onClick: () => void;
  className?: string;
}

export function MobileMenuButton({ onClick, className }: MobileMenuButtonProps) {
  return (
    <Button
      variant="default"
      size="icon"
      className={cn(
        "fixed bottom-4 left-4 z-50 h-12 w-12 rounded-full shadow-lg md:hidden",
        "bg-foreground text-background hover:bg-foreground/90",
        "transition-transform active:scale-95",
        className
      )}
      onClick={onClick}
      aria-label="Open navigation menu"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
