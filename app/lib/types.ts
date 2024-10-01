// This code defines what a "flashcard" is in our application.
// A flashcard helps users learn new words by providing information like definitions, example sentences, and images.
// By outlining all the details a flashcard contains, the application can create, display, and manage flashcards effectively.

export interface Flashcard {
  // A unique identifier for the flashcard
  id: string

  // The main word or term that the flashcard is about
  word: string

  // The category or folder this flashcard belongs to
  folder: string

  // An original sentence where the word is used
  originalSentence: string

  // A simple definition of the word
  simpleDefinition: string

  // A list of common phrases or expressions that include the word
  collocations: string[]

  // Example sentences that use the word in context
  exampleSentences: string[]

  // A link or reference to an image that illustrates the word
  illustration: string

  // Indicates whether the flashcard is marked as important or favorite
  isStarred: boolean
}
