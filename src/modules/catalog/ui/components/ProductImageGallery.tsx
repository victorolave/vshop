"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import type { Picture } from "@/modules/catalog/domain/entities/Product";

interface ProductImageGalleryProps {
  pictures: Picture[];
  productId: string;
  productTitle: string;
}

export function ProductImageGallery({
  pictures,
  productId,
  productTitle,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const mainImage = pictures[selectedIndex];
  const hasValidImage = mainImage && !imageError;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image with layoutId for Hero Animation */}
      <motion.div
        layoutId={`product-image-${productId}`}
        className="relative aspect-square overflow-hidden rounded-xl bg-neutral-900"
      >
        {hasValidImage ? (
          <Image
            src={mainImage.url}
            alt={productTitle}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
            priority
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 text-neutral-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24"
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
      </motion.div>

      {/* Thumbnail strip */}
      {pictures.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {pictures.map((pic, index) => (
            <button
              key={pic.id}
              type="button"
              onClick={() => {
                setSelectedIndex(index);
                setImageError(false);
              }}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                index === selectedIndex
                  ? "border-primary"
                  : "border-transparent hover:border-white/30"
              }`}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <Image
                src={pic.url}
                alt={`${productTitle} - imagen ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
