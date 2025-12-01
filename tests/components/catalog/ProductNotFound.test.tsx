import { fireEvent, render, screen } from "@testing-library/react";
import { ProductNotFound } from "@/modules/catalog/ui/components/ProductNotFound";

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

describe("ProductNotFound", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("should render not found message", () => {
    render(<ProductNotFound />);

    expect(screen.getByText("Producto no encontrado")).toBeInTheDocument();
    expect(
      screen.getByText(
        "El producto que buscas no existe o ya no está disponible.",
      ),
    ).toBeInTheDocument();
  });

  it("should render back button", () => {
    render(<ProductNotFound />);

    const backButton = screen.getByText("Volver al catálogo");
    expect(backButton).toBeInTheDocument();
  });

  it("should navigate to home on back button click", () => {
    render(<ProductNotFound />);

    const backButton = screen.getByText("Volver al catálogo");
    fireEvent.click(backButton);

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("should have correct test id", () => {
    render(<ProductNotFound />);

    expect(screen.getByTestId("product-not-found")).toBeInTheDocument();
  });
});
