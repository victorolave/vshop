import "@testing-library/jest-dom";

// Mock scrollIntoView which is not implemented in jsdom
Element.prototype.scrollIntoView = jest.fn();

// Mock window.scrollTo which is not implemented in jsdom
Object.defineProperty(window, "scrollTo", {
  value: jest.fn(),
  writable: true,
});
