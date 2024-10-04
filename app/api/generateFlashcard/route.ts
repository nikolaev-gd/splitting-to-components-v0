// app/api/generateFlashcard/route.ts

import { NextResponse } from 'next/server'
import { Flashcard } from '@/lib/types'
import { OpenAIProvider } from '@/lib/openAIProvider'
import { AnthropicProvider } from '@/lib/anthropicProvider'
import { AIProvider } from '@/lib/aiProvider'

let aiProvider: AIProvider;

if (process.env.AI_PROVIDER === 'anthropic') {
  console.log('Using Anthropic provider');
  aiProvider = new AnthropicProvider();
} else {
  console.log('Using OpenAI provider');
  aiProvider = new OpenAIProvider();
}

export async function POST(request: Request) {
  try {
    const { targetWord, initialSentence } = await request.json()

    if (!targetWord || !initialSentence) {
      return NextResponse.json({ error: 'Missing targetWord or initialSentence' }, { status: 400 })
    }

    console.log(`Generating flashcard for word: ${targetWord}`);

    const prompt = `Use the following inputs:
**Initial sentence:** [${initialSentence}]  
**Target word:** [${targetWord}]  
Follow these steps to create the flashcard:
1. **Main phrase**: Extract the most common and natural word combination or structure with the target word from the initial sentence. Ensure that this phrase is directly presented without omissions.  
2. **Explanation**: Provide the meaning of the target word in up to 5 words, making it as simple as possible.  
3. **High-Frequency Collocations (HFC)**: Provide 3 high-frequency collocations using the target word in the same meaning as the explanation, separated by commas.  
4. **Contextual sentence**: Create a simple sentence using the main phrase in a clear and easy-to-understand way.
**Output format:**  
Main phrase
Explanation (up to 5 words)
3 high-frequency collocations
Contextual sentence
Provide the information in this sequence without including labels like "Main phrase:" or "Explanation:". Just give the direct content in the specified order.`

    console.log('Sending prompt to AI provider');
    let completion;
    try {
      completion = await aiProvider.generateCompletion(prompt);
    } catch (error) {
      console.error('Error from AI provider:', error);
      throw new Error(`AI provider error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    const content = completion.content;

    if (!content) {
      console.error('No content generated from AI provider');
      throw new Error('No content generated from AI provider')
    }

    console.log('AI provider response:', content);

    const [mainPhrase, explanation, collocations, contextSentence] = content.split('\n')

    if (!mainPhrase || !explanation || !collocations || !contextSentence) {
      console.error('Incomplete data from AI provider response');
      throw new Error('Incomplete data from AI provider response')
    }

    // Use placeholder image instead of generating from OpenAI
    const imageUrl = '/images/placeholder.png'

    const normalizedMainPhrase = mainPhrase.replace(/^["']|["']$/g, '')

    const flashcardData: Flashcard = {
      id: Date.now().toString(),
      word: targetWord,
      lexicalItem: normalizedMainPhrase,
      originalSentence: initialSentence,
      simpleDefinition: explanation,
      collocations: collocations.split(', '),
      contextSentence,
      illustration: imageUrl,
      isStarred: false
    }

    console.log('Generated flashcard data:', flashcardData);

    return NextResponse.json(flashcardData)
  } catch (error) {
    console.error('Error generating flashcard:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}