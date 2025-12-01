import { fireEvent, render, screen } from "@testing-library/react";
import { ProductDetailError } from "@/modules/catalog/ui/components/ProductDetailError";

// Mock useRouter
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

describe("ProductDetailError", () => {
  const mockRetry = jest.fn();

  beforeEach(() => {
    mockPush.mockClear();
    mockRetry.mockClear();
  });

  it("should render error message", () => {
    render(
      <ProductDetailError message="Something went wrong" onRetry={mockRetry} />,
    );

    expect(screen.getByText("Error al cargar el producto")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("should call onRetry when retry button is clicked", () => {
    render(
      <ProductDetailError message="Something went wrong" onRetry={mockRetry} />,
    );

    const retryButton = screen.getByText("Reintentar");
    fireEvent.click(retryButton);

    expect(mockRetry).toHaveBeenCalled();
  });

  it("should navigate to home when back button is clicked", () => {
    render(
      <ProductDetailError message="Something went wrong" onRetry={mockRetry} />,
    );

    const backButton = screen.getByText("Volver al catálogo");
    fireEvent.click(backButton);

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("should have correct test id", () => {
    render(
      <ProductDetailError message="Something went wrong" onRetry={mockRetry} />,
    );

    expect(screen.getByTestId("product-detail-error")).toBeInTheDocument();
  });
});
