import type { Product } from "@/modules/catalog/domain/entities/Product";
import type { ProductRepository } from "@/modules/catalog/domain/repositories/ProductRepository";

export class SearchProducts {
  private readonly productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async execute(rawQuery: string): Promise<Product[]> {
    const normalized = rawQuery.trim();

    if (normalized.length === 0) {
      return [];
    }

    return this.productRepository.searchByQuery(normalized.toLowerCase());
  }
}
