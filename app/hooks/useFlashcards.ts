// app/hooks/useFlashcards.ts

import { useState, useCallback } from 'react';
import { Flashcard } from '@/lib/types';

export function useFlashcards() {
  const [savedFlashcards, setSavedFlashcards] = useState<Flashcard[]>([]);

  const saveFlashcard = useCallback((flashcard: Flashcard) => {
    setSavedFlashcards(prev => [...prev, flashcard]);
  }, []);

  const deleteFlashcard = useCallback((id: string) => {
    setSavedFlashcards(prev => prev.filter(flashcard => flashcard.id !== id));
  }, []);

  const updateFlashcard = useCallback((id: string, updates: Partial<Flashcard>) => {
    setSavedFlashcards(prev => prev.map(card => 
      card.id === id ? { ...card, ...updates } : card
    ));
  }, []);

  const starCard = useCallback((id: string) => {
    updateFlashcard(id, { isStarred: !savedFlashcards.find(card => card.id === id)?.isStarred });
  }, [updateFlashcard, savedFlashcards]);

  return {
    savedFlashcards,
    saveFlashcard,
    deleteFlashcard,
    updateFlashcard,
    starCard,
  };
}