import { AiProvider, AiProviderConfig, AiProviderResponse, AiTask } from "./types";
import { GroqProvider } from "./providers/groq.provider";
import { OpenRouterProvider } from "./providers/openrouter.provider";
import { MockProvider } from "./providers/mock.provider";

export class ProviderRouter {
  private providers: Map<string, AiProvider> = new Map();
  private defaultProvider: string;
  private taskRouting: Record<AiTask, string>;

  constructor() {
    this.initProviders();
    this.defaultProvider = process.env.AI_DEFAULT_PROVIDER || "mock";
    
    // Check if default provider is available, fallback to mock if not
    if (this.defaultProvider !== "mock" && !this.providers.get(this.defaultProvider)?.isAvailable()) {
      console.warn(`Default provider '${this.defaultProvider}' is not available. Falling back to 'mock'.`);
      this.defaultProvider = "mock";
    }

    this.taskRouting = {
      interview: process.env.AI_PROVIDER_INTERVIEW || this.defaultProvider,
      prdGeneration: process.env.AI_PROVIDER_PRD || this.defaultProvider,
      jsonRepair: process.env.AI_PROVIDER_REPAIR || this.defaultProvider,
    };
  }

  private initProviders() {
    // Initialize available providers
    const mock = new MockProvider();
    this.providers.set(mock.name, mock);

    const groq = new GroqProvider();
    if (groq.isAvailable()) {
      this.providers.set(groq.name, groq);
    }

    const openrouter = new OpenRouterProvider();
    if (openrouter.isAvailable()) {
      this.providers.set(openrouter.name, openrouter);
    }
  }

  getProviderForTask(task: AiTask): AiProvider {
    let providerName = this.taskRouting[task];
    
    // Check if the routed provider exists and is available
    let provider = this.providers.get(providerName);
    
    if (!provider || !provider.isAvailable()) {
      console.warn(`Provider '${providerName}' for task '${task}' is not available. Falling back to default: '${this.defaultProvider}'`);
      providerName = this.defaultProvider;
      provider = this.providers.get(providerName);
      
      // Ultimate fallback
      if (!provider) {
         provider = this.providers.get("mock")!;
      }
    }

    return provider;
  }

  async generate(config: AiProviderConfig): Promise<AiProviderResponse> {
    const provider = this.getProviderForTask(config.task);
    return provider.generate(config);
  }
}

// Singleton instance
export const aiRouter = new ProviderRouter();