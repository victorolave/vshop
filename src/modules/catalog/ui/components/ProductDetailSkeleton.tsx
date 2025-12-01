import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div
      data-testid="product-detail-loader"
      className="grid gap-8 lg:grid-cols-2"
    >
      {/* Image skeleton */}
      <Skeleton className="aspect-square w-full rounded-xl bg-white/10" />

      {/* Content skeleton */}
      <div className="flex flex-col gap-6">
        {/* Title */}
        <Skeleton className="h-8 w-3/4 bg-white/10" />

        {/* Rating */}
        <div className="flex gap-2">
          <Skeleton className="h-5 w-24 bg-white/10" />
          <Skeleton className="h-5 w-24 bg-white/10" />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Skeleton className="h-10 w-48 bg-white/10" />
          <Skeleton className="h-5 w-32 bg-white/10" />
        </div>

        {/* Shipping */}
        <Skeleton className="h-6 w-40 bg-white/10" />

        {/* Stock */}
        <Skeleton className="h-5 w-32 bg-white/10" />

        {/* Location */}
        <Skeleton className="h-5 w-48 bg-white/10" />

        {/* Attributes */}
        <Skeleton className="h-48 w-full rounded-lg bg-white/10" />

        {/* Description */}
        <Skeleton className="h-32 w-full rounded-lg bg-white/10" />
      </div>
    </div>
  );
}
