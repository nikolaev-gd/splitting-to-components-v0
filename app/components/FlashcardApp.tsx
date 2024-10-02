// app/components/FlashcardApp.tsx

"use client";

import React, { useState } from 'react'
import { Button } from "./ui/button"
import TextInput from './TextInput'
import TextDisplay from './TextDisplay'
import FlashcardList from './FlashcardList'
import StudyModeController from './StudyModeController'
import ContinueLearning from './ContinueLearning'
import { useFlashcards } from '../hooks/useFlashcards'

export default function FlashcardApp() {
  const [simplified, setSimplified] = useState<string[]>([])
  const [showSimplified, setShowSimplified] = useState(false)
  const [showOriginal, setShowOriginal] = useState(true)
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [showContinueLearning, setShowContinueLearning] = useState(false)

  const {
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
  } = useFlashcards();

  const handleTextSubmit = (submittedText: string) => {
    if (submittedText.trim() !== '') {
      setSimplified(submittedText.split('\n').filter(paragraph => paragraph.trim() !== ''))
    }
  }

  const handleSimplify = () => {
    setShowSimplified(true)
    setShowOriginal(false)
  }

  const toggleOriginalText = () => {
    setShowOriginal(!showOriginal)
  }

  const handleContinueLearning = () => {
    setShowContinueLearning(true)
    setShowFlashcards(false)
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
          onSaveFlashcard={saveFlashcard}
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
            <FlashcardList 
              flashcards={savedFlashcards}
              onDelete={deleteFlashcard}
            />
          </div>
        )}
      </div>

      <TextInput onSubmit={handleTextSubmit} />

      {showFlashcards && (
        <StudyModeController
          flashcards={shuffledFlashcards}
          currentIndex={currentCardIndex}
          isFlipped={isFlipped}
          isFinished={isFinished}
          reviewMode={reviewMode}
          onClose={() => setShowFlashcards(false)}
          onFlip={flipCard}
          onStar={handleStarClick}
          onNext={nextCard}
          onPrevious={previousCard}
          onRestart={() => reshuffleFlashcards(savedFlashcards)}
          onReviewToughTerms={reviewToughTerms}
          onContinueLearning={handleContinueLearning}
        />
      )}

      {showContinueLearning && (
        <ContinueLearning onClose={() => setShowContinueLearning(false)} />
      )}
    </div>
  )
}