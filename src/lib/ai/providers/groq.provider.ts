import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { AiProvider, AiProviderConfig, AiProviderResponse, AiTask } from "../types";

export class GroqProvider implements AiProvider {
  name = "groq";

  isAvailable(): boolean {
    return !!process.env.GROQ_API_KEY;
  }

  private getModelName(task: AiTask): string {
    switch (task) {
      case "interview":
        return process.env.GROQ_INTERVIEW_MODEL || "llama-3.3-70b-versatile";
      case "prdGeneration":
        return process.env.GROQ_INTERVIEW_MODEL || "llama-3.3-70b-versatile"; // Fallback to interview model if PRD not explicitly defined
      case "jsonRepair":
        return process.env.GROQ_REPAIR_MODEL || "llama-3.3-70b-versatile";
      default:
        return process.env.GROQ_FALLBACK_MODEL || "llama-3.1-8b-instant";
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
      throw new Error("Groq provider is not configured");
    }

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const modelName = this.getModelName(config.task);
    const temperature = this.getTemperature(config.task, config.temperature);
    const maxTokens = this.getMaxTokens(config.task, config.maxTokens);

    const { text, usage } = await generateText({
      model: groq(modelName),
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