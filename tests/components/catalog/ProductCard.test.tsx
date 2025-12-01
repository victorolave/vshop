import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import type { Product } from "@/modules/catalog/domain/entities/Product";
import { ProductCard } from "@/modules/catalog/ui/components/ProductCard";

// Mock useSearchParams
const mockGet = jest.fn();
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      layoutId,
      ...props
    }: React.PropsWithChildren<
      Record<string, unknown> & { layoutId?: string }
    >) => {
      // Remove layoutId as it's not a valid HTML attribute
      return <div {...props}>{children}</div>;
    },
  },
}));

// Mock Next.js Image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    fill,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
    // Remove fill prop as it's not a valid HTML attribute
    // biome-ignore lint/a11y/useAltText: Test mock - alt is passed via props spread
    // biome-ignore lint/performance/noImgElement: Test mock for Next.js Image component
    return <img {...props} />;
  },
}));

// Mock Next.js Link
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...props
  }: React.PropsWithChildren<{ href: string } & Record<string, unknown>>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const baseProduct: Product = {
  id: "MLA123",
  title: "Apple iPhone 13 (128 GB) - Medianoche",
  price: 1367999,
  condition: "new",
  isNewArrival: false,
};

describe("<ProductCard />", () => {
  beforeEach(() => {
    mockGet.mockReturnValue(null);
  });

  it("renders product title and price", () => {
    render(<ProductCard product={baseProduct} />);

    expect(screen.getByText(baseProduct.title)).toBeInTheDocument();
    expect(screen.getByText(/1\.367\.999/)).toBeInTheDocument();
  });

  it("renders thumbnail image when thumbnailUrl is present", () => {
    const productWithImage: Product = {
      ...baseProduct,
      thumbnailUrl: "https://example.com/image.jpg",
    };

    render(<ProductCard product={productWithImage} />);

    const img = screen.getByRole("img", { name: productWithImage.title });
    // With our mock, the src is passed directly without encoding
    expect(img.getAttribute("src")).toBe(productWithImage.thumbnailUrl);
  });

  it("does not render image when thumbnailUrl is absent", () => {
    render(<ProductCard product={baseProduct} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders 'New Arrival' badge when isNewArrival is true", () => {
    const newProduct: Product = { ...baseProduct, isNewArrival: true };

    render(<ProductCard product={newProduct} />);

    expect(screen.getByText(/new arrival/i)).toBeInTheDocument();
  });

  it("does not render 'New Arrival' badge when isNewArrival is false", () => {
    render(<ProductCard product={baseProduct} />);

    expect(screen.queryByText(/new arrival/i)).not.toBeInTheDocument();
  });

  it("shows a temporary check icon when add button is clicked", async () => {
    render(<ProductCard product={baseProduct} />);

    const addButton = screen.getByRole("button", { name: /add/i });
    fireEvent.click(addButton);

    // After click, should show check indicator
    expect(await screen.findByTestId("add-success")).toBeInTheDocument();
  });
});
