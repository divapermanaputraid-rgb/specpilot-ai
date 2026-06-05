import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import { AiProvider, AiProviderConfig, AiProviderResponse, AiTask } from "../types";

export class OpenRouterProvider implements AiProvider {
  name = "openrouter";

  isAvailable(): boolean {
    return !!process.env.OPENROUTER_API_KEY;
  }

  private getModelName(task: AiTask): string {
    switch (task) {
      case "interview":
        return process.env.OPENROUTER_INTERVIEW_MODEL || "openrouter/auto";
      case "prdGeneration":
        return process.env.OPENROUTER_PRD_MODEL || "openrouter/owl-alpha";
      case "jsonRepair":
        return process.env.OPENROUTER_REPAIR_MODEL || "openrouter/auto";
      default:
        return process.env.OPENROUTER_FALLBACK_MODEL || "openrouter/auto";
    }
  }

  private getTemperature(task: AiTask, configTemperature?: number): number {
    if (configTemperature !== undefined) return configTemperature;
    
    switch (task) {
      case "interview":
        return parseFloat(process.env.AI_INTERVIEW_TEMPERATURE || "0.4");
      case "prdGeneration":
        return parseFloat(process.env.AI_PRD_TEMPERATURE || "0.7");
      case "jsonRepair":
        return parseFloat(process.env.AI_REPAIR_TEMPERATURE || "0.1");
      default:
        return 0.5;
    }
  }

  private getMaxTokens(task: AiTask, configMaxTokens?: number): number {
    if (configMaxTokens !== undefined) return configMaxTokens;
    
    switch (task) {
      case "interview":
        return parseInt(process.env.AI_INTERVIEW_MAX_TOKENS || "1200", 10);
      case "prdGeneration":
        return parseInt(process.env.AI_PRD_MAX_TOKENS || "8000", 10);
      case "jsonRepair":
        return parseInt(process.env.AI_REPAIR_MAX_TOKENS || "1200", 10);
      default:
        return 2000;
    }
  }

  async generate(config: AiProviderConfig): Promise<AiProviderResponse> {
    if (!this.isAvailable()) {
      throw new Error("OpenRouter provider is not configured");
    }

    const openrouter = createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
      headers: {
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
        "X-Title": process.env.OPENROUTER_APP_NAME || "SpecPilot AI",
      }
    });

    const modelName = this.getModelName(config.task);
    const temperature = this.getTemperature(config.task, config.temperature);
    const maxTokens = this.getMaxTokens(config.task, config.maxTokens);

    const { text, usage } = await generateText({
      model: openrouter(modelName),
      messages: config.messages as any[],
      temperature,
    });

    return {
      content: text,
      providerUsed: this.name,
      modelUsed: modelName,
      tokensUsed: usage.totalTokens,
    };
  }
}