import { AiProvider, AiProviderConfig, AiProviderResponse, AiTask } from "./types";
import { GroqProvider } from "./providers/groq.provider";
import { OpenRouterProvider } from "./providers/openrouter.provider";
import { MockProvider } from "./providers/mock.provider";
import { NineRouterProvider } from "./providers/nine-router.provider";

export class ProviderRouter {
  private providers: Map<string, AiProvider> = new Map();

  constructor() {
    this.initProviders();
  }

  private initProviders() {
    const mock = new MockProvider();
    this.providers.set(mock.name, mock);

    const groq = new GroqProvider();
    this.providers.set(groq.name, groq);

    const openrouter = new OpenRouterProvider();
    this.providers.set(openrouter.name, openrouter);

    const nineRouter = new NineRouterProvider();
    this.providers.set(nineRouter.name, nineRouter);
  }

  private getProviderOrder(task: AiTask): string[] {
    const aiMode = process.env.AI_MODE || "mock";
    
    // If mock mode, always use mock provider
    if (aiMode === "mock") {
      return ["mock"];
    }

    let orderStr = "";
    switch (task) {
      case "interview":
        orderStr = process.env.AI_INTERVIEW_PROVIDER_ORDER || "";
        break;
      case "prdGeneration":
        orderStr = process.env.AI_PRD_PROVIDER_ORDER || "";
        break;
      case "jsonRepair":
        orderStr = process.env.AI_REPAIR_PROVIDER_ORDER || "";
        break;
    }

    if (!orderStr) {
      return ["mock"];
    }

    return orderStr.split(",").map(p => p.trim());
  }

  async generate(config: AiProviderConfig): Promise<AiProviderResponse> {
    const providers = this.getProviderOrder(config.task);
    const errors: Error[] = [];

    for (const providerName of providers) {
      const provider = this.providers.get(providerName);

      if (!provider) {
        continue;
      }

      if (!provider.isAvailable()) {
        if (process.env.NODE_ENV === "development") {
          console.warn(`[AI] provider=${providerName} not available`);
        }
        continue;
      }

      try {
        return await provider.generate(config);
      } catch (error) {
        errors.push(error as Error);
        
        // If we are in live mode and this is the only provider or fallback not allowed
        if (process.env.AI_MODE === "live" && providers.length === 1) {
          throw error;
        }

        if (process.env.NODE_ENV === "development") {
          console.error(`[AI] provider=${providerName} failed, trying next...`, error);
        }
      }
    }

    const aiMode = process.env.AI_MODE || "mock";
    if (aiMode === "live") {
      throw new Error(`All providers failed for task ${config.task}: ${errors.map(e => e.message).join(", ")}`);
    }

    // Ultimate fallback for non-live mode
    return this.providers.get("mock")!.generate(config);
  }
}

// Singleton instance
export const aiRouter = new ProviderRouter();