// app/components/FlashcardDialog.tsx

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Flashcard } from '@/lib/types'
import Image from 'next/image'

interface FlashcardDialogProps {
  word: string
  sentence: string
  onSave: (flashcard: Flashcard) => void
  children: React.ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function FlashcardDialog({ word, sentence, onSave, children, isOpen, onOpenChange }: FlashcardDialogProps) {
  const [flashcardData, setFlashcardData] = useState<Flashcard | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchFlashcardData()
    }
  }, [isOpen, word, sentence])

  const fetchFlashcardData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/generateFlashcard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetWord: word, initialSentence: sentence })
      })
      const data = await response.json()
      setFlashcardData(data)
    } catch (error) {
      console.error('Error fetching flashcard data:', error)
    }
    setLoading(false)
  }

  const handleSave = () => {
    if (flashcardData) {
      onSave(flashcardData)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Flashcard</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div>Loading...</div>
        ) : flashcardData ? (
          <div className="grid gap-4 py-4">
            <h3 className="text-xl">
              {flashcardData.lexicalItem.split(new RegExp(`(${flashcardData.word})`, 'i')).map((part, index) => (
                <React.Fragment key={index}>
                  {part.toLowerCase() === flashcardData.word.toLowerCase() ? <strong>{part}</strong> : part}
                </React.Fragment>
              ))}
            </h3>
            <p>{flashcardData.originalSentence}</p>
            {flashcardData.illustration && (
              <Image 
                src={flashcardData.illustration} 
                alt={`Illustration for ${flashcardData.word}`}
                width={300}
                height={200}
              />
            )}
            <p><strong>Definition:</strong> {flashcardData.simpleDefinition}</p>
            {flashcardData.collocations && flashcardData.collocations.length > 0 && (
              <div>
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
        ) : (
          <div>Error loading flashcard data</div>
        )}
        <DialogFooter>
          <Button onClick={handleSave} disabled={!flashcardData}>Save Flashcard</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}