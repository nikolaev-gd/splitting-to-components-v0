// app/hooks/useFlashcards.ts

import { useState, useCallback } from 'react';
import { Flashcard } from '@/lib/types';
import { shuffleArray } from '@/lib/utils';

export function useFlashcards() {
  const [savedFlashcards, setSavedFlashcards] = useState<Flashcard[]>([]);
  const [shuffledFlashcards, setShuffledFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [reviewMode, setReviewMode] = useState<'all' | 'starred'>('all');

  const saveFlashcard = useCallback((flashcard: Flashcard) => {
    setSavedFlashcards(prev => [...prev, flashcard]);
  }, []);

  const deleteFlashcard = useCallback((id: string) => {
    setSavedFlashcards(prev => prev.filter(flashcard => flashcard.id !== id));
  }, []);

  const reshuffleFlashcards = useCallback((cards: Flashcard[]) => {
    setShuffledFlashcards(shuffleArray(cards));
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
  }, []);

  const nextCard = useCallback(() => {
    if (currentCardIndex < shuffledFlashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setIsFinished(true);
    }
  }, [currentCardIndex, shuffledFlashcards.length]);

  const previousCard = useCallback(() => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  }, [currentCardIndex]);

  const flipCard = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const starCard = useCallback((id: string) => {
    setSavedFlashcards(prev => prev.map(card => 
      card.id === id ? { ...card, isStarred: !card.isStarred } : card
    ));
    setShuffledFlashcards(prev => prev.map(card => 
      card.id === id ? { ...card, isStarred: !card.isStarred } : card
    ));
  }, []);

  const handleStarClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const id = (e.currentTarget as HTMLButtonElement).dataset.id;
    if (id) {
      starCard(id);
    }
  }, [starCard]);

  const reviewToughTerms = useCallback(() => {
    const starredCards = savedFlashcards.filter(card => card.isStarred);
    if (starredCards.length > 0) {
      reshuffleFlashcards(starredCards);
      setReviewMode('starred');
    } else {
      alert("No cards have been starred. Please star some cards before reviewing tough terms.");
    }
  }, [savedFlashcards, reshuffleFlashcards]);

  return {
    savedFlashcards,
    shuffledFlashcards,
    currentCardIndex,
    isFlipped,
    isFinished,
    reviewMode,
    saveFlashcard,
    deleteFlashcard,
    reshuffleFlashcards,
    nextCard,
    previousCard,
    flipCard,
    starCard,
    reviewToughTerms,
    handleStarClick,
  };
}