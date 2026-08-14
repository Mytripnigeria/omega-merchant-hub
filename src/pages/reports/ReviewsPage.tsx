import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { OrderReview } from "@/types/reviews";
import { Image as ImageIcon, Star } from "lucide-react";
import { useStore } from "@/contexts/StoreContext";
import { useReviews } from "@/hooks/api/use-reviews";

const fmt = (d: string | null) => (d ? new Date(d).toLocaleString() : "—");

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < rating
              ? "h-4 w-4 fill-yellow-400 text-yellow-400"
              : "h-4 w-4 text-muted-foreground/40"
          }
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const { currentStore, isAllStoresMode } = useStore();
  const storeId = isAllStoresMode ? undefined : currentStore?.id;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [viewing, setViewing] = useState<OrderReview | null>(null);
  const { data, isLoading } = useReviews({ storeId, page, limit: pageSize });
  const reviews = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const startIndex = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, total);

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reviews</h1>
        <p className="text-sm text-muted-foreground">
          Storefront reviews left by your customers
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Customer Reviews</h2>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No reviews yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Photos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{fmt(r.createdAt)}</TableCell>
                    <TableCell>{r.customerName}</TableCell>
                    <TableCell>
                      <Stars rating={r.rating} />
                    </TableCell>
                    <TableCell>
                      {r.orderNumber != null ? `#${r.orderNumber}` : "—"}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {r.comment ?? "—"}
                    </TableCell>
                    <TableCell>
                      {r.imageUrls?.length ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 px-2"
                          onClick={() => setViewing(r)}
                        >
                          <ImageIcon className="h-4 w-4" />
                          View
                          {r.imageUrls.length > 1 ? ` (${r.imageUrls.length})` : ""}
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Photo viewer — the merchant needs to see what the customer attached. */}
      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Photos from {viewing?.customerName}
              {viewing?.orderNumber != null ? ` · Order #${viewing.orderNumber}` : ""}
            </DialogTitle>
          </DialogHeader>
          {viewing?.comment && (
            <p className="text-sm text-muted-foreground">{viewing.comment}</p>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            {(viewing?.imageUrls ?? []).map((url, i) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="block overflow-hidden rounded-lg border"
                title="Open full size"
              >
                <img
                  src={url}
                  alt={`Review photo ${i + 1}`}
                  loading="lazy"
                  className="h-56 w-full object-cover"
                />
              </a>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <TablePagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={total}
        startIndex={startIndex}
        endIndex={endIndex}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />
    </div>
  );
}
