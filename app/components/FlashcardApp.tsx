// app/components/FlashcardApp.tsx

"use client"
import React from 'react'
import { Button } from "./ui/button"
import TextInput from './TextInput'
import TextDisplay from './TextDisplay'
import FlashcardList from './FlashcardList'
import StudyModeController from './StudyModeController'
import ContinueLearning from './ContinueLearning'
import { FlashcardProvider, useFlashcardContext } from '../contexts/FlashcardContext'
import { useTextDisplay } from '../hooks/useTextDisplay'
import { useStudyMode } from '../hooks/useStudyMode'

export default function FlashcardApp() {
  const {
    simplified,
    showSimplified,
    showOriginal,
    handleTextSubmit,
    handleSimplify,
    toggleOriginalText,
  } = useTextDisplay();

  const [showContinueLearning, setShowContinueLearning] = React.useState(false)

  return (
    <FlashcardProvider>
      <FlashcardAppContent 
        simplified={simplified}
        showSimplified={showSimplified}
        showOriginal={showOriginal}
        handleTextSubmit={handleTextSubmit}
        handleSimplify={handleSimplify}
        toggleOriginalText={toggleOriginalText}
        showContinueLearning={showContinueLearning}
        setShowContinueLearning={setShowContinueLearning}
      />
    </FlashcardProvider>
  )
}

interface FlashcardAppContentProps {
  simplified: string[];
  showSimplified: boolean;
  showOriginal: boolean;
  handleTextSubmit: (text: string) => void;
  handleSimplify: () => void;
  toggleOriginalText: () => void;
  showContinueLearning: boolean;
  setShowContinueLearning: React.Dispatch<React.SetStateAction<boolean>>;
}

function FlashcardAppContent({
  simplified,
  showSimplified,
  showOriginal,
  handleTextSubmit,
  handleSimplify,
  toggleOriginalText,
  showContinueLearning,
  setShowContinueLearning
}: FlashcardAppContentProps) {
  const { savedFlashcards } = useFlashcardContext();
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
  } = useStudyMode();

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
        />

        {savedFlashcards.length > 0 && (
          <Button 
            variant="outline" 
            onClick={startStudyMode}
            className="mt-4 mb-4"
          >
            Learn Saved Flashcards
          </Button>
        )}

        <FlashcardList />

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