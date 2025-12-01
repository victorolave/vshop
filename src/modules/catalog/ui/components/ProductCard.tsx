"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/modules/catalog/domain/entities/Product";

interface ProductCardProps {
  product: Product;
}

/**
 * Formats a number as Argentine peso currency (ARS).
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Validates if a string is a valid URL or path for images.
 * Accepts absolute URLs (http/https) or relative paths starting with "/".
 */
function isValidImageUrl(url: string | undefined): boolean {
  if (!url) return false;
  // Accept relative paths starting with "/"
  if (url.startsWith("/")) return true;
  // Accept absolute URLs
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("q");
  const hasValidImage = isValidImageUrl(product.thumbnailUrl) && !imageError;

  // Build the product detail URL with search query preservation
  const productUrl = currentQuery
    ? `/items/${product.id}?q=${encodeURIComponent(currentQuery)}`
    : `/items/${product.id}`;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    setAdded(true);
    // Reset after 1.5s
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link href={productUrl} className="block">
      <article
        data-testid="product-card"
        className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20"
      >
        {/* Image container with layoutId for Hero Animation */}
        <motion.div
          layoutId={`product-image-${product.id}`}
          className="relative aspect-square overflow-hidden bg-neutral-900"
        >
          {hasValidImage && product.thumbnailUrl ? (
            <Image
              src={product.thumbnailUrl}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 text-neutral-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* New Arrival badge */}
          {product.isNewArrival && (
            <span className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-black">
              New Arrival
            </span>
          )}
        </motion.div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-white">
            {product.title}
          </h3>

          <p className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </p>

          {/* Installments */}
          {product.installments && (
            <p className="text-xs text-neutral-400">
              {product.installments.quantity}x{" "}
              {formatPrice(product.installments.amount)}
            </p>
          )}

          {/* Free shipping */}
          {product.shipping?.freeShipping && (
            <span className="inline-flex w-fit items-center gap-1 rounded bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Free Shipping
            </span>
          )}

          {/* Reviews */}
          {product.reviews && (
            <div className="flex items-center gap-1 text-xs text-neutral-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{product.reviews.ratingAverage.toFixed(1)}</span>
              <span className="text-neutral-500">
                ({product.reviews.total})
              </span>
            </div>
          )}

          {/* Add button */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={added}
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-semibold text-black transition-colors hover:bg-primary/90 disabled:cursor-default disabled:bg-green-500"
            aria-label={added ? "Added to cart" : "Add to cart"}
          >
            {added ? (
              <>
                <svg
                  data-testid="add-success"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Added
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add
              </>
            )}
          </button>
        </div>
      </article>
    </Link>
  );
}
