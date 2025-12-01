import {
  type ProductInsightsInput,
  ProductInsightsService,
} from "@/modules/catalog/infrastructure/ai/ProductInsightsService";
import { OpenAIClient } from "@/modules/shared/infrastructure/ai/OpenAIClient";

// Mock OpenAIClient
jest.mock("@/modules/shared/infrastructure/ai/OpenAIClient");

const MockedOpenAIClient = OpenAIClient as jest.MockedClass<
  typeof OpenAIClient
>;

describe("ProductInsightsService", () => {
  let service: ProductInsightsService;
  let mockClient: jest.Mocked<OpenAIClient>;

  const validInput: ProductInsightsInput = {
    title: "iPhone 14 Pro",
    price: 999,
    description: "Latest Apple smartphone with advanced features",
    attributes: {
      battery: "3200mAh",
      camera: "48MP",
      ram: "6GB",
      storage: "256GB",
      processor: "A16 Bionic",
      screen: "6.1 inches",
    },
  };

  const validResponse = {
    summary: "The iPhone 14 Pro is a premium smartphone with excellent camera.",
    pros: ["Great camera", "Fast processor", "Premium build"],
    cons: ["High price", "No expandable storage"],
    recommendedFor: ["Photography enthusiasts", "Power users"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockClient = {
      isEnabled: jest.fn(),
      generateJSON: jest.fn(),
    } as unknown as jest.Mocked<OpenAIClient>;
    MockedOpenAIClient.mockImplementation(() => mockClient);
    service = new ProductInsightsService(mockClient);
  });

  describe("generate()", () => {
    it("should return null when AI client is disabled", async () => {
      mockClient.isEnabled.mockReturnValue(false);

      const result = await service.generate(validInput);

      expect(result).toBeNull();
      expect(mockClient.generateJSON).not.toHaveBeenCalled();
    });

    it("should return insights when AI client returns valid response", async () => {
      mockClient.isEnabled.mockReturnValue(true);
      mockClient.generateJSON.mockResolvedValue(validResponse);

      const result = await service.generate(validInput);

      expect(result).toEqual(validResponse);
      expect(mockClient.generateJSON).toHaveBeenCalledTimes(1);
    });

    it("should return null when AI client returns null", async () => {
      mockClient.isEnabled.mockReturnValue(true);
      mockClient.generateJSON.mockResolvedValue(null);

      const result = await service.generate(validInput);

      expect(result).toBeNull();
    });

    it("should return null when response is missing required fields", async () => {
      mockClient.isEnabled.mockReturnValue(true);
      mockClient.generateJSON.mockResolvedValue({
        summary: "Test summary",
        // missing pros and cons
      });

      const result = await service.generate(validInput);

      expect(result).toBeNull();
    });

    it("should return null when pros array is empty", async () => {
      mockClient.isEnabled.mockReturnValue(true);
      mockClient.generateJSON.mockResolvedValue({
        ...validResponse,
        pros: [],
      });

      const result = await service.generate(validInput);

      expect(result).toBeNull();
    });

    it("should return null when cons array is empty", async () => {
      mockClient.isEnabled.mockReturnValue(true);
      mockClient.generateJSON.mockResolvedValue({
        ...validResponse,
        cons: [],
      });

      const result = await service.generate(validInput);

      expect(result).toBeNull();
    });

    it("should accept response without recommendedFor (optional field)", async () => {
      mockClient.isEnabled.mockReturnValue(true);
      const responseWithoutRecommendations = {
        summary: validResponse.summary,
        pros: validResponse.pros,
        cons: validResponse.cons,
      };
      mockClient.generateJSON.mockResolvedValue(responseWithoutRecommendations);

      const result = await service.generate(validInput);

      expect(result).toEqual(responseWithoutRecommendations);
    });

    it("should return null when API throws error", async () => {
      mockClient.isEnabled.mockReturnValue(true);
      mockClient.generateJSON.mockRejectedValue(new Error("API Error"));

      const result = await service.generate(validInput);

      expect(result).toBeNull();
    });

    it("should include product attributes in prompt", async () => {
      mockClient.isEnabled.mockReturnValue(true);
      mockClient.generateJSON.mockResolvedValue(validResponse);

      await service.generate(validInput);

      const promptArg = mockClient.generateJSON.mock.calls[0][0];
      expect(promptArg).toContain("iPhone 14 Pro");
      expect(promptArg).toContain("999");
      expect(promptArg).toContain("Battery: 3200mAh");
      expect(promptArg).toContain("Camera: 48MP");
    });

    it("should handle input with minimal attributes", async () => {
      mockClient.isEnabled.mockReturnValue(true);
      mockClient.generateJSON.mockResolvedValue(validResponse);

      const minimalInput: ProductInsightsInput = {
        title: "Basic Product",
        price: 100,
        attributes: {},
      };

      const result = await service.generate(minimalInput);

      expect(result).toEqual(validResponse);
    });
  });
});
