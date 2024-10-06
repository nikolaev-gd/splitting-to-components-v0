import { AIProvider } from './aiProvider';
import { AnthropicProvider } from './anthropicProvider';
// Импортируйте другие провайдеры, если они у вас есть

export function createAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER;

  switch (provider) {
    case 'anthropic':
      return new AnthropicProvider();
    // Добавьте другие случаи для других провайдеров
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}