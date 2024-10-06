// app/components/FlashcardApp.tsx

"use client"
import React, { useState } from 'react'
import { Button } from "./ui/button"
import TextInput from './TextInput'
import TextDisplay from './TextDisplay'
import FlashcardList from './FlashcardList'
import StudyModeController from './StudyModeController'
import ContinueLearning from './ContinueLearning'
import Sidebar from './Sidebar'
import { FlashcardProvider, useFlashcardContext } from '../contexts/FlashcardContext'
import { useTextDisplay } from '../hooks/useTextDisplay'
import { useStudyMode } from '../hooks/useStudyMode'
import { Menu } from 'lucide-react'

export default function FlashcardApp() {
  const {
    originalText,
    simplifiedText,
    showSimplified,
    showOriginal,
    handleTextSubmit,
    handleSimplify,
    toggleOriginalText,
    isSimplifying,
    error,
    hasText,
  } = useTextDisplay();

  const [showContinueLearning, setShowContinueLearning] = React.useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <FlashcardProvider>
      <FlashcardAppContent 
        originalText={originalText}
        simplifiedText={simplifiedText}
        showSimplified={showSimplified}
        showOriginal={showOriginal}
        handleTextSubmit={handleTextSubmit}
        handleSimplify={handleSimplify}
        toggleOriginalText={toggleOriginalText}
        showContinueLearning={showContinueLearning}
        setShowContinueLearning={setShowContinueLearning}
        isSimplifying={isSimplifying}
        error={error}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        hasText={hasText}
      />
    </FlashcardProvider>
  )
}

interface FlashcardAppContentProps {
  originalText: string[];
  simplifiedText: string[];
  showSimplified: boolean;
  showOriginal: boolean;
  handleTextSubmit: (text: string) => void;
  handleSimplify: () => void;
  toggleOriginalText: () => void;
  showContinueLearning: boolean;
  setShowContinueLearning: React.Dispatch<React.SetStateAction<boolean>>;
  isSimplifying: boolean;
  error: string | null;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hasText: boolean;
}

function FlashcardAppContent({
  originalText,
  simplifiedText,
  showSimplified,
  showOriginal,
  handleTextSubmit,
  handleSimplify,
  toggleOriginalText,
  showContinueLearning,
  setShowContinueLearning,
  isSimplifying,
  error,
  isSidebarOpen,
  setIsSidebarOpen,
  hasText,
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
    storyTitle,
    storyContent,
    generateStory,
  } = useStudyMode();

  const handleContinueLearning = async () => {
    await generateStory();
    setShowContinueLearning(true);
    exitStudyMode();
  }

  return (
    <div className={`flex flex-col h-screen ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <header className="flex items-center justify-between p-4 bg-white shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-center flex-grow">EngLearner</h1>
        <div className="w-10" />
      </header>

      <div className="flex-grow overflow-auto p-4 main-content">
        <TextDisplay
          originalText={originalText}
          simplifiedText={simplifiedText}
          showSimplified={showSimplified}
          showOriginal={showOriginal}
          isSimplifying={isSimplifying}
          error={error}
          onSimplify={handleSimplify}
          onToggleOriginal={toggleOriginalText}
          hasText={hasText}
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

      {showContinueLearning && storyTitle && storyContent && (
        <ContinueLearning 
          onClose={() => setShowContinueLearning(false)}
          title={storyTitle}
          story={storyContent}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  )
}