// FlashcardList.tsx

// This component is responsible for displaying and managing a list of saved flashcards.
// It allows users to view their saved flashcards and provides options to delete individual cards.

import React from 'react';
import { Flashcard as FlashcardType } from '@/lib/types';
import Flashcard from './Flashcard';

interface FlashcardListProps {
  flashcards: FlashcardType[];
  onDelete: (id: string) => void;
}

export default function FlashcardList({ flashcards, onDelete }: FlashcardListProps) {
    if (flashcards.length === 0) {
      return <p className="text-center text-gray-500 my-4">No flashcards saved yet.</p>;
    }
  
    return (
      <div className="mt-4 space-y-6">
        {flashcards.map((flashcard) => (
          <Flashcard 
            key={flashcard.id}
            flashcard={flashcard}
            onDelete={() => onDelete(flashcard.id)}
          />
        ))}
      </div>
    );
  }