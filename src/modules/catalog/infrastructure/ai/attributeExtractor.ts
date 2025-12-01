import type { ProductAttribute } from "@/modules/catalog/domain/entities/Product";
import type { ProductInsightsInput } from "./ProductInsightsService";

const RELEVANT_ATTRIBUTE_PATTERNS = [
  { pattern: /battery|batería|capacidad.*batería/i, key: "battery" },
  { pattern: /camera|cámara|megapixel|mp.*cámara/i, key: "camera" },
  { pattern: /^ram$|memoria.*ram|memory/i, key: "ram" },
  {
    pattern: /storage|almacenamiento|internal.*memory|memoria.*interna/i,
    key: "storage",
  },
  { pattern: /processor|procesador|cpu|chipset|chip/i, key: "processor" },
  { pattern: /screen|pantalla|display|resolución/i, key: "screen" },
] as const;

type AttributeKey = (typeof RELEVANT_ATTRIBUTE_PATTERNS)[number]["key"];

export function extractRelevantAttributes(
  attributes?: ProductAttribute[],
): ProductInsightsInput["attributes"] {
  if (!attributes || attributes.length === 0) return {};

  const result: ProductInsightsInput["attributes"] = {};

  for (const attr of attributes) {
    if (!attr.valueName) continue;

    for (const { pattern, key } of RELEVANT_ATTRIBUTE_PATTERNS) {
      if (pattern.test(attr.name) || pattern.test(attr.id)) {
        if (!(key in result)) {
          result[key as AttributeKey] = attr.valueName;
        }
        break;
      }
    }
  }

  return result;
}

export function hasSufficientAttributes(
  attributes: ProductInsightsInput["attributes"],
): boolean {
  return Object.values(attributes).filter(Boolean).length >= 2;
}

export function createProductInsightsInput(product: {
  title: string;
  price: number;
  description?: { plainText: string };
  attributes?: ProductAttribute[];
}): ProductInsightsInput {
  return {
    title: product.title,
    price: product.price,
    description: product.description?.plainText,
    attributes: extractRelevantAttributes(product.attributes),
  };
}
