import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import type { Product } from "@/modules/catalog/domain/entities/Product";
import { SearchView } from "@/modules/catalog/ui/components/SearchView";

// Mock Next.js navigation hooks
const mockPush = jest.fn();
const mockGet = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
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

// Mock products for testing
const mockProducts: Product[] = [
  {
    id: "MLA123",
    title: "Apple iPhone 13",
    price: 1367999,
    condition: "new",
    isNewArrival: true,
    thumbnailUrl: "https://example.com/iphone.jpg",
  },
  {
    id: "MLA456",
    title: "Apple iPhone 16 Pro Max",
    price: 2299000,
    condition: "new",
    isNewArrival: false,
  },
];

// Mock the useSearchProducts hook
const mockSearch = jest.fn();
const mockRetry = jest.fn();

let mockStatus = "idle";
let mockProductsData: Product[] = [];

jest.mock("@/modules/catalog/ui/hooks/useSearchProducts", () => ({
  useSearchProducts: () => ({
    products: mockProductsData,
    status: mockStatus,
    search: mockSearch,
    retry: mockRetry,
    lastQuery: "",
  }),
}));

describe("<SearchView />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStatus = "idle";
    mockProductsData = [];
    mockGet.mockReturnValue(null);
    mockPush.mockClear();
  });

  describe("Search Input", () => {
    it("renders search input with correct data-testid", () => {
      render(<SearchView />);
      expect(screen.getByTestId("search-input")).toBeInTheDocument();
    });

    it("calls search handler with correct value on form submit", () => {
      render(<SearchView />);

      const input = screen.getByTestId("search-input");
      fireEvent.change(input, { target: { value: "iphone" } });
      const form = input.closest("form");
      if (form) {
        fireEvent.submit(form);
      }

      expect(mockSearch).toHaveBeenCalledWith("iphone");
    });
  });

  describe("Product Cards", () => {
    beforeEach(() => {
      mockStatus = "success";
      mockProductsData = mockProducts;
    });

    it("renders product cards with data-testid='product-card'", () => {
      render(<SearchView />);

      const productCards = screen.getAllByTestId("product-card");
      expect(productCards).toHaveLength(mockProducts.length);
    });
  });

  describe("Landing vs Search Mode (US2)", () => {
    it("shows Landing mode content when status is idle", () => {
      mockStatus = "idle";
      render(<SearchView />);

      // Landing mode should show the landing hero marker
      expect(screen.getByTestId("landing-hero")).toBeInTheDocument();
      // Landing mode should show value propositions (visible)
      expect(screen.getByTestId("value-props")).toBeVisible();
      // Landing mode should show trending categories (visible)
      expect(screen.getByTestId("trending-categories")).toBeVisible();
    });

    it("hides Landing mode content when in Search mode", () => {
      mockStatus = "success";
      mockProductsData = mockProducts;
      render(<SearchView />);

      // Search mode should NOT show landing-hero marker
      expect(screen.queryByTestId("landing-hero")).not.toBeInTheDocument();
      // Landing content is in DOM but hidden via CSS (max-h-0 opacity-0)
      // The parent container has opacity-0, making children not visible
      const valueProps = screen.getByTestId("value-props");
      expect(valueProps.closest("div")).toHaveClass("opacity-0");
    });

    it("shows compact search header in Search mode", () => {
      mockStatus = "success";
      mockProductsData = mockProducts;
      render(<SearchView />);

      // Should show "Search Results" text in search mode
      expect(screen.getByText("Search Results")).toBeInTheDocument();
    });

    it("returns to Landing mode when search is cleared", () => {
      mockStatus = "idle";
      render(<SearchView />);

      // Should be in landing mode
      expect(screen.getByTestId("landing-hero")).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("shows loading skeletons when status is loading", () => {
      mockStatus = "loading";
      render(<SearchView />);

      // Should show skeleton loaders
      const skeletons = screen.getAllByTestId("skeleton-card");
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("Empty State (US3)", () => {
    beforeEach(() => {
      mockStatus = "empty";
      mockProductsData = [];
    });

    it("renders empty-state with data-testid when search returns no results", () => {
      render(<SearchView />);

      // Should show empty state
      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    });

    it("does not render any product cards when in empty state", () => {
      render(<SearchView />);

      // Should NOT show any product cards
      expect(screen.queryAllByTestId("product-card")).toHaveLength(0);
    });

    it("shows 'No results found' message in empty state", () => {
      render(<SearchView />);

      expect(screen.getByText("No results found")).toBeInTheDocument();
    });

    it("shows suggestion to try different search term", () => {
      render(<SearchView />);

      expect(
        screen.getByText(/try a different search term/i),
      ).toBeInTheDocument();
    });

    it("shows clear search button in empty state", () => {
      render(<SearchView />);

      const clearButton = screen.getByRole("button", { name: /clear search/i });
      expect(clearButton).toBeInTheDocument();
    });

    it("calls search with empty string when clear button is clicked", () => {
      render(<SearchView />);

      const clearButton = screen.getByRole("button", { name: /clear search/i });
      fireEvent.click(clearButton);

      expect(mockSearch).toHaveBeenCalledWith("");
    });
  });

  describe("Error State (US4)", () => {
    beforeEach(() => {
      mockStatus = "error";
      mockProductsData = [];
    });

    it("renders error-state with data-testid when search fails", () => {
      render(<SearchView />);

      // Should show error state
      expect(screen.getByTestId("error-state")).toBeInTheDocument();
    });

    it("does not render any product cards when in error state", () => {
      render(<SearchView />);

      // Should NOT show any product cards
      expect(screen.queryAllByTestId("product-card")).toHaveLength(0);
    });

    it("shows 'Something went wrong' message in error state", () => {
      render(<SearchView />);

      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("shows message about completing search", () => {
      render(<SearchView />);

      expect(
        screen.getByText(/couldn't complete your search/i),
      ).toBeInTheDocument();
    });

    it("renders retry-button with data-testid", () => {
      render(<SearchView />);

      const retryButton = screen.getByTestId("retry-button");
      expect(retryButton).toBeInTheDocument();
    });

    it("retry button has correct label", () => {
      render(<SearchView />);

      const retryButton = screen.getByRole("button", { name: /retry/i });
      expect(retryButton).toBeInTheDocument();
    });

    it("calls retry function when retry button is clicked", () => {
      render(<SearchView />);

      const retryButton = screen.getByTestId("retry-button");
      fireEvent.click(retryButton);

      expect(mockRetry).toHaveBeenCalledTimes(1);
    });

    it("does not show empty state when in error state", () => {
      render(<SearchView />);

      expect(screen.queryByTestId("empty-state")).not.toBeInTheDocument();
    });

    it("does not show loading skeletons when in error state", () => {
      render(<SearchView />);

      expect(screen.queryAllByTestId("skeleton-card")).toHaveLength(0);
    });
  });
});
