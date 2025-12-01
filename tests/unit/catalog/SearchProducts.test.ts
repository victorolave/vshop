import { SearchProducts } from "@/modules/catalog/application/use-cases/SearchProducts";
import type { Product } from "@/modules/catalog/domain/entities/Product";
import type { ProductRepository } from "@/modules/catalog/domain/repositories/ProductRepository";

function createRepoMock(): jest.Mocked<ProductRepository> {
  return {
    searchByQuery: jest.fn(),
  };
}

describe("SearchProducts use case", () => {
  it("returns an empty list if the query is empty or whitespace only", async () => {
    const repo = createRepoMock();
    const useCase = new SearchProducts(repo);

    const result = await useCase.execute("   ");

    expect(result).toEqual([]);
    expect(repo.searchByQuery).not.toHaveBeenCalled();
  });

  it("trims and lowercases the query and calls the repository", async () => {
    const repo = createRepoMock();
    const fakeProducts: Product[] = [
      {
        id: "1",
        title: "Iphone X",
        price: 100,
        condition: "new",
        isNewArrival: true,
      },
    ];

    repo.searchByQuery.mockResolvedValue(fakeProducts);

    const useCase = new SearchProducts(repo);
    const result = await useCase.execute("   iPhOnE  ");

    expect(repo.searchByQuery).toHaveBeenCalledWith("iphone");
    expect(result).toBe(fakeProducts);
  });
});
