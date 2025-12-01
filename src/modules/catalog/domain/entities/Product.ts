// === Detail-Only Interfaces ===

export interface Picture {
  id: string;
  url: string;
}

export interface ProductAttribute {
  id: string;
  name: string;
  valueName: string;
}

export interface ProductDescription {
  plainText: string;
}

export interface SellerAddress {
  city: {
    name: string;
  };
  state: {
    name: string;
  };
}

// === Shared Interfaces (extended for detail view) ===

export interface Installments {
  quantity: number;
  amount: number;
  rate?: number;
  currencyId?: string;
}

export interface ShippingSummary {
  freeShipping: boolean;
  mode?: string;
  logisticType?: string;
  storePickUp?: boolean;
}

export interface ReviewSummary {
  ratingAverage: number;
  total: number;
}

// === Main Product Interface ===

export interface Product {
  // === Core Fields (required for all views) ===
  id: string;
  title: string;
  price: number;
  condition: "new" | "used" | string;

  // === Listing Fields (optional, used in cards) ===
  currencyId?: string;
  thumbnailUrl?: string;
  isNewArrival?: boolean;
  installments?: Installments;
  shipping?: ShippingSummary;
  reviews?: ReviewSummary;

  // === Detail-Only Fields (populated in detail view) ===
  originalPrice?: number;
  availableQuantity?: number;
  soldQuantity?: number;
  permalink?: string;
  pictures?: Picture[];
  attributes?: ProductAttribute[];
  warranty?: string;
  description?: ProductDescription;
  sellerAddress?: SellerAddress;
}
