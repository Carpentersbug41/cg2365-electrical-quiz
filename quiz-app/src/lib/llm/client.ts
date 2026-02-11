/**
 * LLM Client Abstraction Layer
 * Supports both Google AI Studio and Vertex AI implementations
 * Allows switching between providers via USE_VERTEX_AI environment variable
 */

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { VertexAI } from '@google-cloud/vertexai';
import {
  getGeminiApiKey,
  getGoogleCloudProject,
  getGoogleCloudLocation,
  isVertexAIConfigured,
  shouldUseVertexAI,
  getGeminiModelWithDefault,
} from '@/lib/config/geminiConfig';

/**
 * Configuration for model initialization
 */
export interface ModelConfig {
  model: string;
  systemInstruction?: string;
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    responseMimeType?: string;
  };
}

/**
 * Chat history entry
 */
export interface ChatHistoryEntry {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

/**
 * Unified interface for LLM clients
 */
export interface LLMClient {
  getGenerativeModel(config: ModelConfig): GenerativeModelInterface;
}

/**
 * Unified interface for generative models
 */
export interface GenerativeModelInterface {
  generateContent(input: string | GenerateContentInput): Promise<GenerateContentResult>;
  startChat(config?: ChatConfig): ChatInterface;
}

/**
 * Input for generateContent (supports both string and structured input)
 */
export interface GenerateContentInput {
  contents: Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }>;
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    responseMimeType?: string;
  };
}

/**
 * Result from generateContent
 */
export interface GenerateContentResult {
  response: {
    text(): string;
    candidates?: Array<{
      finishReason?: string;
    }>;
    usageMetadata?: {
      candidatesTokenCount?: number;
      promptTokenCount?: number;
      totalTokenCount?: number;
    };
  };
}

/**
 * Configuration for starting a chat
 */
export interface ChatConfig {
  history?: ChatHistoryEntry[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
}

/**
 * Interface for chat sessions
 */
export interface ChatInterface {
  sendMessage(message: string): Promise<GenerateContentResult>;
}

/**
 * Google AI Studio Client Implementation
 */
class GoogleAIStudioClient implements LLMClient {
  private client: GoogleGenerativeAI;

  constructor() {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set. Cannot initialize Google AI Studio client.');
    }
    this.client = new GoogleGenerativeAI(apiKey);
  }

  getGenerativeModel(config: ModelConfig): GenerativeModelInterface {
    const model = this.client.getGenerativeModel({
      model: config.model,
      systemInstruction: config.systemInstruction,
      generationConfig: config.generationConfig,
    });

    return new GoogleAIStudioModel(model);
  }
}

/**
 * Google AI Studio Model Wrapper
 */
class GoogleAIStudioModel implements GenerativeModelInterface {
  constructor(private model: GenerativeModel) {}

  async generateContent(input: string | GenerateContentInput): Promise<GenerateContentResult> {
    if (typeof input === 'string') {
      const result = await this.model.generateContent(input);
      const metadata = extractResponseMetadata(result.response);
      return {
        response: {
          text: () => result.response.text(),
          candidates: metadata.candidates,
          usageMetadata: metadata.usageMetadata,
        },
      };
    } else {
      // For structured input, convert to Google AI Studio format
      const prompt = input.contents.map(c => c.parts.map(p => p.text).join('')).join('\n');
      const result = await this.model.generateContent(prompt);
      const metadata = extractResponseMetadata(result.response);
      return {
        response: {
          text: () => result.response.text(),
          candidates: metadata.candidates,
          usageMetadata: metadata.usageMetadata,
        },
      };
    }
  }

  startChat(config?: ChatConfig): ChatInterface {
    const chat = this.model.startChat({
      history: config?.history?.map(h => ({
        role: h.role,
        parts: h.parts,
      })),
      generationConfig: config?.generationConfig,
    });

    return new GoogleAIStudioChat(chat);
  }
}

/**
 * Google AI Studio Chat Wrapper
 */
class GoogleAIStudioChat implements ChatInterface {
  constructor(private chat: ReturnType<GenerativeModel['startChat']>) {}

  async sendMessage(message: string): Promise<GenerateContentResult> {
    const result = await this.chat.sendMessage(message);
    return {
      response: {
        text: () => result.response.text(),
      },
    };
  }
}

/**
 * Vertex AI Client Implementation
 */
class VertexAIClient implements LLMClient {
  private client: VertexAI;

  constructor() {
    const project = getGoogleCloudProject();
    const location = getGoogleCloudLocation();

    if (!project) {
      throw new Error('GOOGLE_CLOUD_PROJECT is not set. Cannot initialize Vertex AI client.');
    }

    this.client = new VertexAI({
      project,
      location,
    });
  }

  getGenerativeModel(config: ModelConfig): GenerativeModelInterface {
    const model = this.client.getGenerativeModel({
      model: config.model,
      generationConfig: {
        temperature: config.generationConfig?.temperature,
        maxOutputTokens: config.generationConfig?.maxOutputTokens,
        responseMimeType: config.generationConfig?.responseMimeType as 'application/json' | undefined,
      },
    });

    return new VertexAIModel(model, config.systemInstruction);
  }
}

/**
 * Helper function to extract text from Vertex AI GenerateContentResponse
 */
function extractTextFromVertexAIResponse(response: { candidates?: Array<{ content: { parts: Array<{ text?: string }> } }> }): string {
  const candidate = response.candidates?.[0];
  if (!candidate) return '';
  const part = candidate.content.parts[0];
  return part?.text ?? '';
}

/**
 * Extract optional response metadata in a provider-agnostic shape.
 */
function extractResponseMetadata(response: unknown): Pick<GenerateContentResult['response'], 'candidates' | 'usageMetadata'> {
  const raw = response as {
    candidates?: Array<{ finishReason?: unknown }>;
    usageMetadata?: {
      candidatesTokenCount?: number;
      promptTokenCount?: number;
      totalTokenCount?: number;
    };
  };

  return {
    candidates: raw.candidates?.map((candidate) => ({
      finishReason: candidate.finishReason !== undefined ? String(candidate.finishReason) : undefined,
    })),
    usageMetadata: raw.usageMetadata
      ? {
          candidatesTokenCount: raw.usageMetadata.candidatesTokenCount,
          promptTokenCount: raw.usageMetadata.promptTokenCount,
          totalTokenCount: raw.usageMetadata.totalTokenCount,
        }
      : undefined,
  };
}

/**
 * Vertex AI Model Wrapper
 */
class VertexAIModel implements GenerativeModelInterface {
  constructor(
    private model: ReturnType<VertexAI['getGenerativeModel']>,
    private systemInstruction?: string
  ) {}

  async generateContent(input: string | GenerateContentInput): Promise<GenerateContentResult> {
    let contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;
    let generationConfig: { responseMimeType?: string } | undefined;

    if (typeof input === 'string') {
      contents = [{ role: 'user', parts: [{ text: input }] }];
    } else {
      contents = input.contents;
      generationConfig = input.generationConfig ? { responseMimeType: input.generationConfig.responseMimeType } : undefined;
    }

    const result = await this.model.generateContent({
      contents,
      systemInstruction: this.systemInstruction,
      generationConfig: {
        ...generationConfig,
        temperature: typeof input === 'object' ? input.generationConfig?.temperature : undefined,
        maxOutputTokens: typeof input === 'object' ? input.generationConfig?.maxOutputTokens : undefined,
      },
    });
    const metadata = extractResponseMetadata(result.response);

    return {
      response: {
        text: () => extractTextFromVertexAIResponse(result.response),
        candidates: metadata.candidates,
        usageMetadata: metadata.usageMetadata,
      },
    };
  }

  startChat(config?: ChatConfig): ChatInterface {
    // Vertex AI doesn't have a direct startChat equivalent, so we'll simulate it
    return new VertexAIChat(this.model, this.systemInstruction, config);
  }
}

/**
 * Vertex AI Chat Wrapper (simulated using generateContent)
 */
class VertexAIChat implements ChatInterface {
  private history: ChatHistoryEntry[];

  constructor(
    private model: ReturnType<VertexAI['getGenerativeModel']>,
    private systemInstruction?: string,
    config?: ChatConfig
  ) {
    this.history = config?.history || [];
  }

  async sendMessage(message: string): Promise<GenerateContentResult> {
    // Add user message to history
    this.history.push({ role: 'user', parts: [{ text: message }] });

    const result = await this.model.generateContent({
      contents: this.history,
      systemInstruction: this.systemInstruction,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    // Add model response to history
    const responseText = extractTextFromVertexAIResponse(result.response);
    const metadata = extractResponseMetadata(result.response);
    this.history.push({ role: 'model', parts: [{ text: responseText }] });

    return {
      response: {
        text: () => responseText,
        candidates: metadata.candidates,
        usageMetadata: metadata.usageMetadata,
      },
    };
  }
}

/**
 * Create LLM client based on configuration
 * Falls back to Google AI Studio if Vertex AI is not configured or fails
 */
export function createLLMClient(): LLMClient {
  try {
    if (shouldUseVertexAI() && isVertexAIConfigured()) {
      console.log('Using Vertex AI client');
      return new VertexAIClient();
    }
  } catch (error) {
    console.warn('Failed to initialize Vertex AI client, falling back to Google AI Studio:', error);
  }

  // Default to Google AI Studio
  console.log('Using Google AI Studio client');
  return new GoogleAIStudioClient();
}

/**
 * Create LLM client with automatic fallback
 * Tries Vertex AI first if configured, falls back to Google AI Studio on error
 */
export async function createLLMClientWithFallback(): Promise<LLMClient> {
  const modelName = getGeminiModelWithDefault();
  
  if (shouldUseVertexAI() && isVertexAIConfigured()) {
    try {
      const client = new VertexAIClient();
      // Test the client by getting a model (this will fail if credentials are invalid or model not set)
      const testModel = client.getGenerativeModel({
        model: modelName,
      });
      console.log('✅ [LLM Client] Vertex AI client initialized successfully');
      console.log('🤖 [LLM Client] Model configured:', modelName);
      return client;
    } catch (error) {
      console.warn('⚠️ [LLM Client] Vertex AI initialization failed, falling back to Google AI Studio:', error);
    }
  }

  // Fallback to Google AI Studio
  console.log('✅ [LLM Client] Using Google AI Studio client');
  console.log('🤖 [LLM Client] Model configured:', modelName);
  return new GoogleAIStudioClient();
}
