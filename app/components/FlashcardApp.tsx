// This is the main component of our flashcard learning application.
// It manages the overall state and flow of the app, including:
// - Displaying and interacting with text
// - Creating and managing flashcards
// - Providing a study mode for reviewing flashcards
// - Offering additional learning options
// This component brings together all the other parts of the app to create a complete learning experience.

"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "./ui/button"
import TextInput from './TextInput'
import InteractiveText from './InteractiveText'
import Flashcard from './Flashcard'
import FlashcardView from './FlashcardView'
import ContinueLearning from './ContinueLearning'
import { motion, AnimatePresence } from 'framer-motion'
import { Flashcard as FlashcardType } from '@/lib/types'
import { shuffleArray } from '@/lib/utils'

export default function FlashcardApp() {
  // State variables to manage different aspects of the app
  const [simplified, setSimplified] = useState<string[]>([])  // Simplified version of the text
  const [showSimplified, setShowSimplified] = useState(false)  // Whether to show simplified text
  const [savedFlashcards, setSavedFlashcards] = useState<FlashcardType[]>([])  // User's saved flashcards
  const [showOriginal, setShowOriginal] = useState(true)  // Whether to show original text
  const [showFlashcards, setShowFlashcards] = useState(false)  // Whether to show flashcard study mode
  const [showContinueLearning, setShowContinueLearning] = useState(false)  // Whether to show continue learning screen
  const [shuffledFlashcards, setShuffledFlashcards] = useState<FlashcardType[]>([])  // Shuffled flashcards for study
  const [currentCardIndex, setCurrentCardIndex] = useState(0)  // Current flashcard index in study mode
  const [isFlipped, setIsFlipped] = useState(false)  // Whether the current flashcard is flipped
  const [isFinished, setIsFinished] = useState(false)  // Whether the study session is finished
  const [reviewMode, setReviewMode] = useState<'all' | 'starred'>('all')  // Current review mode

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

  // The main render function, returning the UI of the app
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto p-4">
        {/* Render buttons for simplifying text and toggling original/simplified view */}
        {simplified.length > 0 && (
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Title from ChatGPT</h2>
            {!showSimplified ? (
              <Button onClick={handleSimplify}>Simplify Text</Button>
            ) : (
              <Button 
                onClick={toggleOriginalText} 
                aria-expanded={showOriginal}
                aria-controls="original-text"
              >
                {showOriginal ? 'Hide Original Text' : 'Show Original Text'}
              </Button>
            )}
          </div>
        )}

        <div className="relative">
          {/* Render original text with animation */}
          <AnimatePresence>
            {showOriginal && simplified.length > 0 && (
              <motion.div
                initial={{ height: 'auto', opacity: 1 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden"
              >
                <div className="border p-4 mb-4">
                  {simplified.map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      <InteractiveText 
                        text={paragraph} 
                        onWordClick={() => {}}
                        onSaveFlashcard={handleSaveFlashcard}
                      />
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Render simplified text with animation */}
          {showSimplified && simplified.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="border p-4 mb-4">
                <h2 className="text-xl font-bold mb-2">Simplified Text</h2>
                {simplified.map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                    <InteractiveText 
                      text={paragraph} 
                      onWordClick={() => {}}
                      onSaveFlashcard={handleSaveFlashcard}
                    />
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Render saved flashcards and study button */}
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

      {/* Render text input component */}
      <TextInput onSubmit={handleTextSubmit} />

      {/* Render flashcard study view when active */}
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

      {/* Render continue learning screen when active */}
      {showContinueLearning && (
        <ContinueLearning onClose={() => setShowContinueLearning(false)} />
      )}
    </div>
  )
}