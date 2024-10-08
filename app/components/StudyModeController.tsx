// app/components/StudyModeController.tsx

import React, { useState } from 'react'
import { Button } from "./ui/button"
import { X, Star, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { Flashcard } from '@/lib/types'
import Image from 'next/image'

interface StudyModeControllerProps {
  flashcards: Flashcard[]
  currentIndex: number
  isFlipped: boolean
  isFinished: boolean
  reviewMode: 'all' | 'starred'
  onClose: () => void
  onFlip: () => void
  onStar: (e: React.MouseEvent) => void
  onNext: () => void
  onPrevious: () => void
  onRestart: () => void
  onReviewToughTerms: () => void
  onContinueLearning: () => Promise<void>
}

export default function StudyModeController({
    flashcards,
    currentIndex,
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
  }: StudyModeControllerProps) {
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  const handleContinueLearning = async () => {
    setIsGeneratingStory(true);
    try {
      await onContinueLearning();
    } catch (error) {
      console.error('Error in handleContinueLearning:', error);
      alert('Failed to generate story. Please try again.');
    } finally {
      setIsGeneratingStory(false);
    }
  };

  if (isFinished) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">You've completed all flashcards!</h2>
        <div className="flex flex-col space-y-4 w-64">
          <Button onClick={onRestart} className="w-full">Restart Flashcards</Button>
          <Button onClick={onReviewToughTerms} className="w-full">Review the Tough Terms</Button>
          <Button onClick={handleContinueLearning} className="w-full" disabled={isGeneratingStory}>
            {isGeneratingStory ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Story...
              </>
            ) : (
              'Continue Learning'
            )}
          </Button>
          <Button onClick={onClose} className="w-full">Return to Article</Button>
        </div>
      </div>
    )
  }
  
  const current = flashcards[currentIndex]
  
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-xl font-bold">
          {reviewMode === 'starred' ? 'Reviewing Tough Terms' : 'Flashcards'}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
  
      <div className="flex-grow flex items-center justify-center p-4">
        <div 
          className={`w-full max-w-3xl bg-white shadow-lg rounded-lg cursor-pointer transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''} relative overflow-hidden`}
          onClick={onFlip}
        >
          {/* Move the Image component to the top */}
          <div className="w-full h-48 relative">
            <Image 
              src={current.illustration} 
              alt={`Illustration for ${current.word}`} 
              fill // Replaced layout="fill" with fill attribute
              objectFit="cover"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 z-10 ${current.isStarred ? 'text-yellow-500' : 'text-gray-400'}`}
            onClick={onStar}
            data-id={current.id}
          >
            <Star className="h-6 w-6" fill={current.isStarred ? 'currentColor' : 'none'} />
            <span className="sr-only">Star card</span>
          </Button>

          <div className="w-full flex flex-col">
            {!isFlipped ? (
              <div className="p-8 flex flex-col justify-center">
                <h3 className="text-2xl mb-4">
                  {current.lexicalItem.split(new RegExp(`(${current.word})`, 'i')).map((part, index) => (
                    <React.Fragment key={index}>
                      {part.toLowerCase() === current.word.toLowerCase() ? <strong>{part}</strong> : part}
                    </React.Fragment>
                  ))}
                </h3>
                <p className="mb-4"><strong>Original Sentence:</strong> {current.originalSentence}</p>
              </div>
            ) : (
              <div className="w-full h-full p-8 flex flex-col justify-center rotate-y-180">
                <h4 className="font-semibold mb-2">Definition:</h4>
                <p className="mb-4">{current.simpleDefinition}</p>
                <h4 className="font-semibold mb-2">Collocations:</h4>
                <ul className="mb-4 list-disc list-inside">
                  {current.collocations.map((collocation: string, index: number) => (
                    <li key={index}>{collocation}</li>
                  ))}
                </ul>                  
                <h4 className="font-semibold mb-2">Context Sentence:</h4>
                <p>{current.contextSentence}</p>
              </div>
            )}
          </div>
        </div>
      </div>
  
      <div className="flex justify-between p-4">
        <Button onClick={onPrevious} disabled={currentIndex === 0}>
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