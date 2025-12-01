"use client";

import type { ProductAttribute } from "@/modules/catalog/domain/entities/Product";

interface ProductAttributesProps {
  attributes: ProductAttribute[];
}

export function ProductAttributes({ attributes }: ProductAttributesProps) {
  if (attributes.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <h3 className="mb-4 text-lg font-semibold text-white">
        Características del producto
      </h3>
      <div className="grid gap-3">
        {attributes.map((attr) => (
          <div
            key={attr.id}
            className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0"
          >
            <span className="text-sm text-neutral-400">{attr.name}</span>
            <span className="text-sm font-medium text-white">
              {attr.valueName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
