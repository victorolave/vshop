import type { Product } from "@/modules/catalog/domain/entities/Product";

export interface ProductRepository {
  searchByQuery(query: string): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
}
