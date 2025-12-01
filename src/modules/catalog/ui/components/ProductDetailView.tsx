"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/modules/catalog/domain/entities/Product";
import { ProductAttributes } from "./ProductAttributes";
import { ProductImageGallery } from "./ProductImageGallery";

interface ProductDetailViewProps {
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

// Animation variants for secondary content
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const originalPrice = product.originalPrice ?? 0;
  const hasDiscount = originalPrice > 0 && originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;

  const pictures = product.pictures || [
    { id: "1", url: product.thumbnailUrl || "" },
  ];

  return (
    <motion.article
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid gap-8 lg:grid-cols-2"
    >
      {/* Left: Image Gallery */}
      <div>
        <ProductImageGallery
          pictures={pictures}
          productId={product.id}
          productTitle={product.title}
        />
      </div>

      {/* Right: Product Info */}
      <motion.div variants={contentVariants} className="flex flex-col gap-6">
        {/* Condition & Sold */}
        <div className="flex items-center gap-3">
          <Badge
            variant={product.condition === "new" ? "default" : "secondary"}
          >
            {product.condition === "new" ? "Nuevo" : "Usado"}
          </Badge>
          {product.soldQuantity && product.soldQuantity > 0 && (
            <span className="text-sm text-neutral-400">
              {product.soldQuantity} vendidos
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold leading-tight text-white lg:text-3xl">
          {product.title}
        </h1>

        {/* Reviews */}
        {product.reviews && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    star <= Math.round(product.reviews?.ratingAverage ?? 0)
                      ? "text-yellow-400"
                      : "text-neutral-600"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-medium text-white">
              {product.reviews.ratingAverage.toFixed(1)}
            </span>
            <span className="text-sm text-neutral-400">
              ({product.reviews.total} opiniones)
            </span>
          </div>
        )}

        {/* Price Section */}
        <div className="space-y-1">
          {hasDiscount && (
            <div className="flex items-center gap-2">
              <span className="text-lg text-neutral-500 line-through">
                {formatPrice(originalPrice)}
              </span>
              <Badge variant="destructive" className="bg-green-600">
                {discountPercentage}% OFF
              </Badge>
            </div>
          )}
          <p className="text-4xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>
          {product.installments && (
            <p className="text-sm text-neutral-300">
              en {product.installments.quantity}x{" "}
              {formatPrice(product.installments.amount)}
              {product.installments.rate === 0 && (
                <span className="ml-1 text-green-400">sin interés</span>
              )}
            </p>
          )}
        </div>

        {/* Shipping */}
        {product.shipping?.freeShipping && (
          <div className="flex items-center gap-2 text-green-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
            <span className="font-medium">Envío gratis</span>
          </div>
        )}

        {/* Stock */}
        {product.availableQuantity !== undefined && (
          <div className="text-sm">
            {product.availableQuantity > 0 ? (
              <span className="text-green-400">
                Stock disponible ({product.availableQuantity} unidades)
              </span>
            ) : (
              <span className="text-red-400">Sin stock</span>
            )}
          </div>
        )}

        {/* Seller Location */}
        {product.sellerAddress && (
          <div className="flex items-center gap-2 text-sm text-neutral-400">
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>
              {product.sellerAddress.city.name},{" "}
              {product.sellerAddress.state.name}
            </span>
          </div>
        )}

        {/* Warranty */}
        {product.warranty && (
          <div className="flex items-center gap-2 text-sm text-neutral-400">
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>{product.warranty}</span>
          </div>
        )}

        {/* Attributes */}
        {product.attributes && product.attributes.length > 0 && (
          <ProductAttributes attributes={product.attributes} />
        )}

        {/* Description */}
        {product.description && (
          <motion.div
            variants={contentVariants}
            className="rounded-lg border border-white/10 bg-white/5 p-4"
          >
            <h3 className="mb-3 text-lg font-semibold text-white">
              Descripción
            </h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-300">
              {product.description.plainText}
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.article>
  );
}
