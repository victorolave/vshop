import type { Product } from "@/modules/catalog/domain/entities/Product";
import type { ProductRepository } from "@/modules/catalog/domain/repositories/ProductRepository";
import productsData from "@/modules/catalog/infrastructure/data/products-list.json";

type RawInstallments = {
  quantity: number;
  amount: number;
};

type RawShipping = {
  free_shipping: boolean;
};

type RawReviews = {
  rating_average: number;
  total: number;
};

type RawProduct = {
  id: string;
  title: string;
  price: number;
  currency_id?: string;
  condition: string;
  thumbnail?: string;
  installments?: RawInstallments;
  shipping?: RawShipping;
  reviews?: RawReviews;
};

type ProductsListJson = {
  query: string;
  paging: {
    total: number;
    offset: number;
    limit: number;
  };
  results: RawProduct[];
};

const typedProductsData = productsData as ProductsListJson;

function mapRawProductToDomain(raw: RawProduct): Product {
  return {
    id: raw.id,
    title: raw.title,
    price: raw.price,
    currencyId: raw.currency_id,
    condition: raw.condition,
    thumbnailUrl: raw.thumbnail,
    isNewArrival: raw.condition === "new",
    installments: raw.installments
      ? {
          quantity: raw.installments.quantity,
          amount: raw.installments.amount,
        }
      : undefined,
    shipping: raw.shipping
      ? {
          freeShipping: raw.shipping.free_shipping,
        }
      : undefined,
    reviews: raw.reviews
      ? {
          ratingAverage: raw.reviews.rating_average,
          total: raw.reviews.total,
        }
      : undefined,
  };
}

export class MockProductRepository implements ProductRepository {
  async searchByQuery(query: string): Promise<Product[]> {
    const normalized = query.trim().toLowerCase();

    if (normalized.length === 0) {
      return [];
    }

    const results = typedProductsData.results.filter((raw) =>
      raw.title.toLowerCase().includes(normalized),
    );

    return results.map(mapRawProductToDomain);
  }
}
