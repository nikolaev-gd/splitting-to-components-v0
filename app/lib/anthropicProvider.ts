import Anthropic from '@anthropic-ai/sdk';
import { AIProvider, AICompletionResult } from './aiProvider';

export class AnthropicProvider extends AIProvider {
  private anthropic: Anthropic;

  constructor() {
    super();
    console.log('API Key:', process.env.ANTHROPIC_API_KEY); // Удалите эту строку после отладки
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async generateCompletion(prompt: string): Promise<AICompletionResult> {
    console.log('AnthropicProvider: Generating completion');
    try {
      const completion = await this.anthropic.completions.create({
        model: "claude-2",
        max_tokens_to_sample: 500,
        prompt: `Human: ${prompt}\n\nAssistant:`,
        stop_sequences: ["\n\nHuman:"],
      });

      console.log('Anthropic response:', completion.completion);

      return {
        content: completion.completion
      };
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw error;
    }
  }
}