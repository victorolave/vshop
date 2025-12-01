import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import type { ProductInsights } from "@/modules/catalog/domain/entities/ProductInsights";
import { AIInsightsSkeleton } from "@/modules/catalog/ui/components/AIInsightsSkeleton";
import { AIInsightsView } from "@/modules/catalog/ui/components/AIInsightsView";

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...props}>{children}</div>
    ),
    section: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <section {...props}>{children}</section>
    ),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
  useReducedMotion: () => false,
}));

describe("AIInsightsView", () => {
  const mockInsights: ProductInsights = {
    summary:
      "The iPhone 14 Pro is a premium smartphone with exceptional camera capabilities and powerful performance.",
    pros: ["Excellent camera quality", "Long battery life", "Fast processor"],
    cons: ["High price point", "No expandable storage"],
    recommendedFor: ["Photography enthusiasts", "Power users"],
  };

  describe("when insights are available", () => {
    it("should render the AI Insights section", () => {
      render(<AIInsightsView insights={mockInsights} />);
      expect(screen.getByRole("region")).toBeInTheDocument();
    });

    it("should display truncated summary in collapsed state", () => {
      render(<AIInsightsView insights={mockInsights} />);
      expect(screen.getByText(/premium smartphone/i)).toBeInTheDocument();
    });

    it("should focus when Enter key pressed on header", () => {
      render(<AIInsightsView insights={mockInsights} />);
      const headerButton = screen.getByRole("button");
      headerButton.focus();
      fireEvent.keyDown(headerButton, { key: "Enter" });
      expect(headerButton).toHaveFocus();
    });

    it("should expand when Space key pressed on header and click", () => {
      render(<AIInsightsView insights={mockInsights} />);
      const headerButton = screen.getByRole("button");
      fireEvent.keyDown(headerButton, { key: " " });
      fireEvent.click(headerButton);
      expect(headerButton).toHaveAttribute("aria-expanded", "true");
    });

    it("should announce updates via aria-live", () => {
      render(<AIInsightsView insights={mockInsights} />);
      const liveRegion = screen.getByLabelText("AI-generated product insights");
      expect(liveRegion).toHaveAttribute("aria-live", "polite");
    });

    it("should provide focus indicator on header button", () => {
      render(<AIInsightsView insights={mockInsights} />);
      const headerButton = screen.getByRole("button");
      fireEvent.focus(headerButton);
      expect(headerButton).toHaveClass("focus-visible:outline");
    });

    it("should display all pros when expanded", () => {
      render(<AIInsightsView insights={mockInsights} />);

      // Click to expand
      const expandButton = screen.getByRole("button");
      fireEvent.click(expandButton);

      expect(screen.getByText("Excellent camera quality")).toBeInTheDocument();
      expect(screen.getByText("Long battery life")).toBeInTheDocument();
      expect(screen.getByText("Fast processor")).toBeInTheDocument();
    });

    it("should display all cons when expanded", () => {
      render(<AIInsightsView insights={mockInsights} />);

      // Click to expand
      const expandButton = screen.getByRole("button");
      fireEvent.click(expandButton);

      expect(screen.getByText("High price point")).toBeInTheDocument();
      expect(screen.getByText("No expandable storage")).toBeInTheDocument();
    });

    it("should display recommendations when expanded", () => {
      render(<AIInsightsView insights={mockInsights} />);

      // Click to expand
      const expandButton = screen.getByRole("button");
      fireEvent.click(expandButton);

      expect(screen.getByText("Photography enthusiasts")).toBeInTheDocument();
      expect(screen.getByText("Power users")).toBeInTheDocument();
    });

    it("should have proper accessibility attributes", () => {
      render(<AIInsightsView insights={mockInsights} />);
      const section = screen.getByRole("region");
      expect(section).toHaveAttribute("aria-label");
    });

    it("should show quick stats in collapsed state", () => {
      render(<AIInsightsView insights={mockInsights} />);
      // Quick stats show pros/cons count
      expect(screen.getByText("3")).toBeInTheDocument(); // pros count
      expect(screen.getByText("2")).toBeInTheDocument(); // cons count
    });
  });

  describe("when insights have no recommendations", () => {
    const insightsWithoutRecommendations: ProductInsights = {
      summary: "A basic product summary for testing purposes.",
      pros: ["Good quality"],
      cons: ["Average price"],
    };

    it("should render without recommendations section when expanded", () => {
      render(<AIInsightsView insights={insightsWithoutRecommendations} />);

      // Click to expand
      const expandButton = screen.getByRole("button");
      fireEvent.click(expandButton);

      expect(screen.getByText("Good quality")).toBeInTheDocument();
      expect(screen.getByText("Average price")).toBeInTheDocument();
      expect(screen.queryByText("Best for")).not.toBeInTheDocument();
    });
  });
});

describe("AIInsightsSkeleton", () => {
  it("should render skeleton placeholders", () => {
    render(<AIInsightsSkeleton />);
    const skeleton = screen.getByTestId("ai-insights-skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  it("should have aria-busy attribute for loading state", () => {
    render(<AIInsightsSkeleton />);
    const skeleton = screen.getByTestId("ai-insights-skeleton");
    expect(skeleton).toHaveAttribute("aria-busy", "true");
  });
});

describe("Conditional rendering", () => {
  it("should not render anything when insights is null", () => {
    const { container } = render(
      <AIInsightsView insights={null as unknown as ProductInsights} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
