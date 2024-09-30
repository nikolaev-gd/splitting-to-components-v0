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
  const [text, setText] = useState('')
  const [simplified, setSimplified] = useState<string[]>([])
  const [showSimplified, setShowSimplified] = useState(false)
  const [selectedWord, setSelectedWord] = useState('')
  const [savedFlashcards, setSavedFlashcards] = useState<FlashcardType[]>([])
  const [currentFolder, setCurrentFolder] = useState('')
  const [showOriginal, setShowOriginal] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [flashcardToDelete, setFlashcardToDelete] = useState<string | null>(null)
  const [showFlashcards, setShowFlashcards] = useState(false)
  const [showContinueLearning, setShowContinueLearning] = useState(false)
  const [shuffledFlashcards, setShuffledFlashcards] = useState<FlashcardType[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [reviewMode, setReviewMode] = useState<'all' | 'starred'>('all')

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
  }, [showFlashcards, currentCardIndex])

  const handleTextSubmit = (submittedText: string) => {
    if (submittedText.trim() !== '') {
      setSimplified(submittedText.split('\n').filter(paragraph => paragraph.trim() !== ''))
      const firstFourWords = submittedText.split(' ').slice(0, 4).join(' ')
      setCurrentFolder(firstFourWords)
      setText('')
    }
  }

  const handleSimplify = () => {
    setShowSimplified(true)
    setShowOriginal(false)
  }

  const handleWordClick = (word: string) => {
    setSelectedWord(word)
    setDialogOpen(true)
  }

  const handleSaveFlashcard = (flashcard: FlashcardType) => {
    setSavedFlashcards([...savedFlashcards, flashcard])
    setDialogOpen(false)
  }

  const handleDeleteFlashcard = (id: string) => {
    setSavedFlashcards(savedFlashcards.filter(flashcard => flashcard.id !== id))
  }

  const toggleOriginalText = () => {
    setShowOriginal(!showOriginal)
  }

  const handleUpdateFlashcards = (updatedFlashcards: FlashcardType[]) => {
    setSavedFlashcards(updatedFlashcards)
  }

  const handleContinueLearning = () => {
    setShowContinueLearning(true)
    setShowFlashcards(false)
  }

  const reshuffleFlashcards = useCallback((cards: FlashcardType[]) => {
    setShuffledFlashcards(shuffleArray(cards))
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setIsFinished(false)
  }, [])

  const nextCard = () => {
    if (currentCardIndex < shuffledFlashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    } else {
      setIsFinished(true)
    }
  }

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
    }
  }

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
                        onWordClick={handleWordClick}
                        onSaveFlashcard={handleSaveFlashcard}
                        />
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                        onWordClick={handleWordClick}
                        onSaveFlashcard={handleSaveFlashcard}
                        />
                    </p>
                    ))}
              </div>
            </motion.div>
          )}
        </div>

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