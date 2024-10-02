// app/contexts/FlashcardContext.tsx

"use client"

import React, { createContext, useContext, ReactNode } from 'react';
import { Flashcard } from '@/lib/types';
import { useFlashcards } from '../hooks/useFlashcards';

interface FlashcardContextType {
  savedFlashcards: Flashcard[];
  saveFlashcard: (flashcard: Flashcard) => void;
  deleteFlashcard: (id: string) => void;
  starCard: (id: string) => void;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

export function FlashcardProvider({ children }: { children: ReactNode }) {
  const flashcardMethods = useFlashcards();

  return (
    <FlashcardContext.Provider value={flashcardMethods}>
      {children}
    </FlashcardContext.Provider>
  );
}

export function useFlashcardContext() {
  const context = useContext(FlashcardContext);
  if (context === undefined) {
    throw new Error('useFlashcardContext must be used within a FlashcardProvider');
  }
  return context;
}