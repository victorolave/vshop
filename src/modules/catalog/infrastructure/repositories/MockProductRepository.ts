import type { Product } from "@/modules/catalog/domain/entities/Product";
import type { ProductRepository } from "@/modules/catalog/domain/repositories/ProductRepository";
import productsDetailData from "@/modules/catalog/infrastructure/data/products-detail.json";
import productsData from "@/modules/catalog/infrastructure/data/products-list.json";

// === Raw Types for List Data (snake_case from JSON) ===

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

// === Raw Types for Detail Data (snake_case from JSON) ===

type RawPicture = {
  id: string;
  url: string;
};

type RawAttribute = {
  id: string;
  name: string;
  value_name: string;
};

type RawDescription = {
  plain_text: string;
};

type RawSellerAddress = {
  city: {
    name: string;
  };
  state: {
    name: string;
  };
};

type RawDetailInstallments = {
  quantity: number;
  amount: number;
  rate?: number;
  currency_id?: string;
};

type RawDetailShipping = {
  free_shipping: boolean;
  mode?: string;
  logistic_type?: string;
  store_pick_up?: boolean;
};

type RawDetailProduct = {
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
  pictures?: RawPicture[];
  installments?: RawDetailInstallments;
  shipping?: RawDetailShipping;
  seller_address?: RawSellerAddress;
  attributes?: RawAttribute[];
  warranty?: string;
  description?: RawDescription;
  reviews?: RawReviews;
};

type ProductsDetailJson = Record<string, RawDetailProduct>;

const typedProductsData = productsData as ProductsListJson;
const typedProductsDetailData = productsDetailData as ProductsDetailJson;

// === Mappers ===

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

function mapRawDetailProductToDomain(raw: RawDetailProduct): Product {
  return {
    id: raw.id,
    title: raw.title,
    price: raw.price,
    originalPrice: raw.original_price,
    currencyId: raw.currency_id,
    availableQuantity: raw.available_quantity,
    soldQuantity: raw.sold_quantity,
    condition: raw.condition,
    permalink: raw.permalink,
    thumbnailUrl: raw.thumbnail,
    isNewArrival: raw.condition === "new",
    pictures: raw.pictures?.map((pic) => ({
      id: pic.id,
      url: pic.url,
    })),
    installments: raw.installments
      ? {
          quantity: raw.installments.quantity,
          amount: raw.installments.amount,
          rate: raw.installments.rate,
          currencyId: raw.installments.currency_id,
        }
      : undefined,
    shipping: raw.shipping
      ? {
          freeShipping: raw.shipping.free_shipping,
          mode: raw.shipping.mode,
          logisticType: raw.shipping.logistic_type,
          storePickUp: raw.shipping.store_pick_up,
        }
      : undefined,
    sellerAddress: raw.seller_address
      ? {
          city: { name: raw.seller_address.city.name },
          state: { name: raw.seller_address.state.name },
        }
      : undefined,
    attributes: raw.attributes?.map((attr) => ({
      id: attr.id,
      name: attr.name,
      valueName: attr.value_name,
    })),
    warranty: raw.warranty,
    description: raw.description
      ? { plainText: raw.description.plain_text }
      : undefined,
    reviews: raw.reviews
      ? {
          ratingAverage: raw.reviews.rating_average,
          total: raw.reviews.total,
        }
      : undefined,
  };
}

// === Repository Implementation ===

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

  async findById(id: string): Promise<Product | null> {
    const rawProduct = typedProductsDetailData[id];

    if (!rawProduct) {
      return null;
    }

    return mapRawDetailProductToDomain(rawProduct);
  }
}
