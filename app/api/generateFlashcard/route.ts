import { NextResponse } from 'next/server'
import { Flashcard } from '@/lib/types'
import { OpenAIProvider } from '@/lib/openAIProvider'
import { AnthropicProvider } from '@/lib/anthropicProvider'
import { AIProvider } from '@/lib/aiProvider'

let aiProvider: AIProvider;

console.log('AI_PROVIDER:', process.env.AI_PROVIDER);
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Loaded' : 'Not Loaded');
console.log('ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? 'Loaded' : 'Not Loaded');

if (process.env.AI_PROVIDER === 'anthropic') {
  console.log('Using Anthropic provider');
  aiProvider = new AnthropicProvider();
} else {
  console.log('Using OpenAI provider');
  aiProvider = new OpenAIProvider();
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function retry<T>(fn: () => Promise<T>, retries: number = MAX_RETRIES): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(`Error in retry (${MAX_RETRIES - retries + 1}/${MAX_RETRIES}):`, error);
    if (retries > 0) {
      console.log(`Retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retry(fn, retries - 1);
    }
    throw error;
  }
}

function parseAIResponse(content: string): string[] {
  return content.split('\n').map(line => line.trim()).filter(line => line !== '');
}

export async function POST(request: Request) {
  console.log('API route called');
  try {
    const { targetWord, initialSentence } = await request.json();
    console.log('Received data:', { targetWord, initialSentence });

    if (!targetWord || !initialSentence) {
      console.error('Missing targetWord or initialSentence');
      return NextResponse.json({ error: 'Missing targetWord or initialSentence' }, { status: 400 });
    }

    const prompt = `You are a language learning assistant. Your task is to create a comprehensive flashcard for a given word in context. Follow these instructions precisely:

Input:
Word: ${targetWord}
Sentence: ${initialSentence}

Output format (provide ONLY these 5 lines in order, without labels or extra text):
Collocation from the sentence (natural phrase containing the word)
Original sentence (unchanged)
Brief definition (max 5 words, simple)
Three common collocations (comma-separated)
New simple sentence using the collocation

Example output:
take a deep breath
John had to take a deep breath before giving his speech.
inhale and exhale slowly
take a break, take a chance, take a look
Remember to take a deep breath when you feel stressed.

Your response:`;

    console.log('Sending prompt to AI provider');
    let completion;
    try {
      completion = await retry(() => aiProvider.generateCompletion(prompt));
      console.log('AI provider response:', completion);
      
      if (!completion || !completion.content) {
        throw new Error('Invalid response from AI provider');
      }
    } catch (error) {
      console.error('Error from AI provider:', error);
      return NextResponse.json({ 
        error: 'AI provider error', 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }, { status: 500 });
    }

    const content = completion.content.trim();
    console.log('Processed AI response:', content);

    if (!content) {
      console.error('No content generated from AI provider');
      return NextResponse.json({ error: 'No content generated' }, { status: 500 });
    }

    const parts = parseAIResponse(content);

    if (parts.length < 5) {
      console.error('Incomplete data from AI provider response');
      return NextResponse.json({ 
        error: 'Incomplete data from AI provider', 
        parts,
        rawResponse: content
      }, { status: 500 });
    }

    const [lexicalItem, originalSentence, simpleDefinition, collocations, contextSentence] = parts;

    const imageUrl = '/images/placeholder.png'

    const flashcardData: Flashcard = {
      id: Date.now().toString(),
      word: targetWord,
      lexicalItem,
      originalSentence,
      simpleDefinition,
      collocations: collocations.split(',').map(c => c.trim()),
      contextSentence,
      illustration: imageUrl,
      isStarred: false
    }

    console.log('Generated flashcard data:', flashcardData);
    return NextResponse.json(flashcardData)
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ 
      error: 'An unexpected error occurred', 
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}