"use client";

import { useCallback, useState } from "react";
import type { Product } from "@/modules/catalog/domain/entities/Product";

export type SearchStatus = "idle" | "loading" | "success" | "empty" | "error";

interface ProductResultDTO {
  id: string;
  title: string;
  price: number;
  currency_id?: string;
  condition: string;
  thumbnail?: string;
  installments?: { quantity: number; amount: number };
  shipping?: { free_shipping: boolean };
  reviews?: { rating_average: number; total: number };
}

interface ProductSearchResponse {
  query: string;
  paging: { total: number; offset: number; limit: number };
  results: ProductResultDTO[];
}

/**
 * Maps a BFF DTO to a domain Product entity.
 */
function mapDtoToProduct(dto: ProductResultDTO): Product {
  return {
    id: dto.id,
    title: dto.title,
    price: dto.price,
    currencyId: dto.currency_id,
    condition: dto.condition,
    thumbnailUrl: dto.thumbnail,
    isNewArrival: dto.condition === "new",
    installments: dto.installments,
    shipping: dto.shipping
      ? { freeShipping: dto.shipping.free_shipping }
      : undefined,
    reviews: dto.reviews
      ? { ratingAverage: dto.reviews.rating_average, total: dto.reviews.total }
      : undefined,
  };
}

export interface UseSearchProductsResult {
  products: Product[];
  status: SearchStatus;
  search: (query: string) => Promise<void>;
  retry: () => Promise<void>;
  lastQuery: string;
}

export function useSearchProducts(): UseSearchProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [lastQuery, setLastQuery] = useState("");

  const search = useCallback(async (query: string) => {
    const trimmed = query.trim();
    setLastQuery(trimmed);

    if (!trimmed) {
      setProducts([]);
      setStatus("idle");
      return;
    }

    setStatus("loading");
    setProducts([]);

    try {
      const res = await fetch(`/api/products?q=${encodeURIComponent(trimmed)}`);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: ProductSearchResponse = await res.json();
      const mapped = data.results.map(mapDtoToProduct);

      if (mapped.length === 0) {
        setStatus("empty");
      } else {
        setStatus("success");
      }

      setProducts(mapped);
    } catch {
      setStatus("error");
      setProducts([]);
    }
  }, []);

  const retry = useCallback(async () => {
    if (lastQuery) {
      await search(lastQuery);
    }
  }, [lastQuery, search]);

  return { products, status, search, retry, lastQuery };
}
