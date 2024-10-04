import { OpenAI } from 'openai';
import { AIProvider, AICompletionResult } from './aiProvider';

export class OpenAIProvider extends AIProvider {
  private openai: OpenAI;

  constructor() {
    super();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateCompletion(prompt: string): Promise<AICompletionResult> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates flashcard content for language learners."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });

      return {
        content: completion.choices[0]?.message?.content || ''
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }
}