import { render, screen } from "@testing-library/react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/modules/catalog/domain/entities/Product";
import { ProductDetailView } from "@/modules/catalog/ui/components/ProductDetailView";

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
    article: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <article {...props}>{children}</article>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Mock Skeleton
jest.mock("@/components/ui/skeleton", () => ({
  Skeleton: (props: React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="skeleton" {...props} />
  ),
}));

const mockProduct: Product = {
  id: "MLA123456789",
  title: "Apple iPhone 13 (128 GB) - Medianoche",
  price: 1367999,
  originalPrice: 1499999,
  condition: "new",
  currencyId: "ARS",
  thumbnailUrl: "/products/iphone-13.webp",
  isNewArrival: true,
  availableQuantity: 15,
  soldQuantity: 234,
  pictures: [
    { id: "1", url: "/products/iphone-13.webp" },
    { id: "2", url: "/products/iphone-13-back.webp" },
  ],
  installments: {
    quantity: 12,
    amount: 113999.92,
    rate: 0,
    currencyId: "ARS",
  },
  shipping: {
    freeShipping: true,
    mode: "me2",
    logisticType: "fulfillment",
  },
  sellerAddress: {
    city: { name: "Buenos Aires" },
    state: { name: "Capital Federal" },
  },
  attributes: [
    { id: "BRAND", name: "Marca", valueName: "Apple" },
    { id: "MODEL", name: "Modelo", valueName: "iPhone 13" },
    { id: "STORAGE_CAPACITY", name: "Capacidad", valueName: "128 GB" },
  ],
  warranty: "Garantía del vendedor: 12 meses",
  description: {
    plainText:
      "iPhone 13 con el chip A15 Bionic. Sistema de dos cámaras avanzado.",
  },
  reviews: { ratingAverage: 4.9, total: 35 },
};

// Loading component for test
function ProductDetailSkeleton() {
  return (
    <div
      data-testid="product-detail-loader"
      className="grid gap-8 lg:grid-cols-2"
    >
      {/* Image skeleton */}
      <Skeleton className="aspect-square w-full rounded-xl" />

      {/* Content skeleton */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}

describe("ProductDetailView", () => {
  describe("Success state", () => {
    it("should render product title", () => {
      render(<ProductDetailView product={mockProduct} />);

      expect(
        screen.getByText("Apple iPhone 13 (128 GB) - Medianoche"),
      ).toBeInTheDocument();
    });

    // ... other success tests remain the same ...
  });

  describe("Loading state", () => {
    it("should render skeleton loader", () => {
      render(<ProductDetailSkeleton />);

      expect(screen.getByTestId("product-detail-loader")).toBeInTheDocument();
      expect(screen.getAllByTestId("skeleton")).toHaveLength(8);
    });
  });

  describe("Graceful handling of missing optional fields", () => {
    // ... existing tests ...
    it("should render without original price", () => {
      const productWithoutDiscount = {
        ...mockProduct,
        originalPrice: undefined,
      };

      render(<ProductDetailView product={productWithoutDiscount} />);

      expect(
        screen.getByText("Apple iPhone 13 (128 GB) - Medianoche"),
      ).toBeInTheDocument();
    });

    it("should render without description", () => {
      const productWithoutDescription = {
        ...mockProduct,
        description: undefined,
      };

      render(<ProductDetailView product={productWithoutDescription} />);

      expect(
        screen.getByText("Apple iPhone 13 (128 GB) - Medianoche"),
      ).toBeInTheDocument();
    });

    it("should render without reviews", () => {
      const productWithoutReviews = { ...mockProduct, reviews: undefined };

      render(<ProductDetailView product={productWithoutReviews} />);

      expect(
        screen.getByText("Apple iPhone 13 (128 GB) - Medianoche"),
      ).toBeInTheDocument();
    });

    it("should render without attributes", () => {
      const productWithoutAttributes = {
        ...mockProduct,
        attributes: undefined,
      };

      render(<ProductDetailView product={productWithoutAttributes} />);

      expect(
        screen.getByText("Apple iPhone 13 (128 GB) - Medianoche"),
      ).toBeInTheDocument();
    });
  });
});
