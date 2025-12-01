"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/modules/catalog/domain/entities/Product";

interface UseProductDetailResult {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
  notFound: boolean;
  refetch: () => void;
}

interface ApiProduct {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  currency_id?: string;
  available_quantity?: number;
  sold_quantity?: number;
  condition: string;
  permalink?: string;
  thumbnail?: string;
  pictures?: Array<{ id: string; url: string }>;
  installments?: {
    quantity: number;
    amount: number;
    rate?: number;
    currency_id?: string;
  };
  shipping?: {
    free_shipping: boolean;
    mode?: string;
    logistic_type?: string;
    store_pick_up?: boolean;
  };
  seller_address?: {
    city: { name: string };
    state: { name: string };
  };
  attributes?: Array<{
    id: string;
    name: string;
    value_name: string;
  }>;
  warranty?: string;
  description?: { plain_text: string };
  reviews?: {
    rating_average: number;
    total: number;
  };
}

function mapApiProductToDomain(api: ApiProduct): Product {
  return {
    id: api.id,
    title: api.title,
    price: api.price,
    originalPrice: api.original_price,
    currencyId: api.currency_id,
    availableQuantity: api.available_quantity,
    soldQuantity: api.sold_quantity,
    condition: api.condition,
    permalink: api.permalink,
    thumbnailUrl: api.thumbnail,
    isNewArrival: api.condition === "new",
    pictures: api.pictures?.map((pic) => ({
      id: pic.id,
      url: pic.url,
    })),
    installments: api.installments
      ? {
          quantity: api.installments.quantity,
          amount: api.installments.amount,
          rate: api.installments.rate,
          currencyId: api.installments.currency_id,
        }
      : undefined,
    shipping: api.shipping
      ? {
          freeShipping: api.shipping.free_shipping,
          mode: api.shipping.mode,
          logisticType: api.shipping.logistic_type,
          storePickUp: api.shipping.store_pick_up,
        }
      : undefined,
    sellerAddress: api.seller_address
      ? {
          city: { name: api.seller_address.city.name },
          state: { name: api.seller_address.state.name },
        }
      : undefined,
    attributes: api.attributes?.map((attr) => ({
      id: attr.id,
      name: attr.name,
      valueName: attr.value_name,
    })),
    warranty: api.warranty,
    description: api.description
      ? { plainText: api.description.plain_text }
      : undefined,
    reviews: api.reviews
      ? {
          ratingAverage: api.reviews.rating_average,
          total: api.reviews.total,
        }
      : undefined,
  };
}

export function useProductDetail(
  productId: string | null,
): UseProductDetailResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setNotFound(false);
    setProduct(null);

    try {
      const response = await fetch(`/api/products/${productId}`);

      if (response.status === 404) {
        setNotFound(true);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || "Failed to fetch product details",
        );
      }

      const data: ApiProduct = await response.json();
      setProduct(mapApiProductToDomain(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    isLoading,
    error,
    notFound,
    refetch: fetchProduct,
  };
}
