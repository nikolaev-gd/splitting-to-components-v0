// app/api/generateFlashcard/route.ts

import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { Flashcard } from '@/lib/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { targetWord, initialSentence } = await request.json()

    if (!targetWord || !initialSentence) {
      return NextResponse.json({ error: 'Missing targetWord or initialSentence' }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates flashcard content for language learners."
        },
        {
          role: "user",
          content: `Use the following inputs:
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
        }
      ]
    })

    const content = completion.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content generated from OpenAI')
    }

    const [mainPhrase, explanation, collocations, contextSentence] = content.split('\n')

    if (!mainPhrase || !explanation || !collocations || !contextSentence) {
      throw new Error('Incomplete data from OpenAI response')
    }

    /*
    let imageUrl: string
    try {
      const image = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Create an image that represents the phrase: ${mainPhrase}`,
        n: 1,
        size: "1024x1024"
      })
      imageUrl = image.data[0]?.url || '/placeholder-image.jpg'
    } catch (imageError) {
      console.error('Error generating image:', imageError)
      imageUrl = '/placeholder-image.jpg'
    }
    */

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

    return NextResponse.json(flashcardData)
  } catch (error) {
    console.error('Error generating flashcard:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}