import { AlertCircle, Inbox, RefreshCcw, Search, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataStateProps {
  className?: string;
}

interface EmptyStateProps extends DataStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ErrorStateProps extends DataStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

interface NoSearchResultsProps extends DataStateProps {
  query?: string;
  onClear?: () => void;
}

export function EmptyState({
  title = "No data yet",
  description = "Get started by creating your first item",
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        {icon || <Inbox className="h-6 w-6 text-muted-foreground" />}
      </div>
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className="mb-4 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && (
        <Button onClick={action.onClick} size="sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load the data. Please try again.",
  onRetry,
  retryLabel = "Try again",
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className="mb-4 max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCcw className="mr-2 h-4 w-4" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

export function NoSearchResults({
  query,
  onClear,
  className,
}: NoSearchResultsProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Search className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mb-1 text-lg font-semibold">No results found</h3>
      <p className="mb-4 max-w-sm text-sm text-muted-foreground">
        {query ? (
          <>No results for "<span className="font-medium">{query}</span>". Try a different search.</>
        ) : (
          "Try adjusting your search or filters to find what you're looking for."
        )}
      </p>
      {onClear && (
        <Button onClick={onClear} variant="outline" size="sm">
          Clear search
        </Button>
      )}
    </div>
  );
}

export function OfflineState({ className }: DataStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <WifiOff className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mb-1 text-lg font-semibold">You're offline</h3>
      <p className="mb-4 max-w-sm text-sm text-muted-foreground">
        Check your internet connection and try again.
      </p>
      <Button onClick={() => window.location.reload()} variant="outline" size="sm">
        <RefreshCcw className="mr-2 h-4 w-4" />
        Refresh
      </Button>
    </div>
  );
}

// Table-specific wrapper
export function TableEmptyState(props: EmptyStateProps) {
  return (
    <tr>
      <td colSpan={100}>
        <EmptyState {...props} />
      </td>
    </tr>
  );
}

export function TableErrorState(props: ErrorStateProps) {
  return (
    <tr>
      <td colSpan={100}>
        <ErrorState {...props} />
      </td>
    </tr>
  );
}

export function TableNoSearchResults(props: NoSearchResultsProps) {
  return (
    <tr>
      <td colSpan={100}>
        <NoSearchResults {...props} />
      </td>
    </tr>
  );
}
