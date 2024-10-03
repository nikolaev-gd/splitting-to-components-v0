// app/lib/types.ts

export interface Flashcard {
  id: string;
  word: string;
  lexicalItem: string;
  originalSentence: string;
  simpleDefinition: string;
  collocations: string[];
  contextSentence: string;
  illustration: string;
  isStarred: boolean;
}