import { NextResponse } from 'next/server'
import { AnthropicProvider } from '@/lib/anthropicProvider'

const aiProvider = new AnthropicProvider();

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 });
    }

    const prompt = `Your task is to simplify the given text. Follow these rules strictly:

1. Use simpler vocabulary
2. Reduce the length by approximately 50%
3. Simplify the grammar
4. Maintain the main ideas and key information

IMPORTANT: Your output must contain ONLY the simplified text. Do not include any introductory phrases, explanations, or metadata. Start directly with the simplified content.

Input:
${text}

Simplified text:`;

    console.log('Sending prompt to AI provider:', prompt);

    const completion = await aiProvider.generateCompletion(prompt);
    
    if (!completion || !completion.content) {
      throw new Error('Invalid response from AI provider');
    }

    console.log('Received simplified text:', completion.content);

    // Remove any potential introductory phrases
    let simplifiedText = completion.content.trim();
    simplifiedText = simplifiedText.replace(/^(here is a simplified version of the (input )?text:?|simplified text:?)/i, '').trim();

    // If the text still starts with "Here is" or similar phrases, remove the first sentence
    if (/^(here|this|following|below)/i.test(simplifiedText)) {
      simplifiedText = simplifiedText.replace(/^[^.!?]+[.!?]\s*/i, '').trim();
    }

    return NextResponse.json({ simplifiedText });
  } catch (error) {
    console.error('Error in simplifyText API route:', error);
    return NextResponse.json({ 
      error: 'An unexpected error occurred', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}