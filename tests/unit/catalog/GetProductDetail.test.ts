import { GetProductDetail } from "@/modules/catalog/application/use-cases/GetProductDetail";
import type { Product } from "@/modules/catalog/domain/entities/Product";
import type { ProductRepository } from "@/modules/catalog/domain/repositories/ProductRepository";

describe("GetProductDetail", () => {
  const mockProduct: Product = {
    id: "MLA123456789",
    title: "Apple iPhone 13 (128 GB) - Medianoche",
    price: 1367999,
    condition: "new",
    currencyId: "ARS",
    thumbnailUrl: "/products/iphone-13.webp",
    isNewArrival: true,
    originalPrice: 1499999,
    availableQuantity: 15,
    soldQuantity: 234,
    pictures: [{ id: "1", url: "/products/iphone-13.webp" }],
    attributes: [
      { id: "BRAND", name: "Marca", valueName: "Apple" },
      { id: "MODEL", name: "Modelo", valueName: "iPhone 13" },
    ],
    warranty: "Garantía del vendedor: 12 meses",
    description: { plainText: "iPhone 13 description" },
    reviews: { ratingAverage: 4.9, total: 35 },
  };

  const createMockRepository = (
    findByIdResult: Product | null,
  ): ProductRepository => ({
    searchByQuery: jest.fn(),
    findById: jest.fn().mockResolvedValue(findByIdResult),
  });

  describe("execute", () => {
    it("should return a product when it exists", async () => {
      const repository = createMockRepository(mockProduct);
      const useCase = new GetProductDetail(repository);

      const result = await useCase.execute("MLA123456789");

      expect(result).toEqual(mockProduct);
      expect(repository.findById).toHaveBeenCalledWith("MLA123456789");
    });

    it("should return null when product does not exist", async () => {
      const repository = createMockRepository(null);
      const useCase = new GetProductDetail(repository);

      const result = await useCase.execute("MLA999999999");

      expect(result).toBeNull();
      expect(repository.findById).toHaveBeenCalledWith("MLA999999999");
    });

    it("should throw error for invalid product ID format", async () => {
      const repository = createMockRepository(mockProduct);
      const useCase = new GetProductDetail(repository);

      await expect(useCase.execute("invalid-id")).rejects.toThrow(
        "Invalid product ID format",
      );
      expect(repository.findById).not.toHaveBeenCalled();
    });

    it("should throw error for empty product ID", async () => {
      const repository = createMockRepository(mockProduct);
      const useCase = new GetProductDetail(repository);

      await expect(useCase.execute("")).rejects.toThrow(
        "Invalid product ID format",
      );
      expect(repository.findById).not.toHaveBeenCalled();
    });

    it("should accept valid MercadoLibre ID formats", async () => {
      const repository = createMockRepository(mockProduct);
      const useCase = new GetProductDetail(repository);

      // Valid formats: MLA, MLB, MLM, etc. followed by numbers
      await useCase.execute("MLA123456789");
      await useCase.execute("MLB987654321");
      await useCase.execute("MLM111222333");

      expect(repository.findById).toHaveBeenCalledTimes(3);
    });

    it("should propagate repository errors", async () => {
      const repository = {
        searchByQuery: jest.fn(),
        findById: jest.fn().mockRejectedValue(new Error("Database error")),
      };
      const useCase = new GetProductDetail(repository);

      await expect(useCase.execute("MLA123456789")).rejects.toThrow(
        "Database error",
      );
    });
  });
});
