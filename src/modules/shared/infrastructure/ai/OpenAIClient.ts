import OpenAI from "openai";

interface OpenAIClientConfig {
  apiKey?: string;
  model?: string;
  timeout?: number;
}

/**
 * OpenAI client wrapper with graceful degradation when API key is missing.
 * Never throws - returns null on any error.
 */
export class OpenAIClient {
  private readonly client: OpenAI | null;
  private readonly model: string;
  private readonly timeout: number;
  private readonly enabled: boolean;

  constructor(config?: OpenAIClientConfig) {
    const apiKey = config?.apiKey ?? process.env.OPENAI_API_KEY;
    this.model = config?.model ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini";
    this.timeout =
      config?.timeout ?? (Number(process.env.OPENAI_TIMEOUT) || 5000);

    if (!apiKey) {
      console.warn(
        "[OpenAIClient] OPENAI_API_KEY not configured - AI disabled",
      );
      this.client = null;
      this.enabled = false;
      return;
    }

    this.client = new OpenAI({ apiKey, timeout: this.timeout });
    this.enabled = true;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async generateJSON<T>(prompt: string): Promise<T | null> {
    if (!this.enabled || !this.client) return null;

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: "system", content: "Respond only with valid JSON." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        console.warn("[OpenAIClient] Empty response");
        return null;
      }

      return JSON.parse(content) as T;
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        console.error(`[OpenAIClient] API error (${error.status})`);
      } else if (error instanceof OpenAI.APIConnectionTimeoutError) {
        console.warn(`[OpenAIClient] Timeout after ${this.timeout}ms`);
      } else {
        console.error("[OpenAIClient] Error:", error);
      }
      return null;
    }
  }
}
