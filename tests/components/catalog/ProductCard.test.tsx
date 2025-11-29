import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import type { Product } from "@/modules/catalog/domain/entities/Product";
import { ProductCard } from "@/modules/catalog/ui/components/ProductCard";

const baseProduct: Product = {
  id: "MLA123",
  title: "Apple iPhone 13 (128 GB) - Medianoche",
  price: 1367999,
  condition: "new",
  isNewArrival: false,
};

describe("<ProductCard />", () => {
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
    // Next.js Image transforms the src, so we check it contains the original URL
    expect(img.getAttribute("src")).toContain(
      encodeURIComponent(productWithImage.thumbnailUrl),
    );
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
