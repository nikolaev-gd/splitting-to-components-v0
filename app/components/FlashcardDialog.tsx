import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Flashcard } from '@/lib/types'
import Image from 'next/image'
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface FlashcardDialogProps {
  word: string
  sentence: string
  onSave: (flashcard: Flashcard) => void
  children: React.ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const DEBOUNCE_DELAY = 1000; // 1 second

export default function FlashcardDialog({ word, sentence, onSave, children, isOpen, onOpenChange }: FlashcardDialogProps) {
  const [flashcardData, setFlashcardData] = useState<Flashcard | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFlashcardData = useCallback(async (targetWord: string, initialSentence: string) => {
    console.log('Sending data to server:', { targetWord, initialSentence });
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generateFlashcard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetWord, initialSentence }),
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data from API:', data);

      if (!data.word) {
        throw new Error('Invalid flashcard data received');
      }

      setFlashcardData(data);
    } catch (error) {
      console.error('Error fetching flashcard data:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('FlashcardDialog effect triggered. isOpen:', isOpen);
    if (isOpen) {
      const timer = setTimeout(() => {
        console.log('Fetching flashcard data for:', word, sentence);
        fetchFlashcardData(word, sentence);
      }, DEBOUNCE_DELAY);
      return () => clearTimeout(timer);
    } else {
      setFlashcardData(null);
      setError(null);
      setLoading(false);
    }
  }, [isOpen, word, sentence, fetchFlashcardData]);

  const handleSave = useCallback(() => {
    if (flashcardData) {
      onSave(flashcardData)
      onOpenChange(false)
    }
  }, [flashcardData, onSave, onOpenChange]);

  const renderFlashcardContent = useMemo(() => {
    if (loading) {
      return <p className="p-6">Loading flashcard data...</p>;
    }

    if (error) {
      return <p className="p-6 text-red-500">Error: {error}</p>;
    }

    if (!flashcardData || !flashcardData.lexicalItem) {
      return <p className="p-6">No flashcard data available</p>
    }

    return (
      <div className="p-6">
        <h3 className="text-xl font-bold mb-4">
          {flashcardData.lexicalItem.split(new RegExp(`(${flashcardData.word})`, 'i')).map((part, index) => (
            <React.Fragment key={index}>
              {part.toLowerCase() === flashcardData.word.toLowerCase() ? <strong className="bg-yellow-200">{part}</strong> : part}
            </React.Fragment>
          ))}
        </h3>
        <p className="mb-4"><strong>Original Sentence:</strong> {flashcardData.originalSentence}</p>
        <p className="mb-4"><strong>Definition:</strong> {flashcardData.simpleDefinition}</p>
        {flashcardData.collocations && flashcardData.collocations.length > 0 && (
          <div className="mb-4">
            <p><strong>Collocations:</strong></p>
            <ul className="list-disc list-inside">
              {flashcardData.collocations.map((collocation, index) => (
                <li key={index}>{collocation}</li>
              ))}
            </ul>
          </div>
        )}
        <p><strong>Context Sentence:</strong> {flashcardData.contextSentence}</p>
      </div>
    )
  }, [loading, error, flashcardData]);

  console.log('Rendering FlashcardDialog. flashcardData:', flashcardData, 'error:', error, 'loading:', loading);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Flashcard Details</DialogTitle>
        </VisuallyHidden>
        <DialogDescription className="sr-only">
          Details of the flashcard for the selected word
        </DialogDescription>
        <div className="overflow-y-auto max-h-[85vh]">
          {flashcardData && flashcardData.illustration && (
            <div className="w-full h-48 relative">
              <Image 
                src={flashcardData.illustration} 
                alt={`Illustration for ${flashcardData.word}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
          {renderFlashcardContent}
        </div>
        <DialogFooter className="p-6 pt-0">
          <Button onClick={handleSave} disabled={!flashcardData || loading}>Save Flashcard</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}