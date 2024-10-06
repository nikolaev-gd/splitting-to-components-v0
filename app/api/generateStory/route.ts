import { NextResponse } from 'next/server';
import { AnthropicProvider } from '@/lib/anthropicProvider';

export async function POST(request: Request) {
  const { phrases } = await request.json();

  if (!phrases || !Array.isArray(phrases)) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const anthropicProvider = new AnthropicProvider();

  try {
    const prompt = `Create a short story using the following phrases: ${phrases.join(', ')}. The story should be cohesive, engaging, and no longer than 30 words. The short story must have a title no longer than 3 words. Output should contain only the story without any additional info.`;

    const completion = await anthropicProvider.generateCompletion(prompt);

    if (!completion || !completion.content) {
      throw new Error('Invalid response from AI provider');
    }

    const [title, ...storyParts] = completion.content.split('\n').filter(Boolean);

    return NextResponse.json({ title, story: storyParts.join('\n') });
  } catch (error) {
    console.error('Error generating story:', error);
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 });
  }
}