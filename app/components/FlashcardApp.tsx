'use client'

import React from 'react'
import { Button } from "./ui/button"
import TextInput from './TextInput'
import TextDisplay from './TextDisplay'
import FlashcardList from './FlashcardList'
import StudyModeController from './StudyModeController'
import ContinueLearning from './ContinueLearning'
import { useFlashcards } from '../hooks/useFlashcards'
import { useTextDisplay } from '../hooks/useTextDisplay'
import { useStudyMode } from '../hooks/useStudyMode'

export default function FlashcardApp() {
  const {
    savedFlashcards,
    saveFlashcard,
    deleteFlashcard,
    starCard,
  } = useFlashcards();

  const {
    simplified,
    showSimplified,
    showOriginal,
    handleTextSubmit,
    handleSimplify,
    toggleOriginalText,
  } = useTextDisplay();

  const {
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
  } = useStudyMode(savedFlashcards, starCard);

  const [showContinueLearning, setShowContinueLearning] = React.useState(false)

  const handleContinueLearning = () => {
    setShowContinueLearning(true)
    exitStudyMode()
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
              onClick={startStudyMode}
              className="mb-4"
            >
              Learn Saved Flashcards
            </Button>
            <FlashcardList 
              flashcards={savedFlashcards}
              onDelete={deleteFlashcard}
              onStar={starCard}
            />
          </div>
        )}
      </div>

      <TextInput onSubmit={handleTextSubmit} />

      {isStudyMode && (
        <StudyModeController
          flashcards={shuffledFlashcards}
          currentIndex={currentCardIndex}
          isFlipped={isFlipped}
          isFinished={isFinished}
          reviewMode={reviewMode}
          onClose={exitStudyMode}
          onFlip={flipCard}
          onStar={handleStarClick}
          onNext={nextCard}
          onPrevious={previousCard}
          onRestart={restartStudy}
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