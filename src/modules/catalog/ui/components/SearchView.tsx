"use client";

import { type FormEvent, useRef, useState } from "react";
import { useSearchProducts } from "@/modules/catalog/ui/hooks/useSearchProducts";
import { ProductCard } from "./ProductCard";

/**
 * Trending categories for the landing page.
 */
const TRENDING_CATEGORIES = [
  { id: "smartphones", name: "Smartphones", icon: "📱" },
  { id: "laptops", name: "Laptops", icon: "💻" },
  { id: "headphones", name: "Headphones", icon: "🎧" },
  { id: "gaming", name: "Gaming", icon: "🎮" },
  { id: "cameras", name: "Cameras", icon: "📷" },
  { id: "watches", name: "Watches", icon: "⌚" },
];

/**
 * Value propositions for the landing page.
 */
const VALUE_PROPS = [
  {
    id: "fast-shipping",
    title: "Fast Shipping",
    description: "Free delivery on orders over $50",
    icon: "🚀",
  },
  {
    id: "secure-payment",
    title: "Secure Payment",
    description: "100% protected transactions",
    icon: "🔒",
  },
  {
    id: "best-prices",
    title: "Best Prices",
    description: "Price match guarantee",
    icon: "💰",
  },
];

/**
 * SearchView – Dual-mode layout for Landing and Search experiences.
 *
 * Landing Mode (idle):
 * - Dark immersive hero with large title
 * - Value propositions row
 * - Trending categories grid
 * - Final CTA section
 *
 * Search Mode (loading/success/empty/error):
 * - Compact hero with search results title
 * - Results grid / loading skeletons / empty state / error state
 *
 * Smooth transitions between modes using CSS animations.
 */
export function SearchView() {
  const [inputValue, setInputValue] = useState("");
  const { products, status, search, retry } = useSearchProducts();
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return; // Stay in landing mode for empty submissions
    await search(trimmed);
    // Scroll to results area after a brief delay to let animation start
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const handleClear = () => {
    setInputValue("");
    search("");
    // Scroll to top when returning to landing
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryClick = (categoryId: string) => {
    // Visual feedback only - no functional change per spec
    console.log(`Category clicked: ${categoryId}`);
  };

  const isLandingMode = status === "idle";
  const isSearchMode = !isLandingMode;

  return (
    <div className="min-h-screen bg-neutral-950 pt-16 text-white">
      {/* Hero Section - Animates between Landing and Search modes */}
      <section
        className={`relative flex flex-col items-center justify-center overflow-hidden px-4 transition-all duration-500 ease-out ${
          isSearchMode ? "min-h-0 py-8" : "min-h-[60vh] py-20"
        }`}
      >
        {/* Background gradient - fades out in search mode */}
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent transition-opacity duration-500 ${
            isSearchMode ? "opacity-0" : "opacity-100"
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent transition-opacity duration-500 ${
            isSearchMode ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Content */}
        <div className="relative z-10 w-full text-center">
          {/* Title - animates size and content */}
          <h1
            className={`mb-6 font-bold tracking-tight transition-all duration-500 ease-out ${
              isSearchMode ? "text-2xl" : "text-5xl md:text-7xl"
            }`}
          >
            {isSearchMode ? (
              "Search Results"
            ) : (
              <>
                Find your next
                <br />
                <span className="bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">
                  favorite product
                </span>
              </>
            )}
          </h1>

          {/* Subtitle - fades out in search mode */}
          <p
            className={`mx-auto mb-10 max-w-2xl text-lg text-neutral-400 transition-all duration-500 md:text-xl ${
              isSearchMode ? "pointer-events-none h-0 opacity-0" : "opacity-100"
            }`}
          >
            Discover amazing deals on the latest tech, fashion, and more. Shop
            smarter with VShop.
          </p>

          {/* Search Form - animates size */}
          <form
            onSubmit={handleSubmit}
            className={`mx-auto flex items-center transition-all duration-500 ease-out ${
              isSearchMode ? "w-full max-w-xl gap-2" : "w-full max-w-2xl gap-3"
            }`}
          >
            <div className="relative flex-1">
              <input
                data-testid="search-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  isSearchMode ? "Search products..." : "Search for products..."
                }
                className={`w-full rounded-full border border-white/20 bg-white/5 text-white placeholder-neutral-400 outline-none transition-all duration-300 focus:border-primary focus:bg-white/10 focus:ring-2 focus:ring-primary/30 ${
                  isSearchMode
                    ? "px-5 py-3 pr-10 text-base"
                    : "px-6 py-4 pr-12 text-lg"
                }`}
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className={`absolute top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-white ${
                    isSearchMode ? "right-3" : "right-4"
                  }`}
                  aria-label="Clear search"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              className={`flex items-center gap-2 rounded-full bg-primary font-semibold text-black transition-all duration-300 hover:bg-primary/90 ${
                isSearchMode
                  ? "px-6 py-3 text-base"
                  : "px-8 py-4 text-lg hover:shadow-lg hover:shadow-primary/25"
              }`}
            >
              {status === "loading" ? (
                <svg
                  data-testid="loader"
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Landing Mode Content - Slides out with fade */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${
          isSearchMode ? "max-h-0 opacity-0" : "max-h-[2000px] opacity-100"
        }`}
      >
        {/* Value Propositions */}
        <section
          data-testid="value-props"
          className="border-y border-white/10 bg-white/[0.02] py-12"
        >
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {VALUE_PROPS.map((prop) => (
                <div
                  key={prop.id}
                  className="flex items-center gap-4 text-center md:text-left"
                >
                  <span className="text-4xl">{prop.icon}</span>
                  <div>
                    <h3 className="font-semibold text-white">{prop.title}</h3>
                    <p className="text-sm text-neutral-400">
                      {prop.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Categories */}
        <section data-testid="trending-categories" className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-8 text-center text-2xl font-bold text-white md:text-3xl">
              Trending Categories
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
              {TRENDING_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryClick(category.id)}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-primary/50 hover:bg-white/10 active:scale-95"
                >
                  <span className="text-4xl transition-transform group-hover:scale-110">
                    {category.icon}
                  </span>
                  <span className="text-sm font-medium text-neutral-300 group-hover:text-white">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Ready to start shopping?
            </h2>
            <p className="mb-8 text-lg text-neutral-400">
              Search for anything you need and find the best deals today.
            </p>
            <button
              type="button"
              onClick={() => {
                const input = document.querySelector(
                  '[data-testid="search-input"]',
                ) as HTMLInputElement;
                input?.focus();
              }}
              className="rounded-full bg-primary px-10 py-4 text-lg font-semibold text-black transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
            >
              Start Searching
            </button>
          </div>
        </section>
      </div>

      {/* Landing hero test marker (hidden, for tests only) */}
      {isLandingMode && <div data-testid="landing-hero" className="hidden" />}

      {/* Search Mode Results - Slides in with fade */}
      <div
        ref={resultsRef}
        className={`overflow-hidden transition-all duration-500 ease-out ${
          isSearchMode ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <section className="px-4 pb-16">
          <div className="mx-auto max-w-7xl">
            {/* Loading skeletons */}
            {status === "loading" && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {[
                  "sk-1",
                  "sk-2",
                  "sk-3",
                  "sk-4",
                  "sk-5",
                  "sk-6",
                  "sk-7",
                  "sk-8",
                  "sk-9",
                  "sk-10",
                ].map((skeletonId) => (
                  <div
                    key={skeletonId}
                    data-testid="skeleton-card"
                    className="animate-pulse rounded-xl border border-white/10 bg-white/5"
                  >
                    <div className="aspect-square bg-neutral-800" />
                    <div className="space-y-2 p-4">
                      <div className="h-4 w-3/4 rounded bg-neutral-700" />
                      <div className="h-5 w-1/2 rounded bg-neutral-700" />
                      <div className="h-8 w-full rounded bg-neutral-700" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {status === "empty" && (
              <div
                data-testid="empty-state"
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-4 h-16 w-16 text-neutral-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="mb-2 text-xl font-semibold text-white">
                  No results found
                </h2>
                <p className="mb-4 text-neutral-400">
                  Try a different search term or clear the search.
                </p>
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-black"
                >
                  Clear search
                </button>
              </div>
            )}

            {/* Error state */}
            {status === "error" && (
              <div
                data-testid="error-state"
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mb-4 h-16 w-16 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h2 className="mb-2 text-xl font-semibold text-white">
                  Something went wrong
                </h2>
                <p className="mb-4 text-neutral-400">
                  We couldn't complete your search. Please try again.
                </p>
                <button
                  data-testid="retry-button"
                  type="button"
                  onClick={retry}
                  className="rounded-full bg-primary px-6 py-2 font-semibold text-black transition-colors hover:bg-primary/90"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Product grid */}
            {status === "success" && products.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
