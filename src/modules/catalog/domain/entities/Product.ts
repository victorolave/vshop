export interface Installments {
  quantity: number;
  amount: number;
}

export interface ShippingSummary {
  freeShipping: boolean;
}

export interface ReviewSummary {
  ratingAverage: number;
  total: number;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  currencyId?: string;
  condition: "new" | "used" | string;
  thumbnailUrl?: string;
  isNewArrival: boolean;
  installments?: Installments;
  shipping?: ShippingSummary;
  reviews?: ReviewSummary;
}
