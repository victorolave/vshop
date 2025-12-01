import type { ProductInsights } from "@/modules/catalog/domain/entities/ProductInsights";
import { isValidProductInsights } from "@/modules/catalog/domain/entities/ProductInsights";
import { OpenAIClient } from "@/modules/shared/infrastructure/ai/OpenAIClient";

export interface ProductInsightsInput {
  title: string;
  price: number;
  description?: string;
  attributes: {
    battery?: string | number;
    camera?: string | number;
    ram?: string | number;
    storage?: string | number;
    processor?: string;
    screen?: string;
  };
}

export class ProductInsightsService {
  private readonly client: OpenAIClient;

  constructor(client?: OpenAIClient) {
    this.client = client ?? new OpenAIClient();
  }

  /** Returns null if AI is disabled, fails, or returns invalid data */
  async generate(input: ProductInsightsInput): Promise<ProductInsights | null> {
    if (!this.client.isEnabled()) return null;

    try {
      const prompt = this.buildPrompt(input);
      const response = await this.client.generateJSON<ProductInsights>(prompt);

      if (!response || !isValidProductInsights(response)) {
        console.warn("[ProductInsightsService] Invalid response structure");
        return null;
      }

      return response;
    } catch (error) {
      console.error("[ProductInsightsService] Error:", error);
      return null;
    }
  }

  private buildPrompt(input: ProductInsightsInput): string {
    const attributesText = this.formatAttributes(input.attributes);

    return `You are a product advisor. Generate insights in JSON format.

**Product:**
- Title: ${input.title}
- Price: $${input.price.toLocaleString()}
${input.description ? `- Description: ${input.description.substring(0, 500)}` : ""}
${attributesText ? `- Specs:\n${attributesText}` : ""}

**JSON Format:**
{
  "summary": "2-4 sentences describing key characteristics",
  "pros": ["3-5 strengths as short phrases"],
  "cons": ["2-4 weaknesses as short phrases"],
  "recommendedFor": ["1-3 user types or use cases"]
}

Be objective and concise. Respond ONLY with valid JSON.`;
  }

  private formatAttributes(
    attributes: ProductInsightsInput["attributes"],
  ): string {
    const lines: string[] = [];
    if (attributes.battery) lines.push(`  - Battery: ${attributes.battery}`);
    if (attributes.camera) lines.push(`  - Camera: ${attributes.camera}`);
    if (attributes.ram) lines.push(`  - RAM: ${attributes.ram}`);
    if (attributes.storage) lines.push(`  - Storage: ${attributes.storage}`);
    if (attributes.processor)
      lines.push(`  - Processor: ${attributes.processor}`);
    if (attributes.screen) lines.push(`  - Screen: ${attributes.screen}`);
    return lines.join("\n");
  }
}
