import React from 'react';
import { Flashcard as FlashcardType } from '@/lib/types';
import Flashcard from './Flashcard';

interface FlashcardListProps {
  flashcards: FlashcardType[];
  onDelete: (id: string) => void;
  onStar: (id: string) => void;  // Add this line
}

export default function FlashcardList({ flashcards, onDelete, onStar }: FlashcardListProps) {
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
          onStar={() => onStar(flashcard.id)}  // Add this line
        />
      ))}
    </div>
  );
}