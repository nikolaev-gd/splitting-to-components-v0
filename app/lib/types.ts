export interface Flashcard {
    id: string
    word: string
    folder: string
    originalSentence: string
    simpleDefinition: string
    collocations: string[]
    exampleSentences: string[]
    illustration: string
    isStarred: boolean
  }