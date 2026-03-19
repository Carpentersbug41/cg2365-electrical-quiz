import { createLLMClientWithFallback } from '@/lib/llm/client';
import { getGeminiModel } from '@/lib/config/geminiConfig';
import { logGuidedLlmDebug } from '@/lib/guidedChunk/debug';

export async function generateGuidedChunkJson<T>(
  systemInstruction: string,
  userPrompt: string,
  debugLabel = 'guided_chunk_json'
): Promise<T | null> {
  try {
    const client = await createLLMClientWithFallback();
    const modelName = getGeminiModel();
    const model = client.getGenerativeModel({
      model: modelName,
      systemInstruction,
    });

    logGuidedLlmDebug(`${debugLabel}:request`, {
      modelName,
      systemInstruction,
      userPrompt,
    });

    const result = await model.generateContent(userPrompt);
    const rawText = result.response.text();
    const text = rawText.replace(/```json|```/g, '').trim();

    logGuidedLlmDebug(`${debugLabel}:response_raw`, {
      rawText,
      cleanedText: text,
    });

    const parsed = JSON.parse(text) as T;

    logGuidedLlmDebug(`${debugLabel}:response_parsed`, parsed);

    return parsed;
  } catch (error) {
    logGuidedLlmDebug(`${debugLabel}:error`, {
      message: error instanceof Error ? error.message : 'Unknown error',
      error,
      systemInstruction,
      userPrompt,
    });
    return null;
  }
}
