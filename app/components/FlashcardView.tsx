// This component is responsible for displaying flashcards to the user in a study mode.
// It shows one flashcard at a time, allows flipping the card to see more information,
// and provides navigation between cards. It also handles the completion of a study session
// and offers options to restart, review difficult terms, or continue learning.

import React from 'react'
import { Button } from "@/components/ui/button"
import { X, Star, ArrowLeft, ArrowRight } from 'lucide-react'
import { Flashcard } from '@/lib/types'
import Image from 'next/image';

// This defines the properties that the FlashcardView component needs to work
interface FlashcardViewProps {
  shuffledFlashcards: Flashcard[]  // The list of flashcards to study
  currentCardIndex: number         // Which card is currently being shown
  isFlipped: boolean               // Whether the card is showing the front or back
  isFinished: boolean              // Whether the study session is complete
  reviewMode: 'all' | 'starred'    // Whether we're reviewing all cards or just starred ones
  onClose: () => void              // Function to close the flashcard view
  onFlip: () => void               // Function to flip the current card
  onStar: (e: React.MouseEvent) => void  // Function to star/unstar a card
  onNext: () => void               // Function to go to the next card
  onPrevious: () => void           // Function to go to the previous card
  onRestart: () => void            // Function to restart the study session
  onReviewToughTerms: () => void   // Function to start reviewing tough terms
  onContinueLearning: () => void   // Function to continue learning
}

export default function FlashcardView({
  shuffledFlashcards,
  currentCardIndex,
  isFlipped,
  isFinished,
  reviewMode,
  onClose,
  onFlip,
  onStar,
  onNext,
  onPrevious,
  onRestart,
  onReviewToughTerms,
  onContinueLearning
}: FlashcardViewProps) {
  // If all flashcards have been reviewed, show the completion screen
  if (isFinished) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">You&apos;ve completed all flashcards!</h2>
        <div className="flex flex-col space-y-4 w-64">
          <Button onClick={onRestart} className="w-full">Restart Flashcards</Button>
          <Button onClick={onReviewToughTerms} className="w-full">Review the Tough Terms</Button>
          <Button onClick={onContinueLearning} className="w-full">Continue Learning</Button>
          <Button onClick={onClose} className="w-full">Return to Article</Button>
        </div>
      </div>
    )
  }

  // Get the current flashcard to display
  const current = shuffledFlashcards[currentCardIndex]

  // Main flashcard view
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header with title and close button */}
      <div className="flex justify-between items-center p-4">
        <h2 className="text-xl font-bold">
          {reviewMode === 'starred' ? 'Reviewing Tough Terms' : 'Flashcards'}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      {/* Flashcard display area */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div 
          className={`w-full max-w-3xl h-[500px] bg-white shadow-lg rounded-lg cursor-pointer transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''} relative`}
          onClick={onFlip}
        >
          {/* Star button to mark difficult cards */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 z-10 ${current.isStarred ? 'text-yellow-500' : 'text-gray-400'}`}
            onClick={onStar}
          >
            <Star className="h-6 w-6" fill={current.isStarred ? 'currentColor' : 'none'} />
            <span className="sr-only">Star card</span>
          </Button>

          <div className="w-full h-full flex flex-col md:flex-row">
            {/* Front of the flashcard */}
            {!isFlipped ? (
              <>
                <div className="flex-grow p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-4">{current.word}</h3>
                  <p>{current.originalSentence}</p>
                </div>
                <div className="md:w-1/3 p-4 flex items-center justify-center md:border-l border-t md:border-t-0">
                  <Image 
                    src={current.illustration} 
                    alt={`Illustration for ${current.word}`} 
                    className="max-w-full max-h-full object-contain"
                    width={500} // Adjust based on your needs
                    height={300} // Adjust based on your needs
                  />
                </div>
              </>
            ) : (
              // Back of the flashcard
              <div className="w-full h-full p-8 flex flex-col justify-center rotate-y-180">
                <h4 className="font-semibold mb-2">Definition:</h4>
                <p className="mb-4">{current.simpleDefinition}</p>
                <h4 className="font-semibold mb-2">Collocations:</h4>
                <ul className="mb-4 list-disc list-inside">
                  {current.collocations.map((collocation, index) => (
                    <li key={index}>{collocation}</li>
                  ))}
                </ul>
                <h4 className="font-semibold mb-2">Examples:</h4>
                <ul className="list-disc list-inside">
                  {current.exampleSentences.map((sentence, index) => (
                    <li key={index}>{sentence}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between p-4">
        <Button onClick={onPrevious} disabled={currentCardIndex === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={onNext}>
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}