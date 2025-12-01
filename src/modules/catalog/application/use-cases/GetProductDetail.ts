import type { Product } from "@/modules/catalog/domain/entities/Product";
import type { ProductRepository } from "@/modules/catalog/domain/repositories/ProductRepository";

/**
 * Use case for retrieving a single product by its ID.
 * Validates the product ID format before querying the repository.
 */
export class GetProductDetail {
  constructor(private readonly repository: ProductRepository) {}

  /**
   * Executes the use case to retrieve a product by ID.
   * @param productId - The MercadoLibre product ID (e.g., MLA123456789)
   * @returns The product if found, null otherwise
   * @throws Error if the product ID format is invalid
   */
  async execute(productId: string): Promise<Product | null> {
    if (!this.isValidProductId(productId)) {
      throw new Error("Invalid product ID format");
    }

    return this.repository.findById(productId);
  }

  /**
   * Validates that the product ID matches the MercadoLibre format.
   * Valid format: 3 uppercase letters followed by numbers (e.g., MLA123456789)
   */
  private isValidProductId(id: string): boolean {
    if (!id || id.trim().length === 0) {
      return false;
    }
    // MercadoLibre IDs: 3 uppercase letters + numbers
    return /^[A-Z]{3}[0-9]+$/.test(id);
  }
}
