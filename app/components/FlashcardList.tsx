import React from 'react';
import Flashcard from './Flashcard';
import { useFlashcardContext } from '../contexts/FlashcardContext';

export default function FlashcardList() {
  const { savedFlashcards } = useFlashcardContext();

  if (savedFlashcards.length === 0) {
    return null; // Renders nothing when there are no flashcards
  }

  return (
    <div className="mt-4 space-y-6">
      {savedFlashcards.map((flashcard) => (
        <Flashcard 
          key={flashcard.id}
          flashcard={flashcard}
        />
      ))}
    </div>
  );
}