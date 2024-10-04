import Anthropic from '@anthropic-ai/sdk';
import { AIProvider, AICompletionResult } from './aiProvider';

export class AnthropicProvider extends AIProvider {
  private anthropic: Anthropic;

  constructor() {
    super();
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async generateCompletion(prompt: string): Promise<AICompletionResult> {
    try {
      const completion = await this.anthropic.completions.create({
        model: "claude-2",
        max_tokens_to_sample: 300,
        prompt: `Human: ${prompt}\n\nAssistant:`,
      });

      return {
        content: completion.completion
      };
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw error;
    }
  }
}