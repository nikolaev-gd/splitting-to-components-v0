// FlashcardApp.tsx

// This is the main component of our flashcard learning application.
// It manages the overall state and flow of the app, including text input,
// flashcard creation, study mode, and additional learning options.

"use client";

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "./ui/button"
import TextInput from './TextInput'
import TextDisplay from './TextDisplay'
import Flashcard from './Flashcard'
import FlashcardView from './FlashcardView'
import ContinueLearning from './ContinueLearning'
import { Flashcard as FlashcardType } from '@/lib/types'
import { shuffleArray } from '@/lib/utils'

export default function FlashcardApp() {
  // State variables
  const [simplified, setSimplified] = useState<string[]>([])
  const [showSimplified, setShowSimplified] = useState(false)
  const [savedFlashcards, setSavedFlashcards] = useState<FlashcardType[]>([])
  const [showOriginal, setShowOriginal] = useState(true)
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [showContinueLearning, setShowContinueLearning] = useState(false)
  const [shuffledFlashcards, setShuffledFlashcards] = useState<FlashcardType[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [reviewMode, setReviewMode] = useState<'all' | 'starred'>('all')

  // Function to move to the next flashcard
  const nextCard = useCallback(() => {
    if (currentCardIndex < shuffledFlashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    } else {
      setIsFinished(true)
    }
  }, [currentCardIndex, shuffledFlashcards.length])

  // Function to move to the previous flashcard
  const previousCard = useCallback(() => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
    }
  }, [currentCardIndex])

  // Effect for keyboard navigation in flashcard mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showFlashcards) {
        if (e.key === 'ArrowRight') {
          nextCard()
        } else if (e.key === 'ArrowLeft') {
          previousCard()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showFlashcards, nextCard, previousCard])

  // Function to handle text submission
  const handleTextSubmit = (submittedText: string) => {
    if (submittedText.trim() !== '') {
      setSimplified(submittedText.split('\n').filter(paragraph => paragraph.trim() !== ''))
    }
  }

  // Function to handle text simplification
  const handleSimplify = () => {
    setShowSimplified(true)
    setShowOriginal(false)
  }

  // Function to handle saving a new flashcard
  const handleSaveFlashcard = (flashcard: FlashcardType) => {
    setSavedFlashcards([...savedFlashcards, flashcard])
  }

  // Function to handle deleting a flashcard
  const handleDeleteFlashcard = (id: string) => {
    setSavedFlashcards(savedFlashcards.filter(flashcard => flashcard.id !== id))
  }

  // Function to toggle between original and simplified text
  const toggleOriginalText = () => {
    setShowOriginal(!showOriginal)
  }

  // Function to update flashcards (e.g., when starring/unstarring)
  const handleUpdateFlashcards = (updatedFlashcards: FlashcardType[]) => {
    setSavedFlashcards(updatedFlashcards)
  }

  // Function to show the continue learning screen
  const handleContinueLearning = () => {
    setShowContinueLearning(true)
    setShowFlashcards(false)
  }

  // Function to reshuffle flashcards for study
  const reshuffleFlashcards = useCallback((cards: FlashcardType[]) => {
    setShuffledFlashcards(shuffleArray(cards))
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setIsFinished(false)
  }, [])

  // Function to handle starring/unstarring a flashcard
  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedFlashcards = [...shuffledFlashcards]
    updatedFlashcards[currentCardIndex] = {
      ...updatedFlashcards[currentCardIndex],
      isStarred: !updatedFlashcards[currentCardIndex].isStarred
    }
    setShuffledFlashcards(updatedFlashcards)
    handleUpdateFlashcards(updatedFlashcards)
  }

  // Function to start reviewing tough (starred) terms
  const handleReviewToughTerms = () => {
    const starredCards = shuffledFlashcards.filter(card => card.isStarred)
    if (starredCards.length > 0) {
      reshuffleFlashcards(starredCards)
      setReviewMode('starred')
    } else {
      alert("No cards have been starred. Please star some cards before reviewing tough terms.")
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto p-4">
        <TextDisplay
          simplified={simplified}
          showSimplified={showSimplified}
          showOriginal={showOriginal}
          onSimplify={handleSimplify}
          onToggleOriginal={toggleOriginalText}
          onSaveFlashcard={handleSaveFlashcard}
        />

        {savedFlashcards.length > 0 && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowFlashcards(true)
                reshuffleFlashcards(savedFlashcards)
              }}
              className="mb-4"
            >
              Learn Saved Flashcards
            </Button>
            <div className="mt-4 space-y-6">
              {savedFlashcards.map((flashcard) => (
                <Flashcard 
                  key={flashcard.id}
                  flashcard={flashcard}
                  onDelete={() => handleDeleteFlashcard(flashcard.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <TextInput onSubmit={handleTextSubmit} />

      {showFlashcards && (
        <FlashcardView
          shuffledFlashcards={shuffledFlashcards}
          currentCardIndex={currentCardIndex}
          isFlipped={isFlipped}
          isFinished={isFinished}
          reviewMode={reviewMode}
          onClose={() => setShowFlashcards(false)}
          onFlip={() => setIsFlipped(!isFlipped)}
          onStar={handleStarClick}
          onNext={nextCard}
          onPrevious={previousCard}
          onRestart={() => reshuffleFlashcards(savedFlashcards)}
          onReviewToughTerms={handleReviewToughTerms}
          onContinueLearning={handleContinueLearning}
        />
      )}

      {showContinueLearning && (
        <ContinueLearning onClose={() => setShowContinueLearning(false)} />
      )}
    </div>
  )
}