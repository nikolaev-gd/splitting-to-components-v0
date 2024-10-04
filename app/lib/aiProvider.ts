export interface AICompletionResult {
  content: string;
}

export abstract class AIProvider {
  abstract generateCompletion(prompt: string): Promise<AICompletionResult>;
}