import { AiProvider, AiProviderConfig, AiProviderResponse, AiTask } from "../types";

export class NineRouterProvider implements AiProvider {
  readonly name = "nineRouter";

  private getBaseUrl(): string {
    return process.env.NINE_ROUTER_BASE_URL || "http://localhost:20128/v1";
  }

  private getApiKey(): string {
    return process.env.NINE_ROUTER_API_KEY || "";
  }

  private getModel(task: AiTask): string {
    switch (task) {
      case "interview":
        return process.env.NINE_ROUTER_INTERVIEW_MODEL || "auto";
      case "prdGeneration":
        return process.env.NINE_ROUTER_PRD_MODEL || "auto";
      case "jsonRepair":
        return process.env.NINE_ROUTER_REPAIR_MODEL || "auto";
      default:
        return process.env.NINE_ROUTER_FALLBACK_MODEL || "auto";
    }
  }

  isAvailable(): boolean {
    return process.env.NINE_ROUTER_ENABLED === "true" && !!this.getApiKey();
  }

  async generate(config: AiProviderConfig): Promise<AiProviderResponse> {
    const model = this.getModel(config.task);
    const baseURL = this.getBaseUrl();
    const apiKey = this.getApiKey();

    const isJsonTask = config.task === "interview" || config.task === "jsonRepair";

    if (process.env.NODE_ENV === "development") {
      console.log(`[AI] task=${config.task} provider=${this.name} model=${model} baseURL=${baseURL}`);
    }

    if (config.task === "prdGeneration" && model === "auto") {
      console.warn(
        "[AI] Using NINE_ROUTER_PRD_MODEL=auto may produce shorter or weaker PRDs. Use an explicit strong model for production-quality PRDs."
      );
    }

    try {
      // Try with response_format first for JSON tasks
      let body: any = {
        model,
        messages: config.messages,
        temperature: config.temperature ?? 0.7,
        max_tokens: config.maxTokens ?? (config.task === "prdGeneration" ? parseInt(process.env.AI_PRD_MAX_TOKENS || "12000") : 2000),
        stream: false,
      };

      if (isJsonTask) {
        body.response_format = { type: "json_object" };
      }

      let response = await fetch(`${baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      // Retry without response_format if rejected
      if (!response.ok && isJsonTask) {
        const errorData = await response.clone().json().catch(() => ({}));
        const errorMessage = errorData.error?.message || "";
        
        if (errorMessage.toLowerCase().includes("response_format") || response.status === 400) {
          if (process.env.NODE_ENV === "development") {
            console.log(`[AI] Retrying without response_format due to error: ${errorMessage}`);
          }
          delete body.response_format;
          response = await fetch(`${baseURL}/chat/completions`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
        }
      }

      if (process.env.NODE_ENV === "development") {
        console.log(`[AI] task=${config.task} provider=${this.name} status=${response.status}`);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`9Router API error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("9Router returned empty response");
      }

      return {
        content,
        providerUsed: this.name,
        modelUsed: data.model || model,
        tokensUsed: data.usage?.total_tokens,
      };
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(`[AI] task=${config.task} provider=${this.name} error=`, error);
      }
      throw error;
    }
  }
}