"use client";

import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RecommendationBadges } from "@/modules/catalog/ui/components/RecommendationBadges";

describe("RecommendationBadges", () => {
  const recommendations = ["Photography enthusiasts", "Battery lovers"];

  it("renders badges with icons", () => {
    render(<RecommendationBadges recommendedFor={recommendations} />);
    const badges = screen.getAllByRole("listitem");
    expect(badges).toHaveLength(2);
  });

  it("applies aria-pressed and toggles on click", () => {
    render(<RecommendationBadges recommendedFor={recommendations} />);
    const badge = screen.getByRole("button", {
      name: /Photography enthusiasts/i,
    });
    expect(badge).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(badge);
    expect(badge).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(badge);
    expect(badge).toHaveAttribute("aria-pressed", "false");
  });

  it("skips rendering when no recommendations provided", () => {
    const { container } = render(<RecommendationBadges recommendedFor={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
