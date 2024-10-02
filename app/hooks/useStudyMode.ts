"use client"

import { useState, useCallback, useEffect } from 'react';
import { shuffleArray } from '@/lib/utils';
import { useFlashcardContext } from '../contexts/FlashcardContext';
import { Flashcard } from '@/lib/types';

export function useStudyMode() {
  const { savedFlashcards, starCard } = useFlashcardContext();
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [shuffledFlashcards, setShuffledFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [reviewMode, setReviewMode] = useState<'all' | 'starred'>('all');

  useEffect(() => {
    if (isStudyMode) {
      setShuffledFlashcards(prevShuffled => {
        const newShuffled = prevShuffled.map(card => {
          const updatedCard = savedFlashcards.find(c => c.id === card.id);
          return updatedCard || card;
        });
        return newShuffled;
      });
    }
  }, [savedFlashcards, isStudyMode]);

  const startStudyMode = useCallback(() => {
    setShuffledFlashcards(shuffleArray(savedFlashcards));
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
    setIsStudyMode(true);
    setReviewMode('all');
  }, [savedFlashcards]);

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

  const restartStudy = useCallback(() => {
    setShuffledFlashcards(shuffleArray(savedFlashcards));
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setIsFinished(false);
    setReviewMode('all');
  }, [savedFlashcards]);

  const reviewToughTerms = useCallback(() => {
    const starredCards = savedFlashcards.filter(card => card.isStarred);
    if (starredCards.length > 0) {
      setShuffledFlashcards(shuffleArray(starredCards));
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setIsFinished(false);
      setReviewMode('starred');
    } else {
      alert("No cards have been starred. Please star some cards before reviewing tough terms.");
    }
  }, [savedFlashcards]);

  const exitStudyMode = useCallback(() => {
    setIsStudyMode(false);
    setIsFinished(false);
  }, []);

  const handleStarClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const id = (e.currentTarget as HTMLButtonElement).dataset.id;
    if (id) {
      starCard(id);
    }
  }, [starCard]);

  return {
    isStudyMode,
    shuffledFlashcards,
    currentCardIndex,
    isFlipped,
    isFinished,
    reviewMode,
    startStudyMode,
    nextCard,
    previousCard,
    flipCard,
    restartStudy,
    reviewToughTerms,
    exitStudyMode,
    handleStarClick,
  };
}