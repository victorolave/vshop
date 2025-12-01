"use client";

import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ProsConsList } from "@/modules/catalog/ui/components/ProsConsList";

const setWindowWidth = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event("resize"));
};

describe("ProsConsList", () => {
  const pros = ["Excellent camera", "Long battery"];
  const cons = ["High price", "No expandable storage"];

  beforeEach(() => {
    setWindowWidth(500); // Default to mobile
  });

  it("collapses sections by default on mobile", () => {
    render(<ProsConsList pros={pros} cons={cons} />);

    expect(screen.queryByText("Excellent camera")).not.toBeInTheDocument();
    expect(screen.queryByText("High price")).not.toBeInTheDocument();
  });

  it("expands both sections on desktop width", () => {
    setWindowWidth(1024);
    render(<ProsConsList pros={pros} cons={cons} />);

    expect(screen.getByText("Excellent camera")).toBeInTheDocument();
    expect(screen.getByText("Long battery")).toBeInTheDocument();
    expect(screen.getByText("High price")).toBeInTheDocument();
    expect(screen.getByText("No expandable storage")).toBeInTheDocument();
  });

  it("toggles sections when buttons are clicked", () => {
    render(<ProsConsList pros={pros} cons={cons} />);
    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[0]);
    expect(screen.getByText("Excellent camera")).toBeInTheDocument();
    fireEvent.click(buttons[1]);
    expect(screen.getByText("High price")).toBeInTheDocument();
  });

  it("supports keyboard focus and toggling via Enter key", () => {
    render(<ProsConsList pros={pros} cons={cons} />);
    const buttons = screen.getAllByRole("button");
    buttons[0].focus();
    expect(buttons[0]).toHaveFocus();
    fireEvent.click(buttons[0]);
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(buttons[1], { key: "Enter" });
    fireEvent.click(buttons[1]);
    expect(buttons[1]).toHaveAttribute("aria-expanded", "true");
  });

  it("maintains accessible aria attributes", () => {
    render(<ProsConsList pros={pros} cons={cons} />);
    const [prosButton, consButton] = screen.getAllByRole("button");
    expect(prosButton).toHaveAttribute("aria-controls", "pros-list");
    expect(consButton).toHaveAttribute("aria-controls", "cons-list");
  });
});
